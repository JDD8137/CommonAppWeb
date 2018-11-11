class ApplicationReview {
	
	constructor() {
		ApplicationReview.componentName = "ApplicationReview";
		ApplicationReview.title = "Application Review";
		ApplicationReview.navItem = $("#applicationReview");
		ApplicationReview.viewTemplate = "";
		ApplicationReview.statusLookup = ["Admitted", "Rejected", "Waitlist", "Need more info"];
	}

	static getInstance() {
		if (!ApplicationReview.instance) {
			ApplicationReview.instance = new ApplicationReview();
		}
		return ApplicationReview.instance;
	}

	init(container) {
		this.container = container;
		this.isActive = true;
		this.renderApplicationReview_(container);
		console.log("Application Review View Initialized");
	}

	bindUiActions() {
		
	}

	renderApplicationReview_(container) {

		$.get("components/templates/ApplicationReview.html", (template) => {
			
			let applicationsPromise = WebDatabase.getAllApplications();
			let applicantsPromise = WebDatabase.getAllUsers();
			let universitiesPromise = WebDatabase.getAllUniversities();

			Promise.all([applicationsPromise, applicantsPromise, universitiesPromise]).then((results) => {
				let applications = results[0]
				let users = results[1]
				let universities = results[2]
				applications.forEach((application) => {
					users.forEach((user) => {
						if (application.applicantId == user.id) {
							application.name = user.firstName + " " + user.lastName;
						}
					});
					universities.forEach((uni) => {
						if (application.universityId == uni.id) {
							application.uni = uni.name;
						}
					});
				});
				Mustache.parse(template);
				let rendered = Mustache.render(template, {applications: applications});
				container.html(rendered);
				console.log(rendered);
			});
		}, "html");

	}
}
ApplicationReview.getInstance(); 
