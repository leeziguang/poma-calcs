import React from "react";
import { PairStore } from "src/store/pair";
import { moveStore } from "src/store/move";
import { FormListFields } from "src/types";

const TSV_HEADERS = [
  "Pair",
  "Trainer",
  "Monster",
  "Move",
  "Base Stat",
  "Move Power",
  "Field Effect",
  "Final Damage"
];

export function buildTsvRows(
  fields: FormListFields,
  pairNames: string[],
  storesMap: Map<React.Key, PairStore>,
  formValues: Record<string, unknown>
): string[][] {
  const rows: string[][] = [TSV_HEADERS];
  const pairFormValues =
    (formValues?.PAIR as Array<Record<string, unknown>>) ?? [];

  fields.forEach((field, i) => {
    const store = storesMap.get(field.key);
    const pairForm = pairFormValues[i] ?? {};
    const pairName = pairNames[i] ?? `Pair ${i + 1}`;

    const trainerValue = (pairForm?.TRAINER_ID as string) ?? "";
    const [trainerName = "", monsterName = ""] = trainerValue.split(" & ");

    const dataCols =
      (pairForm?.DATA_COL as Array<Record<string, unknown>>) ?? [];
    const firstCol = dataCols[0] ?? {};
    const moveId = String(firstCol?.MOVE_ID ?? "");
    const moveName = moveStore.moveNamesEn[moveId] ?? moveId;

    const moveDamageRec = store?.moveDamageRec ?? {};
    const firstMove = Object.values(moveDamageRec)[0] ?? {};

    rows.push([
      pairName,
      trainerName,
      monsterName,
      moveName,
      String(firstMove.baseStat ?? 0),
      String(firstMove.movePower ?? 0),
      String(firstMove.fieldEffect ?? 0),
      String(store?.totalDamage ?? 0)
    ]);
  });

  return rows;
}

export function triggerDownload(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
