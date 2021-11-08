// FindSmallActors()
// POST /actors
// Return manufacturers? Need to look at examples.
//  string actorType: the type of the actor;
//  string actorName: the whole or a part of the name of the searched actor;
//  dateTime insertDateMin: the lower bound for the insert date of the actors to be searched;
//  dateTime insertDateMax: the upper bound for the insert date of the actors to be searched. string actorType: the type of the actor;
//  string[] isoCodes: an array of strings representing ISO classes (for example [“12.22”, “09.03.03”]);
//  string[] icfCodes: an array of strings representing the EASTIN ICF classes (for example [“b1”, “d2”])
//    which are a subset of the official ICF classification;
//
// Returns a SmallActorDTO, i. e.
//
//  string ActorCode*: the id of the actor in the EASTIN partner’s local database;
//  string OriginalFullName*: the full name of the actor in the original language;
//  string Country*: the country code of the actor in ISO 3166-1-alpha-2 code (for example “IT”, “US”, etc.);
//  dateTime InsertDate*: the insert date of the actor in the EASTIN partner’s local database;
//  dateTime LastUpdateDate*: the insert date of the actor in the EASTIN partner’s local database.
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.ul.api.eastin.findSmallActors.handler");

gpii.ul.api.eastin.findSmallActors.handler.handleRequest = function (that) {
    // Prescreen for parameters we don't support and preemptively send an empty result.
    //
    //  actorType: We only have 'companies'.
    //  isoCodes: Not currently supported (but technically possible).
    //  icfCodes: Not supported, we have no ICF codes.

    var params = fluid.get(that, "options.request.body.params");
    var isoCodeCount = fluid.get(params, "isoCodes.length");
    var icfCodeCount = fluid.get(params, "icfCodes.length");
    var actorType = fluid.get(params, "actorType");
    if (isoCodeCount || icfCodeCount || (actorType && actorType !== "companies")) {
        that.sendResponse(200, {
            apiVersion: "1.0",
            data: { items: [] }
        });
    }
    else {
        that.viewReader.get();
    }
};

gpii.ul.api.eastin.findSmallActors.handler.handleViewResponse = function (that, response) {
    var transformedActorRecords = fluid.transform(response.rows, function (singleRow) {
        return fluid.model.transformWithRules(singleRow.value, that.options.toSmallActorDto);
    });

    var params = fluid.get(that, "options.request.body.params");

    if (params) {
        var minDate, maxDate;
        //  dateTime insertDateMin: the lower bound for the insert date of the actors to be searched;
        if (params.insertDateMin) {
            try {
                minDate = new Date(params.insertDateMin);
            }
            catch (error) {
                that.sendResponse(400, {
                    apiVersion: "1.0",
                    data: { items: [] },
                    error: "Bad insertDateMin value"
                });
            }
        }

        //  dateTime insertDateMax: the upper bound for the insert date of the actors to be searched. string actorType: the type of the actor;
        if (params.insertDateMax) {
            try {
                maxDate = new Date(params.insertDateMax);
            }
            catch (error) {
                that.sendResponse(400, {
                    apiVersion: "1.0",
                    data: { items: [] },
                    error: "Bad insertDateMax value"
                });
            }
        }

        var filteredRecords = transformedActorRecords.filter(function (singleActorRecord) {
            var recordCreationDate;
            try {
                recordCreationDate = new Date(singleActorRecord.InsertDate);
            }
            catch (error) {
                // Ignore errors in records with bad dates.
            }

            //  string actorName: the whole or a part of the name of the searched actor;
            if (params.actorName && singleActorRecord.OriginalFullName && !singleActorRecord.OriginalFullName.match(params.actorName)) {
                return false;
            }

            if (minDate) {
                if (!recordCreationDate || (recordCreationDate < minDate)) {
                    return false;
                }
            }

            if (maxDate) {
                if (!recordCreationDate || (recordCreationDate > maxDate)) {
                    return false;
                }
            }

            return true;
        });

        that.sendResponse(200, {
            apiVersion: "1.0",
            data: { items: filteredRecords }
        });
    }
    else {
        that.sendResponse(200, {
            apiVersion: "1.0",
            data: { items: transformedActorRecords }
        });
    }
};

fluid.defaults("gpii.ul.api.eastin.findSmallActors.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.ul.api.eastin.findSmallActors.handler.handleRequest",
            args:     ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        handleViewResponse: {
            funcName: "gpii.ul.api.eastin.findSmallActors.handler.handleViewResponse",
            args: ["{that}","{arguments}.0"] // response
        }
    },
    toSmallActorDto: {
        ActorCode: "id",
        OriginalFullName: "name",
        Country: "country",
        InsertDate: "created",
        LastUpdateDate: "updated",
        ShortName: "name",
        EnglishFullName: "name",
        StartDate: "created",
        IcfCodes: { literalValue: [] },
        IsoCodes: { literalValue: [] }
    },
    components: {
        viewReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: {
                    // ex: http://localhost:5984/ul/_design/eastin/_view/manufacturers?group=true
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args:    ["%baseUrl%viewPath", { baseUrl: "{gpii.ul.api}.options.urls.ulDb", viewPath: "/_design/eastin/_view/manufacturers?group=true"}]
                    }
                },
                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.findSmallActors.handler}.handleViewResponse",
                        args: ["{arguments}.0"] // couchResponse
                    },
                    // Report back to the user on failure.
                    "onError.sendResponse": {
                        func: "{gpii.express.handler}.sendResponse",
                        args: [ 500, { message: "{arguments}.0", url: "{that}.options.url" }] // statusCode, body
                    }
                }
            }
        }
    }
});


fluid.defaults("gpii.ul.api.eastin.findSmallActors", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "post",
    path: "/",
    handlerGrades: ["gpii.ul.api.eastin.findSmallActors.handler"]
});
