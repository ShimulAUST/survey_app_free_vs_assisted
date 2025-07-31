import React, { useState } from "react";

// Bradley Balanced Latin Square generator
function balancedLatinSquare(array, participantId) {
    let result = [];
    let j = 0, h = 0;

    for (let i = 0; i < array.length; ++i) {
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

    // Reverse if odd-length array and odd participantId
    if (array.length % 2 !== 0 && participantId % 2 !== 0) {
        result.reverse();
    }

    return result;
}

const scenarioConditions = [
    "s1a", "s1b", "s2a", "s2b", "s3a", 
    "s3b", "s4a", "s4b", "s5a", "s5b"
];

const SurveyFlow = () => {
    const [participantId, setParticipantId] = useState(0);
    const [sequence, setSequence] = useState([]);

    const handleGenerate = () => {
        const order = balancedLatinSquare(scenarioConditions, participantId);
        setSequence(order);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>Bradley Balanced Latin Square Generator</h2>

            <label>
                Participant ID (0 to 9):&nbsp;
                <input
                    type="number"
                    value={participantId}
                    min="0"
                    max="9"
                    onChange={(e) => setParticipantId(Number(e.target.value))}
                />
            </label>
            <button onClick={handleGenerate}>Generate Order</button>

            {sequence.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Scenario Order for Participant {participantId + 1}</h3>
                    <ol>
                        {sequence.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default SurveyFlow;
