/**
 * @author NAMNV8
 *
 */


import React, {Component} from 'react';
import {AsyncStorage, KeyboardAvoidingView, StyleSheet} from 'react-native';
import Logo from "../components/Logo";
import Form from "../components/Form";
import UserService from "../database/UserService";

import {ProgressDialog} from 'react-native-simple-dialogs';
import FAApi from "../constants/Api";
import ToastUtils from "../constants/ToastUtils";
import AlarmButton from "../components/AlarmButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const MARGIN = 40;

export default class SignInScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
            disableOpenGesture: false,
            title: 'Đăng xuất',
            drawerLockMode: 'locked-closed',
            drawerIcon: (tintColor) => {
                return (
                    <MaterialIcons
                        name="exit-to-app"
                        color={'#e25822'}
                        size={24}>
                    </MaterialIcons>
                );
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            inputText: '',
            isLogged: false,
            username: '',
            password: ''
        };

        this._doLogin = this._doLogin.bind(this);

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

                <AlarmButton label="ĐĂNG NHẬP" doAction={this._doLogin} loading={this.state.isLoading}/>

                <ProgressDialog
                    visible={this.state.isLoading}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."
                />
            </KeyboardAvoidingView>
        );
    }

    _doLogin() {
        let login = Form.getLoginForm();
        AsyncStorage.clear();
        if (this.state.isLoading) return;
        if (login.username === '' || login.password === '') {
            ToastUtils.showInfo('Hãy nhập số điện thoại và mật khẩu');
        } else {
            this.setState({isLoading: true});

            FAApi.login(login.username, login.password)
                .then((responseJson) => {
                    this.setState({isLoading: false});
                    if (responseJson.response_code === 200) {
                        UserService.saveUserInfo(responseJson.data);
                        UserService.storeOriginalPass(login.password);
                        UserService.saveUsernameAndPass(login.username, login.password);
                        this.props.navigation.navigate('HOME');
                    } else {
                        ToastUtils.showInfo('Tài khoản hoặc mật khẩu không chính xác');
                    }
                })
                .catch((error) => {
                    this.setState({isLoading: false});
                    ToastUtils.showInfo('Quá trình xử lý bị lỗi!!!');
                });
        }
    }
}

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