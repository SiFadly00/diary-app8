import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';
import { deleteDiary, toggleFavorite } from '@/src/features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '@/src/styles/tokens';

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entryId = Number(id);
  const entry = useAppSelector((state) =>
    Number.isFinite(entryId)
      ? state.diary.entries.find((item) => item.id === entryId)
      : undefined
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!entry) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Diary tidak ditemukan</Text>
          <Text style={styles.notFoundText}>Catatan ini mungkin sudah dihapus.</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.primaryButton}>
            <Text style={styles.buttonText}>Kembali ke beranda</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const removeDiary = () => {
    dispatch(deleteDiary(entry.id));
    router.replace('/');
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.moodCard}>
          <Text style={styles.mood}>{entry.mood}</Text>
          <Text style={styles.date}>{entry.date}</Text>
        </View>

        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.body}>{entry.body}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/edit/[id]', params: { id: String(entry.id) } })}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Edit Diary</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => dispatch(toggleFavorite(entry.id))}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonText}>
            {entry.liked ? '♥  Hapus dari Favorit' : '♡  Tambah ke Favorit'}
          </Text>
        </Pressable>

        {confirmingDelete ? (
          <View style={styles.deletePrompt}>
            <Text style={styles.deletePromptText}>Hapus diary ini secara permanen?</Text>
            <View style={styles.deleteActions}>
              <Pressable onPress={() => setConfirmingDelete(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>
              <Pressable onPress={removeDiary} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Ya, hapus</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirmingDelete(true)}
            style={styles.deleteLink}
          >
            <Text style={styles.deleteLinkText}>Hapus diary</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  container: {
    gap: SPACE.l,
    padding: SPACE.l,
    paddingBottom: SPACE.xxl,
  },
  moodCard: {
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACE.l,
  },
  mood: {
    fontSize: 44,
  },
  date: {
    color: COLORS.muted,
    fontSize: TYPO.body,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: SPACE.s,
  },
  body: {
    color: COLORS.text,
    fontSize: TYPO.body,
    lineHeight: 26,
    minHeight: 120,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.input,
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: TYPO.body,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: TYPO.body,
    fontWeight: '700',
  },
  deleteLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  deleteLinkText: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  deletePrompt: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    padding: SPACE.l,
  },
  deletePromptText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  deleteActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACE.s,
  },
  cancelButton: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: SPACE.l,
  },
  cancelText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.input,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: SPACE.l,
  },
  pressed: {
    opacity: 0.8,
  },
  notFound: {
    flex: 1,
    gap: SPACE.m,
    justifyContent: 'center',
    padding: SPACE.xl,
  },
  notFoundTitle: {
    color: COLORS.text,
    fontSize: TYPO.title,
    fontWeight: '700',
  },
  notFoundText: {
    color: COLORS.muted,
    fontSize: TYPO.body,
  },
});
