var supplier = {

    save: function() {
        var doc = $$("supplierForm").getValues();
        doc.conturi = [];
        $$("conturi").data.each(function(obj) {
            var cpy = webix.copy(obj);
            delete cpy.id;
            doc.conturi.push(cpy);
        });
        if (typeof doc.submit !== 'undefined') delete doc.submit;

        $$("supplierForm").setValues(upsert("supplier", doc), true);
    },

    edit: function() {
        var item_id = $$('conturi').getSelectedId();

        if (item_id.length == 0) {
            msg({ text: "Please select an item from the list!", type: "error" });
            return;
        }

        if (webix.isUndefined($$('conturiwindow'))) {
            webix.ui({
                view: "window",
                id: "conturiwindow",
                width: 400,
                position: "top",
                head: "Bank Accounts",
                body: webix.copy(supplier.conturiForm)
            }).show();
        } else {
            $$('conturiwindow').show();
        }
        $$('conturiform').clear();
        $$('conturiform').setValues($$('conturi').getItem(item_id));
    },

    delete: function() {
        var item_id = $$('conturi').getSelectedId();
        if (item_id.length > 0) {
            $$('conturi').remove(item_id);
            $$('conturi').refresh();
            msg({ text: "Bank Account Deleted Successfully!", type: "success" });
        } else {
            msg({ text: "Please select an item from the list!", type: "error" });
        }

    },

    add: function() {
        if (webix.isUndefined($$('conturiwindow'))) {

            webix.ui({
                view: "window",
                id: "conturiwindow",
                width: 400,
                position: "top",
                head: "Bank Accounts",
                body: webix.copy(supplier.conturiForm)
            }).show();
        } else {
            $$('conturiwindow').show();
        }
        $$('conturiform').clear();
        $$('conturiform').setValues({
            "id": "new"
        });
    },

    conturiForm: {
        id: "conturiform",
        view: "form",
        width: 400,

        elements: [{
                view: "text",
                type: "text",
                label: "Bank",
                name: "banca"
            },
            {
                view: "text",
                type: 'text',
                label: "Office",
                name: "sucursala"
            },
            {
                view: "text",
                type: 'text',
                label: "IBAN",
                name: "IBAN"
            },
            {
                view: "text",
                type: 'text',
                label: "SWIFT",
                name: "SWIFT"
            },
            {
                view: "text",
                type: 'text',
                label: "BIC",
                name: "BIC"
            },
            {
                view: "text",
                type: 'text',
                label: "Currency",
                name: "valuta"
            },

            {
                view: "button",
                label: "Save",
                type: "form",
                click: function() {
                    if (!this.getParentView().validate()) {
                        msg({
                            type: "error",
                            text: "Banca, sucursala si IBAN sunt obligatorii!"
                        });
                    } else {
                        var result = $$('conturiform').getValues();
                        if (result.id == "new") {
                            delete result.id;
                            $$('conturi').add(result, 0);
                            $$('conturi').refresh();
                        } else {
                            $$('conturi').updateItem(result.id, result);
                            $$('conturi').refresh();
                        }
                        $$("conturiform").hide();
                    }
                }
            }
        ],
        rules: {
            "banca": webix.rules.isNotEmpty,
            "sucursala": webix.rules.isNotEmpty,
            "IBAN": webix.rules.isNotEmpty
        }
    },

    ui: {
        id: "page-1",
        rows: [{
            view: "form",
            id: "supplierForm",
            scroll: 'y',
            elementsConfig: {
                labelWidth: 180
            },
            elements: [{
                    view: "text",
                    name: "nume",
                    label: "Company",
                    placeholder: "company name"
                },
                {
                    view: "text",
                    name: "NORG",
                    label: "Registration No.",
                    placeholder: "Numar de Ordine in Registrul Comertului"
                },
                {
                    view: "text",
                    name: "EUNORG",
                    label: "EU Registration No.",
                    placeholder: "Numar de ordine European in Registrul Comertului"
                },
                {
                    view: "text",
                    name: "CUI",
                    label: "Company identifier",
                    placeholder: "Cod Unic de Identificare"
                },
                {
                    view: "text",
                    name: "TVA",
                    label: "VAT No.",
                    placeholder: "TVA European"
                },
                {
                    view: "textarea",
                    name: "adresa",
                    label: "Address",
                    height: 110,
                    placeholder: "Str. , Nr. , Bl., Sc., Apt., Cod Postal, Localitatea, Comuna, Judetul/Sector, Tara"
                },

                {
                    view: "forminput",
                    label: "Conturi",
                    body: {
                        rows: [{
                                view: "list",
                                autoheight: true,
                                autowidth: true,
                                id: "conturi",
                                type: {
                                    height: 58
                                },
                                select: true,
                                template: "<div style='overflow: hidden;float:left;'>Bank: #banca#, Office: #sucursala#" +
                                    "<br/>IBAN: #IBAN# SWIFT: #SWIFT# BIC: #BIC# [#valuta#]</div>"
                            },
                            {
                                cols: [{
                                        view: "button",
                                        type: "icon",
                                        icon: "wxi-plus",
                                        label: "Add",
                                        width: 80,
                                        click: "supplier.add"
                                    },
                                    {
                                        view: "button",
                                        type: "icon",
                                        icon: "wxi-pencil",
                                        label: "Edit",
                                        width: 80,
                                        click: "supplier.edit"
                                    },
                                    {},
                                    {
                                        view: "button",
                                        type: "icon",
                                        icon: "wxi-trash",
                                        label: "Delete",
                                        width: 80,
                                        click: "supplier.delete"
                                    }
                                ]

                            }
                        ]
                    }
                },
                {
                    view: "button",
                    type: "form",
                    label: "SAVE",
                    align: "center",
                    width: 100,
                    click: "supplier.save"
                }
            ]
        }]
    }

};