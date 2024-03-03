import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { GiftedChat, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { PreferencesContext } from './PreferencesContext';
import { Avatar, useTheme, Appbar, IconButton, Button, TouchableRipple, Switch, TextInput, Searchbar } from 'react-native-paper';

var UniqueID = 1;

const Header = (props) => {
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                    surface: '#00000000'
                },
            }}
        >
            <Appbar.Action icon="menu" onPress={() => props.navigation.openDrawer()} />
            <Appbar.Content title={props.name} />
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
        this.state = {
            loading: true,
            messages: [
            ],
            text: '',
            userAvatar: '',
            robotAvatar: ''
        }

        const loadData = async () => {
            const base64Robot = await (await fetch("https://getavatar.1442334619.workers.dev/")).text();
            const base64User = base64Robot;
            this.setState({
                messages: [], userAvatar: `data:image/jpeg;base64,${base64User}`,
                robotAvatar: `data:image/jpeg;base64,${base64Robot}`,
                loading: false
            });
        };

        loadData();
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
                    inputStyle={{ color: '#000000' }}
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
                        minInputToolbarHeight={80}
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
    child: {
        margin: 10
    },
    paragraph: {
        paddingBottom: 10,
    }
});

export default Chat;
