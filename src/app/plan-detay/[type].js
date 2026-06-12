import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useShoppingPlan } from '../../context/ShoppingPlanContext';
import {
  ArrowLeft,
  Navigation,
  Footprints,
  Bike,
  Car,
  Trophy,
  Leaf,
  Flame,
  PiggyBank,
  MapPin,
  Clock,
  Route,
  ChevronRight,
} from 'lucide-react-native';

// ─── Sabitler ───────────────────────────────────────────────────────────────

const BRAND_GREEN = '#0A3B2B';
const LIME = '#C5E86C';

/**
 * Mesafeye göre yürüyüş süresi hesapla (ortalama 80 m/dk).
 * @param {number} distanceKm
 */
const walkMinutes = (distanceKm) => Math.round((distanceKm * 1000) / 80);

/**
 * Bisiklet: ~250 m/dk, Araç: ~400 m/dk
 */
const bikeMinutes = (distanceKm) => Math.round((distanceKm * 1000) / 250);
const carMinutes  = (distanceKm) => Math.max(2, Math.round((distanceKm * 1000) / 400));

/**
 * Yürüyüş/bisiklet süresine göre puan çarpanı.
 * Araç için sabit x1.0.
 */
const WALK_MULTIPLIERS = [
  { label: '≤2 dk',  maxMinutes: 2,   mult: 2.0 },
  { label: '≤5 dk',  maxMinutes: 5,   mult: 1.7 },
  { label: '≤10 dk', maxMinutes: 10,  mult: 1.5 },
  { label: '≤20 dk', maxMinutes: 20,  mult: 1.2 },
  { label: '>20 dk', maxMinutes: 9999, mult: 1.0 },
];

const getMultiplier = (minutes) =>
  WALK_MULTIPLIERS.find((m) => minutes <= m.maxMinutes) ||
  WALK_MULTIPLIERS[WALK_MULTIPLIERS.length - 1];

/** Alışveriş toplamından baz puan: her 5 TL = 1 puan, max 200 */
const calcBasePoints = (total) => Math.min(200, Math.round(total / 5));

// ─── Market key yardımcısı ───────────────────────────────────────────────────

const getMarketKey = (name) => {
  if (!name) return 'bim';
  const u = name.toUpperCase();
  if (u.includes('BİM') || u.includes('BIM')) return 'bim';
  if (u.includes('A101')) return 'a101';
  if (u.includes('ŞOK') || u.includes('SOK')) return 'sok';
  if (u.includes('MİGROS') || u.includes('MIGROS')) return 'migros';
  return 'bim';
};

/**
 * Mesafe değerini her formattan ("0.3 km", "0.3", 0.3) güvenli şekilde km sayısına çevirir.
 */
const parseKm = (val) => {
  if (val == null) return null;
  const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(n) || n <= 0 ? null : n;
};

// ─── Animasyonlu sayaç bileşeni ─────────────────────────────────────────────

function AnimatedNumber({ value, style }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: value,
      duration: 600,
      useNativeDriver: false,
    }).start();

    const listener = animVal.addListener(({ value: v }) => {
      setDisplayed(Math.round(v));
    });
    return () => animVal.removeListener(listener);
  }, [value]);

  return <Text style={style}>{displayed}</Text>;
}

// ─── Ulaşım modu tab bileşeni ────────────────────────────────────────────────

