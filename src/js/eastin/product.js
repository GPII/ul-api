"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-express");
require("./transforms");


// ProductDto GetProduct(string productCode)
//
// Input parameters:
//   string productCode: the id of the product in the EASTIN partner’s system.
//
// Returns:
//   ProductDto: an object containing detailed information about a single product. If no product is found than returns
//  the null object.
//
// This method returns an object belonging to the class ProductDto (for a complete description of the ProductDto object
// see below). The method searches into EASTIN partner’s local databases for the product which has the id matching with
// the method parameter productCode. If no product is found the method returns the null object.
//
// ProductDto:
//   string ProductCode*: the id of the product in the partner’s local database;
//   string IsoCodePrimary*: the primary ISO Code of the product (for example “09.03.03”);
//   string[] IsoCodesOptional: the array of all secondary ISO classification codes of the product (for
//     example [“12.22”, “09.03.03”]);
//   string CommercialName*: the commercial name of the product;
//   string ManufacturerCode*: the id of the product’s manufacturer in the partner’s local database;
//   string ManufacturerOriginalFullName*: the full name in the original language of the product’s
//     manufacturer;
//   dateTime InsertDate*: the insert date of the product;
//   dateTime LastUpdateDate*: the last update date of the product;
//   string ThumbnailImageUrl: the URL of the small format image of the product (used when displaying list
//     of products in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser.
//     Picture dimensions should be: width 90 px, height 90 px.
//   bool IsReviewAllowed*: if true the end user is authorized to review this product;
//   string ManufacturerAddress: the address of the product’s manufacturer;
//   string ManufacturerPostalCode: the postal code of the product’s manufacturer;
//   string ManufacturerTown: the town of the product’s manufacturer;
//   string ManufacturerCountry*: the country code of the product’s manufacturer in ISO 3166-1-alpha-2 code (for
//     example “IT”, “US”, etc.);
//   string ManufacturerPhone: the phone of the product’s manufacturer;
//   string ManufacturerFax: the fax of the product’s manufacturer;
//   string ManufacturerEmail: the email of the product’s manufacturer;
//   string ManufacturerSkype: the Skype account name of the product’s manufacturer;
//   string ManufacturerWebSiteUrl: the Web site URL of the product’s manufacturer;
//   string[] ManufacturerSocialNetworkUrls: an array of URLs linking to the product’s manufacturer page
//     inside the main social networks (for example Facebook, Twitter, LinkedIn, etc.);
//   string ImageUrl: the URL of the big format image of the product (used when displaying the detail view of the
//     product in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser. Picture
//     dimensions should be: width 450 px, height 450 px.
//   string OriginalDescription: the description of the product in the original language;
//   string EnglishDescription: the description of the product in English;
//   string OriginalUrl: the URL of the Web page in the original language on the original EASTIN partner’s
//     Web site in which the product is presented. The URL must be accessible on the Web by the end user’s browser;
//   string EnglishUrl: the URL of the Web page in English on the original EASTIN partner’s Web site in which
//     the product is presented. The URL must be accessible on the Web by the end user’s browser;
//   string OriginalDownloadUrl: the URL of the download Web page in the original language on the original EASTIN
//     partner’s Web site in which the product is presented. The URL must be accessible on the Web by the end user’s
//     browser;
//   string EnglishDownloadUrl: the URL of the download Web page in English on the original EASTIN partner’s Web site
//     in which the product is presented. The URL must be accessible on the Web by the end user’s browser;
//   string[] UserManualUrls: an array containing the URLs of product’s user manuals;
//   string[] VideoUrls: an array containing the URLs of product’s demo videos;
//   string[] BrochureUrls: an array containing the URLs of product’s brochures;
//   string[] FurtherInfoUrls: an array containing the URLs of other information available on the Web related to the
//     product;
//   FeatureDto[] Features: an array of FeatureDto objects containing all the EASTIN Taxonomy features (with measure
//     values if needed) for this product.

fluid.registerNamespace("gpii.ul.api.eastin.product.transforms");

