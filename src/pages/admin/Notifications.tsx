import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MessageSquare, 
  Target, 
  FileText, 
  Briefcase,
  Settings,
  Trash2,
  ExternalLink,
  Check,
  CheckCheck
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Notification {
  id: string;
  type: 'lead' | 'comment' | 'goal' | 'post' | 'project' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  read_at?: string;
  metadata?: Record<string, unknown>;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filter, typeFilter]);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter === 'read') {
        query = query.eq('read', true);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllRead = async () => {
    try {
      const readIds = notifications
        .filter(n => n.read)
        .map(n => n.id);

      if (readIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', readIds);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => !n.read));
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'lead':
        return <MessageSquare className={iconClass} />;
      case 'comment':
        return <MessageSquare className={iconClass} />;
      case 'goal':
        return <Target className={iconClass} />;
      case 'post':
        return <FileText className={iconClass} />;
      case 'project':
        return <Briefcase className={iconClass} />;
      case 'system':
        return <Settings className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'lead':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'comment':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'goal':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'post':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'project':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'system':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notificações</h1>
          <p className="text-gray-400">
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'} · {readCount} {readCount === 1 ? 'lida' : 'lidas'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
          {readCount > 0 && (
            <Button
              onClick={deleteAllRead}
              variant="outline"
              className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir lidas
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-dark-navy/50 border-gray-700 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <Select value={filter} onValueChange={(value: 'all' | 'unread' | 'read') => setFilter(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="unread">Não lidas</SelectItem>
                  <SelectItem value="read">Lidas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="comment">Comentários</SelectItem>
                  <SelectItem value="goal">Metas</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="project">Projetos</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificações */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-dark-navy/50 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma notificação encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={cn(
                "bg-dark-navy/50 border-gray-700 transition-all hover:border-gray-600",
                !notification.read && "border-l-4 border-l-blue-500"
              )}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border",
                    getNotificationColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn(
                            "text-lg font-semibold",
                            notification.read ? "text-gray-300" : "text-white"
                          )}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Nova
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 mb-3">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                          {notification.read_at && (
                            <span>
                              · Lida em {format(new Date(notification.read_at), "dd/MM/yyyy 'às' HH:mm")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {notification.link && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                            onClick={() => {
                              window.location.href = notification.link!;
                              markAsRead(notification.id);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-600 text-gray-400 hover:text-green-400 hover:border-green-500"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-500"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
