const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { connectDb };
