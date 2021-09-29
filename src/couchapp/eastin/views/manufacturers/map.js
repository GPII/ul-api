function (doc) {
    "use strict";
    if (doc.source === "unified" && doc.manufacturer && doc.manufacturer.id) {
        emit(doc.manufacturer.id, doc.manufacturer);
    }
}
