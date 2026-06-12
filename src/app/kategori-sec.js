import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useShoppingPlan } from '../context/ShoppingPlanContext';
import { CATEGORIES, CATALOG } from '../data/catalog';
import { Search, ArrowLeft, Plus, Minus, Check, Sparkles } from 'lucide-react-native';

export default function KategoriSecScreen() {
  const { shoppingList, addToShoppingList, updateQuantity, analyzeList, isAnalyzing } = useShoppingPlan();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const insets = useSafeAreaInsets();

  const filteredCatalog = CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Tümü' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getQuantity = (productId) => {
    const item = shoppingList.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAnalyze = async () => {
    await analyzeList();
    router.replace('/planlar');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1A1F1D" />
        </TouchableOpacity>
        <Text style={styles.title}>Kategoriden Seç</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchWrapper}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Ürün ara..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.activeCategoryChip]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.productGrid}>
        <View style={styles.row}>
          {filteredCatalog.map((product, index) => {
            const quantity = getQuantity(product.id);
            const isSelected = quantity > 0;

            return (
              <View key={product.id} style={[styles.productCard, isSelected && styles.selectedCard]}>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Check size={14} color="white" strokeWidth={3} />
                  </View>
                )}
                
                <View style={styles.imagePlaceholder}>
                  <Image source={{ uri: product.image }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                </View>
                
                <View style={styles.productBadge}>
                  <Text style={styles.productBadgeText}>{product.category}</Text>
                </View>
                
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productUnit}>{product.unit}</Text>
                
                {isSelected ? (
                  <View style={styles.quantityControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, quantity - 1)}>
                      <Minus size={16} color="#0A3B2B"/>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, quantity + 1)}>
                      <Plus size={16} color="#0A3B2B"/>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => addToShoppingList(product, 1)}
                  >
                    <Plus size={16} color="#1A1F1D" style={{ marginRight: 4 }} /> 
                    <Text style={styles.addBtnText}>Ekle</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {shoppingList.length > 0 && (
        <View style={[styles.bottomBar, { bottom: Math.max(insets.bottom + 10, 20) }]}>
          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountLabel}>Seçilen:</Text>
            <Text style={styles.selectedCountValue}>{shoppingList.reduce((acc, item) => acc + item.quantity, 0)}</Text>
          </View>
          <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
            ) : (
              <Sparkles size={18} color="white" style={{ marginRight: 8 }} /> 
            )}
            <Text style={styles.analyzeBtnText}>
              {isAnalyzing ? 'Analiz Ediliyor...' : 'Listeyi Analiz Et'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1F1D',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activeCategoryChip: {
    backgroundColor: '#0A3B2B',
    borderColor: '#0A3B2B',
  },
  categoryText: {
    color: '#1A1F1D',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  productGrid: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#0A3B2B',
    backgroundColor: '#F0FDF4',
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0A3B2B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  productBadgeText: {
    color: '#1A1F1D',
    fontSize: 10,
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1A1F1D',
    textAlign: 'center',
  },
  productUnit: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  addBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#1A1F1D',
    fontWeight: '600',
    fontSize: 14,
  },
  quantityControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  qtyBtn: {
    backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  qtyText: {
    fontWeight: '600',
    color: '#0A3B2B',
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  selectedCountLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedCountValue: {
    fontSize: 16,
    color: '#0A3B2B',
    fontWeight: '700',
  },
  analyzeBtn: {
    backgroundColor: '#0A3B2B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
