"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.ul.api.htmlMessageHandler");
gpii.ul.api.htmlMessageHandler.renderAndSend = function (that, statusCode, context) {
    that.response.status(statusCode).render(that.options.templateKey, context);
    that.events.afterResponseSent.fire(that);
};

// A `gpii.express.handler` mix-in grade that uses the `gpii-handlebars` renderer to deliver HTML content.
// NOTE:  This cannot be used by itself, as the required `handleRequest` invoker is not implemented.  It must be mixed
// with an instance of `gpii.express.handler`.
//
fluid.defaults("gpii.ul.api.htmlMessageHandler", {
    templateKey: "pages/message.handlebars",
    invokers: {
        sendResponse: {
            funcName: "gpii.ul.api.htmlMessageHandler.renderAndSend",
            args:     [ "{that}", "{arguments}.0", "{arguments}.1"] // statusCode, body
        }
    }
});

// A grade that delivers the contents of `options.messageBody` to the user.  The default template expects this to be
// JSON that contains a `message` element.
//
fluid.defaults("gpii.ul.api.htmlMessageHandler.staticBody", {
    gradeNames: ["gpii.ul.api.htmlMessageHandler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            // TODO:  Review this, it seems really inappropriate
            args: [ 404, "{that}.options.messageBody"] // statusCode, body
        }
    }
});

// A grade that delivers `gpii-json-schema` validation errors as HTML.
//
fluid.defaults("gpii.ul.api.htmlMessageHandler.validationErrors", {
    gradeNames: ["gpii.ul.api.htmlMessageHandler"],
    templateKey: "pages/validation-error.handlebars",
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 400, "{that}.options.validationErrors"] // statusCode, body
        }
    }
});
