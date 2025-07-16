import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    costs: [
      {
        city: String,
        price: Number,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export const Shipment = mongoose.model("Shipment", schema);
