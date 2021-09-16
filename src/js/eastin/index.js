"use strict";
var fluid = require("infusion");

// require("./find-small-actors");
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
        //
        // // Live methods
        // findSmallActors: {
        //     type: "gpii.ul.api.eastin.actors"
        // },
        associatedInfo: {
            type: "gpii.ul.api.eastin.associatedInfo"

        },
        products: {
            type: "gpii.ul.api.eastin.products"
        }
    }
});
