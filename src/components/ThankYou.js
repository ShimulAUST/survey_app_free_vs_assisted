import React from 'react';
import '../css/thankyou.css'; // Import the CSS for styling

const ThankYou = () => {
    return (
        <div className="thank-you-container">
            <h2>Thank You for Your Participation!</h2>
            <p>Your feedback is invaluable and greatly appreciated.</p>
            <p>You may now close this window or tab.</p>
            {/* You can add more details here if needed, e.g., contact info, future steps */}
        </div>
    );
};

export default ThankYou;