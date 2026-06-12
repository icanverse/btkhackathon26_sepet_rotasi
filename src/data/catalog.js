export const CATEGORIES = [
  "Tümü",
  "Süt & Kahvaltılık",
  "Sebze & Meyve",
  "Et & Tavuk",
  "Temel Gıda",
  "Atıştırmalık",
  "İçecek",
  "Temizlik",
  "Kişisel Bakım"
];

export const CATALOG = [
  // SÜT & KAHVALTILIK
  {
    id: "sut",
    name: "Süt",
    unit: "1 L",
    category: "Süt & Kahvaltılık",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Dost Tam Yağlı Süt", price: 29.50 },
      a101: { brand: "Birşah Tam Yağlı Süt", price: 29.50 },
      sok: { brand: "Mis Tam Yağlı Süt", price: 29.50 },
      migros: { brand: "İçim Tam Yağlı Süt", price: 34.50 }
    }
  },
  {
    id: "yumurta_30",
    name: "Yumurta",
    unit: "30'lu",
    category: "Süt & Kahvaltılık",
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Bili Bili M Boy Yumurta", price: 115.00 },
      a101: { brand: "Türem M Boy Yumurta", price: 116.00 },
      sok: { brand: "Anadolu M Boy Yumurta", price: 115.50 },
      migros: { brand: "Güres M Boy Yumurta", price: 135.00 }
    }
  },
  {
    id: "peynir_suzme",
    name: "Süzme Peynir",
    unit: "500g",
    category: "Süt & Kahvaltılık",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Binvezir Süzme Peynir", price: 79.50 },
      a101: { brand: "Ahir Süzme Peynir", price: 82.00 },
      sok: { brand: "Mis Süzme Peynir", price: 80.00 },
      migros: { brand: "Sütaş Süzme Peynir", price: 98.90 }
    }
  },
  {
    id: "peynir_kasar",
    name: "Taze Kaşar Peyniri",
    unit: "400g",
    category: "Süt & Kahvaltılık",
    image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Binvezir Kaşar Peyniri", price: 125.00 },
      a101: { brand: "Tarabya Kaşar Peyniri", price: 129.00 },
      sok: { brand: "Mis Kaşar Peyniri", price: 125.50 },
      migros: { brand: "İçim Kaşar Peyniri", price: 155.00 }
    }
  },
  {
    id: "tereyagi",
    name: "Tereyağı",
    unit: "250g",
    category: "Süt & Kahvaltılık",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Pervin Tereyağı", price: 89.50 },
      a101: { brand: "Karlıdağ Tereyağı", price: 92.00 },
      sok: { brand: "Mis Tereyağı", price: 90.00 },
      migros: { brand: "Sütaş Tereyağı", price: 105.00 }
    }
  },

  // TEMEL GIDA
  {
    id: "cay",
    name: "Siyah Çay",
    unit: "1 kg",
    category: "Temel Gıda",
    image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Berk Siyah Çay", price: 135.00 },
      a101: { brand: "Karadem Siyah Çay", price: 139.00 },
      sok: { brand: "Deren Siyah Çay", price: 136.00 },
      migros: { brand: "Çaykur Tiryaki", price: 169.00 }
    }
  },
  {
    id: "yag_aycicek_5",
    name: "Ayçiçek Yağı",
    unit: "5 L",
    category: "Temel Gıda",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Sole Ayçiçek Yağı", price: 225.00 },
      a101: { brand: "Vera Ayçiçek Yağı", price: 229.00 },
      sok: { brand: "Evin Ayçiçek Yağı", price: 226.00 },
      migros: { brand: "Yudum Ayçiçek Yağı", price: 265.00 }
    }
  },
  {
    id: "makarna",
    name: "Makarna",
    unit: "500g",
    category: "Temel Gıda",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Cardella Makarna", price: 14.50 },
      a101: { brand: "Bendo Makarna", price: 15.00 },
      sok: { brand: "Piyale Makarna", price: 14.50 },
      migros: { brand: "Barilla Makarna", price: 28.50 }
    }
  },
  {
    id: "pirinc",
    name: "Pirinç",
    unit: "1 kg",
    category: "Temel Gıda",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Efsane Osmancık Pirinç", price: 45.00 },
      a101: { brand: "Ovadan Osmancık Pirinç", price: 47.00 },
      sok: { brand: "Anadolu Mutfağı Pirinç", price: 46.00 },
      migros: { brand: "Yayla Osmancık Pirinç", price: 58.50 }
    }
  },
  {
    id: "salca",
    name: "Domates Salçası",
    unit: "830g",
    category: "Temel Gıda",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Tamek Salça", price: 34.50 },
      a101: { brand: "Öncü Salça", price: 36.00 },
      sok: { brand: "Bizim Vatan Salça", price: 35.00 },
      migros: { brand: "Tat Domates Salçası", price: 46.90 }
    }
  },

  // SEBZE & MEYVE
  {
    id: "domates",
    name: "Domates",
    unit: "1 kg",
    category: "Sebze & Meyve",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Salkım Domates", price: 29.50 },
      a101: { brand: "Salkım Domates", price: 28.00 },
      sok: { brand: "Salkım Domates", price: 29.00 },
      migros: { brand: "Salkım Domates", price: 34.90 }
    }
  },
  {
    id: "patates",
    name: "Patates",
    unit: "1 kg",
    category: "Sebze & Meyve",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Taze Patates", price: 15.00 },
      a101: { brand: "Taze Patates", price: 14.50 },
      sok: { brand: "Taze Patates", price: 15.50 },
      migros: { brand: "Taze Patates", price: 19.90 }
    }
  },
  {
    id: "sogan",
    name: "Soğan",
    unit: "1 kg",
    category: "Sebze & Meyve",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Kuru Soğan", price: 12.00 },
      a101: { brand: "Kuru Soğan", price: 12.50 },
      sok: { brand: "Kuru Soğan", price: 12.00 },
      migros: { brand: "Kuru Soğan", price: 16.50 }
    }
  },

  // TEMİZLİK & KİŞİSEL BAKIM
  {
    id: "deterjan",
    name: "Toz Deterjan",
    unit: "3 kg",
    category: "Temizlik",
    image: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Art Matik Deterjan", price: 85.00 },
      a101: { brand: "Tursil Deterjan", price: 89.00 },
      sok: { brand: "Mintax Deterjan", price: 87.00 },
      migros: { brand: "Omo Active Deterjan", price: 165.00 }
    }
  },
  {
    id: "tuvalet_kagidi",
    name: "Tuvalet Kağıdı",
    unit: "16'lı",
    category: "Temizlik",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Blume Tuvalet Kağıdı", price: 95.00 },
      a101: { brand: "Mistral Tuvalet Kağıdı", price: 99.00 },
      sok: { brand: "Confort Tuvalet Kağıdı", price: 96.00 },
      migros: { brand: "Familia Tuvalet Kağıdı", price: 145.00 }
    }
  },
  {
    id: "sampuan",
    name: "Şampuan",
    unit: "500 ml",
    category: "Kişisel Bakım",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop",
    options: {
      bim: { brand: "Capitol Şampuan", price: 45.00 },
      a101: { brand: "Blendax Şampuan", price: 48.50 },
      sok: { brand: "Ebru Şampuan", price: 46.00 },
      migros: { brand: "Elidor Şampuan", price: 95.00 }
    }
  }
];
