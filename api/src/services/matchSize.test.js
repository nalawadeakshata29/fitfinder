import { test, expect } from '@jest/globals';
import { matchSize } from './matchSize.js';

const bodyChart = {
  measurementType: 'body',
  sizes: [
    { label: 'S', chest: { min: 80, max: 86 } },
    { label: 'M', chest: { min: 86, max: 92 } },
    { label: 'L', chest: { min: 92, max: 98 } },
  ],
};

const garmentChart = {
  measurementType: 'garment',
  sizes: [
    { label: 'S', chest: { min: 90, max: 90 } },
    { label: 'M', chest: { min: 96, max: 96 } },
    { label: 'L', chest: { min: 102, max: 102 } },
  ],
};

test('exact fit in a body chart gives high confidence', () => {
  const r = matchSize(bodyChart, { bust: 83 }, 'regular');
  expect(r.size).toBe('S');
  expect(r.confidence).toBe('high');
});

test('a body between two sizes gives medium confidence', () => {
  const r = matchSize(bodyChart, { bust: 87 }, 'regular');
  expect(r.size).toBe('M');
  expect(r.confidence).toBe('medium');
  expect(r.note).toBe('Between M and S');
});

test('loose fit moves the result up a size', () => {
  expect(matchSize(bodyChart, { bust: 85 }, 'regular').size).toBe('S');
  expect(matchSize(bodyChart, { bust: 85 }, 'loose').size).toBe('M');
});

test('garment charts add ease and never give high confidence', () => {
  const r = matchSize(garmentChart, { bust: 88 }, 'regular');
  expect(r.size).toBe('M');
  expect(r.confidence).toBe('medium');
  expect(r.note).toBe('Estimated from garment measurements');
});

test('measurements far from the chart give low confidence', () => {
  const r = matchSize(bodyChart, { bust: 150 }, 'regular');
  expect(r.confidence).toBe('low');
});

test('measurements the chart does not have are ignored', () => {
  const r = matchSize(bodyChart, { bust: 83, waist: 70 }, 'regular');
  expect(r.size).toBe('S');
});

test('an empty chart returns null', () => {
  expect(matchSize({ measurementType: 'body', sizes: [] }, { bust: 90 })).toBeNull();
});