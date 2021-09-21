"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");
require("./lib/utils");

gpii.ul.api.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.api.eastin.products");

fluid.defaults("gpii.tests.ul.api.eastin.products.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    rawModules: [        {
        name: "Testing EASTIN /products/:productCode endpoint.",
        tests: [
            {
                name: "Retrieve an existing record using a product code.",
                type: "test",
                sequence: [
                    {
                        func: "{productRequest}.send"
                    },
                    {
                        event:    "{productRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.checkResults",
                        args:     ["{productRequest}.nativeResponse", "{arguments}.0", false] // response, body, isError
                    }
                ]
            },

            {
                name: "Omit the a product code.",
                type: "test",
                sequence: [
                    {
                        func: "{missingProductCodeRequest}.send"
                    },
                    {
                        event:    "{missingProductCodeRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.checkResults",
                        args:     ["{missingProductCodeRequest}.nativeResponse", "{arguments}.0", true] // response, body, isError
                    }
                ]
            },
            {
                name: "Attempt to retrieve a record for a bogus UID.",
                type: "test",
                sequence: [
                    {
                        func: "{bogusProductCodeRequest}.send"
                    },
                    {
                        event:    "{bogusProductCodeRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.products.checkResults",
                        args:     ["{bogusProductCodeRequest}.nativeResponse", "{arguments}.0", true] // response, body, isError
                    }
                ]
            }
        ]
    }],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        productRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/products/1421059432806-826608318"
            }
        },
        missingProductCodeRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/products"
            }
        },
        bogusProductCodeRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/products/nope-nope-nope"
            }
        }
    }
});

gpii.tests.ul.api.eastin.products.checkResults = function (response, body, isError) {
    if (isError) {
        jqUnit.assertTrue("The response code should indicate an error.", response.statusCode !== 200);
    }
    else {
        jqUnit.assertEquals("The response code should indicate success.", 200, response.statusCode);

        try {
            var bodyAsJson = JSON.parse(body);

            gpii.test.ul.api.eastin.checkRequiredFields(bodyAsJson);
        }
        catch (error) {
            jqUnit.fail("The response body should have been a JSON-parseable string.");
        }
    }
};


fluid.defaults("gpii.tests.ul.api.eastin.products.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.products.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.products.environment");
