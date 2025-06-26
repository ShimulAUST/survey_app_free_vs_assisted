import React, { useState } from "react";

const Instructions = ({ onNext }) => {
    const [isReady, setIsReady] = useState(false);

    // Handle when the user is ready to start the survey
    const handleStartSurvey = () => {
        onNext();  // This function should handle the random assignment of Free/Assisted prompt
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Survey Instructions</h2>
            <p style={{ textAlign: "left", fontSize: "16px" }}>
                Welcome to the Survey! Before you start, please carefully read the instructions below.
            </p>
            <p style={{ textAlign: "left", fontSize: "16px" }}>
                This survey is designed to compare <b>Free Prompting</b> and <b>Assisted Prompting</b>.
                You will be asked to answer a series of questions in two different ways:
                <ol>
                    <li><strong>Free Prompting:</strong> You will answer questions without any assistance.</li>
                    <li><strong>Assisted Prompting:</strong> You will answer the same questions, but with suggestions or guidance to help you answer.</li>
                </ol>
            </p>

            <p style={{ textAlign: "left", fontSize: "16px" }}>
                <strong>Counterbalancing and Randomization:</strong><br />
                - The order of the two prompting methods (Free vs. Assisted) will be <b>randomly assigned</b> to you. You might either start with Free Prompting or Assisted Prompting.<br />
                - Each of the two prompting methods will have the same set of scenarios, but they will be presented in a <b>randomized order</b> within each prompting section.
            </p>

            <p style={{ textAlign: "left", fontSize: "16px" }}>
                <strong>What You Will Do:</strong><br />
                - First, you will complete the <b>Free Prompting Task</b> or <b>Assisted Prompting Task</b>, based on the random assignment.<br />
                - After completing one prompting method, you will proceed to the other prompting method and perform the same tasks, but this time with randomized scenarios.<br />
                - Each prompting section will take approximately <b>10-15 minutes</b>.
            </p>

            <p style={{ textAlign: "left", fontSize: "16px" }}>
                <strong>Post-Survey Feedback:</strong><br />
                After completing both sections, you will be asked to provide feedback on your experience, including:
                <br /> - Which prompting method you found easier to use.
                <br />  - How helpful the suggestions in Assisted Prompting were.
                <br /> - Any additional thoughts or comments you may have.
            </p>

            <p style={{ textAlign: "left", fontSize: "16px" }}>
                <strong>Time Commitment:</strong><br />
                The total time for the survey is approximately <b>30-40 minutes</b>. Please take your time to answer each section thoughtfully.
            </p>

            <div style={{ textAlign: "center" }}>
                <button
                    onClick={handleStartSurvey}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Start Survey
                </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
                If you have any questions or need clarification, feel free to ask the administrator.
            </p>
        </div>
    );
};

export default Instructions;
