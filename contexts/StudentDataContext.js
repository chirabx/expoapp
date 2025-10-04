import { createContext, useContext, useState } from 'react';

const StudentDataContext = createContext();

export const useStudentData = () => {
    const context = useContext(StudentDataContext);
    if (!context) {
        throw new Error('useStudentData must be used within a StudentDataProvider');
    }
    return context;
};

export const StudentDataProvider = ({ children }) => {
    // 学情预警中心的学生数据
    const [warningStudents, setWarningStudents] = useState({
        1: [
            {
                id: 1,
                name: '张小明',
                avatar: '',
                riskLevel: '极高',
                riskScore: 95,
                profileTags: ['自我驱动的探究者', '潜力待挖的适应者'],
                keyIndicators: {
                    homeworkSubmission: 45,
                    classParticipation: 20,
                    assignmentScore: 65,
                    attendanceRate: 85
                },
                issues: [
                    '连续3天未提交作业',
                    '课堂参与度急剧下降',
                    '最近考试成绩下滑明显'
                ]
            }
        ],
        2: [
            {
                id: 2,
                name: '李小红',
                avatar: '',
                riskLevel: '中',
                riskScore: 68,
                profileTags: ['思维敏捷者', '创意思考者'],
                keyIndicators: {
                    homeworkSubmission: 88,
                    classParticipation: 80,
                    assignmentScore: 85,
                    attendanceRate: 92
                },
                issues: [
                    '最近作业质量略有下降'
                ]
            }
        ],
        3: [
            {
                id: 3,
                name: '王小强',
                avatar: '',
                riskLevel: '高',
                riskScore: 75,
                profileTags: ['自我驱动的探究者', '技术探索者'],
                keyIndicators: {
                    homeworkSubmission: 75,
                    classParticipation: 45,
                    assignmentScore: 70,
                    attendanceRate: 85
                },
                issues: [
                    '最近学习热情明显下降',
                    '与同学交流减少'
                ]
            }
        ]
    });

    // 因材施教工具箱的学生数据
    const [toolkitStudents, setToolkitStudents] = useState([
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
            riskLevel: '极高',
            lastUpdate: '2024-01-15'
        },
        {
            id: 2,
            name: '李小红',
            class: '计算机科学2024-2班',
            profileTags: ['社交活跃者', '实践导向'],
            radarData: {
                reflection: 72,
                selfDrive: 85,
                collaboration: 88,
                timeManagement: 68,
                basicKnowledge: 75,
                practicalAbility: 90
            },
            riskLevel: '中',
            lastUpdate: '2024-01-14'
        },
        {
            id: 3,
            name: '王小强',
            class: '数据科学2024-1班',
            profileTags: ['勤奋努力型', '知识扎实'],
            radarData: {
                reflection: 68,
                selfDrive: 92,
                collaboration: 75,
                timeManagement: 88,
                basicKnowledge: 95,
                practicalAbility: 78
            },
            riskLevel: '高',
            lastUpdate: '2024-01-16'
        }
    ]);

    // 班级数据
    const [classes, setClasses] = useState([
        {
            id: 1,
            name: '软件工程2024-1班',
            students: 1,
            healthScore: 85,
            warningCount: 1,
            mediumRisk: 0,
            highRisk: 0,
            extremeRisk: 1
        },
        {
            id: 2,
            name: '计算机科学2024-2班',
            students: 1,
            healthScore: 92,
            warningCount: 0,
            mediumRisk: 1,
            highRisk: 0,
            extremeRisk: 0
        },
        {
            id: 3,
            name: '数据科学2024-1班',
            students: 1,
            healthScore: 78,
            warningCount: 0,
            mediumRisk: 0,
            highRisk: 1,
            extremeRisk: 0
        }
    ]);

    // 添加新学生到两个系统
    const addNewStudent = (studentData) => {
        // 添加到学情预警中心
        setWarningStudents(prev => ({
            ...prev,
            1: [...prev[1], studentData.warningData]
        }));

        // 添加到因材施教工具箱（放在开头）
        setToolkitStudents(prev => [studentData.toolkitData, ...prev]);

        // 更新班级数据
        setClasses(prev => prev.map(cls => {
            if (cls.id === 1) {
                return {
                    ...cls,
                    students: cls.students + 1,
                    warningCount: cls.warningCount + 1,
                    mediumRisk: cls.mediumRisk + 1
                };
            }
            return cls;
        }));
    };

    const value = {
        warningStudents,
        setWarningStudents,
        toolkitStudents,
        setToolkitStudents,
        classes,
        setClasses,
        addNewStudent
    };

    return (
        <StudentDataContext.Provider value={value}>
            {children}
        </StudentDataContext.Provider>
    );
};
