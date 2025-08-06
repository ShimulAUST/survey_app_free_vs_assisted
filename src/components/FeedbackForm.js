

import React, { useState } from 'react';
import '../css/feedback.css'; // Import the CSS file
import axios from "axios";
import Cookies from "js-cookie";

const FeedbackForm = ({ onSubmit }) => {
    // Initial state for all questionnaire items
    const [feedbackData, setFeedbackData] = useState({
        // Overall Experience & Usability (Applicable to both types)
        overallSatisfaction: '',
        easeOfUse: '',
        instructionsClarity: '',
        interfaceIntuitiveness: '',
        timeEfficiency: '',
        // AI Response Quality (Applicable to both types)
        aiResponseClarity: '',
        aiResponseRelevance: '',
        aiResponseCompleteness: '',
        aiResponseConciseness: '',
        // Assisted Prompting Specific
        aiHelpfulnessAssisted: '',
        assistingQuestionsRelevance: '',
        assistingQuestionsClarity: '',

        //free prompting specific.
        ideaExpression: '',
        confidenceInQuestion:'',
         alignmentWithResponse:'',
        // Comparative & Preference
        promptingPreference: '',
        
        // Open-ended
        
        mostEnjoyableAspect: '',
        mostChallengingAspect: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const saveFeedbackToBackend = async (data) => {
    try {
        const userId = Cookies.get("userId");
        await axios.post("http://localhost:5050/api/save-final-feedback", {
            userId,
            feedback: data
        });
    } catch (err) {
        console.error("Error saving feedback:", err);
    }
    };


    const handleSubmit = async(e) => {
        e.preventDefault();
        // You might want to add some basic validation here
        // e.g., ensure all required fields are filled
         await saveFeedbackToBackend(feedbackData);  //  Save to backend
        onSubmit(feedbackData);
    };

    // --- SHORTENED LABELS FOR IMPROVED LAYOUT ---
    // These labels are crucial for a clean Likert scale display.
    const likertScaleOptions = [
        { value: '1', label: '1 (Strongly Disagree)' },
        { value: '2', label: '2 (Disagree)' },
        { value: '3', label: '3 (Neutral)' },
        { value: '4', label: '4 (Agree)' },
        { value: '5', label: '5 (Strongly Agree)' },
    ];

    const helpfulnessScaleOptions = [
        { value: '1', label: '1 (Not at all)' },
        { value: '2', label: '2 (Slightly)' },
        { value: '3', label: '3 (Moderately)' },
        { value: '4', label: '4 (Very)' },
        { value: '5', label: '5 (Extremely)' },
    ];

    const relevanceScaleOptions = [
        { value: '1', label: '1 (Not Relevant)' },
        { value: '2', label: '2 (Slightly Relevant)' },
        { value: '3', label: '3 (Moderately Relevant)' },
        { value: '4', label: '4 (Very Relevant)' },
        { value: '5', label: '5 (Extremely Relevant)' },
    ];

    const clarityScaleOptions = [
        { value: '1', label: '1 (Not Clear)' },
        { value: '2', label: '2 (Slightly Clear)' },
        { value: '3', label: '3 (Moderately Clear)' },
        { value: '4', label: '4 (Very Clear)' },
        { value: '5', label: '5 (Extremely Clear)' },
    ];

    const completenessScaleOptions = [
        { value: '1', label: '1 (Not Complete)' },
        { value: '2', label: '2 (Slightly Complete)' },
        { value: '3', label: '3 (Moderately Complete)' },
        { value: '4', label: '4 (Very Complete)' },
        { value: '5', label: '5 (Extremely Complete)' },
    ];

    const concisenessScaleOptions = [
        { value: '1', label: '1 (Not Concise)' },
        { value: '2', label: '2 (Slightly Concise)' },
        { value: '3', label: '3 (Moderately Concise)' },
        { value: '4', label: '4 (Very Concise)' },
        { value: '5', label: '5 (Extremely Concise)' },
    ];

    const efficiencyScaleOptions = [
        { value: '1', label: '1 (Much Slower)' },
        { value: '2', label: '2 (Slower)' },
        { value: '3', label: '3 (No Change)' },
        { value: '4', label: '4 (Faster)' },
        { value: '5', label: '5 (Much Faster)' },
    ];
    const freedomScaleOptions = [
  { value: "1", label: "1 (Strongly Disagree)" },
  { value: "2", label: "2 (Disagree)" },
  { value: "3", label: "3 (Neutral)" },
  { value: "4", label: "4 (Agree)" },
  { value: "5", label: "5 (Strongly Agree)" },
];

const confidenceScaleOptions = [
  { value: "1", label: "1 (Not Confident)" },
  { value: "2", label: "2 (Slightly Confident)" },
  { value: "3", label: "3 (Moderately Confident)" },
  { value: "4", label: "4 (Confident)" },
  { value: "5", label: "5 (Very Confident)" },
];

const alignmentScaleOptions = [
  { value: "1", label: "1 (Strongly Disagree)" },
  { value: "2", label: "2 (Disagree)" },
  { value: "3", label: "3 (Neutral)" },
  { value: "4", label: '4 (Agree)' },
  { value: "5", label: '5 (Strongly Agree)' },
];

    return (
        <div className="feedback-form-container">
            <h2>Survey Completion Feedback</h2>
            <p className="form-description">Thank you for participating! Please take a moment to share your valuable feedback on your experience across both prompting styles.</p>

            <form onSubmit={handleSubmit}>

                {/* Section: Overall Experience & Usability */}
                <h3 className="form-section-heading">Overall Experience & Usability</h3>
                <div className="form-group">
                    <label htmlFor="overallSatisfaction">1. Overall, how satisfied were you with your experience during the survey?</label>
                    <div className="likert-options">
                        {likertScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="overallSatisfaction" value={option.value} checked={feedbackData.overallSatisfaction === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="easeOfUse">2. The survey interface was easy to navigate and use.</label>
                    <div className="likert-options">
                        {likertScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="easeOfUse" value={option.value} checked={feedbackData.easeOfUse === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="instructionsClarity">3. The instructions for each scenario and task were clear and understandable.</label>
                    <div className="likert-options">
                        {clarityScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="instructionsClarity" value={option.value} checked={feedbackData.instructionsClarity === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="interfaceIntuitiveness">4. How mentally demanding was the task?</label>
                    <div className="likert-options">
                        {likertScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="interfaceIntuitiveness" value={option.value} checked={feedbackData.interfaceIntuitiveness === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="timeEfficiency">5. How hurried or rushed was the pace of the task?</label>
                    <div className="likert-options">
                        {efficiencyScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="timeEfficiency" value={option.value} checked={feedbackData.timeEfficiency === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>
                

                {/* Section: AI Response Quality */}
                <h3 className="form-section-heading">AI Response Quality (Across Both Prompting Types)</h3>
                <div className="form-group">
                    <label htmlFor="aiResponseClarity">6. The AI's responses (both initial and final) were clear and easy to understand.</label>
                    <div className="likert-options">
                        {clarityScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="aiResponseClarity" value={option.value} checked={feedbackData.aiResponseClarity === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="aiResponseRelevance">7. The AI's responses were relevant to the scenarios and your questions/feedback.</label>
                    <div className="likert-options">
                        {relevanceScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="aiResponseRelevance" value={option.value} checked={feedbackData.aiResponseRelevance === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="aiResponseCompleteness">8. The AI's responses felt complete and sufficiently detailed.</label>
                    <div className="likert-options">
                        {completenessScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="aiResponseCompleteness" value={option.value} checked={feedbackData.aiResponseCompleteness === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="aiResponseConciseness">9. The AI's responses were concise and to the point, without unnecessary verbosity.</label>
                    <div className="likert-options">
                        {concisenessScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="aiResponseConciseness" value={option.value} checked={feedbackData.aiResponseConciseness === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Section: Assisted Prompting Specific */}
                <h3 className="form-section-heading">Assisted Prompting Specific Feedback</h3>
                <p className="form-section-description">Please answer the following questions based on your experience with **Assisted Prompting** scenarios.</p>

                <div className="form-group">
                    <label htmlFor="aiHelpfulnessAssisted">10. How helpful were the AI-generated "Assisting Questions" in guiding your thoughts or elaborating your responses?</label>
                    <div className="likert-options">
                        {helpfulnessScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="aiHelpfulnessAssisted" value={option.value} checked={feedbackData.aiHelpfulnessAssisted === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="assistingQuestionsRelevance">11. The AI-generated "Assisting Questions" were relevant to the scenario and the AI's initial response.</label>
                    <div className="likert-options">
                        {relevanceScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="assistingQuestionsRelevance" value={option.value} checked={feedbackData.assistingQuestionsRelevance === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="assistingQuestionsClarity">12. The AI-generated "Assisting Questions" were clear and easy to understand.</label>
                    <div className="likert-options">
                        {clarityScaleOptions.map(option => (
                            <label key={option.value} className="likert-radio">
                                <input type="radio" name="assistingQuestionsClarity" value={option.value} checked={feedbackData.assistingQuestionsClarity === option.value} onChange={handleChange} required />
                                <span className="likert-label-text">{option.label}</span> {/* Crucial: span for text */}
                            </label>
                        ))}
                    </div>
                </div>
                
                <h3 className="form-section-heading">Free Prompting Specific Feedback</h3>
<p className="form-section-description">
    Please answer the following questions based on your experience with <strong>Free Prompting</strong> scenarios.
</p>

<div className="form-group">
    <label htmlFor="ideaExpression">13. How freely were you able to express your own ideas and thoughts?</label>
    <div className="likert-options">
        {freedomScaleOptions.map(option => (
            <label key={option.value} className="likert-radio">
                <input
                    type="radio"
                    name="ideaExpression"
                    value={option.value}
                    checked={feedbackData.ideaExpression === option.value}
                    onChange={handleChange}
                    required
                />
                <span className="likert-label-text">{option.label}</span>
            </label>
        ))}
    </div>
</div>

<div className="form-group">
    <label htmlFor="confidenceInQuestion">14. How confident were you in forming your own question for the scenario?</label>
    <div className="likert-options">
        {confidenceScaleOptions.map(option => (
            <label key={option.value} className="likert-radio">
                <input
                    type="radio"
                    name="confidenceInQuestion"
                    value={option.value}
                    checked={feedbackData.confidenceInQuestion === option.value}
                    onChange={handleChange}
                    required
                />
                <span className="likert-label-text">{option.label}</span>
            </label>
        ))}
    </div>
</div>

<div className="form-group">
    <label htmlFor="alignmentWithResponse">15. The AI's response aligned well with my question and expectations.</label>
    <div className="likert-options">
        {alignmentScaleOptions.map(option => (
            <label key={option.value} className="likert-radio">
                <input
                    type="radio"
                    name="alignmentWithResponse"
                    value={option.value}
                    checked={feedbackData.alignmentWithResponse === option.value}
                    onChange={handleChange}
                    required
                />
                <span className="likert-label-text">{option.label}</span>
            </label>
        ))}
    </div>
</div>

                {/* Section: Comparative & Preference */}
                <h3 className="form-section-heading">Comparison & Preference</h3>
                <div className="form-group">
                    <label>16. Which prompting style did you prefer?</label>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input type="radio" name="promptingPreference" value="Free" checked={feedbackData.promptingPreference === 'Free'} onChange={handleChange} required />
                            Free Prompting (asking your own questions without AI guidance)
                        </label>
                        <label className="radio-option">
                            <input type="radio" name="promptingPreference" value="Assisted" checked={feedbackData.promptingPreference === 'Assisted'} onChange={handleChange} required />
                            Assisted Prompting (with AI-generated guiding questions)
                        </label>
                        <label className="radio-option">
                            <input type="radio" name="promptingPreference" value="Both Equally" checked={feedbackData.promptingPreference === 'Both Equally'} onChange={handleChange} required />
                            Both were equally good
                        </label>
                        <label className="radio-option">
                            <input type="radio" name="promptingPreference" value="Neither" checked={feedbackData.promptingPreference === 'Neither'} onChange={handleChange} required />
                            Neither (I have no strong preference or disliked both equally)
                        </label>
                    </div>
                </div>

                {/* Section: Open-ended Feedback */}
                <h3 className="form-section-heading">Open-ended Comments</h3>
                <div className="form-group">
                    <label htmlFor="mostEnjoyableAspect">17. What did you find most enjoyable or effective about the survey experience?</label>
                    <textarea id="mostEnjoyableAspect" name="mostEnjoyableAspect" value={feedbackData.mostEnjoyableAspect} onChange={handleChange} rows="4" className="textarea-input"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="mostChallengingAspect">18. What did you find most challenging or frustrating, or what could be improved?</label>
                    <textarea id="mostChallengingAspect" name="mostChallengingAspect" value={feedbackData.mostChallengingAspect} onChange={handleChange} rows="4" className="textarea-input"></textarea>
                </div>

                <button type="submit" className="submit-feedback-button">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;