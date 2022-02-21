const express = require("express");
const router = express.Router();
const Birthday = require("../models/birthday");

router.get("/get_all_birthdays", async (req, res) => {
  await Birthday.find()
    .then((result) => res.send({ status: "ok", birthdays: result }))
    .catch(() =>
      res.send({
        status: "error",
        message:
          "It is not possible to get birthdays at this moment please try latter.",
      })
    );
});

router.get("/get_birthdays", async (req, res) => {
  const start = Number(req.query.start);
  const current = Number(req.query.current);
  const end = Number(req.query.end);

  await Birthday.aggregate([
    { $addFields: { month: { $month: "$birth_date" } } },
    { $match: { $or: [{ month: start }, { month: current }, { month: end }] } },
  ])
    .then((result) => res.send({ status: "ok", birthdays: result }))
    .catch(() =>
      res.status(500).send({
        status: "error",
        message:
          "It is not possible to get birthdays at this moment please try latter.",
      })
    );
});

router.post("/add_birthday", async (req, res) => {
  const birthday = new Birthday(req.body);

  await birthday
    .save()
    .then(() =>
      res.send({ status: "ok", message: "Birthday added successfully." })
    )
    .catch(() =>
      res.status(400).send({
        status: "error",
        message:
          "It is not possible to add birthday at this moment please check your phone and email.",
      })
    );
});

router.put("/update_birthday", async (req, res) => {
  const { id, name, birth_date, email, phone, title, description } = req.body;

  Birthday.findOne({ id }, async function (err, birthday) {
    birthday.name = name;
    birthday.birth_date = birth_date;
    birthday.email = email;
    birthday.phone = phone;
    birthday.title = title;
    birthday.description = description;

    await birthday
      .save()
      .then(() =>
        res.send({ status: "ok", message: "Birthday updated successfully.." })
      )
      .catch(() =>
        res.status(400).send({
          status: "error",
          message:
            "It is not possible to update birthday at this moment please try later..",
        })
      );
  });
});

router.delete("/delete_birthday", async (req, res) => {
  const id = req.query.id;

  Birthday.findOne({ id }, async function (err, birthday) {
    await birthday
      .delete()
      .then(() =>
        res.send({ status: "ok", message: "Birthday deleted successfully.." })
      )
      .catch(() =>
        res.status(500).send({
          status: "error",
          message:
            "It is not possible to delete birthday at this moment please try later..",
        })
      );
  });
});

router.get("/get_one_birthday", async (req, res) => {
  const id = req.query.id;

  Birthday.findOne({ id })
    .then((result) => res.send({ status: "ok", birthdays: result }))
    .catch(() =>
      res.status(500).send({
        status: "error",
        message:
          "It is not possible to get birthday at this moment please try latter.",
      })
    );
});

module.exports = router;
