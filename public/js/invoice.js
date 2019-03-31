var invoice = {

    setlocalData: function(createNewInvoice) {
        //clean-up existing data
        INVOICEDATA.initInvoiceData();

        INVOICEDATA.setInvoiceData("FURNIZOR", SUPPLIER_DATA.get());
        INVOICEDATA.setInvoiceData("SERIA", INVOICESN.getINVOICESN().SERIA);
        INVOICEDATA.setInvoiceData("NUMARUL", INVOICESN.getINVOICESN().NUMARUL);
        //Get cusotmer infomration
        INVOICEDATA.setInvoiceData("BENEFICIAR", CUSTOMER.find($$("customerContract").getSelectedItem().customer_id));

        //Search for the bank account accroding to the currency
        //Supose there is only one account per currency
        INVOICEDATA.getInvoiceData().FURNIZOR.conturi.forEach(function(element) {
            if ($$("invoiceForm").elements.supplier.getText().indexOf(element.valuta) != -1) {
                var tmpFurnizor = INVOICEDATA.getInvoiceData().FURNIZOR;
                for (var prop in element) {
                    tmpFurnizor[prop] = element[prop];
                }
                INVOICEDATA.setInvoiceData("FURNIZOR", tmpFurnizor);
            }
        }, this);

        var form_data = $$('invoiceForm').getValues();
        INVOICEDATA.setInvoiceData("COPIES", form_data.copies);
        INVOICEDATA.setInvoiceData("TEMPLATE", $$("template").getInputNode().value);
        INVOICEDATA.setInvoiceData("TVA", (typeof form_data.TVA === 'string') ? parseFloat(form_data.TVA) : form_data.TVA);
        INVOICEDATA.setInvoiceData("CURS_BNR", {
            data: form_data.invoice_date,
            eur_ron: (typeof form_data.exchange_rate === 'string') ? parseFloat(form_data.exchange_rate) : form_data.exchange_rate
        });

        INVOICEDATA.setInvoiceData("INVOICE_DATE", form_data.invoice_date);
        INVOICEDATA.setInvoiceData("DUE_DATE", form_data.due_date);

        var tmpInvoiceLine = [];
        $$("invoice_line").data.each(function(obj) {
            tmpInvoiceLine.push({
                details: obj.invoice_details,
                um: obj.invoice_mu,
                qty: obj.invoice_qty,
                up: obj.invoice_up,
                line_value: obj.line_value,
                line_tva: obj.line_tva
            });
            INVOICEDATA.setInvoiceData("INVOICE_SUM", INVOICEDATA.getInvoiceData().INVOICE_SUM + obj.line_value);
            INVOICEDATA.setInvoiceData("INVOICE_TVA_SUM", INVOICEDATA.getInvoiceData().INVOICE_TVA_SUM + obj.line_tva);
        });
        INVOICEDATA.setInvoiceData("INVOICE_LINE", tmpInvoiceLine);
        INVOICEDATA.setInvoiceData("INVOICE_TOTAL", INVOICEDATA.getInvoiceData().INVOICE_TOTAL + INVOICEDATA.getInvoiceData().INVOICE_SUM + INVOICEDATA.getInvoiceData().INVOICE_TVA_SUM);


        firebase.storage().ref('upload/' + SUPPLIER_DATA.get().id).getDownloadURL().then(function(url) {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    base64data = reader.result;
                    //console.log(base64data);
                    INVOICEDATA.setInvoiceData("LOGO", base64data);
                    // "data:image/png;base64,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"
                    invoice.generatePDF();
                };


            };
            xhr.open('GET', url);
            xhr.send();

        }).catch(function(error) {
            // Handle any errors
        });

        /*
                if (createNewInvoice) {

                    var doc = webix.copy(invoice.localData);
                    doc.doctype = "INVOICE";
                    doc._id = doc.SERIA + "___" + ("00000" + doc.NUMARUL).substr(-5);
                    $.couch.db(DBNAME).saveDoc(doc, {
                        success: function(data) {
                            console.log(data);
                            webix.message("Factura " + invoice.localData.SERIA + " - " + invoice.localData.NUMARUL +
                                " a fost salvata in baza de date cu succes!");
                        },
                        error: function(status) {
                            webix.message({
                                type: "error",
                                text: status
                            });
                            console.log(status);
                        }
                    });
                }
        */


    },

    generatePDF: function() {
        tmpTemplate = Handlebars.compile(templates[INVOICEDATA.getInvoiceData().TEMPLATE]);
        PDF_DOC = JSON.parse(tmpTemplate(INVOICEDATA.getInvoiceData()));
        pdfMake.createPdf(PDF_DOC).getDataUrl(function(outDoc) {
            $$("frame-body").load(outDoc);
        });
    },

    invoiceLineForm: {
        view: "form",
        id: "invoiceLineForm",
        minWidth: 600,
        elementsConfig: { labelWidth: 180 },
        elements: [
            { view: "textarea", name: "invoice_details", label: "Detalii factura:", placeholder: "descrierea bunurilor si a serviciilor", height: 110 },
            { view: "text", name: "invoice_mu", label: "UM:", placeholder: "unitatea de masura" },
            { view: "text", name: "invoice_qty", label: "Cantitatea:", placeholder: "cantiatea" },
            { view: "text", name: "invoice_up", label: "Pret unitar:", placeholder: "pret unitar" },
            { view: "textarea", name: "line_value", label: "Valoarea:", placeholder: "formula de calcul sau valoarea sumei totale", height: 110 },
            {
                view: "button",
                label: "Save",
                type: "form",
                click: function() {
                    if (!this.getParentView().validate()) {
                        webix.message({ type: "error", text: "Detaliile si suma sunt obligatorii!" });
                    } else {
                        var result = $$('invoiceLineForm').getValues();
                        if (result.id == "new") {
                            delete result.id;
                            result.line_value = eval(result.line_value);
                            result.line_tva = (result.line_value * $$('invoiceForm').getValues().TVA) / 100.0;
                            $$('invoice_line').add(result);
                            $$('invoice_line').refresh();
                        } else {
                            result.line_value = eval(result.line_value);
                            result.line_tva = (result.line_value * $$('invoiceForm').getValues().TVA) / 100.0;
                            $$('invoice_line').updateItem(result.id, result);
                            $$('invoice_line').refresh();
                        }
                        $$("invoiceLineForm").hide();
                        $$("invoice_line").clearSelection();
                    }
                }
            }
        ],
        rules: {
            "invoice_details": webix.rules.isNotEmpty,
            "line_value": webix.rules.isNotEmpty
        }
    },

    addLine: function() {
        if (webix.isUndefined($$('invoicewindow'))) {
            //get the window with the edit form
            webix.ui({
                view: "window",
                id: "invoicewindow",
                width: 600,
                position: "top",
                head: "Adauga Linie Factura",
                body: webix.copy(invoice.invoiceLineForm)
            }).show();
        } else {
            $$('invoicewindow').show();
        }

        $$('invoiceLineForm').clear();
        $$('invoiceLineForm').setValues({
            "id": "new"
        });

    },

    editLine: function() {
        if (typeof $$("invoice_line").getSelectedId(false, true) === 'undefined') {
            msg({
                type: "error",
                text: "Please select one row!"
            });
            return;
        }
        if (webix.isUndefined($$('invoicewindow'))) {
            webix.ui({
                view: "window",
                id: "invoicewindow",
                width: 600,
                position: "top",
                head: "Modifica Linie Factura",
                body: webix.copy(invoice.invoiceLineForm)
            }).show();
        } else {
            $$('invoicewindow').show();
        }
        $$('invoiceLineForm').clear();
        $$('invoiceLineForm').setValues($$('invoice_line').getSelectedItem());
    },

    delLine: function() {
        if (typeof $$("invoice_line").getSelectedId(false, true) !== 'undefined') {
            $$("invoice_line").remove($$("invoice_line").getSelectedId(false, true));
            $$("invoice_line").clearSelection();
        } else {
            msg({ type: "error", text: "Please select one row!" });
        }
    },

    ui: {
        id: "page-4",
        cols: [{
                id: "invoiceForm",
                view: "form",
                scroll: 'y',
                minWidth: 500,
                elementsConfig: { labelWidth: 100 },
                elements: [{
                        cols: [
                            { view: "counter", step: 1, value: 1, min: 1, max: 5, name: "copies", label: "Nr. copii:" },
                            { view: "text", name: "serial_number", label: "Seria-Nr.:", placeholder: "get the current serial number", readonly: true },
                        ]
                    },
                    {
                        view: "combo",
                        id: "template",
                        name: "template",
                        label: "Template:",
                        options: [{ id: 1, value: "RO" }, { id: 2, value: "EN" }],
                        value: 1
                    },
                    {
                        view: "combo",
                        name: "supplier",
                        label: "Furnizor:"
                    },
                    {
                        view: "forminput",
                        //label: "Beneficiar:",
                        labelWidth: 0,
                        height: 220,
                        body: {
                            rows: [
                                { view: "label", label: "Beneficiar:" },
                                {
                                    view: "unitlist",
                                    id: "customerContract",
                                    //name: "customerContract",
                                    sort: {
                                        by: "#nume#",
                                        dir: "asc"
                                    },
                                    uniteBy: function(obj) {
                                        return obj.nume;
                                    },
                                    type: { //setting item properties, optional
                                        height: 60,
                                        headerHeight: 30,
                                    },
                                    template: "#contract# din data de #start_date# (exp.: #end_date#)<br/>#detalii#",
                                    select: true
                                }
                            ]
                        }
                    },
                    {
                        cols: [
                            { view: "datepicker", stringResult: true, format: webix.Date.dateToStr("%d.%m.%Y"), date: new Date(), name: "invoice_date", label: "Emisa la:", placeholder: "data emiterii facturii" },
                            { view: "datepicker", stringResult: true, format: webix.Date.dateToStr("%d.%m.%Y"), date: new Date(), name: "due_date", label: "Scadenta la:", placeholder: "data scadenta" }
                        ]
                    },
                    {
                        cols: [
                            { view: "text", name: "TVA", label: "TVA:", placeholder: "TVA in procente" },
                            { view: "text", name: "exchange_rate", label: "Curs BNR:", placeholder: "€->RON" }
                        ]
                    },
                    {
                        view: "forminput",
                        autoheight: true,
                        labelWidth: 0,
                        body: {
                            rows: [
                                { view: "label", label: "Detalii factura:" },
                                {
                                    view: "datatable",
                                    autoheight: true,
                                    autowidth: true,
                                    resizeColumn: true,
                                    resizeRow: true,
                                    fixedRowHeight: false,
                                    rowLineHeight: 25,
                                    rowHeight: 25,
                                    select: true,
                                    footer: true,
                                    tooltip: true,
                                    id: "invoice_line",
                                    columns: [
                                        { id: "invoice_details", header: "Detalii", width: 300, fillspace: true, footer: { text: "TOTAL", colspan: 4 } },
                                        { id: "invoice_mu", header: "UM", width: 50 },
                                        { id: "invoice_qty", header: "Cant.", width: 50 },
                                        { id: "invoice_up", header: "PU", width: 50 },
                                        { id: "line_value", header: "Suma", adjust: true, width: 55, footer: { content: "summColumn" } },
                                        { id: "line_tva", header: "TVA", adjust: true, width: 55, footer: { content: "summColumn" } }
                                    ],
                                    on: {
                                        "onresize": function() {
                                            this.adjustRowHeight("invoice_details", true);
                                        },
                                        "onAfterAdd": function(id, index) {
                                            this.adjustRowHeight("invoice_details", true);
                                        },
                                        "onAfterUnSelect": function(data) {
                                            this.adjustRowHeight("invoice_details", true);
                                        }
                                    }
                                },
                                {
                                    cols: [{
                                            view: "button",
                                            type: "icon",
                                            icon: "wxi-plus",
                                            label: "Add",
                                            width: 80,
                                            click: "invoice.addLine"
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "wxi-pencil",
                                            label: "Edit",
                                            width: 80,
                                            click: "invoice.editLine"
                                        },
                                        {},
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "wxi-trash",
                                            label: "Delete",
                                            width: 80,
                                            click: "invoice.delLine"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        margin: 10,
                        cols: [{
                                view: "button",
                                type: "danger",
                                value: "CREATE INVOICE",
                                click: function() {
                                    //check that all mandatory fields in the form were filled in
                                    if (!$$('invoiceForm').validate()) {
                                        webix.message({ type: "error", text: "Creatation date, due date, exchange rate and VAT are mandatory!" });
                                        return;
                                    }
                                    if (webix.isUndefined($$("customerContract").getSelectedItem())) {
                                        webix.message({ type: "error", text: "Please select a customer" });
                                        return;
                                    }
                                    invoice.setlocalData(true);
                                }
                            },
                            {
                                view: "button",
                                type: "form",
                                value: "Preview",
                                click: function() {
                                    //check that all mandatory fields in the form were filled in
                                    if (!$$('invoiceForm').validate()) {
                                        webix.message({ type: "error", text: "Creatation date, due date, exchange rate and VAT are mandatory!" });
                                        return;
                                    }
                                    if (webix.isUndefined($$("customerContract").getSelectedItem())) {
                                        webix.message({ type: "error", text: "Please select a customer" });
                                        return;
                                    }
                                    invoice.setlocalData(false);
                                }
                            }
                        ]
                    }
                ],
                rules: {
                    TVA: webix.rules.isNotEmpty,
                    invoice_date: webix.rules.isNotEmpty,
                    due_date: webix.rules.isNotEmpty,
                    exchange_rate: webix.rules.isNotEmpty
                }
            },
            { view: "resizer" },
            { view: "iframe", id: "frame-body", src: "" }
        ]
    }

};