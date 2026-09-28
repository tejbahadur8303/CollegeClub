import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer id="contact" className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div><h4 className="text-lg font-bold text-white">TechClub</h4><p className="mt-2 text-sm">The official student club of our college, organizing events, workshops and competitions all year round.</p>
          <div className="mt-4 flex gap-3"><Instagram size={18} /><Linkedin size={18} /><Github size={18} /></div></div>
        <div><h4 className="font-semibold text-white">Quick Links</h4><ul className="mt-2 space-y-1 text-sm"><li><Link to="/">Home</Link></li><li><Link to="/events">Events</Link></li><li><a href="/#about">About</a></li><li><Link to="/admin/login">Admin</Link></li></ul></div>
        <div><h4 className="font-semibold text-white">Contact</h4><p className="mt-2 flex items-center gap-2 text-sm"><Mail size={16} /> club@college.edu</p><p className="mt-1 text-sm">Your College Name, City, India</p></div>
      </div>
      <p className="border-t border-slate-800 py-4 text-center text-xs">© {new Date().getFullYear()} TechClub. All rights reserved.</p>
    </footer>
  );
}
