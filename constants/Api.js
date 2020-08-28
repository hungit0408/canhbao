// noinspection JSAnnotator

// const BASE_URL = "http://localhost:8080/api";
const BASE_URL = "http://admin.canhbaothongminh.vn:8080/beepcall/api";

export default FAApi = {

    buildHeader(token) {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic YmVlcDpiZWVwIzIwMTg=',
            'X-Token': token
        }
    },

    login(phone, password) {
        return fetch(BASE_URL + '/v1/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic YmVlcDpiZWVwIzIwMTg='
            },
            body: JSON.stringify({
                phone: phone,
                password: password,
            }),
        }).then((response) => response.json());
    },

    buildingAdminFA(buildingId, note, token) {
        let request = {
            building_code: '',
            building_id: buildingId,
            floor_id: -1,
            note: note
        };

        return fetch(BASE_URL + '/v1/alert', {
            method: 'POST',
            headers: this.buildHeader(token),
            body: JSON.stringify(request),
        }).then((response) => response.json());
    },

    settingNotification(token, enableOrNot) {
        return fetch(BASE_URL + '/v1/setting/notify?enabled=' + enableOrNot, {
            method: 'POST',
            headers: this.buildHeader(token),
            body: JSON.stringify(enableOrNot),
        }).then((response) => response.json());
    },

    changePassword(token, request) {
        return fetch(BASE_URL + '/v1/pass/change', {
            method: 'POST',
            headers: this.buildHeader(token),
            body: JSON.stringify(request),
        }).then((response) => response.json());
    },

    updateProfile(token, request) {
        return fetch(BASE_URL + '/v1/update/profile', {
            method: 'POST',
            headers: this.buildHeader(token),
            body: JSON.stringify(request),
        }).then((response) => response.json());
    }

};