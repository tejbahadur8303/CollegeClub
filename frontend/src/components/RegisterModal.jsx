import { useState } from 'react';
import toast from 'react-hot-toast';

import { Modal } from './ui';
import { registerForEvent, joinClub, errMsg } from '../services/api';
import { YEARS } from '../utils/format';

// Reusable Field component MUST be outside RegisterModal
function Field({
  label,
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <div>
      <label className="label">{label}</label>

      <input
        className={`input ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
            : ''
        }`}
        value={value}
        onChange={onChange}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Pass `event` to register for an event,
// or `club` to join a club.
export default function RegisterModal({
  event,
  club,
  onClose,
  onDone,
}) {
  const isClub = !!club;
  const item = club || event;

  const [f, setF] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    phone: '',
  });

  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  // Functional state update prevents stale state issues
  const set = (key) => (e) => {
    const value = e.target.value;

    setF((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Remove error while user is correcting the field
    if (errs[key]) {
      setErrs((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const validate = () => {
    const x = {};

    if (!f.name.trim()) {
      x.name = 'Name is required';
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      x.email = 'Enter a valid email';
    }

    if (!f.college.trim()) {
      x.college = 'College is required';
    }

    if (!f.year) {
      x.year = 'Select your year';
    }

    if (!/^\d{10}$/.test(f.phone)) {
      x.phone = 'Phone must be exactly 10 digits';
    }

    setErrs(x);

    return Object.keys(x).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setBusy(true);

    try {
      const r = await (
        isClub
          ? joinClub({
              ...f,
              club: club._id,
            })
          : registerForEvent({
              ...f,
              event: event._id,
            })
      );

      setDone(r);

      toast.success(
        isClub
          ? 'Joined club successfully'
          : 'Registration successful'
      );

      onDone?.();
    } catch (er) {
      toast.error(errMsg(er));
    } finally {
      setBusy(false);
    }
  };

  // ================= SUCCESS STATE =================

  if (done) {
    return (
      <Modal title="" onClose={onClose}>
        <div className="text-center">

          <p className="text-5xl">🎉</p>

          <h3 className="mt-3 text-xl font-bold text-slate-900">
            {isClub
              ? 'Welcome to the club!'
              : 'Registration Successful!'}
          </h3>

          <p className="mt-3 text-slate-600">
            {isClub
              ? 'You have successfully joined:'
              : 'You are successfully registered for:'}
          </p>

          <p className="mt-1 font-semibold text-indigo-700">
            {isClub ? done.clubName : done.eventTitle}
          </p>

          {!isClub && (
            <p className="text-sm text-slate-500">
              Organized by {done.clubName}
            </p>
          )}

          <p className="mt-3 text-sm text-slate-500">
            {isClub
              ? 'We will keep you posted about upcoming events.'
              : 'We look forward to seeing you at the event.'}
          </p>

          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isClub ? 'Membership ID' : 'Registration ID'}
            </p>

            <p className="mt-1 text-lg font-bold tracking-wider text-indigo-700">
              {done.membershipId || done.registrationId}
            </p>
          </div>

          <button
            className="btn-primary mt-5 w-full"
            onClick={onClose}
          >
            Done
          </button>

        </div>
      </Modal>
    );
  }

  // ================= FORM =================

  return (
    <Modal
      title={
        isClub
          ? `Join ${item.name}`
          : `Register: ${item.title}`
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-4"
        noValidate
      >

        {/* Full Name */}
        <Field
          label="Full Name"
          value={f.name}
          onChange={set('name')}
          error={errs.name}
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
        />

        {/* Email */}
        <Field
          label="Email"
          value={f.email}
          onChange={set('email')}
          error={errs.email}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />

        {/* College */}
        <Field
          label="College"
          value={f.college}
          onChange={set('college')}
          error={errs.college}
          type="text"
          autoComplete="organization"
          placeholder="Enter your college name"
        />

        {/* Year */}
        <div>
          <label className="label">
            Year
          </label>

          <select
            className={`input ${
              errs.year
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : ''
            }`}
            value={f.year}
            onChange={set('year')}
          >
            <option value="">
              Select year
            </option>

            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {errs.year && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errs.year}
            </p>
          )}
        </div>

        {/* Phone */}
        <Field
          label="Phone Number"
          value={f.phone}
          onChange={set('phone')}
          error={errs.phone}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
          placeholder="Enter 10-digit phone number"
        />

        {/* Club / Event ID */}
        <div>
          <label className="label">
            {isClub ? 'Club ID' : 'Event ID'}
          </label>

          <input
            className="input cursor-not-allowed bg-slate-100 text-slate-500"
            value={item._id}
            readOnly
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={busy}
        >
          {busy
            ? 'Submitting...'
            : isClub
              ? 'Join Club'
              : 'Register Now'}
        </button>

      </form>
    </Modal>
  );
}