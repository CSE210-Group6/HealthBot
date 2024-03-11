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
            <Appbar.Content title="Privacy Policy" />
        </Appbar.Header>
    );
};

const PrivacyPolicy = (props) => {

    return (
        <>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Title
                        title="Privacy Policy"
                        subtitle="SHS-Chatbot"
                    />
                    <Card.Content>
                        <Title>Privacy Policy for UCSD Health Chatbot App</Title>
                        <Paragraph>
                            This Privacy Policy describes how UCSD Health ("we", "us", or "our") collects, uses, and shares information when you use our Chatbot application ("App"). By using the App, you agree to the collection and use of information in accordance with this policy.
                        </Paragraph>
                        <Title>Information Collection and Use</Title>
                        <Paragraph>
                            When you sign up for and use the UCSD Health Chatbot App, we may collect certain personally identifiable information, including but not limited to your username, password, and any other information you provide during the registration process. This information is used solely for the purpose of providing you with access to the App and its features, including the ability to login and chat with the Chatbot.
                        </Paragraph>
                        <Title>Chat Data</Title>
                        <Paragraph>
                            Your chat interactions with the Chatbot are securely stored in a database. This includes messages exchanged, timestamps, and any other relevant data necessary for providing and improving the Chatbot's functionality. Your chat data may be analyzed anonymously to improve the performance and accuracy of the Chatbot.
                        </Paragraph>
                        <Title>Security</Title>
                        <Paragraph>
                            We take appropriate measures to protect the security and confidentiality of your information. We use industry-standard security protocols to ensure that your data is protected against unauthorized access, disclosure, alteration, or destruction. Access to your personal information is restricted to authorized personnel only, who are required to maintain the confidentiality of such information.
                        </Paragraph>
                        <Title>Syncing Across Devices</Title>
                        <Paragraph>
                            Your chat data may be synced across devices to provide you with a seamless experience when using the App on different platforms. This syncing is done securely, and your data is encrypted during transmission and storage to prevent unauthorized access.
                        </Paragraph>
                        <Title>Third-Party Services</Title>
                        <Paragraph>
                            We may use third-party services to support the functionality of the App, such as cloud storage providers for data storage and analytics services for data analysis. These third parties may have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </Paragraph>
                        <Title>Data Retention</Title>
                        <Paragraph>
                            We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.
                        </Paragraph>
                        <Title>Changes to This Privacy Policy</Title>
                        <Paragraph>
                            We reserve the right to update or change our Privacy Policy at any time. Any changes will be effective immediately upon posting the updated Privacy Policy on this page.
                        </Paragraph>
                        <Title>Contact Us</Title>
                        <Paragraph>
                            If you have any questions or concerns about our Privacy Policy or the handling of your personal information, please contact us at [contact email or address].

                            By using the UCSD Health Chatbot App, you acknowledge that you have read and understood this Privacy Policy and agree to its terms and conditions.
                        </Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView >
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

export default PrivacyPolicy;