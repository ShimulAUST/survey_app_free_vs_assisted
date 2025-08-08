// import React, { useState } from "react";
// import AsyncSelect from "react-select/async"; // For searchable country select
// import axios from "axios";
// import Cookies from 'js-cookie'; // To access cookies

// const DemographicsForm = ({ onSubmit }) => {
//     const [gender, setGender] = useState("");
//     const [otherGender, setOtherGender] = useState("");
//     const [education, setEducation] = useState("");
//     const [otherEducation, setOtherEducation] = useState("");
//     const [aiExperience, setAiExperience] = useState("");
//     const [otherAiExperience, setOtherAiExperience] = useState("");
//     const [computerProficiency, setComputerProficiency] = useState("");
//     const [technologyAccess, setTechnologyAccess] = useState("");
//     const [location, setLocation] = useState("");
//     const [occupation, setOccupation] = useState("");
//     const [otherOccupation, setOtherOccupation] = useState("");
//     const [ethnicity, setEthnicity] = useState("");
//     const [otherEthnicity, setOtherEthnicity] = useState("");
//     const [techUsageFrequency, setTechUsageFrequency] = useState("");
//     const [ageGroup, setAgeGroup] = useState("");
//     const userId = Cookies.get('userId');

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         onSubmit({ ageGroup, gender });
//         // Check if userId is present in cookies
//         if (!userId) {
//             alert("User ID not found. Please make sure you're properly logged in.");
//             return;
//         }

//         // Prepare the data to be sent to the backend
//         const formData = {
//             userId, // Include userId from cookies
//             gender,
//             otherGender,
//             education,
//             otherEducation,
//             aiExperience,
//             otherAiExperience,
//             computerProficiency,
//             technologyAccess,
//             location,
//             occupation,
//             otherOccupation,
//             ethnicity,
//             otherEthnicity,
//             techUsageFrequency,
//             ageGroup,
//         };

//         // Send the data to the backend using axios
//         try {
//             const response = await axios.post("http://localhost:5050/api/demographics", formData);
//             console.log("Demographics data submitted successfully:", response.data);
//             alert("Demographics data submitted successfully.");
//             // Example redirect to another page

//             // Modify to your next page URL
//         } catch (error) {
//             console.error("Error submitting demographics data:", error);
//             alert("Failed to submit the demographics form. Please try again.");
//         }
//     };

//     // Function to fetch countries from RestCountries v3 API with fields parameter
//     const loadCountries = (inputValue) => {
//         return axios
//             .get("https://restcountries.com/v3.1/all", {
//                 params: {
//                     fields: "name"  // Request only the country name field
//                 }
//             })
//             .then((res) =>
//                 res.data
//                     .filter((country) =>
//                         country.name.common.toLowerCase().includes(inputValue.toLowerCase())
//                     )
//                     .map((country) => ({
//                         label: country.name.common,
//                         value: country.name.common
//                     }))
//             )
//             .catch((error) => {
//                 console.error("Error fetching countries:", error);
//             });
//     };

//     return (
//         <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
//             <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Demographics Form</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Gender Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Gender:</label>
//                     <select
//                         value={gender}
//                         onChange={(e) => setGender(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {gender === "Other" && (
//                         <input
//                             type="text"
//                             placeholder="Please specify"
//                             value={otherGender}
//                             onChange={(e) => setOtherGender(e.target.value)}
//                             style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
//                         />
//                     )}
//                 </div>

//                 {/* Education Level Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Education Level:</label>
//                     <select
//                         value={education}
//                         onChange={(e) => setEducation(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="High School">High School</option>
//                         <option value="Undergraduate">Undergraduate</option>
//                         <option value="Graduate">Graduate</option>
//                         <option value="Postgraduate">Postgraduate</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {education === "Other" && (
//                         <input
//                             type="text"
//                             placeholder="Please specify"
//                             value={otherEducation}
//                             onChange={(e) => setOtherEducation(e.target.value)}
//                             style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
//                         />
//                     )}
//                 </div>

//                 {/* AI Experience Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Prior Experience with AI:</label>
//                     <select
//                         value={aiExperience}
//                         onChange={(e) => setAiExperience(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="None">None</option>
//                         <option value="Some experience">Some experience</option>
//                         <option value="Advanced experience">Advanced experience</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {aiExperience === "Other" && (
//                         <input
//                             type="text"
//                             placeholder="Please specify"
//                             value={otherAiExperience}
//                             onChange={(e) => setOtherAiExperience(e.target.value)}
//                             style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
//                         />
//                     )}
//                 </div>

//                 {/* Occupation Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Occupation:</label>
//                     <select
//                         value={occupation}
//                         onChange={(e) => setOccupation(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="Student">Student</option>
//                         <option value="Engineer">Engineer</option>
//                         <option value="Doctor">Doctor</option>
//                         <option value="Teacher">Teacher</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {occupation === "Other" && (
//                         <input
//                             type="text"
//                             placeholder="Please specify"
//                             value={otherOccupation}
//                             onChange={(e) => setOtherOccupation(e.target.value)}
//                             style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
//                         />
//                     )}
//                 </div>

