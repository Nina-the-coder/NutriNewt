import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ProfileData } from "../types/models";
import { saveData, getData } from "../utils/storage";

const STORAGE_KEY = "FUELUP_PROFILE";

const ProfileContext = createContext<any>(null);

export const ProfileProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await getData(STORAGE_KEY);
      if (stored) setProfile(stored);
      setIsLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveData(STORAGE_KEY, profile);
  }, [profile, isLoaded]);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);