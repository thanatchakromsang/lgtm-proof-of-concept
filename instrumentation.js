/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  ConsoleSpanExporter,
  BasicTracerProvider,
  SimpleSpanProcessor,
} = require("@opentelemetry/sdk-trace-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require("@opentelemetry/sdk-metrics");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const otelColProtocal = process.env.OTEL_COL_PROTOCOL || "http";
const otelColUrl = process.env.OTEL_COL_URL || "otelcol";
const otelColPort = process.env.OTEL_COL_PORT || 4318;

const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const exporter = new OTLPTraceExporter({
  url: `${otelColProtocal}://${otelColUrl}:${otelColPort}/v1/traces`,
});

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "application",
  }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new ConsoleMetricExporter(),
  // }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
