import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  link: z.string().url("Deve ser uma URL válida.").optional().or(z.literal('')),
  imageUrl: z.string().url("Deve ser uma URL válida.").optional().or(z.literal('')),
  technologies: z.string().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Project {
  id: string;
  title: string;
  createdAt: string;
  description?: string | null;
  link?: string | null;
  imageUrl?: string | null;
  technologies?: string | null;
  status?: "active" | "archived";
}

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      imageUrl: "",
      technologies: "",
      status: "active",
    },
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.projects.list();
      setProjects(data.projects || []);
    } catch (error) {
      showError("Erro ao buscar projetos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDialogOpen = (project: Project | null = null) => {
    setSelectedProject(project);
    if (project) {
      form.reset({
        title: project.title,
        description: project.description || "",
        link: project.link || "",
        imageUrl: project.imageUrl || "",
        technologies: project.technologies || "",
        status: project.status || "active",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        link: "",
        imageUrl: "",
        technologies: "",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleDeleteDialogOpen = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = showLoading("Enviando imagem...");

    try {
      const { data } = await api.uploads.projects(file);
      const imageUrl = data.url;

      form.setValue("imageUrl", imageUrl, { shouldDirty: true });
      dismissToast(toastId);
      showSuccess("Imagem enviada com sucesso!");
    } catch (error) {
      dismissToast(toastId);
      showError("Falha no upload da imagem.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (selectedProject) {
        await api.projects.update(selectedProject.id, values);
        showSuccess("Projeto atualizado com sucesso!");
      } else {
        await api.projects.create(values);
        showSuccess("Projeto criado com sucesso!");
      }
      await fetchProjects();
      setIsDialogOpen(false);
    } catch (error) {
      showError(selectedProject ? "Erro ao atualizar projeto." : "Erro ao criar projeto.");
      console.error(error);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedProject) return;

    try {
      await api.projects.delete(selectedProject.id);
      showSuccess("Projeto excluído com sucesso!");
      await fetchProjects();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      showError("Erro ao excluir projeto.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Projetos</h1>
        <Button onClick={() => handleDialogOpen()} className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="bg-dark-navy/50 rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-white">Título</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Data de Criação</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400">
                  Nenhum projeto encontrado
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="border-gray-700">
                  <TableCell className="text-gray-300">{project.title}</TableCell>
                  <TableCell className="text-gray-300">
                    <span className={`px-2 py-1 rounded text-xs ${project.status === "active"
                        ? "bg-green-900/50 text-green-300"
                        : "bg-gray-700 text-gray-300"
                      }`}>
                      {project.status === "active" ? "Ativo" : "Arquivado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDialogOpen(project)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Projeto</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 border-gray-600" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-gray-700 border-gray-600" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Upload de Imagem</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="bg-gray-700 border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                  />
                </FormControl>
                {isUploading && (
                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                )}
              </FormItem>

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tecnologias (separadas por vírgula)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-gray-700 border-gray-600" rows={2} placeholder="React, Node.js, PostgreSQL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
                {selectedProject ? "Salvar Alterações" : "Criar Projeto"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        itemName={selectedProject?.title || ""}
      />
    </div>
  );
};

export default ManageProjects;
