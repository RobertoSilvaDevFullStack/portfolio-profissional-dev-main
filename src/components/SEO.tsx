import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  imageUrl?: string;
}

const SEO = ({ title, description, name = "Roberto Vicente da Silva", type = "website", imageUrl }: SEOProps) => {
  const fullTitle = `${title} | Roberto Vicente da Silva`;
  return (
    <Helmet>
      {/* Tags de metadados padrão */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      
      {/* Tags do Facebook (Open Graph) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      
      {/* Tags do Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
};

export default SEO;