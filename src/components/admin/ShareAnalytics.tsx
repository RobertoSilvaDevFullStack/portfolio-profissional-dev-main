import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Linkedin, Instagram, Copy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ShareMetrics {
  total_shares: number;
  linkedin_shares: number;
  instagram_shares: number;
  copy_shares: number;
  recent_shares: Array<{
    platform: string;
    shared_at: string;
    post_title: string;
  }>;
}

interface ShareAnalyticsProps {
  postId?: string;
  showOverall?: boolean;
}

const ShareAnalytics = ({
  postId,
  showOverall = false,
}: ShareAnalyticsProps) => {
  const [metrics, setMetrics] = useState<ShareMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShareMetrics();
  }, [postId]);

  const fetchShareMetrics = async () => {
    setLoading(true);
    try {
      // Aqui você implementaria a busca real das métricas
      // Por enquanto, vou simular dados para demonstração
      const mockMetrics: ShareMetrics = {
        total_shares: 45,
        linkedin_shares: 28,
        instagram_shares: 12,
        copy_shares: 5,
        recent_shares: [
          {
            platform: "linkedin",
            shared_at: new Date().toISOString(),
            post_title: "Como Desenvolver um Gerador de Prompts",
          },
          {
            platform: "instagram",
            shared_at: new Date(Date.now() - 3600000).toISOString(),
            post_title: "Bastidores do Meu Portfólio",
          },
        ],
      };

      // Implementação real seria algo como:
      // const { data, error } = await supabase
      //   .from('share_metrics')
      //   .select('*')
      //   .eq(postId ? 'post_id' : 'id', postId || 'any')
      //   .order('shared_at', { ascending: false });

      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Error fetching share metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin size={16} className="text-blue-500" />;
      case "instagram":
        return <Instagram size={16} className="text-pink-500" />;
      case "copy":
        return <Copy size={16} className="text-gray-400" />;
      default:
        return <Share2 size={16} className="text-gray-400" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn";
      case "instagram":
        return "Instagram";
      case "copy":
        return "Link Copiado";
      default:
        return "Outros";
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp size={20} />
            Carregando métricas...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showOverall && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp size={20} />
              Estatísticas de Compartilhamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-light-cyan">
                  {metrics.total_shares}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {metrics.linkedin_shares}
                </div>
                <div className="text-sm text-gray-400">LinkedIn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {metrics.instagram_shares}
                </div>
                <div className="text-sm text-gray-400">Instagram</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {metrics.copy_shares}
                </div>
                <div className="text-sm text-gray-400">Links</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {metrics.recent_shares.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Compartilhamentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recent_shares.map((share, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(share.platform)}
                    <div>
                      <div className="text-white font-medium">
                        {share.post_title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(share.shared_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    {getPlatformName(share.platform)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShareAnalytics;
