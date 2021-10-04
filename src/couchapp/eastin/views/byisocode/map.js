function (doc) {
    "use strict";
    if (doc.status !== "deleted" && doc.status !== "new" && doc.source === "unified" && doc.isoCodes && doc.isoCodes.length > 0)  {
        for (var index = 0; index < doc.isoCodes.length; index ++) {
            var isoCodeDef = doc.isoCodes[index];
            if (isoCodeDef.Code) {
                var code = isoCodeDef.Code && isoCodeDef.Code.split(".").join("");
                emit(code, doc);
            }
        }
    }
}
