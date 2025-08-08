import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const getAllApiKeys = () => [
    process.env.REACT_APP_OPENAI_API_KEY,
    process.env.REACT_APP_OPENAI_API_KEY2,
    //   process.env.REACT_APP_OPENAI_API_KEY3,
    //   process.env.REACT_APP_OPENAI_API_KEY4,
    //   process.env.REACT_APP_OPENAI_API_KEY5,
];


// Try each key one by one until a response is returned
const callOpenAiWithRotation = async (payload) => {
    const apiKeys = getAllApiKeys();

    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        if (!apiKey) continue;

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );
            return response; // Success
        } catch (error) {
            console.warn(`API Key ${i + 1} failed:`, error?.response?.data?.error?.message || error.message);
            if (i === apiKeys.length - 1) {
                throw new Error("All OpenAI API keys failed.");
            }
        }
    }
};



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
        { title: "Marketing Strategy Scenario:", paragraph: "You need to create a marketing strategy for a new tech product targeted at university students. Based on this scenario, write a clear and detailed prompt that you could give to an AI or assistant to help you design the marketing plan. Your prompt should include the product's key features, target market, possible advertising channels (like social media, campus events, and digital ads), budget considerations, and how to measure campaign success." },
        { title: "Product Invention Scenario:", paragraph: "You need to invent a product that addresses a common problem people face in daily life. Based on this scenario, write a prompt that you could give to an AI or assistant to help you develop the idea. Your prompt should describe the problem, target audience, product features, how it’s different from existing solutions, and ideas for marketing and distribution." },
        { title: "Eassay on Social Issue Scenario:", paragraph: "You need to write a persuasive essay on a social issue such as universal basic income (UBI). Based on this scenario, create a prompt you could give to an AI or assistant to help you draft the essay. Your prompt should specify the stance you want to take, the need for reasoning and evidence, and a balanced discussion of pros and cons." },
        { title: "Problem Solving Scenario:", paragraph: "A cafe wants a program that can quickly calculate the total cost of a customer’s order, including tax. Based on this scenario, write a prompt that could be given to a coding assistant or AI tool to get help building the program." },
        { title: "Mathmatical Scenario:", paragraph: "You need to design 2 real-life math problems involving percentages and discounts for a shopping context. Based on this scenario, write a prompt you could give to an AI or assistant to help generate these problems. Your prompt should mention the price ranges, percentage values, and whether solutions should be shown." },
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

            const current = randomizedScenarios[currentScenario];

            const promptContent = current.promptingType === "Free"
                ? `
You are given a scenario and a user question. Based on that, provide a detailed and comprehensive response in valid HTML format only.

- Format all paragraphs using <p> tags.
- If the scenario involves math or code, use <pre><code>...</code></pre> blocks.
- Provide a 1–2 line explanation in <p> tags after each code or equation.
- Do NOT include any follow-up questions.

Scenario Title: ${current.title}
Scenario Context: ${current.paragraph}
User Question: ${userQuestion}
`
                : `
You are given a scenario and a user question. Based on that, provide a detailed and comprehensive response in valid HTML format.

- Format all paragraphs using <p> tags.
- If the scenario involves math or code, use <pre><code>...</code></pre> blocks.
- Provide a 1–2 line explanation in <p> tags after each code or equation.
- Return only valid HTML content for the main response.

After your main HTML response, generate five follow-up questions to prompt deeper thinking.
These questions must be returned as plain text only — do NOT include any HTML tags.
Format them exactly like:
Question 1: ...
Question 2: ...
...

Scenario Title: ${current.title}
Scenario Context: ${current.paragraph}
User Question: ${userQuestion}
`;



            const openAiResponse = await callOpenAiWithRotation(

                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Use <br> for paragraph breaks." },
                        { role: "user", content: promptContent },
                    ],
                    max_tokens: 1000,
                },
                // { headers: { Authorization: `Bearer ${openAiApiKey}` } }
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

            const current = randomizedScenarios[currentScenario];

            const finalPrompt = `Given the user's feedback: "${feedback}", the original scenario: "${current.title} ${current.paragraph}", and the initial AI response: "${response}", please provide a final, detailed response that incorporates the feedback.`;

            const finalOpenAiResponse = await callOpenAiWithRotation(

                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Use <br> for paragraph breaks." },
                        { role: "user", content: finalPrompt },
                    ],
                    max_tokens: 1000,
                },
                // { headers: { Authorization: `Bearer ${openAiApiKey}` } }
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
            <strong style={{ marginBottom: "8px" }}>{label}</strong>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num} style={{ display: "flex", margin: "1px", backgroundColor: "yellow", flexDirection: "column", alignItems: "center", fontSize: "0.85rem" }}>
                        <input
                            type="radio"
                            name={key}
                            value={num}
                            checked={evaluationAnswers[key] === String(num)}
                            onChange={(e) => handleEvaluationChange(key, e.target.value)}


                        />
                        <span style={{ marginTop: "4px" }}>
                            {
                                num === 1 ? " 1 (Strongly Disagree)" :
                                    num === 2 ? "2 (Disagree)" :
                                        num === 3 ? "3 (Neutral)" :
                                            num === 4 ? "4 (Agree)" :
                                                "5 (Strongly Agree)"
                            }
                        </span>
                    </label>
                ))}
            </div>
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
                <div >
                    <h4>AI Response:</h4>
                    {/* <div dangerouslySetInnerHTML={{ __html: response }} style={{ backgroundColor: "#e3e3e3" }} /> */}
                    <div
                        dangerouslySetInnerHTML={{ __html: response }}
                        style={{
                            backgroundColor: "#e3e3e3",  // light gray background
                            padding: "1rem",             // optional: adds spacing
                            borderRadius: "8px",         // optional: rounded corners
                            color: "#000",               // optional: ensures text is readable
                        }}
                    />

                    {/* <p>{response.replace(/<br>/g, "\n")}</p> */}
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
                    {/* <div dangerouslySetInnerHTML={{ __html: finalResponse }} style={{ backgroundColor: "#e3e3e3" }} /> */}
                    <div
                        dangerouslySetInnerHTML={{ __html: finalResponse }}
                        style={{
                            backgroundColor: "#e3e3e3",  // light gray background
                            padding: "1rem",             // optional: adds spacing
                            borderRadius: "8px",         // optional: rounded corners
                            color: "#000",               // optional: ensures text is readable
                        }}
                    />

                    {/* <p>{finalResponse.replace(/<br>/g, "\n")}</p> */}
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
