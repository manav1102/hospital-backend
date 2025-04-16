const mongoose = require('mongoose');
const dotenv = require('dotenv');
 
dotenv.config();
 
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
 
mongoose.connection.on('connected', () => console.log('Connected Backend'));
mongoose.connection.on('error', (err) => console.log('Connection failed with - ', err));

// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// // Connect to MongoDB (no need for useNewUrlParser or useUnifiedTopology)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected Backend'))
//   .catch((err) => console.log('Connection failed with - ', err));