fluid.defaults("gpii.ul.api.eastin.product.handler", {
    gradeNames: ["gpii.express.handler"],
    templates: {
        imageUrl: "https://ul.api.gpii.net/api/images/file/%uid/unified/450/%image_id",
        thumbnailImageUrl: "https://ul.api.gpii.net/api/images/file/%uid/unified/90/%image_id"
    },
    members: {
        unifiedRecordPromise: "@expand:fluid.promise()",
        imageRecordPromise: "@expand:fluid.promise()",
        unifiedRecord: false,
        imageMetadata: {}
    },
    toProductDto: {
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
        "OriginalDescription": {
            transform: {
                type: "gpii.ul.api.eastin.transforms.htmlToText",
                inputPath: "description"
            }
        },
        "EnglishDescription": {
            transform: {
                type: "gpii.ul.api.eastin.transforms.htmlToText",
                inputPath: "description"
            }
        },
        "OriginalUrl": "sourceUrl",
        "EnglishUrl": "sourceUrl",


        // TODO: Make two async GETs and process only when both are complete.
        // Hit https://api.ul.gpii.net/api/images/metadata/:uid/unified , which returns :image_id

        // Couldn't find any examples of these being used, so I'm omitting them.
        //
        //   string OriginalDownloadUrl: the URL of the download Web page in the original language on the original EASTIN
        //     partner’s Web site in which the product is presented. The URL must be accessible on the Web by the end user’s
        //     browser;
        //   string EnglishDownloadUrl: the URL of the download Web page in English on the original EASTIN partner’s Web site
        //     in which the product is presented. The URL must be accessible on the Web by the end user’s browser;

        // This is supposed to be required, but I don't see it in any EASTIN records, so...?
        //   boolean IsReviewAllowed

        // Seems like partners omit these, so we will as well.  If desired, uncomment these lines to send empty arrays.
        // "UserManualUrls": { literalValue: [] },
        // "VideoUrls": { literalValue: [] },
        // "BrochureUrls": { literalValue: [] },
        // "FurtherInfoUrls": { literalValue: [] },
        // "FeatureDto": { literalValue: [] },

        "InsertDate": "created",
        "LastUpdateDate": "updated",

        "ManufacturerCode": "manufacturer.id",
        "ManufacturerOriginalFullName": "manufacturer.name",
        "ManufacturerAddress": "manufacturer.address",
        "ManufacturerPostalCode": "manufacturer.postalCode",
        "ManufacturerTown": "manufacturer.cityTown",
        // TODO: They request country codes, we have free text.  Hopefully it's fine, as it can also be omitted.
        // TODO: We do not currently require a country code, this may take a bit of effort to provide for all records.
        // However, it seems that some partners omit it safely, so we can hopefully leave it for now.
        "ManufacturerCountry": "manufacturer.country",
        "ManufacturerPhone": "manufacturer.phone",
        "ManufacturerEmail": "manufacturer.email",
        "ManufacturerWebSiteUrl": "manufacturer.url",

        //   string ManufacturerFax: the fax of the product’s manufacturer;
        //   string ManufacturerSkype: the Skype account name of the product’s manufacturer;
        //   string[] ManufacturerSocialNetworkUrls: an array of URLs linking to the product’s manufacturer page
        //     inside the main social networks (for example Facebook, Twitter, LinkedIn, etc.);
        "ThumbnailImageUrl": "ThumbnailImageUrl",

        //   string ThumbnailImageUrl: the URL of the small format image of the product (used when displaying list
        //     of products in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser.
        //     Picture dimensions should be: width 90 px, height 90 px.
        "ImageUrl": "ImageUrl"

        //   string ImageUrl: the URL of the big format image of the product (used when displaying the detail view of
        //     the product in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser.
        //     Picture dimensions should be: width 450 px, height 450 px.
    },
    invokers: {
        handleRequest: {
            funcName: "gpii.ul.api.eastin.product.handler.handleRequest",
            args:     ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        handleRecordViewResponse: {
            funcName: "gpii.ul.api.eastin.product.handler.handleRecordViewResponse",
            args: ["{that}","{arguments}.0"] // response
        },
        handleImageApiResponse: {
            funcName: "gpii.ul.api.eastin.product.handler.handleImageApiResponse",
            args: ["{that}","{arguments}.0"] // response
        }
    },
    components: {
        recordViewReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["%baseUrl/_design/ul/_view/products?key=%key", { baseUrl: "{gpii.ul.api}.options.urls.ulDb" }]
                    }
                },
                termMap: { "key": "%key" },
                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.product.handler}.handleRecordViewResponse",
                        args: ["{arguments}.0"] // couchResponse
                    },
                    // Report back to the user on failure.
                    "onError.sendResponse": {
                        func: "{gpii.express.handler}.sendResponse",
                        args: [ 500, { message: "{arguments}.0", url: "{that}.options.url" }] // statusCode, body
                    }
                }
            }
        },
        imageRecordReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        // http://localhost:3367/api/images/metadata/1421059432806-826608318/unified
                        args: ["%baseUrlapi/images/metadata/%uid/unified", { baseUrl: "{gpii.ul.api}.options.urls.api" }]
                    }
                },
                termMap: {"uid": "%uid"},
                listeners: {
                    "onRead.handleViewResponse": {
                        func: "{gpii.ul.api.eastin.product.handler}.handleImageApiResponse",
                        args: ["{arguments}.0"] // apiResponse
                    },
                    // Allow processing to continue if the image retrieval fails.
                    "onError.resolvePromise": {
                        func: "{gpii.ul.api.eastin.product.handler}.imageRecordPromise.resolve",
                        args: ["{arguments}.0"]
                    }
                }
            }
        }
    }
});

