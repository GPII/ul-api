"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-express");

require("./product");
require("./transforms");

// FindSmallProducts(),
// POST /eastin/products
// Implement after getProduct so we can reuse parts of the transform.
//
// Input parameters:
//  string actorType: the type of the actor; (Hard code to "companies"?)
//  string[] isoCodes: an array of strings representing ISO classes (for example [“12.22”, “09.03.03”]);
//  string[] icfCodes: an array of strings representing the EASTIN ICF classes (for example [“b1”, “d2”]) which are a subset of the official ICF classification;
//  string actorName: the whole or a part of the name of the searched actor;
//  dateTime insertDateMin: the lower bound for the insert date of the actors to be searched;
//  dateTime insertDateMax: the upper bound for the insert date of the actors to be searched.
//
// Returns:
// SmallProductDto
//  string ProductCode*: the id of the product in the partner’s local database;
//  string IsoCodePrimary*: the primary ISO Code of the product (for example “09.03.03”);
//  string[] IsoCodesOptional: the array of all secondary ISO classification codes of the product (for example [“12.22”, “09.03.03”]);
//  string CommercialName*: the commercial name of the product;
//  string ManufacturerCode*: the id of the product’s manufacturer in the partner’s local database;
//  string ManufacturerOriginalFullName*: the full name in the original language of the product’s manufacturer;  dateTime InsertDate*: the insert date of the product;
//  dateTime LastUpdateDate*: the last update date of the product;
//  string ThumbnailImageUrl: the URL of the small format picture of the product (used when displaying list of products in EASTIN Portal). The URL must be accessible on the Web by the end user’s browser. Picture dimensions should be: width 90 px, height 90 px.

fluid.registerNamespace("gpii.ul.api.eastin.products.find.handler");

gpii.ul.api.eastin.products.find.handler.handleRequest = function (that) {
    // TODO: If we have to filter by params, pass them to the view reader here.
    that.viewReader.get({});
};

// TODO:  If this proves to be too slow, we may need new views.
// Filter the results based on search parameters.
//
// Here are the supported search params.
//
// {
//   “apiVersion”:“ 1.0”,
//   “params”: {
//     “isoCodes”: [“12.22.03”, “12.22.06”],
//     “features”: [
//       { “featureId”: 122, “valueMin”: 0.0 “valueMax”: 0.0 }, { “featureId”: 2, “valueMin”: 8.0, “valueMax”: 100.5 }
//     ],
//     “commercialName”: “ministar”,
//     “manufacturer”: “offcarr”,
//     “insertDateMin”: “2014-03-31T13:22:05.245Z”,
//     “insertDateMax”: “2016-12-01T17:22:56.941Z”
//   }
// }
//
// We have no feature data, so we ignore it for now.
// TODO: Discuss if we should return nothing if asked for content by feature instead.
//
// For ISO codes, we return the record if the primary or optional ISO codes match any of the values.
//
// For commercial name and manufacturer, we use crude pattern matching without any kind of stemming.
//
// Date matching is not inclusive, i.e. only records create after the minimum and before the max are returned.
gpii.ul.api.eastin.products.find.handler.generateFilterFunction = function (that, params) {
    return function (singleRecord) {
        // Hide unpublished and deleted records from the search results.
        if (that.options.statusesToHide.indexOf(singleRecord.status) !== -1) {
            return false;
        }

        if (params.isoCodes) {
            var hasMatchingIsoCode = fluid.find(params.isoCodes, function (isoCodeString) {
                if (singleRecord.IsoCodePrimary === isoCodeString || (singleRecord.IsoCodesOptional && singleRecord.IsoCodesOptional.indexOf(isoCodeString) !== -1)) {
                    return true;
                }
                else {
                    return undefined;
                }
            });

            if (!hasMatchingIsoCode) {
                return false;
            }
        }

        if (params.commercialName || params.CommercialName) {
            if (!singleRecord.CommercialName) { return false;}
            var nameToMatch = params.commercialName || params.CommercialName;
            var matchesCommercialName = singleRecord.CommercialName.match(nameToMatch);
            if (!matchesCommercialName) { return false;}
        }

        if (params.manufacturer || params.Manufacturer) {
            if (!singleRecord.ManufacturerOriginalFullName) { return false;}
            var manufacturerToMatch = params.manufacturer || params.Manufacturer;
            var matchesManufacturerName = singleRecord.ManufacturerOriginalFullName.match(manufacturerToMatch);
            if (!matchesManufacturerName) { return false;}
        }

        if (params.insertDateMin || params.InsertDateMin) {
            if (!singleRecord.InsertDate) { return false; }
            var insertDateMin = params.insertDateMin || params.InsertDateMin;
            if (new Date(singleRecord.InsertDate) < new Date(insertDateMin)) {
                return false;
            }
        }

        if (params.insertDateMax || params.InsertDateMax) {
            if (!singleRecord.InsertDate) { return false; }
            var insertDateMax = params.insertDateMax || params.InsertDateMax;
            if (new Date(singleRecord.InsertDate) > new Date(insertDateMax)) {
                return false;
            }
        }

        return true;
    };
};

