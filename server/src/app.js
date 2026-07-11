import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
