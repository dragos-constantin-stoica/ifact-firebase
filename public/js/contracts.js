var contracts = {

    contractForm: {
        id: "contractForm",
        view: "form",
        width: 600,
        elements: [{
                view: "combo",
                name: "customer_id",
                label: "Customer"
            },
            {
                view: "text",
                name: "nume",
                label: "Customer Name",
                placeholder: "Numele societatii",
                labelWidth: 180,
                hidden: true
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
                type: "form",
                value: "SAVE",
                align: "center",
                click: function() {
                    var doc = $$("contractForm").getValues();
                    doc.nume = $$("contractForm").elements.customer_id.getInputNode().value;
                    if (!webix.isUndefined(doc.$unitValue)) { delete doc.$unitValue; }
                    if (webix.isUndefined(doc.uid) || webix.isUndefined(doc.id)) {
                        //add new contract for this customer
                        $$("contractList").add(upsert("contract", doc), 0);
                    } else {
                        //update existing contract
                        $$("contractList").updateItem(doc.id, upsert("contract", doc));
                    }
                    $$("contractList").refresh();
                    $$('newContractWindow').hide();
                }
            }
        ]

    },

    editContract: function() {
        var item_id = $$('contractList').getSelectedId();
        if (item_id.length == 0) {
            msg({
                text: "Please select an item from the list!",
                type: "error"
            });
            return;
        }
        if (webix.isUndefined($$("newContractWindow"))) {
            webix.ui({
                view: "window",
                id: "newContractWindow",
                width: 600,
                position: "top",
                head: "Edit contract",
                body: webix.copy(contracts.contractForm)
            }).show();
        } else {
            $$("newContractWindow").show();
        }
        $$('contractForm').clear();
        $$('contractForm').elements.customer_id.define("options", CUSTOMER.getCUSTOMER());
        $$('contractForm').elements.customer_id.refresh();
        $$('contractForm').setValues($$("contractList").getItem(item_id), true);
    },

    newContract: function() {
        if (webix.isUndefined($$("newContractWindow"))) {
            webix.ui({
                view: "window",
                id: "newContractWindow",
                width: 600,
                position: "top",
                head: "New Contract",
                body: webix.copy(contracts.contractForm)
            }).show();
        } else {
            $$("newContractWindow").show();
        }
        $$('contractForm').clear();
        $$('contractForm').elements.customer_id.define("options", CUSTOMER.getCUSTOMER());
        $$('contractForm').elements.customer_id.refresh();

    },

    ui: {
        id: "page-3",
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
                    height: 100,
                    headerHeight: 30,
                },
                template: function(obj, common) {
                    return (
                        "<div style='display: flex;justify-content: space-between;'><div><strong>" + obj.contract +
                        "</strong> [ <em>" + obj.start_date + "</em> - <em>" + obj.end_date + "</em> ]<br/>" +
                        obj.detalii.replace(new RegExp('\r?\n', 'g'), '<br />') + "</div></div>");
                },
                select: true
            },
            {
                cols: [{
                        view: "button",
                        type: "icon",
                        icon: "wxi-plus",
                        label: "Add",
                        width: 80,
                        align: "center",
                        click: "contracts.newContract"
                    },
                    {
                        view: "button",
                        type: "icon",
                        icon: "wxi-pencil",
                        label: "Edit",
                        width: 80,
                        align: "center",
                        click: "contracts.editContract"
                    }
                ]
            }
        ]
    }

};