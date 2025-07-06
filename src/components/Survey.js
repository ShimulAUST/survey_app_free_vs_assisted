import React, { useState, useEffect } from "react";
import axios from "axios";
//import "./Survey.css"; // Assuming you will create this CSS file for styles

const Survey = ({ onComplete }) => {
    const scenarios = [
        { title: "Scenario 1:", paragraph: "You need to create a marketing strategy for a new tech product targeted at university students. Consider the product's key features and define the target market. Think about advertising channels like social media, campus events, and digital ads. Focus on budget allocation and how you would measure campaign success." },
        { title: "Scenario 2:", paragraph: "You need to invent a product that addresses a common problem people face in daily life. Describe the problem, the target audience, and the features of the product. Explain how it’s different from existing solutions and how it will be marketed and distributed." },
        { title: "Scenario 3:", paragraph: "Write a persuasive essay on a social issue such as universal basic income (UBI). Present a clear argument, backed by reasoning and evidence, and discuss both the pros and cons." },
        { title: "Scenario 4:", paragraph: "Design a fitness plan for someone with limited access to gym equipment, focusing on bodyweight exercises or resistance bands. The plan should include strength training, cardio, and flexibility." },
        { title: "Scenario 5:", paragraph: "Design an online course curriculum for 'Introduction to Data Science,' covering topics like data analysis, statistics, and machine learning." },
    ];

    // State to manage the survey flow and data
    const [promptingType, setPromptingType] = useState(""); // "Free" or "Assisted"
    const [currentScenario, setCurrentScenario] = useState(0); // Index of the current scenario
    const [userQuestion, setUserQuestion] = useState(""); // User's input question
    const [response, setResponse] = useState(""); // Initial AI response
    const [randomizedScenarios, setRandomizedScenarios] = useState(scenarios); // Shuffled scenarios
    const [assistantQuestions, setAssistantQuestions] = useState(""); // AI-generated assisting questions
    const [feedback, setFeedback] = useState(""); // User's feedback for assisted prompting
    const [finalResponse, setFinalResponse] = useState(""); // Final AI response after feedback

    // State for UI control (loading, submission status)
    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [questionSubmitted, setQuestionSubmitted] = useState(false); // Tracks if initial question is submitted
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false); // Tracks if feedback is submitted for assisted

    // State to track overall completion of each prompting type
    const [isFreePromptingComplete, setIsFreePromptingComplete] = useState(false);
    const [isAssistedPromptingComplete, setIsAssistedPromptingComplete] = useState(false);

    // --- Helper Functions ---

    // Shuffles the scenarios array randomly
    const shuffleScenarios = () => {
        const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
        setRandomizedScenarios(shuffled);
    };

    // Resets all necessary states for a new scenario or new prompting type
    const resetScenarioStates = () => {
        setResponse("");
        setFeedback("");
        setFinalResponse("");
        setUserQuestion("");
        setAssistantQuestions("");
        setQuestionSubmitted(false);
        setIsFeedbackSubmitted(false);
    };

    // --- Effects ---

    // Initializes prompting type and shuffles scenarios on component mount
    useEffect(() => {
        const startingType = Math.random() > 0.5 ? "Free" : "Assisted";
        setPromptingType(startingType);
        shuffleScenarios();
    }, []);

    // --- Handlers ---

    // Handles changes in the user's question input
    const handleQuestionChange = (e) => {
        setUserQuestion(e.target.value);
    };

    // Submits the user's question to OpenAI and gets the initial response
    const handleSubmitQuestion = async () => {
        setIsSubmittingQuestion(true);

        try {
            const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
            if (!openAiApiKey) {
                throw new Error("OpenAI API Key is not set in environment variables.");
            }

            let promptContent;
            // Define prompt content based on prompting type
            if (promptingType === "Free") {
                promptContent = userQuestion; // Direct user question for Free Prompting
            } else { // Assisted Prompting
                promptContent = `For the given scenario, provide a detailed and comprehensive response in **one single paragraph**. Focus on addressing all key aspects of the scenario within this paragraph.

After your main response, start a **new, separate paragraph** and generate five distinct questions. These questions should encourage the user to elaborate, clarify, or think more deeply about their answer to the scenario. Format these questions clearly, starting each with 'Question 1: ', 'Question 2: ', and so on.

**Scenario:** ${randomizedScenarios[currentScenario].title} ${randomizedScenarios[currentScenario].paragraph}`;
            }

            const openAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini", // Or another suitable model like gpt-3.5-turbo
                    messages: [
                        { role: "system", content: "Please provide your response in plain text with clear paragraph breaks. Avoid using markdown formatting (e.g., no ** for bold text or # for headings). Use <br> for line breaks between sections." },
                        { role: "user", content: promptContent },
                    ],
                    max_tokens: 600, // Increased max tokens to allow for detailed responses and questions
                },
                { headers: { Authorization: `Bearer ${openAiApiKey}` } }
            );

            const responseText = openAiResponse.data.choices[0].message.content;
            let mainResponse = responseText;
            let generatedQuestions = "";

            if (promptingType === "Assisted") {
                // Robustly split the response based on "Question 1:"
                const parts = responseText.split(/(Question 1:)/);

                if (parts.length > 2) {
                    mainResponse = parts[0].trim(); // Content before "Question 1:"
                    generatedQuestions = parts.slice(1).join('').trim(); // "Question 1:" and everything after
                } else {
                    // Fallback if "Question 1:" pattern is not found as expected
                    mainResponse = responseText.trim();
                    generatedQuestions = "No assisting questions generated, please try submitting again.";
                }
            }

            setResponse(mainResponse);
            setAssistantQuestions(generatedQuestions);
            setQuestionSubmitted(true); // Mark question as submitted

        } catch (error) {
            console.error("Error submitting question to OpenAI:", error);
            setResponse("Sorry, there was an error getting a response. Please check your API key and try again later.");
        } finally {
            setIsSubmittingQuestion(false);
        }
    };

    // Handles changes in the user's feedback input
    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    // Submits user feedback and gets the final, refined response from OpenAI
    const handleSubmitFeedbackAndGetFinalResponse = async () => {
        setIsSubmittingFeedback(true);

        try {
            const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
            if (!openAiApiKey) {
                throw new Error("OpenAI API Key is not set in environment variables.");
            }

            // Construct the prompt for the final response, incorporating original context and feedback
            const finalPrompt = `Given the user's feedback: "${feedback}", the original scenario: "${randomizedScenarios[currentScenario].title} ${randomizedScenarios[currentScenario].paragraph}", and the initial AI response: "${response}", please provide a final, detailed response that incorporates the feedback. Focus on providing a complete and refined answer.`;

            const finalOpenAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini", // Or another suitable model
                    messages: [
                        { role: "system", content: "Please synthesize the user feedback and scenario to give a final response. Provide your response in plain text with clear paragraph breaks. Avoid using markdown formatting (e.g., no ** for bold text or # for headings). Use <br> for line breaks between sections." },
                        { role: "user", content: finalPrompt },
                    ],
                    max_tokens: 600, // Allow sufficient tokens for a detailed final response
                },
                { headers: { Authorization: `Bearer ${openAiApiKey}` } }
            );

            setFinalResponse(finalOpenAiResponse.data.choices[0].message.content);
            setIsFeedbackSubmitted(true); // Mark feedback as submitted

        } catch (error) {
            console.error("Error submitting feedback to OpenAI:", error);
            setFinalResponse("Sorry, there was an error getting a final response. Please try again later.");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    // Manages the flow between scenarios and prompting types
    const handleNextScenario = () => {
        // Check if there are more scenarios in the current prompting type
        if (currentScenario < randomizedScenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            resetScenarioStates(); // Reset states for the new scenario
        } else {
            // All scenarios for the current prompting type are complete
            if (promptingType === "Free" && !isAssistedPromptingComplete) {
                // Free prompting done, switch to Assisted
                setIsFreePromptingComplete(true); // Mark Free as complete
                shuffleScenarios(); // Reshuffle scenarios for the next type
                setPromptingType("Assisted"); // Switch type
                setCurrentScenario(0); // Reset scenario index
                resetScenarioStates(); // Reset states for the new type's first scenario
            } else if (promptingType === "Assisted" && !isFreePromptingComplete) {
                // Assisted prompting done, switch to Free
                setIsAssistedPromptingComplete(true); // Mark Assisted as complete
                shuffleScenarios(); // Reshuffle scenarios for the next type
                setPromptingType("Free"); // Switch type
                setCurrentScenario(0); // Reset scenario index
                resetScenarioStates(); // Reset states for the new type's first scenario
            } else {
                // Both prompting types are complete, finish the survey
                onComplete(); // Call the prop function to move to the next step (e.g., step 4)
            }
        }
    };

    // --- Render Logic ---

    // Determine when the "Next" button should be available
    const isNextButtonAvailable =
        (promptingType === "Free" && questionSubmitted) ||
        (promptingType === "Assisted" && isFeedbackSubmitted);

    // Determine the text for the "Next" button
    const nextButtonText =
        currentScenario < randomizedScenarios.length - 1
            ? "Next Scenario"
            : promptingType === "Free" && !isAssistedPromptingComplete
                ? "Go to Assisted Prompting"
                : promptingType === "Assisted" && !isFreePromptingComplete
                    ? "Go to Free Prompting"
                    : "Finish Survey";

    return (
        <div className="survey-container">
            {/* Full-screen spinner overlay */}
            {(isSubmittingQuestion || isSubmittingFeedback) && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <h2 className="prompting-type-header">{promptingType} Prompting</h2>

            <div className="scenario-section">
                <h3>{randomizedScenarios[currentScenario]?.title}</h3>
                <p>{randomizedScenarios[currentScenario]?.paragraph}</p>
            </div>

            <div className="user-input-section">
                <input
                    type="text"
                    placeholder="Ask a question here"
                    value={userQuestion}
                    onChange={handleQuestionChange}
                    disabled={isSubmittingQuestion || questionSubmitted}
                    className="question-input"
                />
                <button
                    onClick={handleSubmitQuestion}
                    disabled={isSubmittingQuestion || questionSubmitted || userQuestion.trim() === ""}
                    className="submit-button"
                >
                    {isSubmittingQuestion ? "Submitting..." : questionSubmitted ? "Question Submitted" : "Submit Question"}
                </button>
            </div>

            {response && (
                <div className="ai-response-section">
                    <h4>Response from AI:</h4>
                    <p className="ai-response-text">{response.replace(/<br>/g, '\n')}</p> {/* Replaces <br> with new lines */}

                    {promptingType === "Assisted" && (
                        <>
                            <h4>Assisting Questions:</h4>
                            <ul className="assisting-questions-list">
                                {assistantQuestions.split("\n").map((q, index) =>
                                    q.trim() ? <li key={index}>{q.trim()}</li> : null
                                )}
                            </ul>
                            <div className="feedback-section">
                                <label className="feedback-label">
                                    Answer the feedback question(s) / Provide additional thoughts:
                                    <textarea
                                        value={feedback}
                                        onChange={handleFeedbackChange}
                                        disabled={isSubmittingFeedback || isFeedbackSubmitted}
                                        className="feedback-textarea"
                                        rows="4"
                                    />
                                </label>
                                <button
                                    onClick={handleSubmitFeedbackAndGetFinalResponse}
                                    disabled={isSubmittingFeedback || isFeedbackSubmitted || feedback.trim() === ""}
                                    className="submit-button"
                                >
                                    {isSubmittingFeedback ? "Submitting..." : isFeedbackSubmitted ? "Feedback Submitted" : "Submit Feedback and Get Final Response"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {finalResponse && promptingType === "Assisted" && (
                <div className="final-response-section">
                    <h4>Final Response after Feedback:</h4>
                    <p className="ai-response-text">{finalResponse.replace(/<br>/g, '\n')}</p>
                </div>
            )}

            {isNextButtonAvailable && (
                <button
                    onClick={handleNextScenario}
                    className="next-scenario-button"
                >
                    {nextButtonText}
                </button>
            )}
        </div>
    );
};

export default Survey;