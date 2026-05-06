import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import BottomTabs from "./BottomTabs";

export default function AppNavigator() {
  return (
    // <View style={{ paddingBottom: 200 }}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    // </View>
  );
}
