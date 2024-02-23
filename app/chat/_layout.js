import { Stack } from 'expo-router/stack';

export default function LoginLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer>
                <Drawer.Screen name="chat" options={{ title: "New" }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
