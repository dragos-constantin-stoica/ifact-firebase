//Main layout of the application
var myApp = {

    init: function() {
        myApp.showUI();
    },

    showUI: function() {

        if (!webix.isUndefined($$('mainLayout'))) $$('mainLayout').destructor();
        if (!webix.isUndefined($$('sidemenu'))) $$('sidemenu').destructor();
        if(USERNAME.getUSERNAME()){
            webix.ui(webix.copy(myApp.ui));
            webix.ui(webix.copy(myApp.sidemenu));

            if (!$$("menu").config.hidden) $$("menu").hide();
            $$('page-1').show();
            loadData("1");
            $$('breadcrumb').setValue('iFact - Supplier');
        }else{
            if (document.getElementById("firebaseui-auth-container") === null) {
                var div = document.createElement('div');
                div.id = 'firebaseui-auth-container';
                if (document.body.firstChild) {
                    document.body.insertBefore(div, document.body.firstChild);
                } else {
                    document.body.appendChild(div);
                }
            }
            webix.ui(webix.copy(myApp.ui_login));
        }

    },

    logout: function () {

        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            USERNAME.delUSERNAME();
            myApp.init();
            location.reload(true);
        }).catch(function (error) {
            // An error happened.
            USERNAME.delUSERNAME();
            myApp.init();
            location.reload(true);
        });
    },

    ui: {
        id: "mainLayout",
        view: "layout",
        rows: [{
                view: "toolbar",
                id: "toolbar",
                elements: [{
                        view: "icon",
                        icon: "fas fa-bars",
                        click: function() {
                            if ($$("menu").config.hidden) {
                                $$("menu").show();
                            } else
                                $$("menu").hide();
                        }
                    },
                    { view: "label", id: "breadcrumb", label: "iFact" },
                    {},
                    {
                        view: "button",
                        type: "iconButton",
                        icon: "fas fa-sign-out-alt",
                        label: "Logout",
                        autowidth: true,
                        click: "myApp.logout"
                    }
                ]
            },
            {
                id: "mainPage",
                view: "multiview",
                cells: [
                    supplier.ui,
                    customers.ui,
                    contracts.ui,
                    invoice.ui,
                    payments.ui,
                    configuration.ui,
                    //dashboard.ui()
                ],
                fitBiggest: true
            }
        ]
    },


    views: [
        supplier.ui,
        customers.ui,
        contracts.ui,
        invoice.ui,
        payments.ui,
        configuration.ui,
        //dashboard.ui
    ],

    sidemenu: {
        view: "sidemenu",
        id: "menu",
        width: 200,
        position: "left",
        state: function(state) {
            var toolbarHeight = $$("toolbar").$height;
            state.top = toolbarHeight;
            state.height -= toolbarHeight;
        },
        body: {
            view: "list",
            borderless: true,
            scroll: false,
            template: "<span class='webix_icon #icon#'></span> #value#",
            data: [
                { id: 1, value: "Supplier", icon: "fas fa-anchor" },
                { id: 2, value: "Clients", icon: "fas fa-user-circle" },
                { id: 3, value: "Contracts", icon: "fas fa-briefcase" },
                { id: 4, value: "Invoice", icon: "fas fa-calculator" },
                { id: 5, value: "Payments", icon: "fab fa-bitcoin" },
                { id: 6, value: "Dashboard", icon: "fas fa-chart-line" },
                { id: 7, value: "Configuration", icon: "fas fa-wrench" }

            ],
            select: true,
            type: {
                height: 40
            },
            on: {
                onItemClick: function(id, e, node) {
                    var item = this.getItem(id);
                    if (!$$("menu").config.hidden) $$("menu").hide();
                    preprocess(id);
                    $$('breadcrumb').setValue('iFact - ' + node.textContent);
                }
            }
        }
    },

    ui_login: {
        id: "mainLayout",
        view: "layout",
        type: "space",
        rows: [{
                view: "template",
                type: "header",
                template: "iFact the best invoicing platform!&nbsp;<img width=18px alt='iFact logo' src='img/icon.svg'/>",
                css: {
                    "text-align": "center"
                }
            },
            {
                view: "template",
                content: "firebaseui-auth-container",
            },
            {
                autoheight: true,
                template: "Please contact <b>office@level33.be</b> for a new account or any technical questions.",
                css: {
                    "text-align": "center"
                }

            }
        ]
    },


};