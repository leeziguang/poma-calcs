## 1. Types

- [x] 1.1 Define `EMonsterFields` enum with all Monster.json field names in `src/types/monster.ts`
- [x] 1.2 Define `IMonster` interface using `EMonsterFields` (monsterId: string, monsterBaseId/syncMoveId/moveXChangeId: number, stat arrays: number[])
- [x] 1.3 Define `IMonsterApiResponse` interface with `entries: IMonster[]`
- [x] 1.4 Define `EMonsterBaseFields` enum with all MonsterBase.json field names
- [x] 1.5 Define `IMonsterBase` interface using `EMonsterBaseFields` (all fields including opaque u5/u7/u9/u11/u13/u14 as number)
- [x] 1.6 Define `IMonsterBaseApiResponse` interface with `entries: IMonsterBase[]`

## 2. Service

- [x] 2.1 Update `fetchMonster` in `src/service/monster.ts` to call `.then(rsp => rsp.json())` and return `Promise<IMonsterApiResponse>`
- [x] 2.2 Add `fetchMonsterBase` function fetching MonsterBase.json and returning `Promise<IMonsterBaseApiResponse>`
- [x] 2.3 Add `fetchMonsterNamesEn` function fetching monster_name_en.json and returning `Promise<Record<string, string>>`

## 3. Store

- [x] 3.1 Add observable fields to `MonsterStore`: `monsters: IMonster[]`, `monsterBase: IMonsterBase[]`, `monsterNamesEn: Record<string, string>`
- [x] 3.2 Register all observables in `makeObservable` (observable for state fields, action for setters, computed if any)
- [x] 3.3 Add `setMonsters`, `setMonsterBase`, `setMonsterNamesEn` action methods
- [x] 3.4 Add `getMonsters`, `getMonsterBase`, `getMonsterNamesEn` fetcher methods that call service functions and invoke the setters
- [x] 3.5 Add `initApiCalls` method that calls all three getters
- [x] 3.6 Add `reset` method that clears all observable state to initial values
