import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

export default class SignupSection extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text} onPress={this.props.onPress}>Forgot Password?</Text>
            </View>
        );
    }
}

SignupSection.propTypes = {
    onPress: PropTypes.func
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: 30,
        top: -65,
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        color: 'blue',
        backgroundColor: 'transparent',
        fontStyle: 'italic'
    },
});
