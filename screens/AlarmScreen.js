/**
 * @author NAMNV8
 */
import React, {Component} from 'react';
import {Body, Button, Header, Icon, Left, Picker, Right, Title} from "native-base";
import Dimensions from 'Dimensions';
import {AppState, AsyncStorage, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, View} from "react-native";
import bgImg from '../assets/images/logo.png';
import AlarmButton from "../components/AlarmButton";
import FAApi from "../constants/Api";
import ToastUtils from "../constants/ToastUtils";
import {ConfirmDialog, ProgressDialog} from "react-native-simple-dialogs";
import call from 'react-native-phone-call';
import PropTypes from 'prop-types';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DEVICE_WIDTH = Dimensions.get('window').width;
export default class AlarmScreen extends Component {

    password = "";
    agencyPhone = "";
    token = '';

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            drawerIcon: (tintColor) => {
                return (
                    <Image
                        source={icon}
                        style={{width: 24, height: 24, tintColor: '#e25822'}}>
                    </Image>
                );
            },
        };
    };

    state = {
        appState: AppState.currentState
    };


    constructor(props) {
        super(props);

        this.state = {
            building: '',
            buildingId: -1,
            building_address: '',
            floors: [],
            selectedFloor: 'R4',
            loading: false,
            currentRoom: '',
            currentUser: '',
            re_password: '',
            note: '',
            isConfirm: false,
            managePhones: [],
            selectedAdmin: '',
            role: 0
        };


        this._doCall = this._doCall.bind(this);
        this._doSendNotify = this._doSendNotify.bind(this);
        this.updateView = this.updateView.bind(this);
    }


    _doCall() {
        if (this.state.managePhones && this.state.managePhones.length > 1) {
            this.agencyPhone = this.state.selectedAdmin;
        }
        if (this.agencyPhone === null || this.agencyPhone === '') {
            ToastUtils.showInfo('Hãy chọn ban quản lý tòa nhà đang xẩy ra sự cố để thông báo')
            return;
        }
        console.log(this.agencyPhone);
        const args = {
            number: this.agencyPhone, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        };

        try {
            call(args).catch(console.error)
        } catch (e) {
            console.log(e);
        }
    }

    _doSendNotify() {
        if (this.state.re_password === '') {
            ToastUtils.showInfo('Hãy nhập mật khẩu xác nhận');
            return;
        }
        if (this.password === this.state.re_password) {

            this.setState({
                isConfirm: false,
                loading: true
            });
            FAApi.buildingAdminFA(this.state.buildingId, this.state.note, this.token)
                .then((responseJson) => {
                    this.setState({
                        loading: false,
                        re_password: ''
                    });
                    let toast;
                    if (responseJson.response_code === 200) {
                        toast = ToastUtils.showInfo('Gửi cảnh báo thành công');
                    } else {
                        toast = ToastUtils.showInfo('Gửi cảnh báo bị lỗi');
                    }
                    ToastUtils.hide(toast);
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                        re_password: ''
                    });

                    ToastUtils.showInfo('Quá trình xử lý bị lỗi!!!');
                });
        }
    }

    componentDidMount() {
        this.updateUI();
    }

    componentWillMount() {

        AsyncStorage.getItem('password').then((password) => {
            this.password = JSON.parse(password);
        });

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.updateUI();
        }
        this.setState({appState: nextAppState});
    };

    updateUI() {
        AsyncStorage.getItem('current_user').then((user) => {
            let currentUser = JSON.parse(user);
            if (currentUser) {
                let first_name = currentUser.first_name === null ? '' : currentUser.first_name;
                let last_name = currentUser.last_name === null ? '' : currentUser.last_name;
                this.setState({
                    currentUser: first_name + ' ' + last_name,
                    building: currentUser.building,
                    buildingId: currentUser.building_id,
                    building_address: currentUser.building_address,
                    floors: currentUser.floors,
                    role: currentUser.role_admin,
                    managePhones: currentUser.manager_phone
                });

                this.token = currentUser.access_token;
                this.updateView();
                if (currentUser.manager_phone !== null && currentUser.manager_phone.length === 1) {
                    this.agencyPhone = '0' + currentUser.manager_phone[0].phone;
                    console.log(this.agencyPhone);
                }
            }
        });
    }

    updateView() {
        if (this.state.role === 0 && this.state.managePhones && this.state.managePhones.length > 1) {
            var managerPhones = this.state.managePhones.map((s, i) => {
                return <Picker.Item iosIcon={<MaterialIcons color={'#e25822'}
                                                            size={24}
                                                            name="check"/>}
                                    key={s.id} value={s.phone} label={s.admin}/>
            });
        }
        return (this.state.role === 1 ? (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    {this.state.floors && this.state.floors.length > 0 &&
                    <Picker style={styles.picker}
                            renderHeader={backAction =>
                                <Header style={{backgroundColor: "#E27822"}}>
                                    <Left>
                                        <Button transparent onPress={backAction}>
                                            <Icon name="arrow-back" style={{color: "#fff"}}/>
                                        </Button>
                                    </Left>
                                    <Body style={{flex: 3}}>
                                    <Title style={{color: "#fff"}}>Please choose floor...</Title>
                                    </Body>
                                    <Right/>
                                </Header>}
                            inlineLabel={true}
                            iosIcon={<Icon name="ios-arrow-down-outline"/>}
                            placeholder='Please select the floor'
                            selectedValue={this.state.selectedFloor}
                            onValueChange={(floor) => ( this.setState({selectedFloor: floor}) )}>
                        {floorItems}
                    </Picker>
                    }

                    <TextInput placeholder="Chú ý"
                               style={styles.inputBox}
                               value={this.state.note}
                               onChangeText={(value) => this.setState({note: value})}
                               placeholderTextColor='lightgrey'
                               underlineColorAndroid='rgba(0,0,0,0)'/>

                    <AlarmButton label="CẢNH BÁO" doAction={() => {
                        this.setState({
                            isConfirm: true
                        });
                    }} loading={this.state.loading}/>

                </View>
            ) : (

                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {this.state.managePhones && this.state.managePhones.length > 1 &&
                    <Picker style={styles.picker}
                            renderHeader={backAction =>
                                <Header style={{backgroundColor: "#E27822"}}>
                                    <Left>
                                        <Button transparent onPress={backAction}>
                                            <MaterialIcons name="arrow-back" color={'#e25822'}
                                                           size={24}
                                                           style={{color: "#fff"}}/>
                                        </Button>
                                    </Left>
                                    <Body style={{flex: 3}}>
                                    <Title style={{color: "#fff", fontSize: 12}}>Chọn ban quản trị tòa nhà...</Title>
                                    </Body>
                                    <Right/>
                                </Header>}
                            inlineLabel={true}
                            iosIcon={<MaterialIcons color={'#e25822'}
                                                    size={24}
                                                    name="arrow-drop-down-circle"/>}
                            placeholder='Chọn liên lạc của ban quản trị!'
                            selectedValue={this.state.selectedAdmin}
                            onValueChange={(phone) => ( this.setState({selectedAdmin: phone}) )}>
                        {managerPhones}
                    </Picker>
                    }

                    < AlarmButton label="BÁO CHÁY" doAction={this._doCall}/>
                </View>
            )
        )
    }


    render() {

        if (this.state.floors && this.state.floors.length > 0) {
            var floorItems = this.state.floors.map((s, i) => {
                return <Picker.Item key={s.id} value={s.floor} label={s.floor}/>
            });
        }

        return (
            <KeyboardAvoidingView behavior="position" style={styles.container}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={bgImg} style={styles.image}/>
                    <Text style={{
                        color: 'blue',
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginTop: 5
                    }}>{this.state.currentUser}</Text>

                    <Text style={styles.building}>{this.state.building}</Text>
                    <Text style={styles.building_address}>{this.state.building_address}</Text>
                </View>

                {this.updateView()}

                <ConfirmDialog
                    style={styles.dialog}
                    title="Xác thực mật khẩu để gửi cảnh báo..."
                    message="Xác nhận mật khẩu để gửi cảnh báo..."
                    visible={this.state.isConfirm}
                    titleStyle={styles.dialog_warning}
                    onTouchOutside={() => this.setState({isConfirm: false})}
                    positiveButton={{
                        title: "Đồng ý",
                        style: {
                            backgroundColor: '#e25822',
                            borderRadius: 5,
                            borderColor: 'lightgrey',
                            borderWidth: 1,
                            padding: 15
                        },
                        titleStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 15,
                        },
                        onPress: this._doSendNotify
                    }}
                    negativeButton={{
                        title: "Hủy",
                        style: {
                            backgroundColor: '#e25822',
                            borderRadius: 5,
                            borderColor: 'lightgrey',
                            borderWidth: 2,
                            padding: 15
                        },
                        titleStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 15,
                        },
                        onPress: () => {
                            this.setState({isConfirm: false});
                        }
                    }}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput placeholder="Mật khẩu..."
                                   style={styles.inputCfm}
                                   value={this.state.re_password}
                                   secureTextEntry={true}
                                   onChangeText={(text) => this.setState({re_password: text})}
                                   placeholderTextColor='lightgrey'
                                   underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                </ConfirmDialog>

                <ProgressDialog
                    visible={this.state.loading}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Đang xử lý..."
                />
            </KeyboardAvoidingView>
        );
    }
}

