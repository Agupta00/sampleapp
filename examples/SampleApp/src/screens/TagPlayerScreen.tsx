import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SendMessageAPIResponse } from 'stream-chat';
import {
  AttachButton,
  Channel,
  FileUpload,
  // HitButton,
  InputButtons,
  MessageInput,
  MessageStatusTypes,
  useTheme,
} from 'stream-chat-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '../icons/Message';
import { MessageSearchList } from '../components/MessageSearch/MessageSearchList';
import { ScreenHeader } from '../components/ScreenHeader';
// import { SendButton } from '../components/HitPlayerButton';

import { StreamChatGenerics } from '../types';
import { useChannelContext, useMessageInputContext } from 'stream-chat-react-native';

import type { RouteProp } from '@react-navigation/native';

import type { StackNavigatorParamList } from '../types';

import AsyncStorage from '../utils/AsyncStore';
import { fetchPost } from '../utils/fetch';

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     borderRadius: 12,
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   details: {
//     flex: 1,
//     paddingLeft: 16,
//   },
//   flex: {
//     flex: 1,
//   },
//   sectionContainer: {
//     paddingBottom: 8,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   sectionContentContainer: {
//     flexGrow: 1,
//   },
//   sectionTitle: {
//     fontSize: 14,
//   },
//   size: {
//     fontSize: 12,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '700',
//     paddingBottom: 2,
//   },
// });

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeNameContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 20,
  },
  changeNameInputBox: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingLeft: 14,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: 'center', // for android vertical text centering
  },
  changeNameInputContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    paddingLeft: 16,
  },
  loadMoreButton: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: '100%',
  },
  loadMoreText: {
    fontSize: 14,
    paddingLeft: 20,
  },
  memberContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '100%',
  },
  memberDetails: {
    paddingLeft: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 1,
  },
  memberRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: { flexDirection: 'row' },
  spacer: {
    height: 8,
  },
  flex: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noFilesDetails: {
    fontSize: 14,
    textAlign: 'center',
  },
  noFiles: {
    fontSize: 16,
    paddingBottom: 8,
  },
});

type ChannelTagPlayerScreenRouteProp = RouteProp<StackNavigatorParamList, 'TagPlayerScreen'>;

export type ChannelTagPlayerScreenProps = {
  route: ChannelTagPlayerScreenRouteProp;
};

export const TagPlayerScreen: React.FC<ChannelTagPlayerScreenProps> = ({
  route: {
    params: { channel, gameId, requestUserName, setUserDetailsState, userDetailsState },
  },
}) => {
  const [sentHitPlayerRequest, setSentHitPlayerRequest] = useState(false);
  console.log('userdetailsstate', userDetailsState);

  const hitPlayer = async (messageObject: Record<any, any>) => {
    //TODO catch failure
    const res: any = await fetchPost(':5001/game-7bb7c/us-central1/requestHitPlayerEmpty', {
      gameId,
      requestUserName,
      messageObject,
    });

    console.log('GroupChannelDetailsScreen@hitPlayer');
    console.log('hitplayer res', res);

    //TODO: can clean this up somehow
    setUserDetailsState((prevState) => ({
      ...prevState,
      lastFetchedMillis: performance.now(),
      targetPlayersStatus: res.targetPlayersStatus,
    }));

    AsyncStorage.setItem(gameId, {
      gameStarted: true,
      lastFetchedMillis: performance.now(),
      targetPlayersStatus: res.targetPlayersStatus,
    });

    setSentHitPlayerRequest(true);
  };

  const {
    theme: {
      colors: { accent_blue, accent_green, black, border, grey, white, white_smoke, white_snow },
    },
  } = useTheme();
  const insets = useSafeAreaInsets();

  const EmptyTagPlayer = () => {
    const {
      theme: {
        colors: { black, grey, grey_gainsboro },
      },
    } = useTheme();
    return (
      <View style={styles.emptyContainer}>
        <Message fill={grey_gainsboro} height={110} width={130} />
        {sentHitPlayerRequest && <Text style={[styles.noFiles, { color: black }]}>Thanks</Text>}
        <Text style={[styles.noFilesDetails, { color: grey }]}>
          Pending Confirmation from {userDetailsState.targetPlayersStatus[0].player}
        </Text>
      </View>
    );
  };

  const Temp = () => {
    const { fileUploads } = useMessageInputContext();
    const hasOneVideo = fileUploads.find((file: FileUpload) =>
      file.file.type?.startsWith('video/'),
    );

    if (!sentHitPlayerRequest && userDetailsState.targetPlayersStatus[0].status !== 'pending') {
      return (
        <>
          <View style={styles.actionLabelContainer}>
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Upload a video of your target being tagged to mark them as out.
            </Text>
          </View>
          <MessageInput
            disabled={!hasOneVideo}
            InputButtons={() => <InputButtons hasCommands={false} hasFilePicker={false} />}
            // SendButton={HitButton}
          />
        </>
      );
    } else {
      return EmptyTagPlayer();
    }
  };

  // Called when the user clicks the sendbutton in the MessageInput component which is used to send
  // a video of their target being eliminated.
  // This logic is added here to avoid creating a new SendButton component.
  const doSendMessageRequest = (channelId, messageObject) => {
    hitPlayer(messageObject);
    //TODO don't show the whole channel the hit video.
    return channel.sendMessage({ ...messageObject, text: 'game update' });
  };

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: white_snow,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScreenHeader titleText='Tag Player' />
      <Channel channel={channel} doSendMessageRequest={doSendMessageRequest}>
        <Temp />
      </Channel>
    </View>
  );
};
