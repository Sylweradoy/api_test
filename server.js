const env = require("./app/config/config");
const app = require("./app/app");
const connectDB = require('./app/db/connect');
const  mongoose = require('mongoose');


(async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running http://localhost:${env.PORT}`);
    console.log('Mongo readyState:', mongoose.connection.readyState);
  });
})();