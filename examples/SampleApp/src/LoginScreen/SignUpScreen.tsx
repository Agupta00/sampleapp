import { useAppContext } from '../context/AppContext';
import { fetchPost } from '../utils/fetch';

import React from 'react';
import styles from './LoginScreen.style';
const statue = require('../icons/logo.jpeg');
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
  username: Yup.string().required(),
  name: Yup.string()
    .matches(/^[aA-zZ\s]+$/, 'Please enter valid name')
    .max(40),
});

const validationSchema = Yup.object().shape({
  phone: Yup.string().matches(phoneRegExp, 'Phone number not valid'),
  password: Yup.string().required().min(3, "That can't be very secure"),
  username: Yup.string()
    .required()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'no special characters please'),
  name: Yup.string()
    .matches(/^[aA-zZ\s]+$/, 'Please enter valid name')
    .max(40)
    .required(),
});

type Values = {
  phone: string;
  password: string;
  username: string;
  name: string;
};

const SignUpScreen = ({ navigation }) => {
  const { loginUser } = useAppContext();
  return (
    <SafeAreaView style={[styles.container]}>
      <Image resizeMode='contain' source={statue} style={styles.logoImageStyle} />
      <View style={styles.textInputContainer}>
        <Formik
          initialValues={{
            phone: '',
            password: '',
            username: '',
            name: '',
          }}
          onSubmit={async (values: Values, { setErrors }) => {
            const { name, password, phone, username } = values;
            await fetchPost(`createUser`, {
              phone,
              password,
              username,
              name,
            })
              .then((res: any) => {
                console.log('createUser res()', res, typeof res);
                if (res.error) {
                  setErrors(res.error);
                } else {
                  loginUser({ apiKey: 'qkytr4kxy8c5', userId: username, userToken: res.token });
                }
              })
              .catch((err) => console.warn('createUser ()', err));
          }}
          validationSchema={__DEV__ ? validationSchemaDebug : validationSchema}
        >
          {(props) => (
            <InputsContainer style={{ padding: 10 }}>
              <FormikInput label='phone' name='phone' type='phone' />
              <FormikInput label='password' name='password' type='password' />
              <FormikInput label='username' name='username' type='string' />
              <FormikInput label='name' name='name' type='string' />

              <TouchableOpacity onPress={props.handleSubmit} style={styles.loginButtonStyle}>
                <Text style={styles.loginTextStyle}> Sign Up </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('LoginScreen');
                }}
                style={styles.signupStyle}
              >
                <Text style={styles.signupTextStyle}> Back </Text>
              </TouchableOpacity>

              {/* <Text style={{ fontSize: 20 }}>{JSON.stringify(props, null, 2)}</Text> */}
            </InputsContainer>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
