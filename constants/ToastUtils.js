import Toast from 'react-native-root-toast';

export default ToastUtils =
    {
        showInfo(message) {
            let toast = Toast.show(message, {
                duration: 1500,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                onShow: () => {
                    // calls on toast\`s appear animation start
                },
                onShown: () => {
                    // calls on toast\`s appear animation end.
                },
                onHide: () => {
                    // calls on toast\`s hide animation start.
                },
                onHidden: () => {
                    // calls on toast\`s hide animation end.
                }
            });

            return toast;
        },

        hide(toast) {
            Toast.hide(toast)
        }
    }