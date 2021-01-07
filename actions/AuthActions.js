// Dependencies
import { useMemo } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import PermissionsControllers from "../controllers/PermissionsControllers";
import env from "../env";

function handleError(e) {
  console.log(e);
  // dispatch({ type: "ERROR", errorMsg: e.message });
}

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      signIn: async (foundUser) => {
        try {
          const userToken = foundUser[0].userToken;
          const userID = foundUser[0].userName;
          const response = await fetch(`${env.API_URL}/users/${userID}`, {
            method: "GET",
            headers: {
              Authorization: `bearer ${userToken}`,
            },
          });

          const profile = await response.json();

          const userData = {
            userToken,
            userID,
            profile,
          };

          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          // Trigger push notification subscription by getting token and pushing to server
          await PermissionsControllers.registerForPushNotificationsAsync(userToken);

          dispatch({ type: "LOGIN", id: userID, token: userToken, profile: profile });
        } catch (e) {
          handleError(e);
        }
      },

      signOut: async (userToken) => {
        try {
          await AsyncStorage.getItem("app.token").then(async (token) => {
            if (token) {
              try {
                const response = await fetch(`${env.API_URL}/notification/setup`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `bearer ${userToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token }),
                });
                if (!response.ok) {
                  return Promise.reject({ message: (await response.json()).message || "Failed to remove device", code: "Network Error" });
                }

                await AsyncStorage.removeItem(`app.token`, token);
                await AsyncStorage.removeItem("userData");
              } catch (e) {
                console.error(e);
                if (e.code === "Network Error") {
                  // Notification not properly disconnected...Prevent signout!
                  return;
                }
              }
            }
          });
        } catch (e) {
          handleError(e);
        }
        dispatch({ type: "LOGOUT" });
        return true;
      },

      changeRole: async (prevData, newRole) => {
        // Update role in back end database
        const { success } = await fetch(`${env.API_URL}/users/change_role`, {
          method: "PUT",
          body: JSON.stringify({ phone_number: prevData.userData.phone_number, role: newRole }),
        });

        console.log(success);

        if (success) {
          // Update role in app global store
          dispatch({ type: "CHANGE_ROLE", newRole });

          // Update role in local storage
          await AsyncStorage.setItem("userData", JSON.stringify({ ...prevData, userData: { ...prevData.userData, role: newRole } }));
        }
      },
    }),
    []
  );
};

exports.retrieve_user_info = async ({ dispatch }) => {
  try {
    const data = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(data);

    if (userData) {
      const response = await fetch(`${env.API_URL}/users/${userData?.userID}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${userData?.userToken}`,
        },
      });

      userData.profile = await response.json();

      // Trigger push notification subscription by getting token and pushing to server
      await PermissionsControllers.registerForPushNotificationsAsync(userData?.userToken);
      dispatch({ type: "RETRIEVE_TOKEN", token: userData?.userToken, id: userData?.userID, profile: userData?.profile });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  } catch (e) {
    dispatch({ type: "LOGOUT" });
    handleError(e);
  }
};
