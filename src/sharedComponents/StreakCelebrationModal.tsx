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
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function StreakCelebrationModal({
  visible,
  streak = 1,
  onClose,
}: any) {
  const { colors } = useTheme();

  /* =========================
     ANIMATION VALUES
  ========================= */

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslate = useRef(new Animated.Value(40)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;

  const flameScale = useRef(new Animated.Value(0.2)).current;
  const flameRotate = useRef(new Animated.Value(-8)).current;
  const flameOpacity = useRef(new Animated.Value(0)).current;

  const ringScale = useRef(new Animated.Value(0.7)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  const streakScale = useRef(new Animated.Value(0.7)).current;
  const streakOpacity = useRef(new Animated.Value(0)).current;

  const messageOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

  const particleOpacity = useRef(new Animated.Value(0)).current;

  /* =========================
     ANIMATION FLOW
  ========================= */

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        // Overlay
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        // Modal entrance
        Animated.parallel([
          Animated.spring(modalScale, {
            toValue: 1,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),

          Animated.timing(modalTranslate, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),

          Animated.timing(modalOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),

        // Flame ignition + rings
        Animated.parallel([
          Animated.sequence([
            Animated.parallel([
              Animated.spring(flameScale, {
                toValue: 1.15,
                friction: 5,
                tension: 120,
                useNativeDriver: true,
              }),

              Animated.timing(flameRotate, {
                toValue: 0,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),

              Animated.timing(flameOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),

            Animated.spring(flameScale, {
              toValue: 1,
              friction: 4,
              tension: 100,
              useNativeDriver: true,
            }),
          ]),

          Animated.sequence([
            Animated.parallel([
              Animated.timing(ringScale, {
                toValue: 1.6,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),

              Animated.timing(ringOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
              }),
            ]),

            Animated.timing(ringOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),

        // Number animation
        Animated.parallel([
          Animated.spring(streakScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),

          Animated.timing(streakOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),

        // Message
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),

        // Button
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating particles
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(particle1Y, {
              toValue: -25,
              duration: 2200,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(particle1Y, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),

          Animated.sequence([
            Animated.timing(particle2Y, {
              toValue: -35,
              duration: 2600,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(particle2Y, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),

          Animated.sequence([
            Animated.timing(particle3Y, {
              toValue: -30,
              duration: 2400,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(particle3Y, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();

      Animated.timing(particleOpacity, {
        toValue: 0.7,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      overlayOpacity.setValue(0);

      modalOpacity.setValue(0);
      modalTranslate.setValue(40);
      modalScale.setValue(0.92);

      flameScale.setValue(0.2);
      flameRotate.setValue(-8);
      flameOpacity.setValue(0);

      ringScale.setValue(0.7);
      ringOpacity.setValue(0);

      streakScale.setValue(0.7);
      streakOpacity.setValue(0);

      messageOpacity.setValue(0);
      buttonOpacity.setValue(0);

      particle1Y.setValue(0);
      particle2Y.setValue(0);
      particle3Y.setValue(0);

      particleOpacity.setValue(0);
    }
  }, [visible]);

  /* =========================
     INTERPOLATIONS
  ========================= */

  const rotateInterpolate = flameRotate.interpolate({
    inputRange: [-8, 0],
    outputRange: ["-8deg", "0deg"],
  });

  /* =========================
     RENDER
  ========================= */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              opacity: modalOpacity,
              transform: [
                { translateY: modalTranslate },
                { scale: modalScale },
              ],
            },
          ]}
        >
          {/* Expanding ring */}
          <Animated.View
            style={[
              styles.ring,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />

          {/* Floating particles */}
          <Animated.View
            style={[
              styles.particle,
              {
                left: 90,
                top: 110,
                opacity: particleOpacity,
                transform: [{ translateY: particle1Y }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.particle,
              {
                right: 90,
                top: 130,
                opacity: particleOpacity,
                transform: [{ translateY: particle2Y }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.particle,
              {
                left: 160,
                top: 150,
                opacity: particleOpacity,
                transform: [{ translateY: particle3Y }],
              },
            ]}
          />

          {/* Flame */}
          <Animated.Text
            style={[
              styles.flame,
              {
                opacity: flameOpacity,
                transform: [
                  { scale: flameScale },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <Ionicons name="flame" size={72} color={colors.danger} />
          </Animated.Text>

          {/* Heading */}
          <Text style={[styles.heading, { color: colors.textSecondary }]}>
            MOMENTUM UNLOCKED
          </Text>

          {/* Streak Number */}
          <Animated.Text
            style={[
              styles.streakText,
              {
                color: colors.textPrimary,
                opacity: streakOpacity,
                transform: [{ scale: streakScale }],
              },
            ]}
          >
            {streak}
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={[
              styles.message,
              {
                color: colors.textSecondary,
                opacity: messageOpacity,
              },
            ]}
          >
            Another day fueled right.
          </Animated.Text>

          {/* Button */}
          <Animated.View
            style={{
              opacity: buttonOpacity,
            }}
          >
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Keep Going
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: width * 0.84,
    borderRadius: 32,
    paddingVertical: 42,
    paddingHorizontal: 28,
    alignItems: "center",
    overflow: "hidden",

    shadowColor: "#FFB25E",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 14,
  },

  ring: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,180,90,0.22)",
    backgroundColor: "rgba(255,170,60,0.06)",
    top: 30,
  },

  flame: {
    fontSize: 72,
    marginBottom: 14,
  },

  heading: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.5,
    marginBottom: 16,
  },

  streakText: {
    fontSize: 68,
    fontWeight: "900",
    lineHeight: 74,
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 18,
    lineHeight: 24,
    paddingHorizontal: 12,
  },

  button: {
    marginTop: 34,
    paddingHorizontal: 34,
    paddingVertical: 15,
    borderRadius: 18,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: "rgba(255,190,120,0.55)",
  },
});
