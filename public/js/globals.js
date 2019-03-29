/**
 *
 * Store user session at global level in browser session storage
 *
 */
var USERNAME = {
    getUSERNAME: function() {
        return webix.storage.session.get("USERNAME");
    },

    setUSERNAME: function(username) {
        webix.storage.session.put("USERNAME", username);
    },

    delUSERNAME: function() {
        webix.storage.session.remove("USERNAME");
    }
};

/**
 * 
 * Store supplires Id and name
 * 
 */
var CUSTOMER = {

    customerOptions: [],
    getCUSTOMER: function() {
        return this.customerOptions;
    },

    addCUSTOMER: function(item) {
        this.customerOptions.push(item);
    },

    initCUSTOMER: function() {
        this.customerOptions = [];
    }
}

/**
 *
 * Sugar coating of message functions
 *
 */
function msg(message) {
    if (!webix.isUndefined(message.type)) {
        if (message.type == "error" || message.type == "debug") {
            console.log(message.text);
        }
    } else {
        var tmp = {
            text: message,
            type: "info"
        };
        message = tmp;
    }
    webix.message(message);
}

/**
 *
 * Upsert fierstore
 * @param doc - document to be inserted or updated
 * @param fscollection - the collection to which the document belongs
 * @returns new or updated document
 *
 */
function upsert(fscollection, doc) {
    //Check if the document is new
    if (webix.isUndefined(doc.uid) || webix.isUndefined(doc.id)) {
        var newdoc = webix.firestore.collection(fscollection).doc();
        doc.id = newdoc.id;
        doc.uid = USERNAME.getUSERNAME().uid;
        newdoc.set(doc);
        msg({
            text: "Document successfully created!",
            type: "success"
        });
    } else {
        // Update document in collection
        webix.firestore
            .collection(fscollection)
            .doc(doc.id)
            .set(doc)
            .then(function() {
                msg({
                    text: "Document successfully updated!",
                    type: "success"
                });
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                msg({
                    text: "Error updating document. See console for details.",
                    type: "error"
                });
                console.error("Error updating document: ", error);
            });
    }
    return doc;
}

/**
 *
 * Create new view that extends List and webix.ActiveContent
 *
 */
webix.protoUI({
    name: "activeList"
}, webix.ui.list, webix.ActiveContent);

/**
 *
 * Date formatting function
 *
 */
var myDateFormat = webix.Date.dateToStr("%d.%m.%Y");

/**
 *
 * Preprocess function has as main objective the coniguration
 * and preparation of data and layout components before rendering.
 *
 * This is called before view show and data loading.
 *
 */
function preprocess(id) {
    switch (id) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "7":
            //rebiuld the view
            //webix.ui(myApp.views[parseInt(id,10)-1], $$("mainPage"), $$("page-"+id));
            loadData(id);
            $$("page-" + id).show();
            break;
        case "6":
            //find the number of series and setup legend
            //chart data for y2m

            /*
                  var promise_pg6_y2m = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/y2m/charts/y2d");

                  promise_pg6_y2m.then(function(realdata) {
                      //setup series for Y2M graph
                      var series_labels = [],
                          raw_data = realdata.json();

                      //element is an object containing the series label as attribute
                      for (var key in raw_data[0]) {
                          if ((key.indexOf("ron_") != -1 || key.indexOf("eur_") != -1) && series_labels.indexOf(key.substr(4, 4)) == -1) {
                              series_labels.push(key.substr(4, 4));
                          }
                      }

                      series_labels.sort();
                      var line_colors = ["#342b75", "#63a05a", "#6eace9", "#843b0e", "#aabc59", "#e4c495", "#f06497"];
                      //generateRandomColors(series_labels.length);

                      dashboard.series_y2m_ron = [];
                      dashboard.series_y2m_eur = [];
                      dashboard.legend_y2m_ron = {
                          values: [],
                          align: "right",
                          valign: "middle",
                          layout: "y",
                          width: 100,
                          margin: 8
                      };
                      dashboard.legend_y2m_eur = {
                          values: [],
                          align: "right",
                          valign: "middle",
                          layout: "y",
                          width: 100,
                          margin: 8
                      };

                      series_labels.forEach(function(elm, index) {

                          dashboard.series_y2m_ron.push({
                              value: "#ron_" + elm + "#",
                              line: { color: line_colors[index % line_colors.length], width: 3 },
                              tooltip: { template: "#ron_" + elm + "#" }
                          });
                          dashboard.series_y2m_eur.push({
                              value: "#eur_" + elm + "#",
                              line: { color: line_colors[index % line_colors.length], width: 3 },
                              tooltip: { template: "#eur_" + elm + "#" }
                          });
                          dashboard.legend_y2m_ron.values.push({ text: elm, color: line_colors[index % line_colors.length] });
                          dashboard.legend_y2m_eur.values.push({ text: elm, color: line_colors[index % line_colors.length] });
                      });

                      //rebiuld the view
                      //webix.ui(myApp.views[parseInt(id,10)-1](), $$("mainPage"), $$("page-"+id));
                      $$('mainPage').removeView('page-' + id);
                      $$('mainPage').addView(dashboard.ui(), -1);
                      loadData(id);
                      $$('page-' + id).show();

                  }).fail(function(err) {
                      //error
                      webix.message({ type: "error", text: err });
                      console.log(err);
                  });
                  */
            break;

        default:
            //rebiuld the view
            //webix.ui(webix.copy(myApp.views[parseInt(id,10)-1]()), $$("mainPage"), $$("page-"+id));

            loadData(id);
            $$("page-" + id).show();
            break;
    }
}

