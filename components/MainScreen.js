import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    PanResponder,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DashboardContent from './DashboardContent';
import MenuButton from './MenuButton';
import Sidebar from './Sidebar';
import TeachingReflection from './TeachingReflection';
import TeachingToolkit from './TeachingToolkit';
import WarningCenter from './WarningCenter';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const IS_TABLET = width > 768; // 判断是否为平板/大屏设备

export default function MainScreen() {
    // 在手机上默认收起侧边栏，平板上默认展开
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // 统一初始为false，让动画控制
    const [activeTab, setActiveTab] = useState('dashboard');
    const [overlayOpacity] = useState(new Animated.Value(0));
    const [gestureEnabled, setGestureEnabled] = useState(true);
    const [contentOpacity] = useState(new Animated.Value(1));
    const [contentScale] = useState(new Animated.Value(1));
    const [contentTranslateX] = useState(new Animated.Value(0));

    // 创建带动画效果的Tab切换函数
    const switchTabWithAnimation = (newTab) => {
        if (activeTab === newTab) return;

        // 获取Tab方向（仅用于滑动方向）
        const tabOrder = ['dashboard', 'warning-center', 'teaching-tools', 'reflection'];
        const currentIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(newTab);
        const direction = newIndex > currentIndex ? 1 : -1;

        // 开始滑动和淡化动画
        Animated.parallel([
            Animated.timing(contentOpacity, {
                toValue: 0.4,
                duration: 150,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(contentScale, {
                toValue: 0.96,
                duration: 150,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(contentTranslateX, {
                toValue: direction * 50,
                duration: 150,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start(() => {
            // 切换Tab
            setActiveTab(newTab);

            // 重置位置并从另一方进入
            contentTranslateX.setValue(-direction * 50);

            // 恢复动画
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(contentScale, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(contentTranslateX, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                })
            ]).start();
        });
    };

    // 初始化时设置正确的状态
    useEffect(() => {
        if (IS_TABLET) {
            setSidebarExpanded(true);
        }
    }, []);

    const handleSidebarToggle = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    // 监听侧边栏状态变化，控制遮罩层动画
    useEffect(() => {
        if (!IS_TABLET) {
            Animated.timing(overlayOpacity, {
                toValue: sidebarExpanded ? 1 : 0,
                duration: 350,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: true,
            }).start();
        }
    }, [sidebarExpanded, overlayOpacity]);

    // 创建手势响应器（仅在手机上启用）
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false, // 永远不在开始时拦截
        onStartShouldSetPanResponderCapture: () => false, // 不捕获开始事件
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            if (IS_TABLET || !gestureEnabled) return false;

            const { dx, dy } = gestureState;

            // 更宽松的水平滑动判断
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            // 水平滑动条件：
            // 1. 水平距离至少10像素
            // 2. 水平距离大于垂直距离
            const isHorizontalSwipe = absDx >= 10 && absDx > absDy;

            console.log('Gesture check:', { dx, dy, absDx, absDy, isHorizontalSwipe, gestureEnabled });

            return isHorizontalSwipe;
        },
        onMoveShouldSetPanResponderCapture: () => false, // 不捕获移动事件

        onPanResponderGrant: () => {
            setGestureEnabled(false);
        },

        onPanResponderMove: (evt, gestureState) => {
            // 暂时不添加实时跟随效果，避免复杂性
        },

        onPanResponderRelease: (evt, gestureState) => {
            const { dx, vx } = gestureState;
            const threshold = width * 0.25; // 降低阈值

            // 根据滑动距离和速度判断是否切换侧边栏状态
            if (Math.abs(dx) > threshold || Math.abs(vx) > 0.3) {
                if (dx > 0 && !sidebarExpanded) {
                    // 向右滑动且侧边栏未展开 -> 展开
                    setSidebarExpanded(true);
                } else if (dx < 0 && sidebarExpanded) {
                    // 向左滑动且侧边栏已展开 -> 收起
                    setSidebarExpanded(false);
                }
            }

            // 重新启用手势
            setTimeout(() => setGestureEnabled(true), 200);
        },
    });

    // 手机上点击遮罩层关闭侧边栏
    const handleOverlayPress = () => {
        if (!IS_TABLET && sidebarExpanded) {
            setSidebarExpanded(false);
        }
    };

    const handleTabChange = (tabId) => {
        switchTabWithAnimation(tabId);
    };

    const getTabName = (tabId) => {
        const tabNames = {
            'warning-center': '学情预警中心',
            'teaching-tools': '因材施教工具箱',
            'reflection': '教学反思与成长'
        };
        return tabNames[tabId] || '功能';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <DashboardContent
                        onNavigateToWarning={() => switchTabWithAnimation('warning-center')}
                        onNavigateToToolkit={() => switchTabWithAnimation('teaching-tools')}
                        onNavigateToReflection={() => switchTabWithAnimation('reflection')}
                    />
                );
            case 'warning-center':
                return <WarningCenter />;
            case 'teaching-tools':
                return <TeachingToolkit />;
            case 'reflection':
                return <TeachingReflection />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <View style={styles.container}>
            {isAndroid && <StatusBar backgroundColor="#667eea" barStyle="light-content" />}

            <View style={styles.mainLayout}>
                {/* 主内容区 - 始终占满屏幕 */}
                <Animated.View style={[
                    styles.contentArea,
                    IS_TABLET && {
                        marginLeft: sidebarExpanded ? 280 : 60
                    },
                    {
                        opacity: contentOpacity,
                        transform: [
                            { scale: contentScale },
                            { translateX: contentTranslateX }
                        ]
                    }
                ]}>
                    {renderContent()}
                </Animated.View>

                {/* 手势检测区域 - 仅在屏幕左边缘 */}
                {!IS_TABLET && (
                    <View
                        style={[styles.gestureArea, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]} // 临时显示红色，便于调试
                        {...panResponder.panHandlers}
                    />
                )}

                {/* 手机上的遮罩层 */}
                {!IS_TABLET && (
                    <TouchableWithoutFeedback onPress={handleOverlayPress}>
                        <Animated.View
                            style={[
                                styles.overlay,
                                {
                                    opacity: overlayOpacity,
                                    pointerEvents: sidebarExpanded ? 'auto' : 'none'
                                }
                            ]}
                        />
                    </TouchableWithoutFeedback>
                )}

                {/* 侧边栏 - 始终渲染，通过动画控制显示 */}
                <View style={[
                    styles.sidebarContainer,
                    IS_TABLET ? styles.sidebarTablet : styles.sidebarMobile
                ]}>
                    <Sidebar
                        isExpanded={sidebarExpanded}
                        onToggle={handleSidebarToggle}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </View>

                {/* 汉堡菜单按钮 */}
                <MenuButton
                    onPress={handleSidebarToggle}
                    isExpanded={sidebarExpanded}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    mainLayout: {
        flex: 1,
        position: 'relative',
    },
    contentArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        zIndex: 1, // 确保在最底层
    },
    sidebarContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'box-none', // 允许触摸事件穿透到下层
    },
    sidebarTablet: {
        // 平板上的侧边栏样式 - 不需要额外样式，使用默认
    },
    sidebarMobile: {
        // 手机上的侧边栏样式 - 确保在最上层
        zIndex: 1001,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
    gestureArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 50, // 扩大到50像素，更容易触发
        zIndex: 100, // 高于内容区域，但低于侧边栏和遮罩层
        backgroundColor: 'transparent',
    },
});
