import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useWindowDimensions, StyleSheet, View, AppRegistry, Appearance, useColorScheme, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, } from '@react-navigation/native';
import {
    PaperProvider, MD3DarkTheme,
    MD3LightTheme, Text,
    adaptNavigationTheme, Drawer as PaperDrawer,
    Avatar, TouchableRipple, Switch, Divider, useTheme
} from 'react-native-paper';
import merge from 'deepmerge';
import { name as appName } from './app.json';
import Chat from './components/Chat';
import Login from './components/Login'
import Signup from './components/Signup'
import About from './components/About'
import ThirdParty from './components/ThirdParty'
import Setting from './components/Setting'
import * as Crypto from 'expo-crypto';
import { PreferencesContext } from './components/PreferencesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectAvatar from "./components/SelectAvatar";
import uuid from 'react-native-uuid';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

AppRegistry.registerComponent(appName, () => App);
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);


const CustomDrawerContent = (props) => {

    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

    const { navigation, history } = props;
    const historyArray = Object.entries(history);
    historyArray.sort((a, b) => {
        const timestampA = new Date(a[1].timestamp).getTime();
        const timestampB = new Date(b[1].timestamp).getTime();
        return timestampA - timestampB;
    });
    const drawerItems = historyArray.map(([chatKey, chat]) => {
        const keys = chatKey;
        return (
            <PaperDrawer.Item
                key={chatKey}
                label={`${chat.title}`}
                onPress={() => { props.updateCurId(keys, navigation) }} // make this a function that update the state of chat
            />
        );
    });
    return (
        <View style={{ flex: 1 }}>
            {/* Top View */}
            {Platform.OS === 'web' ?
                <PaperDrawer.Section style={styles.sidebarTopSection}>
                    <Avatar.Image
                        source={require('./assets/logo.png')}
                        size={60}
                    />
                    <View style={styles.titleSection}>
                        <Text style={styles.largerText}>UCSD Health</Text>
                        <Text style={styles.smallerText}>SHS-Chatbot</Text>
                    </View>
                </PaperDrawer.Section>
                : (<PaperDrawer.Section style={{ paddingTop: 30 }}>
                    <PaperDrawer.Item
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons name="arrow-left" color={color} size={size} />
                        )}
                        label="SHS-ChatBot"
                        onPress={() => navigation.closeDrawer()} />
                </PaperDrawer.Section>)}
            {/* Middle View */}
            <PaperDrawer.Item
                key="new"
                style={{ backgroundColor: isThemeDark ? '#00000030' : '#E0D9D730', borderRadius: 10 }}
                label="Start a new chat"
                icon="plus"
                onPress={() => { props.updateCurId(uuid.v4(), navigation) }} // make this a function that update the state of chat
            />
            <DrawerContentScrollView {...props}>
                {drawerItems}
            </DrawerContentScrollView>
            {/* Bottom View */}
            <Divider />
            <View style={styles.sidebarBotSection}>
                <TouchableRipple onPress={() => { navigation.navigate("Setting") }}>
                    <MaterialCommunityIcons name="cog" color={isThemeDark ? "#f0f8ff" : "#000000"} size={30} />
                </TouchableRipple>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text variant="labelSmall" style={{}}>Theme</Text>
                    <Switch
                        color={'#C8A2C8'}
                        value={isThemeDark}
                        onValueChange={toggleTheme}
                    />
                </View>
            </View>
        </View>
    );
};

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: "",
            home: false,
            curId: "",
            homeText: "",
            Authentication: "",
            signupNotification: "",
            userAvatar: "",
            history: {
                ID1: { "title": "What are something to eat in UCSD", "timestamp": "July 20, 71 20:17:40 GMT+00:00" },
                ID2: { "title": "Where to go for...", "timestamp": "July 20, 73 20:17:40 GMT+00:00" },
                ID3: { "title": "What is......", "timestamp": "July 20, 72 20:17:40 GMT+00:00" },
            },
            messages: {},
            userInfo: {},
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.updateCurId = this.updateCurId.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.handleupdateAvatar = this.handleupdateAvatar.bind(this);
        this.updateHistory = this.updateHistory.bind(this);
        this.isLargeScreen = props.isLargeScreen;
    }

    updateCurId(id1, navigation) {
        this.setState({ curId: id1 }, () => {
            navigation.navigate('Chat');
        });
    }

    async componentDidMount() {
        try {
            const userinfo = JSON.parse(await AsyncStorage.getItem('userinfo'));
            //format: {user: username, "Authentication": token}
            if (userinfo !== null) {
                let response = (await fetch("https://chat.1442334619.workers.dev/getinfo?user=" + userinfo.user))
                if (response.status === 200) {
                    let payload = await response.json();
                    this.setState({
                        home: true,
                        userInfo: userinfo.user,
                        Authentication: userinfo.Authentication,
                        history: payload.history.history,
                        messages: payload.history.messages,
                        userAvatar: payload.avatar
                    })
                } else {
                    AsyncStorage.clear();
                }
            }
        } catch (e) {
            // error reading value
            console.log("error reading" + e);
        }
    }

    async getChatHistory(username) {
        const chatResponse = await fetch(`${process.env.EXPO_PUBLIC_AZURE_URL}/chat?username=${username}`);
        const chatHistory = await chatResponse.json();
        return chatHistory;
    }

    /**
     * 
     * @param {String} username 
     * @param {String} password 
     * @param {*} navigator 
     */
    async handleSignup(username, password, navigator) {
        try {
            username = username.toLowerCase();
            const salt = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, username).then(hash => hash.slice(0, 16));
            const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password + salt);

            let response = await fetch("https://chat.1442334619.workers.dev/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "user": username,
                    "password": hashedPassword
                })
            });
            let re = await response.json();

            if (response.status === 200) {
                this.setState({ notification: "Signed up successfully" });
                navigator.navigate('Login');
            } else {
                this.setState({ signupNotification: re.response })
            }
        } catch (error) {
            console.log("Error happend" + error);
        }
    }

    async handleupdateAvatar(avatar, navigator) {
        try {
            let response = await fetch("https://chat.1442334619.workers.dev/avatar?user=" + this.state.userInfo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': this.state.Authentication
                },
                body: JSON.stringify({
                    "avatar": avatar
                })
            });
            let re = await response.json();

            if (response.status === 200) {
                this.setState({ notification: re.response, userAvatar: avatar }, async () => {
                    await this.updateHistory(this.state.history, this.state.messages);
                })
                navigator.navigate('Chat');
                console.log("updateAvatar: successfully updated");
            } else {
                this.setState({ notification: re.response })
            }
        } catch (error) {
            console.log("Error happend" + error);
        }
    }

    async handleLogin(username, password) {
        username = username.toLowerCase();
        const salt = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, username).then(hash => hash.slice(0, 16));
        const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password + salt);
        // Authentication should be done in the serverside, however, since you have done in this way, I will just follow it
        // const userResponse = await fetch(`${process.env.EXPO_PUBLIC_AZURE_URL}/userInfo?username=${username}&password=${hashedPassword}`);
        // if (userResponse.status !== 200) {
        //     const errorData = await userResponse.json();
        //     this.setState({ notification: errorData.message });
        //     return;
        // }
        // const user = await userResponse.json();
        // this.setState({
        //     home: true,
        //     userInfo: user,
        //     homeText: "SHS-chatBot"
        // })
        const response = await fetch("https://chat.1442334619.workers.dev/login?user=" + username, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': hashedPassword
            }
        })
        const payload = await response.json();
        if (response.status === 200) {
            // history has two parts: messages and history
            try {
                await AsyncStorage.setItem('userinfo', JSON.stringify({ "user": username, "Authentication": response.headers.get("Authorization") }));
            } catch (e) {
                // error reading value
                console.log("error loading" + e);
            }
            this.setState({
                home: true,
                userInfo: username,
                Authentication: response.headers.get("Authorization"),
                history: payload.history.history,
                messages: payload.history.messages,
                userAvatar: payload.avatar
            })
        } else {
            this.setState({ notification: payload.response })
        }
    }

    // TODO: need to find an appropriate way to compress or consolidate avatar infomation
    async updateHistory(history1, messages) {
        for (let i of Object.keys(messages)) {
            for (let j of messages[i]) {
                if (j.user.name == "User") {
                    j.user.avatar = this.state.userAvatar;
                }
            }
        }
        this.setState({ history: history1, messages: messages });

        let response = await fetch("https://chat.1442334619.workers.dev/history?user=" + this.state.userInfo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': this.state.Authentication
            },
            body: JSON.stringify({
                "history": { "history": history1, "messages": messages }
            })
        });
        console.log(await response.json());
    }

    async handleExit() {
        const response = await fetch("https://chat.1442334619.workers.dev/signout?user=" + this.state.userInfo, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.Authentication
            }
        })
        const payload = await response.json();
        AsyncStorage.clear();
        this.setState({ userInfo: "", notification: payload.response, home: false })
    }

    // TODO: need to generate chatID when starting new chat
    render() {
        if (this.state.home) {
            return (
                <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: this.isLargeScreen ? "permanent" : "front" }} drawerContent={props => <CustomDrawerContent {...props} navigation={props.navigation} history={this.state.history} updateCurId={this.updateCurId} />}>
                    <Drawer.Screen name="Chat" options={{ headerShown: false }} >
                        {(props) => <Chat {...props} key={this.state.curId} chatID={this.state.curId} updateHistory={this.updateHistory} history={this.state.history} messages={this.state.messages} userInfo={this.state.userInfo} notification={this.state.notification} avatar={this.state.userAvatar} />}
                    </Drawer.Screen>
                    <Drawer.Screen name="SelectAvatar" options={{ headerShown: false }}>
                        {(props) => <SelectAvatar {...props} notification={this.state.notification} avatar={this.state.userAvatar} handleupdateAvatar={this.handleupdateAvatar} />}
                    </Drawer.Screen>
                    <Drawer.Screen name="Setting" options={{ headerShown: false }}>
                        {(props) => <Setting {...props} notification={this.state.notification} updateHistory={this.updateHistory} signout={this.handleExit} />}
                    </Drawer.Screen>
                    <Drawer.Screen name="About" options={{ headerShown: false }}>
                        {(props) => <About {...props} />}
                    </Drawer.Screen>
                    <Drawer.Screen name="ThirdParty" options={{ headerShown: false }}>
                        {(props) => <ThirdParty {...props} />}
                    </Drawer.Screen>
                </Drawer.Navigator>
            );
        }
        return (
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{ title: "Login", headerShown: false }}>
                    {(props) => <Login {...props} handleExit={this.handleExit} getChatHistory={this.getChatHistory} home={this.state.home} notification={this.state.notification} handleLogin={this.handleLogin} />}
                </Stack.Screen>
                <Stack.Screen name="Signup" options={{ title: "Signup", headerShown: false }} >
                    {(props) => <Signup {...props} signupNotification={this.state.signupNotification} notification={this.state.notification} handleSignup={this.handleSignup} />}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }
}

export default function App() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
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
                    <Content isLargeScreen={isLargeScreen} />
                </NavigationContainer>
            </PaperProvider>
        </PreferencesContext.Provider>
    );
}

const styles = StyleSheet.create({
    sidebarTopSection: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 10,
        marginTop: 25,
        marginLeft: 20,
    },
    titleSection: {
        marginLeft: 25,
    },
    largerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    smallerText: {
        fontSize: 16,
    },
    sidebarBotSection: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingLeft: 20,
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
})