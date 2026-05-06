import React, { use } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsModal from "../../sharedComponents/SettingsModal";
import { useTheme } from "../../context/ThemeContext";
import { useProfile } from "../../context/ProfileContext";
import { useGoals } from "../../context/GoalsContext";

const ProfileScreen = React.memo(({ navigation }: any) => {
  console.log("Profile screen rendered");

  const { profile } = useProfile(); // ✅ get profile from context
  const { goals } = useGoals(); // ✅ get goals from context
  const { colors } = useTheme();

  const getGoalColor = () => {
    if (!profile) return colors.primary;

    switch (profile.goalType) {
      case "gain":
        return "#2ecc71";
      case "lose":
        return "#e74c3c";
      case "maintain":
        return "#f39c12";
      default:
        return colors.primary;
    }
  };

  if (!profile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.emptyContainer}>
          <SettingsModal />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No Profile Found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Set up your profile to calculate your macro goals.
          </Text>

          <TouchableOpacity
            style={[styles.primaryButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate("MacroCalculator")}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              Setup Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={[styles.title, { color: colors.primary }]}>Profile</Text>
          <SettingsModal />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.profileRow}>
            <View>
              <Text style={[styles.profileMain, { color: colors.textPrimary }]}>
                {profile.gender === "male" ? "Male" : "Female"}
              </Text>
              <Text
                style={[styles.profileSub, { color: colors.textSecondary }]}
              >
                {profile.age} yrs • {profile.height} cm • {profile.weight} kg
              </Text>
            </View>

            <View
              style={[styles.goalBadge, { backgroundColor: getGoalColor() }]}
            >
              <Text style={styles.goalText}>
                {profile.goalType.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Daily Targets
          </Text>

          <View style={styles.macroGrid}>
            <MacroCard value={goals.calories} label="Calories" />
            <MacroCard value={`${goals.protein}g`} label="Protein" />
            <MacroCard value={`${goals.carbs}g`} label="Carbs" />
            <MacroCard value={`${goals.fats}g`} label="Fats" />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate("MacroCalculator")}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
});

/* ================= MACRO CARD ================= */

const MacroCard = ({ value, label }: any) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.macroCard, { backgroundColor: colors.background }]}>
      <Text style={[styles.macroValue, { color: colors.primary }]}>
        {value}
      </Text>
      <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

export default ProfileScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 60,
  },

  scrollContent: {
    paddingBottom: 200,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    paddingTop: 10,
    marginBottom: 15,
  },

  card: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 26,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileMain: {
    fontSize: 20,
    fontWeight: "600",
  },

  profileSub: {
    fontSize: 14,
    marginTop: 6,
  },

  goalBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  goalText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 18,
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  macroCard: {
    width: "48%",
    borderRadius: 18,
    paddingVertical: 24,
    marginBottom: 16,
    alignItems: "center",
  },

  macroValue: {
    fontSize: 24,
    fontWeight: "700",
  },

  macroLabel: {
    marginTop: 6,
    fontSize: 13,
  },

  primaryButton: {
    borderWidth: 2,
    padding: 18,
    borderRadius: 20,
    marginHorizontal: 22,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
});
