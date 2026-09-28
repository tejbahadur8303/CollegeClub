require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin'), Club = require('../models/Club'), Event = require('../models/Event'), Registration = require('../models/Registration'), Membership = require('../models/Membership');
const day = n => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0, 0, 0, 0); return d; };
const ago = n => new Date(Date.now() - n * 864e5 - Math.random() * 36e5);
const clubs = [
  ['CodeCraft Club', 'Technical', 'Coding, hackathons, open source and developer meetups.'],
  ['RoboVerse', 'Technical', 'Robotics, IoT and drones: build machines that move.'],
  ['Rhythm & Beats', 'Cultural', 'Music, dance and drama: the stage is yours.'],
  ['Lens & Light', 'Cultural', 'Photography, videography and film-making community.'],
  ['E-Cell', 'Seminar', 'Entrepreneurship cell: startups, pitches and founder talks.'],
  ['Gladiators Sports Council', 'Sports', 'Cricket, football, athletics and inter-department tournaments.'],
];
// [club, title, category, description, seed, startOffset, time, venue, organizer, deadlineOffset, max, featured]
const events = [
  ['CodeCraft Club', 'HackStorm 2026', 'Competition', '24-hour hackathon. Form teams, build real products and pitch to industry mentors for exciting prizes.', 'hackstorm', 20, '09:00 AM', 'Innovation Lab', 'CodeCraft Club', 18, 120, true],
  ['CodeCraft Club', 'Code Warriors', 'Competition', 'Competitive programming contest with algorithmic problems for all skill levels.', 'codewar', 6, '02:00 PM', 'Computer Lab 3', 'CodeCraft Club', 5, 80, false],
  ['CodeCraft Club', 'AI & Future Workshop', 'Workshop', 'Hands-on workshop on machine learning basics, generative AI tools and careers.', 'aiworkshop', 9, '11:00 AM', 'Seminar Hall B', 'CodeCraft Club', 8, 60, false],
  ['RoboVerse', 'RoboRace Challenge', 'Competition', 'Build a line-following bot and race it against the best teams on campus.', 'roborace', 14, '10:00 AM', 'Robotics Arena', 'RoboVerse', 12, 50, false],
  ['RoboVerse', 'IoT Build Day', 'Workshop', 'Build a smart-home prototype with sensors and microcontrollers in one day.', 'iot', 25, '10:30 AM', 'Electronics Lab', 'RoboVerse', 23, 40, false],
  ['Rhythm & Beats', 'Cultural Night', 'Cultural', 'An evening of music, dance, drama and stand-up by talented students.', 'culture', 30, '06:00 PM', 'Open Air Theatre', 'Rhythm & Beats', 27, 500, false],
  ['Rhythm & Beats', 'Battle of Bands', 'Competition', 'Bands compete live for the campus title and a recording session.', 'bands', 17, '05:00 PM', 'Main Auditorium', 'Rhythm & Beats', 15, 100, false],
  ['Lens & Light', 'Photo Walk & Editing Masterclass', 'Workshop', 'Shoot around campus, then learn professional editing workflows.', 'photowalk', 11, '07:00 AM', 'Campus Gate 1', 'Lens & Light', 10, 30, false],
  ['E-Cell', "Founders' Panel", 'Seminar', 'Alumni founders share journeys, failures and lessons in an open Q&A.', 'startup', -15, '04:00 PM', 'Main Auditorium', 'E-Cell', -17, 200, false],
  ['Gladiators Sports Council', 'Inter-Department Sports Championship', 'Sports', 'Cricket, football, basketball and athletics: department vs department.', 'sports', 40, '08:00 AM', 'College Sports Ground', 'Gladiators Sports Council', 35, 400, false],
];
const students = [
  ['Aarav Sharma', 'aarav@example.com', 'ABES Engineering College', '3rd Year', '9876543210'],
  ['Priya Singh', 'priya@example.com', 'ABES Engineering College', '2nd Year', '9876543211'],
  ['Rohan Verma', 'rohan@example.com', 'AKGEC Ghaziabad', '4th Year', '9876543212'],
  ['Ananya Gupta', 'ananya@example.com', 'KIET Group', '1st Year', '9876543213'],
  ['Kabir Mehta', 'kabir@example.com', 'ABES Engineering College', '3rd Year', '9876543214'],
  ['Sneha Rao', 'sneha@example.com', 'IMS Ghaziabad', '2nd Year', '9876543215'],
  ['Vikram Yadav', 'vikram@example.com', 'AKGEC Ghaziabad', '3rd Year', '9876543216'],
  ['Neha Joshi', 'neha@example.com', 'KIET Group', '4th Year', '9876543217'],
];
const joins = [[0, 'CodeCraft Club', 5], [1, 'CodeCraft Club', 4], [2, 'RoboVerse', 4], [3, 'Rhythm & Beats', 3], [4, 'CodeCraft Club', 2], [4, 'Gladiators Sports Council', 2], [5, 'Lens & Light', 1], [6, 'E-Cell', 1], [7, 'Rhythm & Beats', 0]];
const regs = [[0, 'HackStorm 2026', 5], [1, 'HackStorm 2026', 4], [0, 'Code Warriors', 3], [2, 'RoboRace Challenge', 3], [3, 'Cultural Night', 2], [4, 'AI & Future Workshop', 2], [5, 'Photo Walk & Editing Masterclass', 1], [7, 'Battle of Bands', 0], [6, 'Inter-Department Sports Championship', 0]];
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Admin.deleteMany(), Club.deleteMany(), Event.deleteMany(), Registration.deleteMany(), Membership.deleteMany()]);
  await Admin.create({ name: 'Club Admin', email: 'admin@collegeclub.com', password: 'Admin@123' });
  const C = {}; for (const [name, category, description] of clubs) C[name] = await Club.create({ name, category, description });
  const E = {};
  for (const [club, title, category, description, seed, off, time, venue, organizer, dl, max, featured] of events)
    E[title] = await Event.create({ club: C[club]._id, title, category, description, image: `https://picsum.photos/seed/${seed}/900/500`, date: day(off), time, venue, organizer, registrationDeadline: day(dl), maxParticipants: max, featured });
  const S = students.map(([name, email, college, year, phone]) => ({ name, email, college, year, phone }));
  for (const [i, club, d] of joins) { await Membership.create({ ...S[i], club: C[club]._id, joinedAt: ago(d) }); await Club.updateOne({ _id: C[club]._id }, { $inc: { memberCount: 1 } }); }
  for (const [i, title, d] of regs) { await Registration.create({ ...S[i], event: E[title]._id, club: E[title].club, registeredAt: ago(d) }); await Event.updateOne({ _id: E[title]._id }, { $inc: { registrationCount: 1 } }); }
  console.log(`Seeded ${clubs.length} clubs, ${events.length} events, ${joins.length} memberships, ${regs.length} registrations.\nAdmin: admin@collegeclub.com / Admin@123`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
