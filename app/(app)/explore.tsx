import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Property } from "../../src/types/api";
import { PropertyCard } from "../../src/components/property/PropertyCard";
import { useVoiceSearch } from "../../src/hooks/useVoiceSearch";
import {
  useAddToWatchlist,
  useInfiniteProperties,
  useRemoveFromWatchlist,
  useWatchlist,
} from "../../src/hooks/useBackend";

const typeOptions = [
  "All",
  "Office",
  "Retail",
  "Warehouse",
  "Coworking",
] as const;
const cityOptions = ["All", "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai"] as const;
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
  
  const { isRecording, startRecording, stopRecording } = useVoiceSearch();
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProperties({
    q: query,
    type: typeFilter,
    city: cityFilter,
    returns: returnsFilter,
  });

  const properties = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const { data: watchlist = [] } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const watchlistIds = useMemo(
    () => new Set(watchlist.map((item) => item.propertyId)),
    [watchlist],
  );

  const handleVoice = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) setQuery(text);
      return;
    }
    await startRecording();
  };
  
  const toggleWatchlist = async (propertyId: string) => {
    const isBookmarked = watchlistIds.has(propertyId);

    if (isBookmarked) {
      await removeFromWatchlist.mutateAsync(propertyId);
      return;
    }

    await addToWatchlist.mutateAsync(propertyId);
  };

  const Header = (
    <View className="px-4 pt-4">
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
              className={`text-sm font-semibold ${typeFilter === option ? "text-primary" : "text-textSecondary"}`}
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
              className={`text-sm font-semibold ${cityFilter === option ? "text-primary" : "text-textSecondary"}`}
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
              className={`text-sm font-semibold ${returnsFilter === option ? "text-primary" : "text-textSecondary"}`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && (
        <View className="items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text">
            Loading properties...
          </Text>
        </View>
      )}

      {!isLoading && properties.length === 0 && (
        <View className="items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text">
            No properties found
          </Text>
          <Text className="mt-2 text-sm text-textSecondary">
            Try changing filters or search terms.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList<Property>
        data={properties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={Header}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              marginLeft: index % 2 !== 0 ? 8 : 0,
              marginBottom: 12,
            }}
          >
            <PropertyCard
              property={item}
              bookmarked={watchlistIds.has(item.id)}
              onBookmarkPress={() => void toggleWatchlist(item.id)}
              bookmarkDisabled={
                addToWatchlist.isPending || removeFromWatchlist.isPending
              }
              onPress={() =>
                router.push({
                  pathname: "/property/[id]",
                  params: { id: item.id },
                })
              }
              
            />
          </View>
        )}
      />
    </View>
  );
}
