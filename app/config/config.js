require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3007),
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
};

if (!env.JWT_SECRET) throw new Error('Missing JWT_SECRET in env');
if (!env.MONGO_URI) throw new Error('Missing MONGO_URI in env');

module.exports = env;