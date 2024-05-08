const express = require('express')
const mongoose = require("mongoose")
const product = require('./routes/product')
const auth = require('./routes/auth')
const message = require('./routes/messages')
const cors = require('cors')
const {app, server} = require('./utils/socket')
require('dotenv').config()
const port = process.env.PORT || 2000

// const corsOptions = {
//     origin:['https://golden-meringue-9c68e5.netlify.app','http://localhost:5173'],
//     credentials: true 
//   };

const allowedOrigins = [
    'https://golden-meringue-9c68e5.netlify.app',
    'http://localhost:5173' // Add your local development origin if needed
  ];
  
  const corsOptions = {
    origin: function(origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
