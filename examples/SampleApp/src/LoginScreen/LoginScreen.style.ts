import { Dimensions, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
const { width: ScreenWidth } = Dimensions.get('screen');

interface Style {
  container: ViewStyle;
  logoImageStyle: ImageStyle;
  textInputContainer: ViewStyle;
  passwordTextInputContainer: ViewStyle;
  loginButtonStyle: ViewStyle;
  backButtonStyle: ViewStyle;
  loginTextStyle: TextStyle;
  backTextStyle: TextStyle;
  signupStyle: ViewStyle;
  signupTextStyle: TextStyle;
  dividerStyle: ViewStyle;
  socialLoginContainer: ViewStyle;
  facebookSocialButtonTextStyle: TextStyle;
  twitterSocialButtonTextStyle: TextStyle;
  discordSocialButtonTextStyle: TextStyle;
  socialButtonStyle: ViewStyle;
}

export default StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  logoImageStyle: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  textInputContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordTextInputContainer: {
    marginTop: 16,
  },
  loginButtonStyle: {
    height: 40,
    width: ScreenWidth * 0.9,
    backgroundColor: '#453837',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 32,
    elevation: 5,
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowColor: '#166080',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  backButtonStyle: {
    height: 25,
    width: ScreenWidth * 0.2,
    backgroundColor: '#723112',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    // marginTop: 10,
    marginLeft: 20,
    elevation: 5,
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowColor: '#166080',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  loginTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupStyle: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupTextStyle: {
    color: '#acabb0',
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    width: ScreenWidth * 0.8,
    alignSelf: 'center',
    backgroundColor: '#ccc',
  },
  socialLoginContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  facebookSocialButtonTextStyle: {
    color: '#4267B2',
  },
  twitterSocialButtonTextStyle: {
    color: '#56bfe8',
  },
  discordSocialButtonTextStyle: {
    color: '#5865F2',
  },
  socialButtonStyle: {
    marginTop: 16,
  },
});
