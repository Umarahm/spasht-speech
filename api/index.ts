import serverless from 'serverless-http';
import { createServer } from '../backend/dist/server/index.js';

// Create the Express app from our backend
const app = createServer();

// Export a Vercel-compatible handler
export default serverless(app);


