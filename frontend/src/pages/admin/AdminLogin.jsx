import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { errMsg } from '../../services/api';

export default function AdminLogin() {
  const { login, isAuth } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    email: '',
    password: '',
  });

  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuth) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await login(f);
      toast.success('Welcome back, Admin');
      nav('/admin/dashboard');
    } catch (er) {
      toast.error(errMsg(er));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT BRAND SECTION
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">

          {/* Background decoration */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <Link to="/" className="flex w-fit items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                <div className="relative">
                  <GraduationCap
                    size={25}
                    strokeWidth={2.2}
                    className="text-white"
                  />

                  <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-blue-300" />
                </div>
              </div>

              <div>
                <div className="text-lg font-bold tracking-tight text-white">
                  College<span className="text-indigo-400">Club</span>
                </div>

                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Campus Events Platform
                </div>
              </div>

            </Link>

            {/* Main content */}
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                <Sparkles size={14} className="text-indigo-400" />
                Built for campus communities
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Where ideas,
                <br />
                <span className="text-indigo-400">people</span> &amp;
                <br />
                passions meet.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Manage college clubs, events and student registrations
                from one simple and powerful platform.
              </p>

              {/* Features */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <CalendarDays
                    size={19}
                    className="text-indigo-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Events
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Create & manage
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Users
                    size={19}
                    className="text-indigo-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Students
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Track registrations
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <ShieldCheck
                    size={19}
                    className="text-indigo-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Secure
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Admin protected
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500">
              <span>© 2026 CollegeClub</span>
              <span>Campus Event Management</span>
            </div>

          </div>
        </section>


        {/* =====================================================
            RIGHT LOGIN SECTION
        ====================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center lg:hidden">

              <Link to="/" className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                  <GraduationCap
                    size={25}
                    className="text-white"
                  />
                </div>

                <div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">
                    College<span className="text-indigo-600">Club</span>
                  </div>

                  <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">
                    Campus Events
                  </div>
                </div>

              </Link>

            </div>


            {/* Login card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-9">

              {/* Admin badge */}
              <div className="mb-7 flex items-center justify-between">

                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  <ShieldCheck size={14} />
                  Admin Access
                </div>

                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

              </div>


              {/* Heading */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to manage clubs, events and student registrations.
                </p>
              </div>


              {/* Form */}
              <form
                onSubmit={submit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="label">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      className="input pl-11"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="admin@collegeclub.com"
                      value={f.email}
                      onChange={(e) =>
                        setF({
                          ...f,
                          email: e.target.value,
                        })
                      }
                    />

                  </div>
                </div>


                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="label mb-0">
                      Password
                    </label>
                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      className="input pl-11 pr-11"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={f.password}
                      onChange={(e) =>
                        setF({
                          ...f,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>


                {/* Login button */}
                <button
                  type="submit"
                  className="btn-primary mt-2 h-11 w-full"
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowLeft
                        size={17}
                        className="rotate-180"
                      />
                    </>
                  )}
                </button>

              </form>


              {/* Security message */}
              <div className="mt-7 flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Your administrator session is protected with secure
                  authentication.
                </p>

              </div>

            </div>


            {/* Back */}
            <Link
              to="/"
              className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={15} />
              Back to website
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
}