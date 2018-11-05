const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const userRoutes = require('./api/routes/user');
const clientRoutes = require("./api/routes/clients");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));

mongoose.connect("mongodb+srv://travel:" +
process.env.MONGO_ATLAS_PW +
"@travel-7wbfg.mongodb.net/test?retryWrites=true",
{
    useCreateIndex: true,
    useNewUrlParser: true
    
})


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use("/products", productRoutes);
app.use("/user", userRoutes);
app.use("/clients", clientRoutes);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;