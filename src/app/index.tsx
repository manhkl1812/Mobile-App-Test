import * as Device from 'expo-device';
import {SafeAreaView, StyleSheet, Text, View, Alert, FlatList, ActivityIndicator, Switch,RefreshControl } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MovieCard, {Movie}  from '@/components/MovieCard';
import React, { useEffect, useState } from 'react';

const API_URL = 'https://6abb5bd9b2118ed7abb855bf.mockapi.io/movies';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTile, setIsTile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  

  useEffect(() => {fetchMovies();}, []);
  const handleSelect = (id: string) => {
    const movie = movies.find(
      (item) => item.id === id
    );

    if (movie) {
      Alert.alert('Movie', movie.title);
    }
  };
  return (
    
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Movie App</Text>
          <View style={styles.switchContainer}>
            <Text>Dạng lưới</Text>
            <Switch value={isTile}  onValueChange={setIsTile} />
          </View>
        </View>              
          {loading ? (
            <ActivityIndicator size="large" style={styles.loading}/>
          ) : (
            
            <FlatList key={String(numColumns)} data={movies} keyExtractor={(item) => String(item.id)} numColumns={numColumns}
              renderItem={({ item }) => (
                <MovieCard
                  key={String(item.id)}
                  movie={item}
                  layout={isTile ? 'tile' : 'row'}
                  onSelect={handleSelect}
                />
              )}
              columnWrapperStyle={
                isTile ? styles.columnWrapper : undefined
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          )}

        </View>
        
      </SafeAreaView>
    </SafeAreaProvider>
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    flex: 1,
  },
  movieItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  rating: {
    fontSize: 16,
    marginTop: 8,
  },

  status: {
    fontSize: 15,
    marginTop: 5,
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
