"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.test.ul.api.eastin");

gpii.test.ul.api.eastin.checkRequiredFields = function (singleRecord, requiredFields) {
    requiredFields = requiredFields || [
        "ProductCode", "CommercialName", "ManufacturerOriginalFullName", "InsertDate", "LastUpdateDate"
    ];
    var missingFields = [];

    fluid.each(requiredFields, function (fieldKey) {
        if (fluid.get(singleRecord, fieldKey) === undefined) {
            missingFields.push(fieldKey);
        }
    });

    if (missingFields.length) {
        jqUnit.fail("The following required fields were missing:\n\t" + missingFields.join("\n\t") + "\n");
    }
    else {
        jqUnit.assert("All required fields are present.");
    }
};
