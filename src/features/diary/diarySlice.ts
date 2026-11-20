import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const DIARY_MOODS = ['😊', '😌', '🥰', '😔'] as const;

export type DiaryMood = (typeof DIARY_MOODS)[number];
export type DiaryMoodFilter = 'all' | DiaryMood;

export type DiaryEntry = {
  id: number;
  title: string;
  date: string;
  preview: string;
  body: string;
  mood: DiaryMood;
  liked: boolean;
};

type NewDiaryEntry = Pick<DiaryEntry, 'title' | 'body' | 'mood' | 'date'>;
type DiaryState = {
  entries: DiaryEntry[];
  moodFilter: DiaryMoodFilter;
};

const initialState: DiaryState = {
  entries: [
    {
      id: 1,
      title: 'Pagi yang Tenang',
      date: '2026-11-15',
      preview: 'Jalan pagi sebelum memulai aktivitas.',
      body: 'Pagi ini terasa tenang. Saya berjalan selama 20 menit sebelum memulai aktivitas.',
      mood: '😌',
      liked: false,
    },
    {
      id: 2,
      title: 'Produktif di Kampus',
      date: '2026-11-14',
      preview: 'Menyelesaikan modul dan berdiskusi dengan tim.',
      body: 'Hari ini cukup produktif karena beberapa target perkuliahan selesai.',
      mood: '😊',
      liked: true,
    },
    {
      id: 3,
      title: 'Senja dan Buku',
      date: '2026-11-13',
      preview: 'Membaca buku sambil menikmati sore.',
      body: 'Sore ini saya menikmati waktu membaca buku dengan suasana santai.',
      mood: '🥰',
      liked: false,
    },
  ],
  moodFilter: 'all',
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    addDiary: (state, action: PayloadAction<NewDiaryEntry>) => {
      const { title, body, mood, date } = action.payload;
      state.entries.unshift({
        id: Date.now(),
        title,
        body,
        mood,
        date,
        preview: body.slice(0, 100),
        liked: false,
      });
    },
    editDiary: (
      state,
      action: PayloadAction<Pick<DiaryEntry, 'id' | 'title' | 'body' | 'mood'>>
    ) => {
      const entry = state.entries.find((item) => item.id === action.payload.id);
      if (entry) {
        entry.title = action.payload.title;
        entry.body = action.payload.body;
        entry.preview = action.payload.body.slice(0, 100);
        entry.mood = action.payload.mood;
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const entry = state.entries.find((item) => item.id === action.payload);
      if (entry) {
        entry.liked = !entry.liked;
      }
    },
    deleteDiary: (state, action: PayloadAction<number>) => {
      state.entries = state.entries.filter((item) => item.id !== action.payload);
    },
    setMoodFilter: (state, action: PayloadAction<DiaryMoodFilter>) => {
      state.moodFilter = action.payload;
    },
    clearAllFavorites: (state) => {
      state.entries.forEach((entry) => {
        entry.liked = false;
      });
    },
  },
});

export const {
  addDiary,
  editDiary,
  toggleFavorite,
  deleteDiary,
  setMoodFilter,
  clearAllFavorites,
} = diarySlice.actions;

export default diarySlice.reducer;
