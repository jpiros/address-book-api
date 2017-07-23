const mongoose = require('mongoose');

const Contact = mongoose.model('Contact', {
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  contactType: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Number,
    default: null
  }
});

module.exports = { Contact };