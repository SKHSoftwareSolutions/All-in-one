import CategoryPage from '../CategoryPage';
import { categoryRoutes } from '../../routeConfig';

function CalculatorsIndexPage() {
  const category = categoryRoutes.find((item) => item.path === '/calculators/');

  return (
    <CategoryPage
      title={category?.title || 'Calculators'}
      description={category?.description || 'Explore all calculators.'}
      tools={category?.tools || []}
    />
  );
}

export default CalculatorsIndexPage;
