"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.ul.api.eastin.transforms");

gpii.ul.api.eastin.transforms.getPrimaryIsoCode = function (isoCodes) {
    return isoCodes[0];
};

gpii.ul.api.eastin.transforms.getOptionalIsoCodes = function (isoCodes) {
    return isoCodes.slice(1);
};

/**
 *
 * @param {Object} combinedRecord - A unified record, with its SAI equivalent stashed under `saiRecord`.
 * @param {Object} rules - Fluid model transformation rules.
 * @return {Any} - The results of the transformation, typically an {Object}.
 */
gpii.ul.api.eastin.transforms.transformUnifiedRecord = function (combinedRecord, rules) {
    var eastinRecord = fluid.model.transformWithRules(combinedRecord, rules);
    return eastinRecord;
};

gpii.ul.api.eastin.transforms.toProductDto = function (unifiedRecord) {
    return gpii.ul.api.eastin.transforms.transformUnifiedRecord(unifiedRecord, gpii.ul.api.eastin.transforms.unifiedToProductDto);
};

gpii.ul.api.eastin.transforms.toSmallProductDto = function (unifiedRecord) {
    return gpii.ul.api.eastin.transforms.transformUnifiedRecord(unifiedRecord, gpii.ul.api.eastin.transforms.unifiedToSmallProductDto);
};

gpii.ul.api.eastin.transforms.unifiedToProductDto = {
    "ProductCode": "uid",
    "IsoCodePrimary": {
        transform: {
            type: "gpii.ul.api.eastin.transforms.getPrimaryIsoCode",
            inputPath: "isoCodes"
        }
    },
    "IsoCodesOptional": {
        transform: {
            type: "gpii.ul.api.eastin.transforms.getOptionalIsoCodes",
            inputPath: "isoCodes"
        }
    },

    // ManufacturerCountry
    "CommercialName": "name",
    "ManufacturerCode": "manufacturer.id",
    "ManufacturerOriginalFullName": "manufacturer.name",
    "ManufacturerAddress": "manufacturer.address",
    "ManufacturerPostalCode": "manufacturer.postalCode",
    "ManufacturerTown": "manufacturer.cityTown",
    "ManufacturerCountry": {
        transform: {
            type: "fluid.transforms.firstValue",
            values: ["manufacturer.country", { literalValue: "Unknown" }]
        }
    },
    "ManufacturerPhone": "manufacturer.phone",
    "ManufacturerEmail": "manufacturer.email",
    "ManufacturerWebSiteUrl": "manufacturer.url",
    "OriginalDescription": "description",
    "EnglishDescription": "description",
    "OriginalUrl": "saiRecord.sourceUrl",
    "EnglishUrl": "saiRecord.sourceUrl",

    "LastUpdateDate": "updated",

    // We don't track this, so reuse the date of the last update.
    "InsertDate": "updated",

    // Things we don't have, we set to empty or false.
    "IsReviewAllowed": { literalValue: false },
    "UserManualUrls": { literalValue: [] },
    "VideoUrls": { literalValue: [] },
    "BrochureUrls": { literalValue: [] },
    "FurtherInfoUrls": { literalValue: [] },
    "Features": { literalValue: [] }

    // TODO: Pull these from the images API?
    //  string ThumbnailImageUrl: the URL of the small format image of the product (used when displaying list of products in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser. Picture dimensions should be: width 90 px, height 90 px.
    //  string ImageUrl: the URL of the big format image of the product (used when displaying the detail view of the product in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser. Picture dimensions should be: width 450 px, height 450 px.
};

gpii.ul.api.eastin.transforms.unifiedToSmallProductDto = {
    "ProductCode": "uid",
    "IsoCodePrimary": {
        transform: {
            type: "gpii.ul.api.eastin.transforms.getPrimaryIsoCode",
            inputPath: "isoCodes"
        }
    },
    "IsoCodesOptional": {
        transform: {
            type: "gpii.ul.api.eastin.transforms.getOptionalIsoCodes",
            inputPath: "isoCodes"
        }
    },
    "CommercialName": "name",
    "ManufacturerCode": "manufacturer.id",
    "ManufacturerOriginalFullName": "manufacturer.name",
    "InsertDate": "updated",
    "LastUpdateDate": "updated"

    // TODO: Pull this from the images API?
    //  string ThumbnailImageUrl: the URL of the small format image of the product (used when displaying list of products in the EASTIN portal). The URL must be accessible on the Web by the end user’s browser. Picture dimensions should be: width 90 px, height 90 px.
};
