import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import { Switch, Container, Content, Card, CardItem, StyleProvider, Spinner, H1, H2, Left, Footer, Title, Header, Body, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { Avatar, GiftedChat, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { ImageManipulator } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

var MessageID = 1;
const ConversationID = 'example-convo'; // TODO: unique identifiers for conversations


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

            // set state with empty messages
            this.setState({
                messages: [], 
                userAvatar: `data:image/jpeg;base64,${base64User}`,
                robotAvatar: `data:image/jpeg;base64,${base64Robot}`,
                loading: false
            });

            // manually clear storage?
            // TODO: add a button to clear history
            // AsyncStorage.clear();

            // load convo history, if it exists
            try {
                const value = await AsyncStorage.getItem( ConversationID );
                if (value !== null) {
                  // conversation previously stored
                  // add previous convo to state
                  this.setState({ messages: JSON.parse( value ) });

                  // update messageID to prevent collisions
                  MessageID = this.state.messages.length + 1;
                }
                // else no previous conversation was found
                else {
                    this.setState({ messages: 
                        [{
                            _id: MessageID++,
                            text: 'Hello, ask me anything about UCSD student health!',
                            createdAt: new Date(),
                            user: {
                                _id: 2,
                                name: 'Robot',
                                avatar: `data:image/jpeg;base64,${base64Robot}`
                            },
                        }]
                    });
                }
              } catch (e) {
                console.error("[ loadData ] error reading value from async storage");
              }
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

        // push new state to local storage
        try {
            await AsyncStorage.setItem(ConversationID, JSON.stringify(a));
          } catch (e) {
            console.error('[ addMessage ] error writing value to async storage')
          }
        
    }

    async generateMessage(input) {
        let message = [];
        const response = { "answer": "sample response" };
        message.push({
            _id: MessageID++,
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
                                _id: MessageID++,
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
                    }}
                    style={{ marginLeft: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#007bff', borderRadius: 20 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderAvatar(props) {
        const { currentMessage } = props;
        const avatarUrl = currentMessage.user.avatar;
        return (
            <Image
                source={{ uri: avatarUrl }}
                style={{ width: 40, height: 40 }}
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
                <View style={styles.container}>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.addMessage(messages)}
                        showUserAvatar={true}
                        renderInputToolbar={props => this.renderInputToolbar(props)}
                        renderAvatar={props => this.renderAvatar(props)}
                        user={{
                            _id: 1,
                            name: 'User',
                            avatar: this.state.userAvatar,
                        }}
                    />
                </View>
            )
        }
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
