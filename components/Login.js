import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Chat from './Chat';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    render() {
        if (this.props.home) {
            return (
                    <View style={styles.container}>
                        <Chat {...this.props} handleExit={this.handleExit} modify={this.modify} home={this.state.home} userInfo={this.state.userInfo} notification={this.state.notification} handleLogin={this.handleLogin} />
                    </View>
               )
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.sectionHeading}>SHS-chatbot</Text>
                    <Text style={styles.paragraph}>Type the information to login</Text>
                    <Text style={{...styles.paragraph, color: 'red' }}>{this.props.notification}</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder=" Username"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder=" Password"
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button
                            style={styles.button}
                            color="deepskyblue"
                            title="Login"
                            onPress={() => {
                                this.props.handleLogin(this.state.username, this.state.password);
                            }}
                        />
                    </View>
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
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        paddingBottom: 10,
    },
    story: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
    },
    sectionHeading: {
        margin: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    storyHeading: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    button: {
    },
    textInput: {
        height: 45, width: "95%", borderColor: "gray", borderWidth: 2, margin: 10
    },
    textInput1: {
        height: 45, width: "95%", borderColor: "gray", borderWidth: 2, margin: 10, marginBottom: 20
    }
});


export default Login;