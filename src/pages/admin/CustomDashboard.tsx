import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  LayoutDashboard,
  TrendingUp,
  FileText,
  Briefcase,
  MessageSquare,
  BarChart3,
  PieChart,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess } from "@/utils/toast";
import VisitChart from "@/components/admin/VisitChart";
import { subDays, format, parseISO } from "date-fns";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Stats {
  posts: number;
  projects: number;
  totalVisits: number;
  leads: number;
}

interface VisitData {
  date: string;
  visits: number;
}

interface WidgetConfig {
  id: string;
  title: string;
  icon: JSX.Element;
  visible: boolean;
}

const CustomDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [layouts, setLayouts] = useState<{ lg: Layout[] }>({ lg: [] });
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "stats-visits", title: "Visitas (30d)", icon: <TrendingUp className="h-4 w-4" />, visible: true },
    { id: "stats-posts", title: "Total de Posts", icon: <FileText className="h-4 w-4" />, visible: true },
    { id: "stats-projects", title: "Total de Projetos", icon: <Briefcase className="h-4 w-4" />, visible: true },
    { id: "stats-leads", title: "Novos Leads", icon: <MessageSquare className="h-4 w-4" />, visible: true },
    { id: "chart-visits", title: "Gráfico de Visitas", icon: <BarChart3 className="h-4 w-4" />, visible: true },
    { id: "chart-distribution", title: "Distribuição", icon: <PieChart className="h-4 w-4" />, visible: true },
  ]);

  useEffect(() => {
    loadDashboardConfig();
    fetchData();
  }, []);

  const loadDashboardConfig = () => {
    const savedLayouts = localStorage.getItem("dashboard-layouts");
    const savedWidgets = localStorage.getItem("dashboard-widgets");

    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    } else {
      setLayouts({
        lg: [
          { i: "stats-visits", x: 0, y: 0, w: 3, h: 2 },
          { i: "stats-posts", x: 3, y: 0, w: 3, h: 2 },
          { i: "stats-projects", x: 6, y: 0, w: 3, h: 2 },
          { i: "stats-leads", x: 9, y: 0, w: 3, h: 2 },
          { i: "chart-visits", x: 0, y: 2, w: 8, h: 4 },
          { i: "chart-distribution", x: 8, y: 2, w: 4, h: 4 },
        ],
      });
    }

    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  };

  const saveDashboardConfig = () => {
    localStorage.setItem("dashboard-layouts", JSON.stringify(layouts));
    localStorage.setItem("dashboard-widgets", JSON.stringify(widgets));
    showSuccess("Configuração salva com sucesso!");
  };

  const resetDashboardConfig = () => {
    localStorage.removeItem("dashboard-layouts");
    localStorage.removeItem("dashboard-widgets");
    loadDashboardConfig();
    setWidgets([
      { id: "stats-visits", title: "Visitas (30d)", icon: <TrendingUp className="h-4 w-4" />, visible: true },
      { id: "stats-posts", title: "Total de Posts", icon: <FileText className="h-4 w-4" />, visible: true },
      { id: "stats-projects", title: "Total de Projetos", icon: <Briefcase className="h-4 w-4" />, visible: true },
      { id: "stats-leads", title: "Novos Leads", icon: <MessageSquare className="h-4 w-4" />, visible: true },
      { id: "chart-visits", title: "Gráfico de Visitas", icon: <BarChart3 className="h-4 w-4" />, visible: true },
      { id: "chart-distribution", title: "Distribuição", icon: <PieChart className="h-4 w-4" />, visible: true },
    ]);
    showSuccess("Dashboard resetado para o padrão!");
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = subDays(new Date(), 30);

      const [
        { count: postsCount },
        { count: projectsCount },
        { count: leadsCount },
        { data: visitsData, count: totalVisitsCount },
      ] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact" }),
        supabase
          .from("page_visits")
          .select("visited_at", { count: "exact" })
          .gte("visited_at", thirtyDaysAgo.toISOString()),
      ]);

      setStats({
        posts: postsCount ?? 0,
        projects: projectsCount ?? 0,
        totalVisits: totalVisitsCount ?? 0,
        leads: leadsCount ?? 0,
      });

      // Processar dados de visitas
      const visitsByDay: Record<string, number> = {};
      visitsData?.forEach((visit) => {
        const day = format(parseISO(visit.visited_at), "yyyy-MM-dd");
        visitsByDay[day] = (visitsByDay[day] || 0) + 1;
      });

      const chartData: VisitData[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, "yyyy-MM-dd");
        chartData.push({
          date: format(date, "dd/MM"),
          visits: visitsByDay[dateStr] || 0,
        });
      }

      setVisitData(chartData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const onLayoutChange = (layout: Layout[], layouts: { lg: Layout[] }) => {
    setLayouts(layouts);
  };

  const renderStatCard = (
    id: string,
    title: string,
    value: number,
    icon: JSX.Element,
    color: string
  ) => (
    <Card key={id} className="bg-dark-navy/50 border-gray-700 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <div className={color}>{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold text-white">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  const renderWidget = (widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget || !widget.visible) return null;

    switch (widgetId) {
      case "stats-visits":
        return renderStatCard(
          widgetId,
          "Visitas (30d)",
          stats?.totalVisits ?? 0,
          <TrendingUp className="h-4 w-4" />,
          "text-blue-400"
        );
      case "stats-posts":
        return renderStatCard(
          widgetId,
          "Total de Posts",
          stats?.posts ?? 0,
          <FileText className="h-4 w-4" />,
          "text-purple-400"
        );
      case "stats-projects":
        return renderStatCard(
          widgetId,
          "Total de Projetos",
          stats?.projects ?? 0,
          <Briefcase className="h-4 w-4" />,
          "text-green-400"
        );
      case "stats-leads":
        return renderStatCard(
          widgetId,
          "Novos Leads",
          stats?.leads ?? 0,
          <MessageSquare className="h-4 w-4" />,
          "text-yellow-400"
        );
      case "chart-visits":
        return (
          <Card key={widgetId} className="bg-dark-navy/50 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="text-white">Visitas dos Últimos 30 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <VisitChart data={visitData} />
              )}
            </CardContent>
          </Card>
        );
      case "chart-distribution":
        return (
          <Card key={widgetId} className="bg-dark-navy/50 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="text-white">Distribuição de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {loading ? (
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
              ) : (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-400">Posts</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
                      {stats?.posts ?? 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-400">Projetos</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-300">
                      {stats?.projects ?? 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-400">Leads</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300">
                      {stats?.leads ?? 0}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Dashboard Customizável
          </h1>
          <p className="text-gray-400">
            Arraste e organize os widgets como preferir
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={resetDashboardConfig}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
          <Button
            onClick={saveDashboardConfig}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Layout
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurar Widgets
          </Button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
      >
        {widgets
          .filter((w) => w.visible)
          .map((widget) => (
            <div key={widget.id} className="relative group">
              <div className="drag-handle absolute top-2 right-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-gray-700 rounded p-1">
                  <svg
                    className="h-4 w-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                  </svg>
                </div>
              </div>
              {renderWidget(widget.id)}
            </div>
          ))}
      </ResponsiveGridLayout>

      {/* Dialog de configuração */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Configurar Widgets</DialogTitle>
            <DialogDescription className="text-gray-400">
              Escolha quais widgets deseja exibir no dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">{widget.icon}</div>
                  <span className="text-white">{widget.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {widget.visible ? (
                    <Eye className="h-4 w-4 text-green-400" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  )}
                  <Checkbox
                    checked={widget.visible}
                    onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                saveDashboardConfig();
                setShowSettings(false);
              }}
              className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
            >
              Salvar Configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top, width, height;
        }

        .react-grid-item.cssTransforms {
          transition-property: transform, width, height;
        }

        .react-grid-item.resizing {
          transition: none;
          z-index: 100;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 100;
          opacity: 0.8;
        }

        .react-grid-item.dropping {
          visibility: hidden;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgba(96, 213, 240, 0.2);
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          border-radius: 0.5rem;
          border: 2px dashed #60d5f0;
        }

        .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
        }

        .react-resizable-handle-se {
          bottom: 0;
          right: 0;
          cursor: se-resize;
        }

        .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid rgba(255, 255, 255, 0.4);
          border-bottom: 2px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default CustomDashboard;
