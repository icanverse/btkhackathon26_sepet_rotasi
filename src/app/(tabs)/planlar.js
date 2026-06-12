import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useShoppingPlan } from '../../context/ShoppingPlanContext';
import { Bot, CheckCircle2, Navigation, Scale, FileText } from 'lucide-react-native';

export default function PlanlarScreen() {
  const { analysisResult, marketDistances } = useShoppingPlan();

  const getMarketKey = (name) => {
    if (!name) return 'bim';
    const upperName = name.toUpperCase();
    if (upperName.includes('BİM') || upperName.includes('BIM')) return 'bim';
    if (upperName.includes('A101')) return 'a101';
    if (upperName.includes('ŞOK') || upperName.includes('SOK')) return 'sok';
    if (upperName.includes('MİGROS') || upperName.includes('MIGROS')) return 'migros';
    return 'bim';
  };

  const getBranchName = (marketName) => {
    const key = getMarketKey(marketName);
    return marketDistances && marketDistances[key] ? marketDistances[key].branchName : marketName;
  };

  if (!analysisResult) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <FileText size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Henüz plan oluşturulmadı</Text>
          <Text style={styles.emptyDesc}>
            Alışveriş listenizi oluşturup analiz ettikten sonra en uygun market planları burada görünecektir.
          </Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/')}>
            <Text style={styles.btnPrimaryText}>Liste Oluştur</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { plans, summary } = analysisResult;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Senin için en iyi market planları</Text>
        <Text style={styles.subtitle}>
          Yapay zekâ asistanın, alışveriş listeni analiz ederek en uygun seçenekleri belirledi.
        </Text>

        <View style={styles.aiSummaryCard}>
          <View style={styles.aiIcon}>
            <Bot size={24} color="#0A3B2B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBadge}>YAPAY ZEKÂ ÖZETİ</Text>
            <Text style={styles.aiText}>
              {summary.replace("Yapay zekâ özeti: ", "")}
            </Text>
          </View>
        </View>

        <View style={styles.detectedItemsContainer}>
          <Text style={styles.sectionTitle}>Anlaşılan Ürünler ({analysisResult.matchedItems.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.detectedItemsScroll}>
            {analysisResult.matchedItems.map((item, index) => (
              <View key={index} style={styles.detectedItemCard}>
                <View style={styles.detectedItemIcon}>
                  <Image source={{ uri: item.product.image }} style={{ width: 40, height: 40, borderRadius: 8 }} />
                </View>
                <Text style={styles.detectedItemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.detectedItemQty}>{item.quantity} {item.product.unit}</Text>
              </View>
            ))}
            {analysisResult.unmatchedItems && analysisResult.unmatchedItems.length > 0 && (
              <View style={[styles.detectedItemCard, { opacity: 0.6 }]}>
                <View style={[styles.detectedItemIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={{ fontSize: 24 }}>❓</Text>
                </View>
                <Text style={styles.detectedItemName} numberOfLines={1}>Anlaşılamayan</Text>
                <Text style={styles.detectedItemQty}>{analysisResult.unmatchedItems.length} ürün</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={[styles.planCard, { borderColor: '#0A3B2B', borderWidth: 2 }]}>
          <View style={styles.planHeader}>
            <View style={[styles.planBadge, { backgroundColor: '#C5E86C' }]}>
              <Scale size={14} color="#0A3B2B" />
              <Text style={{ color: '#0A3B2B', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>En Ucuz</Text>
            </View>
            <View style={styles.planPriceContainer}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Önerilen</Text>
              </View>
              <Text style={styles.planPrice}>{plans.cheapest.total} TL</Text>
            </View>
          </View>
          <Text style={styles.marketName}>{getBranchName(plans.cheapest.market)}</Text>
          {plans.cheapest.items && (
            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12, marginTop: -8 }} numberOfLines={2}>
              {plans.cheapest.items.map(i => i.name).join(', ')}
            </Text>
          )}
          <View style={styles.planDetailLine}>
            <CheckCircle2 size={16} color="#0A3B2B" />
            <Text style={styles.planDetailText}>Tahmini tasarruf: {plans.cheapest.savings} TL</Text>
          </View>
          <TouchableOpacity 
            style={styles.btnPrimary} 
            onPress={() => router.push('/plan-detay/cheapest')}
          >
            <Text style={styles.btnPrimaryText}>Planı Gör</Text>
          </TouchableOpacity>
        </View>

        {plans.alternative && (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={[styles.planBadge, { backgroundColor: '#FEE2E2' }]}>
                <Scale size={14} color="#991B1B" />
                <Text style={{ color: '#991B1B', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>Alternatif</Text>
              </View>
              <Text style={styles.planPrice}>{plans.alternative.total} TL</Text>
            </View>
            <Text style={styles.marketName}>{getBranchName(plans.alternative.market)}</Text>
            {plans.alternative.items && (
              <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12, marginTop: -8 }} numberOfLines={2}>
                {plans.alternative.items.map(i => i.name).join(', ')}
              </Text>
            )}
            <View style={styles.planDetailLine}>
              <CheckCircle2 size={16} color="#6B7280" />
              <Text style={[styles.planDetailText, { color: '#6B7280' }]}>Tahmini tasarruf: {plans.alternative.savings} TL</Text>
            </View>
            <TouchableOpacity 
              style={styles.btnOutline} 
              onPress={() => router.push('/plan-detay/alternative')}
            >
              <Text style={styles.btnOutlineText}>Planı Gör</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={[styles.planBadge, { backgroundColor: '#E0F2FE' }]}>
              <Navigation size={14} color="#0369A1" />
              <Text style={{ color: '#0369A1', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>En Yakın</Text>
            </View>
            <Text style={styles.planPrice}>{plans.nearest.total} TL</Text>
          </View>
          <Text style={styles.marketName}>{getBranchName(plans.nearest.market)}</Text>
          {plans.nearest.items && (
            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12, marginTop: -8 }} numberOfLines={2}>
              {plans.nearest.items.map(i => i.name).join(', ')}
            </Text>
          )}
          <View style={styles.planDetailLine}>
            <Navigation size={16} color="#6B7280" />
            <Text style={[styles.planDetailText, { color: '#6B7280' }]}>{marketDistances && marketDistances[getMarketKey(plans.nearest.market)] ? `${marketDistances[getMarketKey(plans.nearest.market)].distance} km uzaklıkta` : `${plans.nearest.distance} uzaklıkta`}</Text>
          </View>
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={() => router.push('/plan-detay/nearest')}
          >
            <Text style={styles.btnOutlineText}>Planı Gör</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={[styles.planBadge, { backgroundColor: '#F3F4F6' }]}>
              <Scale size={14} color="#4B5563" />
              <Text style={{ color: '#4B5563', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>En Dengeli</Text>
            </View>
            <Text style={styles.planPrice}>{plans.balanced.total} TL</Text>
          </View>
          <Text style={styles.marketName}>{getBranchName(plans.balanced.market)}</Text>
          {plans.balanced.items && (
            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12, marginTop: -8 }} numberOfLines={2}>
              {plans.balanced.items.map(i => i.name).join(', ')}
            </Text>
          )}
          <View style={styles.planDetailLine}>
            <FileText size={16} color="#6B7280" />
            <Text style={[styles.planDetailText, { color: '#6B7280' }]}>{plans.balanced.notes}</Text>
          </View>
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={() => router.push('/plan-detay/balanced')}
          >
            <Text style={styles.btnOutlineText}>Planı Gör</Text>
          </TouchableOpacity>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1F1D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  btnPrimary: {
    backgroundColor: '#0A3B2B',
    paddingVertical: 16,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A3B2B',
    paddingVertical: 14,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  btnOutlineText: {
    color: '#0A3B2B',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A3B2B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  aiSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aiIcon: {
    backgroundColor: '#E6F4EA',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6B7280',
    marginBottom: 4,
  },
  aiText: {
    fontSize: 14,
    color: '#1A1F1D',
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  recommendedBadge: {
    backgroundColor: '#0A3B2B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1F1D',
  },
  marketName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1F1D',
    marginBottom: 12,
  },
  planDetailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planDetailText: {
    fontSize: 14,
    color: '#1A1F1D',
  },
  detectedItemsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F1D',
    marginBottom: 12,
  },
  detectedItemsScroll: {
    gap: 12,
  },
  detectedItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    width: 90,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detectedItemIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectedItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1F1D',
    textAlign: 'center',
    marginBottom: 2,
  },
  detectedItemQty: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});
