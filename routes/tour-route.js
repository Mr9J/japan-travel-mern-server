const { tour } = require("../models");

const router = require("express").Router();
const Tour = require("../models").tour;
const tourValidation = require("../validation").tourValidation;

router.use((req, res, next) => {
  console.log("tour route request...");
  next();
});

//show all posted tour
router.get("/", async (req, res) => {
  try {
    let foundTour = await Tour.find({})
      .populate("publisher", ["username"])
      .exec();
    return res.send(foundTour);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//search tour by title
router.get("/searchTourByTitle/:title", async (req, res) => {
  let { title } = req.params;
  try {
    let tourFound = await Tour.find({ title: { $regex: title } });
    if (!tourFound) {
      return res.send("查無符合的行程資料...");
    }
    return res.send(tourFound);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//search tour by tour id
router.get("/searchTourByID/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let tourFound = await Tour.findOne({ _id })
      .populate("publisher", ["username"])
      .exec();
    if (!tourFound) {
      return res.send("查無符合的行程資料...");
    }
    return res.send(tourFound);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//search tour by user id
router.get("/user/:_publisher_id", async (req, res) => {
  let { _publisher_id } = req.params;
  let tourFind = await Tour.find({ publisher: _publisher_id })
    .populate("publisher", ["username"])
    .exec();
  return res.send(tourFind);
});

//show liked tour
router.get("/liked/:_liked_id", async (req, res) => {
  let { _liked_id } = req.params;
  let tourFound = await Tour.find({ liked: _liked_id })
    .populate("liked", ["username", "email"])
    .exec();
  return res.send(tourFound);
});

//post tour
router.post("/", async (req, res) => {
  //tour validation
  let { error } = tourValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //validation success
  let { title, description, budget } = req.body;
  try {
    let newTour = new Tour({
      title,
      description,
      budget,
      publisher: req.user._id,
    });
    let savedTour = await newTour.save();
    return res.send({ msg: "success", savedTour });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//comment
router.post("/comment/:_id", async (req, res) => {
  let { _id } = req.params;
  let { comment } = req.body;
  try {
    console.log(req.params);
    let foundTour = await Tour.findOne({ _id });
    foundTour.comment.push(comment);
    await foundTour.save();
    return res.send("完成");
  } catch (error) {
    return res.status(500).send(error);
  }
});

//like +1
router.post("/like/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let tour = await Tour.findOne({ _id });
    tour.liked.push(req.user._id);
    await tour.save();
    return res.send("完成");
  } catch (error) {
    return res.status(500).send("error");
  }
});

//update posted tour
router.patch("/:_id", async (req, res) => {
  // tour validate
  let { error } = tourValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //validate success
  let { _id } = req.params;
  let { title, description, budget } = req.body;
  try {
    let tourFound = await Tour.findOne({ _id });
    if (!tourFound) {
      return res.status(400).send("查無符合的行程資料...");
    }

    //check user auth
    if (tourFound.publisher.equals(req.user._id)) {
      let updatedTour = await Tour.findOneAndUpdate(
        { _id },
        { title: title, description: description, budget: budget },
        {
          new: true,
          runValidators: true,
        }
      );
      console.log(_id);
      console.log(req.body);
      return res.send({ msg: "行程已更新成功...", updatedTour });
    } else {
      return res.status(403).send("只有行程的發佈者才能編輯行程...");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

//delete posted tour
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let tourFound = await Tour.findOne({ _id }).exec();
    if (!tourFound) {
      return res.status(400).send("查無符合的行程資料...");
    }

    //check user auth
    if (tourFound.publisher.equals(req.user._id)) {
      await Tour.deleteOne({ _id }).exec();
      return res.send("行程已被刪除...");
    } else {
      return res.status(403).send("只有行程的發佈者才能刪除行程...");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
