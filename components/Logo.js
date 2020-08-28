/**
 * @author NamNV8
 */

import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bgImg from '../assets/images/logo.png';

export default class Logo extends Component {

    //render UI
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={bgImg} style={styles.image}></ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    image: {
        width: 200,
        height: 200
    },

    text: {
        color: 'blue',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginTop: 20
    }

});