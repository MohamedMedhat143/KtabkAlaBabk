import { mongoose, Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    orderItems: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: Number,
        price: Number,
      },
    ],

    receiptImage: String,

    receiptImageId: String,

    senderNumber: String,

    totaOrderlWeight: Number,

    totalOrderPrice: Number,

    // ShippingAddress: {
    //   city: String,
    //   street: String,
    //   phone: String,
    // },

    isPaid: {
      type: Boolean,
      default: false,
    },

    isCheacked: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { versionKey: false, timestamps: true }
);

schema.post("init", (doc) => {
  const baseURL = "https://ik.imagekit.io/papyrus/Books/ReceiptImage/";
  if (doc.receiptImage) {
    if (doc.receiptImage && !doc.receiptImage.startsWith("http")) {
      doc.receiptImage = baseURL + doc.receiptImage;
    } else if (!doc.receiptImage) {
      doc.receiptImage = baseURL + "default.jpg";
    }
  }
});
export const Order = mongoose.model("Order", schema);
