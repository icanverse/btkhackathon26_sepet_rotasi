import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Flame,
  PiggyBank,
  Leaf,
  Trophy,
  Footprints,
  Bike,
  Car,
  Navigation,
} from "lucide-react-native";

const TYPE_INFO = {
  walk: {
    title: "Yürüme Rotası",
    icon: <Footprints size={22} color="#fff" />,
    score: 12,
    eco: "0g CO₂",
    message: "Adımlarınla dünyayı hafiflettin.",
  },
  bike: {
    title: "Bisiklet Rotası",
    icon: <Bike size={22} color="#fff" />,
    score: 24,
    eco: "0g CO₂",
    message: "Rüzgâr ensende, dünya yüzünde tebessüm.",
  },
  car: {
    title: "Araba Rotası",
    icon: <Car size={22} color="#fff" />,
    score: 7,
    eco: "240g CO₂",
    message: "Direksiyon sende, sorumluluk da.",
  },
};

export default function RotaPuanType() {
  const { type } = useLocalSearchParams();
  const data = TYPE_INFO[type] || TYPE_INFO.walk;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>{data.icon}</View>
          <Text style={styles.score}>{data.score} Puan</Text>
          <Text style={styles.message}>{data.message}</Text>

          <View style={styles.infoRow}>
            <Leaf size={20} color="#7aff7a" />
            <Text style={styles.infoText}>Karbon İzi: {data.eco}</Text>
          </View>

          <View style={styles.infoRow}>
            <PiggyBank size={20} color="#ffd86b" />
            <Text style={styles.infoText}>Kazanç: {Math.round(data.score / 2)} puan</Text>
          </View>

          <View style={styles.infoRow}>
            <Flame size={20} color="#ff6b6b" />
            <Text style={styles.infoText}>Enerji Yakımı: {data.score * 3} kcal</Text>
          </View>

          <TouchableOpacity style={styles.okButton} onPress={() => router.push("/home")}>
            <Text style={styles.okText}>Tamamla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  scroll: {
    padding: 20,
  },

  card: {
    backgroundColor: "#15171d",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  iconWrap: {
    backgroundColor: "#1e2027",
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  score: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
  },

  message: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 8,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    color: "#eee",
    fontSize: 15,
  },

  okButton: {
    marginTop: 30,
    backgroundColor: "#4b8cff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});