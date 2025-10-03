import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const CHART_SIZE = width > 400 ? 280 : 240;
const CHART_CENTER = CHART_SIZE / 2;
const AXIS_LENGTH = (CHART_SIZE / 2) - 40;

export default function RadarChart({
    data = {
        reflection: 85,
        selfDrive: 78,
        collaboration: 72,
        timeManagement: 68,
        basicKnowledge: 88,
        practicalAbility: 80
    },
    dimensionNames = {
        reflection: '反思能力',
        selfDrive: '自我驱动',
        collaboration: '合作表现',
        timeManagement: '时间管理',
        basicKnowledge: '基础知识',
        practicalAbility: '实践能力'
    }
}) {
    // 六个维度的角度计算 - 均匀分布
    const getAngle = (index) => {
        return (Math.PI * 2 / 6 * index) - Math.PI / 2;
    };

    // 获取点的坐标
    const getCoordinates = (angle, radius) => {
        return {
            x: CHART_CENTER + radius * Math.cos(angle),
            y: CHART_CENTER + radius * Math.sin(angle)
        };
    };

    // 获取维度颜色
    const getDimensionColor = (value) => {
        if (value >= 85) return '#059669'; // 绿色
        if (value >= 70) return '#3b82f6'; // 蓝色
        if (value >= 55) return '#f59e0b'; // 橙色
        return '#ef4444'; // 红色
    };

    // 绘制环形网格
    const renderGridRings = () => {
        return [25, 50, 75, 100].map((percentage, ringIndex) => (
            <View
                key={ringIndex}
                style={[
                    styles.gridRing,
                    {
                        width: (percentage / 100) * (AXIS_LENGTH * 2),
                        height: (percentage / 100) * (AXIS_LENGTH * 2),
                        borderRadius: CHART_CENTER,
                        borderColor: ringIndex === 0 ? '#e5e7eb' :
                            ringIndex === 1 ? '#d1d5db' :
                                ringIndex === 2 ? '#9ca3af' : '#6b7280'
                    }
                ]}
            />
        ));
    };

    // 渲染单个维度的轴线和标签
    const renderSingleAxis = (key, index) => {
        const angle = getAngle(index);
        const endPoint = getCoordinates(angle, AXIS_LENGTH + 25); // 标签位置
        const dataRadius = (data[key] / 100) * AXIS_LENGTH;
        const dataPoint = getCoordinates(angle, dataRadius);

        return (
            <React.Fragment key={key}>
                {/* 轴线 */}
                <View
                    style={[
                        styles.axis,
                        {
                            position: 'absolute',
                            left: CHART_CENTER - 1,
                            top: CHART_CENTER - AXIS_LENGTH,
                            width: 2,
                            height: AXIS_LENGTH * 2,
                            transform: [{ rotate: `${(angle * 180) / Math.PI + 90}deg` }]
                        }
                    ]}
                />

                {/* 维度标签 */}
                <View
                    style={[
                        styles.dimensionLabelContainer,
                        {
                            position: 'absolute',
                            left: endPoint.x - 25,
                            top: endPoint.y - 10,
                            width: 50,
                            height: 20,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.dimensionLabel,
                            {
                                fontSize: 12,
                                fontWeight: '600',
                                color: getDimensionColor(data[key]),
                                textAlign: 'center',
                            }
                        ]}
                    >
                        {dimensionNames[key]}
                    </Text>
                </View>

                {/* 数据点 */}
                <View
                    style={[
                        styles.dataPoint,
                        {
                            position: 'absolute',
                            left: dataPoint.x - 6,
                            top: dataPoint.y - 6,
                            backgroundColor: getDimensionColor(data[key]),
                        }
                    ]}
                />

                {/* 数值标签 */}
                <View
                    style={[
                        styles.valueContainer,
                        {
                            position: 'absolute',
                            left: dataPoint.x - 15,
                            top: dataPoint.y - 25,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 8,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.valueText,
                            {
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: getDimensionColor(data[key]),
                                textAlign: 'center',
                            }
                        ]}
                    >
                        {data[key]}
                    </Text>
                </View>
            </React.Fragment>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>学生能力雷达图</Text>

            <View style={styles.chartContainer}>
                {/* 基础网格层 */}
                {renderGridRings()}

                {/* 轴线和数据层 */}
                {Object.keys(data).map((key, index) => renderSingleAxis(key, index))}
            </View>

            {/* 图例 */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>需要改进 (0-54)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.legendText}>良好 (55-69)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                    <Text style={styles.legendText}>优秀 (70-84)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                    <Text style={styles.legendText}>卓越 (85-100)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        minHeight: CHART_SIZE + 120,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    chartContainer: {
        width: CHART_SIZE,
        height: CHART_SIZE,
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gridRing: {
        position: 'absolute',
        borderWidth: 1,
        alignSelf: 'center',
    },
    axis: {
        backgroundColor: '#6b7280',
        opacity: 0.3,
    },
    dimensionLabelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dimensionLabel: {
        textAlign: 'center',
    },
    dataPoint: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    valueContainer: {
        elevation: 2,
    },
    valueText: {
        textAlign: 'center',
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    },
});