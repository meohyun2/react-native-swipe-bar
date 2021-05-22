import React, {useRef, useMemo, useState, useEffect, useCallback} from 'react';

import {Animated, View, StyleSheet, PanResponder, Text} from 'react-native';

import useLayout from './Hook/useLayout';

interface Props {
  SwitchComponent?: React.ReactElement;
  isCompleted?: boolean; // flag to define complete State.
  CompletedComponent?: React.ReactElement; // if you want to render Another Component, pass the Component to this prop.
  completeBaseLinePercentage: number; // percentage for container size, it will define complete event
  onCompleted(): void; // callback when switch moved end
}

const SwipeButton = ({
  isCompleted = false,
  SwitchComponent,
  CompletedComponent,
  completeBaseLinePercentage = 90,
  onCompleted,
}: Props): React.ReactElement => {
  const [isComplete, setIsComplete] = useState<boolean>(isCompleted);
  const pan = useRef(new Animated.ValueXY()).current;
  const [containerSize, onLayout] = useLayout();
  useEffect(() => {
    console.log(isComplete);
  }, [isComplete]);

  const panResponder = !isComplete
    ? PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
        onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gesture) => {
          if (
            gesture.moveX >
            (containerSize?.width ?? 1) * (completeBaseLinePercentage / 100)
          ) {
            onCompleted?.();
            pan.setValue({
              x:
                (containerSize?.width ?? 1) *
                (completeBaseLinePercentage / 100),
              y: 0,
            });
            setIsComplete(true);
          } else {
            pan.setValue({
              x: 0,
              y: 0,
            });
          }
        },
      })
    : null;

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        transform: [{translateX: pan.x}, {translateY: 0}],
      }}
      {...(panResponder?.panHandlers ?? null)}>
      {isComplete && CompletedComponent ? CompletedComponent : null}
      {SwitchComponent}
    </Animated.View>
  );
};

export default SwipeButton;
