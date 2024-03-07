const mongoose = require('mongoose');

const ParkingLotSchema = new mongoose.Schema({
  capacity: {
    type: Number,
    required: true,
    min: 0,
    max: 2000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availableSlots: {
    type: [Number],
    default: []
  }
});

module.exports = mongoose.model('ParkingLot', ParkingLotSchema);