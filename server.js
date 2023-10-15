const express = require("express");
const fortune = require("./lib/fortune");
//const app = express();
const { engine: expressHandlebars } = require("express-handlebars");
const bodyParser = require("body-parser");
const credentials = require("./config");
// const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// const fortunes = [
//     "Conquer your fears or they will conquer you.",
//     "Rivers need springs.",
//     "Do not fear what you don't know.",
//     "You will have a pleasant surprise.",
//     "Whenever possible, keep it simple.",
//     ]
// general middleware
app.use((req, res, next) => {
  console.log(`Solicitud recibida en: ${req.url}`);
  next();
});
//configure hadlebars by engine
const cookieParser = require("cookie-parser");
app.use(cookieParser(credentials.cookieSecret));
const expressSession = require("express-session");
const catNames = require("cat-names");
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
const port = process.env.port || 3000;

// app.get("/", (req, res) => {
//   res.type("text/plain");
//   res.send("news X");
// });
// app.get("/about", (req, res) => {
//   res.type("text/plain");
//   res.send("About news X");
// });
const tours = [
  { id: 0, name: "Hood River", price: 99.99 },
  { id: 1, name: "Oregon Coast", price: 149.95 },
];
app.use(express.static(__dirname + "/public"));
// app.use(cookieParser());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'ad',
  }))
  // req.session.userName = 'Anonymous'
// const colorScheme = req.session.colorScheme || 'dark'
// this is necessary to parse form responses
app.use(bodyParser.json());

app.get("/thank-you", (req, res) => res.render("thank-you"));
app.get("/headers", (req, res) => {
  res.type("text/plain");
  const headers = Object.entries(req.headers).map(
    ([key, value]) => `${key}: ${value}`
  );
  res.send(headers.join("\n"));
});
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => {
  // const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
  res.render("about", { fortune: fortune.getFortune() });
});
app.get("/text", (req, res) => {
  res.type("text/plain");
  res.cookie("monster", "nom nom");
  // res.cookie("signed_monster", "nom nom", { signed: true });
  res.send("this is a test");
});
app.get("/greeting", (req, res) => {
  res.render("greeting", {
    message: "Hello esteemed programmer!",
    style: req.query.style,
    userid: req.cookies.userid,
    username: req.session.username,
  });
});
app.get("/set-random-userid", (req, res) => {
  res.cookie("userid", (Math.random() * 10000).toFixed(0));
  res.redirect("/greeting");
});

app.get("/set-random-username", (req, res) => {
  req.session.username = catNames.random();
  res.redirect("/greeting");
});
app.get("/custom-layout", (req, res) =>
  res.render("custom-layout", { layout: "custom" })
);
// app.get('/api/tours', (req, res) => res.json(tours))
app.get("/api/tours", (req, res) => {
  const toursXml =
    '<?xml version="1.0"?><tours>' +
    tours
      .map((p) => `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`)
      .join("") +
    "</tours>";
  const toursText = tours
    .map((p) => `${p.id}: ${p.name} (${p.price})`)
    .join("\n");
  res.format({
    // en postman cambiar el header a accept y poner xml o text o json y asi devuelve lo que queramos
    "application/json": () => res.json(tours),
    "application/xml": () => res.type("application/xml").send(toursXml),
    "text/xml": () => res.type("text/xml").send(toursXml),
    "text/plain": () => res.type("text/plain").send(toursXml),
  });
});
app.put("/api/tour/:id", (req, res) => {
  const myItem = tours.find((p) => p.id === parseInt(req.params.id));
  if (!myItem) {
    return res.status(404).json({ error: "No such file or directory" });
  }
  if (req.body.name) myItem.name = req.body.name;
  if (req.body.price) myItem.price = req.body.price;
  res.status(201);
  res.json({ message: "Uptaded succesfully!", success: true, data: myItem });
});
// delete option
app.delete("/api/tour/:id", (req, res) => {
  const indMyItem = tours.findIndex(
    (elem) => elem.id === parseInt(req.params.id)
  );
  if (indMyItem < 0) {
    return res.status(404).json({ error: "No such tour exist" });
  } else {
    tours.splice(indMyItem, 1);
  }
  // res.status(204).json({data: tours, message: 'deleted succesfully'}) // quitar el res.status para que se logre mostrar el data y mensaje
  res.json({ message: "Deleted successfully", success: true }); // no usar 204 ya que por norma bloquea cualquier contenido como respuesta. se puede usar el 200.json(...)
});
app.post("/process-contact", (req, res) => {
  console.log(`received contact from ${req.body.name} <${req.body.email}>`);
  res.redirect(303, "/thank-you");
});
//custon 404 page
app.use((req, res) => {
  res.status(404);
  res.render("404");
});
// custom 500 page
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
});

app.listen(port, () => {
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  );
});
