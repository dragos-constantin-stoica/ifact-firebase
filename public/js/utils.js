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