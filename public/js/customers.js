var customers = {
    customersForm: {
        id: "customersForm",
        view: "form",
        width: 600,
        elementsConfig: {
            labelWidth: 180,
            minWidth: 300
        },
        elements: [{
                view: "text",
                name: "nume",
                label: "Nume",
                placeholder: "Numele societatii"
            },
            {
                view: "text",
                name: "NORG",
                label: "Nr. Ord. Reg. Com.",
                placeholder: "Numar de Ordine in Registrul Comertului"
            },
            {
                view: "text",
                name: "CUI",
                label: "C.U.I",
                placeholder: "Cod Unic de Identificare"
            },
            {
                view: "text",
                name: "TVA",
                label: "TVA EU",
                placeholder: "TVA European"
            },
            {
                view: "textarea",
                name: "adresa",
                label: "Adresa",
                height: 110,
                placeholder: "Str. , Nr. , Bl., Sc., Apt., Cod Postal, Localitatea, Comuna, Judetul/Sector, Tara"
            },
            {
                view: "text",
                name: "banca",
                label: "Banca",
                placeholder: "Banca"
            },
            {
                view: "text",
                name: "sucursala",
                label: "Sucursala",
                placeholder: "Sucursala bancii"
            },
            {
                view: "text",
                name: "IBAN",
                label: "IBAN",
                placeholder: "IBAN"
            },
            {
                view: "button",
                type: "form",
                value: "SAVE",
                align: "center",
                click: function() {
                    var doc = $$("customersForm").getValues();
                    if (webix.isUndefined(doc.uid) || webix.isUndefined(doc.id)) {
                        $$("customersList").add(upsert("customer", doc), 0);
                    } else {
                        $$("customersList").updateItem(doc.id, upsert("customer", doc));
                    }
                    $$("customersList").refresh();
                    $$("customersForm").hide();
                }
            }
        ]
    },

    editCustomer: function() {
        var item_id = $$("customersList").getSelectedId();
        if (item_id.length == 0) {
            msg({
                text: "Please select an item from the list!",
                type: "error"
            });
            return;
        }
        if (webix.isUndefined($$("newCustomerWindow"))) {
            webix
                .ui({
                    view: "window",
                    id: "newCustomerWindow",
                    width: 600,
                    position: "top",
                    head: "Modifica date Client",
                    body: webix.copy(customers.customersForm)
                })
                .show();
        } else {
            $$("newCustomerWindow").show();
        }
        $$("customersForm").clear();
        $$("customersForm").setValues($$("customersList").getItem(item_id), true);
    },

    newCustomer: function() {
        if (webix.isUndefined($$("newCustomerWindow"))) {
            webix
                .ui({
                    view: "window",
                    id: "newCustomerWindow",
                    width: 600,
                    position: "top",
                    head: "Client Nou",
                    body: webix.copy(customers.customersForm)
                })
                .show();
        } else {
            $$("newCustomerWindow").show();
        }
        $$("customersForm").clear();
    },

    ui: {
        id: "page-2",
        rows: [{
                view: "list",
                id: "customersList",
                template: function(obj, common) {
                    return (
                        "<div style='display: flex;justify-content: space-between;'><div><strong>" + obj.nume +
                        "</strong><br/>Adresa: " + obj.adresa.replace(new RegExp("\r?\n", "g"), "<br />") +
                        "</br>CUI: " + obj.CUI +
                        " | Nr. Ord. Reg. Com.: " + obj.NORG +
                        " | TVA EU: " + obj.TVA +
                        "<br/>Banca: " + obj.banca +
                        " - Sucursala: " + obj.sucursala +
                        "<br/><strong>IBAN: " + obj.IBAN +
                        "</strong></div></div>"
                    );
                },
                select: true,
                type: {
                    height: 200
                }
            },
            {
                cols: [{
                        view: "button",
                        type: "icon",
                        icon: "wxi-plus",
                        label: "Add",
                        width: 80,
                        align: "center",
                        click: "customers.newCustomer"
                    },
                    {
                        view: "button",
                        type: "icon",
                        icon: "wxi-pencil",
                        label: "Edit",
                        width: 80,
                        align: "center",
                        click: "customers.editCustomer"
                    }
                ]
            }
        ]
    }
};