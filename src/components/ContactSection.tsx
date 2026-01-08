import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";

const ContactSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.leads.create(formData);
      showSuccess("Mensagem enviada com sucesso! Entrarei em contato em breve.");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      showError("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Vamos Trabalhar Juntos?</h2>
        <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        <p className="text-gray-300 mt-6 mb-10">
          Estou sempre aberto a novas oportunidades e colaborações. Se você tem um projeto em mente, ou apenas quer dizer olá, sinta-se à vontade para me contatar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <Label htmlFor="name" className="text-gray-300">Nome</Label>
            <Input id="name" type="text" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required className="bg-gray-800 border-gray-600 text-white mt-2" />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required className="bg-gray-800 border-gray-600 text-white mt-2" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
            <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" value={formData.phone} onChange={handleChange} required className="bg-gray-800 border-gray-600 text-white mt-2" />
          </div>
          <div>
            <Label htmlFor="message" className="text-gray-300">Mensagem</Label>
            <Textarea id="message" placeholder="Descreva seu projeto ou sua ideia..." value={formData.message} onChange={handleChange} className="bg-gray-800 border-gray-600 text-white mt-2" rows={5} />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full bg-light-cyan text-dark-navy hover:bg-light-cyan/90 font-bold">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;