import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DailyFoodEntry, InventoryItem } from "../../../../types/models";
import { useTheme } from "../../../../context/ThemeContext";
import { useInventory } from "../../../../context/InventoryContext";
import { useLogs } from "../../../../context/LogsContext";
import { useRecents } from "../../../../context/RecentsContext";
import { triggerFeedback } from "../../../../utils/feedback";
import BottomSheet from "./components/BottomSheet";
import VerticalFoodCard from "../VerticalFoodCard";
import HeaderSection from "./components/HeaderSection";
import SearchSection from "./components/SearchSection";
import StickyMealBar from "./components/StickyMealBar";
import MealPreviewSection from "./components/MealPreviewSection";
import FavoritesSection from "./components/FavoritesSection";
import RecentsSection from "./components/RecentsSection";
import FlyingFoodAnimationLayer from "./components/FlyingFoodAnimationLayer";
import useFoodSearch from "./hooks/useFoodSearch";
import useMealPersistence from "./hooks/useMealPersistence";
import useFoodAnimation from "./hooks/useFoodAnimations";
import AddFoodToInventoryModal from "../../../../sharedComponents/AddFoodToInventoryModal";

interface MakeFoodEntryModalProps {
  visible: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "snacks" | "dinner" | null;
}

export default function MakeFoodEntryModal({
  visible,
  onClose,
  mealType,
}: MakeFoodEntryModalProps) {
  const { colors } = useTheme();
  const { inventory } = useInventory();
  const { addFoodToMeal, removeFoodFromMeal, dailyLogs } = useLogs();
  const { recents, setRecents } = useRecents();

  const [step, setStep] = useState<"select" | "edit">("select");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [quantity, setQuantity] = useState("100");
  const [editingPreviewItem, setEditingPreviewItem] =
    useState<DailyFoodEntry | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const todayQty = Math.max(0, Number(quantity) || 0);

  const currentMealItems = useMemo(() => {
    if (!mealType) return [];

    const todayLog = dailyLogs.find((log: any) => log.date === today);

    return todayLog?.meals?.[mealType] || [];
  }, [dailyLogs, mealType]);

  const { persistedMealItems, persistedMealType } = useMealPersistence({
    visible,
    mealType,
    currentMealItems,
  });

  const { search, setSearch, filteredInventory } = useFoodSearch(inventory);
  const favoriteItems = inventory.filter((item: any) => item.isFavorite);
  const favoriteCardItems = favoriteItems.map((item: any) => ({
    id: item.id,
    originalItem: item,
  }));

  const recentItems = useMemo(() => {
    return Object.values(recents)
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .slice(0, 6);
  }, [recents]);

  const flatListRef = useRef<any>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const stickyOpacity = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const stickyTranslateY = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [-20, 0],
    extrapolate: "clamp",
  });

  const previewCollapse = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchAnimatedStyle = {
    transform: [{ translateY: searchTranslateY }],
    opacity: searchOpacity,
  };

  const stickyAnimatedStyle = {
    opacity: stickyOpacity,
    transform: [{ translateY: stickyTranslateY }],
  };

  const previewAnimatedStyle = {
    opacity: previewCollapse,
    transform: [
      {
        scale: previewCollapse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        }),
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });

        scrollY.setValue(0); // 🔥 reset animation state
      });
    }
  }, [visible]);

  const {
    previewRef,
    flyingFood,
    flyingX,
    flyingY,
    flyingScale,
    flyingOpacity,
    animateAndAddFood,
  } = useFoodAnimation({
    mealType: persistedMealType,
    addFoodToMeal,
    removeFoodFromMeal,
    setRecents,
    triggerFeedback,
  });

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);

    setQuantity(item.unit === "pcs" ? "1" : "100");

    setStep("edit");
  };

  const reset = () => {
    setSearch("");
    setStep("select");
    setSelectedItem(null);
    setQuantity("100");
    setEditingPreviewItem(null);
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });

      scrollY.setValue(0);
    }, 50);

    onClose();

    setTimeout(() => {
      reset();
    }, 300);
  };

  const handleQuickAdd = (
    item: InventoryItem | DailyFoodEntry,
    sourceRef: React.RefObject<any>,
  ) => {
    if ((item as DailyFoodEntry).quantity !== undefined) {
      const recent = item as DailyFoodEntry;

      const inventoryItem = inventory.find(
        (i: any) => i.id === recent.inventoryItemId,
      );

      if (!inventoryItem) return;

      animateAndAddFood({
        inventoryItem,
        quantity: recent.quantity,
        sourceRef,
      });

      return;
    }

    const inv = item as InventoryItem;

    animateAndAddFood({
      inventoryItem: inv,
      quantity: inv.baseQuantity,
      sourceRef,
    });
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView
            style={{
              flex: 1,
              padding: 20,
              backgroundColor: colors.background,
            }}
          >
            <StickyMealBar
              mealType={persistedMealType}
              items={persistedMealItems}
              animatedStyle={stickyAnimatedStyle}
              onExpand={() => {
                flatListRef.current?.scrollToOffset({
                  offset: 0,
                  animated: true,
                });
              }}
            />

            <HeaderSection
              mealType={persistedMealType}
              step={step}
              onClose={handleCloseModal}
              onBackToSelect={() => setStep("select")}
            />

            <Animated.FlatList
              ref={flatListRef}
              data={filteredInventory}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollY,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                },
              )}
              renderItem={({ item }) => (
                <VerticalFoodCard
                  item={item}
                  handleQuickAdd={handleQuickAdd}
                  handleSelectItem={handleSelectItem}
                />
              )}
              ListHeaderComponent={
                <>
                  <SearchSection
                    search={search}
                    setSearch={setSearch}
                    animatedStyle={searchAnimatedStyle}
                  />
                  <MealPreviewSection
                    previewRef={previewRef}
                    animatedStyle={previewAnimatedStyle}
                    mealType={persistedMealType}
                    currentMealItems={persistedMealItems}
                    handleDeletePreviewItem={(item) => {
                      if (!persistedMealType) return;

                      removeFoodFromMeal(persistedMealType, item.id);
                    }}
                    handleEditPreviewItem={(item) => {
                      const inventoryItem = inventory.find(
                        (inv: any) => inv.id === item.inventoryItemId,
                      );

                      if (!inventoryItem) return;

                      setSelectedItem(inventoryItem);
                      setQuantity(String(item.quantity));
                      setEditingPreviewItem(item);
                      setStep("edit");
                    }}
                  />

                  {search.trim() === "" && (
                    <>
                      <FavoritesSection
                        favoriteCardItems={favoriteCardItems}
                        handleQuickAdd={handleQuickAdd}
                        handleSelectItem={handleSelectItem}
                      />

                      <RecentsSection
                        recentItems={recentItems}
                        handleQuickAdd={handleQuickAdd}
                        handleSelectItemFromRecent={(entry: DailyFoodEntry) => {
                          const inventoryItem = inventory.find(
                            (i: any) => i.id === entry.inventoryItemId,
                          );

                          if (!inventoryItem) return;

                          setSelectedItem(inventoryItem);
                          setQuantity(String(entry.quantity));
                          setStep("edit");
                        }}
                      />
                    </>
                  )}

                  {/* create button */}
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      { borderColor: colors.primary },
                    ]}
                    onPress={() => setShowCreate(true)}
                  >
                    <Text
                      style={[styles.createText, { color: colors.primary }]}
                    >
                      + Create New Food
                    </Text>
                  </TouchableOpacity>
                </>
              }
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 500,
              }}
            />

            {step === "edit" && selectedItem && (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                  }}
                  onPress={() => setStep("select")}
                />

                <BottomSheet
                  visible
                  selectedItem={selectedItem}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  todayQty={todayQty}
                  reset={reset}
                  mealType={persistedMealType}
                  editingPreviewItem={editingPreviewItem}
                  handleAddFood={(sourceRef: any) => {
                    if (!selectedItem) return;

                    animateAndAddFood({
                      inventoryItem: selectedItem,

                      quantity: todayQty,

                      sourceRef,

                      editingPreviewItem,

                      onComplete: () => {
                        setEditingPreviewItem(null);

                        reset();
                      },
                    });
                  }}
                />
              </>
            )}
          </SafeAreaView>

          <FlyingFoodAnimationLayer
            flyingFood={flyingFood}
            flyingOpacity={flyingOpacity}
            flyingScale={flyingScale}
            flyingX={flyingX}
            flyingY={flyingY}
          />
        </GestureHandlerRootView>
      </Modal>

      <AddFoodToInventoryModal
        visible={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
        onSuccess={(item) => {
          setSelectedItem(item);
          setQuantity(item.unit === "pcs" ? "1" : "100");
          setStep("edit");
          setShowCreate(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  createButton: {
    marginTop: 30,
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  createText: {
    fontWeight: "600",
  },
});
