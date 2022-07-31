import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AttachButton,
  Channel,
  FileUpload,
  InputButtons,
  MessageInput,
  useTheme,
} from 'stream-chat-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePaginatedPinnedMessages } from '../hooks/usePaginatedPinnedMessages';
import { Message } from '../icons/Message';
import { MessageSearchList } from '../components/MessageSearch/MessageSearchList';
import { ScreenHeader } from '../components/ScreenHeader';

import { StreamChatGenerics } from '../types';
import { useChannelContext, useMessageInputContext } from 'stream-chat-react-native';

import type { RouteProp } from '@react-navigation/native';

import type { StackNavigatorParamList } from '../types';

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
//   emptyContainer: {
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 40,
//   },
//   flex: {
//     flex: 1,
//   },
//   noFiles: {
//     fontSize: 16,
//     paddingBottom: 8,
//   },
//   noFilesDetails: {
//     fontSize: 14,
//     textAlign: 'center',
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
});

type ChannelPinnedMessagesScreenRouteProp = RouteProp<
  StackNavigatorParamList,
  'ChannelFilesScreen'
>;

export type ChannelPinnedMessagesScreenProps = {
  route: ChannelPinnedMessagesScreenRouteProp;
};

export const TagPlayerScreen: React.FC<ChannelPinnedMessagesScreenProps> = ({
  route: {
    params: { channel },
  },
}) => {
  const {
    theme: {
      colors: { accent_blue, accent_green, black, border, grey, white, white_smoke, white_snow },
    },
  } = useTheme();
  const { loading, loadMore, messages } = usePaginatedPinnedMessages(channel);
  const insets = useSafeAreaInsets();

  const Temp = () => {
    // const channel_ = useChannelContext<StreamChatGenerics>().channel;
    // const { toggleAttachmentPicker } = useMessageInputContext<StreamChatGenerics>();
    // return <AttachButton handleOnPress={toggleAttachmentPicker} />;
    const { fileUploads } = useMessageInputContext();
    const hasOneVideo = fileUploads.find((file: FileUpload) =>
      file.file.type?.startsWith('video/'),
    );
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
            Uploading a video of your target being tagged to mark them as out.
          </Text>
        </View>
        <MessageInput
          disabled={!hasOneVideo}
          InputButtons={() => <InputButtons hasCommands={false} hasFilePicker={false} />}
          // SendButton={} //WAKE UP HERE : call backend with video of you being hit.
          //i think if we can change value.sendMessage() would be super easy to do this.
          //defintion here
          //export const useCreateInputMessageInputContext = <
          // StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
          // >({
        />
      </>
    );
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
      {/* <MessageSearchList
        EmptySearchIndicator={EmptyListComponent}
        loading={loading}
        loadMore={loadMore}
        messages={messages}
      /> */}
      {/** Create a channel with the bot whom gets the proof videos */}
      <Channel channel={channel}>
        <Temp />
      </Channel>
    </View>
  );
};

// const EmptyListComponent = () => {
//   const {
//     theme: {
//       colors: { black, grey, grey_gainsboro },
//     },
//   } = useTheme();
//   return (
//     <View style={styles.emptyContainer}>
//       <Message fill={grey_gainsboro} height={110} width={130} />
//       <Text style={[styles.noFiles, { color: black }]}>No pinned messages</Text>
//       <Text style={[styles.noFilesDetails, { color: grey }]}>
//         Long-press an important message and choose Pin to conversation.
//       </Text>
//     </View>
//   );
// };
