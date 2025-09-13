import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { showSuccess, showError } from "@/utils/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

// Schema for Hero and About sections
const contentSchema = z.object({
  hero_title: z.string().min(1, "O título é obrigatório."),
  hero_subtitle: z.string().min(1, "O subtítulo é obrigatório."),
  hero_description: z.string().min(1, "A descrição é obrigatória."),
  hero_image_url: z.string().url("URL da imagem inválida.").or(z.literal('')),
  about_professional_profile: z.string().min(1, "O perfil é obrigatório."),
  about_experience_summary: z.string().min(1, "O resumo é obrigatório."),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const ManageContent = () => {
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
  });

  const { formState: { isDirty } } = form;
  const imageUrl = form.watch("hero_image_url");

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        showError("Erro ao carregar o conteúdo do site.");
        console.error(error);
      } else if (data) {
        form.reset(data);
      }
      setLoading(false);
    };

    fetchContent();
  }, [form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    setIsUploading(true);
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      showError(`Falha no upload da imagem: ${uploadError.message}`);
      console.error(uploadError);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    form.setValue('hero_image_url', data.publicUrl, { shouldValidate: true, shouldDirty: true });
    setIsUploading(false);
    showSuccess("Imagem carregada. Clique em 'Salvar Alterações' para aplicar.");
  };

  const onSubmit = async (values: ContentFormValues) => {
    const { error } = await supabase
      .from("site_content")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (error) {
      showError("Erro ao salvar as alterações.");
    } else {
      showSuccess("Conteúdo atualizado com sucesso!");
      form.reset(values); // Reseta o formulário para o novo estado "limpo"
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Gerenciar Conteúdo</h1>
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="main">Conteúdo Principal</TabsTrigger>
          {/* TODO: Add tabs for Services and Skills */}
        </TabsList>
        <TabsContent value="main">
          <div className="bg-dark-navy/50 rounded-lg border border-gray-700 p-6 mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Hero Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-light-cyan mb-4">Seção Principal (Hero)</h2>
                    <div className="space-y-4">
                      <FormField control={form.control} name="hero_title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl><Input {...field} className="bg-gray-700 border-gray-600" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="hero_subtitle" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtítulo</FormLabel>
                          <FormControl><Input {...field} className="bg-gray-700 border-gray-600" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="hero_description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl><Textarea {...field} rows={4} className="bg-gray-700 border-gray-600" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="hero_image_url" render={() => (
                        <FormItem>
                          <FormLabel>Imagem de Perfil</FormLabel>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={imageUrl || "/placeholder.svg"} alt="Preview" />
                              <AvatarFallback>RVS</AvatarFallback>
                            </Avatar>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="bg-gray-700 border-gray-600 file:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                              />
                            </FormControl>
                          </div>
                          {isUploading && <p className="text-sm text-gray-400 mt-2">Enviando imagem...</p>}
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>
                  </div>

                  {/* About Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-light-cyan mb-4">Seção Sobre Mim</h2>
                    <div className="space-y-4">
                      <FormField control={form.control} name="about_professional_profile" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil Profissional (parágrafos separados por linha)</FormLabel>
                          <FormControl><Textarea {...field} rows={6} className="bg-gray-700 border-gray-600" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="about_experience_summary" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resumo da Experiência (itens separados por linha)</FormLabel>
                          <FormControl><Textarea {...field} rows={6} className="bg-gray-700 border-gray-600" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>
                  </div>

                  <Button type="submit" disabled={!isDirty} className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageContent;