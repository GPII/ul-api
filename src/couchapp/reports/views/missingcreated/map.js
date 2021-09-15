function (doc) {
    "use strict";

    if (doc.sid && !doc.created) {
        emit(doc._id, doc);
    }
}
