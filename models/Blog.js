const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('blog', BlogSchema);
