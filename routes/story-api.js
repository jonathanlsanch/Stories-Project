var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { ensureLoggedIn }    = require('connect-ensure-login');
const Story = require('../models/story-model');

/* GET Stories listing. */
router.get('/stories', (req, res, next) => {
  Story.find((err, storiesList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(storiesList);
  });
});

/* CREATE a new Story. */
router.post('/stories', ensureLoggedIn('/login'), (req, res, next) => {
    const theStory = new Story({
      title: req.body.title,
      content: req.body.content
        // This will throw an error is there's no
        // User to associate the story with
        // _creator: req.user._id
    });
  
    theStory.save((err) => {
      if (err) {
        res.json(err);
        return;
      }
  
      res.json({
        message: 'New Story created!',
        id: theStory._id
      });
    });
  });

  /* GET a single Story. */
router.get('/stories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Story.findById(req.params.id, (err, theStory) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theStory);
    });
});

/* EDIT a Story. */
router.put('/stories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    title: req.body.title,
    content: req.body.content
  };
  
  Story.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Story updated successfully'
    });
  });
})

/* DELETE a Story. */
router.delete('/stories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Story.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'Story has been removed!'
    });
  })
});

module.exports = router;