/**
 *
 * Main controller function
 * loads programmatically the views and intializes with data
 * from LOAD_URL
 *
 */
function loadData(id) {
    switch (id) {
        case "1":
            //supplier form
            webix.firestore
                .collection("supplier")
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        $$("supplierForm").setValues(doc.data());
                        $$("conturi").clearAll();
                        $$("conturi").parse($$("supplierForm").getValues().conturi);
                        $$("conturi").refresh();
                    });
                });

            break;
        case "2":
            //Customers
            $$("customersList").clearAll();
            webix.firestore
                .collection("customer")
                .get()
                .then(querySnapshot => {
                    CUSTOMER.initCUSTOMER();
                    querySnapshot.forEach(doc => {
                        $$("customersList").add(doc.data(), 0);
                        CUSTOMER.addCUSTOMER({
                            id: doc.data().id,
                            value: doc.data().nume
                        });
                    });
                    $$("customersList").refresh();
                });

            break;
        case "3":
            //Contracts form
            webix.firestore
                .collection("customer")
                .get()
                .then(querySnapshot => {
                    CUSTOMER.initCUSTOMER();
                    querySnapshot.forEach(doc => {
                        CUSTOMER.addCUSTOMER({
                            id: doc.data().id,
                            value: doc.data().nume
                        });
                    });
                });
            $$("contractList").clearAll();
            webix.firestore
                .collection("contract")
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        $$("contractList").add(doc.data(), 0);
                    });
                    $$("contractList").refresh();
                });

            break;
        case "4":
            //Invoice form
            /*
                  var promise_pg4 = webix.ajax(SERVER_URL + DBNAME + LOAD_URL[id]);
                  promise_pg4.then(function(realdata) {
                      //success
                      $$("invoiceForm").setValues({ "serial_number": realdata.json().SERIA + " " + realdata.json().NUMARUL }, true);
                      invoice.localData.SERIA = realdata.json().SERIA;
                      invoice.localData.NUMARUL = realdata.json().NUMARUL;
                      $$('invoiceForm').elements.supplier.setValue($$('invoiceForm').elements.supplier.getList().getFirstId());
                      $$('invoiceForm').elements.invoice_date.setValue(new Date());
                      $$('invoiceForm').elements.due_date.setValue(new Date((new Date()).setDate((new Date()).getDate() + 30)));
                      $$('invoiceForm').elements.TVA.setValue(0);
                  }).fail(function(err) {
                      //error
                      webix.message({ type: "error", text: err });
                      console.log(err);
                  });
                  */
            break;
        case "5":
            //Payments
            /*
                  var promise_pg5 = webix.ajax(SERVER_URL + DBNAME + LOAD_URL[id]);
                  promise_pg5.then(function(realdata) {
                      //clear all lists
                      $$('invoiceList').clearAll();
                      $$('dueList').clearAll();
                      $$('payedList').clearAll();
                      $$('invoiceList').parse(realdata.json().filter(function(obj) {
                          return (obj.doctype == "INVOICE") && (obj.PAYMENT_TOTAL < obj.INVOICE_TOTAL) &&
                              (new Date(obj.DUE_DATE.substr(6) + "-" + obj.DUE_DATE.substr(3, 2) + "-" + obj.DUE_DATE.substr(0, 2)) >= new Date());
                      }));
                      $$('dueList').parse(realdata.json().filter(function(obj) {
                          return (obj.doctype == "INVOICE") && (obj.PAYMENT_TOTAL < obj.INVOICE_TOTAL) &&
                              (new Date(obj.DUE_DATE.substr(6) + "-" + obj.DUE_DATE.substr(3, 2) + "-" + obj.DUE_DATE.substr(0, 2)) < new Date());
                      }));
                      //Group multiple payments per invoice
                      var payed_raw = realdata.json().filter(function(obj) { return obj.doctype == "PAYMENT"; });
                      payed_proc = payed_raw.reduce(function(prevValue, crtValue) {
                          if (prevValue.length == 0) {
                              crtValue.PAYMENT_SUM = crtValue.PAYMENT_SUM.toFixed(2);
                              prevValue.push(crtValue);
                          } else {
                              var FOUND = false;
                              for (var index = 0; index < prevValue.length; index++) {
                                  var element = prevValue[index];
                                  if (element.id == crtValue.id) {
                                      element.PAYMENT_SUM = element.PAYMENT_SUM + " | " + crtValue.PAYMENT_SUM.toFixed(2);
                                      element.PAYMENT_DATE = element.PAYMENT_DATE + " | " + crtValue.PAYMENT_DATE;
                                      FOUND = true;
                                      break;
                                  }
                              }
                              if (!FOUND) {
                                  crtValue.PAYMENT_SUM = crtValue.PAYMENT_SUM.toFixed(2);
                                  prevValue.push(crtValue);
                              }
                          }
                          return prevValue;
                      }, []);
                      $$('payedList').parse(payed_proc);
                  }).fail(function(err) {
                      webix.message({ type: "error", text: err });
                      console.log(err);
                  });
                  */
            break;
        case "6":
            /*
                  //chart data for y2m
                  var promise_pg6_y2m = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/y2m/charts/y2d");
                  //data for financialSummary
                  var promise_pg6_fsy2d = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/financialstatement/charts/y2d" +
                      "?startkey=[\"" + new Date().getFullYear() + "\",\"01\"]&endkey=[\"" + new Date().getFullYear() + "\",{}]");
                  var promise_pg6_fstotal = webix.ajax(SERVER_URL + DBNAME + "/_design/globallists/_list/financialstatement/charts/y2d");
                  webix.promise.all([promise_pg6_y2m, promise_pg6_fsy2d, promise_pg6_fstotal]).then(function(realdata) {
                      //setup series for Y2M graph
                      $$("y2m_ron").parse(realdata[0].json());
                      $$("y2m_eur").parse(realdata[0].json());
                      //setup finalcial statement
                      var raw_data = realdata[1].json();
                      $$("financialStatementY2D").setValues({
                          invoicedRONY2D: raw_data.invoicedRON,
                          dueRONY2D: raw_data.dueRON,
                          payedRONY2D: raw_data.payedRON,
                          invoicedEURY2D: raw_data.invoicedEUR,
                          dueEURY2D: raw_data.dueEUR,
                          payedEURY2D: raw_data.payedEUR
                      });
                      $$("financialStatement").setValues(realdata[2].json());
                  }).fail(function(err) {
                      //error
                      webix.message({ type: "error", text: err });
                      console.log(err);
                  });
                  */
            break;
        case "7":
            webix.firestore
                .collection("invoice_cfg")
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        $$("seriifacturiForm").setValues(doc.data(), true);
                    });
                });
            break;
        default:
            break;
    }
}