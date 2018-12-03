class ApplicationView {

  constructor() {
    ApplicationView.componentName = "ApplicationView";
    ApplicationView.title = "Application View";
    ApplicationView.navItem = $("#applicationView");
    ApplicationView.viewTemplate = "";
    ApplicationView.selectedApplicant = {};
    ApplicationView.statusLookup = ["Admitted", "Rejected", "Waitlist", "Need more info"];
  }

  static getInstance() {
    if (!ApplicationView.instance) {
      ApplicationView.instance = new ApplicationView();
    }
    return ApplicationView.instance;
  }

  init(container) {
    this.container = container;
    this.isActive = true;
    this.renderApplicationView(container);
    console.log("Application View Initialized")
  }

  applicationListener() {
    if (!this.isActive || ApplicationView.viewTemplate == "") {
      return;
    }
    this.populateApplicationPicker();
  }

  renderApplicationView(container) {
    this.container = container;
    $.get("components/templates/ApplicationView.html", (template) => {
      ApplicationView.viewTemplate = template;
      container.html(template);
      this.populateApplicationPicker();
    }, "html");
  }

  populateApplicationPicker() {
    let applicantId = this.applicantId;
    const select = $("#applicationViewSelect");

    let usersPromise = WebDatabase.getAllUsers();
    let applicationsPromise = WebDatabase.getAllApplications();
    let submissionsPromise = WebDatabase.getUniversitySubmissions();

    if (select.length != 0) {
      select.empty();
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.selected = "selected";
      select.append(emptyOpt);
      Promise.all([applicationsPromise, usersPromise, submissionsPromise]).then((results) => {
        let allApplications = results[0];
        let allUsers = results[1];
        let submissions = results[2];

        submissions.forEach((submission) => {
          let application = allApplications.filter(a => {return a.applicationId == submission.applicantId})[0];
          allUsers.forEach((user => {
            if (application.applicantId == user.id) {
              const opt = document.createElement("option");
              let nameText = user.firstName + " " + user.lastName;
              application.name = nameText;
              opt.value = nameText;
              opt.setAttribute("data-id", submission.id)
              opt.innerHTML = nameText;
              select.append(opt);
            }
            select.selectpicker();
            select.on("change", this.handleSelection);
          }));
        })
        /*allApplications.forEach((application) => {
          allUsers.forEach((user => {
            if (application.applicantId == user.id) {
              const opt = document.createElement("option");
              let nameText = user.firstName + " " + user.lastName;
              application.name = nameText;
              opt.value = nameText;
              opt.setAttribute("data-id", application.id)
              opt.innerHTML = nameText;
              select.append(opt);
            }
            select.selectpicker();
            select.on("change", this.handleSelection);
          }));
        });*/
      });
    }
  }


  handleSelection() {
    let applicationId = $("#applicationViewSelect").find(":selected").attr("data-id");
    WebDatabase.getSubmissionById(applicationId).then((application) => {
      $.get("components/templates/ApplicationData.html", (template) => {
        Mustache.parse(template);
        let rendered = Mustache.render(template, {application: application});
        console.log(rendered);
        $(".applicationData").empty();
        $(".applicationData").append(rendered);
      }, "html");
    });
  }

  renderApplicationDetails(application) {
    $.get("components/templates/ApplicationView.html", (template) => {
      Mustache.parse(template);
      let rendered = Mustache.render(template, {application: application})
    }, "html");
    this.container.html(rendered);
  }
}
let applicationView = ApplicationView.getInstance();
