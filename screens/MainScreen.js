/**
 * @author NAMNV8
 */

import React, {Component} from 'react';
import {createStackNavigator, DrawerNavigator, StackNavigator} from "react-navigation";
import ProfileScreen from "./ProfileScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import LinksScreen from "./LinksScreen";
import HomeScreen from "./HomeScreen";
import SignInScreen from "./SignInScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomDrawerContentComponent from "../components/CustomDrawerContentComponent";

const LeftMenu = DrawerNavigator({
        HOME: {screen: HomeScreen},
        PROFILE: {screen: ProfileScreen},
        CHANGE_PASS: {screen: ChangePasswordScreen},
        ABOUT: {screen: LinksScreen},
        LOG_OUT: {screen: SignInScreen}
    },
    {
        initialRouteName: 'HOME',

        contentComponent: props => <CustomDrawerContentComponent {...props}/>,

        drawerCloseRoute: 'DrawerClose',
        drawerOpenRoute: 'DrawerOpen',
        drawerToggleRoute: 'DrawerToggle'
    }
);


const DrawerNavigation = StackNavigator(
    {
        LeftMenu: {screen: LeftMenu}
    },
    {
        navigationOptions: ({navigation}) => ({
            mode: 'card',
            headerStyle: {backgroundColor: '#e25822', color: 'white'},
            headerLeft: <MaterialIcons name="menu" style={{padding: 5, color: 'white'}} size={35}
                                       onPress={() => navigation.navigate('DrawerOpen')}/>,
        })
    }
);

export default class MainScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return <DrawerNavigation/>;
    }
}

