require("dotenv").config();
require("./service/connect-mult-mogoose.js");
const express = require("express");

const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const RouterAccount = require("./routers/Account.js");
const RouterFlight = require("./routers/RouterFlight.js");
const RouterBotHandleFlight = require("./routers/RouterBotHandleFlight.js");
const RouterDH = require("./routers/RouterOrder.js");
const RouterStatistics = require("./routers/Statistics.js");
const RouterMoMo = require("./routers/PayMomo.js");
const RouterPaypal = require("./routers/Paypal.js");
const RouterVietQR = require("./routers/VietQR.js");
const RouterPayment = require("./routers/Payment.js");
const RouterScrape = require("./scrapers/routerScrapeFlight.js");
const cors = require("cors");
const { authorization } = require("./middleware/authorization.js");
const checkAdmin = require("./middleware/checkAdmin.js");
const http = require("http");
const { CreateServer } = require("./Socket/connect-socket-client.js");
const { sessionMiddleware } = require("./service/sessionMiddleware.js");

const app = express();

// use Cookie
app.use(cookieParser());

/* Allow CORS
CORS sẽ cho phép nhận cookie từ request*/
const allowedOrigins = [
  "https://travfruit.netlify.app/",
  "https://travfruit.netlify.app",
  "https://travfruit.vercel.app/",
  "https://travfruit.vercel.app",
  "https://travfruitadmin.vercel.app/",
  "https://travfruitadmin.vercel.app",
  "https://travfruitadmin.netlify.app/",
  "https://travfruitadmin.netlify.app",
  "http://localhost:3000/",
  "http://localhost:3000",
  "http://localhost:5173/",
  "http://localhost:5173",
  "https://travfruitv4.vercel.app/",
  "https://travfruitv4.vercel.app",
  "https://travfruitv3admin.vercel.app/",
  "https://travfruitv3admin.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(sessionMiddleware);

app.use(helmet());
app.use(express.json());

app.use(RouterScrape);
app.use(RouterMoMo);
app.use("/paypal", authorization, RouterPaypal);
app.use("/vietqr", authorization, RouterVietQR);
app.use("/payment", authorization, RouterPayment);
app.use("/flights", RouterFlight);
app.use("/bot/flights", RouterBotHandleFlight);
app.use("/user", RouterAccount);
app.use("/order", authorization, RouterDH);
app.use("/statistics", RouterStatistics);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

const server = http.createServer(app);
CreateServer(server, allowedOrigins);

server.listen(process.env.PORT, () => {
  console.log("Listening port 4001");
});
