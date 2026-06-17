import React, { useMemo, useState } from "react";
import { Tooltip } from "antd";
import { IAbilityCellDisplay } from "src/types/ability";
import "./style.scss";

const SIZE = 20;
const HEX_W = SIZE * 2;
const HEX_H = SIZE * Math.sqrt(3);

interface IHexAbilityGridProps {
  cells: IAbilityCellDisplay[];
  moveLvl?: string;
}

const CONDITION_REQUIRED_LEVEL: Record<number, number> = {
  12: 2,
  13: 3,
  14: 4,
  15: 5
};

// SA levels exceed move level 5, so they satisfy every condition.
const parseMoveLevel = (moveLvl?: string): number =>
  !moveLvl ? 1 : moveLvl.startsWith("SA") ? 99 : Number(moveLvl) || 1;

const isCellDisabled = (cell: IAbilityCellDisplay, level: number): boolean =>
  cell.conditionIds.some(id => (CONDITION_REQUIRED_LEVEL[id] ?? 0) > level);

export const HexAbilityGrid = ({ cells, moveLvl }: IHexAbilityGridProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const moveLevel = parseMoveLevel(moveLvl);

  const { positions, containerW, containerH } = useMemo(() => {
    if (cells.length === 0)
      return { positions: [], containerW: 0, containerH: 0, totalEnergy: 0 };

    const raw = cells.map(cell => ({
      cell,
      px: SIZE * 1.5 * cell.x,
      py: SIZE * ((Math.sqrt(3) / 2) * cell.x + Math.sqrt(3) * cell.z)
    }));

    const minPx = Math.min(...raw.map(r => r.px));
    const minPy = Math.min(...raw.map(r => r.py));

    const positions = raw.map(r => ({
      cell: r.cell,
      left: r.px - minPx,
      top: r.py - minPy
    }));

    const maxLeft = Math.max(...positions.map(p => p.left));
    const maxTop = Math.max(...positions.map(p => p.top));
    return {
      positions,
      containerW: maxLeft + HEX_W,
      containerH: maxTop + HEX_H
    };
  }, [cells]);

  const selectedEnergy = useMemo(
    () =>
      cells
        .filter(c => selectedIds.has(c.cellId) && !isCellDisabled(c, moveLevel))
        .reduce((sum, c) => sum + c.energyCost, 0),
    [cells, selectedIds, moveLevel]
  );

  return (
    <div className="hexAbilityGrid">
      <div className="hexAbilityGrid-energy">Energy: {selectedEnergy}</div>
      <div
        style={{ position: "relative", width: containerW, height: containerH }}
      >
        {positions.map(({ cell, left, top }) => {
          const isDisabled = isCellDisabled(cell, moveLevel);
          const isSelected = !isDisabled && selectedIds.has(cell.cellId);
          const cls = [
            "hexCell",
            isDisabled ? "hexCell--disabled" : "",
            cell.cellColor === "red" ? "hexCell--red" : "",
            cell.cellColor === "yellow" ? "hexCell--yellow" : "",
            isSelected ? "hexCell--selected" : "hexCell--unselected"
          ]
            .filter(Boolean)
            .join(" ");

          const style = { left, top };

          const handleClick = isDisabled
            ? undefined
            : () =>
                setSelectedIds(prev => {
                  const next = new Set(prev);
                  next.has(cell.cellId)
                    ? next.delete(cell.cellId)
                    : next.add(cell.cellId);
                  return next;
                });

          const div = (
            <div className={cls} style={style} onClick={handleClick}>
              {cell.energyCost}
            </div>
          );

          return cell.description ? (
            <Tooltip
              key={cell.cellId}
              title={cell.description}
              overlayStyle={{ pointerEvents: "none" }}
            >
              {div}
            </Tooltip>
          ) : (
            <div
              key={cell.cellId}
              className={cls}
              style={style}
              onClick={handleClick}
            >
              {cell.energyCost}
            </div>
          );
        })}
      </div>
      {selectedIds.size > 0 && (
        <div className="hexAbilityGrid-selected-list">
          {cells
            .filter(c => selectedIds.has(c.cellId) && c.description)
            .map(c => (
              <div key={c.cellId} className="hexAbilityGrid-selected-item">
                {c.description}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
