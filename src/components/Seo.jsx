import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteName, siteUrl } from '../siteConfig';

function Seo({ title, description, type = 'website', jsonLd }) {
  const { pathname } = useLocation();
  const canonicalUrl = `${siteUrl}${pathname}`;
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}

export default Seo;
