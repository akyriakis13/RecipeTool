import Express from 'express';
import bodyParser from 'body-parser';
import restApi from './new_endpoint.js'


let app = Express();
app.use(bodyParser.json());
app.use("/", restApi);
app.use(Express.static("./"));

import session from 'express-session';

let session_details = session({
    secret: "sessionpassword",
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    resave: true,
    rolling: true,
    unset: 'destroy',
    saveUninitialized: true
});
app.use(session_details);



app.listen(9999, () => {
    console.log("Server started (port 9999)");
})


// http://localhost:9999/landing.html