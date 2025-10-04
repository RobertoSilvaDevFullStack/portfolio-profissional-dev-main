import { useEffect, useState, useCallback } from "react";
import { Search, FileText, Briefcase, MessageSquare, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "post" | "project" | "lead";
  status?: string;
  created_at: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;

      // Buscar em posts
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, title, excerpt, status, created_at")
        .or(
          `title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`
        )
        .limit(5);

      // Buscar em projetos
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, description, created_at")
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      // Buscar em leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, name, email, phone, message, status, created_at")
        .or(
          `name.ilike.${searchTerm},email.ilike.${searchTerm},message.ilike.${searchTerm}`
        )
        .limit(5);

      if (postsError) console.error("Erro ao buscar posts:", postsError);
      if (projectsError)
        console.error("Erro ao buscar projetos:", projectsError);
      if (leadsError) console.error("Erro ao buscar leads:", leadsError);

      const allResults: SearchResult[] = [
        ...(posts || []).map((post) => ({
          id: post.id,
          title: post.title,
          description: post.excerpt || "",
          type: "post" as const,
          status: post.status,
          created_at: post.created_at,
        })),
        ...(projects || []).map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description || "",
          type: "project" as const,
          created_at: project.created_at,
        })),
        ...(leads || []).map((lead) => ({
          id: lead.id,
          title: lead.name,
          description: `${lead.email} - ${lead.message?.substring(0, 50)}...`,
          type: "lead" as const,
          status: lead.status || "new",
          created_at: lead.created_at,
        })),
      ];

      setResults(allResults);
    } catch (error) {
      console.error("Erro na busca global:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, performSearch]);

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false);
    setQuery("");
    setResults([]);

    // Navegar para a página correspondente
    switch (result.type) {
      case "post":
        navigate(`/admin/blog`);
        break;
      case "project":
        navigate(`/admin/projects`);
        break;
      case "lead":
        navigate(`/admin/leads`);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "project":
        return <Briefcase className="h-4 w-4 text-purple-400" />;
      case "lead":
        return <MessageSquare className="h-4 w-4 text-green-400" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      post: { label: "Post", className: "bg-blue-500" },
      project: { label: "Projeto", className: "bg-purple-500" },
      lead: { label: "Lead", className: "bg-green-500" },
    };
    const badge = badges[type as keyof typeof badges];
    return (
      <Badge className={`${badge.className} text-xs`}>{badge.label}</Badge>
    );
  };

  const getStatusBadge = (type: string, status?: string) => {
    if (!status) return null;

    const statusConfig: Record<string, { label: string; className: string }> = {
      // Posts
      draft: { label: "Rascunho", className: "bg-gray-500" },
      scheduled: { label: "Agendado", className: "bg-yellow-500" },
      published: { label: "Publicado", className: "bg-green-500" },
      archived: { label: "Arquivado", className: "bg-red-500" },
      // Leads
      new: { label: "Novo", className: "bg-blue-500" },
      contacted: { label: "Contatado", className: "bg-yellow-500" },
      qualified: { label: "Qualificado", className: "bg-green-500" },
      converted: { label: "Convertido", className: "bg-purple-500" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <Badge className={`${config.className} text-xs`}>{config.label}</Badge>
    );
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-light-cyan/30 text-light-cyan font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Agrupar resultados por tipo
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b border-gray-700 px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Buscar posts, projetos, leads..."
          value={query}
          onValueChange={setQuery}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="shrink-0 opacity-50 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <CommandList className="max-h-[400px] overflow-y-auto">
        <CommandEmpty>
          {loading
            ? "Buscando..."
            : query.length < 2
            ? "Digite pelo menos 2 caracteres para buscar"
            : "Nenhum resultado encontrado"}
        </CommandEmpty>

        {Object.entries(groupedResults).map(([type, items]) => (
          <CommandGroup
            key={type}
            heading={
              type === "post"
                ? "Posts"
                : type === "project"
                ? "Projetos"
                : "Leads"
            }
            className="text-white"
          >
            {items.map((result) => (
              <CommandItem
                key={`${result.type}-${result.id}`}
                value={`${result.type}-${result.title}`}
                onSelect={() => handleSelect(result)}
                className="flex items-start gap-3 cursor-pointer hover:bg-gray-800 p-3 rounded-md"
              >
                <div className="mt-1">{getIcon(result.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {highlightMatch(result.title, query)}
                    </p>
                    {getTypeBadge(result.type)}
                    {getStatusBadge(result.type, result.status)}
                  </div>
                  {result.description && (
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {highlightMatch(result.description, query)}
                    </p>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>

      {/* Footer com dica de atalho */}
      <div className="border-t border-gray-700 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <span>
          Pressione <kbd className="px-1 py-0.5 bg-gray-800 rounded">ESC</kbd>{" "}
          para fechar
        </span>
        <span>
          {results.length} resultado{results.length !== 1 ? "s" : ""}
        </span>
      </div>
    </CommandDialog>
  );
};

export default GlobalSearch;
