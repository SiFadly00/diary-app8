import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';
import DiaryCard from '@/src/components/DiaryCard';
import {
  DIARY_MOODS,
  setMoodFilter,
  toggleFavorite,
  type DiaryMoodFilter,
} from '@/src/features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '@/src/styles/tokens';

const FILTERS: { label: string; value: DiaryMoodFilter }[] = [
  { label: 'Semua', value: 'all' },
  ...DIARY_MOODS.map((mood) => ({ label: mood, value: mood })),
];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const moodFilter = useAppSelector((state) => state.diary.moodFilter);
  const totalFavorites = useAppSelector(
    (state) => state.diary.entries.filter((entry) => entry.liked).length
  );
  const visibleEntries = useMemo(
    () =>
      moodFilter === 'all'
        ? entries
        : entries.filter((entry) => entry.mood === moodFilter),
    [entries, moodFilter]
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={visibleEntries}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✍️</Text>
            <Text style={styles.emptyTitle}>
              {entries.length === 0 ? 'Mulai cerita pertamamu' : 'Belum ada diary di mood ini'}
            </Text>
            <Text style={styles.emptyText}>
              {entries.length === 0
                ? 'Simpan momen kecil yang ingin kamu kenang.'
                : 'Pilih mood lain untuk melihat catatanmu.'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>RUANG CERITAMU</Text>
            <Text style={styles.heading}>Buku Harian</Text>
            <Text style={styles.subtitle}>Satu tempat untuk menyimpan setiap cerita.</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.primaryStat]}>
                <Text style={styles.statNumber}>{entries.length}</Text>
                <Text style={styles.statLabel}>Total Diary</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.favoriteNumber]}>{totalFavorites}</Text>
                <Text style={styles.statLabel}>Total Favorit</Text>
              </View>
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Catatan terbaru</Text>
              <Text style={styles.entryCount}>{visibleEntries.length} catatan</Text>
            </View>
            <View style={styles.filters}>
              {FILTERS.map((filter) => {
                const selected = moodFilter === filter.value;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={filter.value}
                    onPress={() => dispatch(setMoodFilter(filter.value))}
                    style={[styles.filterChip, selected && styles.selectedFilter]}
                  >
                    <Text style={[styles.filterText, selected && styles.selectedFilterText]}>
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
  subtitle: {
    color: COLORS.muted,
    fontSize: TYPO.body,
    marginTop: SPACE.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACE.m,
    marginTop: SPACE.xl,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    flex: 1,
    minHeight: 94,
    justifyContent: 'center',
    paddingHorizontal: SPACE.l,
  },
  primaryStat: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  statNumber: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: '800',
  },
  favoriteNumber: {
    color: COLORS.danger,
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
    fontWeight: '600',
    marginTop: SPACE.xs,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACE.m,
    marginTop: SPACE.xl,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: TYPO.title,
    fontWeight: '700',
  },
  entryCount: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
  },
  filters: {
    flexDirection: 'row',
    gap: SPACE.s,
    marginBottom: SPACE.l,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 48,
    paddingHorizontal: SPACE.m,
  },
  selectedFilter: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
    fontWeight: '600',
  },
  selectedFilterText: {
    color: COLORS.accent,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginTop: SPACE.s,
    paddingHorizontal: SPACE.xl,
    paddingVertical: SPACE.xxl,
  },
  emptyEmoji: {
    fontSize: 34,
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
