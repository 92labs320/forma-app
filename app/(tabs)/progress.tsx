import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useProgressStore } from "../../store/progressStore";
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

  const handleAddEntry = () => {
    if (!newWeight) return;

    addEntry(newWeight);
    setNewWeight("");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 12 }}>
        Progress
      </Text>

      <Text style={{ color: "#9A9A9A", fontSize: 16, marginBottom: 32 }}>
        Track your weekly weight and stay consistent.
      </Text>

      <Card title="Transformation">
        <Item label="Starting Weight" value={`${weight} kg`} />
        <Item label="Current Weight" value={`${latestWeight} kg`} />
        <Item label="Target Weight" value={`${targetWeight} kg`} />
        <Item label="Remaining" value={weightRemaining ? `${weightRemaining} kg` : "-"} />
        <Item label="Estimated Timeline" value={timeline || "-"} />
      </Card>

      <Card title="Add Weekly Check-In">
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
            borderColor: "#262626",
            marginBottom: 16,
          }}
        />

        <Pressable
          onPress={handleAddEntry}
          style={{
            backgroundColor: newWeight ? "#00FFB2" : "#333333",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: newWeight ? "#0B0B0B" : "#777777",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Add Check-In
          </Text>
        </Pressable>
      </Card>

      <Card title="History">
        {entries.length === 0 ? (
          <Text style={{ color: "#9A9A9A", fontSize: 16 }}>
            No check-ins yet.
          </Text>
        ) : (
          entries.map((entry) => (
            <View
              key={entry.id}
              style={{
                paddingVertical: 14,
                borderTopWidth: 1,
                borderTopColor: "#262626",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                {entry.weight} kg
              </Text>

              <Text style={{ color: "#777777", fontSize: 13, marginTop: 4 }}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>

              <Pressable onPress={() => removeEntry(entry.id)} style={{ marginTop: 8 }}>
                <Text style={{ color: "#FF5C5C", fontSize: 14, fontWeight: "600" }}>
                  Remove
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: "#151515",
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#262626",
        marginBottom: 20,
      }}
    >
      <Text style={{ color: "#00FFB2", fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        {title}
      </Text>

      {children}
    </View>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: "#777777", fontSize: 14, marginBottom: 4 }}>
        {label}
      </Text>

      <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
        {value}
      </Text>
    </View>
  );
}