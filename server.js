const express = require("express");
const mongoose = require("mongoose");

const connectionUrl = "mongodb+srv://Cluster09960:bmVkUHVaTGto@cluster09960.w2t3fr0.mongodb.net/?retryWrites=true&w=majority";

const app = express();

const Err = require("./models/HttpError");

/* For parsing application/json */
app.use(express.json());

/* For parsing application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/* serves static assets */
app.use(express.static('client/build'));
// app.use(express.static(path.join("client", "build")));

app.use((req, res, next) => {
    if (!res.headersSent) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, PATCH, DELETE");
    }
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

const routes = require("./routes");
app.use("/", routes);

/* 404 handling for unsupported routes */
// app.use((req, res, next) => {
//     next(new Err("Could not find this route", 404));
// });

/* error handling - all http errors are parsed through here */
app.use((er, req, res, next) => {
    if (res.headersSent) {
        return next(er);
    }
    res.status(er.code || 500);
    res.json({message: er.message + "===testing" || "test - An unknown error occurred!", er: er});
})

mongoose.connect(connectionUrl).then(
    () => console.log("Connected to database successfully"),
    er => console.log("connection failed", er)
);

app.listen(5000);