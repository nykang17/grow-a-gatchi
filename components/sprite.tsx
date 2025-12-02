import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const FRAME_WIDTH = 300;
const FRAME_HEIGHT = 419;
const TOTAL_FRAMES = 8;


// idle = 1200*838
// dry = 1076 * 816
// watering = 1368 * 960

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
        source={require("../assets/images/plant_idle.png")} //plant_dry, plant_idle, plant_watering
        style={{
          width: FRAME_WIDTH * 4,
          height: FRAME_HEIGHT * 2,
          transform: [{ translateX }, { translateY }],
        }}
      />
    </View>
  );
}
