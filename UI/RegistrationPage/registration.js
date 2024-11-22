document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", (event) => {
        // Prevent form submission for validation
        event.preventDefault();

        // Clear previous error messages
        clearErrors();

        // Perform validations
        let isValid = true;

        if (!validateUsername(usernameInput.value)) {
            showError(usernameInput, "Username must be at least 3 characters long.");
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }

        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, "Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number.");
            isValid = false;
        }

        // Submit form if all validations pass
        if (isValid) {
            form.submit();
            window.location.assign("../MainPage/main.html")
        }
    });

    // Validation functions
    function validateUsername(username) {
        return username.trim().length >= 3;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordRegex.test(password);
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);

        input.classList.add("error-input");
    }

    // Clear all error messages
    function clearErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.remove());

        const errorInputs = document.querySelectorAll(".error-input");
        errorInputs.forEach((input) => input.classList.remove("error-input"));
    }
});
