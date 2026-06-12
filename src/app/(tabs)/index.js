import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PenTool, Camera, Grid, Info, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useShoppingPlan } from '../../context/ShoppingPlanContext';

export default function ListeScreen() {
  const { analyzeImage, isAnalyzing, location } = useShoppingPlan();

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Erişim Reddedildi', 'Fotoğraf çekmek için kamera erişim izni gereklidir.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        // Pass both uri and base64 to analyzeImage
        await analyzeImage(result.assets[0].uri, result.assets[0].base64);
        router.push('/planlar');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir sorun oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={18} color="#1A1F1D" style={{ flexShrink: 0 }} />
          <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
            {location}
          </Text>
        </View>
        <Text style={styles.headerTitle}>SepetRotası AI</Text>
        <Text style={styles.locationChangeText}>Değiştir</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Alışveriş listeni{'\n'}planlayalım</Text>
        <Text style={styles.subtitle}>
          SepetRotası AI, konumuna göre en ucuz, en yakın ve en dengeli market seçeneklerini çıkarır.
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/liste-yaz')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#C5E86C' }]}>
              <PenTool size={20} color="#0A3B2B" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Liste Yaz</Text>
              <Text style={styles.optionDesc}>Manuel olarak ürün ekle</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            activeOpacity={0.8}
            onPress={pickImage}
            disabled={isAnalyzing}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E5E7EB' }]}>
              {isAnalyzing ? (
                <ActivityIndicator color="#0A3B2B" />
              ) : (
                <Camera size={20} color="#0A3B2B" />
              )}
            </View>
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionTitle}>Fotoğraftan Oku</Text>
                <View style={[styles.badge, { backgroundColor: '#0A3B2B' }]}>
                  <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>Yapay Zeka</Text>
                </View>
              </View>
              <Text style={styles.optionDesc}>
                {isAnalyzing ? "Analiz ediliyor..." : "El yazısı veya fatura fotoğrafı çek"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/kategori-sec')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#A7F3D0' }]}>
              <Grid size={20} color="#0A3B2B" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Kategoriden Seç</Text>
              <Text style={styles.optionDesc}>Katalogdan ürün seç</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Info size={20} color="#1A1F1D" />
          <Text style={styles.infoText}>Fiyat verisi canlı, önbellekli veya yedek veriyle kesintisiz çalışır.</Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '35%',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1F1D',
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A3B2B',
  },
  locationChangeText: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0A3B2B',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1F1D',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: '#1A1F1D',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1F1D',
    lineHeight: 20,
  },
});
