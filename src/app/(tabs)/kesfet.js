import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATALOG } from '../../data/catalog';
import { Search, ShoppingCart, Info, MapPin, CheckCircle, Send, Heart, ShieldAlert, ShieldCheck, Shield, MessageSquare } from 'lucide-react-native';
import { useShoppingPlan } from '../../context/ShoppingPlanContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const analyzeComment = (text) => {
    if (!text) return { trustScore: 0, isSpam: true };
    const lowerText = text.toLowerCase();

    const isRepeated = /(.)\1{4,}/.test(lowerText);
    const isAllCaps = text === text.toUpperCase() && text.replace(/[^A-Z]/g, '').length > 5;
    const isShort = text.trim().length < 5;
    const isAd = /indirim|kampanya|fırsat|ucuz|satılık|koşun/i.test(lowerText);

    if (isRepeated || isAllCaps || isShort) return { trustScore: Math.max(0, Math.random() * 0.3), isSpam: true };
    if (isAd) return { trustScore: 0.4 + Math.random() * 0.3, isSpam: false };
    if (text.length > 30) return { trustScore: 0.7 + Math.random() * 0.3, isSpam: false };

    return { trustScore: 0.4 + Math.random() * 0.3, isSpam: false };
};

const initialComments = [
    { id: '1', text: 'Migros bugün çok kalabalıktı ama sebzeler tazeydi. Özellikle domatesler harika.', trustScore: 0.92, likes: 12, createdAt: new Date(Date.now() - 3600000) },
    { id: '2', text: 'A101 indirim var koşun', trustScore: 0.45, likes: 3, createdAt: new Date(Date.now() - 7200000) },
    { id: '3', text: 'www.ucuz-al-ver.com HEMEN TIKLA KAZAN', trustScore: 0.12, likes: 0, createdAt: new Date(Date.now() - 86400000) }
];

