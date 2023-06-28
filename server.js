const express = require("express");
const mongoose = require("mongoose");

const connectionUrl = process.env.ATLAS_CONNECTION_STRING_1 + process.env.ATLAS_USERNAME + process.env.ATLAS_CONNECTION_STRING_2 + process.env.ATLAS_PASSWORD + process.env.ATLAS_CONNECTION_STRING_3;

const app = express();

/* For parsing application/json */
app.use(express.json());

/* For parsing application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/* serves static assets */
app.use(express.static('client/build'));
// app.use(express.static(path.join("client", "build")));

/* headers to resolve CORS issues in development */
// app.use((req, res, next) => {
//     if (!res.headersSent) {
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//         res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, PATCH, DELETE");
//     }
//     if (req.method === "OPTIONS") {
//         return res.status(200).end();
//     }
//     next();
// });

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
    res.json({message: er.message + " An unknown error occurred!", er: er});
})

mongoose.connect(connectionUrl).then(
    () => console.log("Connected to database successfully"),
    er => console.log("connection failed", er)
);

app.listen(process.env.PORT || 5000);