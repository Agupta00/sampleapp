import React, { Component, useEffect, useState } from 'react';
import type { Channel as StreamChatChannel } from 'stream-chat';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Channel,
  ChannelAvatar,
  DefaultStreamChatGenerics,
  MessageInput,
  MessageList,
  ThreadContextValue,
  useAttachmentPickerContext,
  useChannelPreviewDisplayName,
  useChatContext,
  useTheme,
  useTypingString,
} from 'stream-chat-react-native';
import { Platform, StyleSheet, View } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useChannelMembersStatus } from '../hooks/useChannelMembersStatus';

import type { StackNavigatorParamList, StreamChatGenerics } from '../types';
import { NetworkDownIndicator } from '../components/NetworkDownIndicator';

import { AttachmentActions, AttachmentActionsProps } from 'stream-chat-react-native';

import { fetchPost } from '../utils/fetch';
import AsyncStore from '../utils/AsyncStore';

const CustomAttachmentActions: React.ComponentType<AttachmentActionsProps<StreamChatGenerics>> = (
  props,
) => {
  const handleAction = async (name: string, value: string) => {
    console.log(`handle action ${name}, ${value}`);
    const { messageId } = JSON.parse(value);
    switch (name) {
      case 'confirm':
      case 'deny':
      case 'dispute': {
        const fetchPendingOrSent = await AsyncStore.getItem<string | null>(messageId, null);
        if (fetchPendingOrSent) {
          return;
        }

        await AsyncStore.setItem(messageId, 'pending');
        await fetchPost(`handleMessageAction`, {
          actionValue: value,
        })
          .then(async (r) => {
            //If we got a valid response, don't send any more requests.
            //TODO: only need to set the messageId here instead of the whole value.
            await AsyncStore.setItem(messageId, 'done');
          })
          .catch(() => {
            console.log('failed to get response for handleMessageAction endpoint');
            AsyncStore.removeItem(messageId);
          });
        //TODO handle failure cases
        return;
      }
      default:
        console.log('[channelScreen@handleAction] unhandled action');
    }
  };

  return <AttachmentActions {...props} handleAction={handleAction} />;
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export type ChannelScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'ChannelScreen'
>;
export type ChannelScreenRouteProp = RouteProp<StackNavigatorParamList, 'ChannelScreen'>;
export type ChannelScreenProps = {
  navigation: ChannelScreenNavigationProp;
  route: ChannelScreenRouteProp;
};

export type ChannelHeaderProps = {
  channel: StreamChatChannel<StreamChatGenerics>;
};

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const { closePicker } = useAttachmentPickerContext();
  const membersStatus = useChannelMembersStatus(channel);
  const displayName = useChannelPreviewDisplayName(channel, 30);
  const { isOnline } = useChatContext();
  const { chatClient } = useAppContext();
  const navigation = useNavigation<ChannelScreenNavigationProp>();
  const typing = useTypingString();

  if (!channel || !chatClient) return null;

  const isOneOnOneConversation =
    channel &&
    Object.values(channel.state.members).length === 2 &&
    channel.id?.indexOf('!members-') === 0;

  return (
    <ScreenHeader
      onBack={() => {
        if (!navigation.canGoBack()) {
          // if no previous screen was present in history, go to the list screen
          // this can happen when opened through push notification
          navigation.navigate('ChatScreen');
          console.log('navigating to chatscreen');
        }
      }}
      RightContent={() => (
        <TouchableOpacity
          onPress={() => {
            closePicker();
            if (isOneOnOneConversation) {
              navigation.navigate('OneOnOneChannelDetailScreen', {
                channel,
              });
            } else {
              navigation.navigate('GroupChannelDetailsScreen', {
                channel,
              });
            }
          }}
        >
          <ChannelAvatar channel={channel} />
        </TouchableOpacity>
      )}
      showUnreadCountBadge
      Subtitle={isOnline ? undefined : NetworkDownIndicator}
      subtitleText={typing ? typing : membersStatus}
      titleText={displayName}
    />
  );
};

// Either provide channel or channelId.
export const ChannelScreen: React.FC<ChannelScreenProps> = ({
  route: {
    params: { channel: channelFromProp, channelId, messageId },
  },
}) => {
  // console.log('ChannelScreen got props', channelFromProp);
  const { chatClient } = useAppContext();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const {
    theme: {
      colors: { white },
    },
  } = useTheme();

  const [channel, setChannel] = useState<StreamChatChannel<StreamChatGenerics> | undefined>(
    channelFromProp,
  );

  const [selectedThread, setSelectedThread] =
    useState<ThreadContextValue<StreamChatGenerics>['thread']>();

  useEffect(() => {
    const initChannel = async () => {
      if (!chatClient || !channelId) return;

      const newChannel = chatClient?.channel('messaging', channelId);

      if (!newChannel?.initialized) {
        await newChannel?.watch();
      }
      setChannel(newChannel);
    };

    initChannel();
  }, [channelId]);

  useFocusEffect(() => {
    setSelectedThread(undefined);
  });

  if (!channel || !chatClient) return null;

  return (
    <View style={[styles.flex, { backgroundColor: white, paddingBottom: bottom }]}>
      <Channel
        AttachmentActions={CustomAttachmentActions}
        channel={channel}
        disableTypingIndicator
        enforceUniqueReaction
        initialScrollToFirstUnreadMessage
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
        messageId={messageId}
        NetworkDownIndicator={() => null}
        thread={selectedThread}
      >
        <ChannelHeader channel={channel} />
        <MessageList<StreamChatGenerics>
          onThreadSelect={(thread) => {
            setSelectedThread(thread);
            navigation.navigate('ThreadScreen', {
              channel,
              thread,
            });
          }}
        />
        <MessageInput />
      </Channel>
    </View>
  );
};
