import { useMemo } from 'react';

import type { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../../types/types';

export const useCreateMessagesContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
>({
  additionalTouchableProps,
  animatedLongPress,
  Attachment,
  AttachmentActions,
  blockUser,
  Card,
  CardCover,
  CardFooter,
  CardHeader,
  channelId,
  copyMessage,
  DateHeader,
  deletedMessagesVisibilityType,
  deleteMessage,
  disableTypingIndicator,
  dismissKeyboardOnMessageTouch,
  editMessage,
  enableMessageGroupingByUser,
  FileAttachment,
  FileAttachmentGroup,
  FileAttachmentIcon,
  flagMessage,
  FlatList,
  forceAlignMessages,
  formatDate,
  Gallery,
  Giphy,
  handleBlock,
  handleCopy,
  handleDelete,
  handleEdit,
  handleFlag,
  handleMute,
  handlePinMessage,
  handleQuotedReply,
  handleReaction,
  handleRetry,
  handleThreadReply,
  initialScrollToFirstUnreadMessage,
  InlineDateSeparator,
  InlineUnreadIndicator,
  legacyImageViewerSwipeBehaviour,
  markdownRules,
  Message,
  messageActions,
  MessageAvatar,
  MessageContent,
  messageContentOrder,
  MessageDeleted,
  MessageFooter,
  MessageHeader,
  MessageList,
  MessagePinnedHeader,
  MessageReplies,
  MessageRepliesAvatars,
  MessageSimple,
  MessageStatus,
  MessageSystem,
  MessageText,
  mutesEnabled,
  muteUser,
  myMessageTheme,
  onDoubleTapMessage,
  onLongPressMessage,
  onPressInMessage,
  onPressMessage,
  OverlayReactionList,
  pinMessage,
  pinMessageEnabled,
  quotedRepliesEnabled,
  quotedReply,
  ReactionList,
  reactionsEnabled,
  removeMessage,
  Reply,
  retry,
  retrySendMessage,
  ScrollToBottomButton,
  selectReaction,
  setEditingState,
  setQuotedMessageState,
  supportedReactions,
  threadRepliesEnabled,
  threadReply,
  TypingIndicator,
  TypingIndicatorContainer,
  updateMessage,
  UrlPreview,
}: MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us> & {
  /**
   * To ensure we allow re-render, when channel is changed
   */
  channelId?: string;
}) => {
  const additionalTouchablePropsLength = Object.keys(additionalTouchableProps || {}).length;
  const markdownRulesLength = Object.keys(markdownRules || {}).length;
  const messageContentOrderValue = messageContentOrder.join();
  const supportedReactionsLength = supportedReactions.length;

  const messagesContext: MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us> = useMemo(
    () => ({
      additionalTouchableProps,
      animatedLongPress,
      Attachment,
      AttachmentActions,
      blockUser,
      Card,
      CardCover,
      CardFooter,
      CardHeader,
      copyMessage,
      DateHeader,
      deletedMessagesVisibilityType,
      deleteMessage,
      disableTypingIndicator,
      dismissKeyboardOnMessageTouch,
      editMessage,
      enableMessageGroupingByUser,
      FileAttachment,
      FileAttachmentGroup,
      FileAttachmentIcon,
      flagMessage,
      FlatList,
      forceAlignMessages,
      formatDate,
      Gallery,
      Giphy,
      handleBlock,
      handleCopy,
      handleDelete,
      handleEdit,
      handleFlag,
      handleMute,
      handlePinMessage,
      handleQuotedReply,
      handleReaction,
      handleRetry,
      handleThreadReply,
      initialScrollToFirstUnreadMessage,
      InlineDateSeparator,
      InlineUnreadIndicator,
      legacyImageViewerSwipeBehaviour,
      markdownRules,
      Message,
      messageActions,
      MessageAvatar,
      MessageContent,
      messageContentOrder,
      MessageDeleted,
      MessageFooter,
      MessageHeader,
      MessageList,
      MessagePinnedHeader,
      MessageReplies,
      MessageRepliesAvatars,
      MessageSimple,
      MessageStatus,
      MessageSystem,
      MessageText,
      mutesEnabled,
      muteUser,
      myMessageTheme,
      onDoubleTapMessage,
      onLongPressMessage,
      onPressInMessage,
      onPressMessage,
      OverlayReactionList,
      pinMessage,
      pinMessageEnabled,
      quotedRepliesEnabled,
      quotedReply,
      ReactionList,
      reactionsEnabled,
      removeMessage,
      Reply,
      retry,
      retrySendMessage,
      ScrollToBottomButton,
      selectReaction,
      setEditingState,
      setQuotedMessageState,
      supportedReactions,
      threadRepliesEnabled,
      threadReply,
      TypingIndicator,
      TypingIndicatorContainer,
      updateMessage,
      UrlPreview,
    }),
    [
      additionalTouchablePropsLength,
      channelId,
      disableTypingIndicator,
      dismissKeyboardOnMessageTouch,
      initialScrollToFirstUnreadMessage,
      markdownRulesLength,
      messageContentOrderValue,
      supportedReactionsLength,
    ],
  );

  return messagesContext;
};
