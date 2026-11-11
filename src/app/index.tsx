import MovieCard, { Movie } from '@/components/MovieCard';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';

const API_URL = 'https://6abb5bd9b2118ed7abb855bf.mockapi.io/movies';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTile, setIsTile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Số cột: Nếu isTile bật thì 2 cột, ngược lại 1 cột
  const numColumns = isTile ? 2 : 1;

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu');
      }
      const data: Movie[] = await response.json();
      setMovies(data);
    } catch (error) {
      console.log('GET movies error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
    setRefreshing(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách phim');
      }
      const data: Movie[] = await response.json();
      setMovies(data);
      // Giả lập độ trễ 1.5s để thấy hiệu ứng loading
      await new Promise(resolve => setTimeout(resolve, 1500)); 
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSelect = (id: string) => {
    const movie = movies.find((item) => item.id === id);
    if (movie) {
      Alert.alert('Movie', movie.title);
    }
  };

  return (
    // Đã bỏ SafeAreaProvider, chỉ giữ SafeAreaView
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Movie App</Text>
          <View style={styles.switchContainer}>
            <Text>Dạng lưới</Text>
            <Switch value={isTile} onValueChange={setIsTile} />
          </View>
        </View>

        {/* Danh sách phim */}
        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            key={String(numColumns)} // Ép render lại khi đổi layout
            data={movies}
            // FIX LỖI TRÙNG KEY: Dùng item.id, nếu không có thì dùng index
            keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <MovieCard
                // Đã xóa key={String(item.id)} ở đây vì bị thừa
                movie={item}
                layout={isTile ? 'tile' : 'row'}
                onSelect={handleSelect}
              />
            )}
            // FIX LỖI GIAO DIỆN: Chỉ dùng columnWrapperStyle khi có nhiều hơn 1 cột
            columnWrapperStyle={isTile && numColumns > 1 ? styles.columnWrapper : undefined}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            // Thêm padding bottom để danh sách không bị che
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 10,
  },
});