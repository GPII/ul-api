/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");

gpii.ul.api.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.api.eastin.associatedInfo");

gpii.tests.ul.api.eastin.associatedInfo.checkListResponse = function (response, body) {
    jqUnit.assertEquals("The response status code should be as expected", 200, response.statusCode);
    var bodyAsJson = JSON.parse(body);
    jqUnit.assertDeepEq(
        "The response body should be as expected",
        {
            apiVersion: "1.0",
            "data": {
                "items": []
            }
        },
        bodyAsJson
    );
};

gpii.tests.ul.api.eastin.associatedInfo.checkDetailedResponse = function (response, body) {
    jqUnit.assertEquals("The response status code should be as expected", 404, response.statusCode);
    var bodyAsJson = JSON.parse(body);
    jqUnit.assertDeepEq("The response body should be as expected", null, bodyAsJson);
};


fluid.defaults("gpii.tests.ul.api.eastin.associatedInfo.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    rawModules: [
        {
            name: "Testing EASTIN /associated endpoint.",
            tests: [
                {
                    name: "Attempt to get the list of associated info.",
                    type: "test",
                    sequence: [
                        {
                            func: "{listRequest}.send"
                        },
                        {
                            event: "{listRequest}.events.onComplete",
                            listener: "gpii.tests.ul.api.eastin.associatedInfo.checkListResponse",
                            args: ["{listRequest}.nativeResponse", "{arguments}.0"] // response, body
                        }
                    ]
                },
                {
                    name: "Attempt to get the details for a piece of associated info.",
                    type: "test",
                    sequence: [
                        {
                            func: "{detailRequest}.send"
                        },
                        {
                            event: "{detailRequest}.events.onComplete",
                            listener: "gpii.tests.ul.api.eastin.associatedInfo.checkDetailedResponse",
                            args: ["{detailRequest}.nativeResponse", "{arguments}.0"] // response, body
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        listRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                method: "POST",
                endpoint: "api/eastin/v1.0/associatedinfo/"
            }
        },
        detailRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/associatedinfo/type/code"
            }
        }
    }
});


fluid.defaults("gpii.tests.ul.api.eastin.associatedInfo.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.associatedInfo.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.associatedInfo.environment");
