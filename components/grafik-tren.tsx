'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DataPoint {
  tanggal: string;
  nilai: number;
  sampel: string;
  pokdakan?: string;
}

interface GrafikTrenProps {
  title: string;
  parameterName: string;
  satuan: string;
  nilaiMin?: number | null;
  nilaiMax?: number | null;
  data: DataPoint[];
}

export function GrafikTren({
  title,
  parameterName,
  satuan,
  nilaiMin,
  nilaiMax,
  data,
}: GrafikTrenProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <p className="text-sm font-medium text-muted-foreground">
          Belum ada rekaman data historis untuk grafik tren ini.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Lakukan pengujian kualitas air terlebih dahulu untuk melihat visualisasi tren.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Parameter: <span className="text-foreground font-semibold">{parameterName}</span> ({satuan})
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {nilaiMin !== null && nilaiMin !== undefined && (
            <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 gap-1.5 font-mono text-xs">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Min: {nilaiMin}</span>
            </Badge>
          )}
          {nilaiMax !== null && nilaiMax !== undefined && (
            <Badge variant="outline" className="border-rose-300 text-rose-700 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300 gap-1.5 font-mono text-xs">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Max: {nilaiMax}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="tanggal"
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                domain={['auto', 'auto']}
                unit={` ${satuan}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  color: 'var(--popover-foreground)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: unknown) => {
                  return [`${val} ${satuan}`, parameterName];
                }}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload as DataPoint | undefined;
                  return `${label} ${item?.pokdakan ? `• ${item.pokdakan}` : ''} (${item?.sampel || ''})`;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Ambang Batas Reference Lines */}
              {nilaiMin !== null && nilaiMin !== undefined && (
                <ReferenceLine
                  y={nilaiMin}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: `Batas Min (${nilaiMin})`,
                    fill: '#f59e0b',
                    fontSize: 10,
                    position: 'insideBottomLeft',
                  }}
                />
              )}
              {nilaiMax !== null && nilaiMax !== undefined && (
                <ReferenceLine
                  y={nilaiMax}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Batas Max (${nilaiMax})`,
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
              )}

              <Line
                type="monotone"
                dataKey="nilai"
                name={`${parameterName} (${satuan})`}
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--background)' }}
                activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
