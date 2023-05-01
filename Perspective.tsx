import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  SensorTypes,
  accelerometer,
  setUpdateIntervalForType,
} from 'react-native-sensors';

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
setUpdateIntervalForType(SensorTypes.accelerometer, 10);

const Perspective = () => {
  const acceleroValue = useSharedValue({x: 0, y: 0, z: 0});
  const progress = useSharedValue(-1);

  setInterval(() => {
    if (progress.value < 0) {
      progress.value = withTiming(1, {duration: 2000});
    } else {
      progress.value = withTiming(-1, {duration: 2000});
    }
  }, 2005);

  useEffect(() => {
    const subscription = accelerometer.subscribe(({x, y, z}) => {
      acceleroValue.value = {x, y, z};
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceleroValue.value]);

  const rStyle = useAnimatedStyle(() => {
    const rotateXvalue = interpolate(
      acceleroValue.value.y,
      [-9.8, 9.8],
      [-20, 20],
    );
    const rotateYvalue = interpolate(
      acceleroValue.value.x,
      [-9.8, 9.8],
      [-20, 20],
    );
    return {
      transform: [
        {
          perspective: 300,
        },
        {rotateX: `${rotateXvalue}deg`},
        {rotateY: `${rotateYvalue}deg`},
      ],
    };
  }, []);

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

  return (
    <SafeAreaView style={styles.background}>
      <Animated.View style={[styles.box, bgColor]}>
        <Animated.View style={[styles.card, rStyle]} />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Perspective;
const styles = StyleSheet.create({
  card: {
    height: 245,
    width: 295,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  box: {
    height: 250,
    width: 300,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: {
      height: -3,
      width: -3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});
