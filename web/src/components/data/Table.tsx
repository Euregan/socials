import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { ReactNode } from "react";
import * as style from "./Table.css";

type Column = {
  label: string;
};

type TableProps<Key extends string> = {
  columns: Record<Key, Column>;
  rows: Array<Record<Key, ReactNode>>;
};

export const Table = <Key extends string>({
  columns,
  rows,
}: TableProps<Key>) => (
  <table
    className={style.table}
    style={assignInlineVars({
      [style.columnCount]: Object.keys(columns).length.toString(),
    })}
  >
    <thead className={style.nil}>
      <tr className={style.nil}>
        {Object.entries<Column>(columns).map(([key, column]) => (
          <td key={key} className={style.header}>
            {column.label}
          </td>
        ))}
      </tr>
    </thead>
    <tbody className={style.nil}>
      {rows.map((row, index) => (
        <tr key={index} className={style.nil}>
          {Object.keys(columns).map((key: keyof typeof row) => (
            <td key={key} className={style.cell}>
              {row[key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
