import { GoalsProvider } from "../../context/GoalsContext";
import { LogsProvider } from "../../context/LogsContext";
import { NutritionAnalyticsProvider } from "../../context/NutritionAnalyticsContext";
import { ProfileProvider } from "../../context/ProfileContext";
import HistoryScreen from "./HistoryScreen";

function HistoryWrapper() {
  return (
    <LogsProvider>
      <GoalsProvider>
        <ProfileProvider>
          <NutritionAnalyticsProvider>
            <HistoryScreen />
          </NutritionAnalyticsProvider>
        </ProfileProvider>
      </GoalsProvider>
    </LogsProvider>
  );
}

export default HistoryWrapper;
