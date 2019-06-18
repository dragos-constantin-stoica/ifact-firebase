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
        $$("seriifacturiForm").setValues(upsert("invoice_cfg", doc), true);
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
                    label: "Invoice Serial Number",
                    body: {
                        cols: [{
                            view: "text",
                            label: "SERIES:",
                            placeholder: "Series",
                            name: "SERIA"
                        }, {
                            view: "counter",
                            label: "NUMBER:",
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
                    label: "Company Logo",
                    height: 250,
                    body: {
                        rows: [{
                                view: "uploader",
                                value: 'Upload file',
                                multiple: false,
                                accept: "image/png, image/gif, image/jpeg",
                                name: "files",
                                link: "logo",
                                on: {
                                    onAfterFileAdd: function(item) {
                                        var files = this.files;
                                        var name = "upload/" + SUPPLIER_DATA.get().id;
                                        item.status = 'transfer';
                                        var task = fbstorage.child(name).put(item.file);
                                        task.on("state_changed", function(state) {
                                            if (state.totalBytes) {
                                                var percent = Math.round(100 * state.bytesTransferred / state.totalBytes);
                                                files.updateItem(item.id, {
                                                    percent: percent
                                                });
                                            }
                                        });
                                        task.then(function() {
                                            files.updateItem(item.id, {
                                                status: "server",
                                                progress: 100,
                                                name: name
                                            });
                                            firebase.storage().ref('upload/' + SUPPLIER_DATA.get().id).getDownloadURL().then(function(url) {
                                                $$("photo_logo").parse({ src: url });
                                                $$("photo_logo").refresh();

                                            });

                                        });
                                    }
                                }
                            },
                            {
                                view: "list",
                                id: "logo",
                                type: "uploader",
                                autoheight: true,
                                borderless: true
                            },
                            {
                                id: "photo_logo",
                                template: function(obj) {
                                    if (obj.src)
                                        return "<img src='" + obj.src + "' > ";
                                    return "<img src='data:image/png;base64,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' > ";

                                },
                                borderless: true
                            }
                        ]

                    }
                }, {
                    view: "fieldset",
                    label: "Data Export/Import",
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