gpii.ul.api.eastin.product.handler.handleRequest = function (that) {
    var productCode = that.options.request.params.productCode;
    if (productCode && productCode.length) {
        var params = ["unified", productCode];

        that.recordViewReader.get({ key: JSON.stringify(params)});
        that.imageRecordReader.get({ uid: productCode});

        var sequence = fluid.promise.sequence([that.imageRecordPromise, that.unifiedRecordPromise]);
        sequence.then(
            function () { gpii.ul.api.eastin.product.handler.combineAndSendResults(that); },
            function () { that.options.next({ isError: true, statusCode: 500, message: "Error retrieving record."}); }
        );
    }
    else {
        that.options.next({ isError: true, statusCode: 400, message: "You must supply a product code as part of the URL to use this endpoint."});
    }
};

gpii.ul.api.eastin.product.handler.handleRecordViewResponse = function (that, response) {
    var unifiedListingRecord = fluid.get(response, "rows.0.value");
    if (unifiedListingRecord) {
        var transformedRecord = fluid.model.transformWithRules(unifiedListingRecord, that.options.toProductDto);
        that.unifiedRecord = transformedRecord;
    }
    that.unifiedRecordPromise.resolve();
};

gpii.ul.api.eastin.product.handler.handleImageApiResponse = function (that, response) {
    if (response.length) {
        var firstImage = response[0];
        var imageUrl = fluid.stringTemplate(that.options.templates.imageUrl, { "uid": that.options.request.params.productCode, "image_id": firstImage.image_id });
        var thumbnailImageUrl = fluid.stringTemplate(that.options.templates.imageUrl, { "uid": that.options.request.params.productCode, "image_id": firstImage.image_id });
        that.imageMetadata = {
            "ImageUrl": imageUrl,
            "ThumbnailImageUrl": thumbnailImageUrl
        };
    }
    that.imageRecordPromise.resolve();
};

gpii.ul.api.eastin.product.handler.combineAndSendResults = function (that) {
    if (that.unifiedRecord) {
        var combinedRecord = fluid.extend({}, that.unifiedRecord, that.imageMetadata);
        that.sendResponse(200, {
            apiVersion: "1.0",
            data: combinedRecord
        });
    }
    else {
        that.sendResponse(404, "null");
    }
};

fluid.defaults("gpii.ul.api.eastin.product", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    method: "get",
    path: "/:productCode",
    handlerGrades: ["gpii.ul.api.eastin.product.handler"]
});
