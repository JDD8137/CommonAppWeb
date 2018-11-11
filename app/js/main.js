class CommonApp {
    
    constructor() {
        this.bindUiActions_()
    }

    bindUiActions_() {
        // Log out Button
        $("#logout").on("click", () => {
            this.redirectToLogin();
        });
    }

    init() {

    }

    redirectToLogin() {
        window.location.href = "login.html"
    }

    registerAuthStateListener() {
        firebase.auth().onAuthStateChanged((user) => {
            // TODO(danielms): handle user roles.
            if (user) {
                CommonApp.init()
                console.log("User is logged in.")
            } 
        });
    }
}
// TODO(danielms): make static
commonApp = new CommonApp();