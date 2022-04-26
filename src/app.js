const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const hbs = exphbs.create();

app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.use(express.json());
app.use(express.static(`${__dirname}/uploads`));
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes/index"));

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;
