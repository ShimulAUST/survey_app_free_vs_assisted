import React, { useState } from "react";
import '../css/style.css';
import axios from "axios";
import Cookies from 'js-cookie';

const ConsentForm = ({ onConsent }) => {
    const [consentGiven, setConsentGiven] = useState(false);
    const [signature, setSignature] = useState("");
    const [email, setEmail] = useState("");

    const handleConsentChange = (e) => {
        setConsentGiven(e.target.checked);
    };

    const handleSignatureChange = (e) => {
        setSignature(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };    
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consentGiven || !email) {
        alert("Please provide consent and a valid email.");
        return;
    }

    const payload = {
        name: signature.trim(),  // optional
        email: email.trim()
    };

    try {
        const response = await axios.post("http://localhost:5050/api/consent", payload);

        console.log("Consent stored:", response.data);

        const { id } = response.data;

        // Store in localStorage
       // localStorage.setItem("userId", id);
        Cookies.set('userId', id, { expires: 1/24 });  // expires in 1 hour

        
        alert("Consent submitted successfully.");
        onConsent(true);
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit consent. Please check if the backend is running and CORS is allowed.");
    }
};

const isFormValid = consentGiven && email;


    
    return (
        <div className="form-container">
            <h2>Informed Consent for Participation in the Study</h2>
            <p>
                You are invited to participate in the online study titled:{" "}
                <strong>Prompting Without Feedback: A Summative Study of Free vs. Assisted Prompt Revision Across Open-ended LLM Tasks</strong>.
                This study is being conducted by the following research team members:
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Matriculation No.</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Abu Sayeed Bin Mozahid</td>
                        <td>1504365</td>
                        <td>abu.bin-mozahid@stud.fra-uas.de</td>
                    </tr>
                    <tr>
                        <td>Shimul Paul</td>
                        <td>1441927</td>
                        <td>shimul.paul@stud.fra-uas.de</td>
                    </tr>
                    <tr>
                        <td>Shovan Banik</td>
                        <td>1411957</td>
                        <td>shovan.banik@stud.fra-uas.de</td>
                    </tr>
                    <tr>
                        <td>Farjatun Nessa</td>
                        <td>1411818</td>
                        <td>farjatun.nessa@stud.fra-uas.de</td>
                    </tr>
                    <tr>
                        <td>Sadia Afrin Tisha</td>
                        <td>1526914</td>
                        <td>sadia.tisha@stud.fra-uas.de</td>
                    </tr>
                </tbody>
            </table>

            <h3>Purpose and Goals of This Research</h3>
            <p>
                The goal of this study is to explore the effects of <strong>Free Prompting</strong> and <strong>Assisted Prompting</strong> in open-ended tasks involving language models (LLMs).
                Specifically, we aim to investigate how these different prompting methods influence response quality and task completion time.
            </p>

            <h3>Participation</h3>
            <p>
                Participation in this study is entirely voluntary. You are free to withdraw from the study at any point, without any negative consequences. You may also skip any questions you feel uncomfortable answering.
            </p>

            <h3>Data Protection and Confidentiality</h3>
            <p>
                In this study, personal data are collected for our research. The use of personal or subject-related information is governed by the European Union (EU) General Data Protection Regulation (GDPR) and will be treated in accordance with the GDPR. This means that you can view, correct, restrict processing, and delete the data collected in this study. Only with your agreement, we will collect the following data: Demographics and Contact Data.
            </p>
            <p>
                We plan to publish the results of this and other research studies in academic articles or other media as Aggregated Results. Your data will not be retained for longer than necessary or until you contact researchers to have your data destroyed or deleted.
            </p>
            <p>
                Access to the raw data, transcribed interviews, and observation protocols of the study is encrypted, password-protected, and only accessible to the authors, colleagues, and researchers collaborating on this research. Other members and administrators of our institution do not have access to your data.
            </p>
            <p>
                When publishing, the data will be pseudo-anonymized using code numbers and published in aggregated form, so that without information from the researchers, no conclusions can be drawn about individual persons. Any interview content or direct quotations from the interview, that are made available through academic publications or other academic outlets, will also be anonymized using code numbers.
            </p>
            <p>
                Contact details (e.g., emails) will not be passed on to third parties but may be used by the researchers to contact participants, trace infection chains, or send you further details of the study. According to the GDPR, the researchers will inform the participants using their contact details if a confidential data breach has been detected.
            </p>

            <h3>Identification of Investigators</h3>
            <p>
                If you have any questions or concerns about the research, please feel free to contact the following researchers:
            </p>
            <ul>
                <li><strong>Abu Sayeed Bin Mozahid</strong> - <a href="mailto:abu.bin-mozahid@stud.fra-uas.de">abu.bin-mozahid@stud.fra-uas.de</a></li>
                <li><strong>Shimul Paul</strong> - <a href="mailto:shimul.paul@stud.fra-uas.de">shimul.paul@stud.fra-uas.de</a></li>
                <li><strong>Shovan Banik</strong> - <a href="mailto:shovan.banik@stud.fra-uas.de">shovan.banik@stud.fra-uas.de</a></li>
                <li><strong>Farjatun Nessa</strong> - <a href="mailto:farjatun.nessa@stud.fra-uas.de">farjatun.nessa@stud.fra-uas.de</a></li>
                <li><strong>Sadia Afrin Tisha</strong> - <a href="mailto:sadia.tisha@stud.fra-uas.de">sadia.tisha@stud.fra-uas.de</a></li>
            </ul>

            <h3>Principal Investigator</h3>
            <p>
                <strong>Prof. Dr. Valentin Schwind</strong><br />
                Email: <a href="mailto:valentin.schwind@fb2.fra-uas.de">valentin.schwind@fb2.fra-uas.de</a><br />
                Frankfurt University of Applied Sciences<br />
                Nibelungenplatz 1, 60318 Frankfurt am Main, Germany
            </p>

            <h3>Consent Confirmation</h3>
            <p>Please confirm your agreement to participate in this study by checking the box below and providing your signature (full name) and email below.</p>

            {/* Signature and Email grouped together */}
            <div>
                <label>
                    Full Name:
                    <input
                        type="text"
                        value={signature}
                        onChange={handleSignatureChange}
                        placeholder="Enter your full name"
                        required
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                    />
                </label>

                <br />

                <label >
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"

                        required
                         
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                    />
                </label>
            </div>

            <br />

            <label>
                <input type="checkbox" onChange={handleConsentChange} /> I consent to participate in this study.
            </label>

            <br />

            {/* Submit button is always visible but only clickable when the form is valid */}
            <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    backgroundColor: isFormValid ? "#28a745" : "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: isFormValid ? "pointer" : "not-allowed"
                }}
            >
                Submit Consent
            </button>
        </div>
    );
};

export default ConsentForm;
