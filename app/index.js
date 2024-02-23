import React from 'react';
import { Stack, Drawer } from 'expo-router';
import { View } from 'react-native';
import { Login } from './login';
import { Chat } from './chat/index';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: "",
            home: false,
            homeText: "",
            authentication: "",
            userInfo: {},
            username: "",
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    modify(field, value) {
        let temp = this.state.userInfo;
        temp[field] = value;
        this.setState({ userInfo: temp })
    }

    async handleLogin(username1, password) {
        this.setState({ home: true, authentication: "", username: username1, homeText: "SHS-chatBot" })
    }

    handleExit() {
        this.setState({ username: "", userInfo: {}, notification: "Successfully logged out", home: false, authentication: "" })
    }

    render() {
        if (this.state.home) {
            return (
                <Drawer.Screen name="/chat" options={{ title: "New" }}>
                    <Chat {...this.props} handleExit={this.handleExit} modify={this.modify} home={this.state.home} userInfo={this.state.userInfo} notification={this.state.notification} handleLogin={this.handleLogin} />
                </Drawer.Screen>
            )
        }
        return (
            <Stack.Screen name="/login" options={{ title: "Login" }}>
                <Login {...this.props} handleExit={this.handleExit} modify={this.modify} home={this.state.home} userInfo={this.state.userInfo} notification={this.state.notification} handleLogin={this.handleLogin} />
            </Stack.Screen>
        )
    }
}

export default function App() {
    return (
        <View>
            <Content />
        </View>
    );
}
