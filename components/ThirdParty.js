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
            <Appbar.Content title="ThirdParty" />
        </Appbar.Header>
    );
};

const ThirdParty = (props) => {

    return (
        <>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Title
                        title="ThirdParty licenses"
                        // subtitle="Following "
                    />
                    <Card.Content>
                        <Title>MIT Licenses</Title>
                        <Paragraph>
                        Copyright (c) Meta Platforms, Inc. and affiliates.
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2019 Farid from Safi
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2017 Callstack
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2016-2021 Eugene Hauptmann
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2017 React Navigation Contributors
                        </Paragraph>
                        <Paragraph>
                        Copyright (c) 2015-present 650 Industries
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

export default ThirdParty;