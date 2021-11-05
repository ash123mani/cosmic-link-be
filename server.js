require('dotenv').config({ path: './config.env' })
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

//Connect DB
connectDB();

const app = express();

app.use(express.json());

app.use("/api/v1/auth", require('./routes/auth'));
app.use("/api/v1/private", require('./routes/private'));

// Error Handler (Should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error ${err}`);
  server.close(() => process.exit(1));
})

 