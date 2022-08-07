import * as React from 'react';

import {
  Image,
  ImageStyle,
  SafeAreaView,
  StatusBar,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useAppContext } from '../context/AppContext';
// import TextInput from 'react-native-text-input-interactive';
/**
 * ? Local Imports
 */
import styles from './LoginScreen.style';
import SocialButton from './components/social-button/SocialButton';

import { fetchPost } from '../utils/fetch';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
type CustomImageStyleProp = StyleProp<ImageStyle> | Array<StyleProp<ImageStyle>>;
type CustomTextStyleProp = StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;

const dummyFunction = () => {};
export interface ILoginScreenProps {
  navigation: any;
  signupText?: string;
  disableDivider?: boolean;
  logoImageSource: any;
  disableSocialButtons?: boolean;
  emailPlaceholder?: string;
  passwordPlaceholer?: string;
  disableSignup?: boolean;
  style?: CustomStyleProp;
  dividerStyle?: CustomStyleProp;
  logoImageStyle?: CustomImageStyleProp;
  textInputContainerStyle?: CustomStyleProp;
  loginButtonStyle?: CustomStyleProp;
  loginTextStyle?: CustomTextStyleProp;
  signupStyle?: CustomStyleProp;
  signupTextStyle?: CustomTextStyleProp;
  children?: any;
  onLoginPress: (textState: Record<string, string>) => void;
  onSignupPress: () => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFacebookPress?: () => void;
  onTwitterPress?: () => void;
  onApplePress?: () => void;
  onDiscordPress?: () => void;
}

const LoginScreen: React.FC<ILoginScreenProps> = ({
  navigation,
  style,
  dividerStyle,
  logoImageStyle,
  loginTextStyle,
  loginButtonStyle,
  signupTextStyle,
  signupStyle,
  textInputContainerStyle,
  signupText = 'Create an account',
  disableDivider,
  logoImageSource,
  onLoginPress,
  disableSocialButtons,
  onSignupPress,
  onEmailChange,
  onPasswordChange,
  onFacebookPress = dummyFunction,
  onTwitterPress = dummyFunction,
  onApplePress = dummyFunction,
  onDiscordPress = dummyFunction,
  emailPlaceholder = 'Email',
  passwordPlaceholer = 'Password',
  disableSignup = false,
  children,
}) => {
  const Logo = () => (
    <Image
      resizeMode='contain'
      source={logoImageSource}
      style={[styles.logoImageStyle, logoImageStyle]}
    />
  );

  const TextInputContainer = () => (
    <View style={[styles.textInputContainer, textInputContainerStyle]}>
      <TextInput onChangeText={(text: string) => (phone = text)} placeholder={emailPlaceholder} />
      <View style={styles.passwordTextInputContainer}>
        <TextInput
          onChangeText={(text: string) => (password = text)}
          placeholder={passwordPlaceholer}
          secureTextEntry
        />
      </View>
    </View>
  );

  let phone = '';
  let password = '';

  const updatePhone = (text: string) => {
    phone = text;
  };
  const updatePassword = (text: string) => {
    password = text;
  };

  const [errorMessage, setErrorMessage] = React.useState('');
  const errorStyle = { textAlign: 'center', fontSize: 16, includeFontPadding: true, color: 'red' };

  const { loginUser } = useAppContext();

  const showErrorMsg = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage('');
    }, 1500);
  };

  const onLogin = async () => {
    if (!phone || !password) {
      showErrorMsg('Fill all fields');
    }

    await fetchPost(`:5001/game-7bb7c/us-central1/login`, {
      phone,
      password,
    })
      .then((res: any) => {
        console.log('login res()', res, typeof res);
        if (res.error) {
          showErrorMsg(res.error);
        } else {
          console.log(res);
          //navigates to signed in screen.
          loginUser({ apiKey: 'qkytr4kxy8c5', userId: res.id, userToken: res.token });
        }
        // AsyncStorage.setItem(gameId, newUserDetails);
      })
      .catch((err) => console.warn('[login-screen] ()', err));
  };

  const LoginButton = () => (
    <TouchableOpacity onPress={onLogin} style={[styles.loginButtonStyle, loginButtonStyle]}>
      <Text style={[styles.loginTextStyle, loginTextStyle]}>Login</Text>
    </TouchableOpacity>
  );

  const SignUp = () => (
    <TouchableOpacity onPress={onSignupPress} style={[styles.signupStyle, signupStyle]}>
      <Text style={[styles.signupTextStyle, signupTextStyle]}>{signupText}</Text>
    </TouchableOpacity>
  );

  const Divider = () => <View style={[styles.dividerStyle, dividerStyle]} />;

  const DefaultSocialLoginButtons = () =>
    !disableSocialButtons ? (
      <>
        <SocialButton
          onPress={onFacebookPress}
          text='Continue with Facebook'
          textStyle={styles.facebookSocialButtonTextStyle}
        />
        <SocialButton
          imageSource={require('./local-assets/twitter.png')}
          onPress={onTwitterPress}
          style={styles.socialButtonStyle}
          text='Continue with Twitter'
          textStyle={styles.twitterSocialButtonTextStyle}
        />
        <SocialButton
          imageSource={require('./local-assets/apple.png')}
          onPress={onApplePress}
          style={styles.socialButtonStyle}
          text='Continue with Apple'
        />
        <SocialButton
          imageSource={require('./local-assets/discord.png')}
          onPress={onDiscordPress}
          style={styles.socialButtonStyle}
          text='Continue with Discord'
          textStyle={styles.discordSocialButtonTextStyle}
        />
      </>
    ) : null;

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle='dark-content' />
      <Logo />
      <TextInputContainer />
      <LoginButton />
      <View style={[styles.textInputContainer, textInputContainerStyle]}>
        <Text style={errorStyle}>{errorMessage}</Text>
      </View>
      {!disableSignup && <SignUp />}
      {!disableDivider && <Divider />}
      <View style={styles.socialLoginContainer}>{children || <DefaultSocialLoginButtons />}</View>
    </SafeAreaView>
  );
};

const LoginScreenC: React.FC<Props> = ({ navigation }) => {
  const { loginUser } = useAppContext();

  return (
    <LoginScreen
      disableSocialButtons={true}
      emailPlaceholder={'Phone'}
      loginButtonStyle={{ backgroundColor: '#453837' }}
      logoImageSource={require('../icons/statue.png')}
      logoImageStyle={{ width: 300, height: 300 }}
      navigation={navigation}
      onEmailChange={(email: string) => {}}
      onLoginPress={(data) => {
        console.log(data);
      }}
      onPasswordChange={(password: string) => {}}
      onSignupPress={() => navigation.navigate('SignUpScreen')}
    />
  );
};

export default LoginScreenC;
