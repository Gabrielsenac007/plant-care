import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Logo } from './Logo';
import { btnPrimary } from '../utils/ui';

const links = [
  { to: '/center', label: 'Início', end: true },
  { to: '/center/plants', label: 'Plantas', end: false },
  { to: '/center/categories', label: 'Categorias', end: false },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showNew = !pathname.endsWith('/categories');

  return (
    <header className="sticky top-0 z-40 border-b border-bordas bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:gap-6">
        <NavLink to="/center" className="mr-auto">
          <Logo size={120} />
        </NavLink>
        <nav className="flex gap-4 text-sm sm:gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `border-b-2 pb-0.5 ${
                  isActive ? 'border-details font-bold text-titles' : 'border-transparent text-gray-500 hover:text-titles'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        {showNew && (
          <button
            className={btnPrimary}
            onClick={() => navigate('/center/plants', { state: { openForm: true } })}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nova planta</span>
          </button>
        )}
      </div>
    </header>
  );
};
