export function Mark({ size = 28 }: { size?: number }) {
  const cells = [];
  const bayer = [0, 32, 8, 40, 2, 34, 10, 42];
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const on = (bayer[(x * 2 + y) % 8] + x * 5 + y * 3) % 16 < 9;
    if (on) cells.push(<rect key={`${x}${y}`} x={x * 7 + 2} y={y * 7 + 2} width="5" height="5" fill="currentColor" />);
  }
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">{cells}</svg>;
}
