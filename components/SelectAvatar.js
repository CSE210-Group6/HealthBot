import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, Avatar } from 'react-native-paper';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';


class SelectAvatar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }

        return null;
    };

    async compressImage(uri) {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 50 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        return result.base64;
    };

    render() {

        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={Platform.OS === "web" ? [styles.container, styles.centeredItem, { backgroundColor: '#1A1A3D' }] : styles.container} >
                <View style={[styles.container, { alignItems: 'center' }]}>
                    <Avatar.Image size={100} style={{ margin: 30 }} source={{ uri: this.props.avatar }} />
                    <Text variant="headlineMedium" style={[styles.child, { textAlign: 'center' }]}>Your Image</Text>
                </View>
                <Text style={styles.child}>Select an image to substitute</Text>
                {this.props.signupNotification?.length === 0 ? (<></>) : (<Text style={{ ...styles.paragraph, color: 'red' }}>{this.props.signupNotification}</Text>)}
                <Button icon="camera" mode="contained" onPress={async () => {
                    const uri = await this.pickImage();
                    if (uri) {
                        const base64 = await this.compressImage(uri);
                        this.props.handleupdateAvatar("data:image/jpeg;base64," + base64, this.props.navigation);
                    }
                }}>
                    Upload Image
                </Button>
                <StatusBar style="auto" />
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    centeredItem: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 300, maxHeight: 600,
        textAlign: 'center',
        lineHeight: '100px',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: '10px'
    },
    child: {
        margin: 10
    },
    paragraph: {
        paddingBottom: 10,
    }
});


export default SelectAvatar;