import express from 'express';
const router = express.Router();

// Import routes
import authRoute from './auth.route';
import registerRoute from './register.route';
import eventRoute from './event.route';

// Connect routes
authRoute(router);
registerRoute(router);
eventRoute(router);

// Export router
export default router;