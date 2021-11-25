/* eslint-env node */
"use strict";
var fs = require("fs");

var docs = [];

for (var a = 0; a < 500; a++) {
    var createdDate = (new Date()).toISOString();
    var numberWithZeroes = a.toString().padStart(3, "0");
    docs.push({
        "description": "A 'whetstone' record for use in testing our multi-request strategy for larger record sets.",
        "manufacturer": {
            "name": "Acme, Inc."
        },
        "name": "Whetstone " + numberWithZeroes,
        "uid": "whetstone-" + numberWithZeroes,
        "sid": "whetstone-" + numberWithZeroes,
        "source": "unified",
        "status": "active",
        "created": createdDate,
        "updated": createdDate
    });
}

fs.writeFileSync("whetstone.json", JSON.stringify({ docs: docs }, null, 2), "utf8");
