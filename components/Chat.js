import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Button } from 'react-native';
import { Switch, Container, Content, Text, Card, CardItem, StyleProvider, Spinner, H1, H2, Left, Footer, Title, Header, Body, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { Avatar, GiftedChat, Send } from 'react-native-gifted-chat'
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import Logo from '../assets/logo.png';

var UniqueID = 1;


class Chat extends React.Component {
    // 1-TODO: Mis - Appropriate adjustment for screen orientation + majority testing
    

    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {
                    _id: UniqueID++,
                    text: 'Hello',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Robot',
                        avatar:Logo
                    },
                },
            ]
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
                avatar:Logo
            },
        })
        return message
    }

    renderInputToolbar(props) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                {/* 2- TODO: finish inputtoolbar componnet to match our design. For the voice input button, it can be just an icon now. Voice input should only exist when it is not in typing status*/}
            </View>
        );
    }

    renderAvatar(props) {
        // 1-TODO: appropriate way of setting and managing avatar, avatar should come from the App.js and login.js will initiate the updating function and App.js will update, and Chat should be able to use it and render - minority testing
        // Decode base64 image and return it as an Image component
        //return (<Image></Image>
        const { user } = props;
        // Get the avatar URL from props
        const avatarUrl = user.avatar;

        return (
            <Image
                source={{ uri: avatarUrl }}
                style={{ width: 50, height: 50 }}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.addMessage(messages)}
                    // renderInputToolbar={props => this.renderInputToolbar(props)}
                    // renderAvatar={props => this.renderAvatar(props)}
                    user={{
                        _id: 1,
                        name: 'User',
                        // avatar: 'Your Base64 encoded avatar string here',
                    }}
                />
            </View>
        )
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

export default Chat;