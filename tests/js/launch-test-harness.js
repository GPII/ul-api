// Launch the test harness as a standalone server to assist in manual QA.
//
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("./lib/test-harness");

gpii.ul.api.tests.harness({
    ports: {
        "api":   6914,
        "pouch": 6915
    }
});