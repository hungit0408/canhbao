import React, {Component} from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import UserInput from "../components/UserInput";
import Logo from "../components/Logo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {ProgressDialog} from "react-native-simple-dialogs";
import FAApi from "../constants/Api";
import ToastUtils from "../constants/ToastUtils";
import UserService from "../database/UserService";

const MARGIN = 40;
export default class ChangePasswordScreen extends Component {

    token = "";
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Đổi mật khẩu',
            drawerIcon: (tintColor) => {
                return (
                    <MaterialIcons
                        name="security"
                        color={'#e25822'}
                        size={24}>
                    </MaterialIcons>
                );
            },
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            isUpdating: false,
            showPass: true,
            old_pass: '',
            new_pass: '',
            re_new_pass: ''
        };

        this._doCancel = this._doCancel.bind(this);

        this._doChangePassword = this._doChangePassword.bind(this);
    }


    _doChangePassword() {
        if (this.state.isUpdating) return;

        this.setState({isUpdating: true});

        let request = {
            old_pass: this.state.old_pass,
            new_pass: this.state.new_pass,
            re_new_pass: this.state.re_new_pass
        };
        console.log(request);
        if (this.validateInput(request)) {
            FAApi.changePassword(this.token, request)
                .then((response) => {
                    this.setState({isUpdating: false});
                    if (response.response_code === 200) {
                        let toast = ToastUtils.showInfo('Cập nhập mật khẩu mới thành công');
                        AsyncStorage.getItem('account').then((account_) => {
                            let account = JSON.parse(account_);
                            if (account !== null) {
                                account.password = request.new_pass;
                                UserService.saveUsernameAndPass(account.username, account.password);
                                AsyncStorage.setItem('password', request.new_pass);
                            }
                        });

                        this.setState({
                            new_pass: '',
                            old_pass: '',
                            re_new_pass: ''
                        });
                        setTimeout(() => {
                            ToastUtils.hide(toast);
                            this.props.navigation.navigate('HOME');
                        }, 800)
                    } else {
                        ToastUtils.showInfo('Cập nhật mật khẩu xảy ra lỗi.');
                    }
                })
                .catch((error) => {
                    ToastUtils.showInfo('Quá trình xử lý bị lỗi!!!');
                    this.setState({isUpdating: false});
                })
        }
    }

    validateInput(request) {
        if (request.old_pass === '') {
            ToastUtils.showInfo('Nhập mật khẩu hiện tại');
            return false;
        }

        if (request.new_pass === '') {
            ToastUtils.showInfo('Nhập mật khẩu mới');
            return false;
        }

        if (request.re_new_pass === '' || request.re_new_pass !== request.new_pass) {
            ToastUtils.showInfo('Xác nhập mật khẩu mới không trùng khớp');
            return false;
        }
        return true;
    }

    componentDidMount() {
        AsyncStorage.getItem('current_user').then((result) => {
            if (result) {
                let currentUser = JSON.parse(result);
                this.token = currentUser.access_token;
            }
        })
    }

    componentWillUnmount() {
        this.setState({
            new_pass: '',
            old_pass: '',
            re_new_pass: ''
        });
    }

    _doCancel() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <Logo style={styles.logo}/>

                <KeyboardAvoidingView behavior="padding" style={styles.content}>
                    <UserInput
                        source='security'
                        placeholder="Mật khẩu hiện tại"
                        autoCapitalize={'none'}
                        secureTextEntry={this.state.showPass}
                        returnKeyType={'done'}
                        value={this.state.old_pass}
                        onChangeText={(value) => {
                            this.setState({old_pass: value})
                        }}
                        autoCorrect={false}
                    />
                    <UserInput
                        source='security'
                        secureTextEntry={this.state.showPass}
                        placeholder="Mật khẩu"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        value={this.state.new_pass}
                        onChangeText={(value) => {
                            this.setState({new_pass: value})
                        }}
                        autoCorrect={false}
                    />

                    <UserInput
                        source='security'
                        secureTextEntry={this.state.showPass}
                        placeholder="Xác nhận mật khẩu mới"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        value={this.state.re_new_pass}
                        onChangeText={(value) => {
                            this.setState({re_new_pass: value})
                        }}
                        autoCorrect={false}
                    />
                </KeyboardAvoidingView>

                <View style={styles.confirm}>
                    <TouchableOpacity style={styles.button} activeOpacity={1}
                                      onPress={this._doChangePassword}>
                        <Text style={styles.button_text}>Cập nhật</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button_cancel} activeOpacity={1}
                                      onPress={this._doCancel}>
                        <Text style={styles.button_text}>Hủy</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isUpdating &&
                <ActivityIndicator style={{marginTop: 10}} size="small" color="rgb(244,81,44)"/>
                }

                <ProgressDialog
                    visible={this.state.isUpdating}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."
                />
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    logo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        flex: 2,
        alignItems: 'center',
    },

    confirm: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    button_cancel: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E27822',
        height: MARGIN,
        width: 150,
        margin: 5,
        borderRadius: 5,
        zIndex: 100,
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E27822',
        height: MARGIN,
        width: 150,
        margin: 5,
        borderRadius: 5,
        zIndex: 100,
    },

    button_text: {
        color: 'white',
        fontWeight: 'bold'
    },

    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },

    image: {
        width: 24,
        height: 24,
    },
});
