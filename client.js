import { run } from '@cycle/run';
import xs from 'xstream';
import { div, input, p, makeDOMDriver } from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http'
import app from './app';


function main(sources) { //source come from the driver
    const sinks = app(sources);
    sinks.DOM = sinks.DOM.drop(1); // avoid re-render the html received from the server
    return sinks;
}

const drivers = {
    DOM: makeDOMDriver(".app-container"),
    HTTP: makeHTTPDriver()
};

run(main, drivers);

/*
function clientSideApp(sources) {
    const sinks = app(sources);
    sinks.DOM = sinks.DOM.drop(1);
    return sinks;
}

function preventDefaultDriver(ev$) {
    ev$.addListener({
        next: ev => ev.preventDefault(),
    });
}

run(clientSideApp, {
    DOM: makeDOMDriver('.app-container'),
    context: () => xs.of(window.appContext),
    PreventDefault: preventDefaultDriver,
});*/
