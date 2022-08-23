import { useAppContext } from '../context/AppContext';
import { fetchPost } from '../utils/fetch';

const statue = require('../icons/logo.jpeg');
import styles from './LoginScreen.style';
import React from 'react';
import { Button, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import { compose } from 'recompose';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import { OutlinedTextField } from 'react-native-material-textfield';
import * as Yup from 'yup';

const CustomTextBox = (props) => <OutlinedTextField {...props} fontSize={14} />;

const FormikInput = compose(handleTextInput, withNextInputAutoFocusInput)(CustomTextBox);

const InputsContainer = withNextInputAutoFocusForm(View);

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchemaDebug = Yup.object().shape({
  phone: Yup.string().required(),
  password: Yup.string().required(),
});

const validationSchema = Yup.object().shape({
  phone: Yup.string().required().matches(phoneRegExp, 'Phone number not valid'),
  password: Yup.string().required().min(4, "That can't be very secure"),
});

const LoginScreen = ({ navigation }) => {
  const { loginUser } = useAppContext();
  return (
    <SafeAreaView style={[styles.container]}>
      <Image resizeMode='contain' source={statue} style={styles.logoImageStyle} />
      <View style={styles.textInputContainer}>
        <Formik
          initialValues={{ phone: '', password: '' }}
          onSubmit={async (values: Record<any, any>, { setErrors }) => {
            const { password, phone } = values;
            await fetchPost(`login`, {
              phone,
              password,
            })
              .then((res: any) => {
                if (res.error) {
                  setErrors(res.error);
                } else {
                  loginUser({ apiKey: 'qkytr4kxy8c5', userId: res.id, userToken: res.token });
                }
              })
              .catch((err) => console.warn('[login-screen] ()', err));
          }}
          validationSchema={__DEV__ ? validationSchemaDebug : validationSchema}
        >
          {(props) => (
            <InputsContainer style={{ padding: 10 }}>
              <FormikInput label='phone' name='phone' type='phone' />
              <FormikInput label='password' name='password' type='password' />

              <TouchableOpacity onPress={props.handleSubmit} style={styles.loginButtonStyle}>
                <Text style={styles.loginTextStyle}> Login </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignUpScreen');
                }}
                style={styles.signupStyle}
              >
                <Text style={styles.signupTextStyle}> Sign Up </Text>
              </TouchableOpacity>

              {/* <Text style={{ fontSize: 20 }}>{JSON.stringify(props, null, 2)}</Text> */}
            </InputsContainer>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
