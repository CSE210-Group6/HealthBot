import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { GiftedChat, Send, InputToolbar, Composer, Bubble, Time } from 'react-native-gifted-chat'
import { PreferencesContext } from './PreferencesContext';
import {
    Avatar, useTheme, Appbar, IconButton, Card, Title, Paragraph, List, Text, Button, TouchableRipple, Switch, TextInput, Searchbar
} from 'react-native-paper';
import { robotBase64 } from '../assets/logo'

var UniqueID = 1;

const Header = (props) => {
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                    surface: Platform.OS === 'web' ? '#39462C' : '#00000000'
                },
            }}
        >
            <Appbar.Action icon="menu" onPress={() => props.navigation.openDrawer()} />
            {Platform.OS === 'web' ? <></> : <Appbar.Content title={props.name} />}
            <Switch
                color={'#C8A2C8'}
                value={isThemeDark}
                onValueChange={toggleTheme}
            />
        </Appbar.Header>
    );
};


class Chat extends React.Component {
    // 1-TODO: Mis - Appropriate adjustment for screen orientation + majority testing

    constructor(props) {

        super(props);
        const base64Robot = robotBase64;
        const base64User = base64Robot;
        this.state = {
            loading: false,
            messages: [
            ],
            text: '',
            information: {
                "web": ["Tell me about SHS at UCSD", "What does UC SHIP insurance cover?"],
                "phone": [["Resource Available", "Winter storm is coming"], ["Other hints", "temporary box"]],
            },
            userAvatar: `data:image/jpeg;base64,${base64User}`,
            robotAvatar: `data:image/jpeg;base64,${base64Robot}`
        }
    }

    async addMessage(content) {
        let a = content.concat(this.state.messages);
        this.setState({ messages: a });
        for (let i of content) {
            a = (await this.generateMessage(i.text)).concat(a);
        }
        this.setState({ messages: a });
    }

