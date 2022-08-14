import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MessageIcon, useTheme, vw } from 'stream-chat-react-native';

const width = vw(33);

const styles = StyleSheet.create({
  channelContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  channelDetails: {
    fontSize: 14,
    textAlign: 'center',
    width: vw(76),
  },
  channelTitle: {
    fontSize: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
});

export type EmptyStateProps = {
  listType?: 'channel' | 'message' | 'default';
};

export const ChannelListEmptyIndicator: React.FC<EmptyStateProps> = ({ listType }) => {
  const {
    theme: {
      colors: { black, grey, grey_gainsboro },
      emptyStateIndicator: { channelContainer, channelDetails, channelTitle },
    },
  } = useTheme();

  switch (listType) {
    case 'channel':
      return (
        <View style={[styles.channelContainer, channelContainer]}>
          <MessageIcon height={width} pathFill={grey_gainsboro} width={width} />
          <Text
            style={[styles.channelTitle, { color: black }, channelTitle]}
            testID='empty-channel-state-title'
          >
            {'Welcome!'}
          </Text>
          <Text
            style={[styles.channelDetails, { color: grey }, channelDetails]}
            testID='empty-channel-state-details'
          >
            {`1. Start a new game by creating a group chat.\n\n`}
            {`2. Hit the 'Start Game' button in the side bar when you are ready to play!\n\n`}
            {`3. Tag your player and mark them as tagged\n\n`}
            {`4. Last one standing wins!\n\n`}
          </Text>
        </View>
      );
    case 'message':
      return null;
    default:
      return <Text style={{ color: black }}>No items exist</Text>;
  }
};
