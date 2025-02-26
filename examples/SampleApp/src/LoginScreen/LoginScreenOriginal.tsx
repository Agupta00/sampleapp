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

// const SignUpScreen: React.FC<ILoginScreenProps> = ({
//   style,
//   dividerStyle,
//   logoImageStyle,
//   loginTextStyle,
//   loginButtonStyle,
//   signupTextStyle,
//   signupStyle,
//   textInputContainerStyle,
//   signupText = 'Create an account',
//   disableDivider,
//   logoImageSource,
//   onLoginPress,
//   disableSocialButtons,
//   onSignupPress,
//   onEmailChange,
//   onPasswordChange,
//   onFacebookPress = dummyFunction,
//   onTwitterPress = dummyFunction,
//   onApplePress = dummyFunction,
//   onDiscordPress = dummyFunction,
//   emailPlaceholder = 'Phone',
//   passwordPlaceholer = 'Password',
//   disableSignup = true,
//   children,
// }) => {
//   const Logo = () => (
//     <Image
//       resizeMode='contain'
//       source={logoImageSource}
//       style={[styles.logoImageStyle, logoImageStyle]}
//     />
//   );

//   const [errorMessage, setErrorMessage] = React.useState('');
//   const errorStyle = { textAlign: 'center', fontSize: 16, includeFontPadding: true, color: 'red' };

//   // const [textState, setTextState] = React.useState({
//   //   phone: '',
//   //   password: '',
//   //   username: '',
//   //   name: '',
//   // });

//   let phone = '';
//   let password = '';
//   let username = '';
//   let name = '';

//   const updatePhone = (text: string) => {
//     phone = text;
//   };
//   const updatePassword = (text: string) => {
//     password = text;
//   };
//   const updateUsername = (text: string) => {
//     username = text;
//   };
//   const updateName = (text: string) => {
//     name = text;
//   };

//   const TextInputContainer = () => (
//     <View style={[styles.textInputContainer, textInputContainerStyle]}>
//       <TextInput onChangeText={updatePhone} placeholder={emailPlaceholder} />
//       <View style={styles.passwordTextInputContainer}>
//         <TextInput onChangeText={updatePassword} placeholder={passwordPlaceholer} />
//       </View>

//       <View style={styles.passwordTextInputContainer}>
//         <TextInput onChangeText={updateUsername} placeholder={'Username'} />
//       </View>

//       <View style={styles.passwordTextInputContainer}>
//         <TextInput onChangeText={updateName} placeholder={'Name'} />
//       </View>
//     </View>
//   );

//   // const LoginButton = () => (
//   //   <TouchableOpacity onPress={onLoginPress} style={[styles.loginButtonStyle, loginButtonStyle]}>
//   //     <Text style={[styles.loginTextStyle, loginTextStyle]}>Login</Text>
//   //   </TouchableOpacity>
//   // );

//   const [testStyle, setTestStyle] = React.useState([styles.loginTextStyle, signupTextStyle]);

//   const onSignupPress1 = async () => {
//     // if (!phone || !password || !username || !name) {
//     //   formError();
//     // }

//     await fetchPost('http://localhostcreateUser', {
//       phone,
//       password,
//       username,
//       name,
//     })
//       .then((res: any) => {
//         console.log('createUser res()', res, typeof res);
//         if (res.error) {
//           setErrorMessage(res.error);
//           setTimeout(() => {
//             setErrorMessage('');
//           }, 1500);
//         } else {
//           console.log(res);
//           //navigate to signed in screen.
//         }

//         // AsyncStorage.setItem(gameId, newUserDetails);
//       })
//       .catch((err) => console.warn('createUser ()', err));
//   };

//   const formError = () => {
//     setTestStyle([
//       {
//         color: '#ff0000',
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
//     ]);

//     // setErrorMessage('Invalid Form!');

//     setTimeout(() => {
//       setTestStyle([styles.loginTextStyle]);
//     }, 400);

//     setTimeout(() => {
//       setErrorMessage('');
//     }, 1500);
//   };

//   const SignUpButton = () => (
//     <TouchableOpacity onPress={onSignupPress1} style={[styles.loginButtonStyle, loginButtonStyle]}>
//       <Text style={testStyle}>Sign Up</Text>
//     </TouchableOpacity>
//   );

//   const BackButton = () => (
//     <TouchableOpacity style={styles.backButtonStyle}>
//       <Text style={styles.backTextStyle}>Back</Text>
//     </TouchableOpacity>
//   );

//   const SignUp = () => (
//     <TouchableOpacity onPress={onSignupPress} style={[styles.signupStyle, signupStyle]}>
//       <Text style={testStyle}>{signupText}</Text>
//     </TouchableOpacity>
//   );

//   const Divider = () => <View style={[styles.dividerStyle, dividerStyle]} />;

//   const DefaultSocialLoginButtons = () =>
//     !disableSocialButtons ? (
//       <>
//         <SocialButton
//           onPress={onFacebookPress}
//           text='Continue with Facebook'
//           textStyle={styles.facebookSocialButtonTextStyle}
//         />
//         <SocialButton
//           imageSource={require('./local-assets/twitter.png')}
//           onPress={onTwitterPress}
//           style={styles.socialButtonStyle}
//           text='Continue with Twitter'
//           textStyle={styles.twitterSocialButtonTextStyle}
//         />
//         <SocialButton
//           imageSource={require('./local-assets/apple.png')}
//           onPress={onApplePress}
//           style={styles.socialButtonStyle}
//           text='Continue with Apple'
//         />
//         <SocialButton
//           imageSource={require('./local-assets/discord.png')}
//           onPress={onDiscordPress}
//           style={styles.socialButtonStyle}
//           text='Continue with Discord'
//           textStyle={styles.discordSocialButtonTextStyle}
//         />
//       </>
//     ) : null;

//   return (
//     <SafeAreaView style={[styles.container, style]}>
//       <StatusBar barStyle='dark-content' />
//       <Logo />
//       <TextInputContainer />
//       <SignUpButton />
//       <View style={[styles.textInputContainer, textInputContainerStyle]}>
//         <Text style={errorStyle}>{errorMessage}</Text>
//       </View>
//       <BackButton />
//       {!disableSignup && <SignUp />}
//       {!disableDivider && <Divider />}
//       <View style={styles.socialLoginContainer}>{children || <DefaultSocialLoginButtons />}</View>
//     </SafeAreaView>
//   );
// };

const LoginScreen: React.FC<ILoginScreenProps> = ({
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
      <TextInput onChangeText={onEmailChange} placeholder={emailPlaceholder} />
      <View style={styles.passwordTextInputContainer}>
        <TextInput
          onChangeText={onPasswordChange}
          placeholder={passwordPlaceholer}
          secureTextEntry
        />
      </View>
    </View>
  );

  const LoginButton = () => (
    <TouchableOpacity onPress={onLoginPress} style={[styles.loginButtonStyle, loginButtonStyle]}>
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
      {!disableSignup && <SignUp />}
      {!disableDivider && <Divider />}
      <View style={styles.socialLoginContainer}>{children || <DefaultSocialLoginButtons />}</View>
    </SafeAreaView>
  );
};

export { LoginScreen };
