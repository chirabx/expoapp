import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const IS_TABLET = width > 768;

// 安卓状态栏高度
const STATUS_BAR_HEIGHT = isAndroid ? 24 : 0;

export default function DashboardContent({
    onNavigateToWarning,
    onNavigateToToolkit,
    onNavigateToReflection
}) {
    const [scrollY] = useState(new Animated.Value(0));
    const [recommendations] = useState([
        '已为「潜力待挖的适应者」群体生成新的项目实践方案',
        '检测到3名学生学习投入度下降，建议关注',
        '「高效学习者」群体可尝试更具挑战性的学习任务',
        '本周课堂互动数据显示整体参与度提升15%'
    ]);

    // 模拟数据
    const todayFocus = {
        highRisk: 2,
        mediumRisk: 5,
        students: [
            { name: '张小明', risk: '极高', reason: '连续3天未提交作业' },
            { name: '李小红', risk: '高', reason: '课堂参与度急剧下降' }
        ]
    };

    const myClasses = [
        {
            id: 1,
            name: '软件工程2024-1班',
            students: 45,
            healthScore: 85,
            warningCount: 3
        },
        {
            id: 2,
            name: '计算机科学2024-2班',
            students: 42,
            healthScore: 92,
            warningCount: 1
        },
        {
            id: 3,
            name: '数据科学2024-1班',
            students: 38,
            healthScore: 78,
            warningCount: 5
        }
    ];

    const reflection = {
        title: '上週的「课后答疑」效果分析',
        impact: '对低投入学生的学业提升有显著正向影响',
        improvement: '+23%',
        detail: '参与课后答疑的学生作业完成率提升了23%'
    };

    const getHealthColor = (score) => {
        if (score >= 90) return '#4CAF50';
        if (score >= 75) return '#FF9800';
        return '#F44336';
    };

    const handleTodayFocusPress = () => {
        if (onNavigateToWarning) {
            onNavigateToWarning();
        }
    };

    const handleClassPress = (classItem) => {
        Alert.alert('班级详情', `查看${classItem.name}的详细信息`);
    };

    const handleRecommendationPress = () => {
        if (onNavigateToToolkit) {
            onNavigateToToolkit();
        }
    };

    const handleReflectionPress = () => {
        if (onNavigateToReflection) {
            onNavigateToReflection();
        }
    };

    return (
        <View style={styles.container}>
            {/* 安卓专用状态栏样式 */}
            {isAndroid && <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />}

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* 今日关注卡片 */}
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.focusCard}
                        onPress={handleTodayFocusPress}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#FF6B6B', '#FF8E53']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.focusCardGradient}
                        >
                            <View style={styles.focusHeader}>
                                <View style={styles.focusTitle}>
                                    <Ionicons name="warning" size={24} color="#fff" />
                                    <Text style={styles.focusCardTitle}>今日关注</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#fff" />
                            </View>

                            <View style={styles.focusStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{todayFocus.highRisk}</Text>
                                    <Text style={styles.statLabel}>极高风险</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{todayFocus.mediumRisk}</Text>
                                    <Text style={styles.statLabel}>高风险</Text>
                                </View>
                            </View>

                            <View style={styles.focusStudents}>
                                {todayFocus.students.map((student, index) => (
                                    <View key={index} style={styles.studentItem}>
                                        <View style={styles.studentInfo}>
                                            <Text style={styles.studentName}>{student.name}</Text>
                                            <Text style={styles.studentReason}>{student.reason}</Text>
                                        </View>
                                        <View style={[
                                            styles.riskBadge,
                                            student.risk === '极高' ? styles.riskExtreme : styles.riskHigh
                                        ]}>
                                            <Text style={styles.riskText}>{student.risk}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* 我的班级卡片 */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>我的班级</Text>
                    <View style={styles.classGrid}>
                        {myClasses.map((classItem) => (
                            <TouchableOpacity
                                key={classItem.id}
                                style={styles.classCard}
                                onPress={() => handleClassPress(classItem)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.classHeader}>
                                    <Text style={styles.className} numberOfLines={2}>
                                        {classItem.name}
                                    </Text>
                                    <View style={[
                                        styles.healthIndicator,
                                        { backgroundColor: getHealthColor(classItem.healthScore) }
                                    ]}>
                                        <Text style={styles.healthScore}>
                                            {classItem.healthScore}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.classStats}>
                                    <View style={styles.classStatItem}>
                                        <Ionicons name="people-outline" size={16} color="#666" />
                                        <Text style={styles.classStatText}>
                                            {classItem.students}人
                                        </Text>
                                    </View>
                                    <View style={styles.classStatItem}>
                                        <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
                                        <Text style={styles.classStatText}>
                                            {classItem.warningCount}预警
                                        </Text>
                                    </View>
                                </View>

                                {/* 健康度进度条 */}
                                <View style={styles.healthBar}>
                                    <View style={styles.healthBarBg}>
                                        <View style={[
                                            styles.healthBarFill,
                                            {
                                                width: `${classItem.healthScore}%`,
                                                backgroundColor: getHealthColor(classItem.healthScore)
                                            }
                                        ]} />
                                    </View>
                                    <Text style={styles.healthLabel}>班级健康度</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 智能推荐速览 */}
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={handleRecommendationPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>智能推荐速览</Text>
                        <Ionicons name="chevron-forward" size={20} color="#667eea" />
                    </TouchableOpacity>
                    <View style={styles.recommendationCard}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.recommendationScroll}
                        >
                            {recommendations.map((item, index) => (
                                <View key={index} style={styles.recommendationItem}>
                                    <LinearGradient
                                        colors={['#667eea', '#764ba2']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.recommendationGradient}
                                    >
                                        <Ionicons name="bulb" size={20} color="#fff" />
                                        <Text style={styles.recommendationText}>
                                            {item}
                                        </Text>
                                    </LinearGradient>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* 教学反思角 */}
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={handleReflectionPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>教学反思角</Text>
                        <Ionicons name="chevron-forward" size={20} color="#667eea" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.reflectionCard}
                        onPress={handleReflectionPress}
                        activeOpacity={0.9}
                    >
                        <View style={styles.reflectionHeader}>
                            <Ionicons name="analytics" size={24} color="#667eea" />
                            <Text style={styles.reflectionTitle}>{reflection.title}</Text>
                        </View>

                        <Text style={styles.reflectionImpact}>{reflection.impact}</Text>

                        <View style={styles.reflectionStats}>
                            <View style={styles.improvementBadge}>
                                <Text style={styles.improvementText}>{reflection.improvement}</Text>
                            </View>
                            <Text style={styles.reflectionDetail}>{reflection.detail}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 底部间距 */}
                <View style={styles.bottomPadding} />
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
        // 安卓专用：为状态栏和通知留出额外空间
        paddingTop: STATUS_BAR_HEIGHT + (isAndroid ? 20 : 0),
    },
    cardContainer: {
        paddingHorizontal: IS_TABLET ? 30 : 20,
        marginBottom: IS_TABLET ? 35 : 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    // 今日关注卡片样式
    focusCard: {
        borderRadius: 15,
        overflow: 'hidden',
        elevation: isAndroid ? 8 : 0,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    focusCardGradient: {
        padding: 20,
    },
    focusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    focusTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    focusCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    focusStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 20,
    },
    focusStudents: {
        gap: 10,
    },
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 2,
    },
    studentReason: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    riskExtreme: {
        backgroundColor: '#fff',
    },
    riskHigh: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    riskText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },

    // 班级卡片样式
    classGrid: {
        gap: 15,
    },
    classCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: isAndroid ? 3 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    healthIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    healthScore: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    classStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    classStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classStatText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    healthBar: {
        marginTop: 8,
    },
    healthBarBg: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    healthBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    healthLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        textAlign: 'center',
    },

    // 推荐卡片样式
    recommendationCard: {
        height: 120,
    },
    recommendationScroll: {
        paddingVertical: 10,
    },
    recommendationItem: {
        width: IS_TABLET ? 300 : width * 0.7,
        marginRight: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    recommendationGradient: {
        padding: 16,
        height: 100,
        justifyContent: 'center',
    },
    recommendationText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 8,
        lineHeight: 20,
    },

    // 反思卡片样式
    reflectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: isAndroid ? 3 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reflectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reflectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    reflectionImpact: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 15,
    },
    reflectionStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    improvementBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 12,
    },
    improvementText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    reflectionDetail: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },

    bottomPadding: {
        height: 20,
    },
});
