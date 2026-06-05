import {
  IAbilityApiResponse,
  IAbilityPanelApiResponse
} from "src/types/ability";
import { cachedFetch } from "src/cache/cachedFetch";

export const fetchAbilities = (): Promise<IAbilityApiResponse> =>
  cachedFetch<IAbilityApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/Ability.json"
  );

export const fetchAbilityPanels = (): Promise<IAbilityPanelApiResponse> =>
  cachedFetch<IAbilityPanelApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/AbilityPanel.json"
  );
