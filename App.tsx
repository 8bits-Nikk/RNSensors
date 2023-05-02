import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  SensorTypes,
  accelerometer,
  setUpdateIntervalForType,
} from 'react-native-sensors';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
setUpdateIntervalForType(SensorTypes.accelerometer, 10);

const App = () => {
  const acceleroValue = useSharedValue({x: 0, y: 0});
  const progress = useSharedValue(-1);
  const prev = useSharedValue({x: 0, y: 0});
  setInterval(() => {
    if (progress.value < 0) {
      progress.value = withTiming(1, {duration: 2000});
    } else {
      progress.value = withTiming(-1, {duration: 2000});
    }
  }, 2005);

  useEffect(() => {
    const subscription = accelerometer.subscribe(({x, y}) => {
      acceleroValue.value = {x, y};
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceleroValue.value]);

  const motionValue = useDerivedValue(() => {
    const MAX_X = 250;
    const MAX_Y = 250;
    const MIN_X = 0;
    const MIN_Y = 0;

    let newX = prev.value.x + acceleroValue.value.x * -0.5;
    let newY = prev.value.y + acceleroValue.value.y * 0.5;
    // Can be more cleaner
    if (Math.abs(newX) >= MAX_X || newX <= MIN_X) {
      newX = prev.value.x;
    }
    if (Math.abs(newY) >= MAX_Y || newY <= MIN_Y) {
      newY = prev.value.y;
    }
    prev.value = {
      x: newX,
      y: newY,
    };
    return {x: newX, y: newY};
  }, [acceleroValue.value]);

  const bgColor = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [-1, 0, 1],
      ['red', 'blue', 'green'],
    );
    return {
      backgroundColor: color,
      shadowColor: color,
    };
  });
  const mStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: motionValue.value.x,
        },
        {
          translateY: motionValue.value.y,
        },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.background}>
      <Animated.View style={styles.box}>
        <Animated.View style={[styles.ball, bgColor, mStyle]} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ball: {
    height: 50,
    width: 50,
    borderRadius: 50,
    zIndex: 10,
    borderColor: 'black',
    borderWidth: 3,
    position: 'absolute',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  box: {
    height: 300,
    width: 300,
    borderRadius: 16,
    backgroundColor: '#eee',
    borderWidth: 3,
    borderColor: 'yellow',
    position: 'relative',
  },
  point: {
    position: 'absolute',
    backgroundColor: 'gold',
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
});

export default App;
