import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {Image, StyleSheet, TouchableOpacity,} from 'react-native';
import eyeImg from '../assets/images/eye_black.png';
import PropTypes from 'prop-types';
import UserInput from "./UserInput";
import {View} from "native-base";


const login = ({
    username: '',
    password: ''
});

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPass: true,
            press: false,
            username: this.props.username,
            password: this.props.password
        };
        login.username = this.props.username;
        login.password = this.props.password;

        this.showPass = this.showPass.bind(this);

        this.handlePassword = this.handlePassword.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
    }

    showPass() {
        this.state.press === false
            ? this.setState({showPass: false, press: true})
            : this.setState({showPass: true, press: false});
    }

    handleUsername = (value) => {
        this.setState({
            username: value
        });
        this.props.username = value;

        login.username = value;
    };

    handlePassword = (value) => {
        this.setState({password: value});
        this.props.password = value;

        login.password = value;
    };

    static getLoginForm() {
        return login;
    }

    render() {
        return (
            <View style={styles.container}>
                <UserInput
                    source='account-circle'
                    placeholder="Tài Khoản"
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    value={this.state.username}
                    onChangeText={this.handleUsername}
                    autoCorrect={false}
                />
                <UserInput
                    source='security'
                    secureTextEntry={this.state.showPass}
                    placeholder="Mật khẩu"
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    value={this.state.password}
                    onChangeText={this.handlePassword}
                    autoCorrect={false}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.btnEye}
                    onPress={this.showPass}>
                    <Image source={eyeImg} style={styles.iconEye}/>
                </TouchableOpacity>
            </View>
        );
    }
}

Form.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnEye: {
        position: 'absolute',
        top: 74,
        right: 28,
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.2)',
    },
});
