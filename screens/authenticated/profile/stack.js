// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const ProfileStack = createStackNavigator();

// import pages
import ProfileScreen from ".";

export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Help Center" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}
