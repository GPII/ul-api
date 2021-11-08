"use strict";
var fluid = require("infusion");

require("gpii-express");

fluid.defaults("gpii.ul.api.eastin.findSmallAssociatedInfos.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        // We always return an empty list because we have no associated data.
        handleRequest: {
            func: "{that}.sendResponse",
            args:     [200, {
                apiVersion: "1.0",
                "data": {
                    "items": []
                }
            }]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        }
    }
});

fluid.defaults("gpii.ul.api.eastin.findSmallAssociatedInfos", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "post",
    path: "/",
    handlerGrades: ["gpii.ul.api.eastin.findSmallAssociatedInfos.handler"]
});

// http://<partner_server>/<partner_defined_subpath>/v1.0/associatedinfo/<infoType>/<associatedInfoCode>
fluid.defaults("gpii.ul.api.eastin.getInfo.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        // Return a 404 and a null object for all attempts to get detailed associated info, as we have none.
        handleRequest: {
            func: "{that}.sendResponse",
            args:     [404, "null"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        }
    }
});

fluid.defaults("gpii.ul.api.eastin.getInfo", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "get",
    path: "/:type/:code",
    handlerGrades: ["gpii.ul.api.eastin.getInfo.handler"]
});


fluid.defaults("gpii.ul.api.eastin.associatedInfo", {
    gradeNames: ["gpii.express.router"],
    path: "/associatedinfo",
    components: {
        findSmallAssociatedInfos: {
            type: "gpii.ul.api.eastin.findSmallAssociatedInfos"
        },
        getInfo: {
            type: "gpii.ul.api.eastin.getInfo"
        }
    }
});
