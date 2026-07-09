import CategoryPage from '../CategoryPage';
import { categoryRoutes } from '../../routeConfig';

function TextToolsIndexPage() {
  const category = categoryRoutes.find((item) => item.path === '/text-tools/');

  return (
    <CategoryPage
      title={category?.title || 'Text Tools'}
      description={category?.description || 'Explore all text tools.'}
      tools={category?.tools || []}
    />
  );
}

export default TextToolsIndexPage;
