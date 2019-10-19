/**
 * Global Data Structures file
 */

/**
 * Store user session at global level in browser session storage
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
 * Store supplier data
 */

var SUPPLIER_DATA = {
    supplier: {},
    get: function() {
        return this.supplier;
    },

    set: function(data) {
        this.supplier = data;
    },

    getByCurrency: function() {
        var result = [];
        this.supplier.conturi.forEach(function(element) {
            result.push({
                id: this.supplier.id + "-" + element.valuta,
                value: this.supplier.nume + " [" + element.valuta + "]"
            });
        }, this);
        return result;
    }
};

/**
 * Store customers Id and name 
 */
var CUSTOMER = {

    customers: [],

    customerOptions: [],

    getCUSTOMER: function() {
        return this.customerOptions;
    },

    add: function(item) {
        this.customers.push(item);
    },

    get: function() {
        return this.customers;
    },

    find: function(customer_id) {
        return this.customers.find(customer => customer.id === customer_id);
    },

    addCUSTOMER: function(item) {
        this.customerOptions.push(item);
    },

    initCUSTOMER: function() {
        this.customerOptions = [];
        this.customers = [];
    }
};

/**
 * Invoice Serial Number
 */
var INVOICESN = {
    sn: { SERIA: "IFact", NUMARUL: 0 },

    getINVOICESN: function() {
        return this.sn;
    },

    setINVOICESN: function(value) {
        this.sn = value;
    }
};

var INVOICEDATA = {

    localData: {
        COPIES: 1,
        TEMPLATE: 1,
        SERIA: "",
        NUMARUL: "",
        FURNIZOR: {},
        BENEFICIAR: {},
        TVA: 0.00,
        INVOICE_DATE: "",
        DUE_DATE: "",
        CURS_BNR: {
            data: "",
            eur_ron: 0.00
        },
        INVOICE_LINE: [],
        INVOICE_SUM: 0.00,
        INVOICE_TVA_SUM: 0.00,
        INVOICE_TOTAL: 0.00
    },

    initInvoiceData: function() {
        this.localData = {
            COPIES: 1,
            TEMPLATE: 1,
            SERIA: "",
            NUMARUL: "",
            FURNIZOR: {},
            BENEFICIAR: {},
            TVA: 0.00,
            INVOICE_DATE: "",
            DUE_DATE: "",
            CURS_BNR: {
                data: "",
                eur_ron: 0.00
            },
            INVOICE_LINE: [],
            INVOICE_SUM: 0.00,
            INVOICE_TVA_SUM: 0.00,
            INVOICE_TOTAL: 0.00
        };
    },

    setInvoiceData: function(key, values) {
        this.localData[key] = values;
    },

    getInvoiceData: function() {
        return this.localData;
    }
};




/**
 * Define mandatory structure for INVOICE
 * 
    {
        COPIES: 1,
        TEMPLATE: 1,
        SERIA: "",
        NUMARUL: "",
        FURNIZOR: {
            {
                doctype: "SUPPLIER",
                conturi: [ ],
                nume: "",
                NORG: "",
                EUNORG: "",
                CUI: "",
                TVA: "",
                adresa: "",
                banca: "",
                sucursala: "",
                IBAN: "",
                SWIFT: "",
                BIC: "",
                valuta: ""
            }
        },
        BENEFICIAR: {
            {
                doctype: "CUSTOMER",
                nume: "",
                NORG: "",
                CUI: "",
                adresa: "",
                banca: "",
                sucursala: "",
                IBAN: "",
                TVA: ""
            }
        },
        TVA: 0.00,
        INVOICE_DATE: "",
        DUE_DATE: "",
        CURS_BNR: {
            data: "",
            eur_ron: 0.00
        },
        INVOICE_LINE: [],
        INVOICE_SUM: 0.00,
        INVOICE_TVA_SUM: 0.00,
        INVOICE_TOTAL: 0.00
    }
 * 
 */