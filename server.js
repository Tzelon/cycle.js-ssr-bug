import 'source-map-support/register'
import { run } from '@cycle/run';
import xs from 'xstream';
import express from 'express';
import serialize from 'serialize-javascript';
import { html, head, title, body, div, script } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makeHTMLDriver } from '@cycle/html';
import app from './app';

function wrapVTreeWithHTMLBoilerplate([vtree, context]) {
    console.log("WRAP VTREE WITH HTML");
    return (
        html([
            head([
                title('Cycle Isomorphism Example')
            ]),
            body([
                div('.app-container', [vtree]),
                script(`window.appContext = ${serialize(context)};`),
                script({ attrs: { src: 'bundle.js' } })
            ])
        ])
    );
}

function prependHTML5Doctype(html) {
    return `<!doctype html>${html}`;
}

function wrapAppResultWithBoilerplate(appFn, context$) {
    return function wrappedAppFn(sources) {
        const { DOM: vdom$, HTTP: http$ } = appFn(sources);
        const wrappedVDOM$ = xs.combine(vdom$, context$)
            .map(wrapVTreeWithHTMLBoilerplate);

        return {
            DOM: wrappedVDOM$,
            // HTTP: http$
        };
    };
}

const server = express();
server.use(express.static('public'));

server.use(function (req, res) {
    // Ignore favicon requests
    if (req.url === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }
    console.log(`req: ${req.method} ${req.url}`);

    const context$ = xs.of({ route: req.url });
    const wrappedAppFn = wrapAppResultWithBoilerplate(app, context$);

    run(wrappedAppFn, {
        DOM: makeHTMLDriver(html => {
            console.log("SENDING HTML");
            return res.send(prependHTML5Doctype(html));
        }),
        HTTP: makeHTTPDriver()
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Listening on port ${port}`);