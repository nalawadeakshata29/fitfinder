import express from 'express';
import cors from 'cors';
import brandsRouter from './routes/brands.js';
import recommendRouter from './routes/recommend.js';
import swaggerUi from 'swagger-ui-express';
import openapi from './docs/openapi.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FitFinder API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/brands', brandsRouter);
app.use('/api/v1/recommend', recommendRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
// Catch-all for unknown URLs
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Catch-all for crashes, so the server never leaks a stack trace
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});


export default app;