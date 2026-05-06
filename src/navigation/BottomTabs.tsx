import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import MacroCalculatorScreen from "../screens/ProfileScreen/MacroCalculatorScreen";
import DayDetailsScreen from "../screens/HistoryScreen/components/DayDetailsScreen";
import { useTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HistoryWrapper from "../screens/HistoryScreen/HistoryWrapper";
import ProfileWrapper from "../screens/ProfileScreen/ProfileWrapper";
import InventoryWrapper from "../screens/Inventory/InventoryWrapper";
import HomeWrapper from "../screens/HomeScreen/HomeWrapper";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen/HistoryScreen";
import InventoryScreen from "../screens/Inventory/InventoryScreen";

/* =========================
   Profile Stack
========================= */

const ProfileStackNav = createNativeStackNavigator();

const ProfileStack = React.memo(function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStackNav.Screen
        name="MacroCalculator"
        component={MacroCalculatorScreen}
      />
    </ProfileStackNav.Navigator>
  );
});

/* =========================
   Custom Tab Bar 🔥
========================= */

const CustomTabBar = React.memo(({ state, navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: colors.card,
          bottom: -48 + insets.bottom,
          // paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        let iconName: any;

        if (route.name === "Inventory") iconName = "cube";
        else if (route.name === "Home") iconName = "home";
        else if (route.name === "Profile") iconName = "person";
        else if (route.name === "History") iconName = "stats-chart";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? iconName : `${iconName}-outline`}
              size={22}
              color={isFocused ? colors.primary : colors.textSecondary}
            />

            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.primary : colors.textSecondary,
                  fontWeight: isFocused ? "500" : "400",
                },
              ]}
            >
              {route.name}
            </Text>

            {/* 🔥 Minimal Indicator */}
            {isFocused && (
              <View
                style={[styles.activeDot, { backgroundColor: colors.primary }]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

/* =========================
   Bottom Tabs
========================= */

const Tab = createMaterialTopTabNavigator();

const BottomTabs = React.memo(function BottomTabs() {
  console.log("BottomTabs rendered");

  const renderTabBar = React.useCallback(
    (props: any) => <CustomTabBar {...props} />,
    [],
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarPosition="bottom"
      tabBar={renderTabBar}
      screenOptions={{ swipeEnabled: true }}
    >
      <Tab.Screen options={{lazy: true}} name="Home" component={HomeScreen} />
      <Tab.Screen options={{lazy: true}} name="History" component={HistoryScreen} />
      <Tab.Screen options={{lazy: true}} name="Inventory" component={InventoryScreen} />
      <Tab.Screen options={{lazy: true}} name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
});

/* =========================
   Root Stack
========================= */

const RootStack = createNativeStackNavigator();

export default React.memo(function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={BottomTabs} />
      <RootStack.Screen name="DayDetails" component={DayDetailsScreen} />
    </RootStack.Navigator>
  );
});

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    // height: 72,
    borderRadius: 18,
    paddingTop: 12,
    paddingBottom: 56,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    // subtle shadow (premium feel)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  tabLabel: {
    fontSize: 11,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
