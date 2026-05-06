import { GoalsProvider } from "../../context/GoalsContext";
import { InventoryProvider } from "../../context/InventoryContext";
import { LogsProvider } from "../../context/LogsContext";
import { NutritionAnalyticsProvider } from "../../context/NutritionAnalyticsContext";
import { ProfileProvider } from "../../context/ProfileContext";
import { RecentsProvider } from "../../context/RecentsContext";
import InventoryScreen from "./InventoryScreen";

function InventoryWrapper() {
  return (
    <LogsProvider>
      <GoalsProvider>
        <ProfileProvider>
          <NutritionAnalyticsProvider>
            <RecentsProvider>
              <InventoryProvider>
                <InventoryScreen />
              </InventoryProvider>
            </RecentsProvider>
          </NutritionAnalyticsProvider>
        </ProfileProvider>
      </GoalsProvider>
    </LogsProvider>
  );
}

export default InventoryWrapper;
