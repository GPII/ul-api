/* eslint-env node */
"use strict";
var fs = require("fs");

var docs = [];

for (var a = 0; a < 500; a++) {
    var createdDate = (new Date()).toISOString();
    docs.push({
        "description": "A 'whetstone' record for use in testing our multi-request strategy for larger record sets.",
        "manufacturer": {
            "name": "Acme, Inc."
        },
        "name": "Whetstone " + a,
        "uid": "whetstone-" + a,
        "sid": "whetstone-" + a,
        "source": "unified",
        "status": "new",
        "created": createdDate,
        "updated": createdDate
    });
}

fs.writeFileSync("whetstone.json", JSON.stringify({ docs: docs }, null, 2), "utf8");
