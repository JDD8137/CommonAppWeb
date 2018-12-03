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
		$("#admissionStatusSelect").on("change", (applicationId) => {
			let newStatus = $("#admissionStatusSelect").val();
			let id = $("#admissionStatusSelect").attr("submissionId");
			WebDatabase.updateApplicationField(id, "admissionsDecision", newStatus);
		});
	}

	renderApplicationReview_(container) {
		$.get("components/templates/ApplicationReview.html", (template) => {
			let applicationsPromise = WebDatabase.getAllApplications();
			let applicantsPromise = WebDatabase.getAllUsers();
			let universitiesPromise = WebDatabase.getAllUniversities();
			let submissionsPromise = WebDatabase.getUniversitySubmissions();

			Promise.all([applicationsPromise, applicantsPromise, universitiesPromise, submissionsPromise]).then((results) => {
				let applications = results[0]
				let users = results[1]
				let universities = results[2]
				let submissions = results[3]

				let toDisplay = [];
				submissions.forEach((submission) => {
					let application = applications.filter(a => {
						return a.applicantId == submission.applicationId
					})[0];
					let id = submission.id;
					var newSubmission = {...submission, ...application}
					newSubmission.id = id;
					users.forEach((user) => {
						if (newSubmission.applicantId == user.id) {
							newSubmission.name = user.firstName + " " + user.lastName;
						}
					});
					universities.forEach((uni) => {
						if (newSubmission.universityId == uni.id) {
							newSubmission.uni = uni.name;
						}
					});
					toDisplay.push(newSubmission);
				});
				Mustache.parse(template);
				let rendered = Mustache.render(template, {applications: toDisplay});
				container.html(rendered);
				this.bindUiActions();
				console.log(rendered);

				toDisplay.forEach((submission) => {
					let id = submission.id; 
					$(`select[submissionId='${id}']`).val(submission.admissionsDecision);
				})
			});
		}, "html");

	}
}
let applicationReview = ApplicationReview.getInstance();
