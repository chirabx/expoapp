import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RadarChart from './RadarChart';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const IS_TABLET = width > 768;

// 安卓状态栏高度
const STATUS_BAR_HEIGHT = isAndroid ? 24 : 0;

// 学生数据
const mockStudents = [
    {
        id: 1,
        name: '张小明',
        class: '软件工程2024-1班',
        profileTags: ['深度思考者', '自主学习者'],
        radarData: {
            reflection: 85,
            selfDrive: 78,
            collaboration: 65,
            timeManagement: 70,
            basicKnowledge: 88,
            practicalAbility: 82
        },
        riskLevel: '低',
        lastUpdate: '2024-01-15'
    },
    {
        id: 2,
        name: '李小红',
        class: '软件工程2024-1班',
        profileTags: ['社交活跃者', '实践导向'],
        radarData: {
            reflection: 72,
            selfDrive: 85,
            collaboration: 88,
            timeManagement: 68,
            basicKnowledge: 75,
            practicalAbility: 90
        },
        riskLevel: '低',
        lastUpdate: '2024-01-14'
    },

    {
        id: 3,
        name: '王小强',
        class: '计算机科学2024-2班',
        profileTags: ['勤奋努力型', '知识扎实'],
        radarData: {
            reflection: 68,
            selfDrive: 92,
            collaboration: 75,
            timeManagement: 88,
            basicKnowledge: 95,
            practicalAbility: 78
        },
        riskLevel: '低',
        lastUpdate: '2024-01-16'
    },
    {
        id: 4,
        name: '赵小芳',
        class: '计算机科学2024-2班',
        profileTags: ['创意思考者', '自我反思'],
        radarData: {
            reflection: 90,
            selfDrive: 75,
            collaboration: 82,
            timeManagement: 72,
            basicKnowledge: 80,
            practicalAbility: 85
        },
        riskLevel: '低',
        lastUpdate: '2024-01-13'
    },
    {
        id: 5,
        name: '陈小华',
        class: '数据科学2024-1班',
        profileTags: ['需要关注者'],
        radarData: {
            reflection: 55,
            selfDrive: 45,
            collaboration: 42,
            timeManagement: 38,
            basicKnowledge: 62,
            practicalAbility: 48
        },
        riskLevel: '高',
        lastUpdate: '2024-01-12'
    }
];

