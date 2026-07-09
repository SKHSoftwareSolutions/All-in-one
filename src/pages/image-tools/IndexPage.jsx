import CategoryPage from '../CategoryPage';
import { categoryRoutes } from '../../routeConfig';

function ImageToolsIndexPage() {
  const category = categoryRoutes.find((item) => item.path === '/image-tools/');

  return (
    <CategoryPage
      title={category?.title || 'Image Tools'}
      description={category?.description || 'Explore all image tools.'}
      tools={category?.tools || []}
    />
  );
}

export default ImageToolsIndexPage;
