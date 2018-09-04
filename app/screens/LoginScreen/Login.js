/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import styles, { height } from '../../assets/global/styles';
import { 
  FormInput,
  FormLabel,
  Button
 } from "react-native-elements";
import { StackActions, NavigationActions } from "react-navigation";

export default class Login extends Component {
  static navigationOptions = () => ({
    header: null
  })

  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      loading: false
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(){
    const { username, password } = this.state;
    if(username == 'admin' && password == 'admin'){
      this.setState({ loading: true });
      setTimeout(() => {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Maps' })
            ]
          })
        );
      }, 1000);
      this.setState({ loading: false });
    }
    else {
      Alert.alert('Oops', 'Invalid Username/Password');
    }
  }

  onChangeText(e){
    this.setState({...e});
  }

  render() {
    return (
    <ScrollView>
      <View style={[styles.centerContainer, { height: height }]}>
        <Image
          source={require('../../assets/images/logo_jabar.png')}
          style={styles.logo}
          resizeMethod='resize'
          resizeMode='contain'
        />
        <View style={{width:'100%'}} >
          <FormLabel>Username</FormLabel>
          <FormInput
            inputStyle={{ width:'100%' }}
            underlineColorAndroid='#222'
            onChangeText={(username) => this.onChangeText({username})}
            value={this.state.username}
          />
        </View>
        <View style={{width:'100%'}} >
          <FormLabel>Password</FormLabel>
          <FormInput
            inputStyle={{ width:'100%' }}
            value={this.state.password}
            underlineColorAndroid='#222'
            onChangeText={(password) => this.onChangeText({password})}
            secureTextEntry
          />
        </View>
        <Button
          containerViewStyle={{ width:'90%', marginTop: '3%' }}
          onPress={this.onLogin}
          backgroundColor="#44bd32"
          loadingRight={this.state.loading}
          title='Sign In' />
      </View>
    </ScrollView>
    );
  }
}