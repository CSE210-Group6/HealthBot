import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Dialog, Appbar, Portal, Snackbar, useTheme, PaperProvider, List, Switch, Divider, Button, Text, TextInput, Avatar } from 'react-native-paper';


const Header = (props) => {

    const theme = useTheme();

    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                    surface: Platform.OS === 'web' ? '#39462C' : '#00000000'
                },
            }}
        >
            <Appbar.Action icon="arrow-left" onPress={() => props.navigation.goBack()} />
            <Appbar.Content title="Setting" />
        </Appbar.Header>
    );
};

class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: "",
            information: "",
            action: -1,
            notification: "",
            snack: false
        }
        this.handle = this.handle.bind(this);
    }

    onToggleSnackBar() {
        this.setState({ snack: !this.state.snack })
    }

    onDismissSnackBar() {
        this.setState({ snack: false })
    }

    showDialog(title1, info, act) {
        this.setState({ visible: true, title: title1, information: info, action: act })
    }

    hideDialog() {
        this.setState({ visible: false })
    }

    async handle() {
        if (this.state.action == 0) {
            // clean history 
            await this.props.updateHistory({}, {});
            this.setState({ notification: "successfully clear" }, () => this.onToggleSnackBar());
        } else if (this.state.action == 1) {
            // logout
            this.props.signout();
        }
    }

    render() {
        return (
            <>
                <Header navigation={this.props.navigation}/>
                <ScrollView>
                    <List.Section title="Account">
                        <List.Item
                            title="Change Avatar"
                            style={{ marginLeft: 15 }}
                            left={() => <List.Icon icon="account-edit-outline" />}
                            onPress={() => {/* Handle password change */ }}
                        />
                        <List.Item
                            title="Clean Chat History"
                            style={{ marginLeft: 15 }}
                            left={() => <List.Icon icon="delete-sweep-outline" />}
                            onPress={() => { this.showDialog("Clear history", "Are you sure to clean all history? ", 0) }}
                        />
                        <List.Item
                            title="Log out"
                            style={{ marginLeft: 15 }}
                            left={() => <List.Icon icon="account-arrow-right-outline" />}
                            onPress={() => { this.showDialog("Log out", "Are you sure to log out? This will not clean your chat history. ", 1) }}
                        />
                    </List.Section>
                    <Divider />

                    <List.Section title="More">
                        <List.Item
                            title="Third part software"
                            onPress={() => {this.props.navigation.navigate("ThirdParty")}}
                        />
                        <List.Item
                            title="About"
                            onPress={() => { this.props.navigation.navigate("About") }}
                        />
                    </List.Section>
                </ScrollView>
                <Portal>
                    <Dialog visible={this.state.visible} onDismiss={() => this.hideDialog()}>
                        <Dialog.Title>{this.state.title}</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">{this.state.information}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => this.hideDialog()}>Cancel</Button>
                            <Button onPress={() => {
                                this.handle();
                                this.hideDialog();
                            }}>Yes</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Snackbar
                    visible={this.state.snack}
                    onDismiss={() => this.onDismissSnackBar()}
                >
                    {this.state.notification}
                </Snackbar>
            </>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    centeredItem: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 300, maxHeight: 600,
        textAlign: 'center',
        lineHeight: '100px',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: '10px'
    },
    child: {
        margin: 10
    },
    paragraph: {
        paddingBottom: 10,
    }
});


export default Setting;