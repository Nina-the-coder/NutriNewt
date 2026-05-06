import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { triggerFeedback } from "../utils/feedback";
import BackBtn from "./BackBtn";
import { useTheme } from "../context/ThemeContext";
import { useInventory } from "../context/InventoryContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;

  initialData?: any;
  mode?: "create" | "edit";
}

export default function AddFoodToInventoryModal({
  visible,
  onClose,
  onSuccess,
  initialData,
  mode = "create",
}: Props) {
  const { addInventoryItem, updateInventoryItem } = useInventory();
  const { colors } = useTheme();

  /* ================= STATE ================= */

  const [name, setName] = useState("");
  const [baseQuantity, setBaseQuantity] = useState("100");
  const [unit, setUnit] = useState<"g" | "ml" | "pcs">("g");

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBaseQuantity(String(initialData.baseQuantity));
      setUnit(initialData.unit);
      setCalories(String(initialData.calories));
      setProtein(String(initialData.protein));
      setCarbs(String(initialData.carbs));
      setFats(String(initialData.fats));
    } else {
      reset();
    }
  }, [initialData]);

  /* ================= RESET ================= */

  const reset = () => {
    setName("");
    setBaseQuantity("100");
    setUnit("g");
    setCalories("0");
    setProtein("0");
    setCarbs("0");
    setFats("0");
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    if (!name.trim()) {
      triggerFeedback({ message: "At least name it >_<" });
      return;
    }

    if (
      Number(calories) <= 0 ||
      Number(protein) <= 0 ||
      Number(carbs) < 0 ||
      Number(fats) < 0
    ) {
      triggerFeedback({ message: "please enter correct Macros >_<" });
      return;
    }

    const item = {
      id: mode === "edit" ? initialData.id : uuid.v4().toString(),
      name: name.trim(),
      baseQuantity: Number(baseQuantity) || 100,
      unit,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      createdAt: mode === "edit" ? initialData.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (mode === "edit") {
      updateInventoryItem(item);
    } else {
      addInventoryItem(item);
    }

    if (onSuccess) onSuccess(item);

    reset();
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <BackBtn onClose={onClose} />
          <Text style={[styles.title, { color: colors.primary }]}>
            {mode === "edit" ? "Edit Food" : "Add Food"}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Food Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Paneer"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Base Quantity
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            ]}
            value={baseQuantity}
            onChangeText={setBaseQuantity}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Unit
          </Text>
          <View style={styles.unitRow}>
            {(["g", "ml", "pcs"] as const).map((u) => (
              <TouchableOpacity
                key={u}
                style={[
                  styles.unitBtn,
                  { backgroundColor: colors.card },
                  unit === u && { backgroundColor: colors.primary },
                ]}
                onPress={() => {
                  setUnit(u);
                  if (u === "pcs") setBaseQuantity("1");
                }}
              >
                <Text
                  style={{
                    color: unit === u ? "#fff" : colors.textPrimary,
                  }}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {[
            { label: "Calories", value: calories, setter: setCalories },
            { label: "Protein", value: protein, setter: setProtein },
            { label: "Carbs", value: carbs, setter: setCarbs },
            { label: "Fats", value: fats, setter: setFats },
          ].map((field) => (
            <View key={field.label}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {field.label}
              </Text>
              <TextInput
                placeholder={field.label}
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.textPrimary,
                  },
                ]}
                value={field.value}
                onChangeText={field.setter}
                keyboardType="numeric"
              />
            </View>
          ))}

          <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={[
                  styles.cancel,
                  {
                    borderColor: colors.textSecondary,
                    color: colors.textSecondary,
                  },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave}>
              <Text
                style={[
                  styles.save,
                  {
                    borderColor: colors.primary,
                    color: colors.primary,
                  },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 600 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },

  cancel: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },

  save: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },

  label: {
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  unitRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  unitBtn: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 10,
    alignItems: "center",
  },

  bottomButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
