import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { ReturnsBadge } from "../../src/components/property/ReturnsBadge";
import { OccupancyBar } from "../../src/components/property/OccupancyBar";
import { useProperty } from "../../src/hooks/useBackend";
import { usePropertySummary } from "../../src/hooks/usePropertySummary";
import { width } from "../../src/hooks/useDimensions";

const reviews = [
  {
    name: "Riya Sharma",
    rating: 5,
    comment:
      "Well-structured property with strong tenant quality and steady returns.",
  },
  {
    name: "Aditya Singh",
    rating: 4,
    comment:
      "Good location and realistic underwriting. Transparent updates as well.",
  },
  {
    name: "Priya Patel",
    rating: 4,
    comment:
      "Comfortable risk profile and easy onboarding experience through the platform.",
  },
];

export default function PropertyDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: property, isLoading, isError, error } = useProperty(id);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const { summary, loading, generated, generateSummary } = usePropertySummary();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold text-text">
          Loading property details...
        </Text>
      </View>
    );
  }

  if (isError || !property) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-semibold text-text">
          Property not found.
        </Text>
        <Text className="mt-2 text-sm text-textSecondary text-center">
          {(error as Error)?.message ?? "Please try another listing."}
        </Text>
      </View>
    );
  }

  const handleImageScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="relative h-96">
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            >
              {property.images.map((image) => (
                <Image
                  key={image}
                  source={{ uri: image }}
                  contentFit="cover"
                  style={{ width, height: 384 }}
                  className="h-96 w-screen"
                />
              ))}
            </ScrollView>
            <Pressable
              onPress={() => router.back()}
              className="absolute left-4 rounded-full bg-white/90 p-3"
              style={{ top: insets.top + 16 }}
            >
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </Pressable>
            <View className="absolute bottom-6 left-0 right-0 flex-row items-center justify-center space-x-2">
              {property.images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  className={`h-2 w-2 rounded-full ${activeIndex === index ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </View>
          </View>

          <View className="px-6 py-6">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-semibold text-text">
                  {property.title}
                </Text>
                <Text className="mt-1 text-sm text-textSecondary">
                  {property.city} • {property.type}
                </Text>
              </View>
              <ReturnsBadge value={property.expectedReturn.replace("%", "")} />
            </View>

            <View className="mb-6 rounded-3xl bg-surface p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm text-textSecondary">Occupancy</Text>
                <Text className="text-sm font-semibold text-text">
                  {property.occupancy}%
                </Text>
              </View>
              <OccupancyBar value={property.occupancy} />
              <View className="mt-4 flex-row items-center justify-between">
                <Text className="text-sm text-textSecondary">
                  Min investment
                </Text>
                <Text className="text-sm font-semibold text-text">
                  ₹{property.minimumInvestment.toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-sm text-textSecondary">Lease term</Text>
                <Text className="text-sm font-semibold text-text">
                  {property.leaseTerm}
                </Text>
              </View>
            </View>

            <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-text">
                Funding progress
              </Text>
              <View className="mb-3 h-3 overflow-hidden rounded-full bg-border">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${property.funded}%` }}
                />
              </View>
              <Text className="text-sm text-textSecondary">
                {property.funded}% funded — {property.availableUnits} units left
              </Text>
            </View>

            <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-text">
                Top tenants
              </Text>
              {property.tenants.map((tenant) => (
                <View key={tenant} className="mb-3 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primaryLight">
                    <Ionicons name="business" size={18} color="#4F46E5" />
                  </View>
                  <Text className="text-base text-text">{tenant}</Text>
                </View>
              ))}
            </View>

            <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-text">
                  AI Summary
                </Text>
                {generated && (
                  <View className="flex-row items-center gap-1 rounded-full bg-primaryLight px-3 py-1">
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#4F46E5"
                    />
                    <Text className="text-xs font-medium text-primary">
                      Generated
                    </Text>
                  </View>
                )}
              </View>

              {!generated && !loading && (
                <Pressable
                  onPress={() => generateSummary(property)}
                  className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3"
                >
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text className="text-base font-semibold text-white">
                    Get AI Summary
                  </Text>
                </Pressable>
              )}

              {loading && (
                <View className="flex-row items-center gap-2 py-2">
                  <View className="h-2 w-2 rounded-full bg-primary opacity-60" />
                  <View className="h-2 w-2 rounded-full bg-primary opacity-40" />
                  <View className="h-2 w-2 rounded-full bg-primary opacity-20" />
                  <Text className="ml-1 text-sm text-textSecondary">
                    Generating summary...
                  </Text>
                </View>
              )}

              {summary && (
                <View className="mt-2">
                  <Text
                    className="text-sm leading-7 text-text"
                    style={{ letterSpacing: 0.1 }}
                  >
                    {summary}
                  </Text>
                </View>
              )}
            </View>

            <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-text">
                Highlights
              </Text>
              {property.highlights.map((highlight) => (
                <View
                  key={highlight}
                  className="mb-3 flex-row items-start gap-3"
                >
                  <View className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <Text className="text-sm text-textSecondary">
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-text">
                Description
              </Text>
              <Text className="text-sm leading-6 text-textSecondary">
                {property.description}
              </Text>
            </View>

            <View className="mb-24 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-text">
                Reviews
              </Text>
              {reviews.map((review) => (
                <View key={review.name} className="mb-4">
                  <Text className="text-sm font-semibold text-text">
                    {review.name}
                  </Text>
                  <Text className="mt-1 text-sm text-textSecondary">
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View
          className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-border px-6 py-4"
          style={{ paddingBottom: insets.bottom ? insets.bottom + 12 : 12 }}
        >
          <View className="flex-row items-center justify-between gap-3">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/property/[id]/qa",
                  params: { id: property.id },
                })
              }
              className="flex-1 items-center justify-center rounded-3xl border border-border bg-white px-4 py-3"
            >
              <Text className="text-base font-semibold text-text">Ask AI</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/investment/[id]",
                  params: { id: property.id },
                })
              }
              className="flex-1 items-center justify-center rounded-3xl bg-primary px-4 py-3"
            >
              <Text className="text-base font-semibold text-white">
                Invest Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
