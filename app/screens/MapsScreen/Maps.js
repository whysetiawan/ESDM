/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Alert
} from 'react-native';
import globalStyles from '../../assets/global/styles';
import MapView, { Marker, Callout } from 'react-native-maps';
import ImageProgress from 'react-native-image-progress';
import geolib from 'geolib';
import Icon from 'react-native-vector-icons/Ionicons'
import Axios from 'axios';
import Loader from '../../assets/elements/Loader';
import Searchbar from '../../assets/elements/Searchbar';
import { Divider } from 'react-native-elements';


const distance = (geolib.getDistance(
  {latitude: -6.914744, longitude: 107.609810},
  {latitude: `6° 32' S`, longitude: `107° 26' E`}
))

export default class App extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitleStyle: {
      flex:1,
      textAlign: 'center'
    } ,
    headerLeft: <View />, 
    headerTitle: 'MAPS',
    headerRight: (
      <Icon name="ios-search" size={35} style={{ marginRight: 10 }} color='#222' onPress={() => navigation.state.params.alertFilter() } />
    ),
  })

  constructor(props){
    super(props);

    this.state = {
      region :
      {latitude: -6.914744, longitude: 107.609810,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      showFilter: false,
      loadingSearch: false,
      locations: [],
      ready: false,
      text: '',
      message: 'Enter Location Name',
      filteredLocations: []
    }
    this.delayTimer;
  }
  
  componentWillMount(){
    this.regionFrom(this.state.region.latitude, this.state.region.longitude);
  }

  componentDidMount(){
    this.props.navigation.setParams({ alertFilter: this.alertFilter.bind(this) })
    this.onFetch();
  }

  async onFetch(){
    try {
      const locations = await Axios.get('http://esdm-basis-data.sanbersy.com/search-location')
      this.setState({ locations: locations.data, })
    } catch (err) {
      return Alert.alert("Error", "Failed to load locations")
    }
  }
  
  alertFilter(){
    this.setState({ showFilter: true })
  }
  
  regionFrom(lat, lon) {
    distance = distance/2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance/circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
            Math.sin(angularDistance)*Math.cos(lat),
            Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

    return this.setState({
      region : {
        latitude: lat,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
      }
    })
  }
  

  onSearch(text){
    this.setState({ text: text, message: "Searching..." })
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(async () => {
      try {
        this.setState({ loadingSearch: true })
        const locations = await Axios.get('http://esdm-basis-data.sanbersy.com/search-location?nama=' + text)
        if(locations.data.length < 1){
          return this.setState({ message: "Location not found", loadingSearch: false })
        }
        return this.setState({ filteredLocations: locations.data, loadingSearch: false })
      } catch (err) {
        return this.setState({ message: "Failed to search location", loadingSearch: false})
      }
    }, 2000)
  }

  ListEmptyComponent(){
    return(
      <View style={{ backgroundColor: 'white', padding: '3%', alignItems:'center' }}>
        <Text style={{ color: 'black' }} >{this.state.message}</Text>
      </View>
    )
  }

  renderItem({ item }) {
    return(
      <TouchableNativeFeedback
        onPress={() => {
          this.setState({ showFilter: false })
          this.m.animateToCoordinate({
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude)
          }, 750)
          this[item.id].showCallout();
        }}
      >
        <View style={{ backgroundColor: 'white', padding: '3%', alignItems:'center' }}>
          <Text style={{ color: 'black' }} >{item.nama}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
  
  render() {
    return (
        <View style={{ flex: 1}} >
          <MapView
            style={globalStyles.container}
            initialRegion={this.state.region}
            onMapReady={() => this.setState({ ready: true })}
            loadingBackgroundColor='rgba(0,0,0,0.2)'
            ref={(m) => this.m = m}
            >
            {this.state.locations.map((marker, index) => {
              return (
                <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
                pinColor="green"
                ref={c => this[marker.id] = c}
              >
              <Callout              
                onPress={() => this.props.navigation.navigate("Detail",marker)}
              >
                <View style={{ padding: 5}}>
                  <Text style={{ fontWeight: 'bold', color: 'black' }}>{marker.nama}</Text>
                  <Text style={{ fontSize: 12 }}>DMS Latitude : {marker.dms_latitude}</Text>
                  <Text style={{ fontSize: 12 }}>DMS Longitude : {marker.dms_longitude}{'\n'}</Text>
                </View>
              </Callout>
                
              </Marker>
              )
            })}
          </MapView>
        <Loader visible={this.state.locations.length < 1 && this.state.ready == true  ? true : false} />
        <Searchbar
          //Modal Props
          transparent
          noIcon
          visible={this.state.showFilter}
          onRequestClose={() => this.setState({ showFilter: false })}
          onChangeText={this.onSearch.bind(this)}

          //Searchbar props
          value={this.state.text}
          showLoadingIcon={this.state.loadingSearch}
          inputStyle={{ color: 'black' }}
          lightTheme

          //FlatList Props
          ListEmptyComponent={this.ListEmptyComponent.bind(this)}
          data={this.state.filteredLocations}
          extraData={this.state.filteredLocations}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider backgroundColor="gray" />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
