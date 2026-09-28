import { useState, useEffect, useRef } from 'react';

import toast from 'react-hot-toast';

import {
  getRecentRegistrations,
  getRecentMembers,
} from '../services/api';

import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  UserPlus,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const { logout, user } = useAuth();
  const nav = useNavigate();

  const seen = useRef({ r: null, m: null });

  // Live notifications
  useEffect(() => {
    const tick = async () => {
      if (document.hidden) return;

      try {
        const [regs, mems] = await Promise.all([
          getRecentRegistrations(),
          getRecentMembers(),
        ]);

        const r = regs[0];
        const m = mems[0];

        if (
          seen.current.r &&
          r &&
          r._id !== seen.current.r
        ) {
          toast(
            `New registration: ${r.name} → ${r.event?.title} (${r.club?.name})`,
            {
              icon: '🎟️',
              duration: 6000,
            }
          );
        }

        if (
          seen.current.m &&
          m &&
          m._id !== seen.current.m
        ) {
          toast(
            `New member: ${m.name} joined ${m.club?.name}`,
            {
              icon: '🙌',
              duration: 6000,
            }
          );
        }

        seen.current = {
          r: r?._id || 'none',
          m: m?._id || 'none',
        };
      } catch {
        // Ignore polling errors
      }
    };

    tick();

    const t = setInterval(tick, 10000);

    return () => clearInterval(t);
  }, []);

  const items = [
    [
      '/admin/dashboard',
      'Dashboard',
      LayoutDashboard,
    ],
    [
      '/admin/clubs',
      'Clubs',
      Building2,
    ],
    [
      '/admin/events',
      'Events',
      CalendarDays,
    ],
    [
      '/admin/memberships',
      'Members',
      UserPlus,
    ],
    [
      '/admin/registrations',
      'Registrations',
      Users,
    ],
  ];

  const cls = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72
          transform border-r border-white/10
          bg-[#0b1120]
          shadow-2xl shadow-slate-950/20
          transition-transform duration-300
          md:static md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* ---------- PREMIUM LOGO ---------- */}
        <div className="border-b border-white/10 px-5 py-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              {/* Logo Mark */}
              <div
                className="
                  relative flex h-11 w-11 shrink-0
                  items-center justify-center
                  overflow-hidden rounded-2xl
                  bg-gradient-to-br
                  from-indigo-500 via-violet-500 to-fuchsia-500
                  shadow-lg shadow-indigo-500/30
                "
              >
                <div className="absolute inset-0 bg-white/10" />

                <GraduationCap
                  size={23}
                  strokeWidth={2.2}
                  className="relative text-white"
                />

                <Sparkles
                  size={10}
                  className="absolute right-1.5 top-1.5 text-white"
                />
              </div>

              {/* Brand */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold tracking-tight text-white">
                    TechClub
                  </span>

                  <span className="rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                    Pro
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Admin Control
                </p>
              </div>

            </div>

            {/* Mobile close */}
            <button
              className="text-slate-400 transition hover:text-white md:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={21} />
            </button>

          </div>

        </div>

        {/* ---------- NAVIGATION ---------- */}
        <div className="px-4 py-5">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Workspace
          </p>

          <nav
            className="space-y-1.5"
            onClick={() => setOpen(false)}
          >

            {items.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={cls}
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <span className="flex-1">
                  {label}
                </span>

                <ChevronRight
                  size={15}
                  className="
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:opacity-50
                  "
                />
              </NavLink>
            ))}

            {/* Divider */}
            <div className="my-5 border-t border-white/5" />

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                nav('/admin/login');
              }}
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm font-medium
                text-slate-400
                transition-all duration-200
                hover:bg-red-500/10
                hover:text-red-400
              "
            >
              <LogOut size={18} />

              <span className="flex-1 text-left">
                Logout
              </span>
            </button>

          </nav>
        </div>

        {/* ---------- SIDEBAR FOOTER ---------- */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">

            <div className="flex items-center gap-3">

              <div className="
                flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-500 to-violet-600
                text-xs font-bold text-white
              ">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {user?.name || 'Club Admin'}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Administrator
                </p>
              </div>

              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

            </div>

          </div>

        </div>

      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= MAIN AREA ================= */}
      <div className="min-w-0 flex-1">

        {/* Top bar */}
        <header
          className="
            sticky top-0 z-20
            flex h-[65px] items-center
            justify-between
            border-b border-slate-200
            bg-white/90
            px-4
            backdrop-blur-xl
            md:px-7
          "
        >

          <button
            className="
              rounded-xl p-2
              text-slate-600
              transition
              hover:bg-slate-100
              md:hidden
            "
            onClick={() => setOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="ml-auto flex items-center gap-4">

            {/* Status */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

              <span className="text-xs font-medium text-slate-500">
                System Online
              </span>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">

              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {user?.name || 'Club Admin'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Administrator
                </p>
              </div>

              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-violet-600
                  text-sm font-bold
                  text-white
                  shadow-sm
                "
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

            </div>

          </div>

        </header>

        {/* Page content */}
        <main className="p-4 md:p-7">
          <Outlet />
        </main>

      </div>

    </div>
  );
}