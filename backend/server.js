// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

// // Initialize dotenv and express app
// dotenv.config();
// const app = express();

// // Use body-parser middleware to handle JSON requests
// app.use(express.json());
// app.use(cors());  // Enable CORS if frontend and backend are on different origins

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Connected to MongoDB Atlas"))
//     .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

// // MongoDB Schema for Consent Data
// const consentSchema = new mongoose.Schema({
//     id: { type: Number, required: true, unique: true },
//     name: { type: String, default: "" },
//     email: { type: String, required: true },
//     demographics: { type: Object, default: null } // Placeholder for demographics data
// }, { timestamps: true, collection: 'data' });

// const Consent = mongoose.model('Consent', consentSchema);

// // POST /api/consent - Store user consent data and return userId
// app.post('/api/consent', async (req, res) => {
//     const { name, email } = req.body;

//     if (!email) {
//         return res.status(400).json({ error: "Email is required." });
//     }

//     try {
//         // Get the last record to determine the next id
//         const lastRecord = await Consent.findOne().sort({ id: -1 }).exec();
//         const nextId = lastRecord ? lastRecord.id + 1 : 1;

//         const newConsent = new Consent({
//             id: nextId,
//             name: name || "",
//             email,
//             demographics: null // Initially set demographics to null
//         });

//         await newConsent.save();
//         res.status(201).json({ message: "Consent saved successfully", id: nextId }); // Send the generated userId

//     } catch (error) {
//         console.error("Error saving consent data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // POST /api/demographics - Store demographics data linked by userId
// app.post('/api/demographics', async (req, res) => {
//     const { userId, gender, otherGender, education, otherEducation, aiExperience, otherAiExperience, computerProficiency, technologyAccess, location, occupation, otherOccupation, ethnicity, otherEthnicity, techUsageFrequency, ageGroup } = req.body;

//     // Ensure userId is present
//     if (!userId) {
//         return res.status(400).json({ error: "UserId is required." });
//     }

//     try {
//         // Find the user by userId
//         const user = await Consent.findOne({ id: userId });

//         if (!user) {
//             return res.status(404).json({ error: "User not found." });
//         }

//         // Update the demographics data for the user
//         user.demographics = {
//             gender,
//             otherGender,
//             education,
//             otherEducation,
//             aiExperience,
//             otherAiExperience,
//             computerProficiency,
//             technologyAccess,
//             location,
//             occupation,
//             otherOccupation,
//             ethnicity,
//             otherEthnicity,
//             techUsageFrequency,
//             ageGroup
//         };

//         await user.save(); // Save the updated user data

//         res.status(200).json({ message: "Demographics data saved successfully." });
//     } catch (error) {
//         console.error("Error saving demographics data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Start the server
// const port = process.env.PORT || 5050;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Initialize dotenv and express app
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

// Schema
const consentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, required: true },
    demographics: { type: Object, default: null },
    scenarioResults: [{
        scenarioTitle: { type: String, required: true },
        promptingType: { type: String, enum: ["Free", "Assisted"], required: true },
        result: { type: String, enum: ["Good", "Bad"], required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true, collection: 'data' });

const Consent = mongoose.model('Consent', consentSchema);

// Save consent data
app.post('/api/consent', async (req, res) => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const lastRecord = await Consent.findOne().sort({ id: -1 }).exec();
        const nextId = lastRecord ? lastRecord.id + 1 : 1;

        const newConsent = new Consent({
            id: nextId,
            name: name || "",
            email,
            demographics: null,
            scenarioResults: []
        });

        await newConsent.save();
        res.status(201).json({ message: "Consent saved successfully", id: nextId });
    } catch (error) {
        console.error("Error saving consent data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Save demographics
app.post('/api/demographics', async (req, res) => {
    const {
        userId, gender, otherGender, education, otherEducation,
        aiExperience, otherAiExperience, computerProficiency, technologyAccess,
        location, occupation, otherOccupation, ethnicity, otherEthnicity,
        techUsageFrequency, ageGroup
    } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "UserId is required." });
    }

    try {
        const user = await Consent.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.demographics = {
            gender, otherGender, education, otherEducation,
            aiExperience, otherAiExperience, computerProficiency,
            technologyAccess, location, occupation, otherOccupation,
            ethnicity, otherEthnicity, techUsageFrequency, ageGroup
        };

        await user.save();
        res.status(200).json({ message: "Demographics data saved successfully." });
    } catch (error) {
        console.error("Error saving demographics data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Save scenario result
app.post('/api/scenario-result', async (req, res) => {
    const { userId, scenarioTitle, promptingType, result } = req.body;

    if (!userId || !scenarioTitle || !promptingType || !result) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const user = await Consent.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!user.scenarioResults) user.scenarioResults = [];

        user.scenarioResults.push({
            scenarioTitle,
            promptingType,
            result
        });

        await user.save();
        res.status(200).json({ message: "Scenario result saved successfully." });
    } catch (error) {
        console.error("Error saving scenario result:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
