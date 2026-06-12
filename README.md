# 🛒 SepetRotası AI

> **Yapay Zekâ Destekli, Konum Farkındalıklı Akıllı Alışveriş ve Rota Asistanı**

SepetRotası AI, kullanıcıların alışveriş listelerini yapay zekâ ile analiz ederek bütçelerini ve zamanlarını koruyan akıllı bir mobil alışveriş asistanıdır. Kullanıcılar el yazısı listelerini veya eski fişlerini kameradan çekerek sisteme yükler; entegre Gemini AI bu ürünleri otomatik olarak tanır, yazım hatalarını tolere eder ve 4 büyük marketin (BİM, A101, ŞOK, Migros) güncel fiyatlarıyla karşılaştırır. Uygulama, canlı GPS verisi ve OpenStreetMap API'si ile kullanıcının çevresindeki en yakın market şubelerini tespit ederek **"En Ucuz"**, **"En Yakın"** ve **"En Dengeli"** olmak üzere üç farklı stratejik alışveriş planı sunar ve seçilen rotayı harita üzerinde çizer.

---

## ✨ Öne Çıkan Özellikler

| Özellik | Açıklama |
|---|---|
| 🧠 **AI Görüntü & Metin Analizi** | Fiş, el yazısı liste veya serbest metin girişini Gemini AI ile analiz eder, yazım hatalarını düzeltir ve ürünleri katalogla eşleştirir. |
| 📍 **Canlı Konum & Market Tarama** | GPS ile kullanıcının anlık konumunu alır, OpenStreetMap Nominatim API ile çevredeki market şubelerini gerçek zamanlı tarar ve mesafeleri hesaplar. |
| 💰 **Çoklu Plan Karşılaştırma** | Her analiz sonucunda "En Ucuz", "En Yakın" ve "En Dengeli" olmak üzere üç farklı alışveriş planı sunar; her planın ürün detayları, toplam tutar ve tahmini tasarruf bilgisi gösterilir. |
| 🗺️ **Harita & Rota Çizimi** | `react-native-maps` ile canlı harita üzerinde kullanıcı konumu ve market şubesi arasında rota çizer, Google Haritalar ile yol tarifi başlatır. |
| 🚶 **Ulaşım Modu Seçimi** | Yürüyüş, bisiklet ve araç modları arasında geçiş yapılabilir; her mod için mesafeye göre süre hesaplaması otomatik yapılır. |
| ♻️ **Sürdürülebilirlik & Oyunlaştırma** | Yürüyüş veya bisiklet tercih eden kullanıcılara "Eco Bonus" çarpanıyla ekstra topluluk puanı verilir. Tasarruf miktarına göre ek rozetler kazandırılır. |
| 🛡️ **Akıllı Fallback Algoritması** | API çökmesi veya market verisi bulunmayan bölgelerde, kullanıcının mevcut konumuna göre trigonometrik simülasyon koordinatları üreterek uygulamanın her koşulda çökmeden çalışmasını garanti eder. |
| 🔁 **Rate-Limit Toleransı** | 429 (Too Many Requests) ve 503 (Service Unavailable) hatalarını yakalar, otomatik retry mekanizması ile kesintisiz deneyim sağlar. |

---

## 🚀 Teknoloji Yığını (Tech Stack)

```
React Native + Expo SDK 54 (React 19)
├── Expo Router ─────────── Dosya tabanlı sayfa yönlendirme
├── Google Gemini Flash API ─ Görüntü & metin tabanlı yapay zekâ analizi
├── react-native-maps ────── Harita görselleştirme ve rota çizimi
├── expo-location ────────── GPS konum servisleri
├── OpenStreetMap Nominatim ─ Çevresel market arama (reverse geocoding)
├── expo-image-picker ────── Kamera ile fiş/liste fotoğrafı çekme
├── Lucide React Native ──── Modern ikon kütüphanesi
└── React Native Reanimated ─ Akıcı animasyonlar ve geçişler
```

---

## 📱 Uygulama Akışı

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  📝 Liste   │────▶│  🧠 AI       │────▶│  📊 Akıllı       │────▶│  🗺️ Rota &     │
│  Oluştur    │     │  Analiz      │     │  Plan Raporu     │     │  Puan Detay     │
│             │     │              │     │                  │     │                 │
│ • Metin yaz │     │ • Ürün tanıma│     │ • En Ucuz        │     │ • Canlı harita  │
│ • Fotoğraf  │     │ • Fiyat      │     │ • En Yakın       │     │ • Süre hesabı   │
│ • Katalog   │     │   hesaplama  │     │ • En Dengeli     │     │ • Eco puanlar   │
└─────────────┘     └──────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 🏗️ Proje Yapısı

```
src/
├── app/                        # Expo Router sayfa dosyaları
│   ├── (tabs)/                 # Ana tab navigasyonu
│   │   ├── _layout.js          # Tab bar yapılandırması
│   │   ├── index.js            # Liste oluşturma (Ana Ekran)
│   │   ├── planlar.js          # AI analiz sonuçları ve plan kartları
│   │   ├── kesfet.js           # Katalog tarama ve fiyat karşılaştırma
│   │   └── hesabim.js          # Kullanıcı profili ve ayarlar
│   ├── _layout.js              # Root layout ve context provider
│   ├── liste-yaz.js            # Serbest metin ile liste girişi
│   ├── kategori-sec.js         # Kategoriden ürün seçme ekranı
│   └── plan-detay/
│       └── [type].js           # Harita, rota çizimi ve puan hesaplama
├── context/
│   └── ShoppingPlanContext.js  # Global state yönetimi, AI entegrasyonu, konum servisleri
└── data/
    ├── catalog.js              # 16 ürünlük market fiyat katalogu (BİM, A101, ŞOK, Migros)
    └── market_locations.js     # İstanbul market şube koordinatları ve mesafe hesaplama
```

---

## 🛠️ Kurulum ve Çalıştırma

**Gereksinimler:** Node.js (v18+), npm, Expo Go uygulaması (telefonda)

```bash
# 1. Depoyu klonlayın
git clone https://github.com/KULLANICI_ADIN/sepet-rotasi.git
cd sepet-rotasi

# 2. Bağımlılıkları yükleyin
npm install --legacy-peer-deps

# 3. Ortam değişkenlerini ayarlayın
#    Proje kök dizininde bir .env dosyası oluşturun:
echo "EXPO_PUBLIC_GEMINI_API_KEY=buraya_kendi_api_anahtarinizi_yazin" > .env

# 4. Uygulamayı başlatın
npm start
```

> 📲 Terminal çıktısındaki QR kodu Expo Go uygulamasıyla tarayarak projeyi telefonunuzda çalıştırabilirsiniz.

---

## 🔑 API Anahtarı Alma

1. [Google AI Studio](https://aistudio.google.com/apikey) adresine gidin.
2. "Create API Key" butonuna tıklayın.
3. Oluşan anahtarı kopyalayıp `.env` dosyasına yapıştırın.

---

## 🔐 Güvenlik

- `.env` dosyası `.gitignore` ile korunmaktadır ve depoya yüklenmez.
- API anahtarlarını asla doğrudan kod içerisine yazmayın; ortam değişkenleri (`process.env`) üzerinden erişin.

---

## 📄 Lisans

Bu proje hackathon katılımı amacıyla geliştirilmiştir. Tüm hakları saklıdır.
