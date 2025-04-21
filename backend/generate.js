const mongoose = require('mongoose');
const fs = require('fs');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const { Schema, model } = mongoose;


const MachineSchema = new Schema({
    _id: String,
    hour: String,
    mains: Number,
    generator: Number,
    solar: Number,
    totalPlantEnergy: Number,
    thresholdEnergy: Number,
    overflow: String,
    machine: String,
    machineEnergy: Number,
    machineThreshold: Number,
    machineOverflow: String,
    percentageOfTotal: Number
});


const Machine = model('Machine', MachineSchema);


const machines = Array.from({ length: 10 }, (_, i) => `M${String(i + 1).padStart(3, '0')}`);
const thresholds = machines.reduce((acc, machine) => ({ ...acc, [machine]: 30 }), {});


mongoose.connect('mongodb://localhost:27017/ecometer')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


async function generateData(days = 30) {
    const data = [];
    const startDate = new Date('2024-01-01');

    for (let day = 0; day < days; day++) {
        for (let hour = 0; hour < 24; hour++) {
            const hourTime = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000);
            const mains = getRandomInt(140, 160);
            const generator = getRandomInt(50, 70);
            const solar = getRandomInt(30, 40);
            const totalEnergy = mains + generator + solar;
            const thresholdEnergy = 300;
            const overflow = totalEnergy > thresholdEnergy ? "Yes" : "No";

            for (let machine of machines) {
                const machineEnergy = getRandomInt(20, 50);
                const machineOverflow = machineEnergy > thresholds[machine] ? "Yes" : "No";
                const percentage = parseFloat(((machineEnergy / totalEnergy) * 100).toFixed(2));

                const record = {
                    _id: `${day}-${hour}-${machine}`,
                    hour: hourTime.toISOString(),
                    mains,
                    generator,
                    solar,
                    totalPlantEnergy: totalEnergy,
                    thresholdEnergy,
                    overflow,
                    machine,
                    machineEnergy,
                    machineThreshold: thresholds[machine],
                    machineOverflow,
                    percentageOfTotal: percentage
                };

                data.push(record);
            }
        }
    }

   
    await Machine.insertMany(data);
    console.log('Data inserted to MongoDB');

    
    fs.writeFileSync('energy_data.json', JSON.stringify(data, null, 2));
    console.log('Data saved to JSON file');
}


generateData();
