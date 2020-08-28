/**
 * @author NAMNV8
 *
 */


import React, {Component} from 'react';
import {AsyncStorage, KeyboardAvoidingView, StyleSheet} from 'react-native';
import Logo from "../components/Logo";
import Form from "../components/Form";

import {ProgressDialog} from 'react-native-simple-dialogs';
import PropTypes from 'prop-types';
import AlarmButton from "../components/AlarmButton";

const MARGIN = 40;

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            inputText: '',
            isLogged: false,
            username: '',
            password: ''
        };

    }

    componentDidMount() {
        AsyncStorage.clear();
    }

    componentWillUnmount() {
    }

    render() {

        return (
            <KeyboardAvoidingView behavior="position" style={styles.container}>
                {<Logo/>}
                <Form ref='loginForm' username={this.state.username} password={this.state.password}/>

                <AlarmButton label="ĐĂNG NHẬP" doAction={this.props.signIn} loading={this.state.isLoading}/>

                <ProgressDialog
                    visible={this.props.isLoading}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."
                />
            </KeyboardAvoidingView>
        );
    }
}


LoginScreen.propTypes = {
    signIn: PropTypes.func,
    isLoading: PropTypes.bool
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(244,81,44)',
        height: MARGIN,
        borderRadius: 5,
        zIndex: 100,
    },
    circle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: 'rgb(244,81,44)',
        borderRadius: 20,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: 'rgb(244,81,44)',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    image: {
        width: 24,
        height: 24,
    },
});