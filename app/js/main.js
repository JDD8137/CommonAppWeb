class CommonApp {
    
    constructor() {
        this.components = {
            ApplicationView: ApplicationView.getInstance(),   
            ApplicationReview: ApplicationReview.getInstance(),
        }
        this.bindUiActions_();
        this.container = $("#contentContainer")
        this.activeComponent = {};

        this.init();
    }

    bindUiActions_() {
        // Log out Button
        $("#logout").on("click", () => {
            this.redirectToLogin_();
        });
        $("#applicationReview").on("click", () => {this.renderComponent_(ApplicationReview)});
        $("#applicationView").on("click", () => {this.renderComponent_(ApplicationView)});
    }

    renderComponent_(component) {
        if (!!this.activeComponent.navItem) {
            this.activeComponent.navItem.removeClass("active");
            this.activeComponent.isActive = false;
        }
        this.activeComponent = component;
        component.navItem.addClass("active");
        this.container.html("");

        $("#pageTitle").html(component.title)
        component.getInstance().init(this.container);
    }

    init() {
        //this.registerAuthStateListener();
        this.renderComponent_(ApplicationReview);
    }

    redirectToLogin_() {
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
commonApp = new CommonApp();