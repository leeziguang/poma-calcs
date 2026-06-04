import { EMovePassive, ESyncPassive } from "src/types/passive";

export interface IConditionalPassiveInput {
  label: string;
  min: number;
  max: number;
}

export const CONDITIONAL_PASSIVE_INPUTS: Record<
  string,
  IConditionalPassiveInput
> = {
  [ESyncPassive.RISING_TIDE]: { label: "Atk stacks", min: 1, max: 6 },
  [EMovePassive.GOOD_FORM]: { label: "Raised stats", min: 1, max: 41 }
};
