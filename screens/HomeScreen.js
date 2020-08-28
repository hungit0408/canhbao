/**
 * @author NAMNV8
 */

import React, {Component} from 'react';
import {Image} from "react-native";

import icon from '../assets/icons/ic_home_black.png';
import {Container} from "native-base";
import AlarmScreen from "./AlarmScreen";

export default class HomeScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            drawerIcon: (tintColor) => {
                return (
                    <Image
                        source={icon}
                        style={{width: 24, height: 24, tintColor: '#e25822'}}>
                    </Image>
                );
            },
        };
    };

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <Container style={{backgroundColor: 'white'}}>
                <AlarmScreen/>
            </Container>
        );
    }
}
