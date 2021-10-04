function (doc) {
    "use strict";
    if (doc.status !== "deleted" && doc.status !== "new" && doc.source === "unified" && doc.manufacturer && doc.manufacturer.id) {
        emit(doc.manufacturer.id, doc.manufacturer);
    }
}
