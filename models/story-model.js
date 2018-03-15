'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const TYPES = require('./story-types');

const storySchema = new mongoose.Schema({  
  category: { 
    type: String,
    enum: TYPES,
    required: true 
  },
  title: {
    type: String,
    required: [true, 'The story title is required']
  },
  content: {
    type: String,
    required: [true, 'The story name is required']
  }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;