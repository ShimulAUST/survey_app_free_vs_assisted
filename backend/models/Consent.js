const mongoose = require('mongoose');


const consentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, required: true }
}, { timestamps: true, collection:'data' });

module.exports = mongoose.model('Consent', consentSchema);
