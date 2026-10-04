import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Center = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <Navbar />
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Outlet />
    </main>
  </div>
);