    async generateMessage(input) {
        let message = [];
        const response = { "answer": "sample response" };
        message.push({
            _id: UniqueID++,
            text: response.answer,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'Robot',
                avatar: this.state.robotAvatar,
            }
        })
        return message
    }

    onSend() {
        const { text } = this.state;
        if (text.trim().length > 0) {
            const newMessage = {
                _id: UniqueID++,
                text: text.trim(),
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'User',
                    avatar: this.state.userAvatar,
                },
            };
            this.addMessage([newMessage]);
            this.setState({ text: '' });
        }
    }

    renderInputToolbar(props) {
        return (
            <View style={[styles.container, { alignItems: 'center' }]}>
                <Searchbar
                    style={{ marginTop: -1, backgroundColor: '#F7FAF8', width: '95%' }}
                    placeholder="Type a message..."
                    placeholderTextColor="#9E9E9E"
                    inputStyle={{ marginLeft: -20, color: '#000000' }}
                    icon={() => null}
                    label="text"
                    value={this.state.text}
                    onChangeText={(text) => this.setState({ text })}
                    onSubmitEditing={() => this.onSend()}
                    returnKeyType="send"
                    right={(props) => (<IconButton
                        icon="arrow-right"
                        iconColor="#C0C0C0"
                        size={30}
                        onPress={() => this.onSend()}
                    />)}
                />
            </View>
        )
    }

    renderAvatar(props) {
        const { currentMessage } = props;
        const avatarUrl = currentMessage.user.avatar;
        return (
            <Avatar.Image
                size={40}
                source={{ uri: avatarUrl }}
            />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: Platform.OS === 'web' ? '#FFEED6' : '#F2F4F2', // Change background color for left (received) messages
                    },
                    right: {
                        backgroundColor: Platform.OS === 'web' ? '#FFEED6' : '#006B5F', // Change background color for right (sent) messages
                    },
                }}
                textStyle={{
                    left: {
                        color: 'black', // Text color for left (received) messages
                    },
                    right: {
                        color: Platform.OS === 'web' ? 'black' : 'white', // Text color for right (sent) messages
                    }
                }}
            />
        );
    }

    renderTime(props) {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    right: {
                        color: Platform.OS === 'web' ? 'black' : 'white',
                    },
                    left: {
                        color: 'black',
                    },
                }}
            />
        );
    }

    renderChatEmpty(props) {
        const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
        let items = []
        if (Platform.OS === 'web') {
            for (let i = 0; i <= 1; i++) {
                const question = this.state.information.web[i];
                items.push(<Card
                    mode='outlined'
                    key={"" + i}
                    style={[styles.child, { width: '30vw' }]}
                    theme={{
                        colors: {
                            surface: isThemeDark ? '#00000000' : '#CDE8E1',
                            outline: '#BAA78A'
                        },
                    }}
                    onPress={(props) => this.addMessage([{
                        _id: UniqueID++,
                        text: question,
                        createdAt: new Date(),
                        user: {
                            _id: 1,
                            name: 'User',
                            avatar: this.state.userAvatar,
                        },
                    }])}
                >
                    <Card.Content>
                        <Text variant="bodyMedium" style={{ color: isThemeDark ? '#FDFEFC' : '#3F4946' }}>{question}</Text>
                    </Card.Content>
                </Card >)
            }
        } else {
            for (let i = 0; i <= 1; i++) {
                const question = this.state.information.phone[i][1];
                items.push(<Card
                    mode='contained'
                    key={"" + i}
                    style={styles.child}
                    onPress={(props) => this.addMessage([{
                        _id: UniqueID++,
                        text: question,
                        createdAt: new Date(),
                        user: {
                            _id: 1,
                            name: 'User',
                            avatar: this.state.userAvatar,
                        },
                    }])}
                >
                    <Card.Title
                        style={{ width: "90%" }}
                        title={this.state.information.phone[i][0]}
                        titleStyle={{ margin: 5, marginTop: 10 }}
                        titleVariant="titleLarge"
                        subtitleStyle={{ margin: 5, marginBottom: 10 }}
                        subtitleVariant='bodySmall'
                        subtitle={question}
                        right={(props) => <IconButton {...props} icon="arrow-right" onPress={(props) => this.addMessage([{
                            _id: UniqueID++,
                            text: question,
                            createdAt: new Date(),
                            user: {
                                _id: 1,
                                name: 'User',
                                avatar: this.state.userAvatar,
                            },
                        }])} />}
                    />
                </Card >)
            }
        }

        return (
            <View style={[styles.emptyContainer, { transform: Platform.OS === 'web' ? [{ scaleY: -1 }] : [{ rotate: '180deg' }] }]}>
                <View></View>
                {Platform.OS === 'web' ?
                    (<>
                        <View style={{ backgroundColor: isThemeDark ? '#00000000' : '#C6B5A8', borderRadius: '20px' }}>
                            <View style={[styles.container, { alignItems: 'center' }]}>
                                <Avatar.Image size={100} style={{ margin: 30 }} source={require('../assets/logo.png')} />
                                <Text variant="headlineMedium" style={[styles.child, { textAlign: 'center' }]}>UCSD HEALTH CHAT BOT</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: -50 }}>
                            {items}
                        </View></>) : (
                        <>
                            <Text style={{ color: '#ccc', fontSize: 20 }}>
                                No messages yet
                            </Text>
                            <View >
                                {items}
                            </View>
                        </>)}
            </View>
        )
    }

    render() {
        if (this.state.loading) {
            return (<View style={styles.container}>
                <Text>Loading...</Text>
            </View>)
        } else {
            return (
                <>
                    <Header name="Chat" navigation={this.props.navigation} />
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.addMessage(messages)}
                        showUserAvatar={true}
                        renderInputToolbar={props => this.renderInputToolbar(props)}
                        renderAvatar={props => this.renderAvatar(props)}
                        renderBubble={props => this.renderBubble(props)}
                        minInputToolbarHeight={80}
                        renderTime={props => this.renderTime(props)}
                        renderChatEmpty={props => this.renderChatEmpty(props)}
                        user={{
                            _id: 1,
                            name: 'User',
                            avatar: this.state.userAvatar,
                        }}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </>)
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    emptyContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'space-between', marginTop: '3%',
    },
    child: {
        margin: 10
    },
    paragraph: {
        paddingBottom: 10,
    }
});

export default Chat;
