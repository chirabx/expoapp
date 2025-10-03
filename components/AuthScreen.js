import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import RegisterScreen from './RegisterScreen';

export default function AuthScreen() {
    const { user, isLoading } = useAuth();
    const [currentScreen, setCurrentScreen] = useState('login'); // 'login' 或 'register'

    const showRegister = () => {
        setCurrentScreen('register');
    };

    const showLogin = () => {
        setCurrentScreen('login');
    };

    // 显示加载状态
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>加载中...</Text>
            </View>
        );
    }

    // 如果用户已登录，显示主界面
    if (user) {
        return <MainScreen />;
    }

    // 如果用户未登录，显示登录或注册界面
    if (currentScreen === 'register') {
        return <RegisterScreen onBackToLogin={showLogin} />;
    }

    return <LoginScreen onShowRegister={showRegister} />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
    },
    loadingText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    },
});
