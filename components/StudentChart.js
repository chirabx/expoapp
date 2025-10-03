import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function StudentChart({ data, title }) {
    if (!data || Object.keys(data).length === 0) {
        return <View style={styles.chartContainer} />;
    }

    // 数据点
    const indicators = [
        { name: '作业提交率', value: data.homeworkSubmission || 0, color: '#667eea' },
        { name: '课堂参与度', value: data.classParticipation || 0, color: '#059669' },
        { name: '作业成绩', value: data.assignmentScore || 0, color: '#EA580C' },
        { name: '出勤率', value: data.attendanceRate || 0, color: '#DC2626' }
    ];

    // 计算最大高度
    const maxValue = Math.max(...indicators.map(ind => ind.value));
    const chartHeight = 180;

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>
                    {title || '学生关键指标趋势'}
                </Text>
            </View>

            {/* 图表区域 */}
            <View style={styles.chartArea}>
                {/* Y轴标签 */}
                <View style={styles.yAxis}>
                    <Text style={styles.yAxisLabel}>100</Text>
                    <Text style={styles.yAxisLabel}>75</Text>
                    <Text style={styles.yAxisLabel}>50</Text>
                    <Text style={styles.yAxisLabel}>25</Text>
                    <Text style={styles.yAxisLabel}>0</Text>
                </View>

                {/* 柱状图 */}
                <View style={styles.barChart}>
                    <View style={styles.barContainer}>
                        {indicators.map((indicator, index) => {
                            // 确保最小值为1避免除零，并将值限制在100以内
                            const normalizedMax = Math.max(maxValue, 100);
                            const barHeight = (indicator.value / normalizedMax) * 160; // 160是实际图表高度

                            return (
                                <View key={index} style={styles.barWrapper}>
                                    <View style={styles.barColumn}>
                                        {/* 数值标签 */}
                                        <Text style={styles.valueLabel}>{indicator.value}%</Text>

                                        {/* 空白填充区域（从顶部到数据点） */}
                                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                            {/* 柱状条 */}
                                            <View
                                                style={[
                                                    styles.bar,
                                                    {
                                                        height: Math.max(barHeight, 10), // 最小值10像素
                                                        backgroundColor: indicator.color
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                    {/* X轴标签 */}
                                    <Text style={styles.xAxisLabel}>{indicator.name}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* 图例 */}
            <View style={styles.legendContainer}>
                {indicators.map((indicator, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[
                            styles.legendDot,
                            { backgroundColor: indicator.color }
                        ]} />
                        <Text style={styles.legendLabel}>
                            {indicator.name}: {typeof indicator.value === 'number' ? `${indicator.value}%` : indicator.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    chartHeader: {
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    chartArea: {
        flexDirection: 'row',
        height: 200,
        marginBottom: 16,
    },
    yAxis: {
        width: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 8,
        height: 180, // 与图表高度匹配
    },
    yAxisLabel: {
        fontSize: 10,
        color: '#666',
        lineHeight: 36, // 调整行高匹配图表刻度
    },
    barChart: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    barContainer: {
        flexDirection: 'row',
        height: 200,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    barWrapper: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
    },
    barColumn: {
        alignItems: 'center',
        height: 180, // 预留标签空间，包含数值标签
    },
    valueLabel: {
        fontSize: 10,
        color: '#333',
        marginBottom: 4,
        fontWeight: '600',
    },
    bar: {
        width: width * 0.12, // 响应式宽度
        maxWidth: 40,
        minHeight: 8,
        borderRadius: 2,
        backgroundColor: '#667eea',
    },
    xAxisLabel: {
        fontSize: 9,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 12,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '48%',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendLabel: {
        fontSize: 12,
        color: '#666',
    },
});
