// KOD
const express = require('express');
const cookieParser = require('cookie-parser');

const corsMiddleware = require('./src/middlewares/cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS + preflight
app.use(corsMiddleware());
app.options('*', corsMiddleware());

// routes
app.use('/api', require('./src/routers/api.router'));

module.exports = app;

