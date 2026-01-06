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
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "@/utils/toast";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PostScheduler from "@/components/admin/PostScheduler";
import SEOEditor from "@/components/admin/SEOEditor";
import RichTextEditor from "@/components/admin/RichTextEditor";
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

const postSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  slug: z.string().min(1, "O slug é obrigatório."),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageUrl: z
    .string()
    .url("Deve ser uma URL válida.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
  scheduledFor: z.date().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string;
  excerpt?: string | null;
  content?: string | null;
  coverImageUrl?: string | null;
  authorId?: string | null;
  updatedAt?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

const ManageBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [postStatus, setPostStatus] = useState<
    "draft" | "scheduled" | "published"
  >("draft");

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
    },
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.posts.list();
      setPosts(data.posts || []);
    } catch (error) {
      showError("Erro ao buscar posts.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDialogOpen = (post: Post | null = null) => {
    setSelectedPost(post);
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        coverImageUrl: post.coverImageUrl || "",
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt || "",
      });
      setPostStatus(post.status || "draft");
      setScheduledDate(
        post.scheduledFor ? new Date(post.scheduledFor) : undefined
      );
    } else {
      form.reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImageUrl: "",
        metaTitle: "",
        metaDescription: "",
      });
      setPostStatus("draft");
      setScheduledDate(undefined);
    }
    setIsDialogOpen(true);
  };

  const handleDeleteDialogOpen = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = showLoading("Enviando imagem...");

    try {
      const { data } = await api.uploads.blog(file);
      const imageUrl = data.url;

      form.setValue("coverImageUrl", imageUrl, { shouldDirty: true });
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

  const onSubmit = async (values: PostFormValues) => {
    // Determinar o status baseado no agendamento
    let finalStatus: "draft" | "scheduled" | "published" = "draft";
    if (scheduledDate) {
      finalStatus = scheduledDate > new Date() ? "scheduled" : "published";
    } else if (postStatus === "published") {
      finalStatus = "published";
    } else {
      finalStatus = postStatus;
    }

    const transformedValues = {
      ...values,
      status: finalStatus,
      scheduledFor: scheduledDate?.toISOString() || undefined,
    };

    try {
      if (selectedPost) {
        await api.posts.update(selectedPost.id, transformedValues);
        showSuccess("Post atualizado com sucesso!");
      } else {
        await api.posts.create(transformedValues);
        showSuccess("Post criado com sucesso!");
      }
      await fetchPosts();
      setIsDialogOpen(false);
    } catch (error) {
      showError(
        selectedPost ? "Erro ao atualizar post." : "Erro ao criar post."
      );
      console.error(error);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedPost) return;

    try {
      await api.posts.delete(selectedPost.id);
      showSuccess("Post excluído com sucesso!");
      await fetchPosts();
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      showError("Erro ao excluir post.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Blog</h1>
        <Button
          onClick={() => handleDialogOpen()}
          className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Post
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
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400">
                  Nenhum post encontrado
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="border-gray-700">
                  <TableCell className="text-gray-300">{post.title}</TableCell>
                  <TableCell className="text-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-xs ${post.status === "published"
                          ? "bg-green-900/50 text-green-300"
                          : post.status === "scheduled"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                    >
                      {post.status === "published"
                        ? "Publicado"
                        : post.status === "scheduled"
                          ? "Agendado"
                          : "Rascunho"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDialogOpen(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDialogOpen(post)}
                    >
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
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPost ? "Editar Post" : "Novo Post"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem de Capa (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Upload de Imagem de Capa</FormLabel>
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
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo (Excerpt)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo (HTML)</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Escreva o conteúdo do seu post aqui..."
                        onSave={() => form.handleSubmit(onSubmit)()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SEO Editor */}
              <SEOEditor
                title={form.watch("metaTitle") || form.watch("title") || ""}
                description={
                  form.watch("metaDescription") || form.watch("excerpt") || ""
                }
                slug={form.watch("slug") || ""}
                coverImageUrl={form.watch("coverImageUrl") || ""}
                content={form.watch("content") || ""}
                onTitleChange={(value) => form.setValue("metaTitle", value)}
                onDescriptionChange={(value) =>
                  form.setValue("metaDescription", value)
                }
                onSlugChange={(value) => form.setValue("slug", value)}
              />

              {/* Post Scheduler */}
              <PostScheduler
                scheduledAt={scheduledDate}
                onScheduleChange={(date) => {
                  setScheduledDate(date);
                  setPostStatus(date ? "scheduled" : "draft");
                }}
                status={postStatus}
              />

              <Button
                type="submit"
                className="w-full bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
              >
                {selectedPost ? "Salvar Alterações" : "Criar Post"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        itemName={selectedPost?.title || ""}
      />
    </div>
  );
};

export default ManageBlog;
