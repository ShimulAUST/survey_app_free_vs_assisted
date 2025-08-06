
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

// ✅ Consent Schema with scenarioInputs
const consentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, required: true },
    demographics: { type: Object, default: null },
    scenarioInputs: { type: Object, default: {} }  // 🔥 New field for storing scenario results
}, { timestamps: true, collection: 'data' });

const Consent = mongoose.model('Consent', consentSchema);

// ✅ POST /api/consent
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
            scenarioInputs: {}
        });

        await newConsent.save();
        res.status(201).json({ message: "Consent saved successfully", id: nextId });
    } catch (error) {
        console.error("Error saving consent data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ POST /api/demographics
app.post('/api/demographics', async (req, res) => {
    const {
        userId, gender, otherGender, education, otherEducation,
        aiExperience, otherAiExperience, computerProficiency,
        technologyAccess, location, occupation, otherOccupation,
        ethnicity, otherEthnicity, techUsageFrequency, ageGroup
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

// ✅ POST /api/save-scenario-result
app.post('/api/save-scenario-result', async (req, res) => {
    const {
        userId,
        scenarioTitle,
        promptingType,
       evaluation,
    } = req.body;

    console.log(req.body);

    if (!userId || !scenarioTitle || !promptingType || !evaluation.clarity|| !evaluation.relevance ||
        !evaluation.completeness || !evaluation.conciseness ||
        !evaluation.factualAccuracy || !evaluation.contextualAccuracy || !evaluation.taskSuccess) { 
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const user = await Consent.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const scenarioKey = `${scenarioTitle.trim()} (${promptingType})`;

        // ✅ Set + Mark modified
        user.set(`scenarioInputs.${scenarioKey}`, {
                        clarity: evaluation.clarity,
            relevance: evaluation.relevance,
            completeness: evaluation.completeness,
            conciseness: evaluation.conciseness,
            factualAccuracy: evaluation.factualAccuracy,
            contextualAccuracy: evaluation.contextualAccuracy,
            taskSuccess: evaluation.taskSuccess

        });
        user.markModified('scenarioInputs');

        await user.save();
        res.status(200).json({ message: "Scenario result saved in user profile." });
    } catch (err) {
        console.error("Error saving scenario result:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Start the server
const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
