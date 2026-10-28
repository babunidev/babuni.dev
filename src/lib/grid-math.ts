/** Viewport and tile dimensions are CSS pixels. */
export interface GridGeometry {
  width: number; height: number; tileSize: number;
  panX: number; panY: number; bufferCells: number; columnBufferCells?: number;
}
export interface GridWindow {
  originX: number; originY: number;
  firstColumn: number; firstRow: number;
  columns: number; rows: number;
}
export function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
/** Initial scale approved in visual exploration; device testing may refine it. */
export function tileSizeForWidth(width: number): number {
  if (width < 600) return Math.max(144, Math.min(172, Math.round(width * 0.4)));
  if (width < 1024) return 200;
  return 240;
}
/** Logical cell (0,0) starts exactly centered, then the field pans freely. */
export function gridWindow(g: GridGeometry): GridWindow {
  const { width, height, tileSize: size, panX, panY, bufferCells } = g;
  const columnBufferCells=g.columnBufferCells??bufferCells;
  if (!(width > 0 && height > 0 && size > 0) ||
      !Number.isFinite(panX) || !Number.isFinite(panY) ||
      !Number.isInteger(bufferCells) || bufferCells < 0 || !Number.isInteger(columnBufferCells) || columnBufferCells < 0) {
    throw new RangeError('Invalid viewport or grid geometry');
  }
  const originX = width / 2 - size / 2 + panX;
  const originY = height / 2 - size / 2 + panY;
  const buffer = bufferCells * size;
  return {
    originX, originY,
    firstColumn: Math.floor((-columnBufferCells*size - originX) / size),
    firstRow: Math.floor((-buffer - originY) / size),
    columns: Math.ceil(width / size) + 2 * columnBufferCells + 2,
    rows: Math.ceil(height / size) + 2 * bufferCells + 2
  };
}
/** Unbounded logical coordinate occupied by each fixed pool slot. */
export function logicalCell(first: number, slot: number, head: number, count: number): number {
  return first + positiveModulo(slot - head, count);
}
/** Temporary deterministic demo data, not stable real-project identifiers. */
export function demoProjectIndex(column: number, row: number, total: number): number {
  if (!Number.isInteger(total) || total < 1) throw new RangeError('No projects');
  const variation = Math.floor(column / 7) * 2 + Math.floor(row / 7) * 3;
  return positiveModulo(column * 5 + row * 3 + variation, total);
}

/** Keep the same logical map point centered when responsive tile size changes. */
export function resizedPan(pan:{x:number;y:number},oldSize:number,newSize:number){
 const ratio=newSize/oldSize;return {x:pan.x*ratio,y:pan.y*ratio};
}
