import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());          // lets your React app call this API later
app.use(express.json());  // lets Express read JSON sent in requests

// Health check: tells us the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'FitFinder API is running' });
});

export default app;