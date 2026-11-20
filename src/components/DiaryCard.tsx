import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DiaryEntry } from '../features/diary/diarySlice';
import { COLORS, RADIUS, SPACE, TYPO } from '../styles/tokens';

type Props = {
  entry: DiaryEntry;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function DiaryCard({ entry, onPress, onToggleFavorite }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Buka diary ${entry.title}`}
        onPress={onPress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        <View style={styles.moodBox}>
          <Text style={styles.mood}>{entry.mood}</Text>
        </View>
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.title}>
            {entry.title}
          </Text>
          <Text style={styles.date}>{entry.date}</Text>
          <Text numberOfLines={2} style={styles.preview}>
            {entry.preview}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={entry.liked ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        accessibilityState={{ selected: entry.liked }}
        hitSlop={8}
        onPress={onToggleFavorite}
        style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
      >
        <Text style={[styles.favorite, entry.liked && styles.favoriteActive]}>
          {entry.liked ? '♥' : '♡'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: SPACE.m,
    padding: SPACE.m,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: SPACE.m,
  },
  moodBox: {
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  mood: {
    fontSize: 28,
  },
  details: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPO.title,
    fontWeight: '700',
  },
  date: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
  },
  preview: {
    color: COLORS.text,
    fontSize: TYPO.body,
    lineHeight: 20,
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACE.s,
    minHeight: 44,
    minWidth: 40,
  },
  favorite: {
    color: COLORS.muted,
    fontSize: 26,
  },
  favoriteActive: {
    color: COLORS.danger,
  },
  pressed: {
    opacity: 0.72,
  },
});
