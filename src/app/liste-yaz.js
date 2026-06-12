import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useShoppingPlan } from '../context/ShoppingPlanContext';
import { ArrowLeft, Sparkles } from 'lucide-react-native';

export default function ListeYazScreen() {
  const { analyzeList, isAnalyzing } = useShoppingPlan();
  const [listText, setListText] = useState('');

  const handleAnalyze = async () => {
    await analyzeList(listText);
    router.replace('/planlar');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1A1F1D" />
        </TouchableOpacity>
        <Text style={styles.title}>Liste Yaz</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.desc}>
          Aklındakileri serbestçe yaz. Yapay zekâ asistanı ürünleri tanıyıp market planını çıkaracaktır.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Örn: 2 litre süt, 30'lu yumurta, yarım kilo makarna..."
          multiline
          textAlignVertical="top"
          value={listText}
          onChangeText={setListText}
        />

        <TouchableOpacity 
          style={[styles.btnPrimary, listText.length < 3 && styles.btnDisabled]} 
          onPress={handleAnalyze}
          disabled={listText.length < 3 || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Sparkles size={18} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.btnPrimaryText}>Analiz Et ve Plan Çıkar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1F1D',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  desc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    color: '#1A1F1D',
    marginBottom: 24,
  },
  btnPrimary: {
    backgroundColor: '#0A3B2B',
    paddingVertical: 16,
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
