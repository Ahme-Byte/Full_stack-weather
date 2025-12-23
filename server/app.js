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

/* ---------- DATABASE CONNECTION ---------- 
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.qpst8rv.mongodb.net/weatherdb?retryWrites=true&w=majority`)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('MongoDB Error:', err.message));*/




// ---------- DATABASE CONNECTION ----------
const sanitizeEnv = (val = "") => val.replace(/^"(.*)"$/, "$1").trim();

// Hardcode username if env is unreliable
const mongoUser = "ahmipersonal05_db_user"; 
const mongoPass = sanitizeEnv(process.env.MONGODB_PASS || "");

if (!mongoPass) {
  console.error("MongoDB password is empty! Check Railway env variable MONGODB_PASS");
  process.exit(1); // stop server to avoid empty auth
}

const encodedPass = encodeURIComponent(mongoPass);
const mongoHost = "cluster0.qpst8rv.mongodb.net";
const dbName = "weatherdb";

console.log(`Connecting to MongoDB as user ${mongoUser}...`);

mongoose.connect(
  `mongodb+srv://${mongoUser}:${encodedPass}@${mongoHost}/${dbName}?retryWrites=true&w=majority`
)
.then(() => console.log("Database connected"))
.catch(err => console.error("MongoDB Error:", err.message));


/* ---------- PORT LISTENING ---------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