export default function KesfetScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToShoppingList, marketDistances } = useShoppingPlan();

    const [comments, setComments] = useState(initialComments);
    const [newCommentText, setNewCommentText] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredCatalog = CATALOG.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddComment = () => {
        if (!newCommentText.trim()) return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const { trustScore } = analyzeComment(newCommentText);
        const newPost = {
            id: Date.now().toString(),
            text: newCommentText,
            trustScore,
            likes: 0,
            createdAt: new Date()
        };
        setComments([newPost, ...comments]);
        setNewCommentText('');
    };

    const handleLike = (id) => {
        setComments(comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
    };

    const getTrustBadge = (score) => {
        if (score >= 0.7) return { color: '#10B981', label: 'Yüksek Güven', bg: '#D1FAE5', icon: ShieldCheck };
        if (score >= 0.4) return { color: '#F59E0B', label: 'Orta', bg: '#FEF3C7', icon: Shield };
        return { color: '#EF4444', label: 'Düşük Güven', bg: '#FEE2E2', icon: ShieldAlert };
    };

    const filteredComments = comments.filter(c => {
        if (filterType === 'High') return c.trustScore >= 0.7;
        if (filterType === 'Low') return c.trustScore < 0.4;
        return true;
    });

    const renderCommunityFeed = () => {
        return (
            <View style={styles.feedContainer}>
                <View style={styles.feedHeader}>
                    <MessageSquare size={20} color="#1A1F1D" />
                    <Text style={styles.feedTitle}>Topluluk Akışı</Text>
                </View>

                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Bir yorum yaz..."
                        value={newCommentText}
                        onChangeText={setNewCommentText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.postButton, !newCommentText.trim() && styles.postButtonDisabled]}
                        onPress={handleAddComment}
                        disabled={!newCommentText.trim()}
                    >
                        <Send size={16} color="white" />
                        <Text style={styles.postButtonText}>Paylaş</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterBtn, filterType === 'All' && styles.filterBtnActive]}
                        onPress={() => setFilterType('All')}
                    >
                        <Text style={[styles.filterBtnText, filterType === 'All' && styles.filterBtnTextActive]}>Tümü</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterBtn, filterType === 'High' && styles.filterBtnActive]}
                        onPress={() => setFilterType('High')}
                    >
                        <Text style={[styles.filterBtnText, filterType === 'High' && styles.filterBtnTextActive]}>Güvenilir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterBtn, filterType === 'Low' && styles.filterBtnActive]}
                        onPress={() => setFilterType('Low')}
                    >
                        <Text style={[styles.filterBtnText, filterType === 'Low' && styles.filterBtnTextActive]}>Düşük</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.commentsList}>
                    {filteredComments.map(comment => {
                        const badge = getTrustBadge(comment.trustScore);
                        const BadgeIcon = badge.icon;
                        return (
                            <View key={comment.id} style={styles.commentCard}>
                                <View style={styles.commentHeader}>
                                    <View style={[styles.trustBadge, { backgroundColor: badge.bg }]}>
                                        <BadgeIcon size={12} color={badge.color} style={{ marginRight: 4 }} />
                                        <Text style={[styles.trustBadgeText, { color: badge.color }]}>
                                            {badge.label} ({(comment.trustScore * 100).toFixed(0)}%)
                                        </Text>
                                    </View>
                                    <Text style={styles.timeText}>
                                        {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>{comment.text}</Text>
                                <View style={styles.commentFooter}>
                                    <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(comment.id)}>
                                        <Heart size={16} color={comment.likes > 0 ? '#EF4444' : '#6B7280'} fill={comment.likes > 0 ? '#EF4444' : 'transparent'} />
                                        <Text style={[styles.likeText, comment.likes > 0 && { color: '#EF4444' }]}>{comment.likes}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const renderSearchState = () => {
        return (
            <View style={styles.searchResultsContainer}>
                {(!searchTerm && !selectedProduct) && (
                    <Text style={styles.sectionTitleProducts}>Ürünler</Text>
                )}
                <View style={styles.searchResults}>
                    {filteredCatalog.map(product => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.searchResultItem}
                            onPress={() => setSelectedProduct(product)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.resultImage}>
                                <Image source={{ uri: product.image }} style={{ width: 40, height: 40, borderRadius: 8 }} />
                            </View>
                            <View style={styles.resultInfo}>
                                <Text style={styles.resultName}>{product.name}</Text>
                                <Text style={styles.resultUnit}>{product.unit}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {filteredCatalog.length === 0 && (
                        <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>Ürün bulunamadı.</Text>
                    )}
                </View>
            </View>
        );
    };

    const renderProductComparison = () => {
        if (!selectedProduct) return null;

        const getDist = (key) => marketDistances && marketDistances[key] ? marketDistances[key].distance : "0.0";

        const prices = [
            { market: 'BİM', price: selectedProduct.options.bim.price, brand: selectedProduct.options.bim.brand, logo: 'B', distance: getDist('bim') },
            { market: 'A101', price: selectedProduct.options.a101.price, brand: selectedProduct.options.a101.brand, logo: 'A', distance: getDist('a101') },
            { market: 'ŞOK', price: selectedProduct.options.sok.price, brand: selectedProduct.options.sok.brand, logo: 'Ş', distance: getDist('sok') },
            { market: 'Migros', price: selectedProduct.options.migros.price, brand: selectedProduct.options.migros.brand, logo: 'M', distance: getDist('migros') },
        ].sort((a, b) => a.price - b.price);

        const minDistance = Math.min(...prices.map(p => parseFloat(p.distance)));

        return (
            <View style={styles.comparisonContainer}>
                <TouchableOpacity style={styles.backToListBtn} onPress={() => setSelectedProduct(null)}>
                    <Text style={styles.backToListText}>← Listeye Dön</Text>
                </TouchableOpacity>
                <View style={styles.productHeader}>
                    <View style={styles.largeImage}>
                        <Image source={{ uri: selectedProduct.image }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1F1D' }}>
                            {selectedProduct.name} {selectedProduct.unit}
                        </Text>
                        <View style={styles.recommendedBadgeProduct}>
                            <Text style={{ color: 'white', fontSize: 11 }}>Önerilen</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 }}>
                            <CheckCircle size={14} color="#0A3B2B" />
                            <Text style={{ fontSize: 12, color: '#0A3B2B' }}>Yüksek eşleşme doğruluğu</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Fiyatlar</Text>

                {prices.map((p, index) => (
                    <View key={p.market} style={styles.priceCard}>
                        <View style={styles.marketLogo}>
                            <Text style={{ fontWeight: '700', color: '#1A1F1D', fontSize: 18 }}>{p.logo}</Text>
                        </View>
                        <View style={styles.marketInfo}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{ fontWeight: '700', fontSize: 16, color: '#1A1F1D' }}>{p.market}</Text>
                                {index === 0 && (
                                    <View style={styles.cheapestBadge}>
                                        <Text style={{ color: '#0A3B2B', fontSize: 10, fontWeight: '700' }}>En ucuz</Text>
                                    </View>
                                )}
                                {parseFloat(p.distance) === minDistance && (
                                    <View style={styles.nearestBadge}>
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>En yakın</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 13, color: '#4B5563', marginTop: 2 }}>{p.brand}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                <MapPin size={12} color="#6B7280" />
                                <Text style={{ fontSize: 12, color: '#6B7280' }}>{p.distance} km</Text>
                            </View>
                        </View>
                        <View style={styles.priceValue}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0A3B2B' }}>{p.price} TL</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.communityNotes}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Info size={18} color="#0A3B2B" />
                        <Text style={{ fontWeight: '600', color: '#0A3B2B', fontSize: 16 }}>Topluluk Notları</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        <View style={styles.noteTag}>
                            <Info size={14} color="#1A1F1D" />
                            <Text style={styles.noteTagText}>Kasada indirim</Text>
                        </View>
                        <View style={styles.noteTag}>
                            <CheckCircle size={14} color="#1A1F1D" />
                            <Text style={styles.noteTagText}>2 Doğrulama</Text>
                        </View>
                    </ScrollView>
                </View>

                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => {
                        addToShoppingList(selectedProduct, 1);
                        alert(`${selectedProduct.name} listeye eklendi!`);
                    }}
                >
                    <ShoppingCart size={18} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.btnPrimaryText}>Alışveriş listeme ekle</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.searchWrapper}>
                    <Search size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Süt..."
                        value={searchTerm}
                        onChangeText={(text) => {
                            setSearchTerm(text);
                            if (selectedProduct) setSelectedProduct(null);
                        }}
                    />
                </View>

                {!selectedProduct && renderCommunityFeed()}
                {!selectedProduct ? renderSearchState() : renderProductComparison()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
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
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1F1D',
    },
    emptyState: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchResultsContainer: {
        marginTop: 16,
    },
    sectionTitleProducts: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1F1D',
        marginBottom: 16,
    },
    searchResults: {
        gap: 12,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    resultImage: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    resultInfo: {
        flex: 1,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1F1D',
        marginBottom: 4,
    },
    resultUnit: {
        fontSize: 13,
        color: '#6B7280',
    },
    comparisonContainer: {
        flex: 1,
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
    },
    largeImage: {
        width: 80,
        height: 80,
        backgroundColor: '#F3F4F6',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    recommendedBadgeProduct: {
        backgroundColor: '#0A3B2B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1F1D',
        marginBottom: 16,
    },
    priceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    marketLogo: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    marketInfo: {
        flex: 1,
    },
    cheapestBadge: {
        backgroundColor: '#C5E86C',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    nearestBadge: {
        backgroundColor: '#0A3B2B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priceValue: {
        marginLeft: 16,
    },
    communityNotes: {
        marginTop: 24,
        marginBottom: 32,
    },
    noteTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        gap: 6,
    },
    noteTagText: {
        fontSize: 13,
        color: '#1A1F1D',
        fontWeight: '500',
    },
    btnPrimary: {
        backgroundColor: '#0A3B2B',
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backToListBtn: {
        paddingVertical: 8,
        marginBottom: 12,
    },
    backToListText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    feedContainer: {
        marginBottom: 24,
    },
    feedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    feedTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1F1D',
    },
    commentInputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    commentInput: {
        fontSize: 15,
        color: '#1A1F1D',
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    postButton: {
        backgroundColor: '#0A3B2B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignSelf: 'flex-end',
        gap: 6,
    },
    postButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    postButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#F3F4F6',
    },
    filterBtnActive: {
        backgroundColor: '#0A3B2B',
    },
    filterBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    filterBtnTextActive: {
        color: '#FFFFFF',
    },
    commentsList: {
        gap: 12,
    },
    commentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    trustBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    commentText: {
        fontSize: 15,
        color: '#1A1F1D',
        lineHeight: 22,
        marginBottom: 12,
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 4,
    },
    likeText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
});
