const express = require("express");
//const app = express();
const { engine: expressHandlebars } = require("express-handlebars");
const app = express();
const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
    ]
//configure hadlebars by engine
app.engine(
  "handlebars", expressHandlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
const port = process.env.port || 3000

// app.get("/", (req, res) => {
//   res.type("text/plain");
//   res.send("news X");
// });
// app.get("/about", (req, res) => {
//   res.type("text/plain");
//   res.send("About news X");
// });
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))
app.get('/about', (req, res) => {
    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    res.render('about', { fortune: randomFortune })
})
//custon 404 page
app.use((req, res) => {
    res.status(404)
    res.render('404')
    })
// custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
    })

app.listen(port, () => {
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  );
});
