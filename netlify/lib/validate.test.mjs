import assert from "node:assert/strict";
import test from "node:test";

import { parseWeatherQuery } from "./validate.mjs";

function parse(query) {
  return parseWeatherQuery(new URLSearchParams(query));
}

test("accepts a valid city query", () => {
  assert.deepEqual(parse("type=weather&q=Lahore"), {
    ok: true,
    endpoint: "weather",
    params: { q: "Lahore" },
  });
});

test("accepts accented and spaced city names", () => {
  assert.deepEqual(parse("type=forecast&q=S%C3%A3o+Paulo"), {
    ok: true,
    endpoint: "forecast",
    params: { q: "São Paulo" },
  });
  assert.deepEqual(parse("type=weather&q=Rawalpindi").params, { q: "Rawalpindi" });
});

test("rejects empty and whitespace-only cities", () => {
  assert.equal(parse("type=weather&q=").ok, false);
  assert.equal(parse("type=weather&q=++++").ok, false);
});

test("rejects cities longer than 80 characters", () => {
  assert.equal(parse(`type=weather&q=${"a".repeat(81)}`).ok, false);
});

test("rejects markup and query-injection-like city names", () => {
  assert.equal(parse("type=weather&q=%3Cscript%3Ealert(1)%3C%2Fscript%3E").ok, false);
  assert.equal(parse("type=weather&q=Lahore%26appid%3Dx").ok, false);
});

test("rejects city and coordinates together", () => {
  assert.equal(parse("type=weather&q=Lahore&lat=31.5&lon=74.3").ok, false);
});

test("rejects latitude and longitude outside their ranges", () => {
  assert.equal(parse("type=weather&lat=91&lon=74").ok, false);
  assert.equal(parse("type=weather&lat=31&lon=-181").ok, false);
});

test("rejects non-numeric and non-finite coordinates", () => {
  assert.equal(parse("type=weather&lat=abc&lon=74").ok, false);
  assert.equal(parse("type=weather&lat=1e999&lon=74").ok, false);
  assert.equal(parse("type=weather&lat=&lon=74").ok, false);
});

test("requires a supported type", () => {
  assert.equal(parse("q=Lahore").ok, false);
  assert.equal(parse("type=..%2Fadmin&q=Lahore").ok, false);
});

test("rounds valid coordinates to two decimals", () => {
  assert.deepEqual(parse("type=weather&lat=31.523&lon=74.358"), {
    ok: true,
    endpoint: "weather",
    params: { lat: 31.52, lon: 74.36 },
  });
});

test("rejects unknown and repeated query parameters", () => {
  assert.equal(parse("type=weather&q=Lahore&appid=x").ok, false);
  assert.equal(parse("type=weather&type=forecast&q=Lahore").ok, false);
});
