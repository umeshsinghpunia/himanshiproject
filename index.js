const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()
const cors=require('cors')

const app = express();
const port = process.env.PORT || 8001;
const {DB_PASS,DB_USER}=process.env


// middleware
app.use(express.json())
app.use(cors())
app.use('/images', express.static('assets/images'))

// db connection
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ws9ea.mongodb.net/project?retryWrites=true&w=majority`,(err)=>{
    if(err) return console.log('Err',err);
    console.log('db connected');
})

// routes
app.use("/",express.static("public"))
app.use('/api/admin/user/',require('./routes/user.routes'))
app.use("/api/admin/category/",require("./routes/category.routes"))
app.use("/api/admin/product/",require("./routes/product.routes"))
app.use("/api/front/",require("./routes/front.routes"))

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
