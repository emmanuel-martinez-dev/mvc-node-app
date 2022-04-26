const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: `./src/uploads/images` });
const fs = require("fs");

multer.diskStorage({
  filename: (req, file, cv) => {
    cb(null, file.originalname);
  },
});

function uniqueID() {
  return String(Math.floor(Math.random() * Date.now()));
}

let jsonTeams = fs.readFileSync("./src/data/teams.json", "utf-8");
let teams = JSON.parse(jsonTeams);

router.get("/", (req, res) => {
  res.render("main.handlebars", { layout: "index", teams, title: "Gran DT" });
});

router.get("/view/:id", (req, res) => {
  const id = req.params.id;
  const teamToShow = teams.find((team) => String(team.id) === String(id));
  res.render("view.handlebars", { layout: "index", teamToShow });
});

router.get("/form", (req, res) => {
  res.render("form.handlebars", { layout: "index", title: "New Team" });
});

router.post("/form", upload.single("crestUrl"), (req, res) => {
  const { name, address, phone, website, founded, venue } = req.body;

  let newTeam = {
    id: uniqueID(),
    name,
    address,
    phone,
    website,
    founded,
    venue,
    crestUrl: req.file.filename,
  };

  teams.unshift(newTeam);
  jsonTeams = JSON.stringify(teams);
  fs.writeFileSync("./src/data/teams.json", jsonTeams, "utf-8");
  res.render("success.handlebars", { layout: "index" });
});

router.get("/delete/:id", (req, res) => {
  teams = teams.filter((team) => team.id != req.params.id);
  const jsonTeams = JSON.stringify(teams);
  fs.writeFileSync("./src/data/teams.json", jsonTeams, "utf-8");
  res.render("deleted.handlebars", { layout: "index" });
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  teamToEdit = teams.find((team) => String(team.id) === String(id));
  res.render("edit.handlebars", { layout: "index", teamToEdit });
});

router.post("/edit/:id", upload.single("crestUrl"), (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const editedTeam = teams.find((team) => String(team.id) === String(id));

  const teamToRender = {
    id: editedTeam.id,
    name: body.name,
    address: body.address,
    phone: body.phone,
    website: body.website,
    founded: body.founded,
    venue: body.venue,
    crestUrl: req.file.filename,
  };

  teams = teams.filter((team) => team.id != id);
  teams.unshift(teamToRender);
  jsonTeams = JSON.stringify(teams);
  fs.writeFileSync("./src/data/teams.json", jsonTeams, "utf-8");
  res.render("success.handlebars", { layout: "index" });
});

module.exports = router;
