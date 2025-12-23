const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/user');
// Only use dotenv in local development


console.log("ENV MONGODB_URL:", process.env.MONGODB_URL);
if (!process.env.MONGODB_URL) {
  console.error("MongoDB URL is undefined! Check Railway env variables and Docker runtime.");
}


/* ---------- MIDDLEWARE ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS (safe config)
app.use(cors({
  origin: true,    // allow requests from any domain (frontend domain optional)
  credentials: false
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

/* ---------- DATABASE CONNECTION ---------- */
mongoose.connect(`${process.env.MONGODB_URL}`)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('MongoDB Error:', err.message));

/* ---------- PORT LISTENING ---------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
