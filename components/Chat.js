import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { GiftedChat, Send, InputToolbar, Composer, Bubble, Time } from 'react-native-gifted-chat'
import { PreferencesContext } from './PreferencesContext';
import {
    Avatar, useTheme, Appbar, IconButton, ToggleButton, SegmentedButtons, Card, Title, Paragraph, List, Text, Button, TouchableRipple, Switch, TextInput, Searchbar
} from 'react-native-paper';
import uuid from 'react-native-uuid';
import { robotBase64 } from '../assets/logo';
import { userBase64 } from '../assets/user';

var UniqueID = 1;
var chatBot = 'UCSD';

const Header = (props) => {
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const [selectedButton, setSelectedButton] = React.useState('UCSD Care');
    const [value, setValue] = React.useState('UCSD');

    const handleButtonPress = (buttonName) => {
        setSelectedButton(buttonName);
    };

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
            <SegmentedButtons
                style={{ maxWidth: "80%" }}
                value={value}
                onValueChange={(props) => {
                    if (props.localeCompare("UCSD") == 0) {
                        handleButtonPress('UCSD Care')
                        chatBot = 'UCSD'
                        console.log(chatBot)
                    } else {
                        handleButtonPress('General Health')
                        chatBot = 'GH'
                        console.log(chatBot)
                    }
                    setValue(props);
                }}
                buttons={[
                    {
                        value: 'UCSD',
                        label: 'UCSD Care',
                    },
                    {
                        value: 'General',
                        label: 'General',
                    }
                ]}
            />
        </Appbar.Header>
    );
};


class Chat extends React.Component {

    constructor(props) {
        super(props);
        let id = this.props.chatID;
        if (this.props.messages?.[id] === undefined) {
            id = uuid.v4();
        }
        this.state = {
            chatID: id,
            loading: false,
            messages: this.props.messages?.[id] === undefined ? [] : this.props.messages[id],
            chatbaseMessages: [],
            text: '',
            information: {
                "web": ["Tell me about SHS at UCSD", "What does UC SHIP insurance cover?"],
                "phone": [["Resource Available", "Winter storm is coming"], ["Other hints", "temporary box"]],
            },
            userAvatar: this.props.avatar,
            robotAvatar: `${robotBase64}`
        }
    }

    // called after component is inserted
    async componentDidMount() {

        // TODO: add a button to clear history!!
        // load convo history, if it exists (needed to keep context)

        for (const msg of this.state.messages.slice().reverse()) {
            if (msg.user.name == "User") {
                this.state.chatbaseMessages.push({ content: msg.text, role: 'user' })
            }
            else if (msg.user.name == "Robot") {
                this.state.chatbaseMessages.push({ content: msg.text, role: 'assistant' })
            }
        }

        // update UniqueID to prevent collisions
        UniqueID = this.state.messages.length + 1;
    };

    // 'messages' is the full conversation in chatbase format, with a new message at the end
    async chatBotRequest() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_AZURE_URL}/callChatbase`, { // Change to AZURE_LOCAL_URL if testing the Azure function locally
            method: 'POST',
            body: JSON.stringify({
                identity: "healthbot1",
                messages: this.state.chatbaseMessages,
                conversationId: this.state.chatID,
                selectedModel: chatBot
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw Error(errorData.message);
        }
        const responseData = await response.text();
        return responseData
    }

    async addMessage(content) {
        let history = this.props.history;
        let messages = this.props.messages;
        if (this.state.messages.length == 0) {// means this is the first time
            history[this.state.chatID] = {
                "title": content[0].text,
                "timestamp": content[0].createdAt
            }
        }
        let a = content.concat(this.state.messages);
        this.setState({ messages: a, loading: true });
        for (let i of content) {
            a = (await this.generateMessage(i.text)).concat(a);
        }
        this.setState({ messages: a, loading: false });

        messages[this.state.chatID] = a;
        this.props.updateHistory(history, messages);
    }

    async generateMessage(input) {
        let message = [];

        // add input to chatbaseMessages - use setState here instead?
        this.state.chatbaseMessages.push({ content: input, role: 'user' });

        // call chatbot API
        var response = await this.chatBotRequest();

        // add response to chatbaseMessages
        this.state.chatbaseMessages.push({ content: response, role: 'assistant' });

        message.push({
            _id: UniqueID++,
            text: response,
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
                    avatar: this.props.avatar,
                },
            };
            this.addMessage([newMessage]);
            this.setState({ text: '' });
        }
    }

    renderInputToolbar(props) {
        let search = (<Searchbar
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
        />);
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} style={[styles.container, { alignItems: 'center' }]}>
                    {search}
                </KeyboardAvoidingView>)
        }
        return (
            <View style={[styles.container, { alignItems: 'center' }]}>{search}</View>
        )
    }

    renderAvatar(props) {
        const { currentMessage } = props;
        const avatarUrl = currentMessage.user.avatar;
        return (
            <Avatar.Image
                key={uuid.v4()}
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

    renderFooter(props) {
        if (this.state.loading) {
            return (<Text style={{ marginLeft: 20 }} variant="labelSmall">ChatBot is thinking...</Text>);
        } else {
            return null;
        }
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
                            avatar: this.props.avatar,
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
                            avatar: this.props.avatar,
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
                                avatar: this.props.avatar,
                            },
                        }])} />}
                    />
                </Card >)
            }
        }

        return (
            <View style={[styles.emptyContainer, { transform: Platform.OS === 'android' ? [{ rotate: '180deg' }] : [{ scaleY: -1 }] }]}>
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
                    renderFooter={props => this.renderFooter(props)}
                    user={{
                        _id: 1,
                        name: 'User',
                        avatar: this.props.avatar,
                    }}
                />
                {
                    Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                }
            </>)
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