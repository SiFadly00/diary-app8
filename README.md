# Diary App — Praktikum Redux Toolkit

Aplikasi diary lintas platform berbasis Expo Router. Redux Toolkit menyimpan daftar diary dan status favorit selama aplikasi berjalan; form tetap menggunakan state lokal.

## Menjalankan aplikasi

```bash
npm install
npx expo start
```

Tab **Beranda** menampilkan seluruh diary, statistik, dan filter mood. Tab **Tulis** membuat catatan baru. Pilih kartu untuk melihat detail, mengedit, mengubah favorit, atau menghapusnya. Tab **Favorit** menampilkan catatan yang ditandai dan menyediakan aksi untuk mengosongkan semua favorit.

## Struktur Redux

- `src/app/store.ts` membuat store dengan `configureStore`.
- `src/app/hooks.ts` menyediakan `useAppSelector` dan `useAppDispatch` bertipe.
- `src/features/diary/diarySlice.ts` mendefinisikan state, data awal, serta reducer tambah, edit, hapus, favorit, dan filter mood.
- `app/_layout.tsx` membungkus navigasi dengan Redux `Provider`.
- `app.json` menetapkan root Expo Router ke `app/`, sehingga folder `src/app/` tetap menjadi tempat kode Redux, bukan folder rute.

## State lokal, global, dan database

- **Local state (`useState`)** menyimpan teks sementara pada form, pilihan mood sebelum disimpan, pesan validasi, dan status konfirmasi. Data ini hanya dibutuhkan oleh layar terkait.
- **Global state (Redux)** menyimpan daftar diary, favorit, dan filter mood yang dipakai bersama oleh Beranda, Detail, Edit, dan Favorit. Perubahan dilakukan melalui action yang diproses reducer dan dibaca lewat selector.
- **Persistent database** menyimpan data secara permanen di luar memori aplikasi. Praktikum ini belum memakai database atau backend: Redux hanya menyimpan data di memori, sehingga diary yang ditambahkan atau diubah akan kembali ke data awal setelah aplikasi dimulai ulang.
