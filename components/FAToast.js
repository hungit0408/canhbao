/**
 * @author: NamNV
 */

import React, {Component} from 'react';
import {Toast} from "react-native-root-toast";


export default class FAToast extends Component {

    constructor(props) {
        super(props);
        this.state({
            visible: false,
            message: ''
        });
    }

    render() {
        return (
            <Toast
                visible={this.state.visible}
                position={Toast.position.CENTER}
                shadow={false}
                animation={false}
                hideOnPress={true}>
                {this.state.message}
            </Toast>
        );
    }
}