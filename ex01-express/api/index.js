import userRouter from "./routes/user.js";      // <-- singular
import messageRouter from "./routes/message.js";

app.use("/user", userRouter);
app.use("/message", messageRouter);
