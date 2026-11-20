import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';
import DiaryCard from '@/src/components/DiaryCard';
import { clearAllFavorites, toggleFavorite } from '@/src/features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '@/src/styles/tokens';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const favoriteEntries = useMemo(
    () => entries.filter((entry) => entry.liked),
    [entries]
  );
  const [confirmingClear, setConfirmingClear] = useState(false);

  const clearFavorites = () => {
    dispatch(clearAllFavorites());
    setConfirmingClear(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={favoriteEntries}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>♡</Text>
            <Text style={styles.emptyTitle}>Belum ada diary favorit</Text>
            <Text style={styles.emptyText}>
              Tandai cerita dengan ikon hati agar mudah ditemukan di sini.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>KOLEKSI PILIHAN</Text>
            <Text style={styles.heading}>Favorit</Text>
            <View style={styles.headerBottom}>
              <Text style={styles.subtitle}>
                {favoriteEntries.length} cerita tersimpan
              </Text>
              {favoriteEntries.length > 0 && !confirmingClear && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmingClear(true)}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Kosongkan</Text>
                </Pressable>
              )}
            </View>
            {confirmingClear && (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>Hapus semua diary dari favorit?</Text>
                <View style={styles.confirmActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setConfirmingClear(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Batal</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={clearFavorites}
                    style={styles.confirmButton}
                  >
                    <Text style={styles.confirmButtonText}>Ya, kosongkan</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onPress={() =>
              router.push({ pathname: '/detail/[id]', params: { id: String(item.id) } })
            }
            onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  listContent: {
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
  headerBottom: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACE.xl,
    marginTop: SPACE.xs,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: TYPO.body,
  },
  clearButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: SPACE.s,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: TYPO.caption,
    fontWeight: '700',
  },
  confirmBox: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    marginBottom: SPACE.l,
    padding: SPACE.l,
  },
  confirmText: {
    color: COLORS.text,
    fontSize: TYPO.body,
    fontWeight: '600',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: SPACE.s,
    justifyContent: 'flex-end',
    marginTop: SPACE.m,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: SPACE.m,
  },
  cancelText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.input,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: SPACE.m,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: TYPO.caption,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACE.xl,
    paddingVertical: SPACE.xxl,
  },
  emptyEmoji: {
    color: COLORS.danger,
    fontSize: 40,
    marginBottom: SPACE.m,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: TYPO.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: TYPO.body,
    lineHeight: 21,
    marginTop: SPACE.s,
    textAlign: 'center',
  },
});
