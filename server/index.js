const express = require('express');
const mongoose = require('mongoose');
const product = require('./routes/product');
const auth = require('./routes/auth');
const message = require('./routes/messages');
const cors = require('cors');
const { app, server } = require('./utils/socket');
require('dotenv').config();
const port = process.env.PORT || 2000;

const allowedOrigins = [
  'https://s47-dhruv-capstone-2-crafters-hub.vercel.app',
  // other allowed origins can be added here
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOOSE_URL, {
  dbName: 'CraftersHub',
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(err);
});

app.use('/product', product);
app.use('/', auth);
app.use('/message', message);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
