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
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "@/utils/toast";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PostScheduler from "@/components/admin/PostScheduler";
import SEOEditor from "@/components/admin/SEOEditor";
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
  cover_image_url: z
    .string()
    .url("Deve ser uma URL válida.")
    .optional()
    .or(z.literal("")),
  author_name: z.string().optional(),
  author_avatar_url: z
    .string()
    .url("Deve ser uma URL válida.")
    .optional()
    .or(z.literal("")),
  asset_urls: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional(),
  scheduled_at: z.date().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  asset_urls: string[] | null;
  status?: "draft" | "scheduled" | "published" | "archived";
  scheduled_at?: string;
  published_at?: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  author_name?: string | null;
  author_avatar_url?: string | null;
  author_id?: string | null;
  updated_at?: string;
  seo_title?: string | null;
  seo_description?: string | null;
}

const ManageBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [postStatus, setPostStatus] = useState<
    "draft" | "scheduled" | "published" | "archived"
  >("draft");

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      author_name: "Roberto Vicente da Silva",
      author_avatar_url: "",
      asset_urls: "",
    },
  });

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, created_at, excerpt, content, cover_image_url, author_name, author_avatar_url, asset_urls, status, scheduled_at, published_at, seo_title, seo_description"
      )
      .order("created_at", { ascending: false });

    if (error) {
      showError("Erro ao buscar posts.");
      console.error(error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("hero_image_url")
        .eq("id", 1)
        .single();

      if (data && !error) {
        setProfileImageUrl(data.hero_image_url);
      }

      await fetchPosts();
    };

    fetchInitialData();
  }, []);

  const handleDialogOpen = (post: Post | null = null) => {
    setSelectedPost(post);
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        cover_image_url: post.cover_image_url || "",
        author_name: post.author_name || "Roberto Vicente da Silva",
        author_avatar_url: post.author_avatar_url || profileImageUrl,
        asset_urls: post.asset_urls?.join(", ") || "",
        seo_title: post.seo_title || post.title,
        seo_description: post.seo_description || post.excerpt || "",
      });
      setPostStatus(post.status || "draft");
      setScheduledDate(
        post.scheduled_at ? new Date(post.scheduled_at) : undefined
      );
    } else {
      form.reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image_url: "",
        author_name: "Roberto Vicente da Silva",
        author_avatar_url: profileImageUrl,
        asset_urls: "",
        seo_title: "",
        seo_description: "",
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

  const handleAssetUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = showLoading(`Enviando ${files.length} arquivo(s)...`);
    const slug = form.getValues("slug") || "post-sem-slug";
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const filePath = `${slug}/${fileName}`;

      const { error } = await supabase.storage
        .from("blog-assets")
        .upload(filePath, file);

      if (error) {
        showError(`Falha no upload de ${file.name}: ${error.message}`);
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    dismissToast(toastId);
    if (uploadedUrls.length > 0) {
      showSuccess(`${uploadedUrls.length} arquivo(s) enviados com sucesso!`);

      const currentCoverImage = form.getValues("cover_image_url");
      if (!currentCoverImage) {
        form.setValue("cover_image_url", uploadedUrls[0], {
          shouldDirty: true,
        });
      }

      const existingUrls = form.getValues("asset_urls");
      const newUrls = existingUrls
        ? `${existingUrls}, ${uploadedUrls.join(", ")}`
        : uploadedUrls.join(", ");
      form.setValue("asset_urls", newUrls, { shouldDirty: true });
    }
    setIsUploading(false);
  };

  const onSubmit = async (values: PostFormValues) => {
    // Determinar o status baseado no agendamento
    let finalStatus: "draft" | "scheduled" | "published" | "archived" = "draft";
    if (scheduledDate) {
      finalStatus = scheduledDate > new Date() ? "scheduled" : "published";
    } else if (postStatus === "published") {
      finalStatus = "published";
    } else {
      finalStatus = postStatus;
    }

    const transformedValues = {
      ...values,
      asset_urls: values.asset_urls
        ? values.asset_urls
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)
        : [],
      status: finalStatus,
      scheduled_at: scheduledDate?.toISOString() || null,
    };

    if (selectedPost) {
      const { error } = await supabase
        .from("posts")
        .update(transformedValues)
        .eq("id", selectedPost.id);
      if (error) showError("Erro ao atualizar post.");
      else showSuccess("Post atualizado com sucesso!");
    } else {
      const { error } = await supabase.from("posts").insert(transformedValues);
      if (error) showError("Erro ao criar post.");
      else showSuccess("Post criado com sucesso!");
    }
    await fetchPosts();
    setIsDialogOpen(false);
  };

  const onDeleteConfirm = async () => {
    if (!selectedPost) return;
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", selectedPost.id);
    if (error) showError("Erro ao excluir post.");
    else showSuccess("Post excluído com sucesso!");
    await fetchPosts();
    setIsDeleteDialogOpen(false);
    setSelectedPost(null);
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
              <TableHead className="text-white">Data de Criação</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="border-gray-700">
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
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
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? "Editar Post" : "Novo Post"}
            </DialogTitle>
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
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Autor</FormLabel>
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
                name="author_avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Avatar do Autor</FormLabel>
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
                name="cover_image_url"
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
                <FormLabel>Assets do Carrossel (Imagens ou PDFs)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleAssetUpload}
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
                name="asset_urls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URLs dos Assets (separadas por vírgula)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>
                      Conteúdo (HTML - usado se não houver carrossel)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SEO Editor */}
              <SEOEditor
                title={form.watch("seo_title") || form.watch("title") || ""}
                description={
                  form.watch("seo_description") || form.watch("excerpt") || ""
                }
                slug={form.watch("slug") || ""}
                coverImageUrl={form.watch("cover_image_url") || ""}
                content={form.watch("content") || ""}
                onTitleChange={(value) => form.setValue("seo_title", value)}
                onDescriptionChange={(value) =>
                  form.setValue("seo_description", value)
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
