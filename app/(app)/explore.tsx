import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Property } from "../../src/constants/mockData";
import { PropertyCard } from "../../src/components/property/PropertyCard";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { useVoiceSearch } from "../../src/hooks/useVoiceSearch";
import { properties } from "../../src/constants/mockData";

const typeOptions = [
  "All",
  "Office",
  "Retail",
  "Warehouse",
  "Coworking",
] as const;
const cityOptions = ["All", "Delhi", "Noida", "Gurgaon", "Bangalore"] as const;
const returnsOptions = ["Any", "8%+", "10%+", "12%+"] as const;

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<(typeof typeOptions)[number]>("All");
  const [cityFilter, setCityFilter] =
    useState<(typeof cityOptions)[number]>("All");
  const [returnsFilter, setReturnsFilter] =
    useState<(typeof returnsOptions)[number]>("Any");
  const { transcript, isRecording, loading, startRecording, stopRecording } =
    useVoiceSearch();

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchesQuery = query
        ? [property.title, property.location, property.type, property.city]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;

      const matchesType =
        typeFilter === "All" ? true : property.type === typeFilter;
      const matchesCity =
        cityFilter === "All" ? true : property.city === cityFilter;
      const returnsValue = Number(property.expectedReturn.replace("%", ""));
      const matchesReturns =
        returnsFilter === "Any"
          ? true
          : returnsFilter === "8%+"
            ? returnsValue >= 8
            : returnsFilter === "10%+"
              ? returnsValue >= 10
              : returnsValue >= 12;

      return matchesQuery && matchesType && matchesCity && matchesReturns;
    });
  }, [query, typeFilter, cityFilter, returnsFilter]);

  const handleVoice = async () => {
    if (isRecording) {
      await stopRecording();
      if (transcript) {
        setQuery(transcript);
      }
      return;
    }

    await startRecording();
  };

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-text">
          Explore opportunities
        </Text>
        <Text className="mt-1 text-sm text-textSecondary">
          Search across cities, sectors, and returns.
        </Text>
      </View>
      <View className="mb-4 flex-row items-center rounded-3xl border border-border bg-surface px-4 py-3">
        <Ionicons name="search-outline" size={20} color="#4F46E5" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search properties"
          placeholderTextColor="#9CA3AF"
          className="ml-3 flex-1 text-base text-text"
        />
        <Pressable
          onPress={handleVoice}
          className="rounded-full bg-primaryLight p-3"
        >
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={20}
            color="#4F46E5"
          />
        </Pressable>
      </View>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {typeOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setTypeFilter(option)}
            className={`rounded-full border px-4 py-2 ${typeFilter === option ? "border-primary bg-surfaceRaised" : "border-border bg-white"}`}
          >
            <Text
              className={`${typeFilter === option ? "text-primary" : "text-textSecondary"} text-sm font-semibold`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {cityOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setCityFilter(option)}
            className={`rounded-full border px-4 py-2 ${cityFilter === option ? "border-primary bg-surfaceRaised" : "border-border bg-white"}`}
          >
            <Text
              className={`${cityFilter === option ? "text-primary" : "text-textSecondary"} text-sm font-semibold`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="mb-6 flex-row flex-wrap gap-2">
        {returnsOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setReturnsFilter(option)}
            className={`rounded-full border px-4 py-2 ${returnsFilter === option ? "border-primary bg-surfaceRaised" : "border-border bg-white"}`}
          >
            <Text
              className={`${returnsFilter === option ? "text-primary" : "text-textSecondary"} text-sm font-semibold`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      {filtered.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text">
            No properties found
          </Text>
          <Text className="mt-2 text-sm text-textSecondary">
            Try changing filters or search terms.
          </Text>
        </View>
      ) : (
        <FlashList<Property>
          data={filtered}
          renderItem={({ item }) => (
            <View className="w-1/2 pr-2 pb-4">
              <PropertyCard
                property={item}
                onPress={() =>
                  router.push({ pathname: `/property/${item.id}` })
                }
                className="h-full"
              />
            </View>
          )}
          estimatedItemSize={240}
          numColumns={2}
          contentContainerClassName="pb-28"
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
