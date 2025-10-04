import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  Target,
  FileText,
  Briefcase,
  Settings,
  Check,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "lead" | "comment" | "goal" | "post" | "project" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

interface NotificationCenterProps {
  userId: string;
  onClose?: () => void;
  onNotificationRead?: () => void;
}

const NotificationCenter = ({
  userId,
  onClose,
  onNotificationRead,
}: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (filter === "unread") {
        query = query.eq("read", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filter]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );

      onNotificationRead?.();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .in("id", unreadIds);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      onNotificationRead?.();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      onNotificationRead?.();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "lead":
        return <MessageSquare className={iconClass} />;
      case "comment":
        return <MessageSquare className={iconClass} />;
      case "goal":
        return <Target className={iconClass} />;
      case "post":
        return <FileText className={iconClass} />;
      case "project":
        return <Briefcase className={iconClass} />;
      case "system":
        return <Settings className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "lead":
        return "text-blue-400 bg-blue-400/10";
      case "comment":
        return "text-purple-400 bg-purple-400/10";
      case "goal":
        return "text-green-400 bg-green-400/10";
      case "post":
        return "text-yellow-400 bg-yellow-400/10";
      case "project":
        return "text-cyan-400 bg-cyan-400/10";
      case "system":
        return "text-gray-400 bg-gray-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Notificações</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-800 border-gray-700"
              >
                <DropdownMenuItem
                  onClick={() => setFilter("all")}
                  className="text-white hover:bg-gray-700"
                >
                  Todas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilter("unread")}
                  className="text-white hover:bg-gray-700"
                >
                  Não lidas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 hover:bg-gray-800"
              >
                <Check className="h-3 w-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {unreadCount} não {unreadCount === 1 ? "lida" : "lidas"}
          </Badge>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Bell className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-gray-800/50 transition-colors",
                  !notification.read && "bg-blue-500/5"
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={cn(
                          "text-sm font-medium",
                          notification.read ? "text-gray-300" : "text-white"
                        )}
                      >
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          {
                            addSuffix: true,
                            locale: ptBR,
                          }
                        )}
                      </span>

                      <div className="flex items-center gap-1">
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-white"
                            onClick={() => {
                              window.location.href = notification.link!;
                              markAsRead(notification.id);
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-white"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-400"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationCenter;
