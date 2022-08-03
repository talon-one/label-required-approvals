export function intersection(arrays: any[]) {
  return (arrays || []).reduce((a, b) =>
    a.filter((c: unknown) => b.includes(c))
  );
}