function ModeTab({ mode, activeMode, onPress, label, Icon }) {
  const isActive = mode === activeMode;
  return (
    <TouchableOpacity
      style={[styles.modeTab, isActive && styles.modeTabActive]}
      onPress={() => onPress(mode)}
      activeOpacity={0.7}
    >
      <Icon size={16} color={isActive ? BRAND_GREEN : '#6B7280'} />
      <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Çarpan şerit bileşeni ───────────────────────────────────────────────────

function MultiplierTrack({ minutes, isCar }) {
  if (isCar) {
    return (
      <View style={styles.carMultiplierBox}>
        <Text style={styles.carMultiplierText}>
          Araçla giderken baz çarpan uygulanır (x1.0).
          Yürüyerek veya bisikletle daha fazla puan kazan! 🚶
        </Text>
      </View>
    );
  }

  const active = getMultiplier(minutes);

  return (
    <View style={styles.multTrack}>
      {WALK_MULTIPLIERS.map((m, i) => {
        const isCurrent = m === active;
        const isPast    = m.mult > active.mult;
        return (
          <View key={i} style={styles.multStep}>
            <View
              style={[
                styles.multBar,
                isPast    && styles.multBarPast,
                isCurrent && styles.multBarCurrent,
              ]}
            />
            <Text style={[styles.multVal, isCurrent && styles.multValActive]}>
              x{m.mult.toFixed(1)}
            </Text>
            <Text style={styles.multLabel}>{m.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Bonus chip bileşeni ─────────────────────────────────────────────────────

function BonusChip({ Icon, label, value, earned }) {
  return (
    <View style={[styles.bonusChip, earned && styles.bonusChipEarned]}>
      <View style={styles.bonusChipIconRow}>
        <Icon size={16} color={earned ? BRAND_GREEN : '#9CA3AF'} />
      </View>
      <Text style={styles.bonusChipLabel} numberOfLines={2}>{label}</Text>
      <Text style={[styles.bonusChipVal, earned && styles.bonusChipValEarned]}>
        {earned ? `+${value}` : '—'}
      </Text>
    </View>
  );
}

// ─── Ana ekran ───────────────────────────────────────────────────────────────

export default function RotaPuanScreen() {
  const { type } = useLocalSearchParams();
  const { analysisResult, marketDistances, userCoords } = useShoppingPlan();

  const [travelMode, setTravelMode] = useState('walk');

  if (!analysisResult || !analysisResult.plans || !analysisResult.plans[type]) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Plan bulunamadı.</Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 16 }}>
            <Text style={{ color: BRAND_GREEN, fontWeight: '600' }}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const plan      = analysisResult.plans[type] || {};
  const marketKey = getMarketKey(plan.market || '');
  const branch    = marketDistances?.[marketKey] ?? null;
  // Önce gerçek GPS mesafesini (branch.distance), yoksa Gemini tahminini (plan.distance) kullan
  const distKm    = parseKm(branch?.distance) ?? parseKm(plan.distance) ?? 1.2;

  // ── Süre hesapları
  const walkMins = walkMinutes(distKm);
  const bikeMins = bikeMinutes(distKm);
  const carMins  = carMinutes(distKm);

  const currentMinutes = travelMode === 'walk' ? walkMins
                       : travelMode === 'bike' ? bikeMins
                       : carMins;

  const isCar = travelMode === 'car';

  // ── Puan hesapları
  const basePoints   = calcBasePoints(plan.total || 0);
  const multiplier   = isCar ? { mult: 1.0, label: 'x1.0' } : getMultiplier(currentMinutes);
  const earnedPoints = Math.round(basePoints * multiplier.mult);

  // Bonus puanlar
  const ecoBonus     = !isCar ? Math.round(basePoints * 0.15) : 0;
  const streakBonus  = 10; // sabit — context'ten alınabilir
  const saverBonus   = (plan.savings || 0) > 0 ? 20 : 0;
  const totalPoints  = (earnedPoints || 0) + ecoBonus + streakBonus + saverBonus;

  // ── Google Maps yol tarifi
  const openMap = () => {
    const travelParam = travelMode === 'bike' ? 'bicycling'
                      : travelMode === 'car'  ? 'driving'
                      : 'walking';

    let url = `https://www.google.com/maps/dir/?api=1`;
    if (userCoords) {
      url += `&origin=${userCoords.latitude},${userCoords.longitude}`;
    }
    if (branch?.lat) {
      url += `&destination=${branch.lat},${branch.lng}&travelmode=${travelParam}`;
    } else {
      url += `&destination=${encodeURIComponent(plan.market + ' market')}&travelmode=${travelParam}`;
    }
    Linking.openURL(url);
  };

  const marketDisplayName = branch?.branchName ?? plan.market ?? 'Bilinmeyen Market';
  const distLabel = distKm < 1
    ? `${Math.round(distKm * 1000)} m`
    : `${distKm.toFixed(1)} km`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1A1F1D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rotana Git & Puan Kazan</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Harita kartı ──────────────────────────────────────────────── */}
        <View style={styles.mapCard}>
          {/* Dinamik harita canvas'ı */}
          <View style={styles.mapPlaceholder}>
            <MapCanvas
              marketName={marketDisplayName}
              distKm={distKm}
              travelMode={travelMode}
              userCoords={userCoords}
              branch={branch}
            />

            {/* Alt sol: seçili moda göre süre pill'i */}
            <View style={styles.mapTimePill}>
              {travelMode === 'walk' && <Footprints size={14} color="#FFFFFF" />}
              {travelMode === 'bike' && <Bike size={14} color="#FFFFFF" />}
              {travelMode === 'car'  && <Car  size={14} color="#FFFFFF" />}
              <Text style={styles.mapTimePillText}>
                {travelMode === 'walk' && `${walkMins} dk yürüyüş`}
                {travelMode === 'bike' && `${bikeMins} dk bisiklet`}
                {travelMode === 'car'  && `${carMins} dk araç`}
              </Text>
            </View>

            {/* Sağ alt: yol tarifi butonu */}
            <TouchableOpacity style={styles.mapNavBtnTransparent} onPress={openMap} activeOpacity={0.85}>
              <Text style={styles.mapNavBtnTransparentText}>📍 Yol Tarifi</Text>
            </TouchableOpacity>
          </View>

          {/* Rota istatistikleri (Dikey Layout) */}
          <View style={styles.routeStatsCol}>
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>MESAFE</Text>
              <Text style={styles.statColValBig}>{distKm < 1 ? Math.round(distKm * 1000) : distKm.toFixed(1)} <Text style={styles.statColUnit}>{distKm < 1 ? 'metre' : 'km'}</Text></Text>
            </View>
            <View style={styles.statColDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>YÜRÜYÜŞ</Text>
              <Text style={styles.statColValBig}>{walkMins} <Text style={styles.statColUnit}>dakika</Text></Text>
            </View>
            <View style={styles.statColDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>ARAÇ</Text>
              <Text style={styles.statColValBig}>{carMins} <Text style={styles.statColUnit}>dakika</Text></Text>
            </View>
          </View>
        </View>

        {/* ── Ulaşım modu seçici ─────────────────────────────────────────── */}
        <View style={styles.modeTabs}>
          <ModeTab mode="walk" activeMode={travelMode} onPress={setTravelMode} label="Yürüyerek" Icon={Footprints} />
          <ModeTab mode="bike" activeMode={travelMode} onPress={setTravelMode} label="Bisiklet" Icon={Bike} />
          <ModeTab mode="car"  activeMode={travelMode} onPress={setTravelMode} label="Araçla" Icon={Car} />
        </View>

        {/* ── Puan kartı ────────────────────────────────────────────────── */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={styles.rewardTitleRow}>
              <Trophy size={18} color={BRAND_GREEN} />
              <Text style={styles.rewardTitle}>Kazanılacak Puan</Text>
            </View>
            <View style={styles.communityBadge}>
              <Text style={styles.communityBadgeText}>Topluluk Puanı</Text>
            </View>
          </View>

          {/* Çarpan şeridi */}
          <MultiplierTrack minutes={currentMinutes} isCar={isCar} />

          {/* Ana puan göstergesi */}
          <View style={styles.pointsDisplay}>
            <View style={styles.pointsDisplayLeft}>
              <Text style={styles.pointsLabel}>Bu alışverişten</Text>
              <Text style={styles.pointsCalc}>
                <Text style={{fontWeight: '700', color: '#1A1F1D'}}>{basePoints} baz</Text> x <Text style={{fontWeight: '700', color: '#1A1F1D'}}>{isCar ? 'x1.0' : `x${multiplier.mult.toFixed(1)}`}</Text> çarpan
              </Text>
            </View>
            <View style={styles.pointsBig}>
              <AnimatedNumber value={earnedPoints} style={styles.pointsNumber} />
              <Text style={styles.pointsUnit}>puan</Text>
            </View>
          </View>

          {/* Bonus chip'ler */}
          <View style={styles.bonusRow}>
            <BonusChip
              Icon={Leaf}
              label="Sürdürülebilir"
              value={`${ecoBonus} puan`}
              earned={!isCar}
            />
            <BonusChip
              Icon={Flame}
              label="3 günlük seri"
              value={`${streakBonus} puan`}
              earned={true}
            />
            <BonusChip
              Icon={PiggyBank}
              label="Tasarruf"
              value={`${saverBonus} puan`}
              earned={saverBonus > 0}
            />
          </View>

          {/* Toplam çizgisi */}
          <View style={styles.totalPointsRow}>
            <Text style={styles.totalPointsLabel}>Toplam kazanç</Text>
            <View style={styles.totalPointsPill}>
              <AnimatedNumber value={totalPoints} style={styles.totalPointsNum} />
              <Text style={styles.totalPointsUnit}> puan</Text>
            </View>
          </View>
        </View>

        {/* ── Topluluk sıralaması ────────────────────────────────────────── */}
        <View style={styles.leaderboardCard}>
          <View style={styles.lbLeft}>
            <View style={styles.lbAvatars}>
              {['A', 'M', 'K'].map((initial, i) => (
                <View
                  key={i}
                  style={[
                    styles.lbAvatar,
                    { backgroundColor: ['#eaf3de', '#e6f1fb', '#faeeda'][i] },
                    i > 0 && { marginLeft: -8 },
                  ]}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151' }}>
                    {initial}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.lbText}>
              <Text style={{ fontWeight: '600', color: '#1A1F1D' }}>Bu hafta 24 kişi yürüyerek</Text> alışveriş yaptı
            </Text>
          </View>
          <View style={styles.lbRank}>
            <Text style={styles.lbRankText}>{isCar ? '#12 sıranda' : '#4 sıranda'}</Text>
            <ChevronRight size={16} color={BRAND_GREEN} />
          </View>
        </View>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.ctaBtn} onPress={openMap} activeOpacity={0.85}>
          <Navigation size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Rotayı Başlat</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Puanlar alışverişini tamamladıktan sonra hesabına eklenir.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Yardımcı bileşenler ─────────────────────────────────────────────────────

function RouteStat({ label, value, Icon, highlight }) {
  return (
    <View style={styles.routeStat}>
      <Icon size={14} color={highlight ? BRAND_GREEN : '#9CA3AF'} />
      <Text style={[styles.routeStatVal, highlight && { color: BRAND_GREEN, fontWeight: '700' }]}>
        {value}
      </Text>
      <Text style={styles.routeStatLabel}>{label}</Text>
    </View>
  );
}

function MapCanvas({ marketName, distKm, travelMode, userCoords, branch }) {
  if (!userCoords || !branch || !branch.lat || !branch.lng) {
    return (
      <View style={[styles.mapBg, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: '#6B7280', fontSize: 13}}>Gerçek harita verisi yükleniyor...</Text>
      </View>
    );
  }

  // Kullanıcı ve market arasındaki orta noktayı hesapla
  const midLat = (userCoords.latitude + branch.lat) / 2;
  const midLng = (userCoords.longitude + branch.lng) / 2;

  // Mesafeye göre zoom seviyesini (delta) ayarla
  const latDelta = Math.max(0.01, distKm * 0.015);
  const lngDelta = Math.max(0.01, distKm * 0.015);

  const routeColor = travelMode === 'car' ? '#EF4444' : travelMode === 'bike' ? '#F59E0B' : BRAND_GREEN;

  return (
    <View style={styles.mapBg}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
        showsUserLocation={false}
      >
        {/* Kullanıcı Konumu */}
        <Marker coordinate={{ latitude: userCoords.latitude, longitude: userCoords.longitude }}>
          <View style={styles.userPin}>
            <View style={styles.userPinInner} />
            <View style={styles.userPinRipple} />
          </View>
        </Marker>

        {/* Market Konumu */}
        <Marker coordinate={{ latitude: branch.lat, longitude: branch.lng }}>
          <View style={[styles.marketPinCircle, { borderColor: routeColor, backgroundColor: LIME }]}>
            <Text style={styles.marketPinText}>{marketName.charAt(0).toUpperCase()}</Text>
          </View>
        </Marker>

        {/* Aralarındaki düz çizgi (Basit Rota) */}
        <Polyline
          coordinates={[
            { latitude: userCoords.latitude, longitude: userCoords.longitude },
            { latitude: branch.lat, longitude: branch.lng }
          ]}
          strokeColor={routeColor}
          strokeWidth={3}
          lineDashPattern={[5, 5]}
        />
      </MapView>

      {/* Mesafe etiketi */}
      <View style={styles.distanceBadge}>
        <Text style={styles.distanceBadgeText}>
          {distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`}
        </Text>
      </View>
    </View>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1F1D',
  },

  // Container
  container: { padding: 16, paddingBottom: 40, gap: 12 },

  // Harita kartı
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  mapPlaceholder: {
    height: 190,
    position: 'relative',
  },
  mapBg: { flex: 1, backgroundColor: '#DCE8DC', overflow: 'hidden' },
  mapRoad: { position: 'absolute', backgroundColor: '#C5D6C5' },
  mapRoadLight: { position: 'absolute', backgroundColor: '#CCDACC', opacity: 0.6 },
  mapBlock: {
    position: 'absolute',
    backgroundColor: '#B5C9B5',
    borderRadius: 3,
  },
  routeDotRow: {
    position: 'absolute',
    top: '42%',
    left: '14%',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
  },
  routeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: BRAND_GREEN,
  },
  userPin: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  userPinRipple: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    opacity: 0.3,
  },
  marketPin: {
    position: 'absolute',
    top: '25%',
    right: '18%',
    alignItems: 'center',
  },
  marketPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: LIME,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketPinText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_GREEN,
  },
  marketNameBalloon: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    maxWidth: 80,
  },
  marketNameBalloonText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1A1F1D',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1F1D',
  },
  mapTimePill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapTimePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mapNavBtnTransparent: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapNavBtnTransparentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1F1D',
  },

  // Rota istatistikleri (Yeni)
  routeStatsCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  statCol: {
    flex: 1,
    justifyContent: 'center',
  },
  statColLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statColValBig: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F1D',
  },
  statColUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  statColDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },

  // Mod tabları
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modeTabActive: {
    borderColor: BRAND_GREEN,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  modeTabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  modeTabTextActive: {
    color: BRAND_GREEN,
    fontWeight: '600',
  },

  // Puan kartı
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1F1D',
  },
  communityBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  communityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },

  // Çarpan şerit
  multTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  multStep: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  multBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  multBarPast: {
    backgroundColor: BRAND_GREEN,
  },
  multBarCurrent: {
    backgroundColor: LIME,
  },
  multVal: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  multValActive: {
    color: BRAND_GREEN,
    fontWeight: '700',
    fontSize: 12,
  },
  multLabel: {
    fontSize: 9,
    color: '#D1D5DB',
  },
  carMultiplierBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  carMultiplierText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Puan göstergesi
  pointsDisplay: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsDisplayLeft: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  pointsCalc: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  pointsBig: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  pointsNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: BRAND_GREEN,
  },
  pointsUnit: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Bonus chip'ler
  bonusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bonusChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  bonusChipIconRow: {
    marginBottom: 2,
  },
  bonusChipEarned: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  bonusChipLabel: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  bonusChipVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  bonusChipValEarned: {
    color: BRAND_GREEN,
  },

  // Toplam puan çizgisi
  totalPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalPointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1F1D',
  },
  totalPointsPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: LIME,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
  },
  totalPointsNum: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_GREEN,
  },
  totalPointsUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_GREEN,
  },

  // Sıralama kartı
  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lbLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  lbAvatars: { flexDirection: 'row' },
  lbAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbText: { fontSize: 13, color: '#6B7280', flex: 1 },
  lbRank: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  lbRankText: { fontSize: 13, fontWeight: '600', color: BRAND_GREEN },

  // CTA
  ctaBtn: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 99,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  footnote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});