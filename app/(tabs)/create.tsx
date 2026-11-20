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
import { useRouter } from 'expo-router';

import { useAppDispatch } from '@/src/app/hooks';
import { addDiary, DIARY_MOODS, type DiaryMood } from '@/src/features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '@/src/styles/tokens';

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<DiaryMood>(DIARY_MOODS[0]);
  const [error, setError] = useState('');

  const saveDiary = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length < 3) {
      setError('Judul diary harus terdiri dari minimal 3 karakter.');
      return;
    }
    if (!trimmedBody) {
      setError('Ceritakan isi diary terlebih dahulu.');
      return;
    }

    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    dispatch(addDiary({ title: trimmedTitle, body: trimmedBody, mood, date }));
    setTitle('');
    setBody('');
    setMood(DIARY_MOODS[0]);
    setError('');
    router.replace('/');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>RUANG CERITAMU</Text>
          <Text style={styles.heading}>Tulis Diary</Text>
          <Text style={styles.subtitle}>Simpan momen kecil yang berarti hari ini.</Text>

          <Text style={styles.label}>Judul</Text>
          <TextInput
            accessibilityLabel="Judul diary"
            maxLength={80}
            onChangeText={(value) => {
              setTitle(value);
              setError('');
            }}
            placeholder="Contoh: Hari yang menyenangkan"
            placeholderTextColor={COLORS.muted}
            returnKeyType="next"
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
            placeholder="Apa yang terjadi hari ini?"
            placeholderTextColor={COLORS.muted}
            style={[styles.input, styles.bodyInput]}
            textAlignVertical="top"
            value={body}
          />

          <Text style={styles.label}>Bagaimana perasaanmu?</Text>
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
            onPress={saveDiary}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          >
            <Text style={styles.saveButtonText}>Simpan Diary</Text>
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
    marginBottom: SPACE.xl,
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
    minHeight: 56,
    justifyContent: 'center',
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
});
