//external modules
const express = require("express");
const path = require("path");
const pug = require("pug");

//my own stuff
const router = require("./routes/routes")

const app = express();

//allow usage of pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
//

app.get("/", router.landing);
app.get("/playlist", router.playlists});
app.get("/playlist/:id", router.options);
app.get("/creating", router.creation);
app.get("/success", router.success);
app.get("/failure", router.failure);

console.log("Listening on 8888");
app.listen(8888);
