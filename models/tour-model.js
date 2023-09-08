const mongoose = require("mongoose");
const { Schema } = mongoose;

const tourSchema = new Schema({
  id: { type: String },
  title: { type: String, maxlength: 30, required: true },
  description: { type: String, minlength: 30, required: true },
  budget: { type: Number, required: true },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  liked: {
    type: [String],
    default: [],
  },
  comment: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Tour", tourSchema);
