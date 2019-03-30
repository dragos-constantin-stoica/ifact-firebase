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
        invoice.generatePDF();

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