import React from "react";
import { InventoryProvider } from "./InventoryContext";
import { LogsProvider } from "./LogsContext";
import { GoalsProvider } from "./GoalsContext";
import { ProfileProvider } from "./ProfileContext";
import { RecentsProvider } from "./RecentsContext";

export const NutritionProvider = ({ children }: any) => {
  return (
    <InventoryProvider>
      <RecentsProvider>
        <ProfileProvider>
          <GoalsProvider>
            <LogsProvider>
              {children}
            </LogsProvider>
          </GoalsProvider>
        </ProfileProvider>
      </RecentsProvider>
    </InventoryProvider>
  );
};