import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
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

export default function RecommendationPage({ student, onClose }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // 模拟推荐数据
    const recommendations = {
        teachingMethods: [
            {
                id: 1,
                name: '项目实践型教学',
                description: '基于实际项目案例的动手实践学习',
                suitability: 95,
                reason: '该生的「自我驱动的探究者」画像表明他/她偏好动手实践；同时，协同过滤数据显示，与其次相似的12名学生在此类项目中取得了平均15%的成绩提升。',
                confidence: '高',
                keywords: ['实践', '项目', '动手'],
                resources: ['项目模板库', '案例展示', '评估工具'],
                steps: [
                    '确定适合的项目主题',
                    '提供项目框架和指导',
                    '定期检查进度并提供反馈',
                    '组织项目展示和评估'
                ]
            },
            {
                id: 2,
                name: '自主探究型学习',
                description: '鼓励学生自主发现问题并尝试解决',
                suitability: 88,
                reason: '该学生的画像标签「自我驱动」和「探究者」特征明显，历史数据显示这类学生通过自主探索能提升20%的学习兴趣。',
                confidence: '高',
                keywords: ['自主', '探究', '发现'],
                resources: ['引导问题集', '探究工具', '反思模板'],
                steps: [
                    '设置开放式问题',
                    '提供探究工具和资源',
                    '监督但不干预探索过程',
                    '引导学生总结和反思'
                ]
            }
        ],
        learningResources: [
            {
                id: 3,
                name: '编程思维训练营',
                type: '在线课程',
                duration: '4周',
                difficulty: '中等',
                suitability: 82,
                reason: '根据该学生的技术兴趣和当前编程能力评级，配合「技术探索者」画像特征，推荐此资源的匹配度达82%。同类学生完成率为89%。',
                confidence: '中等',
                keywords: ['编程', '思维训练', '在线'],
                preview: '通过生动案例学习编程核心概念'
            },
            {
                id: 4,
                name: '团队协作项目手册',
                type: '参考材料',
                duration: '持续使用',
                difficulty: '基础',
                suitability: 75,
                reason: '该学生在协作方面评分较低，但具「社交活跃者」潜力。推荐此资源以提升团队协作能力，预计参与度提升25%。',
                confidence: '中等',
                keywords: ['团队', '协作', '手册'],
                preview: '实用的团队合作技巧和方法'
            }
        ],
        assessmentTools: [
            {
                id: 5,
                name: '多元智能评估',
                description: '全面评估学生在不同智能维度的表现',
                suitability: 91,
                reason: '该学生画像显示多维度能力分布不均，需要系统性评估工具来识别强项和弱项。此工具准确率为91%。',
                confidence: '高',
                keywords: ['评估', '多元', '智能'],
                estimatedTime: '30分钟'
            }
        ]
    };

    const categories = [
        { id: 'all', name: '全部推荐', icon: 'grid-outline' },
        { id: 'method', name: '教学方法', icon: 'school-outline' },
        { id: 'resource', name: '学习资源', icon: 'library-outline' },
        { id: 'assessment', name: '评估工具', icon: 'clipboard-outline' }
    ];

    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case '高': return '#059669';
            case '中等': return '#D97706';
            case '低': return '#DC2626';
            default: return '#6B7280';
        }
    };

    const getSuitabilityColor = (score) => {
        if (score >= 90) return '#059669';
        if (score >= 70) return '#D97706';
        return '#DC2626';
    };

    const handleAdoptMethod = (method) => {
        Alert.alert(
            '确认采纳',
            `确定要采纳「${method.name}」教学方案吗？\n\n采纳后系统将为您提供详细的实施方案指南。`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '确认采纳',
                    onPress: () => {
                        Alert.alert('成功', '方案已采纳，可在「我的方案」中查看详细实施指南。');
                    }
                }
            ]
        );
    };

    const handleBookmarkMethod = (method) => {
        Alert.alert('已收藏', `「${method.name}」已添加到您的收藏夹中。`);
    };

    const handlePreviewResource = (resource) => {
        Alert.alert('预览确认', `正在为您预览「${resource.name}」\n\n${resource.preview}`);
    };

    const renderMethodItem = (method) => (
        <View key={method.id} style={styles.methodCard}>
            <View style={styles.methodHeader}>
                <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                <View style={styles.suitabilityBadge}>
                    <Text style={[
                        styles.suitabilityScore,
                        { color: getSuitabilityColor(method.suitability) }
                    ]}>
                        {method.suitability}%
                    </Text>
                    <Text style={styles.suitabilityLabel}>匹配度</Text>
                </View>
            </View>

            {/* 推荐理由 */}
            <View style={styles.reasonSection}>
                <View style={styles.reasonHeader}>
                    <Ionicons name="bulb" size={16} color="#667eea" />
                    <Text style={styles.reasonTitle}>推荐理由</Text>
                    <View style={styles.confidenceBadge}>
                        <Text style={[
                            styles.confidenceText,
                            { color: getConfidenceColor(method.confidence) }
                        ]}>
                            {method.confidence}可信度
                        </Text>
                    </View>
                </View>
                <Text style={styles.reasonText}>{method.reason}</Text>
            </View>

            {/* 关键词标签 */}
            <View style={styles.tagsContainer}>
                {method.keywords.map((keyword, index) => (
                    <View key={index} style={styles.tagItem}>
                        <Text style={styles.tagText}>{keyword}</Text>
                    </View>
                ))}
            </View>

            {/* 相关资源 */}
            <View style={styles.resourcesSection}>
                <Text style={styles.resourcesTitle}>相关资源</Text>
                <View style={styles.resourcesList}>
                    {method.resources.map((resource, index) => (
                        <View key={index} style={styles.resourceItem}>
                            <Ionicons name="checkmark-circle" size={14} color="#059669" />
                            <Text style={styles.resourceText}>{resource}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* 实施步骤 */}
            <View style={styles.stepsSection}>
                <Text style={styles.stepsTitle}>实施步骤</Text>
                {method.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>

            {/* 操作按钮 */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.adoptButton}
                    onPress={() => handleAdoptMethod(method)}
                >
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.adoptButtonText}>采纳方案</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => handleBookmarkMethod(method)}
                >
                    <Ionicons name="bookmark" size={18} color="#667eea" />
                    <Text style={styles.bookmarkButtonText}>收藏</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderResourceItem = (resource) => (
        <View key={resource.id} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
                <View style={styles.resourceInfo}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceType}>{resource.type}</Text>
                </View>
                <View style={styles.resourceMeta}>
                    <View style={styles.resourceDuration}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.resourceDurationText}>{resource.duration}</Text>
                    </View>
                    <View style={styles.resourceDifficulty}>
                        <Text style={styles.resourceDifficultyText}>{resource.difficulty}</Text>
                    </View>
                </View>
            </View>

            {/* 推荐理由 */}
            <View style={styles.reasonSection}>
                <Text style={styles.reasonText}>{resource.reason}</Text>
            </View>

            {/* 操作按钮 */}
            <View style={styles.resourceActions}>
                <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => handlePreviewResource(resource)}
                >
                    <Ionicons name="eye-outline" size={16} color="#667eea" />
                    <Text style={styles.previewButtonText}>预览</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.adoptButton}
                    onPress={() => Alert.alert('成功', '资源已添加到您的收藏中')}
                >
                    <Ionicons name="add-circle" size={16} color="#fff" />
                    <Text style={styles.adoptButtonText}>添加</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFilteredContent = () => {
        switch (selectedCategory) {
            case 'method':
                return recommendations.teachingMethods.map(renderMethodItem);
            case 'resource':
                return recommendations.learningResources.map(renderResourceItem);
            case 'assessment':
                return recommendations.assessmentTools.map((tool) => (
                    <View key={tool.id} style={styles.assessmentCard}>
                        <Text style={styles.assessmentName}>{tool.name}</Text>
                        <Text style={styles.assessmentDescription}>{tool.description}</Text>
                        <Text style={styles.assessmentReason}>{tool.reason}</Text>
                    </View>
                ));
            default:
                return (
                    <View>
                        <Text style={styles.categoryTitle}>💡 推荐教学方法</Text>
                        {recommendations.teachingMethods.map(renderMethodItem)}

                        <Text style={styles.categoryTitle}>📚 推荐学习资源</Text>
                        {recommendations.learningResources.map(renderResourceItem)}
                    </View>
                );
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
                <Text style={styles.headerTitle}>个性化推荐方案</Text>
                <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh" size={20} color="#667eea" />
                </TouchableOpacity>
            </View>

            {/* 学生信息简报 */}
            <View style={styles.studentBriefSection}>
                <Text style={styles.briefTitle}>为 {student?.name || '该学生'} 推荐</Text>
                <Text style={styles.briefDescription}>
                    基于机器学习算法分析的个性化教学方案，让因材施 enseñar 更加精准有效。
                </Text>
            </View>

            {/* 分类筛选 */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryItem,
                            selectedCategory === category.id && styles.categoryItemActive
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Ionicons
                            name={category.icon}
                            size={20}
                            color={selectedCategory === category.id ? '#fff' : '#667eea'}
                        />
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category.id && styles.categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* 推荐内容 */}
            <ScrollView style={styles.contentContainer}>
                {renderFilteredContent()}
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
    refreshButton: {
        padding: 5,
    },
    studentBriefSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    briefTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    briefDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    categoryContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    categoryItemActive: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    categoryText: {
        fontSize: 14,
        color: '#667eea',
        marginLeft: 6,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 20,
    },
    methodCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    methodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    methodDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    suitabilityBadge: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    suitabilityScore: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    suitabilityLabel: {
        fontSize: 12,
        color: '#666',
    },
    reasonSection: {
        backgroundColor: '#f0f9ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    reasonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reasonTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 6,
        flex: 1,
    },
    confidenceBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    confidenceText: {
        fontSize: 12,
        fontWeight: '500',
    },
    reasonText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    tagItem: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 12,
        color: '#0369a1',
    },
    resourcesSection: {
        marginBottom: 16,
    },
    resourcesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    resourcesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 6,
    },
    resourceText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    stepsSection: {
        marginBottom: 16,
    },
    stepsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    stepNumber: {
        width: 24,
        height: 24,
        backgroundColor: '#667eea',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    stepText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    adoptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        justifyContent: 'center',
    },
    adoptButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 6,
    },
    bookmarkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#667eea',
        justifyContent: 'center',
    },
    bookmarkButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#667eea',
        marginLeft: 6,
    },
    resourceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resourceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    resourceInfo: {
        flex: 1,
    },
    resourceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    resourceType: {
        fontSize: 14,
        color: '#666',
    },
    resourceMeta: {
        alignItems: 'flex-end',
    },
    resourceDuration: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    resourceDurationText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    resourceDifficulty: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    resourceDifficultyText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    resourceActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        flex: 1,
        marginRight: 8,
        justifyContent: 'center',
    },
    previewButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#667eea',
        marginLeft: 4,
    },
    assessmentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    assessmentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    assessmentDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    assessmentReason: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});
