const router = require('express').Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/error');
const auth = require('../controllers/authController');
const club = require('../controllers/clubController');
const ev = require('../controllers/eventController');
const mem = require('../controllers/membershipController');
const reg = require('../controllers/registrationController');
const dash = require('../controllers/dashboardController');
const admin = [protect, adminOnly];
const CATS = ['Technical','Cultural','Sports','Workshop','Competition','Seminar','Other'];
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many attempts, try again later' } });

router.post('/auth/login', loginLimiter, [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')], validate, auth.login);
router.post('/auth/register', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')], validate, auth.register);
router.get('/auth/me', protect, auth.me);

const clubRules = [body('name').trim().notEmpty().withMessage('Club name is required'), body('category').isIn(CATS).withMessage('Invalid category'), body('description').trim().notEmpty().withMessage('Description is required')];
router.get('/clubs', club.list);
router.get('/clubs/:id', club.get);
router.post('/clubs', admin, clubRules, validate, club.create);
router.put('/clubs/:id', admin, clubRules, validate, club.update);
router.delete('/clubs/:id', admin, club.remove);

const eventRules = [
  body('club').notEmpty().withMessage('Club is required'),
  body('title').trim().notEmpty().withMessage('Event name is required'),
  body('category').isIn(CATS).withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('organizer').trim().notEmpty().withMessage('Organizer is required'),
  body('registrationDeadline').isISO8601().withMessage('Valid registration deadline required'),
  body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
];
router.get('/events', ev.list);
router.get('/events/stats', ev.publicStats);
router.get('/events/:id', ev.get);
router.post('/events', admin, eventRules, validate, ev.create);
router.put('/events/:id', admin, eventRules, validate, ev.update);
router.delete('/events/:id', admin, ev.remove);

const person = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('college').trim().notEmpty().withMessage('College is required'),
  body('year').isIn(['1st Year','2nd Year','3rd Year','4th Year']).withMessage('Select a valid year'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits'),
];
router.post('/memberships', [body('club').notEmpty().withMessage('Club is required'), ...person], validate, mem.create);
router.get('/memberships', admin, mem.list);
router.delete('/memberships/:id', admin, mem.remove);

router.post('/registrations', [body('event').notEmpty().withMessage('Event is required'), ...person], validate, reg.create);
router.get('/registrations', admin, reg.list);
router.get('/registrations/:id', admin, reg.get);
router.delete('/registrations/:id', admin, reg.remove);

router.get('/dashboard/stats', admin, dash.stats);
router.get('/dashboard/recent-events', admin, dash.recentEvents);
router.get('/dashboard/recent-registrations', admin, dash.recentRegistrations);
router.get('/dashboard/recent-members', admin, dash.recentMembers);
router.get('/dashboard/club-breakdown', admin, dash.clubBreakdown);
module.exports = router;
