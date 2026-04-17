 import * as Sentry from "@sentry/node"
 import {nodeProfilingIntegration } from "@sentry/profiling-node";

 Sentry.init({
    dsn: "https://7684e5a0eb9b67d146635eec1c55299f@o4508408152653824.ingest.us.Sentry.io/4508400155406336",
    integrations: [
        nodeProfilingIntegration(),
        Sentry.mongooseIntegration()

    ],

    //tracesSampleRate: 1.0,
    
 });

 Sentry.profiler.startProfiler();
Sentry.startSpan({
    name: "My First Transaction"
},() =>{
});
 Sentry.profiler.stopProfiler();