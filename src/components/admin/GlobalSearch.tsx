import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  // Temporariamente desabilitado - aguardando migração para API

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar..." />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center text-sm text-gray-400">
            <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Busca global em desenvolvimento</p>
            <p className="text-xs mt-1">Aguardando migração para nova API</p>
          </div>
        </CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
