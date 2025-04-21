// models/energyModel.js
const mongoose = require('mongoose');

// Energy Consumption Schema
const energySchema = new mongoose.Schema({
  Hour: String,
  Mains_kW: Number,
  Generator_kW: Number,
  Solar_kW: Number,
  TotalPlantEnergy_kW: Number,
  ThresholdEnergy_kW: Number,
  Overflow: String,
  Machine: String,
  MachineEnergy_kW: Number,
  MachineThreshold_kW: Number,
  MachineOverflow: String,
  PercentageOfTotal: Number,
});

// Make sure to specify the collection name
const Energy = mongoose.model('Energy', energySchema, 'Energy_consumption');

module.exports = Energy;
