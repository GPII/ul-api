/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");

gpii.ul.api.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.api.eastin.isoClasses");

fluid.defaults("gpii.tests.ul.api.eastin.isoClasses.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    rawModules: [
        {
            name: "Testing EASTIN /isoclasses endpoint.",
            tests: [
                {
                    name: "Retrieve a count of records for an ISO code with matches.",
                    type: "test",
                    sequence: [
                        {
                            func: "{countRequest}.send"
                        },
                        {
                            event:    "{countRequest}.events.onComplete",
                            listener: "gpii.tests.ul.api.eastin.isoClasses.checkProductCountResults",
                            args:     ["{countRequest}.nativeResponse", "{arguments}.0", true, false] // response, body, hasResults, isError
                        }
                    ]
                },
                {
                    name: "Retrieve a count of records for an ISO code with no matches.",
                    type: "test",
                    sequence: [
                        {
                            func: "{countNoResultsRequest}.send"
                        },
                        {
                            event:    "{countNoResultsRequest}.events.onComplete",
                            listener: "gpii.tests.ul.api.eastin.isoClasses.checkProductCountResults",
                            args:     ["{countNoResultsRequest}.nativeResponse", "{arguments}.0", false, false] // response, body, hasResults, isError
                        }
                    ]
                },
                {
                    name: "Confirm that incorrect queries are rejected..",
                    type: "test",
                    sequence: [
                        {
                            func: "{countBadRequest}.send"
                        },
                        {
                            event:    "{countBadRequest}.events.onComplete",
                            listener: "gpii.tests.ul.api.eastin.isoClasses.checkProductCountResults",
                            args:     ["{countBadRequest}.nativeResponse", "{arguments}.0", false, true] // response, body, hasResults, isError
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        countRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/isoclasses/productcount?iso=223003"
            }
        },
        countNoResultsRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/isoclasses/productcount?iso=999999"
            }
        },
        countBadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/isoclasses/productcount"
            }
        }
    }
});

gpii.tests.ul.api.eastin.isoClasses.checkProductCountResults = function (response, body, hasResults, isError) {
    if (isError) {
        jqUnit.assertTrue("The response code should not indicate a successful response.", response.statusCode !== 200);
    }
    else {
        try {
            var bodyAsJson = JSON.parse(body);

            jqUnit.assertEquals("The response code should indicate a successful response.", 200, response.statusCode);

            var recordCount = fluid.get(bodyAsJson, "data.productCount");
            if (hasResults) {
                jqUnit.assertTrue("The record count should be a number greater than zero.", recordCount !== undefined && recordCount > 0);
            }
            else {
                jqUnit.assertEquals("There should be no matching records.", 0, recordCount);
            }
        }
        catch (error) {
            jqUnit.fail("The body should have been a JSON-parseable string.");
        }
    }
};

fluid.defaults("gpii.tests.ul.api.eastin.isoClasses.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.isoClasses.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.isoClasses.environment");
