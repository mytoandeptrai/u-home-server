const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    worker: String,
    type: { type: String, default: "voucher" },
    status: { type: String, default: "new" },
    createdBy: String,
    startDate: String,
    endDate: String,
    percentSale: Number,
    maxValue: String,
    minValue: String,
    condition: Object,
    categories: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
