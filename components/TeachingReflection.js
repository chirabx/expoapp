import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const IS_TABLET = width > 768;
const STATUS_BAR_HEIGHT = isAndroid ? 24 : 0;

export default function TeachingReflection() {
    const [selectedTab, setSelectedTab] = useState('behavior'); // behavior, effect, fairness

    // 模拟教学行为数据
    const teachingBehaviors = [
        {
            id: 1,
            title: '课堂互动频率',
            description: '与学生的课堂互动次数统计',
            currentValue: 45,
            previousValue: 38,
            unit: '次/周',
            trend: '+18.4%',
            trendType: 'up'
        },
        {
            id: 2,
            title: '课后答疑次数',
            description: '课后为学生解答问题的次数',
            currentValue: 28,
            previousValue: 22,
            unit: '次/周',
            trend: '+27.3%',
            trendType: 'up'
        },
        {
            id: 3,
            title: '个别辅导时长',
            description: '一对一或小组辅导的时间投入',
            currentValue: 12,
            previousValue: 8,
            unit: '小时/周',
            trend: '+50%',
            trendType: 'up'
        },
        {
            id: 4,
            title: '作业反馈及时率',
            description: '作业批改和反馈的速度',
            currentValue: 95,
            previousValue: 89,
            unit: '%',
            trend: '+6.7%',
            trendType: 'up'
        },
        {
            id: 5,
            title: '教学方法多样指数',
            description: '采用不同教学方法的丰富程度',
            currentValue: 7.2,
            previousValue: 6.8,
            unit: '分',
            trend: '+5.9%',
            trendType: 'up'
        }
    ];

    // 模拟因果效应数据
    const causalEffects = [
        {
            id: 1,
            behavior: '课后答疑',
            metric: '学生平均成绩提升',
            effect: '+5.2',
            unit: '分',
            description: '排除学生原有基础等因素后，PSM-DID模型分析显示，您的「课后答疑」行为使学生的平均成绩提升了约5.2分（淨效应）。',
            chartData: {
                labels: ['答疑前', '答疑后'],
                values: [78.5, 83.7],
                colors: ['#EA580C', '#059669']
            }
        },
        {
            id: 2,
            behavior: '个别辅导',
            metric: '低投入学生提升',
            effect: '+8.1',
            unit: '分',
            description: '通过准凖实验设计分析，个别辅导对低投入学生的学习效果最为显著，平均提升了8.1分。',
            chartData: {
                labels: ['无辅导', '有辅导'],
                values: [65.3, 73.4],
                colors: ['#DC2626', '#059669']
            }
        },
        {
            id: 3,
            behavior: '作业及时反馈',
            metric: '学习动机提升',
            effect: '+12.3',
            unit: '%',
            description: '回归分析结果表明，及时的作业反馈显著提高了学生的学习动机，增幅达12.3%。',
            chartData: {
                labels: ['反馈延迟', '及时反馈'],
                values: [72.1, 84.4],
                colors: ['#D97706', '#059669']
            }
        }
    ];

    // 模拟教育公平性数据
    const equityAnalysis = [
        {
            id: 1,
            behavior: '课后答疑',
            groups: [
                { name: '高投入学生', before: 85.2, after: 87.8, effect: '+2.6' },
                { name: '中等投入学生', before: 75.6, after: 81.3, effect: '+5.7' },
                { name: '低投入学生', before: 58.3, after: 68.1, effect: '+9.8' }
            ],
            conclusion: '数据分析显示，「课后答疑」对低投入学生的帮助最大，这表明您的这一举措有效促进了教育公平。'
        },
        {
            id: 2,
            behavior: '个别辅导',
            groups: [
                { name: '男生', before: 72.4, after: 79.6, effect: '+7.2' },
                { name: '女生', before: 73.8, after: 79.9, effect: '+6.1' }
            ],
            conclusion: '性别对比分析显示，个别辅导对男女学生的提升效果基本一致，体现了公平的教育理念。'
        }
    ];

    const getTrendColor = (trendType) => {
        switch (trendType) {
            case 'up': return '#059669';
            case 'down': return '#DC2626';
            default: return '#6B7280';
        }
    };

    const getTrendIcon = (trendType) => {
        switch (trendType) {
            case 'up': return 'trending-up';
            case 'down': return 'trending-down';
            default: return 'remove';
        }
    };

    const renderBehaviorItem = ({ item }) => (
        <View style={styles.behaviorCard}>
            <View style={styles.behaviorHeader}>
                <View style={styles.behaviorIcon}>
                    <Ionicons name="analytics" size={24} color="#667eea" />
                </View>
                <View style={styles.behaviorInfo}>
                    <Text style={styles.behaviorTitle}>{item.title}</Text>
                    <Text style={styles.behaviorDescription}>{item.description}</Text>
                </View>
                <View style={styles.behaviorValue}>
                    <Text style={styles.currentValue}>{item.currentValue}</Text>
                    <Text style={styles.valueUnit}>{item.unit}</Text>
                </View>
            </View>

            <View style={styles.behaviorFooter}>
                <View style={styles.trendInfo}>
                    <Ionicons
                        name={getTrendIcon(item.trendType)}
                        size={16}
                        color={getTrendColor(item.trendType)}
                    />
                    <Text style={[
                        styles.trendText,
                        { color: getTrendColor(item.trendType) }
                    ]}>
                        {item.trend}
                    </Text>
                </View>
                <Text style={styles.previousValue}>上期: {item.previousValue}{item.unit}</Text>
            </View>
        </View>
    );

    const renderEffectItem = ({ item }) => (
        <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
                <Text style={styles.effectBehavior}>{item.behavior}</Text>
                <View style={styles.effectBadge}>
                    <Text style={styles.effectValue}>{item.effect}</Text>
                    <Text style={styles.effectUnit}>{item.unit}</Text>
                </View>
            </View>

            <Text style={styles.effectMetric}>{item.metric}</Text>

            {/* 简化的对比图表 */}
            <View style={styles.chartContainer}>
                <View style={styles.chartLabels}>
                    <Text style={styles.chartLabel}>{item.chartData.labels[0]}</Text>
                    <Text style={styles.chartLabel}>{item.chartData.labels[1]}</Text>
                </View>
                <View style={styles.barsContainer}>
                    <View style={styles.barContainer}>
                        <View style={[
                            styles.bar,
                            {
                                height: (item.chartData.values[0] / 100) * 60,
                                backgroundColor: item.chartData.colors[0]
                            }
                        ]} />
                        <Text style={styles.barValue}>{item.chartData.values[0]}</Text>
                    </View>
                    <View style={styles.barContainer}>
                        <View style={[
                            styles.bar,
                            {
                                height: (item.chartData.values[1] / 100) * 60,
                                backgroundColor: item.chartData.colors[1]
                            }
                        ]} />
                        <Text style={styles.barValue}>{item.chartData.values[1]}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.effectDescription}>{item.description}</Text>
        </View>
    );

    const renderEquityItem = ({ item }) => (
        <View style={styles.equityCard}>
            <Text style={styles.equityBehavior}>{item.behavior} - 教育公平性分析</Text>

            <View style={styles.groupsContainer}>
                {item.groups.map((group, index) => (
                    <View key={index} style={styles.groupItem}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <View style={styles.groupScores}>
                            <Text style={styles.scoreBefore}>{group.before}→{group.after}</Text>
                            <Text style={styles.scoreEffect}>{group.effect}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.conclusionContainer}>
                <Ionicons name="bulb" size={20} color="#059669" />
                <Text style={styles.conclusionText}>{item.conclusion}</Text>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'behavior':
                return (
                    <FlatList
                        data={teachingBehaviors}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderBehaviorItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        style={styles.flexContainer}
                    />
                );
            case 'effect':
                return (
                    <FlatList
                        data={causalEffects}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderEffectItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        style={styles.flexContainer}
                    />
                );
            case 'fairness':
                return (
                    <FlatList
                        data={equityAnalysis}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderEquityItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        style={styles.flexContainer}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {isAndroid && <StatusBar backgroundColor="#4c51bf" barStyle="light-content" />}

            {/* 顶部标题区域 */}
            <LinearGradient
                colors={['#4c51bf', '#667eea']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>我的教学影响力分析</Text>
                <Text style={styles.headerSubtitle}>教学反思与专业成长</Text>
            </LinearGradient>

            {/* 功能介绍 */}
            <View style={styles.introSection}>
                <Text style={styles.introTitle}>📊 科学评估，数据驱动</Text>
                <Text style={styles.introText}>
                    通过量化分析您的教学行为和相关因果效应，让您准确了解教学投入的真实效果，
                    促进教育实践的科学化和专业化发展。
                </Text>
            </View>

            {/* 标签导航 */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabItem, selectedTab === 'behavior' && styles.tabItemActive]}
                    onPress={() => setSelectedTab('behavior')}
                >
                    <Ionicons
                        name="bar-chart-outline"
                        size={18}
                        color={selectedTab === 'behavior' ? '#fff' : '#4c51bf'}
                    />
                    <Text style={[
                        styles.tabText,
                        selectedTab === 'behavior' && styles.tabTextActive
                    ]}>
                        教学行为
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabItem, selectedTab === 'effect' && styles.tabItemActive]}
                    onPress={() => setSelectedTab('effect')}
                >
                    <Ionicons
                        name="trending-up-outline"
                        size={18}
                        color={selectedTab === 'effect' ? '#fff' : '#4c51bf'}
                    />
                    <Text style={[
                        styles.tabText,
                        selectedTab === 'effect' && styles.tabTextActive
                    ]}>
                        因果效应
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabItem, selectedTab === 'fairness' && styles.tabItemActive]}
                    onPress={() => setSelectedTab('fairness')}
                >
                    <Ionicons
                        name="people-outline"
                        size={18}
                        color={selectedTab === 'fairness' ? '#fff' : '#4c51bf'}
                    />
                    <Text style={[
                        styles.tabText,
                        selectedTab === 'fairness' && styles.tabTextActive
                    ]}>
                        教育公平
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 内容区域 */}
            <View style={styles.contentContainer}>
                {renderTabContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: STATUS_BAR_HEIGHT + (isAndroid ? 20 : 40),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    introSection: {
        margin: 20,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        elevation: 2,
        marginBottom: 20,
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginHorizontal: 2,
    },
    tabItemActive: {
        backgroundColor: '#4c51bf',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
        color: '#4c51bf',
    },
    tabTextActive: {
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    flexContainer: {
        flex: 1,
    },
    behaviorCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    behaviorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    behaviorIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#e0f2fe',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    behaviorInfo: {
        flex: 1,
    },
    behaviorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    behaviorDescription: {
        fontSize: 14,
        color: '#666',
    },
    behaviorValue: {
        alignItems: 'center',
    },
    currentValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4c51bf',
    },
    valueUnit: {
        fontSize: 12,
        color: '#666',
    },
    behaviorFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    previousValue: {
        fontSize: 12,
        color: '#666',
    },
    effectCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    effectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    effectBehavior: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    effectBadge: {
        backgroundColor: '#059669',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    effectValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    effectUnit: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 2,
    },
    effectMetric: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    chartContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    chartLabel: {
        fontSize: 12,
        color: '#666',
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 80,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 30,
        borderRadius: 4,
        marginBottom: 8,
    },
    barValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    effectDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    equityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    equityBehavior: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    groupsContainer: {
        marginBottom: 16,
    },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    groupName: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    groupScores: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreBefore: {
        fontSize: 13,
        color: '#666',
        marginRight: 8,
    },
    scoreEffect: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#059669',
    },
    conclusionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#e8f5e8',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#059669',
    },
    conclusionText: {
        flex: 1,
        fontSize: 14,
        color: '#059669',
        marginLeft: 8,
        lineHeight: 20,
    },
});
