import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

import {
  getEvents,
  getPublicStats,
  getClubs,
} from '../services/api';

import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';
import RegisterModal from '../components/RegisterModal';
import Countdown from '../components/Countdown';

import useFetch from '../hooks/useFetch';
import { Skeleton, Empty, ErrorBox } from '../components/ui';
import { fmtDate, eventStatus } from '../utils/format';


function Counter({ to = 0 }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let i = 0;

    const target = Number(to || 0);
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      i = Math.min(target, i + step);
      setN(i);

      if (i >= target) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [to]);

  return <>{n}</>;
}


export default function Home() {
  const [sel, setSel] = useState(null);
  const [joining, setJoining] = useState(null);

  const clubs = useFetch(getClubs);

  const up = useFetch(() =>
    getEvents({
      status: 'upcoming',
      limit: 6,
    }).then((d) => d.events)
  );

  const feat = useFetch(() =>
    getEvents({
      status: 'upcoming',
      featured: true,
      limit: 1,
    }).then((d) => d.events[0] || null)
  );

  const stats = useFetch(getPublicStats);

  const f = feat.data;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate min-h-[620px] overflow-hidden">

        {/* ABES COLLEGE IMAGE */}

        <div
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.abes.ac.in/assets/2.jpg')",
          }}
        />

        {/* BRIGHT OVERLAY */}

        <div className="absolute inset-0 -z-20 bg-white/5" />

        {/* LEFT DARK GRADIENT - only for text readability */}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/65 via-slate-950/30 to-transparent" />

        {/* BOTTOM GRADIENT */}

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/30 via-transparent to-white/5" />


        {/* HERO CONTENT */}

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-10">

          <div className="max-w-3xl">

            {/* SMALL BADGE */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md">

              <Sparkles size={14} />

              CAMPUS EVENTS PLATFORM

            </div>


            {/* HEADING */}

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-7xl">

              Discover.

              <span className="text-indigo-300">
                {' '}Participate.
              </span>

              <br />

              Connect.

            </h1>


            {/* DESCRIPTION */}

            <p className="mt-6 max-w-2xl text-base leading-7 text-white drop-shadow-md sm:text-lg">

              Discover events, join student communities, build
              connections and make your campus experience
              unforgettable.

            </p>


            {/* BUTTONS */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/events"
                className="btn bg-white px-6 py-3 text-indigo-700 shadow-xl hover:bg-slate-100"
              >
                <Calendar size={17} />
                Explore Events
                <ArrowRight size={16} />
              </Link>


              <Link
                to="/clubs"
                className="btn border border-white/50 bg-white/10 px-6 py-3 text-white backdrop-blur-md hover:bg-white/20"
              >
                <Users size={17} />
                Explore Clubs
              </Link>

            </div>


            {/* TRUST POINTS */}

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">

              <span className="flex items-center gap-2 drop-shadow">
                <CheckCircle2
                  size={16}
                  className="text-emerald-300"
                />
                Student powered
              </span>

              <span className="flex items-center gap-2 drop-shadow">
                <CheckCircle2
                  size={16}
                  className="text-emerald-300"
                />
                Campus communities
              </span>

              <span className="flex items-center gap-2 drop-shadow">
                <CheckCircle2
                  size={16}
                  className="text-emerald-300"
                />
                One platform
              </span>

            </div>

          </div>

        </div>


        {/* SOFT BOTTOM FADE */}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />

      </section>


      {/* =====================================================
          FLOATING STATS
      ====================================================== */}

      <section className="relative z-20 -mt-10 px-5 sm:px-8">

        <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl md:grid-cols-5">

          {[
            ['Clubs', 'totalClubs', Users],
            ['Total Events', 'totalEvents', Calendar],
            ['Upcoming Events', 'upcomingEvents', Clock],
            ['Workshops', 'workshops', Sparkles],
            ['Participants', 'participants', Users],
          ].map(([label, key, Icon], index) => (

            <div
              key={key}
              className={`group border-slate-100 p-5 text-center transition duration-300 hover:bg-indigo-50/50 ${
                index < 4 ? 'md:border-r' : ''
              }`}
            >

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">

                <Icon size={18} />

              </div>

              <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">

                {stats.data ? (
                  <Counter to={stats.data[key]} />
                ) : (
                  '–'
                )}

              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {label}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ====================================================== */}

      <section
        id="about"
        className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10"
      >

        {/* DECORATIVE BACKGROUND */}

        <div className="pointer-events-none absolute left-0 top-20 h-32 w-32 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-40 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />


        <div className="relative">

          {/* SECTION TITLE */}

          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">

              <span className="h-px w-8 bg-indigo-500" />

              About CollegeClub

              <span className="h-px w-8 bg-indigo-500" />

            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">

              More than events.

              <br />

              <span className="text-indigo-600">
                It's campus life.
              </span>

            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">

              A student-driven platform bringing together curious
              minds to learn, build, compete and create meaningful
              connections across campus.

            </p>

          </div>


          {/* FEATURE CARDS */}

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {[
              [
                Target,
                'Mission',
                'Empower students with practical skills and a platform to showcase their talent.',
              ],
              [
                Eye,
                'Vision',
                'Build an inclusive campus community where students learn, collaborate and innovate.',
              ],
              [
                Sparkles,
                'What You Gain',
                'Skills, friendships, mentorship, certificates and real-world experience.',
              ],
            ].map(([Icon, title, description]) => (

              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">

                  <Icon size={20} />

                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CLUBS
      ====================================================== */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Find your community
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Explore Clubs
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Find people who share your interests.
              </p>

            </div>

            <Link
              to="/clubs"
              className="btn-outline w-fit"
            >
              View all clubs
              <ArrowRight size={16} />
            </Link>

          </div>


          {clubs.loading ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-52"
                />
              ))}

            </div>

          ) : clubs.error ? (

            <ErrorBox
              message={clubs.error}
              onRetry={clubs.reload}
            />

          ) : !clubs.data?.length ? (

            <Empty
              title="No clubs yet."
              sub=""
            />

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {clubs.data.map((c) => (

                <ClubCard
                  key={c._id}
                  club={c}
                  onJoin={setJoining}
                />

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          UPCOMING EVENTS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              What's happening
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Upcoming Events
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Don't miss what's happening on campus.
            </p>

          </div>

          <Link
            to="/events"
            className="btn-outline w-fit"
          >
            View all events
            <ArrowRight size={16} />
          </Link>

        </div>


        {up.loading ? (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((i) => (
              <Skeleton key={i} />
            ))}

          </div>

        ) : up.error ? (

          <ErrorBox
            message={up.error}
            onRetry={up.reload}
          />

        ) : !up.data?.length ? (

          <Empty />

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {up.data.map((e) => (

              <EventCard
                key={e._id}
                event={e}
                onRegister={setSel}
              />

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          FEATURED EVENT
      ====================================================== */}

      {f && (

        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">

            {/* BACKGROUND IMAGE */}

            <div className="absolute inset-0">

              {f.image && (
                <img
                  src={f.image}
                  alt={f.title}
                  className="h-full w-full object-cover opacity-35"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/60" />

            </div>


            <div className="relative grid items-center md:grid-cols-2">

              <div className="p-8 sm:p-10 lg:p-14">

                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300">

                  <Sparkles size={13} />

                  FEATURED EVENT

                </span>

                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                  {f.category}
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {f.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">
                  {f.description}
                </p>


                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">

                  <span className="flex items-center gap-2">
                    <Calendar
                      size={15}
                      className="text-indigo-400"
                    />
                    {fmtDate(f.date)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock
                      size={15}
                      className="text-indigo-400"
                    />
                    {f.time}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin
                      size={15}
                      className="text-indigo-400"
                    />
                    {f.venue}
                  </span>

                </div>


                <div className="mt-7">

                  <Countdown
                    to={`${new Date(f.date)
                      .toISOString()
                      .slice(0, 10)}T00:00:00`}
                  />

                </div>


                <button
                  className="btn mt-7 bg-white text-slate-900 hover:bg-slate-100"
                  disabled={eventStatus(f) !== 'Open'}
                  onClick={() => setSel(f)}
                >
                  Register Now
                  <ArrowRight size={16} />
                </button>

              </div>


              {/* EVENT IMAGE */}

              <div className="hidden min-h-[420px] md:block">

                {f.image && (

                  <img
                    src={f.image}
                    alt={f.title}
                    className="h-full w-full object-cover opacity-75"
                  />

                )}

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Users size={22} />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
            Your campus. Your community.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Find your people, discover new experiences and make
            the most of your college journey.
          </p>

          <div className="mt-7 flex justify-center">

            <Link
              to="/clubs"
              className="btn-primary px-6"
            >
              Find a Club
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          REGISTRATION MODALS
      ====================================================== */}

      {sel && (
        <RegisterModal
          event={sel}
          onClose={() => setSel(null)}
          onDone={() => {
            up.reload();
            feat.reload();
            stats.reload();
          }}
        />
      )}


      {joining && (
        <RegisterModal
          club={joining}
          onClose={() => setJoining(null)}
          onDone={() => {
            clubs.reload();
            stats.reload();
          }}
        />
      )}

    </div>
  );
}