import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
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
const STATUS_BAR_HEIGHT = isAndroid ? 24 : 0;

export default function StudentProfile({ student, onClose }) {
    const [currentTab, setCurrentTab] = useState('overview');

    // 模拟学生画像数据
    const profileData = {
        overview: {
            name: student?.name || '未知学生',
            class: student?.class || '未知班级',
            overallScore: student?.overallScore || 0,
            riskLevel: student?.riskLevel || '低',
            lastUpdate: student?.lastUpdate || '未知'
        },
        dimensions: {
            academic: { score: 78, description: '学术能力', trend: '+5%' },
            social: { score: 65, description: '社交互动', trend: '-2%' },
            creativity: { score: 82, description: '创新思维', trend: '+8%' },
            collaboration: { score: 71, description: '团队协作', trend: '+3%' },
            learningStyle: { score: 85, description: '学习风格', trend: '+12%' },
            motivation: { score: 68, description: '学习动机', trend: '-1%' }
        },
        algorithmInfo: {
            clusterType: 'K-Means聚类',
            additionalAlgorithms: ['GMM高斯混合模型', '层次聚类算法', 'DBSCAN密度聚类'],
            confidenceScore: 0.87,
            dataPoints: 2456,
            lastRetrained: '2024-01-10'
        }
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case '极高': return '#DC2626';
            case '高': return '#EA580C';
            case '中': return '#D97706';
            case '低': return '#059669';
            default: return '#6B7280';
        }
    };

    const getTabItem = (tabId, title) => (
        <TouchableOpacity
            key={tabId}
            style={[styles.tabItem, currentTab === tabId && styles.tabItemActive]}
            onPress={() => setCurrentTab(tabId)}
        >
            <Text style={[
                styles.tabText,
                currentTab === tabId && styles.tabTextActive
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    const renderDimensionBar = (dimension, key) => (
        <View key={key} style={styles.dimensionItem}>
            <View style={styles.dimensionHeader}>
                <Text style={styles.dimensionName}>{dimension.description}</Text>
                <View style={styles.dimensionStats}>
                    <Text style={styles.dimensionScore}>{dimension.score}</Text>
                    <Text style={[
                        styles.dimensionTrend,
                        { color: dimension.trend.startsWith('+') ? '#059669' : '#DC2626' }
                    ]}>
                        {dimension.trend}
                    </Text>
                </View>
            </View>

            {/* 进度条 */}
            <View style={styles.progressBar}>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={[
                            dimension.score >= 80 ? '#059669' :
                                dimension.score >= 60 ? '#D97706' : '#DC2626'
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.progressBarFill,
                            { width: `${dimension.score}%` }
                        ]}
                    />
                </View>
            </View>
        </View>
    );

    const renderSpiderChart = () => (
        <View style={styles.spiderChartContainer}>
            <Text style={styles.spiderChartTitle}>多维度画像雷达图</Text>
            <View style={styles.spiderChartPlaceholder}>
                <Ionicons name="analytics" size={48} color="#667eea" />
                <Text style={styles.spiderChartText}>雷达图可视化</Text>
                <Text style={styles.spiderChartSubtext}>
                    展示学生6个维度的能力分布
                </Text>
            </View>
        </View>
    );

    const renderAlgorithmTransparency = () => (
        <View style={styles.algorithmSection}>
            <Text style={styles.sectionTitle}>🤖 算法透明化</Text>
            <View style={styles.algorithmCard}>
                <View style={styles.algorithmHeader}>
                    <Ionicons name="code-slash" size={20} color="#667eea" />
                    <Text style={styles.algorithmMainTitle}>主要算法: {profileData.algorithmInfo.clusterType}</Text>
                </View>

                <Text style={styles.algorithmDescription}>
                    该学生画像通过多种机器学习算法综合生成，确保分析的准确性和可靠性。
                </Text>

                <View style={styles.additionalAlgorithms}>
                    <Text style={styles.additionalTitle}>辅助算法:</Text>
                    {profileData.algorithmInfo.additionalAlgorithms.map((algorithm, index) => (
                        <View key={index} style={styles.algorithmItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#059669" />
                            <Text style={styles.algorithmItemText}>{algorithm}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.algorithmStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>算法置信度</Text>
                        <Text style={styles.statValue}>{Math.round(profileData.algorithmInfo.confidenceScore * 100)}%</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>数据点数量</Text>
                        <Text style={styles.statValue}>{profileData.algorithmInfo.dataPoints.toLocaleString()}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>最后训练</Text>
                        <Text style={styles.statValue}>{profileData.algorithmInfo.lastRetrained}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (currentTab) {
            case 'overview':
                return (
                    <View style={styles.tabContent}>
                        {/* 学生基本信息 */}
                        <View style={styles.studentInfoCard}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.studentInfoGradient}
                            >
                                <View style={styles.studentInfoHeader}>
                                    <View style={styles.studentAvatar}>
                                        <Ionicons name="person" size={30} color="#fff" />
                                    </View>
                                    <View style={styles.studentInfoText}>
                                        <Text style={styles.studentName}>{profileData.overview.name}</Text>
                                        <Text style={styles.studentClass}>{profileData.overview.class}</Text>
                                        <Text style={styles.studentUpdate}>
                                            最后更新: {profileData.overview.lastUpdate}
                                        </Text>
                                    </View>
                                    <View style={styles.studentScoreBadge}>
                                        <Text style={styles.studentScore}>{profileData.overview.overallScore}</Text>
                                        <Text style={styles.studentScoreLabel}>综合分</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* 画像素描 */}
                        <View style={styles.plotSection}>
                            <Text style={styles.sectionTitle}>📊 学生画像素描</Text>
                            <View style={styles.plotCard}>
                                <Text style={styles.plotText}>
                                    该学生表现出<Text style={styles.plotHighlight}>「自我驱动的探究者」</Text>特征，
                                    在学术能力和创新思维方面表现突出，但社交互动和学习动机需要更多关注。
                                    通过项目式学习和个性化辅导可以有效提升学习效果。
                                </Text>
                            </View>
                        </View>

                        {/* 画像标签 */}
                        <View style={styles.tagsSection}>
                            <Text style={styles.sectionTitle}>🏷️ 画像标签</Text>
                            <View style={styles.tagsContainer}>
                                {(student?.profileTags || []).map((tag, index) => (
                                    <View key={index} style={styles.tagItem}>
                                        <Ionicons name="bookmark" size={14} color="#667eea" />
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* 算法透明化 */}
                        {renderAlgorithmTransparency()}
                    </View>
                );

            case 'analysis':
                return (
                    <View style={styles.tabContent}>
                        {/* 雷达图 */}
                        {renderSpiderChart()}

                        {/* 维度分析 */}
                        <View style={styles.dimensionsSection}>
                            <Text style={styles.sectionTitle}>📈 多维度分析</Text>
                            {Object.entries(profileData.dimensions).map(([key, dimension]) =>
                                renderDimensionBar(dimension, key)
                            )}
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {isAndroid && <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />}

            {/* 顶部工具栏 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>学生完整画像</Text>
                <View style={styles.placeholder} />
            </View>

            {/* 标签导航 */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {getTabItem('overview', '总览')}
                    {getTabItem('analysis', '分析')}
                    {getTabItem('recommendations', '建议')}
                </ScrollView>
            </View>

            {/* 内容区域 */}
            <ScrollView style={styles.contentContainer}>
                {renderTabContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#fff',
        paddingTop: STATUS_BAR_HEIGHT + (isAndroid ? 10 : 25),
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 34,
    },
    tabsContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    tabItem: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemActive: {
        backgroundColor: '#667eea',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    tabContent: {
        paddingBottom: 40,
    },
    studentInfoCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
    },
    studentInfoGradient: {
        padding: 20,
    },
    studentInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    studentInfoText: {
        flex: 1,
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    studentClass: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    studentUpdate: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    studentScoreBadge: {
        alignItems: 'center',
    },
    studentScore: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    studentScoreLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    plotSection: {
        marginBottom: 20,
    },
    plotCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    plotText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    plotHighlight: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    tagsSection: {
        marginBottom: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#0369a1',
        fontWeight: '500',
        marginLeft: 6,
    },
    algorithmSection: {
        marginBottom: 20,
    },
    algorithmCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    algorithmHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    algorithmMainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    algorithmDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 15,
    },
    additionalAlgorithms: {
        marginBottom: 15,
    },
    additionalTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    algorithmItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    algorithmItemText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    algorithmStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 15,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    spiderChartContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        alignItems: 'center',
    },
    spiderChartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    spiderChartPlaceholder: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    spiderChartText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#667eea',
        marginTop: 12,
        marginBottom: 8,
    },
    spiderChartSubtext: {
        fontSize: 14,
        color: '#666',
    },
    dimensionsSection: {
        marginBottom: 20,
    },
    dimensionItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    dimensionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dimensionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dimensionStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dimensionScore: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginRight: 8,
    },
    dimensionTrend: {
        fontSize: 14,
        fontWeight: '500',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarBg: {
        height: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
