import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';

interface ProductivityChartProps {
  period: 'week' | 'month' | 'year';
}

export function ProductivityChart({ period }: ProductivityChartProps) {
  // Mock data for different periods
  const getData = () => {
    switch (period) {
      case 'week':
        return [85, 92, 78, 95, 88, 91, 87];
      case 'month':
        return [82, 85, 88, 91, 87, 89, 92, 88, 85, 90, 93, 89, 91, 88];
      case 'year':
        return [78, 82, 85, 88, 91, 89, 92, 88, 85, 90, 93, 91];
      default:
        return [85, 92, 78, 95, 88, 91, 87];
    }
  };

  const data = getData();
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const average = Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxValue}%</Text>
          <Text style={styles.axisLabel}>{Math.round((maxValue + minValue) / 2)}%</Text>
          <Text style={styles.axisLabel}>{minValue}%</Text>
        </View>
        
        <View style={styles.chartArea}>
          <View style={styles.line}>
            {data.map((value, index) => {
              const height = ((value - minValue) / (maxValue - minValue)) * 100;
              const left = (index / (data.length - 1)) * 100;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.point,
                    {
                      bottom: `${height}%`,
                      left: `${left}%`,
                    }
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <TrendingUp size={16} color="#10B981" />
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryValue}>{average}%</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Trend</Text>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>+5.2%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 16,
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    width: 40,
  },
  axisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  line: {
    flex: 1,
    position: 'relative',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginLeft: -4,
    marginBottom: -4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});