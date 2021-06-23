"use strict";
var fluid = require("infusion");

// require("./find-small-actors");
// require("./find-small-associateinfos");
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
        // findSmallAssociatedInfos: {
        //     type: "gpii.ul.api.eastin.associatedinfos"
        //
        // },
        products: {
            type: "gpii.ul.api.eastin.products"
        }
    }
});
