import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PrivateValueStore, RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  useChannelPreviewDisplayName,
  useOverlayContext,
  useTheme,
} from 'stream-chat-react-native';

// import { AsyncStorage } from '../utils/AsyncStore';
import AsyncStorage from '../utils/AsyncStore';
import { fetchPost } from '../utils/fetch';

import { RoundButton } from '../components/RoundButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';
import { useAppOverlayContext } from '../context/AppOverlayContext';
import { useBottomSheetOverlayContext } from '../context/BottomSheetOverlayContext';
import { useUserInfoOverlayContext } from '../context/UserInfoOverlayContext';
import { useChannelMembersStatus } from '../hooks/useChannelMembersStatus';
import { AddUser } from '../icons/AddUser';
import { Check } from '../icons/Check';
import { CircleClose } from '../icons/CircleClose';
import { DownArrow } from '../icons/DownArrow';
import { File } from '../icons/File';
import { GoForward } from '../icons/GoForward';
import { Mute } from '../icons/Mute';
import { Picture } from '../icons/Picture';
import { RemoveUser } from '../icons/RemoveUser';
import { getUserActivityStatus } from '../utils/getUserActivityStatus';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { Channel, UserResponse } from 'stream-chat';

import type { StackNavigatorParamList, StreamChatGenerics } from '../types';
import { Pin } from '../icons/Pin';

//Don't need this anymore
const FETCH_STALE_TIME_SECONDS = 300000000000;

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
});

type GroupChannelDetailsRouteProp = RouteProp<StackNavigatorParamList, 'GroupChannelDetailsScreen'>;

type GroupChannelDetailsProps = {
  route: GroupChannelDetailsRouteProp;
};

type GroupChannelDetailsScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'GroupChannelDetailsScreen'
>;

const Spacer = () => {
  const {
    theme: {
      colors: { grey_gainsboro },
    },
  } = useTheme();
  return (
    <View
      style={[
        styles.spacer,
        {
          backgroundColor: grey_gainsboro,
        },
      ]}
    />
  );
};

