var configuration = {


    export: function() {
        /*
        var promise_xls = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/toxls/charts/export2Excel");

        promise_xls
            .then(function(realdata) {
                //success
                // original data
                var data = realdata.json();
                var ws_name = "Invoices";

                function Workbook() {
                    if (!(this instanceof Workbook)) return new Workbook();
                    this.SheetNames = [];
                    this.Sheets = {};
                }

                var wb = new Workbook(),
                    ws = XLSX.utils.aoa_to_sheet(data);

                // add worksheet to workbook
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'binary'
                });

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                saveAs(new Blob([s2ab(wbout)], {
                    type: "application/octet-stream"
                }), "financialstatement.xlsx");

            }).fail(function(err) {
                //error
                webix.message({
                    type: "error",
                    text: err.responseText
                });
                console.log(err);
            });
        */
    },

    exportJSON: function() {
        /*
        var promise_exportJSON = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/exportJSON/config/exportJSON");

        promise_exportJSON
            .then(function(realdata) {
                saveAs(new Blob([JSON.stringify(realdata.json(), 2)], {
                    type: "application/json"
                }), "iFact_EXPORT.json");
            })
            .fail(function(err) {
                //error
                webix.message({
                    type: "error",
                    text: err.responseText
                });
                console.log(err);
            });
        */
    },

    importJSON: function() {
        /*
        //New import window
        webix.ui({
            view: "window",
            id: "importwindow",
            width: 400,
            position: "top",
            head: {
                view: "toolbar",
                cols: [{
                        view: "label",
                        label: "Import JSON"
                    },
                    {
                        view: "button",
                        type: "icon",
                        icon: "times-circle-o",
                        width: 32,
                        align: 'right',
                        click: "$$('importwindow').close();"
                    }
                ]
            },
            body: webix.copy(supplier.importJSONForm)
        }).show();
        */
    },
    /*
        importJSONForm: {
            view: "form",
            id: "importJSON",
            elements: [{
                    view: "button",
                    label: "Process JSON",
                    type: "form",
                    click: function() {
                        var file_id = $$("files").files.getFirstId(); //getting the ID
                        var fileobj = $$("files").files.getItem(file_id).file; //getting file object
                        //console.log(fileobj);
                        reader = new FileReader();
                        reader.onloadend = function() {
                            var raw_data = JSON.parse(reader.result);
                            //save data in the database - keep _id as provided
                            var bulk_doc = [];
                            for (var key in raw_data) {
                                bulk_doc = bulk_doc.concat(raw_data[key]);
                            }
                            //console.log(bulk_doc);
                            var doc = {
                                docs: bulk_doc,
                                all_or_nothing: false
                            };
                            webix.ajax().header({
                                "Content-type": "application/json"
                            }).post(SERVER_URL + DBNAME + "/_bulk_docs", JSON.stringify(doc),
                                function(text, data, xhr) {
                                    var result = {
                                        ok: 0,
                                        err: 0
                                    };
                                    data.json().forEach(function(element) {
                                        if (typeof element.ok !== 'undefined') {
                                            result.ok++;
                                        } else {
                                            result.err++;
                                        }
                                    }, this);
                                    webix.message("Import results:<br/>" + result.ok + " OK<br/>" + result.err + " ERRORS!");
                                    console.log(data.json());
                                }
                            );
                        };

                        // Read in the JSON file as a binary string.
                        reader.readAsText(fileobj, "UTF8");
                    }
                },
                {
                    view: "uploader",
                    id: "files",
                    name: "files",
                    value: "Add document",
                    link: "doclist",
                    multiple: false,
                    autosend: false, //!important
                    on: {
                        onBeforeFileAdd: function(item) {
                            var type = item.type.toLowerCase(); //deriving file extension
                            if (type != "json") { //checking the format
                                webix.message("Only JSON files!");
                                return false;
                            }
                        }
                    }
                },
                {
                    view: "list",
                    scroll: false,
                    id: "doclist",
                    type: "uploader"
                }
            ]
        },
    */
    saveseriifacturi: function() {
        var doc = $$("seriifacturiForm").getValues();
        
        $$("seriifacturiForm").setValues(upsert("invoice_cfg",doc), true);
    },

    ui: {
        id: "page-7",
        rows: [{
            view: "form",
            id: "seriifacturiForm",
            elementsConfig: {
                labelWidth: 180,
                labelAlign: "right"
            },
            elements: [

                {
                    view: "fieldset",
                    label: "Serii Facturi",
                    body: {
                        cols: [{
                            view: "text",
                            label: "SERIA:",
                            placeholder: "Seria",
                            name: "SERIA"
                        }, {
                            view: "counter",
                            label: "NUMARUL:",
                            step: 1,
                            min: 0,
                            name: "NUMARUL"
                        }, {
                            view: "button",
                            label: "SAVE",
                            type: "danger",
                            width: 100,
                            align: "center",
                            click: 'configuration.saveseriifacturi'
                        }]
                    }
                },
                {
                    view: "fieldset",
                    label: "Export/Import Date",
                    body: {
                        cols: [{
                            view: "button",
                            type: "iconButton",
                            icon: "fas fa-file-excel",
                            label: "Export Finacial Statement to Excel",
                            click: 'configuration.export'
                        }, {
                            view: "button",
                            type: "iconButton",
                            icon: "fas fa-download",
                            label: "Export Entities to JSON",
                            click: 'configuration.exportJSON'
                        }, {
                            view: "button",
                            type: "iconButton",
                            icon: "fas fa-upload",
                            label: "Import Entities from JSON",
                            click: 'configuration.importJSON'
                        }]
                    }
                }

            ]
        }]
    }
};