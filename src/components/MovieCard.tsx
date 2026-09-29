import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Movie = {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isShowing: boolean;
};

type MovieCardProps = {
  movie: Movie;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
};

function MovieCard({movie, layout = 'row', onSelect}: MovieCardProps) {
  const isTile = layout === 'tile';
  const handlePress = () => {
    onSelect(movie.id);
    Alert.alert('Movie', movie.title);
  };

  return (
    <TouchableOpacity style={[styles.card, isTile && styles.cardTile]} onPress={handlePress}>
      <View style={[styles.posterContainer, isTile && styles.posterTile,]}>
        <Image source={{ uri: movie.poster }} style={[styles.poster, isTile && styles.posterImageTile,  ]}/>
        {isTile && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              {movie.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.info, isTile && styles.infoTile]}>
        <Text style={styles.movieTitle}numberOfLines={isTile ? 1 : undefined}>
          {movie.title}
        </Text>

        {!isTile && (
          <>
            <Text style={styles.text}>{movie.genre}</Text>

            <Text style={styles.text}>{movie.year}</Text>

            <Text style={styles.ratingText}>
              {movie.rating.toFixed(1)}
            </Text>
          </>
        )}

        <Text style={styles.status}>
          {movie.isShowing  ? 'Đang chiếu'  : 'Ngừng chiếu'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
  },

  cardTile: {
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    marginBottom: 10,
  },

  posterContainer: {
    width: 70,
    height: 100,
    position: 'relative',
  },

  posterTile: {
    width: '100%',
    aspectRatio: 2 / 3,
  },

  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },

  posterImageTile: {
    borderRadius: 0,
  },

  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },

  infoTile: {
    marginLeft: 0,
    padding: 8,
  },

  movieTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  text: {
    color: '#555',
    marginBottom: 3,
  },

  ratingText: {
    fontWeight: 'bold',
    marginTop: 3,
  },

  status: {
    marginTop: 5,
  },

  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
});

export default React.memo(MovieCard);
