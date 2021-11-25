function (doc) {
    "use strict";
    if (doc.status !== "deleted" && doc.status !== "new" && doc.source === "unified" && doc.isoCodes && doc.isoCodes.length > 0)  {
        // ISO Codes are hierarchical, i.e. 22.21.12 implies that the record is also part of the category 22.21.  Some
        // records include parent codes and some do not, so we create a "unique records" map to ensure that we always
        // emit 'parent codes' exactly once.
        var toEmitByIsoCode = {};
        for (var index = 0; index < doc.isoCodes.length; index ++) {
            var isoCodeDef = doc.isoCodes[index];
            if (isoCodeDef.Code) {
                var code = isoCodeDef.Code && isoCodeDef.Code.replace(/\./g, "");
                toEmitByIsoCode[code] = doc;
                if (code.length > 4) {
                    var parentCode = code.slice(0,4);
                    toEmitByIsoCode[parentCode] = doc;
                }
            }
        }

        var isoCodes = Object.keys(toEmitByIsoCode);
        for (var index = 0; index < isoCodes.length; index++) {
            var key = isoCodes[index];
            var doc = toEmitByIsoCode[key];
            emit(key, doc);
        }
    }
}
