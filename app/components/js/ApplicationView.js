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

    if (select.length != 0) {
      select.empty();
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.selected = "selected";
      select.append(emptyOpt);
      Promise.all([applicationsPromise, usersPromise]).then((results) => {
        let allApplications = results[0];
        let allUsers = results[1];

        allApplications.forEach((application) => {
          allUsers.forEach((user => {
            if (application.applicantId == user.id) {
              const opt = document.createElement("option");
              let nameText = user.firstName + " " + user.lastName;
              application.name = nameText;
              opt.value = nameText;
              opt.innerHTML = nameText;
              select.append(opt);
            }
            select.selectpicker();
            select.on("change", this.handleSelection);
          }));
        });
      });
    }
  }


  handleSelection() {
    let applicationId = $("#applicationViewSelect").val();
    let application = WebDatabase.getApplicationByApplicationId(applicationId);
    this.renderApplicationDetails(application);
  }

  renderApplicationDetails(application) {
    $.get("components/templates/ApplicationView.html", (template) => {
      Mustache.parse(template);
      let rendered = Mustache.render(template, {application: application})
    }, "html");
  }
}
let applicationView = ApplicationView.getInstance();

