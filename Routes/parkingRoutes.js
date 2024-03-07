const express = require("express");
const router = express.Router();
const ParkingLot = require("../Model/ParkingLotModel");
const Parking = require("../Model/ParkingModel");

let availableSlots = [];

function isValidRegistrationNumber(registrationNumber) {
    const regex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/; 
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
      res.status(200).json({ isSuccess: false, error: { reason: "" } });
    }
  });
  


  router.delete('/Parkings', async (req, res) => {
    try {
      const { parkingLotId, registrationNumber } = req.body;
  
      const parkingLot = await ParkingLot.findById(parkingLotId);
      if (!parkingLot) {
        throw new Error('Invalid parking lot id');
      }
  
      const parkingEntry = await Parking.findOne({ parkingLotId, registrationNumber, status: 'PARKED' });
      if (!parkingEntry) {
        throw new Error('Car not found in the parking lot');
      }
  
      parkingLot.availableSlots.push(parkingEntry.slotNumber);
  
      parkingEntry.status = 'LEFT';
      await parkingEntry.save();
  
      await parkingLot.save();

      const response = { slotNumber: parkingEntry.slotNumber, registrationNumber, status: "LEFT" };

      res.status(200).json({ isSuccess: true, response });
    } catch (error) {
      res.status(400).json({ isSuccess: false, error: { reason: error.message } });
    }
  });

  router.get('/Slots', async (req, res) => {
    try {
      const { color, parkingLotId } = req.query;
  
      const parkingLot = await ParkingLot.findById(parkingLotId);
      if (!parkingLot) {
        throw new Error('Invalid parking lot id');
      }
  
      const allowedColors = ['RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE'];
      if (!allowedColors.includes(color)) {
        throw new Error('Invalid color');
      }
  
      const slots = await Parking.find({ parkingLotId, color, status: 'PARKED' }).select('color slotNumber').sort('slotNumber');
  
      if (slots.length === 0) {
        throw new Error(`No car found with color ${color}`);
      }
    //   console.log(slots);
      const formattedSlots = slots.map(slot => ({
        color: slot.color,
        slotNumber: slot.slotNumber
      }));
      res.status(200).json({ isSuccess: true, response: { slots: formattedSlots } });
    } catch (error) {
      res.status(200).json({ isSuccess: false, error: { reason: error.message } });
    }
  });


  router.get('/Parkings', async (req, res) => {
    try {
      const { color, parkingLotId } = req.query;
  
      const parkingLot = await ParkingLot.findById(parkingLotId);
      if (!parkingLot) {
        throw new Error('Invalid parking lot id');
      }
  
      const allowedColors = ['RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE'];
      if (!allowedColors.includes(color)) {
        throw new Error('Invalid color');
      }
  
      const registrations = await Parking.find({ parkingLotId, color }).select('color registrationNumber').sort('_id');
  
      if (registrations.length === 0) {
        throw new Error(`No car found with color ${color}`);
      }
      const formattedRegistration = registrations.map(slot => ({
        color: slot.color,
        registrationNumber: slot.registrationNumber
      }));

      res.status(200).json({ isSuccess: true, response: { registrations: formattedRegistration } });
    } catch (error) {
      res.status(400).json({ isSuccess: false, error: { reason: error.message } });
    }
  });
  
  module.exports = router;