import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisitChart from "@/components/admin/VisitChart";
import AdvancedAnalytics from "@/components/admin/AdvancedAnalytics";
import { subDays, format, parseISO } from "date-fns";

interface Stats {
  posts: number;
  projects: number;
  totalVisits: number;
  leads: number;
}

interface ProjectClick {
  title: string;
  count: number;
}

interface VisitData {
  date: string;
  visits: number;
}

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

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectClicks, setProjectClicks] = useState<ProjectClick[]>([]);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);

        const [
          { count: postsCount },
          { count: projectsCount },
          { data: leadsData, count: leadsCount },
          { data: visitsData, count: totalVisitsCount },
          { data: clicksData },
        ] = await Promise.all([
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("id", { count: "exact" }),
          supabase
            .from("page_visits")
            .select("visited_at", { count: "exact" })
            .gte("visited_at", thirtyDaysAgo.toISOString()),
          supabase
            .from("project_clicks")
            .select("*, projects(title)")
            .order("clicked_at", { ascending: false }),
        ]);

        // Process visit data for chart
        const visitsByDay = (visitsData || []).reduce((acc, visit) => {
          const date = format(parseISO(visit.visited_at), "yyyy-MM-dd");
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Array.from({ length: 30 })
          .map((_, i) => {
            const date = subDays(new Date(), i);
            const formattedDate = format(date, "yyyy-MM-dd");
            return {
              date: format(date, "dd/MM"),
              visits: visitsByDay[formattedDate] || 0,
            };
          })
          .reverse();
        setVisitData(chartData);

        // Process project click data
        const clicksByProject = (clicksData || []).reduce<
          Record<string, number>
        >((acc, click) => {
          if (click.projects?.title) {
            const title = click.projects.title;
            acc[title] = (acc[title] || 0) + 1;
          }
          return acc;
        }, {});

        const sortedClicks = Object.entries(clicksByProject)
          .map(([title, count]) => ({ title, count }))
          .sort((a, b) => b.count - a.count);
        setProjectClicks(sortedClicks);

        setStats({
          posts: postsCount ?? 0,
          projects: projectsCount ?? 0,
          totalVisits: totalVisitsCount ?? 0,
          leads: leadsCount ?? 0,
        });

        // Prepare analytics data
        const totalVisits = totalVisitsCount ?? 0;
        const totalLeads = leadsCount ?? 0;
        const conversionRate =
          totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

        setAnalyticsData({
          visitData: chartData.map((item) => ({
            date: item.date,
            visits: item.visits,
            previousPeriod: Math.floor(item.visits * 0.9), // Mock previous period data
          })),
          conversionData: {
            leads: totalLeads,
            visits: totalVisits,
            conversionRate,
            trend: 12.5, // Mock trend data
          },
          popularPosts: [
            { title: "Post Exemplo 1", views: 1250, shares: 45 },
            { title: "Post Exemplo 2", views: 980, shares: 32 },
            { title: "Post Exemplo 3", views: 756, shares: 28 },
          ],
          trafficSources: [
            { name: "Direto", value: 45 },
            { name: "Redes Sociais", value: 30 },
            { name: "Pesquisa Orgânica", value: 15 },
            { name: "Referências", value: 10 },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    loading,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    loading: boolean;
  }) => (
    <Card className="bg-dark-navy/50 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold text-white">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Visitas (30d)"
          value={stats?.totalVisits ?? 0}
          icon={<TrendingUp className="h-4 w-4 text-gray-500" />}
          loading={loading}
        />
        <StatCard
          title="Total de Posts"
          value={stats?.posts ?? 0}
          icon={<FileText className="h-4 w-4 text-gray-500" />}
          loading={loading}
        />
        <StatCard
          title="Total de Projetos"
          value={stats?.projects ?? 0}
          icon={<Briefcase className="h-4 w-4 text-gray-500" />}
          loading={loading}
        />
        <StatCard
          title="Novos Leads"
          value={stats?.leads ?? 0}
          icon={<MessageSquare className="h-4 w-4 text-gray-500" />}
          loading={loading}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5 mb-8">
        <div className="lg:col-span-3">
          {loading ? (
            <Skeleton className="h-[422px] w-full" />
          ) : (
            <VisitChart data={visitData} />
          )}
        </div>
        <div className="lg:col-span-2">
          <Card className="bg-dark-navy/50 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="text-white">
                Projetos Mais Clicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-transparent">
                      <TableHead className="text-white">Projeto</TableHead>
                      <TableHead className="text-right text-white">
                        Cliques
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectClicks.slice(0, 10).map((project) => (
                      <TableRow key={project.title} className="border-gray-700">
                        <TableCell className="font-medium text-gray-300">
                          {project.title}
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          {project.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      {!loading && analyticsData && <AdvancedAnalytics data={analyticsData} />}
    </div>
  );
};

export default Dashboard;
