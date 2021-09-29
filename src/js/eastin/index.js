"use strict";
var fluid = require("infusion");

// require("./find-small-actors");
require("./actors");
require("./associated-info");
require("./isoclasses");
require("./products");

fluid.defaults("gpii.ul.api.eastin", {
    gradeNames: ["gpii.express.router"],
    path: "/eastin",
    components: {
        // Batch methods
        isoclasses: {
            type: "gpii.ul.api.eastin.isoclasses"
        },

        // Live methods
        associatedInfo: {
            type: "gpii.ul.api.eastin.associatedInfo"

        },
        actors: {
            type: "gpii.ul.api.eastin.actors"
        },
        products: {
            type: "gpii.ul.api.eastin.products"
        }
    }
});
