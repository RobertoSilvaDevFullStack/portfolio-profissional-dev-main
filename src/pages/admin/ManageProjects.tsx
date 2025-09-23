import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  images: z.string().optional(),
  technologies: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Project {
  id: string;
  title: string;
  created_at: string;
  [key: string]: unknown;
}

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.input<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      images: "",
      technologies: "",
    },
  });

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, created_at, description, link, images, technologies")
      .order("created_at", { ascending: false });

    if (error) {
      showError("Erro ao buscar projetos.");
      console.error(error);
    } else {
      setProjects(data);
    }
    setLoading(false);
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
        images: project.images?.join(', ') || "",
        technologies: project.technologies?.join(', ') || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        link: "",
        images: "",
        technologies: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleDeleteDialogOpen = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleAssetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = showLoading(`Enviando ${files.length} arquivo(s)...`);
    
    const title = form.getValues('title');
    if (!title) {
      dismissToast(toastId);
      showError("Por favor, adicione um título ao projeto antes de enviar arquivos.");
      setIsUploading(false);
      return;
    }
    const projectSlug = slugify(title);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectSlug}-${Date.now()}.${fileExt}`;
      const filePath = `${projectSlug}/${fileName}`;

      const { error } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file);

      if (error) {
        showError(`Falha no upload de ${file.name}: ${error.message}`);
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    dismissToast(toastId);
    if (uploadedUrls.length > 0) {
      showSuccess(`${uploadedUrls.length} arquivo(s) enviados com sucesso!`);
      const existingUrls = form.getValues('images');
      const newUrls = existingUrls ? `${existingUrls}, ${uploadedUrls.join(', ')}` : uploadedUrls.join(', ');
      form.setValue('images', newUrls, { shouldDirty: true });
    }
    setIsUploading(false);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    const transformedValues = {
      ...values,
      images: values.images ? values.images.split(',').map(item => item.trim()).filter(Boolean) : [],
      technologies: values.technologies ? values.technologies.split(',').map(item => item.trim()).filter(Boolean) : [],
    };

    if (selectedProject) {
      const { error } = await supabase
        .from("projects")
        .update(transformedValues)
        .eq("id", selectedProject.id);
      if (error) showError("Erro ao atualizar projeto.");
      else showSuccess("Projeto atualizado com sucesso!");
    } else {
      const { error } = await supabase.from("projects").insert(transformedValues);
      if (error) showError("Erro ao criar projeto.");
      else showSuccess("Projeto criado com sucesso!");
    }
    await fetchProjects();
    setIsDialogOpen(false);
  };

  const onDeleteConfirm = async () => {
    if (!selectedProject) return;
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", selectedProject.id);
    if (error) showError("Erro ao excluir projeto.");
    else showSuccess("Projeto excluído com sucesso!");
    await fetchProjects();
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
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
              <TableHead className="text-white">Data de Criação</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center text-gray-400">Carregando...</TableCell></TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="border-gray-700">
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(project)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDialogOpen(project)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader><DialogTitle>{selectedProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} className="bg-gray-700 border-gray-600" /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="link" render={({ field }) => (<FormItem><FormLabel>Link do Projeto</FormLabel><FormControl><Input {...field} className="bg-gray-700 border-gray-600" /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} className="bg-gray-700 border-gray-600" /></FormControl><FormMessage /></FormItem>)}/>
              
              <FormItem>
                <FormLabel>Imagens ou PDFs do Projeto</FormLabel>
                <FormControl>
                  <Input type="file" multiple accept="image/*,application/pdf" onChange={handleAssetUpload} disabled={isUploading} className="bg-gray-700 border-gray-600 file:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"/>
                </FormControl>
                {isUploading && <div className="flex items-center text-sm text-gray-400 mt-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</div>}
              </FormItem>

              <FormField control={form.control} name="images" render={({ field }) => (<FormItem><FormLabel>URLs das Imagens/PDFs (separadas por vírgula)</FormLabel><FormControl><Textarea {...field} className="bg-gray-700 border-gray-600" /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="technologies" render={({ field }) => (<FormItem><FormLabel>Tecnologias (separadas por vírgula)</FormLabel><FormControl><Textarea {...field} className="bg-gray-700 border-gray-600" /></FormControl><FormMessage /></FormItem>)}/>
              
              <Button type="submit" className="w-full bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
                {selectedProject ? "Salvar Alterações" : "Criar Projeto"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={onDeleteConfirm} itemName={selectedProject?.title || ""}/>
    </div>
  );
};

export default ManageProjects;
