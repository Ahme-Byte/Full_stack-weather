const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/user');
// Only use dotenv in local development

/* ---------- MIDDLEWARE ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS (safe config)
app.use(cors({
  origin: [
    'https://fullstack-weather-copy-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));




/* ---------- STATIC FRONTEND ---------- */
app.use(express.static(path.join(__dirname, '../client/dist')));

/* ---------- API ROUTES ---------- */
app.use('/user', userRouter);

/* ---------- FRONTEND FALLBACK (Express 5 compatible) ---------- */
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong'
  });
});
const PORT = process.env.PORT || 8080;

//connecting database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpst8rv.mongodb.net/weatherdb?appName=Cluster0`)
  .then(() =>{console.log('Database connected')
             /* ---------- PORT LISTENING ---------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})}
).catch(err => console.error('MongoDB Error:', err.message)); 


