export const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
};

export const isValidPassword = (password) => {
    return password.length >= 8;
};