export default function TeachingToolkit() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentProfile, setShowStudentProfile] = useState(false);

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case '极高': return '#DC2626';
            case '高': return '#EA580C';
            case '中': return '#D97706';
            case '低': return '#059669';
            default: return '#6B7280';
        }
    };

    const getDimensionColor = (value) => {
        if (value >= 85) return '#059669';
        if (value >= 70) return '#3b82f6';
        if (value >= 55) return '#f59e0b';
        return '#ef4444';
    };

    const handleShowProfile = (student) => {
        setSelectedStudent(student);
        setShowStudentProfile(true);
    };

    const renderStudentCard = ({ item: student }) => {
        // 计算综合评分
        const scoreValues = Object.values(student.radarData);
        const averageScore = Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length);

        return (
            <View style={styles.studentCard}>
                {/* 学生头部信息 */}
                <View style={styles.studentHeader}>
                    <View style={styles.studentInfo}>
                        <View style={[styles.avatar, { backgroundColor: getRiskColor(student.riskLevel) }]}>
                            <Ionicons name="person" size={20} color="#fff" />
                        </View>
                        <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.className}>{student.class}</Text>
                            <View style={styles.profileTags}>
                                {student.profileTags.map((tag, index) => (
                                    <View key={index} style={styles.profileTag}>
                                        <Text style={styles.profileTagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    <View style={styles.studentScore}>
                        <Text style={styles.scoreText}>{averageScore}</Text>
                        <Text style={styles.scoreLabel}>综合评分</Text>
                    </View>
                </View>

                {/* 简化的雷达图预览 */}
                <View style={styles.miniRadarPreview}>
                    <Text style={styles.miniRadarTitle}>能力概览</Text>
                    <View style={styles.miniRadar}>
                        {Object.entries(student.radarData).slice(0, 4).map(([key, value], index) => (
                            <View key={key} style={styles.miniRadarItem}>
                                <View style={[
                                    styles.miniRadarBar,
                                    {
                                        width: `${value}%`,
                                        backgroundColor: getDimensionColor(value)
                                    }
                                ]} />
                                <Text style={styles.miniRadarLabel}>
                                    {index === 0 ? '反思' :
                                        index === 1 ? '驱动' :
                                            index === 2 ? '合作' : '实践'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 操作按钮 */}
                <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => handleShowProfile(student)}
                >
                    <Ionicons name="analytics" size={16} color="#667eea" />
                    <Text style={styles.viewProfileButtonText}>查看完整画像</Text>
                </TouchableOpacity>

                <View style={styles.studentFooter}>
                    <Text style={styles.updateTime}>最后更新: {student.lastUpdate}</Text>
                    <View style={styles.riskIndicator}>
                        <View style={[
                            styles.riskDot,
                            { backgroundColor: getRiskColor(student.riskLevel) }
                        ]} />
                        <Text style={styles.riskLevel}>{student.riskLevel}风险</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderStudentProfileModal = () => (
        <Modal
            visible={showStudentProfile}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowStudentProfile(false)}
        >
            <View style={styles.modalContainer}>
                {/* 模态框头部 */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowStudentProfile(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>
                        {selectedStudent?.name || '未知学生'} - 完整画像
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* 学生详细信息 */}
                <ScrollView style={styles.modalContent}>
                    {/* 学生基本信息卡片 */}
                    <View style={styles.studentInfoCard}>
                        <View style={styles.studentInfoHeader}>
                            <View style={[styles.largeAvatar, { backgroundColor: getRiskColor(selectedStudent?.riskLevel || '低') }]}>
                                <Ionicons name="person" size={40} color="#fff" />
                            </View>
                            <View style={styles.studentInfoText}>
                                <Text style={styles.studentNameLarge}>{selectedStudent?.name}</Text>
                                <Text style={styles.classNameLarge}>{selectedStudent?.class}</Text>
                                <View style={styles.largeProfileTags}>
                                    {(selectedStudent?.profileTags || []).map((tag, index) => (
                                        <View key={index} style={styles.largeProfileTag}>
                                            <Text style={styles.largeProfileTagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 雷达图 */}
                    {selectedStudent && (
                        <RadarChart
                            data={selectedStudent.radarData}
                            dimensionNames={{
                                reflection: '反思能力',
                                selfDrive: '自我驱动',
                                collaboration: '合作表现',
                                timeManagement: '时间管理',
                                basicKnowledge: '基础知识',
                                practicalAbility: '实践能力'
                            }}
                        />
                    )}

                    {/* 详细能力分析 */}
                    <View style={styles.detailAnalysis}>
                        <Text style={styles.detailAnalysisTitle}>📊 能力详细分析</Text>
                        {selectedStudent && Object.entries(selectedStudent.radarData).map(([key, value]) => {
                            const dimensionNames = {
                                reflection: '反思能力',
                                selfDrive: '自我驱动',
                                collaboration: '合作表现',
                                timeManagement: '时间管理',
                                basicKnowledge: '基础知识',
                                practicalAbility: '实践能力'
                            };

                            const suggestions = {
                                reflection: value >= 80 ? '反思能力优秀，能够主动总结经验' :
                                    value >= 60 ? '反思能力良好，建议多进行学习反思' : '反思能力需加强，建议定期写学习总结',
                                selfDrive: value >= 80 ? '自我驱动能力强，学习主动性好' :
                                    value >= 60 ? '自我驱动能力良好，建议设定学习目标' : '自我驱动能力需提升，建议增加学习兴趣',
                                collaboration: value >= 80 ? '合作表现优秀，团队协作能力强' :
                                    value >= 60 ? '合作表现良好，建议多参与团队项目' : '合作能力需加强，建议多与同学交流',
                                timeManagement: value >= 80 ? '时间管理出色，能合理分配学习时间' :
                                    value >= 60 ? '时间管理良好，建议制定学习计划' : '时间管理需改进，建议使用时间管理工具',
                                basicKnowledge: value >= 80 ? '基础知识扎实，理论掌握较好' :
                                    value >= 60 ? '基础知识良好，建议巩固薄弱环节' : '基础知识需加强，建议补充基础知识',
                                practicalAbility: value >= 80 ? '实践能力强，动手操作熟练' :
                                    value >= 60 ? '实践能力良好，建议多进行项目实践' : '实践能力需提升，建议多动手练习'
                            };

                            return (
                                <View key={key} style={styles.dimensionCard}>
                                    <View style={styles.dimensionHeader}>
                                        <Text style={styles.dimensionName}>{dimensionNames[key]}</Text>
                                        <View style={styles.dimensionScoreContainer}>
                                            <Text style={[
                                                styles.dimensionScore,
                                                { color: getDimensionColor(value) }
                                            ]}>
                                                {value}
                                            </Text>
                                            <Text style={styles.dimensionUnit}>分</Text>
                                        </View>
                                    </View>

                                    {/* 进度条 */}
                                    <View style={styles.dimensionProgressBar}>
                                        <View style={[
                                            styles.dimensionProgressFill,
                                            {
                                                width: `${value}%`,
                                                backgroundColor: getDimensionColor(value)
                                            }
                                        ]} />
                                    </View>

                                    {/* 建议 */}
                                    <Text style={styles.dimensionSuggestion}>{suggestions[key]}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* 综合建议 */}
                    <View style={styles.comprehensiveAdvice}>
                        <Text style={styles.comprehensiveAdviceTitle}>💡 综合教学建议</Text>
                        <View style={styles.adviceCard}>
                            <Text style={styles.adviceText}>
                                该学生表现出<Text style={styles.highlight}>「自我驱动的思考者」</Text>特征，
                                在基础知识方面表现突出，但在时间管理和合作表现方面仍有提升空间。
                                建议采用项目式教学，结合实际案例来提升实践能力，同时通过小组合作项目锻炼合作技能。
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {isAndroid && <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />}

            {/* 顶部标题区域 */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>因材施教工具箱</Text>
                <Text style={styles.headerSubtitle}>学生能力画像与个性化指导</Text>
            </LinearGradient>

            {/* 功能介绍 */}
            <View style={styles.introSection}>
                <Text style={styles.introTitle}>🎯 智能画像分析</Text>
                <Text style={styles.introText}>
                    通过六个维度：反思能力、自我驱动、合作表现、时间管理、基础知识、实践能力的综合评估，
                    为每位学生生成个性化的发展建议和学习指导方案。
                </Text>
            </View>

            {/* 学生列表区域 */}
            <View style={styles.studentsSection}>
                <Text style={styles.sectionTitle}>选择学生 • 查看完整画像</Text>

                <FlatList
                    data={mockStudents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderStudentCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.studentsList}
                    estimatedItemSize={200}
                />
            </View>

            {/* 操作提示 */}
            <View style={styles.tipsSection}>
                <View style={styles.tipCard}>
                    <Ionicons name="information-circle" size={20} color="#059669" />
                    <Text style={styles.tipText}>
                        点击「查看完整画像」查看学生的多维度能力分析和个性化教学建议。
                    </Text>
                </View>
            </View>

            {/* 学生画像模态框 */}
            {renderStudentProfileModal()}
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
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    introSection: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
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
    studentsSection: {
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    studentsList: {
        paddingBottom: 20,
    },
    studentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    studentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    className: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    profileTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    profileTag: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    profileTagText: {
        fontSize: 12,
        color: '#0369a1',
        fontWeight: '500',
    },
    studentScore: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#667eea',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
    },
    miniRadarPreview: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    miniRadarTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    miniRadar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    miniRadarItem: {
        alignItems: 'center',
        flex: 1,
    },
    miniRadarBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: 4,
        minWidth: 20,
    },
    miniRadarLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#666',
    },
    viewProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 16,
    },
    viewProfileButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    studentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    updateTime: {
        fontSize: 12,
        color: '#999',
    },
    riskIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    riskDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    riskLevel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },
    tipsSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e8',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#059669',
    },
    tipText: {
        fontSize: 14,
        color: '#059669',
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    modalHeader: {
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
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 34,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    studentInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
    },
    studentInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    largeAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    studentInfoText: {
        flex: 1,
    },
    studentNameLarge: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    classNameLarge: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    largeProfileTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    largeProfileTag: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 6,
    },
    largeProfileTagText: {
        fontSize: 14,
        color: '#0369a1',
        fontWeight: '500',
    },
    detailAnalysisTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    detailAnalysis: {
        marginBottom: 20,
    },
    dimensionCard: {
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
    dimensionScoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    dimensionScore: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 4,
    },
    dimensionUnit: {
        fontSize: 14,
        color: '#666',
    },
    dimensionProgressBar: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        marginBottom: 12,
    },
    dimensionProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    dimensionSuggestion: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    comprehensiveAdvice: {
        marginBottom: 40,
    },
    comprehensiveAdviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    adviceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    adviceText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    highlight: {
        color: '#667eea',
        fontWeight: 'bold',
    },
});