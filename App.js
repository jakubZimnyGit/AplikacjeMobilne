import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import axios from 'axios';

export default function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [favoriteJokes, setFavoriteJokes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [category, setCategory] = useState('Spooky');

  const generateJoke = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
        params: {
          type: 'single',
          category: category,
        },
      });

      if (response.data.error) {
        setJoke('Error fetching joke');
      } else {
        setJoke(response.data.joke);
      }
    } catch (error) {
      console.error('Error:', error);
      setJoke('Error fetching joke');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (joke && !favoriteJokes.includes(joke)) {
      setFavoriteJokes([...favoriteJokes, joke]);
    } else {
      alert('This joke is already in favorites or is empty!');
    }
  };

  const removeFromFavorites = (jokeToRemove) => {
    setFavoriteJokes(favoriteJokes.filter(joke => joke !== jokeToRemove));
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>JokeApp</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={generateJoke}>
            <Text style={styles.buttonText}>Generate Joke</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#4f83cc" />
          ) : (
            <Text style={styles.jokeText}>{joke ? joke : ''}</Text>
          )}
          
          <TouchableOpacity style={styles.button} onPress={addToFavorites}>
            <Text style={styles.buttonText}>Add to Favorites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={toggleFavorites}>
            <Text style={styles.buttonText}>{showFavorites ? "Hide Favorites" : "Show Favorites"}</Text>
          </TouchableOpacity>
        </View>
        
        {showFavorites ? (
          <View style={styles.favoriteJokesContainer}>
            {favoriteJokes.length === 0 ? (
              <Text style={styles.text}>No favorite jokes</Text>
            ) : (
              <FlatList
                data={favoriteJokes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.favoriteItem}>
                    <Text style={styles.text}>{item}</Text>
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeFromFavorites(item)}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                  </View>
                )}
              />
            )}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',  // Dark background
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 40,
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    color: '#4f83cc',  // Keep blue for header
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4f83cc',
    padding: 15,
    marginVertical: 10,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  jokeText: {
    fontSize: 20,
    color: '#ADD8E6',  // Light blue text for jokes
    textAlign: 'center',
    marginVertical: 15,
  },
  favoriteJokesContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  favoriteItem: {
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',  // White text for favorites
    textAlign: 'center',
    margin: 10,
  },
  removeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
});
