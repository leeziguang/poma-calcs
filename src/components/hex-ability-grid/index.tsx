import React, { useCallback, useEffect, useMemo } from "react";
import { observable, ObservableMap } from "mobx";
import { observer } from "mobx-react";
import { Tooltip } from "antd";
import { IAbilityCellDisplay } from "src/types/ability";
import "./style.scss";

const SIZE = 20;
const HEX_W = SIZE * 2;
const HEX_H = SIZE * Math.sqrt(3);

interface IHexAbilityGridProps {
  cells: IAbilityCellDisplay[];
  moveLvl?: string;
  selectedIds?: number[];
  onSelectionChange: (selectedIds: Set<number>) => void;
}

interface IHexCellProps {
  cell: IAbilityCellDisplay;
  left: number;
  top: number;
  isDisabled: boolean;
  selectedMap: ObservableMap<number, true>;
  onToggle: (cellId: number) => void;
}

const CONDITION_REQUIRED_LEVEL: Record<number, number> = {
  12: 2,
  13: 3,
  14: 4,
  15: 5
};

const parseMoveLevel = (moveLvl?: string): number =>
  !moveLvl ? 1 : moveLvl.startsWith("SA") ? 99 : Number(moveLvl) || 1;

const isCellDisabled = (cell: IAbilityCellDisplay, level: number): boolean =>
  cell.conditionIds.some(id => (CONDITION_REQUIRED_LEVEL[id] ?? 0) > level);

// ObservableMap.has(key) tracks per-key — only THIS cell re-renders on its own toggle
const HexCell = observer(
  ({ cell, left, top, isDisabled, selectedMap, onToggle }: IHexCellProps) => {
    const isSelected = !isDisabled && selectedMap.has(cell.cellId);
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
    const handleClick = isDisabled ? undefined : () => onToggle(cell.cellId);

    const div = (
      <div className={cls} style={style} onClick={handleClick}>
        {cell.energyCost}
      </div>
    );

    return cell.description ? (
      <Tooltip
        title={cell.description}
        overlayStyle={{ pointerEvents: "none" }}
      >
        {div}
      </Tooltip>
    ) : (
      <div className={cls} style={style} onClick={handleClick}>
        {cell.energyCost}
      </div>
    );
  }
);

interface IEnergyDisplayProps {
  cells: IAbilityCellDisplay[];
  moveLevel: number;
  selectedMap: ObservableMap<number, true>;
}

const EnergyDisplay = observer(
  ({ cells, moveLevel, selectedMap }: IEnergyDisplayProps) => {
    const energy = cells
      .filter(c => selectedMap.has(c.cellId) && !isCellDisabled(c, moveLevel))
      .reduce((sum, c) => sum + c.energyCost, 0);
    return <div className="hexAbilityGrid-energy">Energy: {energy}</div>;
  }
);

interface ISelectedListProps {
  cells: IAbilityCellDisplay[];
  selectedMap: ObservableMap<number, true>;
}

const SelectedList = observer(({ cells, selectedMap }: ISelectedListProps) => {
  if (selectedMap.size === 0) return null;
  return (
    <div className="hexAbilityGrid-selected-list">
      {cells
        .filter(c => selectedMap.has(c.cellId) && c.description)
        .sort((a, b) =>
          (a.description ?? "").localeCompare(b.description ?? "")
        )
        .map(c => (
          <div key={c.cellId} className="hexAbilityGrid-selected-item">
            {c.description}
          </div>
        ))}
    </div>
  );
});

const HexAbilityGridInner = ({
  cells,
  moveLvl,
  selectedIds,
  onSelectionChange
}: IHexAbilityGridProps) => {
  const selectedMap = useMemo(() => observable.map<number, true>(), []);

  useEffect(() => {
    const incoming = new Set(selectedIds ?? []);
    const current = new Set(selectedMap.keys());
    if (
      incoming.size === current.size &&
      [...incoming].every(id => current.has(id))
    )
      return;
    selectedMap.clear();
    incoming.forEach(id => selectedMap.set(id, true));
  }, [selectedIds]);
  const moveLevel = parseMoveLevel(moveLvl);

  const { positions, containerW, containerH } = useMemo(() => {
    if (cells.length === 0)
      return { positions: [], containerW: 0, containerH: 0 };

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

  const handleToggle = useCallback(
    (cellId: number) => {
      if (selectedMap.has(cellId)) selectedMap.delete(cellId);
      else selectedMap.set(cellId, true);
      onSelectionChange(new Set(selectedMap.keys()));
    },
    [selectedMap, onSelectionChange]
  );

  return (
    <div className="hexAbilityGrid">
      <EnergyDisplay
        cells={cells}
        moveLevel={moveLevel}
        selectedMap={selectedMap}
      />
      <div
        style={{ position: "relative", width: containerW, height: containerH }}
      >
        {positions.map(({ cell, left, top }) => (
          <HexCell
            key={cell.cellId}
            cell={cell}
            left={left}
            top={top}
            isDisabled={isCellDisabled(cell, moveLevel)}
            selectedMap={selectedMap}
            onToggle={handleToggle}
          />
        ))}
      </div>
      <SelectedList cells={cells} selectedMap={selectedMap} />
    </div>
  );
};

export const HexAbilityGrid = React.memo(HexAbilityGridInner);
