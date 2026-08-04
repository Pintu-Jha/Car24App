import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (!__DEV__) {
        return null;
      }
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Section Crashed</Text>
          <Text style={styles.message}>{this.props.fallbackMessage || this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.status.error,
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.status.error,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  message: {
    color: colors.status.error,
    fontSize: 12,
  },
});
