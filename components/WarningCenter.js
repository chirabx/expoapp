import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useStudentData } from '../contexts/StudentDataContext';
import StudentChart from './StudentChart';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const IS_TABLET = width > 768;

// 安卓状态栏高度
const STATUS_BAR_HEIGHT = isAndroid ? 24 : 0;

export default function WarningCenter() {
    const { warningStudents, classes, addNewStudent } = useStudentData();

    const [selectedClassId, setSelectedClassId] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [riskFilter, setRiskFilter] = useState('全部');
    const [showStudentDetail, setShowStudentDetail] = useState(false);
    const [showRiskDropdown, setShowRiskDropdown] = useState(false);

    // 数据导入相关状态
    const [isImporting, setIsImporting] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    // 动画状态
    const [dropdownScaleY] = useState(new Animated.Value(0));
    const [dropdownOpacity] = useState(new Animated.Value(0));
    const [rotationValue] = useState(new Animated.Value(0));

    const riskFilters = ['全部', '极高', '高', '中', '低'];

    // 旋转动画
    useEffect(() => {
        if (isImporting) {
            const startRotation = () => {
                rotationValue.setValue(0);
                Animated.timing(rotationValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start(() => {
                    if (isImporting) {
                        startRotation();
                    }
                });
            };
            startRotation();
        } else {
            rotationValue.stopAnimation();
        }
    }, [isImporting]);

    const rotation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const selectedClass = classes.find(cls => cls.id === selectedClassId);
    const currentStudents = warningStudents[selectedClassId] || [];

    const filteredStudents = riskFilter === '全部'
        ? currentStudents
        : currentStudents.filter(student => student.riskLevel === riskFilter);

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case '极高': return '#DC2626'; // 红色
            case '高': return '#EA580C';   // 橙色
            case '中': return '#D97706';   // 黄色
            case '低': return '#059669';   // 绿色
            default: return '#6B7280';     // 灰色
        }
    };

    const handleStudentPress = (student) => {
        setSelectedStudent(student);
        setShowStudentDetail(true);
    };

    // 数据导入功能 - 文件选择
    const handleImportData = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];

                // 检查文件类型
                const allowedTypes = [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                ];

                if (!allowedTypes.includes(file.mimeType)) {
                    Alert.alert('文件格式错误', '请选择Excel文件（.xlsx或.xls格式）');
                    return;
                }

                setSelectedFile(file);
                setShowImportModal(true);
            }
        } catch (error) {
            console.error('文件选择错误:', error);
            Alert.alert('文件选择失败', '无法访问系统文件，请检查权限设置');
        }
    };

    const simulateDataImport = () => {
        setIsImporting(true);
        setImportProgress(0);

        // 模拟导入进度
        const progressInterval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        // 模拟3秒的导入过程
        setTimeout(() => {
            clearInterval(progressInterval);

            // 创建新学生数据
            const newStudentId = Date.now();
            const newStudentData = {
                warningData: {
                    id: newStudentId,
                    name: '李亮',
                    avatar: '',
                    riskLevel: '中',
                    riskScore: 72,
                    profileTags: ['适应中'],
                    keyIndicators: {
                        homeworkSubmission: 80,
                        classParticipation: 60,
                        assignmentScore: 75,
                        attendanceRate: 90
                    },
                    issues: [
                        '新加入班级，需要适应期',
                        '学习进度正常'
                    ]
                },
                toolkitData: {
                    id: newStudentId,
                    name: '李亮',
                    class: '软件工程2024-1班',
                    profileTags: ['新入学者', '适应中'],
                    radarData: {
                        reflection: 65,
                        selfDrive: 70,
                        collaboration: 68,
                        timeManagement: 72,
                        basicKnowledge: 75,
                        practicalAbility: 70
                    },
                    riskLevel: '中',
                    lastUpdate: new Date().toISOString().split('T')[0]
                }
            };

            // 使用上下文方法添加新学生
            addNewStudent(newStudentData);

            setIsImporting(false);
            setShowImportModal(false);
            setImportProgress(0);
            setSelectedFile(null);

            Alert.alert('导入成功', `Excel文件 "${selectedFile?.name}" 已成功导入到软件工程2024-1班！新学生"李亮"已添加到系统中。`);
        }, 3000);
    };

    const handleViewFullProfile = () => {
        Alert.alert('完整画像', `查看 ${selectedStudent?.name} 的完整学习画像`);
    };

    const handleGetIntervention = () => {
        Alert.alert('干预建议', `为 ${selectedStudent?.name} 生成个性化干预建议`);
    };

    const handleCloseDropdown = () => {
        if (showRiskDropdown) {
            Animated.parallel([
                Animated.timing(dropdownScaleY, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(dropdownOpacity, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowRiskDropdown(false);
            });
        }
    };

    const handleToggleDropdown = () => {
        if (showRiskDropdown) {
            handleCloseDropdown();
        } else {
            setShowRiskDropdown(true);
        }
    };

    // 监听下拉菜单状态变化，执行动画
    useEffect(() => {
        if (showRiskDropdown) {
            Animated.parallel([
                Animated.timing(dropdownScaleY, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(dropdownOpacity, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [showRiskDropdown]);

    const renderStudentCard = ({ item: student }) => (
        <TouchableOpacity
            style={styles.studentCard}
            onPress={() => handleStudentPress(student)}
        >
            <View style={styles.studentHeader}>
                <View style={styles.studentInfo}>
                    <View style={[styles.avatar, { backgroundColor: getRiskColor(student.riskLevel) }]}>
                        <Ionicons name="person" size={20} color="#fff" />
                    </View>
                    <View style={styles.studentDetails}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <View style={styles.profileTags}>
                            {student.profileTags.map((tag, index) => (
                                <View key={index} style={styles.profileTag}>
                                    <Text style={styles.profileTagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.riskIndicator}>
                    <View style={[
                        styles.riskDot,
                        { backgroundColor: getRiskColor(student.riskLevel) }
                    ]} />
                    <Text style={styles.riskText}>{student.riskLevel}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderClassItem = ({ item: classItem }) => (
        <TouchableOpacity
            style={[
                styles.classItem,
                selectedClassId === classItem.id && styles.classItemSelected
            ]}
            onPress={() => setSelectedClassId(classItem.id)}
        >
            <Text style={styles.className}>{classItem.name}</Text>
            <View style={styles.classStats}>
                <Text style={styles.statText}>{classItem.students}人</Text>
                <Text style={styles.statText}>{classItem.warningCount}预警</Text>
            </View>
            <View style={styles.riskBar}>
                {classItem.extremeRisk > 0 && (
                    <View style={[styles.riskSegment, styles.extremeRisk]} />
                )}
                {classItem.highRisk > 0 && (
                    <View style={[styles.riskSegment, styles.highRisk]} />
                )}
                {classItem.mediumRisk > 0 && (
                    <View style={[styles.riskSegment, styles.mediumRisk]} />
                )}
                <View style={[styles.riskSegment, styles.lowRisk]} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* 安卓专用状态栏样式 */}
            {isAndroid && <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />}

            <View style={styles.layout}>
                {/* 左侧班级列表 */}
                <View style={styles.classListContainer}>
                    <View style={styles.classHeader}>
                        <Text style={styles.sectionTitle}>班级列表</Text>
                        <TouchableOpacity
                            style={styles.importButton}
                            onPress={handleImportData}
                        >
                            <Ionicons name="cloud-upload-outline" size={20} color="#667eea" />
                            <Text style={styles.importButtonText}>导入数据</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={classes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderClassItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.classList}
                    />
                </View>

                {/* 右侧学生列表 */}
                <TouchableWithoutFeedback onPress={handleCloseDropdown}>
                    <View style={styles.studentListContainer}>
                        <View style={styles.studentHeader}>
                            <Text style={styles.studentSectionTitle}>
                                {selectedClass?.name} - 学生预警
                            </Text>

                            {/* 风险筛选器下拉菜单 */}
                            <View style={styles.filterContainer}>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={handleToggleDropdown}
                                >
                                    <Text style={styles.dropdownButtonText}>{riskFilter}</Text>
                                    <Animated.View
                                        style={{
                                            transform: [{
                                                rotate: dropdownOpacity.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0deg', '180deg']
                                                })
                                            }]
                                        }}
                                    >
                                        <Ionicons
                                            name="chevron-down"
                                            size={16}
                                            color="#666"
                                        />
                                    </Animated.View>
                                </TouchableOpacity>

                                {/* 下拉菜单选项 - 使用动画 */}
                                <Animated.View
                                    style={[
                                        styles.dropdownMenu,
                                        {
                                            transform: [{ scaleY: dropdownScaleY }],
                                            opacity: dropdownOpacity,
                                            overflow: 'hidden'
                                        }
                                    ]}
                                >
                                    {riskFilters.map((filter) => (
                                        <TouchableOpacity
                                            key={filter}
                                            style={[
                                                styles.dropdownItem,
                                                riskFilter === filter && styles.dropdownItemActive
                                            ]}
                                            onPress={() => {
                                                setRiskFilter(filter);
                                                handleCloseDropdown();
                                            }}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                riskFilter === filter && styles.dropdownItemTextActive
                                            ]}>
                                                {filter}
                                            </Text>
                                            {riskFilter === filter && (
                                                <Ionicons name="checkmark" size={16} color="#667eea" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Animated.View>
                            </View>
                        </View>

                        <FlatList
                            data={filteredStudents}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderStudentCard}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.studentList}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {/* 数据导入模态框 */}
            <Modal
                visible={showImportModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImportModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.importModal}>
                        <Text style={styles.importModalTitle}>数据导入</Text>
                        <Text style={styles.importModalSubtitle}>
                            准备导入Excel文件中的学生数据到软件工程2024-1班
                        </Text>
                        {selectedFile && (
                            <View style={styles.fileInfo}>
                                <Ionicons name="document-outline" size={20} color="#667eea" />
                                <Text style={styles.fileName}>{selectedFile.name}</Text>
                                <Text style={styles.fileSize}>
                                    {(selectedFile.size / 1024).toFixed(0)}KB
                                </Text>
                            </View>
                        )}

                        <View style={styles.importButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setShowImportModal(false);
                                    setSelectedFile(null);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={simulateDataImport}
                            >
                                <Text style={styles.confirmButtonText}>开始导入</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* 导入进度模态框 */}
            <Modal
                visible={isImporting}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.progressModal}>
                        <Animated.View
                            style={[
                                styles.loadingIcon,
                                { transform: [{ rotate: rotation }] }
                            ]}
                        >
                            <Ionicons name="sync" size={40} color="#667eea" />
                        </Animated.View>

                        <Text style={styles.progressTitle}>正在分析Excel文件...</Text>
                        <Text style={styles.progressSubtitle}>
                            系统正在解析Excel表格中的学生数据，请稍候
                        </Text>

                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${importProgress}%` }
                                ]}
                            />
                        </View>

                        <Text style={styles.progressText}>{importProgress}%</Text>
                    </View>
                </View>
            </Modal>

            {/* 学生详情模态框 */}
            <Modal
                visible={showStudentDetail}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowStudentDetail(false)}
            >
                <View style={styles.modalContainer}>
                    {/* 模态框顶部工具栏 */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowStudentDetail(false)}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>学生预警详情</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {selectedStudent && (
                        <ScrollView style={styles.modalContent}>
                            {/* 学生基本信息 */}
                            <View style={styles.studentDetailCard}>
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.studentCardHeader}>
                                        <View style={styles.studentCardAvatar}>
                                            <Ionicons name="person" size={30} color="#fff" />
                                        </View>
                                        <View style={styles.studentCardInfo}>
                                            <Text style={styles.studentCardName}>{selectedStudent.name}</Text>
                                            <View style={styles.studentCardRisk}>
                                                <View style={[
                                                    styles.riskBadge,
                                                    { backgroundColor: getRiskColor(selectedStudent.riskLevel) }
                                                ]}>
                                                    <Text style={styles.riskBadgeText}>{selectedStudent.riskLevel}风险</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>

                            {/* 画像标签 */}
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>学习画像标签</Text>
                                <View style={styles.modalProfileTags}>
                                    {selectedStudent.profileTags.map((tag, index) => (
                                        <View key={index} style={styles.modalProfileTag}>
                                            <Text style={styles.modalProfileTagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* 关键指标图表 */}
                            <StudentChart
                                data={selectedStudent.keyIndicators}
                                title="关键预警指标趋势"
                            />

                            {/* 关键指标详情 */}
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>关键预警指标</Text>
                                <View style={styles.indicatorGrid}>
                                    <View style={styles.indicatorItem}>
                                        <Text style={styles.indicatorLabel}>作业提交率</Text>
                                        <Text style={styles.indicatorValue}>{selectedStudent.keyIndicators.homeworkSubmission}%</Text>
                                    </View>
                                    <View style={styles.indicatorItem}>
                                        <Text style={styles.indicatorLabel}>课堂参与度</Text>
                                        <Text style={styles.indicatorValue}>{selectedStudent.keyIndicators.classParticipation}%</Text>
                                    </View>
                                    <View style={styles.indicatorItem}>
                                        <Text style={styles.indicatorLabel}>作业平均分</Text>
                                        <Text style={styles.indicatorValue}>{selectedStudent.keyIndicators.assignmentScore}</Text>
                                    </View>
                                    <View style={styles.indicatorItem}>
                                        <Text style={styles.indicatorLabel}>出勤率</Text>
                                        <Text style={styles.indicatorValue}>{selectedStudent.keyIndicators.attendanceRate}%</Text>
                                    </View>
                                </View>
                            </View>

                            {/* 问题分析 */}
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>问题分析</Text>
                                <View style={styles.issueList}>
                                    {selectedStudent.issues.map((issue, index) => (
                                        <View key={index} style={styles.issueItem}>
                                            <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                            <Text style={styles.issueText}>{issue}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* 操作按钮 */}
                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleViewFullProfile}
                                >
                                    <Ionicons name="person-circle-outline" size={20} color="#667eea" />
                                    <Text style={styles.actionButtonText}>查看完整画像</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleGetIntervention}
                                >
                                    <Ionicons name="bulb-outline" size={20} color="#059669" />
                                    <Text style={styles.actionButtonText}>获取干预建议</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    layout: {
        flex: 1,
        flexDirection: IS_TABLET ? 'row' : 'column',
        paddingTop: STATUS_BAR_HEIGHT + (isAndroid ? 20 : 0),
    },

    // 班级列表样式
    classListContainer: {
        width: IS_TABLET ? 280 : '100%',
        backgroundColor: '#fff',
        borderRightWidth: IS_TABLET ? 1 : 0,
        borderRightColor: '#e5e7eb',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 40,
    },
    classList: {
        paddingBottom: 20,
    },
    classItem: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f8f9fa',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    classItemSelected: {
        backgroundColor: '#e0f2fe',
        borderColor: '#667eea',
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    classStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
    riskBar: {
        flexDirection: 'row',
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    riskSegment: {
        flex: 1,
    },
    extremeRisk: {
        backgroundColor: '#DC2626',
    },
    highRisk: {
        backgroundColor: '#EA580C',
    },
    mediumRisk: {
        backgroundColor: '#D97706',
    },
    lowRisk: {
        backgroundColor: '#059669',
    },

    // 学生列表样式
    studentListContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    studentHeader: {
        marginBottom: 20,
    },
    studentSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    filterContainer: {
        marginBottom: 10,
        position: 'relative',
        zIndex: 1000, // 确保下拉菜单在其他元素之上
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1001,
        marginTop: 2,
        height: 225, // 固定高度：5个选项 × 45px
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    dropdownItemActive: {
        backgroundColor: '#f8f9fa',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownItemTextActive: {
        color: '#667eea',
        fontWeight: '600',
    },
    studentList: {
        paddingBottom: 20,
    },
    studentCard: {
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
    studentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    profileTags: {
        flexDirection: 'row',
        flexWrap: 'wirap',
    },
    profileTag: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    profileTagText: {
        fontSize: 12,
        color: '#0369a1',
    },
    riskIndicator: {
        alignItems: 'center',
    },
    riskDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 4,
    },
    riskText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },

    // 模态框样式
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
    studentDetailCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
    },
    cardGradient: {
        padding: 20,
    },
    studentCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentCardAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    studentCardInfo: {
        flex: 1,
    },
    studentCardName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    riskBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    riskBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    modalSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    modalProfileTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    modalProfileTag: {
        backgroundColor: '#667eea',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    modalProfileTagText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    indicatorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    indicatorItem: {
        width: '50%',
        paddingVertical: 8,
    },
    indicatorLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    indicatorValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    issueList: {
        marginTop: 8,
    },
    issueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    issueText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    actionButtons: {
        marginTop: 20,
        marginBottom: 40,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    // 导入相关样式
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    importButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#667eea',
    },
    importButtonText: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    importModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: width * 0.8,
        maxWidth: 400,
        alignItems: 'center',
    },
    importModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    importModalSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    fileName: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
        flex: 1,
    },
    fileSize: {
        fontSize: 12,
        color: '#9ca3af',
        marginLeft: 8,
    },
    importButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 80,
    },
    cancelButtonText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 80,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    progressModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        width: width * 0.8,
        maxWidth: 400,
        alignItems: 'center',
    },
    loadingIcon: {
        marginBottom: 20,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    progressSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginBottom: 15,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#667eea',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#667eea',
    },
});
