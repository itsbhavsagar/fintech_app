import * as Haptics from "expo-haptics";

export const useHaptics = () => {
  const light = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const medium = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return { light, medium };
};
