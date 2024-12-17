const gmailRegex = (text) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i; // Define the regex pattern as a RegExp object
    return regex.test(text); // Use .test() to check if the text matches the regex
};

export { gmailRegex };