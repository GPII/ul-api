// The /actors endpoint, which encompasses the endpoints to find all "actors" and get detailed records for individual
// actors.  This is broken out into a separate file because the endpoints have fairly verbose docs.
"use strict";
var fluid = require("infusion");

require("./find-small-actors");
require("./get-actor");

fluid.defaults("gpii.ul.api.eastin.actors", {
    gradeNames: ["gpii.express.router"],
    path: "/actors",
    components: {
        findSmallActors: {
            type: "gpii.ul.api.eastin.findSmallActors"
        },
        getActor: {
            type: "gpii.ul.api.eastin.getActor"
        }
    }
});
