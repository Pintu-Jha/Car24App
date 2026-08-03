import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activity Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' },
  text: { fontSize: 18, color: '#333' }
});
