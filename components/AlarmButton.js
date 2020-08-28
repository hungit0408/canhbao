
import React, {Component} from 'react';
import {Text, View} from "native-base";
import {ActivityIndicator, TouchableOpacity, Animated, StyleSheet} from "react-native";
import Dimensions from 'Dimensions';
import PropTypes from 'prop-types';

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

export default class AlarmButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            label: 'NOTIFICATION'
        };

        this.buttonAnimated = new Animated.Value(0);
        this.growAnimated = new Animated.Value(0);
    }

    render() {

        const changeWidth = this.buttonAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
        });
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, MARGIN],
        });

        return (
            <View style={styles.btn_container}>
                <Animated.View style={{width: changeWidth}}>
                    <TouchableOpacity style={styles.button} onPress={this.props.doAction}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{this.props.label}</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.circle, {transform: [{scale: changeScale}]}]}/>
                </Animated.View>
            </View>
        )
    }
}

AlarmButton.propTypes = {
    label: PropTypes.string.isRequired,
    doAction: PropTypes.func,
    loading: PropTypes.bool
};

const styles = StyleSheet.create({
    btn_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    circle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: '#e25822',
        borderRadius: 100,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: '#e25822',
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e25822',
        height: 40,
        borderRadius: 5,
        marginTop: 10,
        zIndex: 100,
    },
});