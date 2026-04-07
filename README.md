# 🐾 PokeDeck v2.0 - Premium Pokémon Explorer

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)](https://rayanhakim.github.io/PokeDeck/)

**PokeDeck** adalah aplikasi penjelajah Pokémon modern yang dibangun dengan **React.js** dan **Tailwind CSS**. Proyek ini difokuskan pada pengalaman pengguna (UX) yang premium dengan fitur pencarian cepat, filter wilayah (region), dan tampilan detail evolusi yang mendalam.

🔗 **Live Demo:**(https://rayanhakim.github.io/PokeDeck/)

---

## ✨ Fitur Utama

* **🎯 Dashboard Navigation:** Sidebar yang intuitif dan dapat disembunyikan (*collapsible*) untuk memaksimalkan area pandang di layar lebar.
* **📱 Ultra Mobile-Friendly:** Desain responsif dengan *bottom-sheet modal* dan navigasi yang dioptimalkan untuk perangkat sentuh.
* **🌍 Region System:** Menjelajahi Pokémon berdasarkan wilayah (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos).
* **⚡ Real-time Search & Filter:** Pencarian instan berdasarkan nama dan filter berdasarkan elemen (Fire, Water, Grass, dll).
* **💎 Premium UI Effects:** Efek *glassmorphism*, tekstur *grainy*, animasi *shimmer*, dan *dynamic glow* yang menyesuaikan warna tipe Pokémon.
* **🧬 Evolution Chain:** Menampilkan alur evolusi lengkap secara otomatis menggunakan data rekursif dari PokéAPI.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Hooks: useState, useEffect)
* **Styling:** Tailwind CSS (Custom Animations & Configurations)
* **Build Tool:** Vite
* **API:** [PokeAPI](https://pokeapi.co/)
* **Deployment:** GitHub Actions (CI/CD Pipeline)

---

## 🚀 Memulai Proyek (Local Setup)

Jika Anda ingin menjalankan proyek ini di komputer lokal Anda, ikuti langkah berikut:

### 1. Clone Repository
```bash
git clone [https://github.com/rayanhakim/PokeDeck.git](https://github.com/rayanhakim/PokeDeck.git)
cd PokeDeck

2. Instalasi Dependensi
Bash
npm install
3. Jalankan Mode Development
Bash
npm run dev
Buka http://localhost:5173 di browser Anda.

4. Build untuk Produksi
Bash
npm run build
