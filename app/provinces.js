// provinces.js — 38 provinsi Indonesia.
//
// Angka per provinsi: penduduk pertengahan 2024 (juta jiwa), persentase
// penduduk miskin September 2024, dan IPM 2024 — dibulatkan dari publikasi
// BPS 2024. Luas wilayah dalam km persegi (dibulatkan). Halaman Sumber &
// Metodologi menjelaskan pembulatan ini secara terbuka; angka nasional di
// data.js memakai nilai rilis persisnya.

export const PROVINCES = [
  { name: "Aceh", capital: "Banda Aceh", population: 5.55, poverty: 14.6, hdi: 73.5, area: 57956, island: "Sumatera" },
  { name: "Sumatera Utara", capital: "Medan", population: 16.01, poverty: 8.3, hdi: 75.5, area: 72981, island: "Sumatera" },
  { name: "Sumatera Barat", capital: "Padang", population: 5.86, poverty: 5.9, hdi: 75.3, area: 42013, island: "Sumatera" },
  { name: "Riau", capital: "Pekanbaru", population: 6.9, poverty: 6.6, hdi: 74.9, area: 87024, island: "Sumatera" },
  { name: "Jambi", capital: "Jambi", population: 3.68, poverty: 7.0, hdi: 73.8, area: 50058, island: "Sumatera" },
  { name: "Sumatera Selatan", capital: "Palembang", population: 9.05, poverty: 11.6, hdi: 71.8, area: 91592, island: "Sumatera" },
  { name: "Bengkulu", capital: "Bengkulu", population: 2.1, poverty: 11.9, hdi: 73.0, area: 19919, island: "Sumatera" },
  { name: "Lampung", capital: "Bandar Lampung", population: 9.43, poverty: 10.9, hdi: 71.9, area: 34624, island: "Sumatera" },
  { name: "Kep. Bangka Belitung", capital: "Pangkal Pinang", population: 1.52, poverty: 4.4, hdi: 72.9, area: 16424, island: "Sumatera" },
  { name: "Kep. Riau", capital: "Tanjung Pinang", population: 2.16, poverty: 5.5, hdi: 77.0, area: 8202, island: "Sumatera" },
  { name: "DKI Jakarta", capital: "Jakarta", population: 10.56, poverty: 4.1, hdi: 83.0, area: 664, island: "Jawa" },
  { name: "Jawa Barat", capital: "Bandung", population: 50.35, poverty: 7.5, hdi: 74.0, area: 35378, island: "Jawa" },
  { name: "Jawa Tengah", capital: "Semarang", population: 37.89, poverty: 10.5, hdi: 73.9, area: 32801, island: "Jawa" },
  { name: "DI Yogyakarta", capital: "Yogyakarta", population: 3.82, poverty: 11.0, hdi: 80.5, area: 3133, island: "Jawa" },
  { name: "Jawa Timur", capital: "Surabaya", population: 41.81, poverty: 10.4, hdi: 74.7, area: 47803, island: "Jawa" },
  { name: "Banten", capital: "Serang", population: 12.43, poverty: 6.0, hdi: 77.3, area: 9663, island: "Jawa" },
  { name: "Bali", capital: "Denpasar", population: 4.39, poverty: 4.0, hdi: 77.7, area: 5780, island: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Barat", capital: "Mataram", population: 5.6, poverty: 13.0, hdi: 70.9, area: 18572, island: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Timur", capital: "Kupang", population: 5.66, poverty: 19.0, hdi: 66.8, area: 48718, island: "Bali & Nusa Tenggara" },
  { name: "Kalimantan Barat", capital: "Pontianak", population: 5.8, poverty: 6.7, hdi: 70.9, area: 147307, island: "Kalimantan" },
  { name: "Kalimantan Tengah", capital: "Palangka Raya", population: 2.81, poverty: 5.1, hdi: 73.6, area: 153564, island: "Kalimantan" },
  { name: "Kalimantan Selatan", capital: "Banjarmasin", population: 4.3, poverty: 4.5, hdi: 73.8, area: 38744, island: "Kalimantan" },
  { name: "Kalimantan Timur", capital: "Samarinda", population: 4.01, poverty: 6.1, hdi: 78.0, area: 129067, island: "Kalimantan" },
  { name: "Kalimantan Utara", capital: "Tanjung Selor", population: 0.73, poverty: 6.7, hdi: 73.6, area: 75467, island: "Kalimantan" },
  { name: "Sulawesi Utara", capital: "Manado", population: 2.71, poverty: 7.2, hdi: 74.8, area: 13892, island: "Sulawesi" },
  { name: "Sulawesi Tengah", capital: "Palu", population: 3.14, poverty: 12.0, hdi: 71.4, area: 61841, island: "Sulawesi" },
  { name: "Sulawesi Selatan", capital: "Makassar", population: 9.46, poverty: 8.5, hdi: 73.8, area: 46717, island: "Sulawesi" },
  { name: "Sulawesi Tenggara", capital: "Kendari", population: 2.82, poverty: 11.2, hdi: 72.9, area: 38068, island: "Sulawesi" },
  { name: "Gorontalo", capital: "Gorontalo", population: 1.25, poverty: 15.2, hdi: 70.4, area: 11257, island: "Sulawesi" },
  { name: "Sulawesi Barat", capital: "Mamuju", population: 1.59, poverty: 11.4, hdi: 68.7, area: 16787, island: "Sulawesi" },
  { name: "Maluku", capital: "Ambon", population: 1.91, poverty: 16.3, hdi: 71.2, area: 46914, island: "Maluku" },
  { name: "Maluku Utara", capital: "Sofifi", population: 1.39, poverty: 6.2, hdi: 70.4, area: 31982, island: "Maluku" },
  { name: "Papua Barat", capital: "Manokwari", population: 0.62, poverty: 20.0, hdi: 65.8, area: 64134, island: "Papua" },
  { name: "Papua", capital: "Jayapura", population: 1.08, poverty: 25.5, hdi: 62.5, area: 82042, island: "Papua" },
  { name: "Papua Selatan", capital: "Merauke", population: 0.56, poverty: 21.0, hdi: 64.5, area: 127280, island: "Papua" },
  { name: "Papua Tengah", capital: "Nabire", population: 1.35, poverty: 30.0, hdi: 61.5, area: 66130, island: "Papua" },
  { name: "Papua Pegunungan", capital: "Wamena", population: 1.48, poverty: 34.1, hdi: 60.8, area: 51213, island: "Papua" },
  { name: "Papua Barat Daya", capital: "Sorong", population: 0.62, poverty: 19.0, hdi: 66.5, area: 39167, island: "Papua" },
];

// Kepadatan penduduk, jiwa per km persegi.
export function density(p) {
  return Math.round((p.population * 1e6) / p.area);
}

// Perkiraan jumlah penduduk miskin di provinsi, juta jiwa.
export function poorPeople(p) {
  return +((p.population * p.poverty) / 100).toFixed(2);
}

// Kategori IPM menurut BPS: <60 rendah, 60–70 sedang, 70–80 tinggi, >=80 sangat tinggi.
export function hdiCategory(hdi) {
  if (hdi >= 80) return "Sangat tinggi";
  if (hdi >= 70) return "Tinggi";
  if (hdi >= 60) return "Sedang";
  return "Rendah";
}

export function sortProvinces(list, key, dir) {
  const copy = [...list];
  const sign = dir === "desc" ? -1 : 1;
  copy.sort((a, b) => {
    if (key === "name") return sign * a.name.localeCompare(b.name, "id");
    if (key === "density") return sign * (density(a) - density(b));
    return sign * (a[key] - b[key]);
  });
  return copy;
}
