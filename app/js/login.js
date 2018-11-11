class Login {
	
	constructor() {
		if (!Login.uiElements) {
			Login.uiElements = {
				submitButton: $("#loginSubmit"),
				emailInput: $("#loginEmail"),
				passwordInput: $("#loginPassword"),
				forgotLink: $("forgotLink"),
			}
		}
		this.bindUiActions_();
	}

	bindUiActions_() {
		Login.uiElements.submitButton.on("click", this.handleLoginSubmit_);
		Login.uiElements.forgotLink.on("click", this.forgotPassword_)
	}

	handleLoginSubmit_(event) {
		if (Login.forgotPasswordActive) {
			const email = $("#forgotEmail").val();
			//TODO(danielms): Handle forgot email
		} else {
			const email = Login.uiElements.emailInput.val();
			const password = Login.uiElements.passwordInput.val();
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					window.location.href = "index.html"
				})
				.catch((error) => {
					swal("Invalid Email and/or Password.");
				});
		}
	}

	handleForgotPassword_() {
		//TODO(danielms)
	}

}
let login = new Login();