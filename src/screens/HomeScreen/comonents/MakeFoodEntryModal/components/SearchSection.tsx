import React from "react";
import { Animated } from "react-native";
import SearchBar from "../../../../../sharedComponents/SearchBar";

interface SearchSectionProps {
  search: string;
  setSearch: (value: string) => void;
  animatedStyle: any;
}

export default function SearchSection({
  search,
  setSearch,
  animatedStyle,
}: SearchSectionProps) {
  return (
    <Animated.View style={[animatedStyle, { marginBottom: 12 }]}>
      <SearchBar search={search} setSearch={setSearch} />
    </Animated.View>
  );
}
