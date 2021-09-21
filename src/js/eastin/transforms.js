"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.ul.api.eastin.transforms");

gpii.ul.api.eastin.transforms.primaryIsoCode = function (isoCodeDefs) {
    return fluid.get(isoCodeDefs, [0, "Code"]);
};

gpii.ul.api.eastin.transforms.optionalIsoCodes = function (isoCodeDefs) {
    if (Array.isArray(isoCodeDefs)) {
        var optionalIsoCodeDefs = isoCodeDefs.slice(1);
        var isoCodes = fluid.transform(optionalIsoCodeDefs, function (isoCodeDef) {
            return isoCodeDef.Code;
        });
        return isoCodes;
    }
    return [];
};
