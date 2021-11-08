"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");
require("./lib/utils");

gpii.ul.api.loadTestingSupport();

fluid.defaults("gpii.tests.ul.api.eastin.actors.actor.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    rawModules: [        {
        name: "Testing EASTIN /actors/:actorType/:actorCode endpoint.",
        tests: [
            {
                name: "Retrieve an existing actor using an actor code.",
                type: "test",
                sequence: [
                    {
                        func: "{actorRequest}.send"
                    },
                    {
                        event:    "{actorRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.actor.checkResults",
                        args:     ["{actorRequest}.nativeResponse", "{arguments}.0", false] // response, body, isError
                    }
                ]
            },

            {
                name: "Use the wrong actor type.",
                type: "test",
                sequence: [
                    {
                        func: "{wrongTypeRequest}.send"
                    },
                    {
                        event:    "{wrongTypeRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.actor.checkResults",
                        args:     ["{wrongTypeRequest}.nativeResponse", "{arguments}.0", true] // response, body, isError
                    }
                ]
            },
            {
                name: "Attempt to retrieve a record for a bogus actorCode.",
                type: "test",
                sequence: [
                    {
                        func: "{bogusActorCodeRequest}.send"
                    },
                    {
                        event:    "{bogusActorCodeRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.actor.checkResults",
                        args:     ["{bogusActorCodeRequest}.nativeResponse", "{arguments}.0", true] // response, body, isError
                    }
                ]
            }
        ]
    }],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        actorRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/actors/companies/1234"
            }
        },
        wrongTypeRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/actors/bad-type/1234"
            }
        },
        bogusActorCodeRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/eastin/v1.0/actors/companies/nope-nope-nope"
            }
        }
    }
});

gpii.tests.ul.api.eastin.actors.actor.checkResults = function (response, body, isError) {
    if (isError) {
        jqUnit.assertTrue("The response code should indicate an error.", response.statusCode !== 200);
    }
    else {
        jqUnit.assertEquals("The response code should indicate success.", 200, response.statusCode);

        try {
            var bodyAsJson = JSON.parse(body);
            gpii.test.ul.api.eastin.checkRequiredFields(bodyAsJson, ["data.ActorCode", "data.OriginalFullName", "data.Country", "data.InsertDate", "data.LastUpdateDate"]);
        }
        catch (error) {
            jqUnit.fail("The response body should have been a JSON-parseable string.");
        }
    }
};


fluid.defaults("gpii.tests.ul.api.eastin.actors.actor.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.actors.actor.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.actors.actor.environment");
