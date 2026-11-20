import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';
import {
  DIARY_MOODS,
  editDiary,
  type DiaryEntry,
  type DiaryMood,
} from '@/src/features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '@/src/styles/tokens';

export default function EditDiaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entryId = Number(id);
  const entry = useAppSelector((state) =>
    Number.isFinite(entryId)
      ? state.diary.entries.find((item) => item.id === entryId)
      : undefined
  );

  if (!entry) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Diary tidak ditemukan</Text>
          <Text style={styles.subtitle}>Catatan ini mungkin sudah dihapus.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <EditDiaryForm key={entry.id} entry={entry} />;
}

function EditDiaryForm({ entry }: { entry: DiaryEntry }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body);
  const [mood, setMood] = useState<DiaryMood>(entry.mood);
  const [error, setError] = useState('');

  const saveChanges = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length < 3) {
      setError('Judul diary harus terdiri dari minimal 3 karakter.');
      return;
    }
    if (!trimmedBody) {
      setError('Isi diary tidak boleh kosong.');
      return;
    }

    dispatch(editDiary({ id: entry.id, title: trimmedTitle, body: trimmedBody, mood }));
    router.back();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>PERBARUI CERITAMU</Text>
          <Text style={styles.heading}>Edit Diary</Text>
          <Text style={styles.subtitle}>Perubahan akan langsung tersimpan di Buku Harian.</Text>

          <Text style={styles.label}>Judul</Text>
          <TextInput
            accessibilityLabel="Judul diary"
            maxLength={80}
            onChangeText={(value) => {
              setTitle(value);
              setError('');
            }}
            placeholder="Judul diary"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
            value={title}
          />

          <Text style={styles.label}>Ceritamu</Text>
          <TextInput
            accessibilityLabel="Isi diary"
            multiline
            onChangeText={(value) => {
              setBody(value);
              setError('');
            }}
            placeholder="Ceritakan harimu..."
            placeholderTextColor={COLORS.muted}
            style={[styles.input, styles.bodyInput]}
            textAlignVertical="top"
            value={body}
          />

          <Text style={styles.label}>Mood</Text>
          <View style={styles.moodRow}>
            {DIARY_MOODS.map((item) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Pilih mood ${item}`}
                accessibilityState={{ selected: mood === item }}
                key={item}
                onPress={() => setMood(item)}
                style={[styles.moodButton, mood === item && styles.selectedMood]}
              >
                <Text style={styles.moodEmoji}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}

          <Pressable
            accessibilityRole="button"
            onPress={saveChanges}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          >
            <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: SPACE.l,
    paddingBottom: SPACE.xxl,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: TYPO.caption,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: SPACE.m,
  },
  heading: {
    color: COLORS.text,
    fontSize: TYPO.h1,
    fontWeight: '800',
    marginTop: SPACE.s,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: TYPO.body,
    marginTop: SPACE.xs,
  },
  label: {
    color: COLORS.text,
    fontSize: TYPO.body,
    fontWeight: '700',
    marginBottom: SPACE.s,
    marginTop: SPACE.l,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: TYPO.body,
    paddingHorizontal: SPACE.l,
    paddingVertical: SPACE.m,
  },
  bodyInput: {
    minHeight: 170,
    paddingTop: SPACE.m,
  },
  moodRow: {
    flexDirection: 'row',
    gap: SPACE.m,
  },
  moodButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  selectedMood: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 26,
  },
  error: {
    color: COLORS.danger,
    fontSize: TYPO.caption,
    marginTop: SPACE.m,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.input,
    justifyContent: 'center',
    marginTop: SPACE.xl,
    minHeight: 54,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: TYPO.body,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  notFound: {
    flex: 1,
    gap: SPACE.s,
    justifyContent: 'center',
    padding: SPACE.xl,
  },
  notFoundTitle: {
    color: COLORS.text,
    fontSize: TYPO.title,
    fontWeight: '700',
  },
});
