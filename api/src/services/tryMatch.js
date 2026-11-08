import { matchSize } from './matchSize.js';

const maxChart = {
  measurementType: 'garment',
  sizes: [
    { label: 'XS', chest: { min: 76.2, max: 76.2 } },
    { label: 'S', chest: { min: 81.3, max: 81.3 } },
    { label: 'M', chest: { min: 86.4, max: 86.4 } },
    { label: 'L', chest: { min: 91.4, max: 91.4 } },
    { label: 'XL', chest: { min: 96.5, max: 96.5 } },
  ],
};

const veroChart = {
  measurementType: 'body',
  sizes: [
    { label: 'XS', chest: { min: 83.8, max: 83.8 }, waist: { min: 63.5, max: 63.5 } },
    { label: 'S', chest: { min: 87.6, max: 87.6 }, waist: { min: 67.3, max: 67.3 } },
    { label: 'M', chest: { min: 91.4, max: 91.4 }, waist: { min: 71.1, max: 71.1 } },
    { label: 'L', chest: { min: 99.1, max: 99.1 }, waist: { min: 78.7, max: 78.7 } },
  ],
};

console.log('Max (garment):', matchSize(maxChart, { bust: 84 }, 'regular'));
console.log('Vero Moda (body):', matchSize(veroChart, { bust: 89, waist: 70 }, 'regular'));