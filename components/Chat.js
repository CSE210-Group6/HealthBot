import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import { Switch, Container, Content, Card, CardItem, StyleProvider, Spinner, H1, H2, Left, Footer, Title, Header, Body, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import { StatusBar } from 'expo-status-bar';

import { Avatar, GiftedChat, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { ImageManipulator } from 'expo';
import * as FileSystem from 'expo-file-system';

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
                        avatar: '999'
                    },
                },
            ],
            text: ''
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
                avatar: '999',
            }
        })
        return message
    }

    renderInputToolbar(props) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                <TextInput
                    style={{ flex: 1, height: 40, backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 10 }}
                    placeholder="Type a message..."
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                />
                <TouchableOpacity
                    onPress={() => {
                        const { text } = this.state;
                        if (text.trim().length > 0) {
                        const newMessage = {
                            _id: UniqueID++,
                            text: text.trim(),
                            createdAt: new Date(),
                            user: {
                            _id: 1,
                            name: 'User',
                            },
                        };
                        this.addMessage([newMessage]);
                        this.setState({ text: '' });
                        }
                    }}
                    style={{ marginLeft: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#007bff', borderRadius: 20 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                </TouchableOpacity>
            </View>
        );
    }


    async renderAvatar(props) {
        const { currentMessage } = props;
        // const avatarUrl = currentMessage.user.avatar;
        const avatarUrl = '../assets/logo_s.jpg';

        
        try {
            const base64 = await FileSystem.readAsStringAsync('logo_s.jpg', { encoding: 'base64' });
            return (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${base64}` }}
                    style={{ width: 40, height: 40 }}
                />
            );
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    }
    
    

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.addMessage(messages)}
                    renderInputToolbar={props => this.renderInputToolbar(props)}
                    // renderAvatar={props => this.renderAvatar(props)}
                    // renderInputToolbar={props => this.renderInputToolbar(props)}
                    renderAvatar={props => this.renderAvatar(props)}

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
