import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, Avatar } from 'react-native-paper';

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordVisible: false
        }
    }

    render() {

        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={Platform.OS === "web" ? [styles.container, styles.centeredItem, { backgroundColor: '#1A1A3D' }] : styles.container} >
                <View style={[styles.container, { alignItems: 'center' }]}>
                    <Avatar.Image size={100} style={{ margin: 30 }} source={require('../assets/logo.png')} />
                    <Text variant="headlineMedium" style={[styles.child, { textAlign: 'center' }]}>SHS-chatbot</Text>
                </View>
                <Text style={styles.child}>Type the information to signup</Text>
                {this.props.signupNotification?.length === 0 ? (<></>) : (<Text style={{ ...styles.paragraph, color: 'red' }}>{this.props.signupNotification}</Text>)}
                <TextInput style={styles.child}
                    mode="outlined"
                    label="Username"
                    placeholder="Username"
                    accessibilityLabel="Username"
                    onChangeText={(text) => this.setState({ username: text })}
                />
                <TextInput style={styles.child}
                    mode="outlined"
                    label="Password"
                    placeholder="Password"
                    secureTextEntry={!this.state.passwordVisible}
                    accessibilityLabel="Password"
                    right={<TextInput.Icon
                        icon={this.state.passwordVisible ? "eye-off" : "eye"}
                        onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
                    />}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button style={[{minWidth: "40%"}, styles.child]}
                        mode="contained"
                        icon="arrow-left"
                        onPress={() => {
                            this.props.navigation.navigate('Login')
                        }}
                    >Goback</Button>
                    <Button style={[{minWidth: "40%"}, styles.child]}
                        mode="contained"
                        onPress={() => {
                            this.props.handleSignup(this.state.username, this.state.password, this.props.navigation)
                        }}
                    >Signup</Button>
                </View>
                <StatusBar style="auto" />
            </KeyboardAvoidingView>
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


export default Signup;