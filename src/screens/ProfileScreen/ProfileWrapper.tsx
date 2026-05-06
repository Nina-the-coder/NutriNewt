import { GoalsProvider } from "../../context/GoalsContext";
import { NutritionAnalyticsProvider } from "../../context/NutritionAnalyticsContext";
import { ProfileProvider } from "../../context/ProfileContext";
import ProfileScreen from "./ProfileScreen";

function ProfileWrapper() {
  return (
    <ProfileProvider>
      <GoalsProvider>
        <ProfileScreen />
      </GoalsProvider>
    </ProfileProvider>
  );
}

export default ProfileWrapper;
