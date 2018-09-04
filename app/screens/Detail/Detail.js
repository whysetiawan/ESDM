/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Card } from 'react-native-elements';
import ImageProgress from 'react-native-image-progress';


export default class App extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.nama
  })

  render() {
    const { params } = this.props.navigation.state
    return (
      <View style={styles.container}>
        <Card
          title={params.name}
          containerStyle={{ height: '95%' }}
          >
          <ImageProgress
            source={{ uri: 'data:image/png;base64,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' }}
            style={{ height: '50%', width:'100%' }}
            resizeMethod='resize'
            resizeMode='contain'
            />
          <Text>DMS Longitude : {params.dms_longitude}</Text>
          <Text>DMS Latitude : {params.dms_latitude}</Text>
          <View style={{ marginVertical: '3%' }}>
            <Text style={{ color: 'black' }} >Description</Text>
            <Text style={{ fontSize: 12 }}>
              {params.category.deskripsi}
            </Text>
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
