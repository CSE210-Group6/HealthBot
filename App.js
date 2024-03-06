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
    Avatar, TouchableRipple, Switch, Divider
} from 'react-native-paper';
import merge from 'deepmerge';
import { name as appName } from './app.json';
import Chat from './components/Chat';
import Login from './components/Login';
import { PreferencesContext } from './components/PreferencesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
    const { navigation, history } = props;
    const historyArray = Object.entries(history);
    historyArray.sort((a, b) => {
        const timestampA = new Date(a[1].timestamp).getTime();
        const timestampB = new Date(b[1].timestamp).getTime();
        return timestampA - timestampB;
    });
    const drawerItems = historyArray.map(([chatKey, chat]) => (
        <PaperDrawer.Item
            key={chatKey}
            label={`${chat.title}`}
            onPress={() => { }} // make this a function that update the state of chat
        />
    ));
    return (
        <View style={{flex: 1}}>
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
            : (<PaperDrawer.Section>
            <PaperDrawer.Item
                icon={({ color, size }) => (
                    <MaterialCommunityIcons name="arrow-left" color={color} size={size} />
                )}
                label="SHS-ChatBot"
                onPress={() => navigation.closeDrawer() } />
            </PaperDrawer.Section>)}
        {/* Middle View */}
            <DrawerContentScrollView {...props}>  
                {drawerItems}
            </DrawerContentScrollView>
        {/* Bottom View */}
            <TouchableRipple onPress={() => {}}>
                <View style={styles.sidebarBotSection}>
                    <Avatar.Image
                        source={require('./assets/logo.png')}
                        size={50}
                    />
                    <View pointerEvents="none">
                        <Switch value={false} />
                    </View>
                </View>
            </TouchableRipple>
        </View>
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
            history: {
                ID1: {"title":"What are something to eat in UCSD", "timestamp":"July 20, 71 20:17:40 GMT+00:00"},
                ID2: {"title":"Where to go for...", "timestamp":"July 20, 73 20:17:40 GMT+00:00"},
                ID3: {"title":"What is......", "timestamp":"July 20, 72 20:17:40 GMT+00:00"},
            },
            userInfo: {},
            username: "",
            temObj: {},
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

    async handleLogin(username1, password) {
        this.setState({ home: true, authentication: "", username: username1, homeText: "SHS-chatBot" })
    }

    handleExit() {
        this.setState({ username: "", userInfo: {}, notification: "Successfully logged out", home: false, authentication: "" })
    }

    // TODO: need to generate chatID when starting new chat
    render() {
        if (this.state.home) {
            return (
                <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerType: this.isLargeScreen ? "permanent" : "front" }} drawerContent={props => <CustomDrawerContent {...props} navigation={props.navigation} history={this.state.history} />}>
                    <Drawer.Screen name="Chat" options={{ headerShown: false }} component={Chat} ></Drawer.Screen>
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
                <NavigationContainer isLargeScreen={isLargeScreen} theme={theme}>
                    <Content />
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