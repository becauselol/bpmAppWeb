//external modules
const express = require("express");
const path = require("path");
const pug = require("pug");
const mongoose = require("mongoose")

//my own stuffs
const router = require("./routes/routes")

const app = express();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(() => {
	console.log('DB connection successful');
}).catch(err => {
	console.log(err);
});

//allow usage of pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
//

app.get("/", router.landing);
app.get("/authsuccess", router.auth);
app.get("/playlist/:user", router.playlist)
app.get("/playlist/:user/:id", router.options);
app.get("/creating", router.creation);
app.get("/success", router.success);
app.get("/failure", router.failure);

console.log("Listening on 8888");
app.listen(8888);