export const GroupChannelDetailsScreen: React.FC<GroupChannelDetailsProps> = ({
  route: {
    params: { channel },
  },
}) => {
  const { chatClient } = useAppContext();
  const { setOverlay: setAppOverlay } = useAppOverlayContext();
  const { setData: setBottomSheetOverlayData } = useBottomSheetOverlayContext();
  const { setData: setUserInfoOverlayData } = useUserInfoOverlayContext();
  const navigation = useNavigation<GroupChannelDetailsScreenNavigationProp>();
  const { setBlurType, setOverlay } = useOverlayContext();
  const {
    theme: {
      colors: { accent_blue, accent_green, black, border, grey, white, white_smoke },
    },
  } = useTheme();

  const textInputRef = useRef<TextInput>(null);
  const [muted, setMuted] = useState(
    chatClient?.mutedChannels.some((mute) => mute.channel?.id === channel?.id),
  );
  const [groupName, setGroupName] = useState(channel.data?.name);
  const allMembers = Object.values(channel.state.members);
  const [members, setMembers] = useState(allMembers.slice(0, 3));
  const [textInputFocused, setTextInputFocused] = useState(false);

  const membersStatus = useChannelMembersStatus(channel);
  const displayName = useChannelPreviewDisplayName<StreamChatGenerics>(channel, 30);
  const gameId = channel.id ? channel.id : '';

  //TODO A better solution would be to have the backend tell us when we can re-start the game.

  const [userDetailsState, setUserDetailsState] = useState({
    // gameStarted: false, //for development
    dataLoaded: false,
    gameStarted: true, //Start of as true since we don't want the user to be able to create a game until we are sure they should be able to.
    targetPlayers: [],
    lastFetchedMillis: -1,
  });

  const getUserDetails = async () => {
    const millisToSec = (millis: number) => millis * 1e-3;

    const storedUserDetails: any = await AsyncStorage.getItem(gameId, null);
    let needsFetch = true;
    if (storedUserDetails) {
      const timeElapsedSeconds =
        millisToSec(performance.now()) - millisToSec(storedUserDetails.lastFetchedMillis);

      console.log('storedUserDetails', storedUserDetails);
      if (timeElapsedSeconds < FETCH_STALE_TIME_SECONDS) {
        setUserDetailsState({ dataLoaded: true, ...storedUserDetails });
        needsFetch = false;
      }
    }

    // If we haven't checked yet, or it has been some time since we last checked.
    if (needsFetch) {
      await fetchPost('http://localhost:5001/game-7bb7c/us-central1/userDetails', {
        gameId,
        requestUserName: chatClient?.user?.id,
      })
        .then((res: any) => {
          console.log('getuserdetails res()', res, typeof res);
          const newUserDetails = {
            gameStarted: res.gameStarted,
            targetPlayers: res.targetPlayers,
            lastFetchedMillis: performance.now(),
          };
          setUserDetailsState({ dataLoaded: true, ...newUserDetails });
          AsyncStorage.setItem(gameId, newUserDetails);
        })
        .catch((err) => console.warn('getUserDetails()', err));
    }
  };

  //TODO Right now once the game is started the user can't create a new game.
  useEffect(() => {
    getUserDetails();
  }, []);

  const allMembersLength = allMembers.length;
  useEffect(() => {
    setMembers(allMembers.slice(0, 3));
  }, [allMembersLength]);

  if (!channel) return null;

  const channelCreatorId =
    channel.data && (channel.data.created_by_id || (channel.data.created_by as UserResponse)?.id);

  const hitPlayer = async () => {
    //TODO catch failure
    const res: any = await fetchPost(
      'http://localhost:5001/game-7bb7c/us-central1/requestHitPlayerEmpty',
      {
        gameId,
        requestUserName: chatClient?.user?.id,
      },
    );

    console.log('GroupChannelDetailsScreen@hitPlayer');
    console.log('hitplayer res', res);

    setUserDetailsState((prevState) => ({
      ...prevState,
      lastFetchedMillis: performance.now(),
      targetPlayers: res.newTargetUsers,
    }));

    AsyncStorage.setItem(gameId, {
      gameStarted: true,
      lastFetchedMillis: performance.now(),
      targetPlayers: res.newTargetUsers,
    });

    setAppOverlay('none');
    setOverlay('none');
  };

  const openHitPlayerConfirmationSheet = () => {
    if (chatClient?.user?.id) {
      setBottomSheetOverlayData({
        confirmText: 'Tag',
        onConfirm: hitPlayer,
        subtext: `Please be fair! This can not be undone.`,
        title: 'Tag Opponent',
      });
      setAppOverlay('confirmation');
    }
  };

  const openStartGameConfirmationSheet = () => {
    if (chatClient?.user?.id) {
      setBottomSheetOverlayData({
        confirmText: 'Start',
        onConfirm: startGame,
        subtext: `Start the game? This can not be undone!`,
        title: 'Start Game',
      });
      setAppOverlay('confirmation');
    }
  };

  /**
   * Opens confirmation sheet for leaving the group
   */
  const openJoinGameConfirmationSheet = () => {
    if (chatClient?.user?.id) {
      setBottomSheetOverlayData({
        confirmText: 'Join',
        onConfirm: leaveGroup,
        subtext: `Are you sure you want to join the game ${groupName || ''}? The wager is $10. `,
        title: 'Join Game',
      });
      setAppOverlay('confirmation');
    }
  };

  /**
   * Opens confirmation sheet for leaving the group
   */
  const openLeaveGroupConfirmationSheet = () => {
    if (chatClient?.user?.id) {
      setBottomSheetOverlayData({
        confirmText: 'LEAVE',
        onConfirm: leaveGroup,
        subtext: `Are you sure you want to leave the group ${groupName || ''}?`,
        title: 'Leave group',
      });
      setAppOverlay('confirmation');
    }
  };

  /**
   * Cancels the confirmation sheet.
   */
  const openAddMembersSheet = () => {
    if (chatClient?.user?.id) {
      setBottomSheetOverlayData({
        channel,
      });
      setAppOverlay('addMembers');
    }
  };

  const startGame = async () => {
    //TODO use player names from chat.
    //TODO Handle case where game not able to be created.

    // const playerNames = ['vishal', 'neil', 'ben', 'nick'];
    const memberNames = allMembers.map((m) => m.user?.id);
    const playerNames = memberNames.filter((userId) => userId !== channelCreatorId);
    const res = await fetchPost('http://localhost:5001/game-7bb7c/us-central1/createGame', {
      playerNames,
      gameId,
    });

    console.log('GroupChannelDetailsScreen@startGame');
    console.log(res);

    //TODO check for error case here
    setUserDetailsState((prevState) => ({
      ...prevState,
      gameStarted: true,
      lastFetchedMillis: performance.now(),
    }));

    AsyncStorage.setItem(gameId, {
      gameStarted: true,
      lastFetchedMillis: -1,
      targetPlayers: [],
    });

    // async function postData(url = '', data = {}) {
    //   // Default options are marked with *
    //   const response = await fetch(url, {
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //       'Content-Type': 'application/json'
    //       // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     redirect: 'follow', // manual, *follow, error
    //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     body: JSON.stringify(data) // body data type must match "Content-Type" header
    //   });
    //   return response.json(); // parses JSON response into native JavaScript objects
    // }

    // axios
    //   .post(`http://localhost:5001/game-7bb7c/us-central1/createGame`, { playerNames })
    //   //TODO handle error cases.
    //   //TODO wrapper to handle network and other types of failures
    //   .then((res) => {
    //     console.log('GroupChannelDetailsScreen@startGame');
    //     console.log(res);
    //     console.log(res.data);

    //     //TODO check for error case here
    //     setGameStartedState({ gameStarted: true, lastFetchedMillis: performance.now() });
    //   })
    //   .catch((err) => {
    //     console.log('Failed to make POST to `createGame` endpoint ');
    //     console.log(err);
    //   });

    setAppOverlay('none');
    setOverlay('none');

    //Don't navigate back since we can't update gameStartedState.
    //TODO should set such data somehwere else.

    //There shouldn't be a case where we don't have anything to go back to.
    // if (!navigation.canGoBack()) {
    //   console.warn('nothing to go back to');
    // } else {
    //   navigation.goBack();
    // }
  };

  //TODO add wager logic here.
  // const joinGame = async () => {
  //   if (chatClient?.user?.id) {
  //     await channel.removeMembers([chatClient?.user?.id]);
  //   }

  //   // setBlurType(undefined);
  //   setAppOverlay('none');
  //   setOverlay('none');

  //   navigation.reset({
  //     index: 0,
  //     routes: [
  //       {
  //         name: 'ChatScreen',
  //       },
  //     ],
  //   });
  // };

  /**
   * Leave the group/channel
   */
  const leaveGroup = async () => {
    if (chatClient?.user?.id) {
      await channel.removeMembers([chatClient?.user?.id]);
    }

    // setBlurType(undefined);
    setAppOverlay('none');
    setOverlay('none');

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'ChatScreen',
        },
      ],
    });
  };

  console.log('state ', userDetailsState);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: white }]}>
      <ScreenHeader
        inSafeArea
        RightContent={() =>
          channelCreatorId === chatClient?.user?.id ? (
            <RoundButton onPress={openAddMembersSheet}>
              <AddUser fill={accent_blue} height={24} width={24} />
            </RoundButton>
          ) : null
        }
        subtitleText={membersStatus}
        titleText={displayName}
      />
      <ScrollView keyboardShouldPersistTaps='always' style={{ backgroundColor: white }}>
        {members.map((member) => {
          if (!member.user?.id) return null;

          return (
            <TouchableOpacity
              key={member.user.id}
              onPress={() => {
                if (member.user?.id !== chatClient?.user?.id) {
                  setUserInfoOverlayData({
                    channel,
                    member,
                    navigation,
                  });
                  setAppOverlay('userInfo');
                }
              }}
              style={[
                styles.memberContainer,
                {
                  borderBottomColor: border,
                },
              ]}
            >
              <View style={styles.memberRow}>
                <Avatar
                  channelId={channel.id}
                  id={member.user?.id}
                  image={member.user?.image}
                  name={member.user?.name}
                  online={member.user?.online}
                  size={40}
                />
                <View style={styles.memberDetails}>
                  <Text style={[{ color: black }, styles.memberName]}>{member.user?.name}</Text>
                  <Text style={{ color: grey }}>{getUserActivityStatus(member.user)}</Text>
                </View>
              </View>
              <Text style={{ color: grey }}>
                {channelCreatorId === member.user?.id ? 'owner' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
        {allMembersLength !== members.length && (
          <TouchableOpacity
            onPress={() => {
              setMembers(Object.values(channel.state.members));
            }}
            style={[
              styles.loadMoreButton,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <DownArrow height={24} width={24} />
            <Text
              style={[
                styles.loadMoreText,
                {
                  color: grey,
                },
              ]}
            >
              {`${allMembersLength - members.length} more`}
            </Text>
          </TouchableOpacity>
        )}

        <Spacer />
        <>
          <View
            style={[
              styles.changeNameContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.changeNameInputContainer}>
              <Text style={{ color: grey }}>NAME</Text>
              <TextInput
                onBlur={() => {
                  setTextInputFocused(false);
                }}
                onChangeText={setGroupName}
                onFocus={() => {
                  setTextInputFocused(true);
                }}
                placeholder='Add a group name'
                placeholderTextColor={grey}
                ref={textInputRef}
                style={[{ color: black }, styles.changeNameInputBox]}
                value={groupName}
              />
            </View>
            <View style={[styles.row, { opacity: textInputFocused ? 1 : 0 }]}>
              <TouchableOpacity
                onPress={() => {
                  setGroupName(channel.data?.name);
                  textInputRef.current && textInputRef.current.blur();
                }}
                style={{
                  paddingRight: 8,
                }}
              >
                <CircleClose height={24} width={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await channel.update({
                    ...channel.data,
                    name: groupName,
                  } as Parameters<Channel<StreamChatGenerics>['update']>[0]);
                  if (textInputRef.current) {
                    textInputRef.current.blur();
                  }
                }}
              >
                {!!groupName && <Check fill={accent_blue} height={24} width={24} />}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.actionContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <Mute height={24} width={24} />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: black,
                  },
                ]}
              >
                Mute group
              </Text>
            </View>
            <View>
              <Switch
                onValueChange={async () => {
                  if (muted) {
                    await channel.unmute();
                  } else {
                    await channel.mute();
                  }

                  setMuted((previousState) => !previousState);
                }}
                trackColor={{
                  false: white_smoke,
                  true: accent_green,
                }}
                value={muted}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChannelPinnedMessagesScreen', {
                channel,
              });
            }}
            style={[
              styles.actionContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <Pin fill={grey} />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: black,
                  },
                ]}
              >
                Pinned Messages
              </Text>
            </View>
            <View>
              <GoForward height={24} width={24} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChannelImagesScreen', {
                channel,
              });
            }}
            style={[
              styles.actionContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <Picture fill={grey} />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: black,
                  },
                ]}
              >
                Photos and Videos
              </Text>
            </View>
            <View>
              <GoForward height={24} width={24} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChannelFilesScreen', {
                channel,
              });
            }}
            style={[
              styles.actionContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <File />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: black,
                  },
                ]}
              >
                Files
              </Text>
            </View>
            <View>
              <GoForward height={24} width={24} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openLeaveGroupConfirmationSheet}
            style={[
              styles.actionContainer,
              {
                borderBottomColor: border,
              },
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <RemoveUser height={24} width={24} />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: black,
                  },
                ]}
              >
                Leave Group
              </Text>
            </View>
          </TouchableOpacity>

          {
            /* JoinGame */
            <TouchableOpacity
              onPress={openJoinGameConfirmationSheet}
              style={[
                styles.actionContainer,
                {
                  borderBottomColor: border,
                },
              ]}
            >
              <View style={styles.actionLabelContainer}>
                <RemoveUser height={24} width={24} />
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: black,
                    },
                  ]}
                >
                  Join Game
                </Text>
              </View>
            </TouchableOpacity>
          }
          {
            /* Moderator options */
            // TODO more correct logic here.
            channelCreatorId === chatClient?.user?.id && (
              <TouchableOpacity
                //TODO change color when not possible to start game
                disabled={userDetailsState.gameStarted}
                onPress={openStartGameConfirmationSheet}
                style={[
                  styles.actionContainer,
                  {
                    borderBottomColor: border,
                    backgroundColor:
                      userDetailsState.gameStarted && userDetailsState.dataLoaded ? '#F5F4F4' : '',
                  },
                ]}
              >
                <View style={styles.actionLabelContainer}>
                  <RemoveUser height={24} width={24} />
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: black,
                      },
                    ]}
                  >
                    Start Game
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
          {
            /* Hit Player */
            userDetailsState.gameStarted && userDetailsState.targetPlayers.length !== 0 && (
              <TouchableOpacity
                // disabled={userDetailsState.targetPlayers[0] === ''}
                onPress={openHitPlayerConfirmationSheet}
                style={[
                  styles.actionContainer,
                  {
                    borderBottomColor: border,
                  },
                ]}
              >
                <View style={styles.actionLabelContainer}>
                  <RemoveUser height={24} width={24} />
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: black,
                      },
                    ]}
                  >
                    {/* TODO this is only for the single target case. */}
                    Tag {userDetailsState.targetPlayers[0]}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
        </>
      </ScrollView>
    </SafeAreaView>
  );
};
