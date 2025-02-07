// src/utils/validation.js

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateSubscriptionRequest(data) {
    if (!data || !data.email) {
        return false;
    }
    return validateEmail(data.email);
}

module.exports = {
    validateEmail,
    validateSubscriptionRequest
};