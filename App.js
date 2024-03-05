import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useWindowDimensions, StyleSheet, View, AppRegistry, Appearance, useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, } from '@react-navigation/native';
import {
    PaperProvider, MD3DarkTheme,
    MD3LightTheme, Text,
    adaptNavigationTheme
} from 'react-native-paper';
import merge from 'deepmerge';
import { name as appName } from './app.json';
import Chat from './components/Chat';
import Login from './components/Login';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { PreferencesContext } from './components/PreferencesContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
WebBrowser.maybeCompleteAuthSession();

AppRegistry.registerComponent(appName, () => App);
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);


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
            accessToken: "",
            userInfo: {},
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
                const userResponse = await fetch(`${process.env.EXPO_PUBLIC_AZURE_URL}/userInfo`, { headers: { Authorization: `Bearer ${response.authentication.accessToken}` } });
                const user = await userResponse.json();
                this.setState({
                    home: true,
                    userInfo: user,
                    homeText: "SHS-chatBot"
                })
            } else {
                console.log("cancelled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    handleExit() {
        this.setState({ userInfo: {}, notification: "Successfully logged out", home: false, accessToken: "" })
    }

    // TODO: need to generate chatID when starting new chat
    render() {
        if (this.state.home) {
            return (
                <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: this.isLargeScreen ? "permanent" : "front" }} drawerContent={props => <CustomDrawerContent {...props} />}>
                    <Drawer.Screen name="Chat" userInfo={this.state.userInfo} notification={this.state.notification} options={{ headerShown: false }} component={Chat} ></Drawer.Screen>
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
        androidClientId: "806096804987-vrjtvat18fb6muoqmnaeq7t9lg2b4qbj.apps.googleusercontent.com",
        webClientId: "806096804987-nr4dh3jnem79opeal8itqeepohgl96rd.apps.googleusercontent.com",
        iosClientId: "806096804987-rgik2jd1noli8spkhck3nk0qkee0kiue.apps.googleusercontent.com",
    });
    const colorScheme = useColorScheme();
    const [isThemeDark, setIsThemeDark] = colorScheme === 'light' ? React.useState(false) : React.useState(true);
    const customDark = {
        ...CombinedDarkTheme,
        colors: {
            ...CombinedDarkTheme.colors,
            primary: 'tomato',
            secondary: 'yellow',
            background: '#303044',
        },
    };

    const customLight = {
        ...CombinedDefaultTheme,
        colors: {
            ...CombinedDefaultTheme.colors,
            primary: 'tomato',
            secondary: 'yellow',
            background: '#E0D9D7',
        },
    };

    let theme = isThemeDark ? customDark : customLight;
    const toggleTheme = React.useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = React.useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    return (
        <PreferencesContext.Provider value={preferences}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme} >
                    <Content isLargeScreen={isLargeScreen} loading={loading} />
                </NavigationContainer>
            </PaperProvider>
        </PreferencesContext.Provider>
    );
}