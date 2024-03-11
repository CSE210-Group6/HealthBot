import React from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { Dialog, Appbar, Card, Paragraph, Title, Portal, Snackbar, useTheme, PaperProvider, List, Switch, Divider, Button, Text, TextInput, Avatar } from 'react-native-paper';

const Header = (props) => {

    const theme = useTheme();

    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                    surface: Platform.OS === 'web' ? '#39462C' : '#00000000'
                },
            }}
        >
            <Appbar.Action icon="arrow-left" onPress={() => props.navigation.navigate("Setting")} />
            <Appbar.Content title="About" />
        </Appbar.Header>
    );
};

const About = (props) => {

    return (
        <>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Title
                        title="About Us"
                        subtitle="CSE 210 Group 6"
                    />
                    <Card.Content>
                        <Title>About US</Title>
                        <Paragraph>
                            This is the ChatBot app that we built as part of our CSE 210 final project. The members are: Shaokang Jiang, Isaac Nealey, Shun Zhang, Marin Cao and Vineeth Chelur.
                        </Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
        </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        margin: 10,
    },
});

export default About;