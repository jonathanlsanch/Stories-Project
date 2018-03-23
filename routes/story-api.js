var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
const Story  = require('../models/story-model');


//find latest story
router.get('/api/stories/latest', (req, res, next) => {
  console.log("trying")
  if (!req.user) {
    res.status(401).json({ message: "Log in to see the stories." });
    return;
  }

  Story .findOne()
  .sort('-createdAt')  // give me the max
  .exec(function (err, member) {
    if (err) {
      res.status(500).json({ message: "Stories find went bad." });
      return;
    }

    res.status(200).json(member);
    // your callback code

  });
  });
  
  
  






// router.get('/api/stories/latest', (req, res, next) => {
//   console.log("trying bro")
  
//   Story.findOne()
//   .then(function(err, theStory) {
//     console.log("the STORY")
//     console.log(theStory)
//     res.json(theStory);
//   });
  
// });



// create new story
router.post('/api/stories', (req, res, next) => {
  if(!req.user){
      res.status(401).json({message: "Log in to create story."});
      return;
  }
  const newStory = new Story({
    category: req.body.category,
    title: req.body.title,
    salutation: req.body.salutation,
    recipient: req.body.recipient,
    content: req.body.content,
    signoff: req.body.signoff,
    sender: req.body.sender
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
      // console.log("stories in my backend", allTheStories)
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
    salutation: req.body.salutation,
    recipient: req.body.recipient,
    content: req.body.content,
    signoff: req.body.signoff,
    sender: req.body.sender
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
