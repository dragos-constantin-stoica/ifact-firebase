var contracts = {

    contractForm: {
        id: "newContractForm",
        view: "form",
        width: 400,
        elements: [{
                view: "combo",
                name: "newnume",
                label: "Customer",
                options: "firestore->customer"
            },
            { view: "text", name: "newcontract", label: "Contract", value: "" },
            {
                view: "button",
                label: "CREATE",
                type: "form",
                click: function() {
                    var name = $$('newContractForm').elements.newnume.getInputNode().value;
                    var supplier_id = $$('newContractForm').elements.newnume.getValue();
                    var contract = $$('newContractForm').getValues().newcontract;
                    var itemID = $$('contractList').add({
                        nume: name,
                        supplier_id: supplier_id,
                        contract: contract,
                        start_date: myDateFormat(new Date()),
                        end_date: myDateFormat(new Date())
                    }, false);
                    $$('contractList').select(itemID);
                    $$('newContractWindow').hide();
                }
            }
        ]
    },

    contractWindow: function() {
        //Select customer name from a prepopulated drop down list

        webix.ui({
            view: "window",
            id: "newContractWindow",
            width: 400,
            position: "top",
            head: "Contract nou",
            body: webix.copy(contracts.contractForm)
        }).show();

    },

    ui: {
        id: "page-3",
        cols: [{
                rows: [{
                        view: "unitlist",
                        id: "contractList",
                        sort: {
                            by: "#nume#",
                            dir: 'asc'
                        },
                        uniteBy: function(obj) {
                            return obj.nume;
                        },
                        type: { //setting item properties, optional
                            height: 60,
                            headerHeight: 30,
                        },
                        template: "#contract#</br>#start_date# - #end_date#",
                        select: true,
                        url: "firestore->contract",
                        save: "firestore->contract"
                    },
                    {
                        view: "button",
                        label: "NEW",
                        click: "contracts.contractWindow();"
                    }
                ]
            },
            { view: "resizer" },
            {
                id: "contractForm",
                view: "form",
                elements: [
                    { view: "text", name: "nume", label: "Nume", placeholder: "Numele societatii", labelWidth: 180, readonly: true },
                    { view: "text", name: "contract", label: "Contract", placeholder: "Contract", labelWidth: 180 },
                    { view: "datepicker", stringResult: true, format: webix.Date.dateToStr("%d.%m.%Y"), date: new Date(), name: "start_date", label: "Data inceput", placeholder: "Data inceput", labelWidth: 180 },
                    { view: "datepicker", stringResult: true, format: webix.Date.dateToStr("%d.%m.%Y"), date: new Date(), name: "end_date", label: "Data incheiere", placeholder: "Data sfarsit", labelWidth: 180 },
                    { view: "textarea", name: "detalii", label: "Detalii", height: 110, labelPosition: "top", placeholder: "Detalii despre contract: facturare, rate etc" },
                    { view: "button", value: "SAVE", click: '$$("contractForm").save();' }
                ]
            }
        ]
    }

};

/*

    contractForm: {
            id: "contractForm",
            view: "form",
            width: 600,
            elements: [{
                    view: "text",
                    name: "nume",
                    label: "Nume",
                    placeholder: "Numele societatii",
                    labelWidth: 180,
                    readonly: true
                },
                {
                    view: "text",
                    name: "contract",
                    label: "Contract",
                    placeholder: "Contract",
                    labelWidth: 180
                },
                {
                    view: "datepicker",
                    stringResult: true,
                    format: webix.Date.dateToStr("%d.%m.%Y"),
                    date: new Date(),
                    name: "start_date",
                    label: "Data inceput",
                    placeholder: "Data inceput",
                    labelWidth: 180
                },
                {
                    view: "datepicker",
                    stringResult: true,
                    format: webix.Date.dateToStr("%d.%m.%Y"),
                    date: new Date(),
                    name: "end_date",
                    label: "Data incheiere",
                    placeholder: "Data sfarsit",
                    labelWidth: 180
                },
                {
                    view: "textarea",
                    name: "detalii",
                    label: "Detalii",
                    height: 140,
                    labelPosition: "top",
                    placeholder: "Detalii despre contract: facturare, rate etc"
                },
                {
                    view: "button",
                    value: "SAVE",
                    click: function () {
                        var result = $$("contractForm").getValues();
                        if (result.id == "new") {
                            //add new contract for this customer
                            delete result.id;
                            $$("customersContractsList").add(result, 0);
                        } else {
                            //update existing contract
                            $$("customersContractsList").updateItem(result.id, result);
                        }
                        $$("customersContractsList").refresh();
                        $$('newContractWindow').hide();
                    }
                }
            ]

        },

        editContract: function (id, e) {
            var item_id = $$('customersContractsList').locate(e);
            webix.ui({
                view: "window",
                id: "newContractWindow",
                width: 600,
                position: "top",
                head: "Contract nou",
                body: webix.copy(customers.contractForm)
            }).show();
            $$('contractForm').clear();
            $$('contractForm').setValues({
                "doctype": "CONTRACT"
            }, true);
            $$('contractForm').setValues($$('customersContractsList').getItem(item_id), true);
        },

        newContract: function (id, e) {
            var item_id = $$('customersList').locate(e);
            webix.ui({
                view: "window",
                id: "newContractWindow",
                width: 600,
                position: "top",
                head: "Contract nou",
                body: webix.copy(customers.contractForm)
            }).show();
            $$('contractForm').clear();
            $$('contractForm').setValues({
                "id": "new",
                "doctype": "CONTRACT",
                "supplier_id": $$('customersList').getItem(item_id)._id,
                "nume": $$('customersList').getItem(item_id).nume
            }, true);
        },

*/