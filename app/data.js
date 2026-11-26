// data.js — Angka-angka nasional Indonesia 2015–2024.
//
// Setiap angka di sini adalah angka publikasi resmi. Sumber utama: Badan
// Pusat Statistik (BPS); angka dolar memakai Bank Dunia (World Bank WDI).
// Angka provinsi ada di provinces.js. Angka yang dibulatkan diberi label
// "sekitar" di tampilan; deret tahunan memakai rilis September/Agustus
// sesuai catatan di bawah.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Jumlah penduduk pertengahan tahun, juta jiwa (BPS).
export const POPULATION = [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 273.5, 275.8, 278.7, 281.6];

// Pertumbuhan ekonomi (PDB harga konstan), persen y-on-y (BPS).
export const GDP_GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03];

// PDB atas dasar harga berlaku, triliun rupiah (BPS).
export const GDP_NOMINAL_IDR = [11526, 12402, 13588, 14838, 15833, 15434, 16977, 19588, 20892, 22139];

// PDB per kapita, dolar AS (Bank Dunia WDI; 2024 sekitar US$4.960).
export const GDP_PER_CAPITA_USD = [3332, 3573, 3843, 3893, 4174, 3870, 4350, 4784, 4920, 4960];

// Inflasi (IHK), persen y-on-y Desember (BPS).
export const INFLATION = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57];

// Persentase penduduk miskin, September tiap tahun (BPS).
export const POVERTY = [11.13, 10.70, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57];

// Tingkat Pengangguran Terbuka (TPT), Agustus tiap tahun, persen (BPS).
export const UNEMPLOYMENT = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91];

// Indeks Pembangunan Manusia (IPM) (BPS).
export const HDI = [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02];

// Rasio Gini, September tiap tahun (BPS; dibulatkan).
export const GINI = [0.402, 0.394, 0.391, 0.384, 0.38, 0.381, 0.379, 0.381, 0.379, 0.379];

// Ekspor dan impor barang, miliar dolar AS (BPS).
export const EXPORTS = [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7];
export const IMPORTS = [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.5, 221.9, 233.7];

// Struktur PDB 2024 menurut lapangan usaha, persen (BPS; dibulatkan).
export const SECTORS_2024 = [
  { name: "Industri Pengolahan", value: 18.7 },
  { name: "Perdagangan", value: 12.9 },
  { name: "Pertanian, Kehutanan & Perikanan", value: 12.5 },
  { name: "Konstruksi", value: 10.0 },
  { name: "Pertambangan & Penggalian", value: 9.5 },
  { name: "Transportasi & Pergudangan", value: 6.4 },
  { name: "Lapangan usaha lainnya", value: 30.0 },
];

// Struktur penduduk 2024 menurut kelompok umur, persen (BPS; perkiraan).
export const AGE_GROUPS_2024 = [
  { group: "0–14 tahun", value: 24.6 },
  { group: "15–24 tahun", value: 16.7 },
  { group: "25–39 tahun", value: 23.7 },
  { group: "40–54 tahun", value: 19.6 },
  { group: "55–64 tahun", value: 8.8 },
  { group: "65 tahun ke atas", value: 6.6 },
];

// Lima tujuan ekspor terbesar 2024, pangsa persen (BPS; sekitar).
export const EXPORT_DESTINATIONS_2024 = [
  { country: "Tiongkok", share: 23 },
  { country: "Amerika Serikat", share: 10 },
  { country: "Jepang", share: 8 },
  { country: "India", share: 7 },
  { country: "Singapura", share: 5 },
];

// Kartu indikator utama di beranda — angka terbaru (2024) beserta sumbernya.
export const HEADLINE_2024 = [
  {
    id: "penduduk",
    label: "Penduduk",
    value: "281,6 jt",
    note: "jiwa, pertengahan 2024",
    change: "+1,0% dari 2023",
    source: "BPS, 2024",
    route: "#/penduduk",
  },
  {
    id: "pdb",
    label: "PDB",
    value: "Rp22.139 T",
    note: "harga berlaku, 2024",
    change: "tumbuh 5,03%",
    source: "BPS, 2024",
    route: "#/ekonomi",
  },
  {
    id: "kemiskinan",
    label: "Penduduk miskin",
    value: "8,57%",
    note: "24,06 juta jiwa, Sep 2024",
    change: "terendah sepanjang sejarah",
    source: "BPS, Sep 2024",
    route: "#/sosial",
  },
  {
    id: "ipm",
    label: "Indeks Pembangunan Manusia",
    value: "75,02",
    note: "kategori tinggi, 2024",
    change: "+0,63 poin dari 2023",
    source: "BPS, 2024",
    route: "#/sosial",
  },
  {
    id: "pengangguran",
    label: "Pengangguran terbuka",
    value: "4,91%",
    note: "7,47 juta jiwa, Agu 2024",
    change: "turun dari 5,32% (2023)",
    source: "BPS, Agu 2024",
    route: "#/ekonomi",
  },
  {
    id: "inflasi",
    label: "Inflasi",
    value: "1,57%",
    note: "y-on-y, Des 2024",
    change: "di bawah sasaran 2,5% ±1%",
    source: "BPS, Des 2024",
    route: "#/ekonomi",
  },
];

// Rilis resmi terbaru yang dirujuk situs ini (tanggal rilis BPS).
export const RELEASES = [
  { date: "5 Feb 2025", title: "Pertumbuhan Ekonomi Indonesia 2024: 5,03%", source: "BPS — Berita Resmi Statistik" },
  { date: "15 Jan 2025", title: "Profil Kemiskinan Indonesia September 2024: 8,57%", source: "BPS — Berita Resmi Statistik" },
  { date: "25 Nov 2024", title: "Indeks Pembangunan Manusia 2024: 75,02", source: "BPS — Berita Resmi Statistik" },
  { date: "5 Nov 2024", title: "Keadaan Ketenagakerjaan Agustus 2024: TPT 4,91%", source: "BPS — Berita Resmi Statistik" },
  { date: "2 Des 2024", title: "Perkembangan Indeks Harga Konsumen November 2024", source: "BPS — Berita Resmi Statistik" },
  { date: "16 Des 2024", title: "Perkembangan Ekspor dan Impor November 2024", source: "BPS — Berita Resmi Statistik" },
];

// Ambil nilai deret pada tahun tertentu.
export function valueInYear(series, year) {
  const i = YEARS.indexOf(year);
  return i === -1 ? null : series[i];
}

// Perubahan satu tahun, dalam poin persentase.
export function changeInPoints(series, year) {
  const i = YEARS.indexOf(year);
  if (i <= 0) return null;
  return +(series[i] - series[i - 1]).toFixed(2);
}
