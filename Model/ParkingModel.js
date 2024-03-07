const mongoose = require("mongoose");

const ParkingSchema = new mongoose.Schema({
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true
    },
    registrationNumber: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
    },
    slotNumber: {
      type: Number
    },
    status: {
      type: String,
      enum: ['PARKED', 'LEFT']
    }
  });

  module.exports = mongoose.model('Parking', ParkingSchema);