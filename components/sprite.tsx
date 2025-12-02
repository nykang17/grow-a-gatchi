import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const FRAME_WIDTH = 384;
const FRAME_HEIGHT = 512;
const TOTAL_FRAMES = 8;

export default function Sprite() {
  const frame = useRef(new Animated.Value(0)).current;
  const currentFrame = useRef(0); // track frame manually

  useEffect(() => {
    const interval = setInterval(() => {
      currentFrame.current = (currentFrame.current + 1) % TOTAL_FRAMES;
      frame.setValue(currentFrame.current); // pass number, not function
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const translateX = frame.interpolate({
    inputRange: [...Array(TOTAL_FRAMES).keys()],
    outputRange: [...Array(TOTAL_FRAMES).keys()].map(i => -(i % 4) * FRAME_WIDTH),
  });

  const translateY = frame.interpolate({
    inputRange: [...Array(TOTAL_FRAMES).keys()],
    outputRange: [...Array(TOTAL_FRAMES).keys()].map(i => -Math.floor(i / 4) * FRAME_HEIGHT),
  });

  return (
    <View style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, overflow: "hidden" }}>
      <Animated.Image
        source={require("../assets/images/healthy.png")}
        style={{
          width: FRAME_WIDTH * 4,
          height: FRAME_HEIGHT * 2,
          transform: [{ translateX }, { translateY }],
        }}
      />
    </View>
  );
}
