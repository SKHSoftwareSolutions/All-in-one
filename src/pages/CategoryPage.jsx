import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

function CategoryPage({ title, description, tools }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={title} description={description} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">{tool.label}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
