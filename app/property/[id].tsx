import { useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { ReturnsBadge } from "../../src/components/property/ReturnsBadge";
import { OccupancyBar } from "../../src/components/property/OccupancyBar";
import { properties } from "../../src/constants/mockData";
import { usePropertySummary } from "../../src/hooks/usePropertySummary";

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
  const property = useMemo(
    () => properties.find((item) => item.id === params.id),
    [params.id],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const { summary, loading, generateSummary } = usePropertySummary();

  if (!property) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <Text className="text-lg text-text">Property not found.</Text>
      </ScreenWrapper>
    );
  }

  const handleImageScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width,
    );
    setActiveIndex(index);
  };

  return (
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
                source={image}
                contentFit="cover"
                className="h-96 w-screen"
              />
            ))}
          </ScrollView>
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 top-14 rounded-full bg-white/90 p-3"
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
              <Text className="text-sm text-textSecondary">Min investment</Text>
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
              <View className={`h-full bg-primary flex-[${property.funded}]`} />
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

          <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
            <Text className="mb-4 text-base font-semibold text-text">
              AI Summary
            </Text>
            <Pressable
              onPress={() => generateSummary(property)}
              className="rounded-3xl bg-primary px-4 py-3"
            >
              <Text className="text-center text-base font-semibold text-white">
                Get AI Summary
              </Text>
            </Pressable>
            {loading ? (
              <Text className="mt-4 text-sm text-textSecondary">
                Generating summary…
              </Text>
            ) : summary ? (
              <Text className="mt-4 text-sm leading-6 text-text">
                {summary.overview}
              </Text>
            ) : null}
          </View>

          <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
            <Text className="mb-4 text-base font-semibold text-text">
              Highlights
            </Text>
            {property.highlights.map((highlight) => (
              <View key={highlight} className="mb-3 flex-row items-start gap-3">
                <View className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <Text className="text-sm text-textSecondary">{highlight}</Text>
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
      <View className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-border px-6 py-4">
        <View className="flex-row items-center justify-between gap-3">
          <Pressable
            onPress={() =>
              router.push({ pathname: `/property/${property.id}/qa` })
            }
            className="flex-1 items-center justify-center rounded-3xl border border-border bg-white px-4 py-3"
          >
            <Text className="text-base font-semibold text-text">Ask AI</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({ pathname: `/investment/${property.id}` })
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
  );
}
