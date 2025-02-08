const express = require('express')
require('dotenv').config();
const userRoute = require("./routes/users")
const cartRoute = require("./routes/cart")
const reviewRoute = require("./routes/review")
const addressRoute = require("./routes/address")
const placeOrderRoute = require("./routes/placeOrders")
const ordersRoute = require("./routes/orders")
const invoiceRoute = require("./routes/invoice")
const contactUsRoute = require("./routes/contactUs")
const addProductsRoute = require("./routes/products")
const statusRoute = require("./routes/statusUpdate")
const subscribeRoute = require("./routes/subscribe")
const wishlistRoute = require("./routes/wishlist")
const ConnectToDb = require("./configs/connection");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors")
const socketIo = require("socket.io")
const http = require("http")

const app = express()
const port = process.env.PORT

// socket io 
const server = http.createServer(app)
const io = socketIo(server)

// connect to DB
ConnectToDb(process.env.MONGO_URL)

// middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Add cookie-parser and bodyparser middleware
app.use(cookieParser())
app.use(bodyParser.json())
const allowedOrigins = [process.env.FRONTEND_URL ,process.env.ADMIN_URL,process.env.FRONTEND_GIT ]
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    console.log("Incoming request origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));


// app.use(cors({ credentials: true, origin: "*" }));


// Attach io to the app to make it available in routes
app.set('io', io);


// routes
app.use("/api/users",userRoute)
app.use("/api/cart",cartRoute)
app.use("/api",reviewRoute)
app.use("/api/address",addressRoute)
app.use("/api/placeOrders",placeOrderRoute)
app.use("/api/orders",ordersRoute)
app.use("/api",contactUsRoute)
app.use("/api/products",addProductsRoute)
app.use("/api",statusRoute)
app.use("/api",invoiceRoute)
app.use("/api",subscribeRoute)
app.use("/api/wishlist",wishlistRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// Handle client connections with Socket.io
io.on("connection",(socket)=>{
  console.log("User Connected.")

  socket.on("disconection",()=>{
    console.log("User Disconected.")
  })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
