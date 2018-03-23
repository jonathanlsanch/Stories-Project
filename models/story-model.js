'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const storySchema = new mongoose.Schema({  
  category: { 
    type: String,
    required: [true, 'The story category is required']
  },
  title: {
    type: String,
    required: [true, 'The story title is required']
  },
  salutation: {
    type: String,
    required: [true, 'The story salutation is required']
  },
  recipient: {
    type: String,
    required: [true, 'The story recipient is required']
  },
  content: {
    type: String,
    required: [true, 'The story content is required']
  },
  signoff: {
    type: String,
    required: [true, 'The story sign off is required']
  },
  sender: {
    type: String,
    required: [true, 'The story sender is required']
  },
  
  
},

{
  timestamps: true
}
);

const Story = mongoose.model('Story', storySchema);

module.exports = Story;