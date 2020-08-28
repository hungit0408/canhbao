import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    AsyncStorage,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Dimensions from 'Dimensions';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Switch} from "native-base";
import {ProgressDialog} from "react-native-simple-dialogs";
import FAApi from "../constants/Api";
import ToastUtils from "../constants/ToastUtils";
import {Card} from "react-native-elements";
import bgImg from '../assets/images/logo.png';
import UserInput from "../components/UserInput";
import UserService from "../database/UserService";

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

export default class ProfileScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Thông tin người dùng',

            drawerIcon: (tintColor) => {
                return (
                    <MaterialIcons
                        name="account-circle"
                        color={'#e25822'}
                        size={24}>
                    </MaterialIcons>
                );
            },
        };
    };

    token = "";
    currentUser = null;

    constructor(props) {
        super(props);

        this.state = {
            isUpdating: false,
            phone: '',
            first_name: '',
            last_name: '',
            email: '',
            enableNotify: true
        };

        this._doUpdate = this._doUpdate.bind(this);
        this._doCancel = this._doCancel.bind(this);
        this._settingNotification = this._settingNotification.bind(this);
    }


    componentWillMount() {
        AsyncStorage.getItem('hot_alarm').then(enabled => {
            if (enabled !== null) {
                console.log(enabled);
                this.setState({enableNotify: enabled});
            }
        });

        AsyncStorage.getItem('current_user').then((user) => {
            this.currentUser = JSON.parse(user);
            if (this.currentUser !== null) {
                this.setState({
                    first_name: this.currentUser.first_name,
                    last_name: this.currentUser.last_name,
                    email: this.currentUser.email,
                    phone: this.currentUser.phone,
                });
            }
            this.token = this.currentUser.access_token;
        });
    }

    componentWillUnmount() {
    }

    _settingNotification = (value) => {
        this.setState({
            isUpdating: true,
        });

        FAApi.settingNotification(this.token, value)
            .then((responseJson) => {
                this.setState({isUpdating: false});
                if (responseJson.response_code === 200) {
                    let toast = ToastUtils.showInfo('Setup cảnh báo thành công');
                    AsyncStorage.setItem('hot_alarm', JSON.stringify(value ? 1 : 0));
                    this.setState({
                        enableNotify: value
                    });
                    setTimeout(() => {
                        ToastUtils.hide(toast);
                    }, 1200);
                } else {
                    ToastUtils.showInfo('Setup cảnh báo lỗi');
                }
            })
            .catch((error) => {
                this.setState({isUpdating: false});
                ToastUtils.showInfo('Quá trình xử lý bị lỗi!!!');
            });
    };


    _validateData() {
        if (!this.validateEmail()) {
            ToastUtils.showInfo('Email không hợp lệ');
            return false;
        }

        if (this.state.phone === '') {
            ToastUtils.showInfo('Số điện thoại không hợp lệ');
            return false
        }
        return true;
    }

    validateEmail() {
        let email = this.state.email;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    _doUpdate() {
        if (this.state.isUpdating) return;

        let profile = {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            phone: this.state.phone
        };
        if (this._validateData()) {
            this.setState({isUpdating: true});
            FAApi.updateProfile(this.token, profile)
                .then((responseJson) => {
                    this.setState({isUpdating: false});
                    if (responseJson.response_code === 200) {
                        let toast = ToastUtils.showInfo('Cập nhật thông tin thành công');
                        if (this.currentUser !== null) {
                            this.currentUser.email = profile.email;
                            this.currentUser.first_name = profile.first_name;
                            this.currentUser.last_name = profile.last_name;
                            this.currentUser.phone = profile.phone;
                            UserService.saveUserInfo(this.currentUser);
                        }
                        setTimeout(() => {
                            ToastUtils.hide(toast);
                        }, 1200);
                    } else {
                        ToastUtils.showInfo('Cập nhật thông tin lỗi');
                    }
                })
                .catch((error) => {
                    this.setState({isUpdating: false});
                    ToastUtils.showInfo('Quá trình xử lý bị lỗi!!!');
                });
        }
    }

    _doCancel() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="position"
                                  scrollEnabled={false}
                                  enabled
                                  style={styles.container}>

                <View style={styles.image_logo}>
                    <Image source={bgImg} style={styles.img_logo}/>
                    <Text style={styles.text}>FIRE ALARM</Text>
                </View>
                <Card behavior="padding" title="CÀI ĐẶT CẢNH BÁO"
                      style={{width: DEVICE_WIDTH, flex: 1}}>
                    <Switch style={{width: DEVICE_WIDTH - MARGIN}}
                            value={this.state.enableNotify}
                            onValueChange={this._settingNotification}/>
                </Card>
                <View behavior="padding" style={styles.content}>

                    <UserInput
                        source='contact-phone'
                        placeholder="Tài khoản"
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        value={this.state.phone}
                        onChangeText={(value) => this.setState({phone: value})}
                        autoCorrect={false}
                    />
                    <UserInput
                        source='email'
                        placeholder="Email"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        value={this.state.email}
                        onChangeText={(value) => this.setState({email: value})}
                        autoCorrect={false}
                    />

                    <UserInput
                        source='account-box'
                        placeholder="Tên (LUYEN)"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        value={this.state.first_name}
                        onChangeText={(value) => this.setState({first_name: value})}
                        autoCorrect={false}
                    />

                    <UserInput
                        source='account-box'
                        placeholder="Họ (VU GIA)"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        value={this.state.last_name}
                        onChangeText={(value) => this.setState({last_name: value})}
                        autoCorrect={false}
                    />

                    <View style={styles.confirm}>
                        <Animated.View>
                            <TouchableOpacity style={styles.button} activeOpacity={1}
                                              onPress={this._doUpdate}>
                                <Text style={styles.button_text}>Cập nhật</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <TouchableOpacity style={styles.button_cancel} activeOpacity={1}
                                          onPress={this._doCancel}>
                            <Text style={styles.button_text}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ProgressDialog
                    visible={this.state.isUpdating}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."/>

                {this.state.isUpdating &&
                <ActivityIndicator style={{marginTop: 10}} size="small" color="rgb(244,81,44)"/>
                }
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    image_logo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },

    img_logo: {
        width: 200,
        height: 200,
    },

    txt: {
        color: 'blue',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        padding: 10,
        margin: 10
    },

    content: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
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
