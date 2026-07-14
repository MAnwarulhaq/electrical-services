/**
 * Run this script to populate initial Karachi service areas and electrical services.
 * Usage: node scripts/seedData.js
 * Safe to re-run: it skips items that already exist.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("../models/Service");
const ServiceArea = require("../models/ServiceArea");
const slugify = require("../utils/slugify");

const areas = [
  "Gulshan-e-Iqbal",
  "Gulistan-e-Johar",
  "North Nazimabad",
  "Nazimabad",
  "DHA",
  "Clifton",
  "Saddar",
  "PECHS",
  "Malir",
  "Korangi",
  "Landhi",
  "Shah Faisal Colony",
];

const services = [
  {
    name: "Home Electrical Repair",
    shortDescription: "General electrical repair for homes, done safely and fast.",
    fullDescription:
      "Our certified electricians diagnose and fix common household electrical issues including faulty switches, tripped breakers, and wiring problems, ensuring your home stays safe.",
    whatsIncluded: ["Full diagnostic check", "Minor repairs", "Safety inspection"],
    icon: "FaTools",
    startingPrice: 800,
    estimatedTime: "30-60 mins",
    category: "residential",
    isPopular: true,
  },
  {
    name: "Complete House Wiring",
    shortDescription: "Full house rewiring with quality materials and safety standards.",
    fullDescription:
      "Complete electrical wiring solution for new or old homes, using high-quality cables and following safety codes to protect your family and property.",
    whatsIncluded: ["Wiring plan", "Quality cables", "Load testing", "Final inspection"],
    icon: "FaPlug",
    startingPrice: 25000,
    estimatedTime: "2-4 days",
    category: "residential",
    isPopular: true,
  },
  {
    name: "Electrical Fault Finding",
    shortDescription: "Quick and accurate diagnosis of hidden electrical faults.",
    fullDescription:
      "Using professional testing equipment, we trace and identify hidden electrical faults such as short circuits, overloaded circuits, and unsafe wiring.",
    whatsIncluded: ["Circuit testing", "Fault report", "Repair recommendation"],
    icon: "FaSearch",
    startingPrice: 1000,
    estimatedTime: "45-90 mins",
    category: "residential",
    isPopular: true,
  },
  {
    name: "Switch & Socket Installation",
    shortDescription: "Safe installation and replacement of switches and sockets.",
    fullDescription:
      "We install and replace switches, sockets, and outlets with quality components that meet modern safety standards.",
    whatsIncluded: ["Component supply option", "Safe installation", "Testing"],
    icon: "FaToggleOn",
    startingPrice: 500,
    estimatedTime: "20-40 mins",
    category: "residential",
  },
  {
    name: "Ceiling Fan Installation",
    shortDescription: "Professional ceiling fan mounting and wiring.",
    fullDescription:
      "Secure and balanced ceiling fan installation including wiring connections and speed regulator setup.",
    whatsIncluded: ["Mounting", "Wiring", "Balancing check"],
    icon: "FaFan",
    startingPrice: 700,
    estimatedTime: "30-45 mins",
    category: "residential",
    isPopular: true,
  },
  {
    name: "Fan Repair",
    shortDescription: "Repair for ceiling, pedestal, and exhaust fans.",
    fullDescription:
      "We repair noisy, slow, or non-working fans including motor issues, capacitor replacement, and regulator faults.",
    whatsIncluded: ["Diagnosis", "Capacitor/parts replacement", "Testing"],
    icon: "FaFan",
    startingPrice: 600,
    estimatedTime: "30-60 mins",
    category: "residential",
  },
  {
    name: "Light Installation",
    shortDescription: "Installation of indoor and outdoor lighting fixtures.",
    fullDescription:
      "Professional installation of ceiling lights, wall lights, and outdoor fixtures with safe wiring practices.",
    whatsIncluded: ["Fixture mounting", "Wiring", "Testing"],
    icon: "FaLightbulb",
    startingPrice: 500,
    estimatedTime: "20-40 mins",
    category: "residential",
  },
  {
    name: "LED Light Installation",
    shortDescription: "Energy-efficient LED light and panel installation.",
    fullDescription:
      "We install LED panels, strip lights, and bulbs to help you save on electricity bills with modern, bright lighting.",
    whatsIncluded: ["LED fixture mounting", "Driver wiring", "Testing"],
    icon: "FaLightbulb",
    startingPrice: 600,
    estimatedTime: "20-45 mins",
    category: "residential",
  },
  {
    name: "Circuit Breaker Repair",
    shortDescription: "Repair and replacement of faulty circuit breakers.",
    fullDescription:
      "We repair or replace tripping, damaged, or outdated circuit breakers to keep your electrical system safe and reliable.",
    whatsIncluded: ["Diagnosis", "Breaker replacement option", "Load balancing"],
    icon: "FaBolt",
    startingPrice: 1200,
    estimatedTime: "45-90 mins",
    category: "residential",
  },
  {
    name: "Distribution Board / DB Installation",
    shortDescription: "Safe installation and upgrade of distribution boards.",
    fullDescription:
      "Professional distribution board (DB) installation and upgrades with proper circuit labeling and safety breakers.",
    whatsIncluded: ["DB supply option", "Circuit wiring", "Labeling", "Safety testing"],
    icon: "FaProjectDiagram",
    startingPrice: 6000,
    estimatedTime: "3-6 hours",
    category: "residential",
  },
  {
    name: "UPS Installation",
    shortDescription: "Professional UPS setup and wiring for backup power.",
    fullDescription:
      "We install UPS systems with proper wiring, automatic changeover connections, and battery setup for reliable backup power.",
    whatsIncluded: ["Wiring", "Changeover setup", "Testing"],
    icon: "FaBatteryFull",
    startingPrice: 2500,
    estimatedTime: "1-2 hours",
    category: "residential",
  },
  {
    name: "Inverter Installation",
    shortDescription: "Safe inverter installation for uninterrupted power.",
    fullDescription:
      "Complete inverter installation including wiring, battery connection, and load configuration for homes and offices.",
    whatsIncluded: ["Wiring", "Battery connection", "Load setup", "Testing"],
    icon: "FaChargingStation",
    startingPrice: 3000,
    estimatedTime: "1-3 hours",
    category: "residential",
  },
  {
    name: "CCTV Installation",
    shortDescription: "Complete CCTV camera setup for home and business security.",
    fullDescription:
      "We install CCTV cameras with proper cabling, DVR/NVR setup, and remote viewing configuration for complete security coverage.",
    whatsIncluded: ["Camera mounting", "Cabling", "DVR setup", "Mobile app configuration"],
    icon: "FaVideo",
    startingPrice: 5000,
    estimatedTime: "2-5 hours",
    category: "commercial",
  },
  {
    name: "Solar Panel Electrical Work",
    shortDescription: "Electrical wiring and integration for solar panel systems.",
    fullDescription:
      "We handle the electrical side of solar installations including inverter wiring, grid-tie connections, and safety testing.",
    whatsIncluded: ["Wiring", "Inverter connection", "Safety testing"],
    icon: "FaSolarPanel",
    startingPrice: 15000,
    estimatedTime: "1-2 days",
    category: "residential",
  },
  {
    name: "Commercial Electrical Services",
    shortDescription: "Electrical solutions for shops, offices, and businesses.",
    fullDescription:
      "Comprehensive commercial electrical services including wiring, panel upgrades, lighting, and maintenance for businesses across Karachi.",
    whatsIncluded: ["Site assessment", "Wiring/repairs", "Compliance check"],
    icon: "FaBuilding",
    startingPrice: 3000,
    estimatedTime: "Varies by project",
    category: "commercial",
  },
  {
    name: "Emergency Electrical Services",
    shortDescription: "24/7 urgent electrical assistance across Karachi.",
    fullDescription:
      "Round-the-clock emergency electrical service for power outages, sparking outlets, short circuits, and other urgent electrical hazards.",
    whatsIncluded: ["Rapid response", "Emergency diagnosis", "Immediate safe repair"],
    icon: "FaExclamationTriangle",
    startingPrice: 1500,
    estimatedTime: "Priority response",
    category: "emergency",
    isEmergency: true,
    isPopular: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Seed areas
    for (let i = 0; i < areas.length; i += 1) {
      const exists = await ServiceArea.findOne({ name: areas[i] });
      if (!exists) {
        await ServiceArea.create({ name: areas[i], displayOrder: i });
        console.log(`Created area: ${areas[i]}`);
      }
    }

    // Seed services
    for (let i = 0; i < services.length; i += 1) {
      const svc = services[i];
      const exists = await Service.findOne({ name: svc.name });
      if (!exists) {
        await Service.create({
          ...svc,
          slug: slugify(svc.name),
          displayOrder: i,
        });
        console.log(`Created service: ${svc.name}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();