gpii.ul.api.eastin.products.find.handler.handleViewResponse = function (that, response) {
    // Transform the results.
    var items = fluid.transform(response.rows, function (singleCouchDbRecord) {
        return fluid.model.transformWithRules(singleCouchDbRecord.value, that.options.toSmallProductDto);
    });

    // Filter by search parameters if there are any.
    var params = fluid.get(that, "options.request.body.params");
    var filteredItems = params ? items.filter(gpii.ul.api.eastin.products.find.handler.generateFilterFunction(that, params)) : items;

    that.sendResponse(200, {
        apiVersion: 1.0,
        data: {
            items: filteredItems
        }
    });
};

fluid.defaults("gpii.ul.api.eastin.products.find.handler", {
    gradeNames: ["gpii.express.handler"],
    statusesToHide: ["deleted", "new"],
    invokers: {
        // Return a 404 and a null object for all attempts to get detailed associated info, as we have none.
        handleRequest: {
            funcName: "gpii.ul.api.eastin.products.find.handler.handleRequest",
            args: ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        handleViewResponse: {
            funcName: "gpii.ul.api.eastin.products.find.handler.handleViewResponse",
            args: ["{that}", "{arguments}.0"] // response
        }
    },
    components: {
        // Use the same view as GET /products, but only use the unified source, and run it through a transform.
        viewReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["%baseUrl%viewPath", {
                            baseUrl: "{gpii.ul.api}.options.urls.ulDb",
                            viewPath: "/_design/ul/_view/records_by_source?key=\"unified\""
                        }]
                    }
                },
                termMap: {},

                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.products.find.handler}.handleViewResponse",
                        args: ["{arguments}.0"] // couchResponse
                    },
                    // Report back to the user on failure.
                    "onError.sendResponse": {
                        func: "{gpii.express.handler}.sendResponse",
                        args: [500, {message: "{arguments}.0", url: "{that}.options.url"}] // statusCode, body
                    }
                }
            }
        }
    },
    toSmallProductDto: {
        "ProductCode": "sid",
        "IsoCodePrimary": {
            transform: {
                type: "gpii.ul.api.eastin.transforms.primaryIsoCode",
                inputPath: "isoCodes"
            }
        },
        "IsoCodesOptional": {
            transform: {
                type: "gpii.ul.api.eastin.transforms.optionalIsoCodes",
                inputPath: "isoCodes"
            }
        },
        "CommercialName": "name",
        "InsertDate": "created",
        "LastUpdateDate": "updated",
        "ManufacturerCode": "manufacturer.id",
        "ManufacturerOriginalFullName": "manufacturer.name"

        // TODO: Pull this from the image API if required.
        //
        //   string ThumbnailImageUrl: the URL of the small format image of the product (used when displaying list
        //     of products in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser.
        //     Picture dimensions should be: width 90 px, height 90 px.
    }
});


fluid.defaults("gpii.ul.api.eastin.products.find", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "post",
    path: "/",
    handlerGrades: ["gpii.ul.api.eastin.products.find.handler"]
});


fluid.defaults("gpii.ul.api.eastin.products", {
    gradeNames: ["gpii.express.router"],
    path: "/products",
    components: {
        findProducts: {
            type: "gpii.ul.api.eastin.products.find"
        },
        getSingleProduct: {
            type: "gpii.ul.api.eastin.product"
        }
    }
});
