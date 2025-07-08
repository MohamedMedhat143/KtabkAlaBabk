import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = `mongodb://localhost:27017/${process.env.DATABASE_NAME}`;
export const dbConn = connect(mongoURI)
  .then(() => {
    console.log("database connected*_*");
  })
  .catch((err) => console.log(err));
