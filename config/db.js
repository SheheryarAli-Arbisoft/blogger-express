const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get('mongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (err) {
    process.exit(1);
  }
};

module.exports = { connectDb };
