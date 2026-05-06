import { GoalsProvider } from "../../context/GoalsContext";
import { InventoryProvider } from "../../context/InventoryContext";
import { LogsProvider } from "../../context/LogsContext";
import { NutritionAnalyticsProvider } from "../../context/NutritionAnalyticsContext";
import { ProfileProvider } from "../../context/ProfileContext";
import { RecentsProvider } from "../../context/RecentsContext";
import HomeScreen from "./HomeScreen";

function HomeWrapper() {
  return (
    <InventoryProvider>
      <RecentsProvider>
        <GoalsProvider>
          <LogsProvider>
            <ProfileProvider>
              <NutritionAnalyticsProvider>
                <HomeScreen />
              </NutritionAnalyticsProvider>
            </ProfileProvider>
          </LogsProvider>
        </GoalsProvider>
      </RecentsProvider>
    </InventoryProvider>
  );
}

export default HomeWrapper;
