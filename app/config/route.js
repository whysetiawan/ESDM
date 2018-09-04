import { createStackNavigator } from "react-navigation";
import Maps from '../screens/MapsScreen'
import Login from '../screens/LoginScreen'
import Detail from '../screens/Detail'

export default route = createStackNavigator({
    Login : {
        screen: Login
    },
    Maps: {
        screen: Maps
    },
    Detail : {
        screen: Detail
    }
})