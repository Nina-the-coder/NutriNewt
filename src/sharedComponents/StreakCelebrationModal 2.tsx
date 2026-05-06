import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,                                                        
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Easing,
} from "react-native";

const { width } = Dimensions.get("window");

export default function StreakCelebrationModal({
  visible,
  streak = 1,
  onClose,
}: any){
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const flameScale = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(streak - 1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: false,
        }),

        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),

        Animated.loop(
          Animated.sequence([
            Animated.timing(flameScale, {
              toValue: 1.12,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(flameScale, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }),
          ])
        ),

        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),

        Animated.timing(streakAnim, {
          toValue: streak,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0);
      flameScale.setValue(0.8);
      glowAnim.setValue(0);
      streakAnim.setValue(streak - 1);
    }
  }, [visible]);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,255,120,0)", "rgba(0,255,120,0.15)"],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
              shadowColor: "#00ff88",
              shadowOpacity: glowAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.glowCircle,
              {
                backgroundColor: glowInterpolation,
                transform: [{ scale: flameScale }],
              },
            ]}
          />

          <Animated.Text
            style={[
              styles.flame,
              {
                transform: [{ scale: flameScale }],
              },
            ]}
          >
            🔥
          </Animated.Text>

          <Text style={styles.title}>STREAK UP</Text>

          <Animated.Text style={styles.streakText}>
            {streakAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0", "100"],
            })}
          </Animated.Text>

          <Text style={styles.dayText}>
            {streak} Day{streak > 1 ? "s" : ""} Streak
          </Text>

          <Text style={styles.message}>
            Another day fueled right.
          </Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Awesome</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: width * 0.84,
    backgroundColor: "#1E1E1E",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowRadius: 25,
    elevation: 12,
  },

  glowCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 100,
    top: 20,
  },

  flame: {
    fontSize: 64,
    marginBottom: 12,
  },

  title: {
    color: "#00C853",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },

  streakText: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
  },

  dayText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },

  message: {
    color: "#B0B0B0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 18,
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  button: {
    marginTop: 32,
    backgroundColor: "#00C853",
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});