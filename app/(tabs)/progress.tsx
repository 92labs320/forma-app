import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";

import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { useOnboardingStore } from "../../store/onboardingStore";
import { ProgressEntry, useProgressStore } from "../../store/progressStore";
import {
  calculateWeightRemaining,
  estimateTimeline,
} from "../../lib/fitnessCalculator";

export default function Progress() {
  const { weight, targetWeight } = useOnboardingStore();
  const { entries, addEntry, removeEntry } = useProgressStore();

  const [newWeight, setNewWeight] = useState("");

  const latestWeight = entries[0]?.weight || weight;
  const weightRemaining = calculateWeightRemaining(latestWeight, targetWeight);
  const timeline = estimateTimeline(latestWeight, targetWeight);
  const parsedWeight = Number(newWeight);
  const canAddEntry = Boolean(newWeight.trim()) && parsedWeight > 0;

  const handleAddEntry = async () => {
    if (!canAddEntry) return;

    addEntry(newWeight.trim());
    setNewWeight("");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 72,
        paddingBottom: 88,
        gap: 18,
      }}
    >
      <View style={{ marginBottom: 4 }}>
        <Text
          style={{
            color: "white",
            fontSize: 34,
            fontWeight: "800",
            marginBottom: 8,
          }}
        >
          Progress
        </Text>

        <Text style={{ color: "#8E8E8E", fontSize: 16, lineHeight: 22 }}>
          Track check-ins without overcomplicating the week.
        </Text>
      </View>

      <Card>
        <SectionTitle title="Transformation" />
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
          <MetricTile label="Start" value={`${weight || "-"} kg`} />
          <MetricTile label="Current" value={`${latestWeight || "-"} kg`} />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <MetricTile label="Target" value={`${targetWeight || "-"} kg`} />
          <MetricTile
            label="Remaining"
            value={weightRemaining ? `${weightRemaining} kg` : "-"}
          />
        </View>
        <View
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#242424",
          }}
        >
          <Text style={{ color: "#777777", fontSize: 14, marginBottom: 5 }}>
            Estimated Timeline
          </Text>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
            {timeline || "-"}
          </Text>
        </View>
      </Card>

      <Card>
        <SectionTitle
          title="Add Check-In"
          subtitle="Use the same scale and time of day for cleaner trends."
        />
        <TextInput
          value={newWeight}
          onChangeText={setNewWeight}
          keyboardType="numeric"
          placeholder="Current weight in kg"
          placeholderTextColor="#666666"
          style={{
            backgroundColor: "#0B0B0B",
            color: "white",
            padding: 18,
            borderRadius: 16,
            fontSize: 18,
            borderWidth: 1,
            borderColor: canAddEntry ? "#00FFB2" : "#262626",
            marginBottom: 16,
          }}
        />

        <PrimaryButton onPress={handleAddEntry} disabled={!canAddEntry}>
          Add Check-In
        </PrimaryButton>
      </Card>

      <Card>
        <SectionTitle
          title="History"
          subtitle={
            entries.length === 0
              ? "Your first check-in will appear here."
              : `${entries.length} check-in${entries.length === 1 ? "" : "s"} logged`
          }
        />

        {entries.length === 0 ? (
          <EmptyState />
        ) : (
          entries.map((entry, index) => (
            <AnimatedEntryRow
              key={entry.id}
              entry={entry}
              index={index}
              onRemove={() => removeEntry(entry.id)}
            />
          ))
        )}
      </Card>
    </ScrollView>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#262626",
        padding: 16,
      }}
    >
      <Text style={{ color: "#777777", fontSize: 13, marginBottom: 8 }}>
        {label}
      </Text>
      <Text style={{ color: "white", fontSize: 19, fontWeight: "800" }}>
        {value}
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#0B0B0B",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#262626",
        padding: 22,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "800",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        No check-ins yet
      </Text>
      <Text
        style={{
          color: "#8E8E8E",
          fontSize: 14,
          lineHeight: 20,
          textAlign: "center",
        }}
      >
        Add a weekly weight to start building your trend.
      </Text>
    </View>
  );
}

function AnimatedEntryRow({
  entry,
  index,
  onRemove,
}: {
  entry: ProgressEntry;
  index: number;
  onRemove: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: Math.min(index * 60, 240),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: Math.min(index * 60, 240),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#242424",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 19, fontWeight: "800" }}>
            {entry.weight} kg
          </Text>

          <Text style={{ color: "#777777", fontSize: 13, marginTop: 5 }}>
            {new Date(entry.date).toLocaleDateString()}
          </Text>
        </View>

        <Pressable
          onPress={onRemove}
          style={{
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#3A2020",
            paddingHorizontal: 14,
            paddingVertical: 9,
          }}
        >
          <Text style={{ color: "#FF6B6B", fontSize: 13, fontWeight: "800" }}>
            Remove
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
