import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Users, Eye } from 'lucide-react';

interface AnalyticsData {
  visitData: Array<{ date: string; visits: number; previousPeriod?: number }>;
  conversionData: {
    leads: number;
    visits: number;
    conversionRate: number;
    trend: number;
  };
  popularPosts: Array<{
    title: string;
    views: number;
    shares: number;
  }>;
  trafficSources: Array<{
    name: string;
    value: number;
  }>;
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
}

const COLORS = ['#00C2E8', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];

const AdvancedAnalytics = ({ data }: AdvancedAnalyticsProps) => {
  const [periodComparison, setPeriodComparison] = useState<'7' | '30' | '90'>('30');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatTrend = (trend: number) => {
    const isPositive = trend > 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">Período:</span>
          <Select value={periodComparison} onValueChange={(value: '7' | '30' | '90') => setPeriodComparison(value)}>
            <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Visualização:</span>
          <Select value={chartType} onValueChange={(value: 'line' | 'bar') => setChartType(value)}>
            <SelectTrigger className="w-[120px] bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="bar">Barra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Taxa de Conversão */}
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {data.conversionData.conversionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {data.conversionData.leads} leads / {data.conversionData.visits} visitas
                </p>
              </div>
              {formatTrend(data.conversionData.trend)}
            </div>
          </CardContent>
        </Card>

        {/* Total de Visitas */}
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {data.conversionData.visits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Período selecionado
                </p>
              </div>
              <Eye className="h-8 w-8 text-light-cyan" />
            </div>
          </CardContent>
        </Card>

        {/* Novos Leads */}
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Novos Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {data.conversionData.leads}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Período selecionado
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendências */}
      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tendências de Visitas</CardTitle>
          <p className="text-sm text-gray-400">
            Comparação com período anterior
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart data={data.visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#00C2E8" 
                  strokeWidth={2}
                  name="Período Atual"
                  dot={{ fill: '#00C2E8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {data.visitData[0]?.previousPeriod !== undefined && (
                  <Line 
                    type="monotone" 
                    dataKey="previousPeriod" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Período Anterior"
                    dot={{ fill: '#8B5CF6', r: 4 }}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={data.visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#00C2E8"
                  name="Visitas"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Mais Populares */}
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Posts Mais Populares</CardTitle>
            <p className="text-sm text-gray-400">
              Por visualizações e compartilhamentos
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.popularPosts.map((post, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm truncate">
                      {post.title}
                    </p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-gray-400">
                        <Eye className="inline h-3 w-3 mr-1" />
                        {post.views} views
                      </span>
                      <span className="text-xs text-gray-400">
                        🔗 {post.shares} shares
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-light-cyan">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Origem do Tráfego */}
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Origem do Tráfego</CardTitle>
            <p className="text-sm text-gray-400">
              De onde seus visitantes vêm
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-300">{source.name}</span>
                  <span className="text-sm text-gray-500">({source.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
