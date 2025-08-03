const express = require('express');
const router = express.Router();
const Consent = require('../models/Consent');

// POST /api/consent
router.post('/', async (req, res) => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        // Get the last record to determine the next id
        const lastRecord = await Consent.findOne().sort({ id: -1 }).exec();
        const nextId = lastRecord ? lastRecord.id + 1 : 1;

        const newConsent = new Consent({
            id: nextId,
            name: name || "",
            email
        });

        await newConsent.save();
        res.status(201).json({ message: "Consent saved successfully", id: nextId });

    } catch (error) {
        console.error("Error saving consent:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
