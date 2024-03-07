const express = require("express");
const router = express.Router();
const ParkingLot = require("../Model/ParkingLotModel");
const Parking = require("../Model/ParkingModel");

let availableSlots = [];

function isValidRegistrationNumber(registrationNumber) {
    const regex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/; // Assuming format is StateCodeDistrictCodeAlphabetNumber
    return regex.test(registrationNumber);
  }


  router.post('/ParkingLots', async (req, res) => {
    try {
      const { capacity } = req.body;
  
      if (capacity < 0 || capacity > 2000) {
        throw new Error('Capacity should be between 0 and 2000');
      }
  
      const parkingLot = new ParkingLot({ capacity, availableSlots: Array.from({ length: capacity }, (_, i) => i + 1) });
      await parkingLot.save();
      const response = { _id: parkingLot._id, capacity: parkingLot.capacity, isActive: parkingLot.isActive };
      res.status(200).json({ isSuccess: true, response });
    } catch (error) {
      res.status(200).json({ isSuccess: false, error: { reason: error.message } });
    }
  });



  router.post('/Parkings', async (req, res) => {
    try {
      const { parkingLotId, registrationNumber, color } = req.body;
  
      const parkingLot = await ParkingLot.findById(parkingLotId);
      if (!parkingLot) {
        throw new Error('Invalid parking lot id');
      }
  
      const allowedColors = ['RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE'];
      if (!allowedColors.includes(color)) {
        throw new Error('Invalid color');
      }
  
      if (!isValidRegistrationNumber(registrationNumber)) {
        throw new Error('Invalid registration number');
      }
  
      if (parkingLot.availableSlots.length === 0) {
        throw new Error('No available slots');
      }
  
      const slotNumber = parkingLot.availableSlots.shift(); 
    //   console.log(slotNumber);
      await parkingLot.save();

      const parking = new Parking({ parkingLotId, registrationNumber, color, slotNumber, status: 'PARKED' });
      await parking.save();
  
      res.status(200).json({ isSuccess: true, response: { slotNumber, status: 'PARKED' } });
    } catch (error) {
      res.status(200).json({ isSuccess: false, error: { reason: error.message } });
    }
  });
  


  
  module.exports = router;