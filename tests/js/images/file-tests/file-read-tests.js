/*

    Tests for the following API endpoints:

    * `GET /api/images/file/:uid/:source/:image_id`
    * `GET /api/images/file/:uid/:source/:width/:image_id`
    * `HEAD /api/images/file/:uid/:source/:image_id`
    * `HEAD /api/images/file/:uid/:source/:width/:image_id`

*/
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../../index");

gpii.ul.api.loadTestingSupport();

require("node-jqunit");

fluid.defaults("gpii.tests.ul.api.images.file.read.caseHolder", {
    gradeNames: ["gpii.test.ul.api.caseHolder"],
    rawModules: [{
        name: "UL Image API 'read' tests for /api/images/file...",
        tests: [
            {
                name: "Load an original file...",
                type: "test",
                sequence: [
                    { func: "{originalImageRequest}.send"},
                    {
                        event:    "{originalImageRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkImageData",
                        args:     ["{originalImageRequest}.nativeResponse", "{arguments}.0"] // response, body
                    },
                    {
                        func: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{originalImageRequest}.nativeResponse"] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Load a resized image...",
                type: "test",
                sequence: [
                    { func: "{resizedImageRequest}.send"},
                    {
                        event:    "{resizedImageRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkImageData",
                        args:     ["{resizedImageRequest}.nativeResponse", "{arguments}.0"] // response, body
                    },
                    {
                        func: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{resizedImageRequest}.nativeResponse"] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Load HEAD data for an original image...",
                type: "test",
                sequence: [
                    { func: "{originalImageHeadRequest}.send"},
                    {
                        event:    "{originalImageHeadRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{originalImageHeadRequest}.nativeResponse"] // response, expectedStatusCode
                    },
                    { func: "{originalImageHeadRetryRequest}.send"},
                    {
                        event:    "{originalImageHeadRetryRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{originalImageHeadRetryRequest}.nativeResponse"] // response, expectedStatusCode
                    },
                    {
                        func: "gpii.tests.ul.api.images.file.read.caseHolder.checkCacheResults",
                        args: ["{originalImageHeadRequest}.nativeResponse", "{originalImageHeadRetryRequest}.nativeResponse"] // firstResponse, secondResponse
                    }
                ]
            },
            {
                name: "Load HEAD data for a resized image...",
                type: "test",
                sequence: [
                    { func: "{resizedImageHeadRequest}.send"},
                    {
                        event:    "{resizedImageHeadRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{resizedImageHeadRequest}.nativeResponse"] // response, expectedStatusCode
                    },
                    { func: "{resizedImageHeadRetryRequest}.send"},
                    {
                        event:    "{resizedImageHeadRetryRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{resizedImageHeadRetryRequest}.nativeResponse"] // response, expectedStatusCode
                    },
                    {
                        func: "gpii.tests.ul.api.images.file.read.caseHolder.checkCacheResults",
                        args: ["{resizedImageHeadRequest}.nativeResponse", "{resizedImageHeadRetryRequest}.nativeResponse"] // firstResponse, secondResponse
                    }
                ]
            },
            {
                name: "Attempt to load a missing file...",
                type: "test",
                sequence: [
                    { func: "{missingFileRequest}.send"},
                    {
                        event:    "{missingFileRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{missingFileRequest}.nativeResponse", 404] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Attempt to load HEAD data for a missing file...",
                type: "test",
                sequence: [
                    { func: "{missingFileHeadRequest}.send"},
                    {
                        event:    "{missingFileHeadRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{missingFileHeadRequest}.nativeResponse", 404] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Attempt to load a bad source...",
                type: "test",
                sequence: [
                    { func: "{badSourceRequest}.send"},
                    {
                        event:    "{badSourceRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{badSourceRequest}.nativeResponse", 401] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Attempt to load HEAD data for a bad source...",
                type: "test",
                sequence: [
                    { func: "{badSourceHeadRequest}.send"},
                    {
                        event:    "{badSourceHeadRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{badSourceHeadRequest}.nativeResponse", 401] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Attempt to retrieve a missing UID...",
                type: "test",
                sequence: [
                    { func: "{badUidRequest}.send"},
                    {
                        event:    "{badUidRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{badUidRequest}.nativeResponse", 404] // response, expectedStatusCode
                    }
                ]
            },
            {
                name: "Attempt to retrieve HEAD data for a missing UID...",
                type: "test",
                sequence: [
                    { func: "{badUidHeadRequest}.send"},
                    {
                        event:    "{badUidHeadRequest}.events.onComplete",
                        listener: "gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode",
                        args:     ["{badUidHeadRequest}.nativeResponse", 404] // response, expectedStatusCode
                    }
                ]
            }
        ]
    }],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        originalImageRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/a.svg"
            }
        },
        resizedImageRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/75/a.svg"
            }
        },
        originalImageHeadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/a.svg"
            }
        },
        originalImageHeadRetryRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/a.svg"
            }
        },
        resizedImageHeadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/75/a.svg"
            }
        },
        resizedImageHeadRetryRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/75/a.svg"
            }
        },
        missingFileRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/not-found.svg"
            }
        },
        missingFileHeadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/unified/not-found.svg"
            }
        },
        badSourceRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/bad-source/a.svg"
            }
        },
        badSourceHeadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/1421059432806-826608318/bad-source/a.svg"
            }
        },
        badUidRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/bogus-uid/unified/a.svg"
            }
        },
        badUidHeadRequest: {
            type: "gpii.test.ul.api.request",
            options: {
                endpoint: "api/images/file/bogus-uid/unified/a.svg"
            }
        }
    }
});

gpii.tests.ul.api.images.file.read.caseHolder.checkStatusCode = function (response, expectedStatusCode) {
    expectedStatusCode = expectedStatusCode || 200;
    jqUnit.assertEquals("The status code should be as expected.", expectedStatusCode, response.statusCode);
};

gpii.tests.ul.api.images.file.read.caseHolder.checkImageData = function (response, body) {
    jqUnit.assertEquals("The content type should be as expected.", "image/svg+xml", response.headers["content-type"]);
    try {
        var contentLength = parseInt(response.headers["content-length"]);
        jqUnit.assertTrue("The content length should be greater than zero.", contentLength > 0);
    }
    catch (e) {
        jqUnit.fail(e);
    }

    jqUnit.assertTrue("There should be image data.", body.length > 0);
};

gpii.tests.ul.api.images.file.read.caseHolder.checkCacheResults = function (firstResponse, secondResponse) {
    fluid.each(["etag","content-type", "content-length", "last-modified"], function (fieldToCompare) {
        jqUnit.assertEquals("The '" + fieldToCompare + "' should be consistent between HEAD requests for the same content.", firstResponse.headers[fieldToCompare], secondResponse.headers[fieldToCompare]);
    });
};

fluid.defaults("gpii.tests.ul.api.images.file.read.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment"],
    ports: {
        api:    9776
    },
    components: {
        caseHolder: {
            type: "gpii.tests.ul.api.images.file.read.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.ul.api.images.file.read.environment");
