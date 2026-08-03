import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explore Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' },
  text: { fontSize: 18, color: '#333' }
});
