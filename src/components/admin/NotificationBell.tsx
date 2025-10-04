import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import NotificationCenter from "./NotificationCenter";
import { useToast } from "@/hooks/use-toast";

interface NotificationBellProps {
  userId: string;
}

const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    setUnreadCount(count || 0);
  };

  useEffect(() => {
    fetchUnreadCount();

    // Configurar realtime subscription para novas notificações
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setUnreadCount((prev) => prev + 1);

          // Mostrar toast para nova notificação
          const notification = payload.new as {
            title: string;
            message: string;
            type: string;
          };

          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });

          // Tocar som de notificação (opcional)
          const audio = new Audio("/notification-sound.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Ignorar erros de áudio (pode não ter permissão)
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-gray-900 border-gray-700"
        align="end"
        sideOffset={8}
      >
        <NotificationCenter
          userId={userId}
          onClose={() => setIsOpen(false)}
          onNotificationRead={fetchUnreadCount}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
