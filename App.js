import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Chat from './components/Chat';
import Login from './components/Login';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
            temObj: {},
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
                <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />}>
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

    return (
        <NavigationContainer>
            <Content />
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