export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const toInputDate = d => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Competition', 'Seminar', 'Other'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const eventStatus = e => new Date(e.date) < new Date() ? 'Completed' : e.registrationOpen ? 'Open' : 'Closed';
