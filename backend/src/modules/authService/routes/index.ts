import express from 'express';
const router = express.Router();

// Import routes
import registerRoute from './register.route';

// Connect routes
registerRoute(router);

// Export router
export default router;