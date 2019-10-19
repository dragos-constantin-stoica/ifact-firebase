var logic = {

    logout: function() {

        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            USERNAME.delUSERNAME();
            myApp.init();
            location.reload(true);
        }).catch(function(error) {
            // An error happened.
            USERNAME.delUSERNAME();
            myApp.init();
            location.reload(true);
        });
    }

};