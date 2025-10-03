import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const statusBarHeight = StatusBar.currentHeight || 0;

// 根据屏幕尺寸动态调整侧边栏宽度
const SIDEBAR_WIDTH = width > 768 ? 280 : width * 0.85; // 平板用固定宽度，手机用比例
const SIDEBAR_COLLAPSED_WIDTH = 60; // 收起时的宽度
const IS_TABLET = width > 768; // 判断是否为平板/大屏设备

export default function Sidebar({ isExpanded, onToggle, activeTab, onTabChange }) {
    const { user, logout } = useAuth();
    const [animatedWidth] = useState(new Animated.Value(IS_TABLET && isExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH));
    const [slideAnimation] = useState(new Animated.Value(!IS_TABLET && isExpanded ? 0 : -SIDEBAR_WIDTH));

    const menuItems = [
        {
            id: 'dashboard',
            title: '首页',
            icon: 'home-outline',
            activeIcon: 'home',
        },
        {
            id: 'warning-center',
            title: '学情预警中心',
            icon: 'warning-outline',
            activeIcon: 'warning',
        },
        {
            id: 'teaching-tools',
            title: '因材施教工具箱',
            icon: 'construct-outline',
            activeIcon: 'construct',
        },
        {
            id: 'reflection',
            title: '教学反思与成长',
            icon: 'bulb-outline',
            activeIcon: 'bulb',
        },
    ];

    // 监听外部状态变化，同步动画
    useEffect(() => {
        if (IS_TABLET) {
            // 平板模式：宽度动画
            const toValue = isExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

            Animated.timing(animatedWidth, {
                toValue,
                duration: 350,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: false,
            }).start();
        } else {
            // 手机模式：滑动动画
            const toValue = isExpanded ? 0 : -SIDEBAR_WIDTH;

            Animated.timing(slideAnimation, {
                toValue,
                duration: 350,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: true,
            }).start();
        }
    }, [isExpanded, animatedWidth, slideAnimation]);

    // 切换侧边栏状态
    const toggleSidebar = () => {
        onToggle();
    };

    const handleMenuPress = (item) => {
        onTabChange(item.id);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Animated.View style={[
            styles.sidebar,
            IS_TABLET
                ? { width: animatedWidth }
                : {
                    width: SIDEBAR_WIDTH,
                    transform: [{ translateX: slideAnimation }]
                }
        ]}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.sidebarGradient}
            >
                {/* 顶部用户信息区 */}
                <View style={styles.userSection}>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={toggleSidebar}
                    >
                        <Ionicons
                            name={isExpanded ? "chevron-back-outline" : "chevron-forward-outline"}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    {isExpanded && (
                        <View style={styles.userInfo}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={24} color="#667eea" />
                            </View>
                            <Text style={styles.username} numberOfLines={1}>
                                {user?.username || '教师'}
                            </Text>
                            <Text style={styles.role}>智能助教系统</Text>
                        </View>
                    )}
                </View>

                {/* 导航菜单 */}
                <View style={styles.menuSection}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                activeTab === item.id && styles.menuItemActive,
                                !isExpanded && styles.menuItemCollapsed
                            ]}
                            onPress={() => handleMenuPress(item)}
                        >
                            <Ionicons
                                name={activeTab === item.id ? item.activeIcon : item.icon}
                                size={24}
                                color={activeTab === item.id ? '#667eea' : '#fff'}
                            />
                            {isExpanded && (
                                <Text style={[
                                    styles.menuText,
                                    activeTab === item.id && styles.menuTextActive
                                ]}>
                                    {item.title}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 底部登出按钮 */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[styles.logoutButton, !isExpanded && styles.logoutButtonCollapsed]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                        {isExpanded && (
                            <Text style={styles.logoutText}>登出</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        height: '100%',
        elevation: isAndroid ? 10 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 1000,
    },
    sidebarGradient: {
        flex: 1,
        paddingTop: isAndroid ? statusBarHeight : 40,
    },
    userSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
    },
    toggleButton: {
        alignSelf: 'flex-end',
        padding: 5,
        marginBottom: 15,
    },
    userInfo: {
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    role: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    menuSection: {
        flex: 1,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginBottom: 5,
        borderRadius: 10,
    },
    menuItemActive: {
        backgroundColor: '#fff',
    },
    menuItemCollapsed: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 15,
        flex: 1,
    },
    menuTextActive: {
        color: '#667eea',
        fontWeight: '500',
    },
    bottomSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    logoutButtonCollapsed: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    logoutText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 15,
    },
});
