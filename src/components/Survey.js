import React, { useState, useEffect } from "react";
import axios from "axios";

const Survey = ({ onComplete }) => {
    const scenarios = [
        {
            title: "Scenario 1: How do you manage stress?",
            paragraph: "This scenario asks about strategies people use to manage stress.",
        },
        {
            title: "Scenario 2: What is your opinion on climate change?",
            paragraph: "This scenario focuses on personal views regarding climate change and its impacts.",
        },
        {
            title: "Scenario 3: How do you prefer to work—individually or in a group?",
            paragraph: "This scenario discusses preferences for working in teams versus alone.",
        },
        {
            title: "Scenario 4: What are your thoughts on remote working?",
            paragraph: "This scenario looks at opinions on the growing trend of remote working.",
        },
        {
            title: "Scenario 5: What motivates you in your career?",
            paragraph: "This scenario inquires about what drives individuals in their professional lives.",
        },
    ];

    const [promptingType, setPromptingType] = useState(""); // Store selected prompting type
    const [currentScenario, setCurrentScenario] = useState(0); // Track the current scenario
    const [userQuestion, setUserQuestion] = useState(""); // User's input question
    const [response, setResponse] = useState(""); // OpenAI response
    const [feedback, setFeedback] = useState(""); // User's feedback
    const [randomizedScenarios, setRandomizedScenarios] = useState([]); // Randomized scenarios
    const [isFreePromptingComplete, setIsFreePromptingComplete] = useState(false); // Track completion of Free Prompting
    const [isAssistedPromptingComplete, setIsAssistedPromptingComplete] = useState(false); // Track completion of Assisted Prompting

    // Shuffle the scenarios randomly
    const shuffleScenarios = () => {
        const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
        setRandomizedScenarios(shuffled);
    };

    // Randomly select between Free or Assisted Prompting at the start
    useEffect(() => {
        setPromptingType(Math.random() > 0.5 ? "Free" : "Assisted");
        shuffleScenarios(); // Shuffle the scenarios
    }, []);

    // Handle user input for the question
    const handleQuestionChange = (e) => {
        setUserQuestion(e.target.value);
    };

    // Handle the OpenAI API call with max_tokens to limit the response length
    const handleSubmitQuestion = async () => {
        try {
            const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;;
            const prompt =
                promptingType === "Free"
                    ? userQuestion
                    : `Provide a detailed response to: ${randomizedScenarios[currentScenario].title}`;

            const openAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",  // Correct endpoint for chat models
                {
                    model: "gpt-4o-mini",  // The correct model name (ensure it's available for you)
                    messages: [
                        {
                            role: "user",  // User's role in the conversation
                            content: prompt, // The user input or scenario-based prompt
                        },
                    ],
                    max_tokens: 400,  // Approx 300 words (adjust as necessary)
                },
                {
                    headers: {
                        Authorization: `Bearer ${openAiApiKey}`,  // Correct API key
                    },
                }
            );

            // Formatting the response to look like ChatGPT's conversation
            const formattedResponse = `Assistant: ${openAiResponse.data.choices[0].message.content}`;

            setResponse(formattedResponse);  // Store the response in formatted ChatGPT-like style
        } catch (error) {
            console.error("Error fetching from OpenAI:", error.response ? error.response.data : error.message);
        }
    };

    // Handle feedback submission for a scenario
    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    // Move to the next scenario or switch to the other part (Free -> Assisted or Assisted -> Free)
    const handleNextScenario = () => {
        if (currentScenario < randomizedScenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setUserQuestion("");  // Reset question input for the next scenario
            setResponse("");  // Reset response
            setFeedback("");  // Reset feedback
        } else {
            if (promptingType === "Free" && !isFreePromptingComplete) {
                setIsFreePromptingComplete(true); // Mark Free Prompting as complete
                shuffleScenarios();  // Shuffle scenarios for Assisted Prompting
                setPromptingType("Assisted");  // Switch to Assisted Prompting
                setCurrentScenario(0);  // Reset scenario index for Assisted Prompting
            } else if (promptingType === "Assisted" && !isAssistedPromptingComplete) {
                setIsAssistedPromptingComplete(true); // Mark Assisted Prompting as complete
                onComplete();  // Finish the survey after both parts are completed
            }
        }
    };

    return (
        <div>
            <h2>{promptingType} Prompting</h2> {/* Displaying the prompting type */}

            <h3>{randomizedScenarios[currentScenario]?.title}</h3> {/* Displaying the title of the current scenario */}
            <p>{randomizedScenarios[currentScenario]?.paragraph}</p> {/* Displaying the paragraph of the current scenario */}

            {/* User Input for Question (For Free Prompting) */}
            <input
                type="text"
                placeholder="Ask a question here"
                value={userQuestion}
                onChange={handleQuestionChange}
            />

            <button onClick={handleSubmitQuestion}>Submit Question</button> {/* Submit the question */}

            {response && (
                <>
                    <h4>Response from OpenAI:</h4>
                    <p>{response}</p> {/* Displaying the response from OpenAI */}

                    {/* Feedback Form */}
                    <label>
                        Rate the response quality (1 - Poor, 5 - Excellent):
                        <select
                            value={feedback}
                            onChange={handleFeedbackChange}
                        >
                            <option value="">Select rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <br />

                    <button onClick={handleNextScenario}>
                        {currentScenario < randomizedScenarios.length - 1 ? "Next Scenario" : "Finish"}
                    </button>
                </>
            )}
        </div>
    );
};

export default Survey;
