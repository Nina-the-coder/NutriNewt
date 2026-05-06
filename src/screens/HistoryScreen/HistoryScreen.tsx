import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import HistoryItem from "./components/HistoryItem";
import WeeklyCard from "./components/WeeklyCard";
import StreakBadge from "../../sharedComponents/StreakBadge";
import { SafeAreaView } from "react-native-safe-area-context";
import HorizontalDivider from "../../sharedComponents/HorizontalDivider";
import { useNavigation } from "@react-navigation/native";
import { useNutritionAnalytics } from "../../context/NutritionAnalyticsContext";
import { useTheme } from "../../context/ThemeContext";
import { useLogs } from "../../context/LogsContext";

const HistoryScreen = () => {
  console.log("History screen rendered");

  const { colors } = useTheme();
  const { dailyLogs } = useLogs();
  const { averageCalories, averageProtein, onTrackDays } =
    useNutritionAnalytics();
  const navigation = useNavigation<any>();

  /* =========================
     📊 SORT LOGS
  ========================= */

  const sortedLogs = useMemo(() => {
    return [...dailyLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [dailyLogs]);

  /* =========================
     📅 DATE FORMAT
  ========================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  /* =========================
     🖥️ UI
  ========================= */

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.logoRow}>
          <Text style={[styles.title, { color: colors.primary }]}>History</Text>
          <StreakBadge />
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* WEEKLY CARD (FROM CONTEXT 🔥) */}
            <WeeklyCard
              avgCalories={averageCalories}
              avgProtein={averageProtein}
              onTrackDays={onTrackDays}
            />

            <HorizontalDivider style={{ marginVertical: 20 }} />
          </>
        }
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            formatDate={formatDate}
            onPress={() => {
              navigation.navigate("DayDetails", {
                log: item,
              });
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {" "}
      </FlatList>
    </SafeAreaView>
  );
};

export default React.memo(HistoryScreen);

/* =========================
   🎨 STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 26,
    paddingTop: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  titleDate: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "300",
  },
});
