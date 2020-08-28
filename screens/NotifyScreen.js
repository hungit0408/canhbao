import React, {Component} from 'react';
import {Body, Button, Header, Icon, Left, Picker, Right, Text, Title, View} from "native-base";
import {AsyncStorage, ImageBackground, Platform, StyleSheet, TextInput} from "react-native";
import Dimensions from 'Dimensions';
import AlarmButton from "../components/AlarmButton";
import bgImg from '../assets/images/logo.png';
import {ConfirmDialog, ProgressDialog} from "react-native-simple-dialogs";
import ToastUtils from "../constants/ToastUtils";
import FAApi from "../constants/Api";

const MARGIN = 40;
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class NotifyScreen extends Component {

    password = '';
    token = '';
    agencyPhone = '';

    constructor(props) {
        super(props);

        this.state = {
            note: '',
            re_password: '',
            building: '',
            currentFloor: '',
            floors: [],
            selectedFloor: 'R4',
            currentUser: 'VU GIA LUYEN',
            isSending: false,
            isConfirm: false,
        };

        this._doCancel = this._doCancel.bind(this);
        this._doSendNotify = this._doSendNotify.bind(this);
    }

    prepareRenderUI() {
        AsyncStorage.getItem('current_user').then((user) => {
            let currentUser = JSON.parse(user);
            if (currentUser) {
                this.setState({
                    currentUser: currentUser.first_name + ' ' + currentUser.last_name,
                    building: currentUser.building,
                    buildingId: currentUser.building_id,
                    building_address: currentUser.building_address,
                    floors: currentUser.floors,
                    role: currentUser.role_admin
                });
                this.token = currentUser.access_token;
                this.agencyPhone = currentUser.agencyPhone;
            }
        });

        AsyncStorage.getItem('password').then((password) => {
            this.password = JSON.parse(password);
        })
    }

    componentDidMount() {
        this.prepareRenderUI();
    }

    _doSendNotify() {
        if (this.password === this.state.re_password) {
            this.setState({
                isConfirm: false,
                isSending: true
            });

            FAApi.buildingAdminFA(this.state.buildingId, this.state.currentRoom, this.props.token)
                .then((responseJson) => {
                    this.setState({isSending: false});

                    if (responseJson.response_code === 200) {
                        ToastUtils.showInfo('Inform notification fire alarm successfully');
                    } else {
                        ToastUtils.showInfo('Inform notification fire alarm failed');
                    }
                })
                .catch((error) => {
                    this.setState({isSending: false});
                    ToastUtils.showInfo('Something wrong!!!');
                });
        } else {
            ToastUtils.showInfo('Password is not correct. Please check it again');
            this.setState({
                isConfirm: true
            })
        }
    }

    _doCancel() {
        this.setState({
            isConfirm: false
        });
    }

    render() {

        let floorItems = this.state.floors.map((s, i) => {
            return <Picker.Item key={s.id} value={s.floor} label={s.floor}/>
        });

        return (
            <View style={styles.container}>
                <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                    <ImageBackground source={bgImg} style={styles.image}/>
                    <Text style={{
                        color: 'blue',
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginTop: 10
                    }}>{this.state.currentUser}</Text>
                </View>

                <View style={{
                    flex: 4,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={styles.building}>{this.state.building}</Text>
                    <Picker style={styles.picker}
                            renderHeader={backAction =>
                                <Header style={{backgroundColor: "#3b5998"}}>
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

                    <TextInput placeholder="Note"
                               style={styles.inputBox}
                               value={this.state.note}
                               onChangeText={(text) => this.setState({note: text})}
                               placeholderTextColor='lightgrey'
                               underlineColorAndroid='rgba(0,0,0,0)'/>

                    <AlarmButton label="ALARM" loading={this.state.isSending} doAction={() => {
                        this.setState({
                            isConfirm: true,
                            isSending: false
                        });
                    }}/>
                </View>


                <ConfirmDialog
                    style={{width: DEVICE_WIDTH - MARGIN, alignItems: 'center', justifyContent: 'center'}}
                    title="Confirm Dialog"
                    message="Are you sure about that?"
                    visible={this.state.isConfirm}
                    onTouchOutside={() => this.setState({isConfirm: false})}
                    positiveButton={{
                        title: "YES",
                        titleColor: '#e25822',
                        backgroundColor: '#e25822',
                        onPress: this._doSendNotify
                    }}
                    negativeButton={{
                        title: "NO",
                        onPress: this._doCancel
                    }}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput placeholder="Password"
                                   style={styles.inputCfm}
                                   value={this.state.re_password}
                                   onChangeText={(text) => this.setState({re_password: text})}
                                   placeholderTextColor='lightgrey'
                                   underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                </ConfirmDialog>

                <ProgressDialog
                    visible={this.state.isSending}
                    activityIndicatorColor="rgb(244,81,44)"
                    message="Please, wait..."
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
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
        marginVertical: 15,
        fontSize: 18,
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 16,
        marginHorizontal: 20,
        height: 40,
        justifyContent: 'space-around',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },

    picker: {
        width: Platform.OS === "ios" ? 200 : DEVICE_WIDTH - MARGIN,
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

    reConfirmBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height: 40,
        borderRadius: 5,
        borderColor: 'lightgrey',
        marginTop: 10,
        borderWidth: 1,
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
    }
});