import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// unique ID for each message in this Chat
var messageID = 1;

class Chat extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            chatID: "test-chat",
            loading: true,
            messages: [],
            chatbaseMessages: [],
            text: '',
            userAvatar: '',
            robotAvatar: '',
            selectedModel: "UCSD"
        }
    }

    async componentDidMount () {
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
            const value = await AsyncStorage.getItem(this.state.chatID);
            if (value !== null) {
                // conversation previously stored
                // add previous convo to state
                this.setState({ messages: JSON.parse(value) });

                // update messageID to prevent collisions
                messageID = this.state.messages.length + 1;
            }
            // else no previous conversation was found
            else {
                this.setState({
                    messages:
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
        for (const [index, msg] of this.state.messages.slice().reverse().entries()) {
            // every other reponse will be the assistant
            if (index % 2 == 0) {
                this.state.chatbaseMessages.push({ content: msg.text, role: 'assistant' })
            }
            else {
                this.state.chatbaseMessages.push({ content: msg.text, role: 'user' })
            }
        }
    };

    // 'messages' is the full conversation in chatbase format, with a new message at the end
    async chatBotRequest() {
        const response = await fetch(process.env.EXPO_PUBLIC_AZURE_LOCAL_URL, { // Change to AZURE_LOCAL_URL if testing the Azure function locally
            method: 'POST',
            body: JSON.stringify({
                identity: "healthbot1",
                messages: this.state.chatbaseMessages,
                conversationId: this.state.chatID,
                selectedModel: this.state.selectedModel,
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
        let a = content.concat(this.state.messages);
        this.setState({ messages: a });
        for (let i of content) {
            a = (await this.generateMessage(i.text)).concat(a);
        }
        this.setState({ messages: a });

        // push new state to local storage
        try {
            await AsyncStorage.setItem(this.state.chatID, JSON.stringify(a));
        } catch (e) {
            console.error('[ addMessage ] error writing value to async storage')
        }
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
            _id: messageID++,
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
        const { selectedModel } = this.state;
        // console.log(this.state.selectedModel)
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, selectedModel === 'UCSD' && styles.selectedButton]}
                                onPress={() => this.setState({ selectedModel: 'UCSD' })}>
                                <Text style={styles.buttonText}>UCSD Care</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, selectedModel === 'GH' && styles.selectedButton]}
                                onPress={() => this.setState({ selectedModel: 'GH' })}>
                                <Text style={styles.buttonText}>General Health</Text>
                            </TouchableOpacity>
                        </View>
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
            );
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
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
        },
        button: {
            backgroundColor: '#007bff',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
        },
        selectedButton: {
            backgroundColor: '#ff6f61', // Change background color when selected
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
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
        textInput: {
            height: 45, width: "95%", borderColor: "gray", borderWidth: 2, margin: 10
        },
        textInput1: {
            height: 45, width: "95%", borderColor: "gray", borderWidth: 2, margin: 10, marginBottom: 20
        }
    });

export default Chat;
