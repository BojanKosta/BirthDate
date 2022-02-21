const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const birthdaySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
    birth_date: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Birthday = mongoose.model("birthday", birthdaySchema);

module.exports = Birthday;
