import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function balancedLatinSquare(array, participantId) {
    let result = [];
    for (let i = 0, j = 0, h = 0; i < array.length; ++i) {
        let val = 0;
        if (i < 2 || i % 2 !== 0) {
            val = j++;
        } else {
            val = array.length - h - 1;
            ++h;
        }
        let idx = (val + participantId) % array.length;
        result.push(array[idx]);
    }
    if (array.length % 2 !== 0 && participantId % 2 !== 0) {
        result = result.reverse();
    }
    return result;
}

const Survey = ({ onComplete }) => {
    const scenarios = [
         { title: "Scenario 1:", paragraph: "You need to create a marketing strategy for a new tech product targeted at university students. Consider the product's key features and define the target market. Think about advertising channels like social media, campus events, and digital ads. Focus on budget allocation and how you would measure campaign success." },
         { title: "Scenario 2:", paragraph: "You need to invent a product that addresses a common problem people face in daily life. Describe the problem, the target audience, and the features of the product. Explain how it’s different from existing solutions and how it will be marketed and distributed." },
        { title: "Scenario 3:", paragraph: "Write a persuasive essay on a social issue such as universal basic income (UBI). Present a clear argument, backed by reasoning and evidence, and discuss both the pros and cons." },
        { title: "Scenario 4:", paragraph: "Design a fitness plan for someone with limited access to gym equipment, focusing on bodyweight exercises or resistance bands. The plan should include strength training, cardio, and flexibility." },
        { title: "Scenario 5:", paragraph: "Design an online course curriculum for 'Introduction to Data Science,' covering topics like data analysis, statistics, and machine learning." },
    ];

    const conditions = ["Free", "Assisted"];
    const scenarioConditions = scenarios.flatMap(scenario =>
        conditions.map(condition => ({ ...scenario, promptingType: condition }))
    );

    const userId = Cookies.get("userId");
    let participantId = (parseInt(userId - 1) % 10);

    const [currentScenario, setCurrentScenario] = useState(0);
    const [userQuestion, setUserQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [randomizedScenarios, setRandomizedScenarios] = useState([]);
    const [assistantQuestions, setAssistantQuestions] = useState("");
    const [feedback, setFeedback] = useState("");
    const [finalResponse, setFinalResponse] = useState("");

    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [questionSubmitted, setQuestionSubmitted] = useState(false);
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

    const [evaluationAnswers, setEvaluationAnswers] = useState({
        clarity: "",
        relevance: "",
        completeness: "",
        conciseness: "",
        factualAccuracy: "",
        contextualAccuracy: "",
        taskSuccess: "",
    });

    useEffect(() => {
        const ordered = balancedLatinSquare(scenarioConditions, participantId);
        setRandomizedScenarios(ordered);
    }, [participantId]);

    const resetScenarioStates = () => {
        setResponse("");
        setFeedback("");
        setFinalResponse("");
        setUserQuestion("");
        setAssistantQuestions("");
        setQuestionSubmitted(false);
        setIsFeedbackSubmitted(false);
        setEvaluationAnswers({
            clarity: "",
            relevance: "",
            completeness: "",
            conciseness: "",
            factualAccuracy: "",
            contextualAccuracy: "",
            taskSuccess: "",
        });
    };

    const handleEvaluationChange = (key, value) => {
        setEvaluationAnswers(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmitQuestion = async () => {
        setIsSubmittingQuestion(true);
        try {
            const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
            const current = randomizedScenarios[currentScenario];

            const promptContent = current.promptingType === "Free"
                ? userQuestion
                : `For the given scenario, provide a detailed and comprehensive response in one single paragraph.

After your main response, start a new paragraph and generate five distinct questions.These questions should encourage the user to elaborate, clarify, or think more deeply about their answer to the scenario. Format clearly using 'Question 1:', 'Question 2:', etc.


Scenario: ${current.title} ${current.paragraph}`;

            const openAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Use <br> for paragraph breaks." },
                        { role: "user", content: promptContent },
                    ],
                    max_tokens: 600,
                },
                { headers: { Authorization: `Bearer ${openAiApiKey}` } }
            );

            const responseText = openAiResponse.data.choices[0].message.content;
            let mainResponse = responseText;
            let generatedQuestions = "";

            if (current.promptingType === "Assisted") {
                const parts = responseText.split(/(Question 1:)/);
                if (parts.length > 2) {
                    mainResponse = parts[0].trim();
                    generatedQuestions = parts.slice(1).join("").trim();
                } else {
                    generatedQuestions = "No assisting questions generated.";
                }
            }

            setResponse(mainResponse);
            setAssistantQuestions(generatedQuestions);
            setQuestionSubmitted(true);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error occurred.");
        } finally {
            setIsSubmittingQuestion(false);
        }
    };

    const handleSubmitFeedbackAndGetFinalResponse = async () => {
        setIsSubmittingFeedback(true);
        try {
            const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
            const current = randomizedScenarios[currentScenario];

            const finalPrompt = `Given the user's feedback: "${feedback}", the original scenario: "${current.title} ${current.paragraph}", and the initial AI response: "${response}", please provide a final, detailed response that incorporates the feedback.`;

            const finalOpenAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Use <br> for paragraph breaks." },
                        { role: "user", content: finalPrompt },
                    ],
                    max_tokens: 600,
                },
                { headers: { Authorization: `Bearer ${openAiApiKey}` } }
            );

            setFinalResponse(finalOpenAiResponse.data.choices[0].message.content);
            setIsFeedbackSubmitted(true);
        } catch (error) {
            console.error("Feedback error:", error);
            setFinalResponse("Error occurred.");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const saveScenarioResult = async () => {
        try {
            const current = randomizedScenarios[currentScenario];
            await axios.post("http://localhost:5050/api/save-scenario-result", {
                userId: parseInt(userId),
                scenarioTitle: current.title,
                promptingType: current.promptingType,
                evaluation: evaluationAnswers,
            });
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleNextScenario = async () => {
        await saveScenarioResult();
        if (currentScenario < randomizedScenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            resetScenarioStates();
        } else {
            onComplete();
        }
    };

    const isPromptingComplete =
        (randomizedScenarios[currentScenario]?.promptingType === "Free" && questionSubmitted) ||
        (randomizedScenarios[currentScenario]?.promptingType === "Assisted" && isFeedbackSubmitted);

    const isEvaluationComplete = Object.values(evaluationAnswers).every(val => val !== "");
    const isNextButtonAvailable = isPromptingComplete && isEvaluationComplete;

    const renderLikertVertical = (key, label) => (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}>
            <strong>{label}</strong>
            {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} style={{ margin: "3px 0" }}>
                    <input
                        type="radio"
                        name={key}
                        value={num}
                        checked={evaluationAnswers[key] === String(num)}
                        onChange={(e) => handleEvaluationChange(key, e.target.value)}
                    />{" "}
                    {num} – {
                        num === 1 ? "Strongly Disagree" :
                        num === 2 ? "Disagree" :
                        num === 3 ? "Neutral" :
                        num === 4 ? "Agree" :
                        "Strongly Agree"
                    }
                </label>
            ))}
        </div>
    );

    return (
        <div className="survey-container">
            {(isSubmittingQuestion || isSubmittingFeedback) && (
                <div className="spinner-overlay"><div className="spinner"></div></div>
            )}

            <h2>{randomizedScenarios[currentScenario]?.promptingType} Prompting</h2>
            <h3>{randomizedScenarios[currentScenario]?.title}</h3>
            <p>{randomizedScenarios[currentScenario]?.paragraph}</p>

            <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                disabled={isSubmittingQuestion || questionSubmitted}
            />
            <button
                onClick={handleSubmitQuestion}
                disabled={isSubmittingQuestion || questionSubmitted || userQuestion.trim() === ""}
            >
                {isSubmittingQuestion ? "Submitting..." : questionSubmitted ? "Submitted" : "Submit Question"}
            </button>

            {response && (
                <div>
                    <h4>AI Response:</h4>
                    <p>{response.replace(/<br>/g, "\n")}</p>
                    {randomizedScenarios[currentScenario]?.promptingType === "Assisted" && (
                        <>
                            <h4>Assisting Questions:</h4>
                            <ul>
                                {assistantQuestions.split("\n").map((q, i) => q.trim() && <li key={i}>{q.trim()}</li>)}
                            </ul>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                disabled={isSubmittingFeedback || isFeedbackSubmitted}
                            />
                            <button
                                onClick={handleSubmitFeedbackAndGetFinalResponse}
                                disabled={isSubmittingFeedback || isFeedbackSubmitted || feedback.trim() === ""}
                            >
                                {isSubmittingFeedback ? "Submitting..." : isFeedbackSubmitted ? "Submitted" : "Submit Feedback"}
                            </button>
                        </>
                    )}
                </div>
            )}
            {(randomizedScenarios[currentScenario]?.promptingType === "Assisted" || isFeedbackSubmitted) && finalResponse && (
                <div>
                    <h4>Final Response:</h4>
                    <p>{finalResponse.replace(/<br>/g, "\n")}</p>
                </div>
            )}
            {isPromptingComplete && (
                <div>
                    <h4>AI Performance Evaluation</h4>
                    {renderLikertVertical("clarity", "The AI's responses were clear and easy to understand.")}
                    {renderLikertVertical("relevance", "The responses were relevant to the scenario and feedback.")}
                    {renderLikertVertical("completeness", "The responses were complete and detailed.")}
                    {renderLikertVertical("conciseness", "The responses were concise and not overly verbose.")}
                    {renderLikertVertical("factualAccuracy", "The responses were factually accurate.")}
                    {renderLikertVertical("contextualAccuracy", "The responses were contextually appropriate.")}

                    <h4>User Experience</h4>
                    {renderLikertVertical("taskSuccess", "I was successful in completing the task.")}
                </div>
            )}

            {isNextButtonAvailable && (
                <button onClick={handleNextScenario}>Next</button>
            )}
        </div>
    );
};

export default Survey;