AlarmScreen.propTypes = {
    currentUser: PropTypes.object
};

const MARGIN = 40;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    dialog: {
        flex: 1,
        width: DEVICE_WIDTH - MARGIN,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
    },

    dialog_warning: {
        marginTop: 10,
        color: 'red',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 10
    },

    view: {
        flex: 3,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'red'
    },

    image: {
        width: 200,
        height: 200
    },

    building: {
        marginVertical: 10,
        fontSize: 15,
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    building_address: {
        marginVertical: 15,
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },

    picker: {
        width: DEVICE_WIDTH - MARGIN,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginHorizontal: 20,
        height: 40,
        marginTop: 10,
        borderColor: 'lightgrey',
        borderWidth: 1
    },

    inputBox: {
        width: DEVICE_WIDTH - MARGIN,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 16,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        marginTop: 10,
        borderWidth: 1,
    },

    inputCfm: {
        width: DEVICE_WIDTH - 2 * MARGIN,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 16,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        marginTop: 10,
        borderWidth: 1,
    },

    confirm: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 20
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
        width: DEVICE_WIDTH - 2 * MARGIN,
        margin: 10,
        borderRadius: 5,
        zIndex: 100,
    },

    button_text: {
        color: 'white',
        fontWeight: 'bold'
    },
});

