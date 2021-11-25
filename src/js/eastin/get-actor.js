// ActorDto GetActor(string actorType, string actorCode)
//
// Input parameters:
//   string actorType: the type of the actor;
//   string actorCode: the id identifying a single actor inside the EASTIN partner’s local system.
//
// Returns:
//   ActorDto: an object containing detailed information about a single actor (for a complete description of
//  theActorDto object see below). If no actor is found than returns the null object.

// GET http://<partner_server>/<partner_defined_subpath>/v1.0/actors/<actorType>/<actorCode>

// ActorDto (* fields required):
//  string ActorCode*: the id of the actor in the EASTIN partner’s local database;
//  string OriginalFullName*: the full name of the actor in the original language;
//  string Country*: the country code of the actor in ISO 3166-1-alpha-2 code (for example “IT”, “US”, etc.);
//  dateTime InsertDate*: the insert date of the actor in the EASTIN partner’s local database;
//  dateTime LastUpdateDate*: the insert date of the actor in the EASTIN partner’s local database;
//  string ShortName*: the short name of the actor;
//  string EnglishFullName*: the full name of the actor in English;
//  string OriginalDescription: the description of the Actor in the original language;
//  string EnglishDescription: the description of the Actor in English;
//  dateTime StartDate*: the start date of the actor
//  dateTime EndDate: the end date of the actor
//  string ContactBody: the reference organization of the actor;
//  string Address: the address of the actor;
//  string PostalCode: the postal code of the actor;
//  string Town: the town of the actor;
//  string Phone: the phone of the actor;
//  string Fax: the fax of the actor;
//  string Email: the email of the actor;
//  string Skype: the Skype account name of the actor;
//  string WebSiteUrl: the Web site URL of the actor. The URL should be accessible on the Web by the end
// user’s browser;
//  string ContactPersonFullName: the complete name of the contact person for the actor;
//  string OriginalUrl: the URL of the Web page in the original language on the original EASTIN partner’s
// Web site in which the actor is presented. The URL must be accessible on the Web by the end user’s
// browser;
//  string EnglishUrl: the URL of the Web page in English on the original EASTIN partner’s Web site in which
// the actor is presented. The URL must be accessible on the Web by the end user’s browser
//  string[] SocialNetworkUrls: an array of URLs linking to the actor page inside the main social networks
// (for example Facebook, Twitter, LinkedIn, etc.);
//  string[] IcfCodes*: the array of all EASTIN ICF classification codes of the actor (for example [“b1”,
// “d2”]);
//  string[] IsoCodes*: the array of all ISO classification codes of the actor (for example [“12.22”,
// “09.03.03”]);
//
// NOTE:  In our case we have so little data that our SmallActorDTO and ActorDTO records are identical except for the
// actor type field.
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.ul.api.eastin.getActor.handler");

gpii.ul.api.eastin.getActor.handler.handleRequest = function (that) {
    var actorType = fluid.get(that, "options.request.params.actorType");
    var actorCode = fluid.get(that, "options.request.params.actorCode");
    if (actorCode) {
        if (actorType === "companies") {
            that.viewReader.get({ key: actorCode });
        }
        else {
            that.sendResponse(404, {
                apiVersion: "1.0",
                data: null
            });
        }
    }
    else {
        that.options.next({ isError: true, statusCode: 400, message: "You must supply an 'actorType' and 'actorCode' URL parameter to use this endpoint."});
    }
};

gpii.ul.api.eastin.getActor.handler.handleViewResponse = function (that, response) {
    var manufacturerCouchRecord = fluid.get(response, "rows.0.value");
    if (manufacturerCouchRecord) {
        var transformedManufactureRecord = fluid.model.transformWithRules(manufacturerCouchRecord, that.options.toActorDto);
        that.sendResponse(200, {
            apiVersion: "1.0",
            data: transformedManufactureRecord
        });
    }
    else {
        that.sendResponse(404, {
            apiVersion: "1.0",
            data: null
        });
    }
};

fluid.defaults("gpii.ul.api.eastin.getActor.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.ul.api.eastin.getActor.handler.handleRequest",
            args:     ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        handleViewResponse: {
            funcName: "gpii.ul.api.eastin.getActor.handler.handleViewResponse",
            args: ["{that}","{arguments}.0"] // response
        }
    },
    toActorDto: {
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
                    // ex: http://localhost:5984/ul/_design/eastin/_view/manufacturers?group=true&key="2090"
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args:    ["%baseUrl%viewPath", { baseUrl: "{gpii.ul.api}.options.urls.ulDb", viewPath: "/_design/eastin/_view/manufacturers?group=true&key=%key"}]
                    }
                },
                termMap: { key: "%key" },
                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.getActor.handler}.handleViewResponse",
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


fluid.defaults("gpii.ul.api.eastin.getActor", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "get",
    path: "/:actorType/:actorCode",
    handlerGrades: ["gpii.ul.api.eastin.getActor.handler"]
});
