require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./src/models/Service');
const connectDB = require('./src/config/db');

const services = [
  {
    name: 'Plumbing',
    description: 'Expert plumbing services for leaks, installations, and repairs.',
    basePrice: 4000,
    imageUrl: 'plumbing.jpg'
  },
  {
    name: 'Cleaning',
    description: 'Deep home cleaning, dusting, and sanitization.',
    basePrice: 6500,
    imageUrl: 'cleaning.jpg'
  },
  {
    name: 'Electrical',
    description: 'Wiring, fixture installation, and electrical repairs.',
    basePrice: 5000,
    imageUrl: 'electrical.jpg'
  },
  {
    name: 'Salon at Home',
    description: 'Premium grooming and salon services at your doorstep.',
    basePrice: 8300,
    imageUrl: 'salon.jpg'
  },
  {
    name: 'Appliance Repair',
    description: 'Repair for AC, Fridge, Washing Machine, etc.',
    basePrice: 5800,
    imageUrl: 'repair.jpg'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Service.deleteMany();
    await Service.insertMany(services);
    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedData();
