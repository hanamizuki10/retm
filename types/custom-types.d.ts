
declare namespace CustomTypes {
  export interface Rows {
    rows: Cells[];
    count: number;
  }
  export interface Cells {
    cells: Cell[];
    count: number;
  }
  export interface Cell {
    date: Date;
    isCurrent: boolean;
  }
}