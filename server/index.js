const express = require('express')
const mongoose = require("mongoose")
const product = require('./routes/product')
const auth = require('./routes/auth')
const message = require('./routes/messages')
const cors = require('cors')
const {app, server} = require('./utils/socket')
require('dotenv').config()
const port = process.env.PORT || 2000


const allowedOrigins = [
  'https://crafters-hub.netlify.app/',
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));
  
mongoose.connect(process.env.MONGOOSE_URL,{
    dbName:"CraftersHub"
}).then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.log(err);
})

app.use('/product',product)
app.use('/',auth)
app.use('/message',message)


server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})
