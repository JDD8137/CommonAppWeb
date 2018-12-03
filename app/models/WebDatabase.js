class WebDatabase {

	static updateApplicationField(applicationId, field, value) {
		const database = firebase.database();
		const ref = database.ref("universitySubmissions/" + applicationId);
		let updateObject = {};
		updateObject[field] = value;
		ref.update(updateObject);
	}

	static getUserData() {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const userId = firebase.auth().currentUser.uid;
			const ref = database.ref("users/" + userId);
			ref.once("value").then((snapshot) => {
				let user = {};
				user.name = snapshot.val().name;
				user.role = snapshot.val().role;
				resolve(user);
			})
			.catch((error) => {
				reject(error);
			})
		});	
	}

	static getAllApplications() {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("/applications")
			ref.orderByChild("universityId").once("value").then((snapshot) => {
				let applications = [];
				snapshot.forEach((childSnapshot) => {
					let application = childSnapshot.val();
					application.id = childSnapshot.key;
					applications.push(application)
				});
				resolve(applications)
			}).catch((error) => {
				reject(error);
			})
		});
	}

	static getUniversitySubmissions() {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("/universitySubmissions")
			ref.once("value").then((snapshot) => {
				let submissions = [];
				snapshot.forEach((childSnapshot) => {
					let submission = childSnapshot.val();
					submission.id = childSnapshot.key;
					submissions.push(submission);
				});
				resolve(submissions);
			}).catch((error) => {
				reject(error);
			})
		})
	}

	static getApplicantByApplicantId(userId) {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("applicants/" + userId);
			ref.once("value").then((snapshot) => {
				let applicant = snapshot.val();
				resolve(applicant);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	static getApplicationByApplicationId(applicationId) {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("applications/" + applicationId);
			ref.once("value").then((snapshot) => {
				let application = snapshot.val();
				resolve(application);
			}).catch((error) => {
				reject(error)
			});
		});
	}

	static getSubmissionById(submissionId) {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("universitySubmissions/" + submissionId);
			ref.once("value").then((snapshot) => {
				let submission = snapshot.val();
				let applicationId = submission.applicationId;
				let appRef = database.ref("applications/");
				appRef.orderByChild("applicantId").equalTo(applicationId).on("value", (snapshot) => {
					let application = snapshot.val();
					let application = application[Object.keys(application)[0]];
					let id = submission.id;
					let toReturn = {...application, ...submission}
					toReturn.id = id;
					resolve(toReturn)
				})
			})
		})
	}

	static getAllUsers() {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("/applicants");
			ref.orderByChild("name").once("value").then((snapshot) => {
				let users = [];
				snapshot.forEach((childSnapshot) => {
					let user = childSnapshot.val();
					user.id = childSnapshot.key;
					users.push(user);
				});
				resolve(users);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	static getAllUniversities() {
		return new Promise((resolve, reject) => {
			const database = firebase.database();
			const ref = database.ref("/universities");
			ref.orderByChild("name").once("value").then((snapshot) => {
				let universities = [];
				snapshot.forEach((childSnapshot) => {
					let uni = childSnapshot.val();
					uni.id = childSnapshot.key;
					universities.push(uni)
				});
				resolve(universities);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	static setUserRole(userId, role) {
		const database = firebase.database();
		const ref = database.ref("/users/" + userId);
		let updateObject = {};
		updateObject[field] = value;
		ref.update(updateObject);
	}

}