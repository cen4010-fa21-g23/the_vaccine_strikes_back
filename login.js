var hasSignedIn = false;

function validateTextBox() {
     var val1 = document.getElementById("typeEmail").value;
     var val2 = document.getElementById("typePassword").value;
     
     if(!val1.replace(/\s/g, '').length || !val2.replace(/\s/g, '').length){
          console.log('One of the inputs is invalid.');
          return false;
     }
     if(!validateEmail(val1)){
          alert("Email must be a valid email address.");
          return false;
     }
     if(val2.length < 8){
          alert("Password must contain 8 characters or more.");
          return false;
     }

     return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function createAccount(){
     if(validateTextBox()){
          var email = document.getElementById("typeEmail").value;
          var password = document.getElementById("typePassword").value;
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          // ...
          })
          .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          });
     }
}

function login(){
     if(validateTextBox()){
          var email = document.getElementById("typeEmail").value;
          var password = document.getElementById("typePassword").value;
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
          });
     }
}

function logout(){
     firebase.auth().signOut().then(function() {
       // Sign-out successful.
     }).catch(function(error) {
       // An error happened.
     });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    alert('Hello ' + email + ', you are successfully signed in!');
    hasSignedIn = true;
    document.getElementById("signoutdiv").style.display = "block";
    // ...
  } else {
       if(hasSignedIn == true && !alert('Signed out successfully!')){window.location.reload();}
    // User is signed out.
    // ...
  }
});