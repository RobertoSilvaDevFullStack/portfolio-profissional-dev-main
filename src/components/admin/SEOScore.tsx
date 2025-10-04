import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SEOAnalysis {
  score: number;
  issues: {
    type: 'success' | 'warning' | 'error';
    message: string;
  }[];
}

interface SEOScoreProps {
  title: string;
  description: string;
  slug: string;
  content: string;
}

const SEOScore = ({ title, description, slug, content }: SEOScoreProps) => {
  const analyzeSEO = (): SEOAnalysis => {
    const issues: SEOAnalysis['issues'] = [];
    let score = 100;

    // Análise do título
    if (!title) {
      issues.push({ type: 'error', message: 'Título está vazio' });
      score -= 20;
    } else if (title.length < 30) {
      issues.push({ type: 'warning', message: 'Título muito curto (mínimo recomendado: 30 caracteres)' });
      score -= 10;
    } else if (title.length > 60) {
      issues.push({ type: 'warning', message: 'Título muito longo (máximo recomendado: 60 caracteres)' });
      score -= 10;
    } else {
      issues.push({ type: 'success', message: 'Título com tamanho ideal' });
    }

    // Análise da descrição
    if (!description) {
      issues.push({ type: 'error', message: 'Meta descrição está vazia' });
      score -= 20;
    } else if (description.length < 120) {
      issues.push({ type: 'warning', message: 'Meta descrição muito curta (mínimo recomendado: 120 caracteres)' });
      score -= 10;
    } else if (description.length > 160) {
      issues.push({ type: 'warning', message: 'Meta descrição muito longa (máximo recomendado: 160 caracteres)' });
      score -= 10;
    } else {
      issues.push({ type: 'success', message: 'Meta descrição com tamanho ideal' });
    }

    // Análise do slug
    if (!slug) {
      issues.push({ type: 'error', message: 'Slug está vazio' });
      score -= 15;
    } else if (slug.length > 75) {
      issues.push({ type: 'warning', message: 'Slug muito longo' });
      score -= 5;
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      issues.push({ type: 'warning', message: 'Slug contém caracteres especiais ou maiúsculas' });
      score -= 5;
    } else {
      issues.push({ type: 'success', message: 'Slug bem formatado' });
    }

    // Análise do conteúdo
    if (!content || content.length < 300) {
      issues.push({ type: 'warning', message: 'Conteúdo muito curto (mínimo recomendado: 300 caracteres)' });
      score -= 10;
    } else if (content.length >= 1000) {
      issues.push({ type: 'success', message: 'Conteúdo com bom tamanho' });
    }

    // Análise de palavras-chave no título
    const titleWords = title.toLowerCase().split(' ');
    const descriptionWords = description.toLowerCase().split(' ');
    const commonWords = titleWords.filter(word => descriptionWords.includes(word) && word.length > 3);
    
    if (commonWords.length > 0) {
      issues.push({ type: 'success', message: 'Palavras-chave consistentes entre título e descrição' });
    } else {
      issues.push({ type: 'warning', message: 'Considere usar palavras-chave do título na descrição' });
      score -= 5;
    }

    return { score: Math.max(0, score), issues };
  };

  const analysis = analyzeSEO();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Score
          </div>
          <Badge 
            className={`${getScoreBgColor(analysis.score)} text-white`}
            variant="secondary"
          >
            {analysis.score}/100 - {getScoreLabel(analysis.score)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Pontuação Geral</span>
            <span className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}%
            </span>
          </div>
          <Progress 
            value={analysis.score} 
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white mb-3">Análise Detalhada</h4>
          {analysis.issues.map((issue, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg bg-gray-700/50"
            >
              {issue.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              )}
              {issue.type === 'warning' && (
                <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              {issue.type === 'error' && (
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                issue.type === 'success' ? 'text-gray-300' : 
                issue.type === 'warning' ? 'text-yellow-300' : 
                'text-red-300'
              }`}>
                {issue.message}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-white mb-2">Dicas de Melhoria</h4>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• Use palavras-chave relevantes no título e descrição</li>
            <li>• Mantenha títulos entre 30-60 caracteres</li>
            <li>• Mantenha descrições entre 120-160 caracteres</li>
            <li>• Use URLs amigáveis (slugs) sem caracteres especiais</li>
            <li>• Crie conteúdo de qualidade com pelo menos 1000 caracteres</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOScore;
