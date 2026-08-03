// src/perf/markers.ts
// Lightweight TTR / TTI instrumentation using Date.now().
// Usage:
//   markStart('json_parse');
//   // ... do work ...
//   markEnd('json_parse');
//   printReport();

const marks: Record<string, number> = {};
const durations: Record<string, number> = {};

export function markStart(label: string): void {
  marks[label] = Date.now();
}

export function markEnd(label: string): void {
  const start = marks[label];
  if (start === undefined) {
    console.warn(`[PERF] markEnd called for "${label}" without a matching markStart`);
    return;
  }
  durations[label] = Date.now() - start;
}

export function getDuration(label: string): number | undefined {
  return durations[label];
}

export function printReport(): void {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SDUI Perf Report');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  Object.entries(durations).forEach(([label, ms]) => {
    console.log(`  ${label.padEnd(20)} ${ms}ms`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

export function resetMarkers(): void {
  Object.keys(marks).forEach(k => delete marks[k]);
  Object.keys(durations).forEach(k => delete durations[k]);
}
