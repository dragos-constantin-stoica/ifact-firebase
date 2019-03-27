var customers = {

    editCustomer: function() {
        var item_id = $$('customersList').getSelectedId();
        if (item_id.length == 0) {
            msg({
                text: "Please select an item from the list!",
                type: "error"
            });
            return;
        }
        $$('customersForm').clear();
        $$('customersForm').setValues($$('customersList').getItem(item_id), true);
    },

    newCustomer: function() {
        $$('customersForm').clear();
    },

    ui: {
        id: "page-2",
        cols: [{
                rows: [
                    { view: "template", template: "Clients", type: "header" },
                    {
                        view: "list",
                        id: "customersList",
                        //template:"#nume#",
                        template: function(obj, common) {
                            return "<div style='display: flex;justify-content: space-between;'><div><strong>" + obj.nume + "</strong><br/>" +
                                "Adresa: " + obj.adresa.replace(new RegExp('\r?\n', 'g'), '<br />') + "</br>" +
                                "CUI: " + obj.CUI + " | Nr. Ord. Reg. Com.: " + obj.NORG + " | TVA EU: " + obj.TVA + "<br/>" +
                                "Banca: " + obj.banca + " - Sucursala: " + obj.sucursala + "<br/>" +
                                "<strong>IBAN: " + obj.IBAN + "</strong></div>" +
                                "</div>";
                        },
                        select: true,
                        //autowidth:true,
                        width: 600,
                        type: {
                            height: 200
                        },
                        url: "firestore->customer",
                        save: "firestore->customer"
                    },
                    {
                        cols: [
                            { view: "button", type: "icon", icon: "wxi-plus", label: "Add", width: 80, align: "center", click: "customers.newCustomer" },
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
            },
            { view: "resizer" },
            {
                rows: [
                    { view: "template", template: "Client Form", type: "header" },
                    {
                        id: "customersForm",
                        view: "form",
                        //width: 600,
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
                                    var doc = $$('customersForm').getValues();

                                    //Check if the document is new
                                    if (webix.isUndefined(doc.uid) || webix.isUndefined(doc.doc_id)) {
                                        var newdoc = webix.firestore.collection("customer").doc();
                                        doc.id = newdoc.id;
                                        doc.doc_id = newdoc.id;
                                        doc.uid = USERNAME.getUSERNAME().uid;
                                        $$("customersForm").setValues(doc, true);
                                        //newdoc.set(doc);
                                        $$('customersList').add(doc, 0);
                                        $$('customersList').refresh();
                                        webix.message("Customer successfully created!");
                                    } else {
                                        // Update document in collection
                                        webix.firestore.collection("customer").doc(doc.doc_id).set(doc)
                                            .then(function() {
                                                $$('customersList').updateItem(doc.doc_id, doc);
                                                $$('customersList').refresh();
                                                webix.message("Customer successfully updated!");
                                                console.log("Document successfully written!");
                                            })
                                            .catch(function(error) {
                                                console.error("Error writing document: ", error);
                                            });
                                    }


                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }

};