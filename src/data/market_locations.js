export const MARKET_LOCATIONS = [
  // A101
  { id: "a101_1", market: "A101", branchName: "A101 Kadıköy Rıhtım", address: "Kadıköy Rıhtım, İstanbul", lat: 40.9901, lng: 29.0245 },
  { id: "a101_2", market: "A101", branchName: "A101 Moda", address: "Moda, İstanbul", lat: 40.9845, lng: 29.0260 },
  { id: "a101_3", market: "A101", branchName: "A101 Beşiktaş Çarşı", address: "Beşiktaş, İstanbul", lat: 41.0422, lng: 29.0067 },
  { id: "a101_4", market: "A101", branchName: "A101 Şişli", address: "Şişli, İstanbul", lat: 41.0610, lng: 28.9870 },
  
  // ŞOK
  { id: "sok_1", market: "ŞOK", branchName: "ŞOK Kadıköy Çarşı", address: "Kadıköy Çarşı, İstanbul", lat: 40.9894, lng: 29.0271 },
  { id: "sok_2", market: "ŞOK", branchName: "ŞOK Acıbadem", address: "Acıbadem, İstanbul", lat: 41.0025, lng: 29.0340 },
  { id: "sok_3", market: "ŞOK", branchName: "ŞOK Beşiktaş", address: "Beşiktaş, İstanbul", lat: 41.0440, lng: 29.0050 },
  { id: "sok_4", market: "ŞOK", branchName: "ŞOK Şişli", address: "Şişli, İstanbul", lat: 41.0630, lng: 28.9880 },
  
  // Migros
  { id: "migros_1", market: "Migros", branchName: "Migros Kadıköy", address: "Kadıköy, İstanbul", lat: 40.9912, lng: 29.0258 },
  { id: "migros_2", market: "Migros", branchName: "Migros Bahariye", address: "Bahariye, İstanbul", lat: 40.9870, lng: 29.0280 },
  { id: "migros_3", market: "Migros", branchName: "Migros Beşiktaş", address: "Beşiktaş, İstanbul", lat: 41.0430, lng: 29.0040 },
  { id: "migros_4", market: "Migros", branchName: "Migros Şişli", address: "Şişli, İstanbul", lat: 41.0600, lng: 28.9890 },
  
  // BİM
  { id: "bim_1", market: "BİM", branchName: "BİM Kadıköy İskele", address: "Kadıköy İskele, İstanbul", lat: 40.9920, lng: 29.0230 },
  { id: "bim_2", market: "BİM", branchName: "BİM Moda", address: "Moda, İstanbul", lat: 40.9850, lng: 29.0250 },
  { id: "bim_3", market: "BİM", branchName: "BİM Beşiktaş", address: "Beşiktaş, İstanbul", lat: 41.0450, lng: 29.0030 },
  { id: "bim_4", market: "BİM", branchName: "BİM Şişli", address: "Şişli, İstanbul", lat: 41.0620, lng: 28.9860 },
];

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};
