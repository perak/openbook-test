import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";


import "select2/dist/css/select2.css";
import "select2/dist/js/select2.js";

//
// Theme & Icons
//
// For some nasty reason, fonts are reachable only when css files are in public dir 
// even if font urls inside css files are correct absolute paths
//
import "/public/theme/bootstrap-icons.css";
import "/public/theme/icons.css";
import "/public/theme/app.css";
import "/public/theme/app.js";


import "./router_init.js";
import "./helpers.js";


Meteor.startup(function() {

});
