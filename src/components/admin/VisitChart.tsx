import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisitData {
  date: string;
  visits: number;
}

interface VisitChartProps {
  data: VisitData[];
}

const VisitChart = ({ data }: VisitChartProps) => {
  return (
    <Card className="bg-dark-navy/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Visitas nos Últimos 30 Dias</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(136, 136, 136, 0.1)' }}
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
            />
            <Bar dataKey="visits" fill="#00C2E8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VisitChart;