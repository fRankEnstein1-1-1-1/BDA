const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Ensure environment variables are loaded from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Student = require("../models/Student");

// Seedable pseudo-random number generator (Linear Congruential Generator)
let seed = 42;
const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
};

const firstNames = [
    "Aarav", "Aditi", "Aditya", "Akash", "Ananya", "Aniket", "Anushka", "Arjun",
    "Aryan", "Ayush", "Bhavna", "Chetan", "Dev", "Dhruv", "Diya", "Gaurav",
    "Harsh", "Ishaan", "Isha", "Karan", "Kavya", "Khushi", "Kunal", "Manish",
    "Meera", "Mohit", "Neha", "Nikhil", "Nisha", "Om", "Pooja", "Pranav",
    "Priya", "Rahul", "Rhea", "Rishi", "Rohan", "Rohit", "Sakshi", "Sameer",
    "Sanjay", "Sanya", "Shivani", "Shreya", "Siddharth", "Sneha", "Tanvi", "Tarun",
    "Utkarsh", "Varun", "Vedant", "Vidhi", "Vikas", "Vinay", "Yash", "Zara"
];

const lastNames = [
    "Sharma", "Verma", "Patel", "Mehta", "Iyer", "Nair", "Kulkarni", "Deshmukh",
    "Joshi", "Gupta", "Singh", "Reddy", "Rao", "Choudhury", "Bose", "Das",
    "Chatterjee", "Bhattacharya", "Agarwal", "Mishra", "Pandey", "Kapoor", "Malhotra", "Chopra"
];

const getRandomItem = (arr) => arr[Math.floor(random() * arr.length)];

// Generate realistic marks across subjects
const generateMarks = (profileType) => {
    let baseMin, baseMax;

    switch (profileType) {
        case "topper": // High scores
            baseMin = 78;
            baseMax = 98;
            break;
        case "good": // Above average
            baseMin = 65;
            baseMax = 85;
            break;
        case "average": // Middle tier
            baseMin = 48;
            baseMax = 72;
            break;
        case "struggling": // Some fails (< 40)
            baseMin = 28;
            baseMax = 58;
            break;
        default:
            baseMin = 45;
            baseMax = 80;
    }

    const getMark = () => {
        const val = Math.floor(random() * (baseMax - baseMin + 1)) + baseMin;
        return Math.max(0, Math.min(100, val));
    };

    return {
        bigDataAnalytics: getMark(),
        dataMining: getMark(),
        cloudComputing: getMark(),
        machineLearning: getMark()
    };
};

const generateStudents = (count = 200) => {
    const students = [];
    const usedRolls = new Set();

    for (let i = 1; i <= count; i++) {
        const rollNo = `BE${700 + i}`;
        if (usedRolls.has(rollNo)) continue;
        usedRolls.add(rollNo);

        const fullName = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;

        // Determine academic distribution profile:
        // ~15% toppers, ~35% good, ~35% average, ~15% struggling (to have authentic pass/fail balance)
        const randTier = random();
        let profile = "average";
        if (randTier < 0.15) profile = "topper";
        else if (randTier < 0.50) profile = "good";
        else if (randTier < 0.85) profile = "average";
        else profile = "struggling";

        const marks = generateMarks(profile);

        // Attendance between 50 and 100 with ~15% below 75%
        let attendance;
        if (random() < 0.15) {
            attendance = Math.floor(random() * 25) + 50; // 50 - 74%
        } else {
            attendance = Math.floor(random() * 26) + 75; // 75 - 100%
        }

        students.push({
            rollNo,
            name: fullName,
            department: "Computer Engineering",
            semester: 7,
            marks,
            attendance
        });
    }

    return students;
};

const seedDatabase = async () => {
    const mongoURI = process.env.MONGO;

    if (!mongoURI) {
        console.error("Error: MONGO environment variable is not defined in .env file.");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully.");

        console.log("Clearing existing Student collection records (destructive operation for reset)...");
        const deleteResult = await Student.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing student documents.`);

        console.log("Generating 200 synthetic student academic records...");
        const studentsData = generateStudents(200);

        console.log("Inserting records into MongoDB via insertMany()...");
        const inserted = await Student.insertMany(studentsData);
        console.log(`Successfully seeded ${inserted.length} student records into MongoDB!`);

        // Display sample inserted record for verification
        console.log("\nSample Inserted Record:");
        console.log(JSON.stringify(inserted[0], null, 2));

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB. Database seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed database:", error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

seedDatabase();
