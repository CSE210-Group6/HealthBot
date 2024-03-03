import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Chat from './Chat';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordVisible: false
        }
    }

    render() {
        if (this.props.home) {
            return (
                <Chat {...this.props} handleExit={this.handleExit} modify={this.modify} home={this.state.home} userInfo={this.state.userInfo} notification={this.state.notification} handleLogin={this.handleLogin} />
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text variant="headlineMedium" style={[styles.child, { textAlign: 'center' }]}>SHS-chatbot</Text>
                    <Text style={styles.child}>Type the information to login</Text>
                    {this.props.notification.length == 0 ? (<></>) : (<Text style={{ ...styles.paragraph, color: 'red' }}>{this.props.notification}</Text>)}
                    <TextInput style={styles.child}
                        mode="outlined"
                        label="Username"
                        placeholder="Username"
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <TextInput style={styles.child}
                        mode="outlined"
                        label="Password"
                        placeholder="Password"
                        secureTextEntry={!this.state.passwordVisible}
                        right={<TextInput.Icon
                            icon={this.state.passwordVisible ? "eye-off" : "eye"}
                            onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
                        />}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <Button style={styles.child}
                        mode="contained"
                        onPress={() => {
                            this.props.handleLogin(this.state.username, this.state.password);
                        }}
                    >Login</Button>
                    <StatusBar style="auto" />
                </View>
            );
        }
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    child: {
        margin: 10
    },
    paragraph: {
        paddingBottom: 10,
    }
});


export default Login;