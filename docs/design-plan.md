# Design Plan — Dashboard Operator Emergency Platform
## Project Interkoneksi Sarana Proteksi Kedaruratan
### Client: PT Pupuk Kujang | Vendor: PT Panca Teknologi Aksesindo

---

## 1. Tujuan Desain

Merancang antarmuka (UI/UX) untuk Command Center / Fire Station yang:
- Mudah dibaca cepat oleh operator dalam kondisi darurat (bukan sekadar cantik, tapi **fungsional di bawah tekanan**)
- Konsisten dengan identitas visual PT Pupuk Kujang sebagai klien
- Bisa ditampilkan di dua konteks berbeda: **video wall 65" 4K** (dilihat dari jarak jauh, banyak orang) dan **workstation operator** (dilihat dari dekat, interaktif)

---

## 2. Prinsip Desain (Design Principles)

1. **Clarity over decoration** — di ruang kontrol darurat, tiap elemen visual harus punya fungsi. Hindari ornamen yang gak nambah informasi.
2. **Status paling kritis harus paling menonjol** — hierarki visual: Alarm aktif > Warning > Normal, dibedakan lewat warna, ukuran, dan animasi (bukan cuma warna, buat yang color-blind).
3. **Scan-ability jarak jauh** — teks & ikon harus terbaca dari beberapa meter (untuk video wall), font besar, kontras tinggi.
4. **Konsistensi lintas layar** — video wall dan workstation operator pakai sistem desain yang sama, cuma beda densitas informasi.
5. **Dark mode sebagai default** — ruang kontrol biasanya remang, dark UI mengurangi silau dan lebih nyaman untuk monitoring lama (8-12 jam shift).

---

## 3. Identitas Visual (Brand Alignment)

| Elemen | Warna Referensi | Catatan |
|---|---|---|
| Brand Primary (Pupuk Kujang) | Hijau (identitas agrikultur/pupuk) | Dipakai di header, logo area, elemen non-alarm |
| Brand Secondary | Merah/Kujang (dari logo) | Dipakai hati-hati, jangan tabrakan sama warna alarm |
| Status Normal | Hijau muda / abu-hijau | Netral, menenangkan |
| Status Warning | Kuning/Oranye | Perlu perhatian, belum kritis |
| Status Alarm/Critical | Merah terang, dengan animasi pulse | Harus tegas beda dari brand red supaya gak ambigu |
| Background | Dark navy / charcoal (#0F1620-an) | Mengurangi silau di ruang kontrol |
| Text | Putih / abu terang | Kontras tinggi di atas dark background |

---

## 4. Tipografi

- Font: **Inter** (sans-serif, tinggi keterbacaan)
- Ukuran font minimal:
  - Video wall: judul 32-48px, body 20-24px
  - Workstation: judul 20-24px, body 14-16px
- Angka/data penting pakai font tabular/monospace variant

---

## 5. Struktur Layar

### 5.1 Video Wall (65" 4K) — Overview Mode
```
┌─────────────────────────────────────────────┐
│  HEADER: Logo Pupuk Kujang | Waktu | Status  │
├───────────────────┬───────────────────────────┤
│                   │  ALARM ACTIVE PANEL       │
│   GIS MAP         │  (list alarm real-time,   │
│   (lokasi alarm,  │   warna sesuai severity)  │
│   arah angin)     │                           │
│                   ├───────────────────────────┤
│                   │  CCTV POPUP (auto trigger │
│                   │  saat ada alarm di zona)  │
├───────────────────┴───────────────────────────┤
│  ZONE STATUS GRID (8 panel, 16 zona paging)   │
└─────────────────────────────────────────────┘
```

### 5.2 Workstation Operator — Interactive Mode
```
┌─────────────────────────────────────────────┐
│  Navbar: Dashboard | Events | Reports | Config│
├───────────────────┬───────────────────────────┤
│  SIDEBAR:         │  MAIN PANEL (kontekstual)  │
│  - Alarm List     │  - Detail alarm terpilih   │
│  - Device Status  │  - CCTV feed terkait       │
│  - Zone Selector  │  - Action buttons          │
│                   │    (acknowledge, dispatch, │
│                   │     paging manual)         │
├───────────────────┴───────────────────────────┤
│  FOOTER: Event log terbaru (scrolling ticker) │
└─────────────────────────────────────────────┘
```

---

## 6. Komponen UI Kunci

| Komponen | Kebutuhan Desain |
|---|---|
| Alarm Card/Badge | State: normal, warning, critical — dengan animasi pulse untuk critical |
| Wind Direction Indicator | Kompas visual sederhana, update real-time |
| Zone Status Grid | Representasi zona paging, visual on/off per zona |
| Notification Toast | Alert non-intrusive tapi tetap menonjol untuk alarm baru |
| Acknowledge Button | Jelas, besar, perlu konfirmasi (hindari misclick di kondisi panik) |

---

## 7. Aksesibilitas & Ergonomi Ruang Kontrol

- Kontras warna minimal WCAG AA (4.5:1)
- Jangan mengandalkan warna saja — tambahkan ikon/label teks
- Animasi max ~3 flash/detik (anti epilepsi)
- Layout konsisten walau di-resize
