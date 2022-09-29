import  express  from "express";
import './database/connectdb.js';
import "dotenv/config";
import authRouter from './routes/auth.route.js'
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Servidor iniciado...✔👽😈");
});

