import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, TextInput, View} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default class UserInput extends Component {
    render() {
        return (
            <View style={styles.inputWrapper}>
                <MaterialIcons
                    name={this.props.source}
                    style={styles.inlineImg}
                    size={24}>
                </MaterialIcons>
                <TextInput
                    style={styles.input}
                    placeholder={this.props.placeholder}
                    secureTextEntry={this.props.secureTextEntry}
                    autoCorrect={this.props.autoCorrect}
                    autoCapitalize={this.props.autoCapitalize}
                    returnKeyType={this.props.returnKeyType}
                    placeholderTextColor="lightgrey"
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid="rgba(0,0,0,0)"
                />
            </View>
        );
    }
}


UserInput.propTypes = {
    value: PropTypes.string,
    source: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    secureTextEntry: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    returnKeyType: PropTypes.string,
    onChangeText: PropTypes.func
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: DEVICE_WIDTH - 40,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 45,
        color: 'black',
        borderRadius: 5,
        borderColor: 'lightgrey',
        borderWidth: 1,
    },
    inputWrapper: {
        flex: 1,
    },

    inlineImg: {
        position: 'absolute',
        zIndex: 99,
        width: 22,
        height: 22,
        left: 35,
        top: 9,
        color: 'lightgrey'
    },
});
