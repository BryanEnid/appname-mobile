import React, { Component } from "react";

import { Image, Button, Alert, TextInput, View, SafeAreaView } from "react-native";

import { Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

// Components
import Text from "../../../components/text";

export default function ({ navigation }) {
  const { colors } = useTheme();

  return (
    <Container>
      <Text style={{ fontSize: 30 }}>Set your profile photo</Text>

      <Text medium>Users will use this photo to identify you. Show your face without wearing a hat or sunglasses in a well lit area.</Text>

      <Image source={require("../../../assets/submitProfilePhoto.png")} style={{ borderRadius: 1000, width: 240, height: 240 }} />

      <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: "white", borderColor: colors.primary }}>
        <Text>Upload Photo</Text>
      </ButtonStyled>
      <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
        <Text style={{ color: "white" }}>Take Photo</Text>
      </ButtonStyled>
    </Container>
  );
}

const Container = styled.View`
  background: white;
  flex: 1;
  padding: 7%;
  align-items: center;
  justify-content: space-evenly;
`;

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
  width: 80%;
  border-radius: 6px;
  border: 1px solid;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;
