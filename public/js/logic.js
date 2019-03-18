var logic = {

    login: function() {
        if (!webix.isUndefined($$('mainLayout'))) $$('mainLayout').destructor();
        if (!webix.isUndefined($$('sidemenu'))) $$('sidemenu').destructor();
    },

    logout: function() {

        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            USERNAME.delUSERNAME();
            if (!webix.isUndefined($$('mainLayout'))) $$('mainLayout').destructor();
            if (!webix.isUndefined($$('sidemenu'))) $$('sidemenu').destructor();
            myApp.init();
            location.reload(true);
        }).catch(function(error) {
            // An error happened.
            USERNAME.delUSERNAME();
            if (!webix.isUndefined($$('mainLayout'))) $$('mainLayout').destructor();
            if (!webix.isUndefined($$('sidemenu'))) $$('sidemenu').destructor();
            myApp.init();
            location.reload(true);
        });
    }

};