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
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!consentGiven || !emailRegex.test(email)) {
            alert("Please provide consent and a valid email address.");
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
            Cookies.set('userId', id, { expires: 1 / 24 });  // expires in 1 hour


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
            <p style={{ textAlign: "justify" }}>
                You are invited to participate in the online study&nbsp;
                <b>"Prompting Without Feedback: A Summative Study of Free vs. Assisted Prompt Revision Across Open-ended LLM Tasks"</b>.
                The study is conducted by&nbsp;
                <b>Abu Sayeed Bin Mozahid</b>, <b>Shimul Paul</b>, <b>Shovan Banik</b>,<b> Farjatun Nessa </b>, and&nbsp;
                <b>Sadia Afrin Tisha </b> and supervised by <b>Prof. Dr. Valentin Schwind </b> from the Frankfurt University of Applied Sciences. The study with estimated 20 participants takes place in the period from <b>2025-08-10 to 2025-08-16</b>. Please note:
                <ul>
                    <li>Your participation is entirely voluntary and can be discontinued or withdrawn at any time
                    </li>
                    <li>For the evaluation, we collect some of personal information (e.g., age, gender, etc.), whereas contact data (e.g. e-mails) will only be used for feedback or further information about the study and not be passed on to any third parties

                    </li>
                    <li>
                        One session of the online study will last ca. 60 minutes
                    </li>
                    <li>
                        As compensation for your participation, you will receive one credit point for the lecture
                    </li>
                    <li>
                        During the session, we will log your input and manually record notes
                    </li>
                    <li>
                        Recordings and personal data are treated with confidentiality and and will fully anonymized stored, evaluated and possibly made publicly available as raw data sets so that no conclusions can be drawn about individual persons anymore
                    </li>
                </ul>
                The alternative to participation in this study is to choose not to participate. If you have any questions, concerns, or complaints about the informed consent process of this research study or your rights as a human research subject, please contact <b>Prof. Dr. Valentin Schwind</b>. Please read the following information carefully and take the time you need.

            </p>



            <h3>Purpose and Goals of This Research</h3>
            <p style={{ textAlign: "justify" }}>
                The purpose of this study is to investigate how Free Prompting and Assisted Prompting affect response quality and task completion time in open-ended language model (LLM) tasks. The goal of this study is to examine the impact of Free and Assisted Prompting on the quality and accuracy of responses in open-ended tasks using language models (LLMs). Your participation will help us achieve this research goal. The results of this research may be presented at scientific or professional meetings or published in scientific proceedings and journals.
            </p>

            <h3>Participation</h3>
            <p style={{ textAlign: "justify" }}>
                Your participation in this online study is entirely voluntary and can be discontinued or withdrawn at any time. You can refuse to answer any questions or continue with the study at any time if you feel uncomfortable in any way. You can discontinue or withdraw your participation at any time without giving a reason. However, we reserve the right to exclude you from the study (e.g., with invalid trials or if continuing the study could have a negative impact on your well-being or the equipment).You will also receive the compensation offered if you discontinue study participation. Repeated participation in the study is not permitted.
            </p>
            <h3>Study Procedure</h3>
            <p style={{ textAlign: "justify" }}>
                After confirming this informed consent the procedure is as follows:
                <ul>
                    <li>
                        <b>Demographics:</b> Participants first fill out a questionnaire on demographic data.
                    </li>
                    <li>
                        <b>Instruction:</b> A brief description along with instructions of the tasks will be provided.
                    </li>
                    <li>
                        <b>Task:</b> Participants will complete 5 scenarios using both Free and Assisted prompting, presented in a shuffled order based on a Balanced Latin Square design; for Assisted prompting, five AI-generated questions will be provided to guide participants toward improved responses, followed by a short questionnaire after each scenario.
                    </li>
                    <li>
                        <b>Post-test evaluation:</b> After completing the tasks, participants fill out a short questionnaire.
                    </li>
                </ul>
                The confirmation of participation in this study can be obtained directly from the researchers.

            </p>
            <h3>Risks and Benefits</h3>
            <p style={{ textAlign: "justify" }}>
                In the online study you will not be exposed to any immediate risk or danger. As with all computer systems on which data is processed, despite security measures, there is a small risk of data leakage and the loss of confidential or personal information. As compensation for your participation, you will receive one credit point for the lecture. With your participation you support our research work and contribute to a better understanding of human-computer interaction.
            </p>
            <h3>Data Protection and Confidentiality</h3>
            <p style={{ textAlign: "justify" }}>
                In this study, personal and personal data are collected for our research. The use of personal or subject-related information is governed by the European Union (EU) General Data Protection Regulation (GDPR) and will be treated in accordance with the GDPR. This means that you can view, correct, restrict processing, and delete the data collected in this study. Only with your agreement, we will log your input and manually record notes in the study. We plan to publish the results of this and other research studies in academic articles or other media. Your data will not be retained for longer than necessary or until you contact researchers to have your data destroyed or deleted. Access to the raw data, transcribed interviews, and observation protocols of the study during the analysis is encrypted, password-protected and only accessible to the authors, colleagues, and researchers collaborating on this research. As part of the research, the data will be fully anonymized and then be made available to the general public, whereas no conclusions can be drawn about individual persons anymore. Once the material has been made publicly available, the distribution of the data can no longer be revoked. Any interview content or direct quotations from the interview, that are made available through academic publications or other academic outlets will also be fully anonymized. Contact details (e.g. e-mails) will not be passed on to third parties, but may be used by the researchers to contact participants, trace infection chains, or to send you further details of the study. According to the GDPR, the researchers will inform the participants using their contact details if a confidential data breach has been detected.
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
