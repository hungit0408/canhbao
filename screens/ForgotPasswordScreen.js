import React, {Component} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserInput from "../components/UserInput";
import Dimensions from 'Dimensions';
import Logo from "../components/Logo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Container} from "native-base";
import {ProgressDialog} from "react-native-simple-dialogs";


const changePass = ({
    username: '',
    old_password: '',
    new_password: ''
});

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

export default class ForgotPasswordScreen extends Component {

    static navigationOptions = {
        title: 'Đổi mật khẩu',
        drawerIcon: (tintColor) => {
            return (
                <MaterialIcons
                    name="security"
                    size={24}>
                </MaterialIcons>
            );
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isUpdating: false,
            showPass: true,
        };

        this._doCancel = this._doCancel.bind(this);

        this._doRequest = this._doRequest.bind(this);
    }


    _doRequest() {
        alert("begin call api change password");
        if (this.state.isUpdating) return;

        this.setState({isUpdating: true});

        //TODO: call API

    }

    _doCancel() {
        this.props.navigation.navigate('Login');
    }

    render() {
        const props = this.props.navigation;

        return (
            <Container style={styles.container}>
                <Logo style={styles.logo}/>
                <View behavior="padding" style={styles.content}>
                    <UserInput
                        source='security'
                        placeholder="Current password"
                        autoCapitalize={'none'}
                        secureTextEntry={this.state.showPass}
                        returnKeyType={'done'}
                        onChangeText={this.handlePassword}
                        autoCorrect={false}
                    />
                    <UserInput
                        source='security'
                        secureTextEntry={this.state.showPass}
                        placeholder="Password"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        onChangeText={this.handlePassword}
                        autoCorrect={false}
                    />

                    <UserInput
                        source='security'
                        secureTextEntry={this.state.showPass}
                        placeholder="Re-password"
                        returnKeyType={'done'}
                        autoCapitalize={'none'}
                        onChangeText={this.handlePassword}
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.confirm}>
                    <Animated.View>
                        <TouchableOpacity style={styles.button} activeOpacity={1}
                                          onPress={this._doRequest}>
                            <Text style={styles.button_text}>Update</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={styles.button_cancel} activeOpacity={1}
                                      onPress={this._doCancel}>
                        <Text style={styles.button_text}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <ProgressDialog
                    visible={this.state.isUpdating}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."
                />
            </Container>
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

    circle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 100,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: '#E27822',
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
