import React from 'react';
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useTheme } from 'stream-chat-react-native';

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // height: '30%',
    // justifyContent: 'center',

    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',

    // position: 'absolute',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flex: 1,
    // paddingTop: 20,
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
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
        },
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          height: 30,
        }}
      >
        <Text style={{ color: 'white' }}> Processing </Text>
      </View>
      <ActivityIndicator
        color={theme?.colors?.black || colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        size='small'
      />
    </View>
  );
};
