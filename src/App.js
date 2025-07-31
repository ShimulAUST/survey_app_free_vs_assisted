import React, { useState } from "react";
import ConsentForm from "./components/ConsentForm";
import DemographicsForm from "./components/DemographicsForm";
import Instructions from "./components/Instructions";
import Survey from "./components/Survey";
import FeedbackForm from "./components/FeedbackForm";
import ThankYou from "./components/ThankYou";

const App = () => {
  const [step, setStep] = useState(0); // Track current step in the form
  const [formData, setFormData] = useState({
    consent: false,
    demographics: { age: "", gender: "" },
    preferredPrompting: "",
    feedback: {},
    scenariosData: [],
  });

  const handleConsent = (consent) => {
    setFormData({ ...formData, consent });
    setStep(1);
  };

  const handleDemographicsSubmit = (data) => {
    setFormData({ ...formData, demographics: data });
    setStep(2);
  };

  // const handlePromptingChoice = (choice) => {
  //   setFormData({ ...formData, preferredPrompting: choice });
  //   setStep(3);
  // };

  const handleSurveyComplete = () => {
    console.log("Survey part completed. Moving to FeedbackForm (Step 4).");
    setStep(4); // Advance to the FeedbackForm
  };

  const handleFeedbackSubmit = (feedback) => {
    setFormData({ ...formData, feedback });
    setStep(5);
  };

  return (
    <div className="form-container">
      
      {step === 0 && <ConsentForm onConsent={handleConsent} />}
      {step === 1 && <DemographicsForm onSubmit={handleDemographicsSubmit} />}
      {step === 2 && <Instructions onNext={() => setStep(3)} />}
      {step === 3 && (
        <Survey
          onComplete={handleSurveyComplete}

        />
      )}
      {step === 4 && <FeedbackForm onSubmit={handleFeedbackSubmit} />}
      {step === 5 && <ThankYou />}
    </div>
  );
};

export default App;
