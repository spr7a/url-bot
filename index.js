const express = require("express");
require('dotenv').config();
const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')
const URL = require('./models/url');
const path = require("path");
const staticRoute = require("./routes/staticRouter");
const userRoute=require("./routes/user");
const app = express();
const PORT = 8001;

app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

connectToMongoDB(process.env.MONGODB_URL)
.then (()=> console.log("MongoDB connected"));
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});
app.use(express.urlencoded({ extended: false }));

app.use(express.json())
app.use("/url" , urlRoute);
app.use("/",staticRoute);
app.use("/",userRoute);


app.get("/test",async(req,res)=>{
  const allUrls=await URL.find({});
  return res.render("home",{
    urls:allUrls
  });
});

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId : shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    res.redirect(entry.redirectURL);
 });

app.listen(PORT , ()=> console.log(`Server started at port : ${PORT}`))