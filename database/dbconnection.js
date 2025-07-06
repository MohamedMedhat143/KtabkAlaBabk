import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster.rknbn.mongodb.net/${process.env.DATABASE_NAME}`;
export const dbConn = connect(mongoURI)
  .then(() => {
    console.log("database connected*_*");
  })
  .catch((err) => console.log(err));
