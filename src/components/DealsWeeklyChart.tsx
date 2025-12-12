'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';

export function DealsWeeklyChart() {
  const { Card, EmptyState } = useUi();
  const { data: metrics, loading } = useCrmMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatWeekLabel = (weekDate: string) => {
    const date = new Date(weekDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  if (loading) {
    return null;
  }

  const weeklyData = metrics?.dealsWeekly || [];

  if (weeklyData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Deals Progress (Last 4 Weeks)</h3>
        <EmptyState
          title="No deals data yet"
          description="Create your first deal to see progress here"
        />
      </Card>
    );
  }

  // Prepare chart data with formatted labels
  const chartData = weeklyData.map((item) => ({
    week: formatWeekLabel(item.week),
    count: item.count,
    amount: Number(item.totalAmount),
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Deals Progress (Last 4 Weeks)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'amount') {
                return formatCurrency(value);
              }
              return value;
            }}
            labelFormatter={(label: string) => `Week: ${label}`}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Deals Count"
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            name="Total Amount ($)"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="p-2 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">{item.week}</p>
            <p className="text-lg font-bold">{item.count}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

