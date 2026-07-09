import CategoryPage from '../CategoryPage';
import { categoryRoutes } from '../../routeConfig';

function GeneratorsIndexPage() {
  const category = categoryRoutes.find((item) => item.path === '/generators/');

  return (
    <CategoryPage
      title={category?.title || 'Generators'}
      description={category?.description || 'Explore all generators.'}
      tools={category?.tools || []}
    />
  );
}

export default GeneratorsIndexPage;
