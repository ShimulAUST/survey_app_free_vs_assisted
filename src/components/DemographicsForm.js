import React, { useState } from "react";
import AsyncSelect from "react-select/async"; // For searchable country select
import axios from "axios";

const DemographicsForm = ({ onSubmit }) => {
    const [gender, setGender] = useState("");
    const [otherGender, setOtherGender] = useState("");
    const [education, setEducation] = useState("");
    const [otherEducation, setOtherEducation] = useState("");
    const [aiExperience, setAiExperience] = useState("");
    const [otherAiExperience, setOtherAiExperience] = useState("");
    const [computerProficiency, setComputerProficiency] = useState("");
    const [technologyAccess, setTechnologyAccess] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [otherOccupation, setOtherOccupation] = useState("");
    const [ethnicity, setEthnicity] = useState("");
    const [otherEthnicity, setOtherEthnicity] = useState("");
    const [techUsageFrequency, setTechUsageFrequency] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            gender,
            otherGender,
            education,
            otherEducation,
            aiExperience,
            otherAiExperience,
            computerProficiency,
            technologyAccess,
            location,
            occupation,
            otherOccupation,
            ethnicity,
            otherEthnicity,
            techUsageFrequency,
            ageGroup
        });
    };

    // Function to fetch countries from RestCountries v3 API with fields parameter
    const loadCountries = (inputValue) => {
        return axios
            .get("https://restcountries.com/v3.1/all", {
                params: {
                    fields: "name"  // Request only the country name field
                }
            })
            .then((res) =>
                res.data
                    .filter((country) =>
                        country.name.common.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((country) => ({
                        label: country.name.common,
                        value: country.name.common
                    }))
            )
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Demographics Form</h2>
            <form onSubmit={handleSubmit}>
                {/* Gender Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Gender:</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {gender === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={otherGender}
                            onChange={(e) => setOtherGender(e.target.value)}
                            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                        />
                    )}
                </div>

                {/* Education Level Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Education Level:</label>
                    <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Other">Other</option>
                    </select>
                    {education === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={otherEducation}
                            onChange={(e) => setOtherEducation(e.target.value)}
                            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                        />
                    )}
                </div>

                {/* AI Experience Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Prior Experience with AI:</label>
                    <select
                        value={aiExperience}
                        onChange={(e) => setAiExperience(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="None">None</option>
                        <option value="Some experience">Some experience</option>
                        <option value="Advanced experience">Advanced experience</option>
                        <option value="Other">Other</option>
                    </select>
                    {aiExperience === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={otherAiExperience}
                            onChange={(e) => setOtherAiExperience(e.target.value)}
                            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                        />
                    )}
                </div>

                {/* Occupation Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Occupation:</label>
                    <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="Student">Student</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Other">Other</option>
                    </select>
                    {occupation === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={otherOccupation}
                            onChange={(e) => setOtherOccupation(e.target.value)}
                            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                        />
                    )}
                </div>

                {/* Ethnicity Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Ethnicity:</label>
                    <select
                        value={ethnicity}
                        onChange={(e) => setEthnicity(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="Asian">Asian</option>
                        <option value="Caucasian">Caucasian</option>
                        <option value="African">African</option>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Other">Other</option>
                    </select>
                    {ethnicity === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={otherEthnicity}
                            onChange={(e) => setOtherEthnicity(e.target.value)}
                            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
                        />
                    )}
                </div>

                {/* Country Section (Searchable Dropdown) */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Location (Country/Region):</label>
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadCountries}
                        onChange={(selectedOption) => setLocation(selectedOption ? selectedOption.value : "")}
                        defaultOptions
                        placeholder="Search for country"
                        isClearable
                    />
                </div>

                {/* Technology Usage Frequency Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Technology Usage Frequency:</label>
                    <select
                        value={techUsageFrequency}
                        onChange={(e) => setTechUsageFrequency(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="Rarely">Rarely</option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Frequently">Frequently</option>
                    </select>
                </div>

                {/* Age Group Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Age Group:</label>
                    <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45+">45+</option>
                    </select>
                </div>

                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DemographicsForm;
