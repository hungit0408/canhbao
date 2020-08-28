import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Text} from "native-base";

export default class LinksScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Thông tin',
            drawerIcon: (tintColor) => {
                return (
                    <MaterialIcons
                        name="info"
                        color={'#e25822'}
                        size={24}>
                    </MaterialIcons>
                );
            }
        };
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.text}>
                    Bạn cần một giải pháp an toàn khi đang sống tại các chung cư, tòa nhà văn phòng, Mỗi khi có hỏa hoạn
                    thì thời gian là yếu tố quyết định việc tổn hại của bạn hay của người thân trong thảm họa này. Chỉ
                    với thời gian ngắn bạn bị chậm thì tính mạng của bạn có thể sẽ bị đe dọa.
                    HotAlarm sẽ tạo ra một cuộc gọi nhanh chóng và liên tục đến toàn bộ cư dân sống trong tòa nhà, nếu
                    không trả lời ngay sau khi dứt cuộc gọi hệ thống sẽ tự động gửi SMS thông báo đến cho các thuê bao
                    đăng ký.

                </Text>
                <Text style={styles.slogan}>
                    Slogan:
                    “AN TOÀN CHO MỌI NGƯỜI”
                </Text>
                <Text style={styles.slogan}>
                    Đại diện là Hội Truyền thông số
                </Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },

    text: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        fontStyle: 'italic',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    slogan: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        fontStyle: 'italic',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
