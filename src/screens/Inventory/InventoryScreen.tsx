import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import AddFoodToInventoryModal from "../../sharedComponents/AddFoodToInventoryModal";
import FoodCard from "./components/FoodCard";
import VerticalFoodCard from "./components/VerticalFoodCard";
import { searchInventory, preprocessInventory } from "../../utils/searchUtil";
import SearchBar from "../../sharedComponents/SearchBar";
import { useInventory } from "../../context/InventoryContext";
import { useRecents } from "../../context/RecentsContext";
import { useFocusEffect } from "@react-navigation/native";

const InventoryScreen = () => {
  console.log("Inventory screen rendered");

  const { inventory, removeInventoryItem, toggleFavorite } = useInventory();
  const { recents } = useRecents();
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  /* ================= SEARCH ================= */

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  useFocusEffect(
    React.useCallback(() => {
      // reset search whenever screen gains focus
      setSearch("");
      setDebouncedSearch("");

      return () => {};
    }, []),
  );

  const processedInventory = useMemo(
    () => preprocessInventory(inventory),
    [inventory],
  );

  const filteredInventory = useMemo(() => {
    if (!debouncedSearch.trim()) return processedInventory;
    return searchInventory(processedInventory, debouncedSearch);
  }, [debouncedSearch, processedInventory]);

  /* ================= DERIVED ================= */

  const favoriteItems = useMemo(
    () => inventory.filter((item: any) => item.isFavorite),
    [inventory],
  );

  const recentItems = useMemo(() => {
    return Object.values(recents)
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .slice(0, 6);
  }, [recents]);

  /* ================= HANDLERS ================= */

  const handleEdit = useCallback((item: any) => {
    setEditingItemId(item.id);
    setModalVisible(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: any) => (
      <VerticalFoodCard
        item={item}
        handleEdit={handleEdit}
        toggleFavorite={toggleFavorite}
        onDelete={removeInventoryItem}
      />
    ),
    [handleEdit, toggleFavorite, removeInventoryItem],
  );

  /* ================= HEADER ================= */

  const listHeader = useMemo(
    () => (
      <View>
        <Text style={[styles.title, { color: colors.primary }]}>My Foods</Text>

        <SearchBar search={search} setSearch={setSearch} />

        {favoriteItems.length > 0 && debouncedSearch.trim().length === 0 && (
          <>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Favorites
            </Text>

            <FlatList
              horizontal
              data={favoriteItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FoodCard item={item} handleEdit={handleEdit} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}

        {recentItems.length > 0 && debouncedSearch.trim().length === 0 && (
          <>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Recents
            </Text>

            <FlatList
              horizontal
              data={recentItems}
              keyExtractor={(item: any) => item.id || item.inventoryItemId}
              renderItem={({ item }: any) => <FoodCard item={item} isRecent />}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.createBtn, { borderColor: colors.primary }]}
          onPress={() => {
            setEditingItemId(null);
            setModalVisible(true);
          }}
        >
          <Text style={[styles.createText, { color: colors.primary }]}>
            + Create New Food
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [colors, search, debouncedSearch, favoriteItems, recentItems, handleEdit],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      <AddFoodToInventoryModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingItemId(null);
        }}
        mode={editingItemId ? "edit" : "create"}
        initialData={inventory.find((i: any) => i.id === editingItemId)}
      />
      {/* <View style={{ height: 200 }} /> */}
    </SafeAreaView>
  );
};

export default React.memo(InventoryScreen);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  createBtn: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  createText: {
    textAlign: "center",
  },
});
