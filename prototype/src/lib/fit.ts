import type { WindPoint } from '../data/windTurbine';

export type ModelFn = (x: number) => number;

export function quadratic(a: number, b: number, c: number): ModelFn {
  return (x: number) => a * x * x + b * x + c;
}

export function rSquared(data: WindPoint[], model: ModelFn): number {
  const n = data.length;
  if (n === 0) return 0;
  const meanY = data.reduce((s, d) => s + d.power, 0) / n;
  let ssRes = 0;
  let ssTot = 0;
  for (const d of data) {
    const pred = model(d.windSpeed);
    ssRes += (d.power - pred) ** 2;
    ssTot += (d.power - meanY) ** 2;
  }
  if (ssTot === 0) return 0;
  return Math.max(0, 1 - ssRes / ssTot);
}

export function modelLinePoints(model: ModelFn, xMin: number, xMax: number, steps = 100) {
  const out: { windSpeed: number; modelPower: number }[] = [];
  const step = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + step * i;
    out.push({ windSpeed: x, modelPower: Math.max(0, model(x)) });
  }
  return out;
}
