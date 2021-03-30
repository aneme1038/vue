/*
The data stored in the "data.js" file and by the RESTful web service needs to be protected 
so that ordinary users  can't modify the products or change the status of orders.

The npm json-server package doesn't include any built-in authentication features, so I created this file.
*/

const jwt = require("jsonwebtoken");
//CAUTION - Don't use the following in real projects, use .env instead.
const APP_SECRET = "myappsecret";
const USERNAME = "admin";
const PASSWORD = "secret";

/*
This code inspects HTTP requests sent to the RESTful web service and implements some basic security features.
This is server-side code that is not directly related to development in this application.
*/
module.exports = function ( req, res, next) {
    if ((req.url == "/api/login" || req.url == "/login") && req.method == "POST") {
        if (req.body != null && req.body.name == USERNAME && req.body.password == PASSWORD) {
            let token = jwt.sign({ data: USERNAME, expiresIn: "1h" }, APP_SECRET);
            res.json({ success: true, token: token });
        } else {
            res.json({ success: false });
        }
        res.end();
        return;
    } else if ((((req.url.startsWith("/api/products") || req.url.startsWith("/products"))
    || (req.url.startsWith("/api/categories") || req.url.startsWith("/categories")))
    && req.method != "GET")
    || ((req.url.startsWith("/api/orders") || req.url.startsWith("/orders"))
    && req.method != "POST")) {
        let token = req.headers["authorization"];
        if (token != null && token.startsWith("Bearer<")) {
            token = token.substring(7, token.length - 1);
            try {
                jwt.verify(token, APP_SECRET);
                next();
                return;
            } catch (err) { }
        }
        res.statusCode = 401;
        res.end();
        return;
    }
    next();
}