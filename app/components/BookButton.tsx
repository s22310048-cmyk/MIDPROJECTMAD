import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface BookButtonProps {
  title: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
  color: string;
  dark?: boolean;
}

export default function BookButton({
  title,
  icon,
  isSelected,
  onPress,
  color,
  dark = false,
}: BookButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const gradientColors = isSelected
    ? [color, `${color}CC`]
    : dark
      ? ["#2c2c2c", "#333333"]
      : ["#f8f9fa", "#e9ecef"];

  return (
    <Animated.View style={[animatedStyle, styles.buttonContainer]}>
      <TouchableOpacity
        style={[
          styles.button,
          { borderColor: isSelected ? color : "transparent" },
          isSelected && styles.selected,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.iconTextContainer}>
          <Ionicons
            name={icon as any}
            size={24}
            color={isSelected ? color : dark ? "#ddd" : "#666"}
          />
          <Text
            style={[
              styles.titleText,
              {
                color: isSelected ? color : dark ? "#ddd" : "#333",
                fontWeight: isSelected ? "bold" : "500",
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={color}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  selected: {
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  checkIcon: {
    marginLeft: 8,
  },
});
