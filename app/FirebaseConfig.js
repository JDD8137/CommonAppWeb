class FirebaseConfig {

  constructor() {
    // SET MANUALLY
    this.MODE = "DEBUG";
    this.FIREBASE_DEBUG_CONFIG = {
      apiKey: "AIzaSyB37bsNp2B5e17P9ARAKvANMQEnJpKrRP0",
      authDomain: "common-application-8656d.firebaseapp.com",
      databaseURL: "https://common-application-8656d.firebaseio.com",
      projectId: "common-application-8656d",
      storageBucket: "common-application-8656d.appspot.com",
    };
  }

  getConfig() {
    switch (this.MODE) {
      case "PROD":
        return this.FIREBASE_PROD_CONFIG;
        break;
      case "DEBUG":
        return this.FIREBASE_DEBUG_CONFIG;
        break;
    }
  }

  getCloudFunctionUrl() {
    switch (this.MODE) {
      case "PROD":
        return "https://us-central1-rush-kit.cloudfunctions.net/";
        break;
      case "DEBUG":
        return "https://us-central1-rush-kit-dev.cloudfunctions.net/";
        break;
    }
  }
}
