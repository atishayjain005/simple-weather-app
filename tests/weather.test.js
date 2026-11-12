import test from 'node:test';
import assert from 'node:assert/strict';
import { temperature, cityTime } from '../src/weather.js';

test('converts Kelvin correctly for freezing, boiling and negative temperatures', () => {
  assert.equal(temperature(273.15), 0);
  assert.equal(temperature(273.15, false), 32);
  assert.equal(temperature(373.15, false), 212);
  assert.equal(temperature(233.15, false), -40);
  assert.equal(temperature(undefined), '—');
});
test('formats city offset independently of the viewer timezone and crosses dates', () => {
  const instant = Date.UTC(2024, 0, 1, 23, 30) / 1000;
  assert.equal(cityTime(instant, 19800), '05:00');
  assert.equal(cityTime(instant, -18000), '18:30');
  assert.equal(cityTime(undefined, 0), 'Unavailable');
  assert.equal(cityTime(instant, 19800, {day:'2-digit',month:'2-digit',year:'numeric'}), '02/01/2024');
});
