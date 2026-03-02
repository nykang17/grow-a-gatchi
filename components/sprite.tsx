import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type SpriteState = "dry" | "idle" | "watering";

const TOTAL_FRAMES = 8;

// Dimensions for each sprite type
const SPRITE_SIZES = {
  idle:  { width: 1200 / 4, height: 838 / 2 },     // 4 columns, 2 rows
  dry:   { width: 1076 / 4, height: 816 / 2 },
  watering: { width: 1368 / 4, height: 960 / 2 },
};

// PNG imports
const SPRITE_IMAGES = {
  idle: require("../assets/images/plant_idle.png"),
  dry: require("../assets/images/plant_dry.png"),
  watering: require("../assets/images/plant_watering.png"),
};


const FRAME_SPEED = {
  idle: 400,
  dry: 600,
  watering: 100,
};

export default function Sprite({ state }: { state: SpriteState }) {
  const frame = useRef(new Animated.Value(0)).current;
  const currentFrame = useRef(0);

  // Pick correct sprite attributes
  const { width: FRAME_WIDTH, height: FRAME_HEIGHT } = SPRITE_SIZES[state];
  const spriteSource = SPRITE_IMAGES[state];

  useEffect(() => {
    const interval = setInterval(() => {
      currentFrame.current = (currentFrame.current + 1) % TOTAL_FRAMES;
      frame.setValue(currentFrame.current);
    }, FRAME_SPEED[state]);

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
        source={spriteSource}
        style={{
          width: FRAME_WIDTH * 4,
          height: FRAME_HEIGHT * 2,
          transform: [{ translateX }, { translateY }],
        }}
      />
    </View>
  );
}
