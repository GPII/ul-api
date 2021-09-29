"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.logObjectRenderChars = 10240;

var jqUnit = require("node-jqunit");

require("../../../index");
require("./lib/utils");

gpii.ul.api.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.api.eastin.actors.search");

fluid.defaults("gpii.tests.ul.api.eastin.actors.search.request", {
    gradeNames: ["gpii.test.ul.api.request"],
    endpoint: "api/eastin/actors",
    method: "POST"
});

fluid.defaults("gpii.tests.ul.api.eastin.actors.search.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    postPayloads: {
        noParamsRequest: {},

        //  string actorType: the type of the actor;
        badActorTypeRequest: { params: { actorType: "nope-nope-nope" } },

        //  string[] isoCodes: an array of strings representing ISO classes (for example [“12.22”, “09.03.03”]);
        isoCodesNoResultsRequest: { params: { isoCodes: ["99.99.99"] } },

        //  string[] icfCodes: an array of strings representing the EASTIN ICF classes (for example [“b1”, “d2”])
        icfCodesNoResultsRequest: { params: { icfCodes: ["99.99.99"] } },

        //  string actorName: the whole or a part of the name of the searched actor;
        actorNameNoResultsRequest: { params: { actorName: "Weyland-Yutani" } },
        actorNameResultsRequest: {  params: { actorName: "Freedom Scientific" }  },

        //  dateTime insertDateMin: the lower bound for the insert date of the actors to be searched;
        minDateNoResultsRequest: { params: { insertDateMin: "2045-01-01T13:22:05.245Z" }},
        minDateResultsRequest: { params: { insertDateMin: "2000-01-01T13:22:05.245Z" }},

        //  dateTime insertDateMax: the upper bound for the insert date of the actors to be searched. string actorType: the type of the actor;
        maxDateNoResultsRequest: { params: { insertDateMax: "1972-05-09T13:22:05.245Z" }},
        maxDateResultsRequest: { params: { insertDateMax: "2045-01-01T13:22:05.245Z" }}
    },
    rawModules: [        {
        name: "Testing EASTIN /actors/ endpoint.",
        tests: [
            {
                name: "Retrieve all actors.",
                type: "test",
                sequence: [
                    {
                        func: "{noParamsRequest}.send",
                        args: ["{that}.options.postPayloads.noParamsRequest"]
                    },
                    {
                        event:    "{noParamsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{noParamsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Attempt to use an unsupported actor type.",
                type: "test",
                sequence: [
                    {
                        func: "{badActorTypeRequest}.send",
                        args: ["{that}.options.postPayloads.badActorTypeRequest"]
                    },
                    {
                        event:    "{badActorTypeRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{badActorTypeRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by ISO Code, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{isoCodesNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.isoCodesNoResultsRequest"]
                    },
                    {
                        event:    "{isoCodesNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{isoCodesNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by ICF Code, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{icfCodesNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.icfCodesNoResultsRequest"]
                    },
                    {
                        event:    "{icfCodesNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{icfCodesNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by actor name, no results.",
                type: "test",
                sequence: [
                    {
                        func: "{actorNameNoResultsRequest}.send",
                        args: ["{that}.options.postPayloads.actorNameNoResultsRequest"]
                    },
                    {
                        event:    "{actorNameNoResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{actorNameNoResultsRequest}.nativeResponse", "{arguments}.0", false] // response, body, hasResults
                    }
                ]
            },

            {
                name: "Search by actor name, with results.",
                type: "test",
                sequence: [
                    {
                        func: "{actorNameResultsRequest}.send",
                        args: ["{that}.options.postPayloads.actorNameResultsRequest"]
                    },
                    {
                        event:    "{actorNameResultsRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
                        args:     ["{actorNameResultsRequest}.nativeResponse", "{arguments}.0", true] // response, body, hasResults
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
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
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
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
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
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
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
                        listener: "gpii.tests.ul.api.eastin.actors.search.checkResults",
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
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        badActorTypeRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        isoCodesNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        icfCodesNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        actorNameNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },
        actorNameResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        minDateNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },
        minDateResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },

        maxDateNoResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        },
        maxDateResultsRequest: {
            type: "gpii.tests.ul.api.eastin.actors.search.request"
        }
    }
});

gpii.tests.ul.api.eastin.actors.search.checkResults = function (response, body, hasResults) {
    jqUnit.assertEquals("The response should be successful.", 200, response.statusCode);

    try {
        var bodyAsJson = JSON.parse(body);
        var recordCount = fluid.get(bodyAsJson, ["data", "items", "length"]);

        if (hasResults) {
            jqUnit.assertTrue("There should be results", recordCount && recordCount > 0);
            var firstRecord = fluid.get(bodyAsJson, ["data", "items", "0"]);
            gpii.test.ul.api.eastin.checkRequiredFields(firstRecord, ["ActorCode", "OriginalFullName", "Country", "InsertDate", "LastUpdateDate"]);
        }
        else {
            jqUnit.assertEquals("There should not be results.", 0, recordCount);
        }
    }
    catch (error) {
        jqUnit.fail("The response should be a JSON payload.");
    }
};


fluid.defaults("gpii.tests.ul.api.eastin.actors.search.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.ul.api.eastin.actors.search.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.eastin.actors.search.environment");
