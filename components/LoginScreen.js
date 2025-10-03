import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Android适配常量
const isAndroid = Platform.OS === 'android';
const statusBarHeight = StatusBar.currentHeight || 0;
const screenHeight = height - statusBarHeight;

export default function LoginScreen({ onShowRegister }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('提示', '请输入用户名和密码');
            return;
        }

        setIsLoading(true);

        // 调用真实的登录功能
        const result = await login(username.trim(), password);

        setIsLoading(false);

        if (result.success) {
            Alert.alert('欢迎', '登录成功！欢迎使用智能助教系统');
            // 登录成功后会自动跳转到主界面（通过AuthContext管理）
        } else {
            Alert.alert('登录失败', result.error || '登录失败，请重试');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('找回密码', '请联系系统管理员重置密码');
    };

    const handleShowRegister = () => {
        onShowRegister && onShowRegister();
    };

    return (
        <View style={styles.container}>
            {/* Android状态栏适配 */}
            {isAndroid && <StatusBar backgroundColor="#667eea" barStyle="light-content" />}

            {/* 静态背景 */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backgroundGradient}
            />

            <KeyboardAvoidingView
                behavior={isAndroid ? 'height' : 'padding'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={isAndroid ? statusBarHeight : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* 欢迎标语 */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>智慧同行，点亮教学每一刻</Text>
                        <Text style={styles.welcomeSubtitle}>您的专属智能助教与教学策略师</Text>
                    </View>

                    {/* 登录卡片 */}
                    <View style={styles.loginCard}>
                        <View style={styles.cardContent}>
                            <Text style={styles.loginTitle}>欢迎回来，老师</Text>

                            {/* 用户名输入框 */}
                            <View style={styles.inputContainer}>
                                <View style={[
                                    styles.inputWrapper,
                                    focusedInput === 'username' && styles.inputWrapperFocused
                                ]}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="请输入用户名"
                                        placeholderTextColor="#999"
                                        value={username}
                                        onChangeText={setUsername}
                                        onFocus={() => setFocusedInput('username')}
                                        onBlur={() => setFocusedInput(null)}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* 密码输入框 */}
                            <View style={styles.inputContainer}>
                                <View style={[
                                    styles.inputWrapper,
                                    focusedInput === 'password' && styles.inputWrapperFocused
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="请输入密码"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* 记住我和忘记密码 */}
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity
                                    style={styles.rememberMeContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                                    </View>
                                    <Text style={styles.rememberMeText}>记住我</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={styles.forgotPasswordText}>忘记密码？</Text>
                                </TouchableOpacity>
                            </View>

                            {/* 登录按钮 */}
                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButtonGradient}
                                >
                                    {isLoading ? (
                                        <View style={styles.loadingContainer}>
                                            <Text style={styles.loadingText}>登录中...</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.loginButtonText}>登录</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* 注册链接 */}
                            <View style={styles.registerLinkContainer}>
                                <Text style={styles.registerLinkText}>还没有账户？</Text>
                                <TouchableOpacity onPress={handleShowRegister}>
                                    <Text style={styles.registerLink}>立即注册</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea', // Android状态栏背景色
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.08, // 响应式水平边距
        paddingVertical: 20,
        minHeight: screenHeight, // 确保最小高度
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: height * 0.06, // 响应式边距
    },
    welcomeTitle: {
        fontSize: width * 0.07, // 响应式字体大小
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        lineHeight: width * 0.08,
    },
    welcomeSubtitle: {
        fontSize: width * 0.04, // 响应式字体大小
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        lineHeight: width * 0.05,
    },
    loginCard: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: isAndroid ? 12 : 10, // Android更高的阴影
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        marginHorizontal: 4, // 防止阴影被裁剪
    },
    cardContent: {
        padding: width * 0.08, // 响应式内边距
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
    },
    loginTitle: {
        fontSize: width * 0.06, // 响应式字体大小
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: height * 0.04, // 响应式边距
        lineHeight: width * 0.07,
    },
    inputContainer: {
        marginBottom: height * 0.025, // 响应式边距
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: width * 0.04, // 响应式内边距
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        height: height * 0.065, // 响应式高度
        elevation: isAndroid ? 2 : 0, // Android轻微阴影
    },
    inputWrapperFocused: {
        borderColor: '#667eea',
        backgroundColor: '#fff',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: isAndroid ? 6 : 5, // Android更高的聚焦阴影
    },
    inputIcon: {
        marginRight: 12,
        alignSelf: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: width * 0.04, // 响应式字体大小
        color: '#333',
        height: height * 0.035, // 响应式高度
        lineHeight: isAndroid ? width * 0.045 : width * 0.04, // Android行高调整
        paddingVertical: 0,
        textAlignVertical: 'center',
        includeFontPadding: false, // Android字体内边距优化
    },
    eyeIcon: {
        padding: 5,
        alignSelf: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.04, // 响应式边距
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#666',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: isAndroid ? 8 : 5, // Android更高的按钮阴影
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginTop: 8, // 防止阴影被裁剪
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonGradient: {
        paddingVertical: height * 0.02, // 响应式内边距
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height * 0.06, // 最小高度确保触摸区域
    },
    loginButtonText: {
        fontSize: width * 0.045, // 响应式字体大小
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: width * 0.05,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: width * 0.04, // 响应式字体大小
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: width * 0.045,
    },
    registerLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    registerLinkText: {
        fontSize: width * 0.035,
        color: '#666',
        marginRight: 5,
    },
    registerLink: {
        fontSize: width * 0.035,
        color: '#667eea',
        fontWeight: '500',
    },
});