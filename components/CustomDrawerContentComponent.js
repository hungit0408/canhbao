/**
 * @author NAMNV8
 */

import React, {Component} from 'react';
import {Body, Container, Content, Header, Text} from "native-base";
import {DrawerItems, TouchableItem} from "react-navigation";
import {AsyncStorage, Image, StyleSheet} from "react-native";
import NavigationActions from "react-navigation/src/NavigationActions";

export default class CustomDrawerContentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatar: require('../assets/images/logo.png'),
            full_name: ''
        };
    }

    handlePress() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'HOME'})],
        });

        // Actually, this should be a login screen.. but u get it
        this.props.screenProps.rootNavigation.dispatch(resetAction);
    }

    updateUI() {
        AsyncStorage.getItem('current_user').then((responseJson) => {
            if (responseJson) {
                let currentUser = JSON.parse(responseJson);
                let first_name = currentUser.first_name === null ? '' : currentUser.first_name;
                let last_name = currentUser.last_name === null ? '' : currentUser.last_name;
                this.setState({
                    full_name: first_name + ' ' + last_name
                });
            }
        });
    }

    componentDidMount() {
        this.updateUI();
    }

    componentWillUnmount() {
    }

    componentWillUpdate() {
        this.updateUI();
    }

    render() {
        return (
            <Container>
                <Header style={{height: 220, backgroundColor: 'white'}}>
                    <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={styles.drawerImage} source={this.state.avatar}/>
                    <Text>{this.state.full_name}</Text>
                    </Body>
                </Header>
                <Content>
                    <DrawerItems {...this.props} />
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    drawerImage: {
        width: 160,
        height: 160
    },

    text: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginTop: 20
    }
});
