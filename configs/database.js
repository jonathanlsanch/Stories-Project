'use strict';

require("dotenv").config();

const mongoose = require('mongoose');
const dbName = 'stories-database';

// connect to the database
// mongoose.connect(`mongodb://localhost/${dbName}`);
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {  
  console.log(`Connected to the ${dbName} database`);
});