import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, CalendarDays } from 'lucide-react';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/clubs', 'Clubs'], ['/events', 'Events'], ['/#about', 'About Club'], ['/#contact', 'Contact']];
  const cls = ({ isActive }) => `text-sm font-medium hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`;
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-indigo-700"><CalendarDays /> TechClub</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([to, l]) => to.includes('#') ? <a key={l} href={to} className="text-sm font-medium text-slate-600 hover:text-indigo-600">{l}</a> : <NavLink key={l} to={to} end className={cls}>{l}</NavLink>)}
          <Link to="/admin/login" className="btn-primary">Admin Login</Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="flex flex-col gap-3 border-t bg-white px-4 py-4 md:hidden" onClick={() => setOpen(false)}>
        {links.map(([to, l]) => <a key={l} href={to} className="text-sm font-medium">{l}</a>)}
        <Link to="/admin/login" className="btn-primary">Admin Login</Link></div>}
    </header>
  );
}
