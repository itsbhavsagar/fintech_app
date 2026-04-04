import { useRef, useState } from "react";
import { ScrollView, Text, View, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../src/components/ui/Button";
import { width, height } from "../src/hooks/useDimensions";

const slides = [
  {
    icon: "business",
    title: "Own a piece of commercial India",
    subtitle: "Invest in offices, malls, and warehouses from just ₹10,000",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    icon: "trending-up",
    title: "Earn like an institution",
    subtitle: "10-12% annual returns from Grade A commercial properties",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    icon: "shield-checkmark",
    title: "Safe, regulated, transparent",
    subtitle: "SEBI compliant. Every rupee tracked. Exit anytime.",
    image: require("../assets/images/onboarding3.png"),
  },
];

const ONBOARDING_KEY = "onboardingSeen";

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = async () => {
    if (activeIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (activeIndex + 1),
        animated: true,
      });
      return;
    }

    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/auth/login");
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <ImageBackground
            key={slide.title}
            source={slide.image}
            resizeMode="cover"
            style={{ width, height }}
          >
            <View className="flex-1 bg-black/40 items-center justify-center px-6">
              <View className="mb-10 h-32 w-32 items-center justify-center rounded-full bg-white/20">
                <Ionicons name={slide.icon} size={48} color="#fff" />
              </View>

              <Text className="mb-4 text-center text-3xl font-semibold text-white">
                {slide.title}
              </Text>

              <Text className="text-center text-base leading-7 text-white/80">
                {slide.subtitle}
              </Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 w-full px-6 pb-10">
        <View className="mb-6 flex-row justify-center space-x-2">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                activeIndex === index ? "bg-white w-8" : "bg-white/40 w-3"
              }`}
            />
          ))}
        </View>

        <Button onPress={handleNext} className="w-full" size="lg">
          {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </View>
    </View>
  );
}
