"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-express");

require("./transforms");

// GetProduct()
// GET /eastin/product/<ID>
// Supports parameters:
//
// string productCode: the id of the product in the EASTIN partner’s system.
//
// Returns:
//
// ProductDto

// GET products/<sid>

// TODO: Figure out the best way to retrieve the Unified record (for the ISO Codes) and the
// SAI record (for the public-facing URLs)

fluid.defaults("gpii.ul.api.eastin.products.handler", {
    gradeNames: ["gpii.express.handler"],
    couchKeysToExclude: ["_id", "_rev", "_conflicts"],
    invokers: {
        handleRequest: {
            funcName: "gpii.ul.api.eastin.products.handler.handleRequest",
            args:     ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        handleViewResponse: {
            funcName: "gpii.ul.api.eastin.products.handler.handleViewResponse",
            args: ["{that}","{arguments}.0"] // response
        }
    },
    components: {
        viewReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args:     ["%baseUrl/_design/ul/_view/records_by_uid?key=\"%key\"", { baseUrl: "{gpii.ul.api}.options.urls.ulDb" }]
                    }
                },
                termMap: {
                    "key":      "%key"
                },

                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.products.handler}.handleViewResponse",
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

gpii.ul.api.eastin.products.handler.handleRequest = function (that) {
    if (that.options.request.params.productCode) {
        that.viewReader.get({ key: that.options.request.params.productCode });
    }
    else {
        that.options.next({ isError: true, statusCode: 400, message: "You must supply a 'productCode' at the end of the URL."});
    }
};

gpii.ul.api.eastin.products.handler.handleViewResponse = function (that, response) {
    var unifiedRecord = fluid.find(response.rows, function (singleRecord) {
        return singleRecord.value.source === "unified" ? fluid.censorKeys(singleRecord.value, that.options.couchKeysToExclude, true) : undefined;
    });


    if (unifiedRecord) {
        var saiRecord = fluid.find(response.rows, function (singleRecord) {
            return singleRecord.value.source === "sai" ? fluid.censorKeys(singleRecord.value, that.options.couchKeysToExclude, true) : undefined;
        });

        unifiedRecord.saiRecord = saiRecord;

        var transformedRecord = gpii.ul.api.eastin.transforms.toProductDto(unifiedRecord);
        that.sendResponse(200, JSON.stringify(transformedRecord, null, 4));
    }
    else {
        // "If no product is found the method returns the null object."
        that.sendResponse(404, null);
    }
};

fluid.defaults("gpii.ul.api.eastin.products", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "get",
    path: "/products/:productCode",
    handlerGrades: ["gpii.ul.api.eastin.products.handler"]
});
