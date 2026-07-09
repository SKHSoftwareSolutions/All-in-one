import CategoryPage from '../CategoryPage';
import { categoryRoutes } from '../../routeConfig';

function PdfToolsIndexPage() {
  const category = categoryRoutes.find((item) => item.path === '/pdf-tools/');

  return (
    <CategoryPage
      title={category?.title || 'PDF Tools'}
      description={category?.description || 'Explore all PDF tools.'}
      tools={category?.tools || []}
    />
  );
}

export default PdfToolsIndexPage;
