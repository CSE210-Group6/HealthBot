import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import { Switch, Container, Content, Card, CardItem, StyleProvider, Spinner, H1, H2, Left, Footer, Title, Header, Body, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { Avatar, GiftedChat, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { ImageManipulator } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { err } from 'react-native-svg';

// unique ID for each message in this Chat
var messageID = 1;

const chatbaseAPI_key = ''; // TODO: use serverless function to call API instead
const chatbotID = 'Uq82K-tMWXrg_73JYZCCi'; // this is not a secret, but will be used by serverless funct also


class Chat extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            chatID: this.props.chatID,
            loading: true,
            messages: [],
            chatbaseMessages: [],
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
                const value = await AsyncStorage.getItem( this.state.chatID );
                if (value !== null) {
                  // conversation previously stored
                  // add previous convo to state
                  this.setState({ messages: JSON.parse( value ) });

                  // update messageID to prevent collisions
                  messageID = this.state.messages.length + 1;
                }
                // else no previous conversation was found
                else {
                    this.setState({ messages: 
                        [{
                            _id: messageID++,
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
        
            // format state messages into chatbot format
            for ( const [index, msg] of this.state.messages.slice().reverse().entries() ) {
                // every other reponse will be the assistant
                if ( index % 2 == 0 ) {
                    this.state.chatbaseMessages.push( {content: msg.text, role: 'assistant'})
                }
                else {
                    this.state.chatbaseMessages.push( {content: msg.text, role: 'user'})
                }
            }
        };
        loadData();
    }

    // 'messages' is the full conversation in chatbase format, with a new message at the end
    async chatBotRequest( ) {
        const response = await fetch( 'https://www.chatbase.co/api/v1/chat', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + chatbaseAPI_key
            },
            body: JSON.stringify({
                messages: this.state.chatbaseMessages,
                chatbotId: chatbotID,
                conversationId: this.state.chatID
            })
        });

        if( !response.ok ) {
            const errorData = await response.json();
            throw Error( errorData.message );
        }
        const responseData = await response.json();
        return responseData
    }

    async addMessage( content ) {
        let a = content.concat( this.state.messages );
        this.setState( { messages: a } );
        for ( let i of content ) {
            a = ( await this.generateMessage( i.text ) ).concat(a);
        }
        this.setState({ messages: a });

        // push new state to local storage
        try {
            await AsyncStorage.setItem( this.state.chatID, JSON.stringify(a) );
          } catch (e) {
            console.error('[ addMessage ] error writing value to async storage')
          }
    }

    async generateMessage( input ) {
        let message = [];

        // add input to chatbaseMessages - use setState here instead?
        this.state.chatbaseMessages.push({ content: input, role: 'user' });

        // call chatbot API
        var response = await this.chatBotRequest();

        // add response to chatbaseMessages
        this.state.chatbaseMessages.push({ content: response.text, role: 'assistant' });

        message.push({
            _id: messageID++,
            text: response.text,
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
                                _id: messageID++,
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