//                 {/* Ethnicity Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Ethnicity:</label>
//                     <select
//                         value={ethnicity}
//                         onChange={(e) => setEthnicity(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="Asian">Asian</option>
//                         <option value="Caucasian">Caucasian</option>
//                         <option value="African">African</option>
//                         <option value="Hispanic">Hispanic</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {ethnicity === "Other" && (
//                         <input
//                             type="text"
//                             placeholder="Please specify"
//                             value={otherEthnicity}
//                             onChange={(e) => setOtherEthnicity(e.target.value)}
//                             style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
//                         />
//                     )}
//                 </div>

//                 {/* Country Section (Searchable Dropdown) */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Location (Country/Region):</label>
//                     <AsyncSelect
//                         cacheOptions
//                         loadOptions={loadCountries}
//                         onChange={(selectedOption) => setLocation(selectedOption ? selectedOption.value : "")}
//                         defaultOptions
//                         placeholder="Search for country"
//                         isClearable
//                     />
//                 </div>

//                 {/* Technology Usage Frequency Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Technology Usage Frequency:</label>
//                     <select
//                         value={techUsageFrequency}
//                         onChange={(e) => setTechUsageFrequency(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="Rarely">Rarely</option>
//                         <option value="Occasionally">Occasionally</option>
//                         <option value="Frequently">Frequently</option>
//                     </select>
//                 </div>

//                 {/* Age Group Section */}
//                 <div style={{ marginBottom: "15px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>Age Group:</label>
//                     <select
//                         value={ageGroup}
//                         onChange={(e) => setAgeGroup(e.target.value)}
//                         style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
//                     >
//                         <option value="18-24">18-24</option>
//                         <option value="25-34">25-34</option>
//                         <option value="35-44">35-44</option>
//                         <option value="45+">45+</option>
//                     </select>
//                 </div>

//                 <div style={{ textAlign: "center" }}>
//                     <button
//                         type="submit"
//                         style={{
//                             padding: "10px 20px",
//                             fontSize: "16px",
//                             borderRadius: "5px",
//                             backgroundColor: "#28a745",
//                             color: "#fff",
//                             border: "none",
//                             cursor: "pointer"
//                         }}
//                     >
//                         Submit
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default DemographicsForm;


import React, { useState } from "react";
import AsyncSelect from "react-select/async"; // For searchable country select
import axios from "axios";
import Cookies from 'js-cookie'; // To access cookies

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
    const userId = Cookies.get('userId');

    const validateForm = () => {
        if (!gender || (gender === "Other" && !otherGender)) {
            alert("Please select your gender or specify it.");
            return false;
        }
        if (!education || (education === "Other" && !otherEducation)) {
            alert("Please select your education level or specify it.");
            return false;
        }
        if (!aiExperience || (aiExperience === "Other" && !otherAiExperience)) {
            alert("Please select your AI experience or specify it.");
            return false;
        }
        if (!computerProficiency) {
            alert("Please select your computer proficiency.");
            return false;
        }
        if (!technologyAccess) {
            alert("Please select your technology access level.");
            return false;
        }

        if (!occupation || (occupation === "Other" && !otherOccupation)) {
            alert("Please select your occupation or specify it.");
            return false;
        }
        if (!ethnicity || (ethnicity === "Other" && !otherEthnicity)) {
            alert("Please select your ethnicity or specify it.");
            return false;
        }
        if (!location) {
            alert("Please select your location.");
            return false;
        }
        if (!techUsageFrequency) {
            alert("Please select your technology usage frequency.");
            return false;
        }
        if (!ageGroup) {
            alert("Please select your age group.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("User ID not found. Please make sure you're properly logged in.");
            return;
        }

        if (!validateForm()) return;

        onSubmit({ ageGroup, gender });

        const formData = {
            userId,
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
            ageGroup,
        };

        try {
            const response = await axios.post("http://localhost:5050/api/demographics", formData);
            console.log("Demographics data submitted successfully:", response.data);
            alert("Demographics data submitted successfully.");
        } catch (error) {
            console.error("Error submitting demographics data:", error);
            alert("Failed to submit the demographics form. Please try again.");
        }
    };

    const loadCountries = (inputValue) => {
        return axios
            .get("https://restcountries.com/v3.1/all", {
                params: {
                    fields: "name"
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
                        <option value="">-- Select Gender --</option>
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
                        <option value="">-- Select Education Level --</option>
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
                        <option value="">-- Select AI Experience --</option>
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
                {/* Computer Proficiency Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Computer Proficiency:</label>
                    <select
                        value={computerProficiency}
                        onChange={(e) => setComputerProficiency(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select Proficiency --</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                {/* Technology Access Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Technology Access:</label>
                    <select
                        value={technologyAccess}
                        onChange={(e) => setTechnologyAccess(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select Access Level --</option>
                        <option value="Limited">Limited</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Full">Full</option>
                    </select>
                </div>

                {/* Occupation Section */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Occupation:</label>
                    <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select Occupation --</option>
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
                        <option value="">-- Select Ethnicity --</option>
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

                {/* Country Section */}
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

                {/* Technology Usage Frequency */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Technology Usage Frequency:</label>
                    <select
                        value={techUsageFrequency}
                        onChange={(e) => setTechUsageFrequency(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select Frequency --</option>
                        <option value="Rarely">Rarely</option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Frequently">Frequently</option>
                    </select>
                </div>

                {/* Age Group */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Age Group:</label>
                    <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select Age Group --</option>
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
