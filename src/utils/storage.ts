import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error saving data", error);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error getting data", error);
    return null; // Return null instead of undefined for consistency
  }
};

// Batch save multiple keys at once
export const saveMultipleData = async (data: Record<string, any>) => {
  try {
    const entries: [string, string][] = Object.entries(data).map(
      ([key, value]) => [key, JSON.stringify(value)],
    );
    await AsyncStorage.multiSet(entries);
  } catch (error) {
    console.error("Error saving multiple data", error);
  }
};

// Batch get multiple keys at once
export const getMultipleData = async (keys: string[]) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce(
      (acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      },
      {} as Record<string, any>,
    );
  } catch (error) {
    console.error("Error getting multiple data", error);
    return {};
  }
};
