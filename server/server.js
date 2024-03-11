require("dotenv").config();
const express = require("express");
const dbConnection = require("./database/connect");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const equbRoutes = require("./routes/equbRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const lotteryRoutes = require("./routes/lotteryRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

dbConnection();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equbs", equbRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/lottery", lotteryRoutes);

// Middleware for handling 404 errors (Not Found)
app.use(notFound);

// Middleware for handling other errors
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
