import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/AdminEvents';
import EventForm from './pages/admin/EventForm';
import Registrations from './pages/admin/Registrations';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import AdminClubs from './pages/admin/AdminClubs';
import Memberships from './pages/admin/Memberships';
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} /><Route path="/events" element={<Events />} /><Route path="/events/:id" element={<EventDetails />} /><Route path="/clubs" element={<Clubs />} /><Route path="/clubs/:slug" element={<ClubDetails />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} /><Route path="events" element={<AdminEvents />} />
        <Route path="events/new" element={<EventForm />} /><Route path="events/:id/edit" element={<EventForm />} />
        <Route path="registrations" element={<Registrations />} /><Route path="clubs" element={<AdminClubs />} /><Route path="memberships" element={<Memberships />} />
      </Route>
      <Route path="*" element={<div className="p-20 text-center text-xl">404 – Page not found</div>} />
    </Routes>
  );
}
