import React from 'react';
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useTheme } from 'stream-chat-react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
});

export const LoadingScreenFull: React.FC = () => {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(52, 52, 52, 0.2)',
        },
      ]}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', height: 40 }}>
        <Text> Processing </Text>
      </View>
      <ActivityIndicator
        color={theme?.colors?.black || colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        size='small'
      />
    </View>
  );
};
