function validateMyForm() {
    var passwordFieldInput = document.getElementById("Password");
    var passwordFieldConfInput = document.getElementById("PasswordConfirmation");
    var errorMessageBox = document.getElementById("errorMessageJS");

    // Check if passwords match
    if (passwordFieldInput.value != passwordFieldConfInput.value) {
        errorMessageBox.innerHTML = "Your password and password confirmation do not match."
        return false;
    } else {
        var passMatch = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
        if (!passMatch.test(passwordFieldInput.value)) {
            errorMessageBox.innerHTML = "Select a strong password at least 8 characters long, with at least 1 capital letter, lowercase letter, and number."
            return false;
        }
    }

    return true;
}
