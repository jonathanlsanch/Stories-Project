var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
// const TYPES = require('../models/story-types');
const Story  = require('../models/story-model');

// create new story
router.post('/api/stories', (req, res, next) => {
  if(!req.user){
      res.status(401).json({message: "Log in to create story."});
      return;
  }
  const newStory = new Story({
    category: req.body.category,
    title: req.body.title,
    content: req.body.content
  });

  newStory.save((err) => {
      if(err){
          res.status(500).json({message: "Some weird error from DB."});
          return;
      }
      // validation errors
      if (err && newStory.errors){
          res.status(400).json({
              brandError: newStory.errors.title,
          });
          return;
      }
      req.user.encryptedPassword = undefined;
      newStory.user = req.user;

      res.status(200).json(newStory);
  });
});

// list the stories

router.get('/api/stories', (req, res, next) => {
  console.log("user in the route", req.user)
  if (!req.user) {
    res.status(401).json({ message: "Log in to see the stories." });
    return;
  }
  Story.find()
    // retrieve all the info of the owners (needs "ref" in model)
    // don't retrieve "encryptedPassword" though
    .populate('user', { encryptedPassword: 0 })
    .exec((err, allTheStories) => {
      console.log("stories in my backend", allTheStories)
      if (err) {
        res.status(500).json({ message: "Stories find went bad." });
        return;
      }
      res.status(200).json(allTheStories);
    });
});

// list single story
router.get("/api/stories/:id", (req, res, next) => {
if (!req.user) {
  res.status(401).json({ message: "Log in to see THE story." });
  return;
}
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  res.status(400).json({ message: "Specified id is not valid" });
  return;
}

Story.findById(req.params.id, (err, theStory) => {
  if (err) {
    //res.json(err);
    res.status(500).json({ message: "Stories find went bad." });
    return;
  }

  res.status(200).json(theStory);
});
});

// update the story
router.put('/api/stories/:id', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to update the story." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
  }

  const updates = {
      category: req.body.category,
      title: req.body.title,
      content: req.body.content
  };

Story.findByIdAndUpdate(req.params.id, updates, err => {
  if (err) {
    res.json(err);
    return;
  }

  res.json({
    message: "Story updated successfully."
  });
});
});

// delete a story
router.delete("/api/stories/:id", (req, res, next) => {
if (!req.user) {
  res.status(401).json({ message: "Log in to delete the story." });
  return;
}
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  res.status(400).json({ message: "Specified id is not valid." });
  return;
}

Story.remove({ _id: req.params.id }, err => {
  if (err) {
    res.json(err);
    return;
  }

  res.json({
    message: "Story has been removed."
  });
});
});


module.exports = router;
