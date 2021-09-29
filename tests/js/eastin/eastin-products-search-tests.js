"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.logObjectRenderChars = 10240;

var jqUnit = require("node-jqunit");

require("../../../index");
require("./lib/utils");

gpii.ul.api.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.api.eastin.products.search");

fluid.defaults("gpii.tests.ul.api.eastin.products.search.request", {
    gradeNames: ["gpii.test.ul.api.request"],
    endpoint: "api/eastin/products",
    method: "POST"
});

fluid.defaults("gpii.tests.ul.api.eastin.products.search.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    postPayloads: {
        noParamsRequest: {},
        isoCodesNoResultsRequest: { params: { isoCodes: ["99.99.99"] } },
        isoCodesResultsRequest: { params: { isoCodes: ["22.39.12"]} },
        productNameNoResultsRequest: { params: { CommercialName: "Flubbertygibbit" } },
        productNameResultsRequest: {  params: { CommercialName: "NVDA" }  },
        manufacturerNameNoResultsRequest: { params: { Manufacturer: "Scrooge McDuck" }},
        manufacturerNameResultsRequest: { params: { Manufacturer: "NVAccess" }},
        minDateNoResultsRequest: { params: { InsertDateMin: "2045-01-01T13:22:05.245Z" }},
        minDateResultsRequest: { params: { InsertDateMin: "2000-01-01T13:22:05.245Z" }},
        maxDateNoResultsRequest: { params: { InsertDateMax: "1972-05-09T13:22:05.245Z" }},
        maxDateResultsRequest: { params: { InsertDateMax: "2045-01-01T13:22:05.245Z" }}
    },
    rawModules: [        {
        name: "Testing EASTIN /products/ endpoint.",
        tests: [
            {
                name: "Retrieve all records.",
                type: "test",
                sequence: [
                    {
                        func: "{noParamsRequest}.send",
                        args: ["{that}.options.postPayloads.noParamsRequest"]
                    },
                    {
                        event:    "{noParamsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{noParamsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by ISO code, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{isoCodesNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.isoCodesNoResultsRequest"]
                    },
                    {
                        event:    "{isoCodesNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{isoCodesNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by ISO code, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{isoCodesResultsRequest}.send",
                        args: ["{that}.options.postPayloads.isoCodesResultsRequest"]
                    },
                    {
                        event:    "{isoCodesResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{isoCodesResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by product name, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{productNameNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.productNameNoResultsRequest"]
                    },
                    {
                        event:    "{productNameNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{productNameNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by product name, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{productNameResultsRequest}.send",
                        args: ["{that}.options.postPayloads.productNameResultsRequest"]
                    },
                    {
                        event:    "{productNameResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{productNameResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by manufacturer name, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{manufacturerNameNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.manufacturerNameNoResultsRequest"]
                    },
                    {
                        event:    "{manufacturerNameNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{manufacturerNameNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by manufacturer name, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{manufacturerNameResultsRequest}.send",
                        args: ["{that}.options.postPayloads.manufacturerNameResultsRequest"]
                    },
                    {
                        event:    "{manufacturerNameResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{manufacturerNameResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by minimum creation date, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{minDateNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.minDateNoResultsRequest"]
                    },
                    {
                        event:    "{minDateNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{minDateNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by minimum creation date, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{minDateResultsRequest}.send",
                        args: ["{that}.options.postPayloads.minDateResultsRequest"]
                    },
                    {
                        event:    "{minDateResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{minDateResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by maximum creation date, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{maxDateNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.maxDateNoResultsRequest"]
                    },
                    {
                        event:    "{maxDateNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{maxDateNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by maximum creation date, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{maxDateResultsRequest}.send",
                        args: ["{that}.options.postPayloads.maxDateResultsRequest"]
                    },
                    {
                        event:    "{maxDateResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.search.checkResults",
                        args:     ["{maxDateResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            }
        ]
    }],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        noParamsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        isoCodesNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        isoCodesResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        productNameNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        productNameResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        manufacturerNameNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        manufacturerNameResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        minDateNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        minDateResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        maxDateNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        },
        maxDateResultsRequest: {
            type: "gpii.tests.ul.api.eastin.products.search.request"
        }
    }
});

gpii.tests.ul.api.eastin.products.search.checkResults = function (response, body, hasResults) {
    jqUnit.assertEquals("The response should be successful.", 200, response.statusCode);

    try {
        var bodyAsJson = JSON.parse(body);
        var recordCount = fluid.get(bodyAsJson, ["data", "items", "length"]);

        if (hasResults) {
            jqUnit.assertTrue("There should be results", recordCount && recordCount > 0);
            var firstRecord = fluid.get(bodyAsJson, ["data", "items", "0"]);
            gpii.test.ul.api.eastin.checkRequiredFields(firstRecord);
        }
        else {
            jqUnit.assertEquals("There should not be results.", 0, recordCount);
        }
    }
    catch (error) {
        jqUnit.fail("The response should be a JSON payload.");
    }
};


fluid.defaults("gpii.tests.ul.api.eastin.products.search.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.products.search.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.products.search.environment");
