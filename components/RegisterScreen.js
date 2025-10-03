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

export default function RegisterScreen({ onBackToLogin }) {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const validateForm = () => {
        if (!username.trim()) {
            Alert.alert('提示', '请输入用户名');
            return false;
        }
        if (username.trim().length < 3) {
            Alert.alert('提示', '用户名至少需要3个字符');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('提示', '请输入密码');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('提示', '密码至少需要6个字符');
            return false;
        }
        if (!confirmPassword.trim()) {
            Alert.alert('提示', '请确认密码');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('提示', '两次输入的密码不一致');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // 调用真实的注册功能
        const result = await register(username.trim(), password);

        setIsLoading(false);

        if (result.success) {
            Alert.alert(
                '注册成功',
                '欢迎加入智能助教系统！',
                [
                    {
                        text: '确定',
                        onPress: () => onBackToLogin && onBackToLogin()
                    }
                ]
            );
        } else {
            Alert.alert('注册失败', result.error || '注册失败，请重试');
        }
    };

    const handleBackToLogin = () => {
        onBackToLogin && onBackToLogin();
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
                    {/* 返回按钮 */}
                    <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* 欢迎标语 */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>加入我们</Text>
                        <Text style={styles.welcomeSubtitle}>创建您的智能助教账户</Text>
                    </View>

                    {/* 注册卡片 */}
                    <View style={styles.registerCard}>
                        <View style={styles.cardContent}>
                            <Text style={styles.registerTitle}>创建新账户</Text>

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
                                        maxLength={20}
                                    />
                                </View>
                                {username.length > 0 && username.length < 3 && (
                                    <Text style={styles.errorText}>用户名至少需要3个字符</Text>
                                )}
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
                                        maxLength={50}
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
                                {password.length > 0 && password.length < 6 && (
                                    <Text style={styles.errorText}>密码至少需要6个字符</Text>
                                )}
                            </View>

                            {/* 确认密码输入框 */}
                            <View style={styles.inputContainer}>
                                <View style={[
                                    styles.inputWrapper,
                                    focusedInput === 'confirmPassword' && styles.inputWrapperFocused
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="请再次输入密码"
                                        placeholderTextColor="#999"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        onFocus={() => setFocusedInput('confirmPassword')}
                                        onBlur={() => setFocusedInput(null)}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        maxLength={50}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {confirmPassword.length > 0 && password !== confirmPassword && (
                                    <Text style={styles.errorText}>两次输入的密码不一致</Text>
                                )}
                            </View>

                            {/* 注册按钮 */}
                            <TouchableOpacity
                                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                                onPress={handleRegister}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.registerButtonGradient}
                                >
                                    {isLoading ? (
                                        <View style={styles.loadingContainer}>
                                            <Text style={styles.loadingText}>注册中...</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.registerButtonText}>注册</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* 返回登录 */}
                            <View style={styles.loginLinkContainer}>
                                <Text style={styles.loginLinkText}>已有账户？</Text>
                                <TouchableOpacity onPress={handleBackToLogin}>
                                    <Text style={styles.loginLink}>立即登录</Text>
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
    backButton: {
        position: 'absolute',
        top: isAndroid ? statusBarHeight + 20 : 50,
        left: width * 0.08,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: height * 0.06, // 响应式边距
        marginTop: height * 0.08, // 为返回按钮留出空间
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
    registerCard: {
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
    registerTitle: {
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
    errorText: {
        fontSize: width * 0.035,
        color: '#e74c3c',
        marginTop: 5,
        marginLeft: 5,
    },
    registerButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: isAndroid ? 8 : 5, // Android更高的按钮阴影
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginTop: height * 0.02,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonGradient: {
        paddingVertical: height * 0.02, // 响应式内边距
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height * 0.06, // 最小高度确保触摸区域
    },
    registerButtonText: {
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
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    loginLinkText: {
        fontSize: width * 0.035,
        color: '#666',
        marginRight: 5,
    },
    loginLink: {
        fontSize: width * 0.035,
        color: '#667eea',
        fontWeight: '500',
    },
});
