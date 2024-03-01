import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Chat from './components/Chat';
import Login from './components/Login';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
WebBrowser.maybeCompleteAuthSession();

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Back"
                onPress={() => props.navigation.closeDrawer()}
            />
        </DrawerContentScrollView>
    );
};

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
        this.isLargeScreen = props.isLargeScreen;
    }

    modify(field, value) {
        let temp = this.state.userInfo;
        temp[field] = value;
        this.setState({ userInfo: temp })
    }

    async handleLogin() {
        try {
            if (this.props.loading) {
                console.log("loading")
                return;
            }
            const response = await this.props.promptAsync();
            if (response.type === "success") {
                const userResponse = await fetch("https://www.googleapis.com/auth/userinfo.profile", { headers: { Authorization: `Bearer ${response.authentication.accessToken}` } });
                const user = await userResponse.json();
                this.setState({
                    home: true,
                    username: user.name,
                    homeText: "SHS-chatBot"
                })
                this.modify("username", user.name)
                this.modify("photoUrl", user.photo)
            } else {
                console.log("cancelled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    handleExit() {
        this.setState({ username: "", userInfo: {}, notification: "Successfully logged out", home: false, authentication: "" })
    }

    render() {
        if (this.state.home) {
            return (
                <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: this.isLargeScreen ? "permanent" : "front" }} drawerContent={props => <CustomDrawerContent {...props} />}>
                    <Drawer.Screen name="Chat" component={Chat} ></Drawer.Screen>
                </Drawer.Navigator>
            );
        }
        return (
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{ title: "Login", headerShown: false }}>
                    {(props) => <Login {...props} handleExit={this.handleExit} modify={this.modify} home={this.state.home} userInfo={this.state.userInfo} notification={this.state.notification} handleLogin={this.handleLogin} />}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }
}

export default function App() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [request, response, promptAsync, loading] = Google.useAuthRequest({
        androidClientId: "43846849430-4r3gto7ivvog5s86s8l43i5tmklbg512.apps.googleusercontent.com",
        webClientId: "43846849430-7pjqp6ehjfo70bqp8pvujpsu7gt73l2r.apps.googleusercontent.com",
        iosClientId: "43846849430-kdud181d85kc34ijreehe3v3o2o8jb25.apps.googleusercontent.com"
    });
    return (
        <NavigationContainer>
            <Content isLargeScreen={isLargeScreen} promptAsync={promptAsync} loading={loading} />
        </NavigationContainer>
    );
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