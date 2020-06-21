import React, { useContext } from "react";
import { Text, Image, Alert } from "react-native";
import styled from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

// Screens
import { RootScreen } from "./index";
import { SignInScreen } from "../signIn";
import { SignInScreen2 } from "../signIn/2";
import { SignUpScreen } from "../signUp"
import { SignUpContractorsScreen } from "../signUp/contractors/"
import { SignUpContractorScreen2 } from "../signUp/contractors/2"

export function NotAuthenticatedStackScreen({ navigation }) {
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="Root" component={RootScreen} />

      {/* Sign In */}
      <RootStack.Screen name="SignIn" component={SignInScreen} />
      <RootStack.Screen name="SignIn2" component={SignInScreen2} />

      <RootStack.Screen name="SignUp" component={SignUpScreen} />
      <RootStack.Screen name="SignUpContractor" component={SignUpContractorsScreen} />
      <RootStack.Screen name="SignUpContractor2" component={SignUpContractorScreen2} />

      {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
    </RootStack.Navigator>
  );
}
