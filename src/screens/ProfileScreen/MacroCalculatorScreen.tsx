import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useProfile } from "../../context/ProfileContext";
import { useGoals } from "../../context/GoalsContext";

export default function MacroCalculatorScreen({ navigation }: any) {
  const { profile, setProfile } = useProfile();
  const { setGoals } = useGoals();
  const { colors } = useTheme();

  const [age, setAge] = useState(profile?.age ?? 20);
  const [gender, setGender] = useState<"male" | "female">(
    profile?.gender ?? "male",
  );
  const [height, setHeight] = useState(profile?.height ?? 170);
  const [weight, setWeight] = useState(profile?.weight ?? 70);
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "very" | "athlete"
  >(profile?.activityLevel ?? "moderate");
  const [goalType, setGoalType] = useState<"lose" | "maintain" | "gain">(
    profile?.goalType ?? "maintain",
  );

  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  useEffect(() => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      athlete: 1.9,
    };

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    let tdee = bmr * activityMultipliers[activityLevel];

    if (goalType === "lose") tdee -= 300;
    if (goalType === "gain") tdee += 250;

    const targetCalories = Math.round(tdee);

    let proteinPerKg;
    if (goalType === "lose") proteinPerKg = 1.8;
    else if (goalType === "gain") proteinPerKg = 1.4;
    else proteinPerKg = 1.3;

    const calcProtein = Math.round(weight * proteinPerKg);
    const calcFats = Math.round(weight * 0.7);

    const remainingCalories = targetCalories - calcProtein * 4 - calcFats * 9;

    const calcCarbs = Math.max(0, Math.round(remainingCalories / 4));

    setCalories(targetCalories);
    setProtein(calcProtein);
    setFats(calcFats);
    setCarbs(calcCarbs);
  }, [age, gender, height, weight, activityLevel, goalType]);

  const handleSave = () => {
    setProfile({
      age,
      gender,
      height,
      weight,
      activityLevel,
      goalType,
    });

    setGoals({
      calories,
      protein,
      carbs,
      fats,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={[styles.backCircle, { backgroundColor: colors.card }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backArrow, { color: colors.textPrimary }]}>
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.primary }]}>
              Macro Calculator
            </Text>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Gender
              </Text>
              <View style={[styles.selectionRow, { marginBottom: 20 }]}>
                {["male", "female"].map((g) => (
                  <SelectionButton
                    key={g}
                    label={g}
                    selected={gender === g}
                    onPress={() => setGender(g as any)}
                  />
                ))}
              </View>

              <InputField label="Age" value={age} onChange={setAge} />
              <InputField
                label="Height"
                value={height}
                onChange={setHeight}
                suffix="cm"
              />
              <InputField
                label="Weight"
                value={weight}
                onChange={setWeight}
                suffix="kg"
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Activity Level
              </Text>
              <View style={styles.selectionRow}>
                {["sedentary", "light", "moderate", "very", "athlete"].map(
                  (level) => (
                    <SelectionButton
                      key={level}
                      label={level}
                      selected={activityLevel === level}
                      onPress={() => setActivityLevel(level as any)}
                    />
                  ),
                )}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Goal
              </Text>
              <View style={styles.selectionRow}>
                {["lose", "maintain", "gain"].map((goal) => (
                  <SelectionButton
                    key={goal}
                    label={goal}
                    selected={goalType === goal}
                    onPress={() => setGoalType(goal as any)}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <MacroSlider
                label="Calories"
                value={calories}
                min={1200}
                max={4500}
                step={50}
                onChange={setCalories}
              />
              <MacroSlider
                label="Protein"
                value={protein}
                min={50}
                max={300}
                step={5}
                onChange={setProtein}
              />
              <MacroSlider
                label="Carbs"
                value={carbs}
                min={50}
                max={500}
                step={5}
                onChange={setCarbs}
              />
              <MacroSlider
                label="Fats"
                value={fats}
                min={20}
                max={150}
                step={1}
                onChange={setFats}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { borderColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= MACRO SLIDER ================= */

const MacroSlider = ({ label, value, min, max, step, onChange }: any) => {
  const { colors } = useTheme();

  return (
    <View style={styles.sliderContainer}>
      <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
        {label}: {value}
      </Text>

      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.textSecondary}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

const InputField = ({ label, value, onChange, suffix }: any) => {
  const { colors } = useTheme();

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(v) => onChange(Number(v))}
        />
        {suffix && (
          <Text style={[styles.suffix, { color: colors.textSecondary }]}>
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
};

const SelectionButton = ({ label, selected, onPress }: any) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.selectionButton,
        { backgroundColor: colors.background },
        selected && { backgroundColor: colors.primary },
      ]}
    >
      <Text
        style={[
          styles.selectionText,
          { color: colors.textSecondary },
          selected && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

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

  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  backArrow: {
    fontSize: 22,
    marginTop: -2,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    paddingTop: 10,
    marginBottom: 15,
  },

  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 26,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 14,
  },

  inputContainer: {
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  input: {
    flex: 1,
    fontSize: 17,
  },

  suffix: {
    fontSize: 14,
  },

  selectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  selectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  selectionText: {
    fontSize: 13,
    textTransform: "capitalize",
  },

  sliderContainer: {
    marginBottom: 24,
  },

  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
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
});
