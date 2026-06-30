## ADDED Requirements

### Requirement: Base stat calculation
The system SHALL compute a `baseStat` value from the attacker's raw stat, grid boost, move-level stat multiplier, stat-boost multiplier, and the global enemy defense reduced by any defense-drop multiplier.

Formula:
1. `realStat = floor((rawStat × moveLevelStatBoost + statGrid) × statBoostMultiplier)`
2. `baseStat = (realStat × 0.5) / floor(enemyDef × defDropMultiplier)`

Move-level stat boosts apply only to SA-level move levels (SA 1–5) with a multiplier of 1.1; all other move levels use 1.0.

Stat boost multipliers (stage → multiplier):
- 0 → 1.0, +1 → 1.5, +2 → 2.0, +3 → 2.5, +4 → 3.0, +5 → 3.5, +6 → 4.0

Defense drop multipliers (stage → multiplier):
- 0 → 1.0, −1 → 0.67, −2 → 0.5, −3 → 0.4, −4 → 0.33, −5 → 0.29, −6 → 0.25

#### Scenario: Default stat boost and no def drops
- **WHEN** rawStat = 400, statGrid = 0, moveLevel = "1", statBoost = 0, defDrops = 0, enemyDef = 50
- **THEN** realStat = floor((400 × 1.0 + 0) × 1.0) = 400
- **THEN** baseStat = (400 × 0.5) / floor(50 × 1.0) = 200 / 50 = 4.0

#### Scenario: SA move level applies stat boost multiplier
- **WHEN** rawStat = 400, statGrid = 0, moveLevel = "SA 1", statBoost = 0, defDrops = 0, enemyDef = 50
- **THEN** realStat = floor((400 × 1.1 + 0) × 1.0) = floor(440) = 440
- **THEN** baseStat = (440 × 0.5) / 50 = 4.4

#### Scenario: +6 stat boost with −2 def drops
- **WHEN** rawStat = 300, statGrid = 10, moveLevel = "1", statBoost = +6, defDrops = −2, enemyDef = 50
- **THEN** realStat = floor((300 × 1.0 + 10) × 4.0) = floor(1240) = 1240
- **THEN** baseStat = (1240 × 0.5) / floor(50 × 0.5) = 620 / 25 = 24.8

### Requirement: Regular move power calculation
The system SHALL compute `movePower` for non-sync moves using base power, move-level multiplier, Tera buff, grid boost, SM/PMUN units, passive/grid multis, innate multis, and AOE penalty.

Formula:
1. `realMovePower = floor(floor(floor(base × teraBuff) × moveLevelMoveBoost) + moveGrid)`
2. `moveMulti = 1 + multis + smpmun × 0.4`
3. `innateMulti = 1 + innateMultis`
4. `aoeMulti = isAOE ? (ignoreAOEPenalty ? 1.5 : 0.75) : 1.0`
5. `movePower = realMovePower × moveMulti × innateMulti × aoeMulti`

Tera buff: 1.2 when Tera option is selected, 1.0 otherwise.

Move-level move boost multipliers for regular moves (1–5): 1.0, 1.5, 2.0, 2.5, 3.0.

#### Scenario: Basic move with no options
- **WHEN** base = 100, moveLevel = "1", no options, smpmun = 0, multis = 0, innateMultis = 0, moveGrid = 0
- **THEN** realMovePower = floor(floor(floor(100 × 1.0) × 1.0) + 0) = 100
- **THEN** movePower = 100 × 1.0 × 1.0 × 1.0 = 100

#### Scenario: Move level 3 with Tera and 2 SM/PMUN units
- **WHEN** base = 80, moveLevel = "3", Tera = true, smpmun = 2, multis = 0, innateMultis = 0, moveGrid = 0
- **THEN** realMovePower = floor(floor(floor(80 × 1.2) × 2.0) + 0) = floor(floor(96) × 2.0) = floor(192) = 192
- **THEN** moveMulti = 1 + 0 + 2 × 0.4 = 1.8
- **THEN** movePower = 192 × 1.8 × 1.0 × 1.0 = 345.6

#### Scenario: AOE move without ignore penalty
- **WHEN** base = 60, moveLevel = "1", AOE = true, ignoreAOEPenalty = false, all other options default
- **THEN** aoeMulti = 0.75
- **THEN** movePower = 60 × 1.0 × 1.0 × 0.75 = 45

#### Scenario: AOE move with ignore penalty
- **WHEN** base = 60, moveLevel = "1", AOE = true, ignoreAOEPenalty = true, all other options default
- **THEN** aoeMulti = 1.5
- **THEN** movePower = 60 × 1.0 × 1.0 × 1.5 = 90

### Requirement: Sync move power calculation
The system SHALL compute `movePower` for sync moves using base power, sync-level multiplier, Tech buff, grid boost, SyUN units, passive/grid multis, innate multis, and AOE penalty.

Formula:
1. `realMovePower = floor(floor(floor(base × techBuff) × syncLevelBoost) + moveGrid)`
2. `moveMulti = 1 + multis + syun × 0.1`
3. `innateMulti = 1 + innateMultis`
4. `aoeMulti = 3.0` (sync AOE is always active and penalty-free)
5. `movePower = floor(realMovePower × moveMulti × innateMulti × aoeMulti)`

Tech buff: 1.2 when Tech option is selected (only available during sync), 1.0 otherwise.

Sync-level boost multipliers (SA 1–5): 1.0, 1.5, 2.0, 2.5, 3.0.

SyUN multiplier per unit: 0.1.

Sync moves cannot have Tera selected; the Tera option SHALL be disabled when Sync is active.

#### Scenario: Sync move with 5 SyUN
- **WHEN** base = 200, moveLevel = "SA 1", tech = false, syun = 5, multis = 0, innateMultis = 0, moveGrid = 0
- **THEN** realMovePower = floor(floor(floor(200 × 1.0) × 1.0) + 0) = 200
- **THEN** moveMulti = 1 + 0 + 5 × 0.1 = 1.5
- **THEN** movePower = floor(200 × 1.5 × 1.0 × 3.0) = floor(900) = 900

#### Scenario: Tech sync move at SA 3
- **WHEN** base = 150, moveLevel = "SA 3", tech = true, syun = 0, multis = 0, innateMultis = 0, moveGrid = 0
- **THEN** realMovePower = floor(floor(floor(150 × 1.2) × 2.0) + 0) = floor(floor(180) × 2.0) = 360
- **THEN** movePower = floor(360 × 1.0 × 1.0 × 3.0) = 1080

### Requirement: Field effect multiplier calculation
The system SHALL compute a `fieldEffect` multiplier from sync boosts, WTZ type, circle entries, rebuff stage, and SEUN activation.

Formula:
1. `totalCircleMulti = 1 + Σ(circleMult × (1 + memberCount))` for each circle entry
2. `fieldEffect = (1 + syncBoosts × 0.5) × wtzMulti × totalCircleMulti × rebuffMulti × seunMulti`

WTZ multipliers: None → 1.0, Normal → 1.5, EX → 3.0.

Circle multipliers by type: Phys/Spec (0.1), Defensive (0.05).

Rebuff stage → multiplier: 0→1.0, 1→1.2, 2→1.4, 3→1.6, 4→1.8, 5→2.0, 6→2.2.

SEUN multiplier: 3.0 when active, 1.0 when inactive.

#### Scenario: No field effects active
- **WHEN** syncBoosts = 0, WTZ = None, no circles, rebuff = 0, SEUN = false
- **THEN** fieldEffect = (1 + 0) × 1.0 × 1.0 × 1.0 × 1.0 = 1.0

#### Scenario: WTZ EX with 2 sync boosts
- **WHEN** syncBoosts = 2, WTZ = EX, no circles, rebuff = 0, SEUN = false
- **THEN** fieldEffect = (1 + 2 × 0.5) × 3.0 × 1.0 × 1.0 × 1.0 = 2.0 × 3.0 = 6.0

#### Scenario: Phys/Spec circle with 3 members
- **WHEN** syncBoosts = 0, WTZ = None, 1 circle (Phys/Spec, 3 members), rebuff = 0, SEUN = false
- **THEN** totalCircleMulti = 1 + (0.1 × (1 + 3)) = 1 + 0.4 = 1.4
- **THEN** fieldEffect = 1.0 × 1.0 × 1.4 × 1.0 × 1.0 = 1.4

#### Scenario: SEUN active with rebuff stage 6
- **WHEN** syncBoosts = 0, WTZ = None, no circles, rebuff = 6, SEUN = true
- **THEN** fieldEffect = 1.0 × 1.0 × 1.0 × 2.2 × 3.0 = 6.6

### Requirement: Final damage and total damage
The system SHALL compute `finalDamage = baseStat × movePower × fieldEffect` for each move column and `totalDamage = Σ(finalDamage)` across all move columns in a pair.

#### Scenario: Single move column damage
- **WHEN** baseStat = 4.0, movePower = 100, fieldEffect = 1.0
- **THEN** finalDamage = 4.0 × 100 × 1.0 = 400.0

#### Scenario: Multiple move columns sum correctly
- **WHEN** move 1 finalDamage = 400.0, move 2 finalDamage = 250.5
- **THEN** totalDamage = 650.5

#### Scenario: Updating a move column recalculates total
- **WHEN** a move column's baseStat, movePower, or fieldEffect changes
- **THEN** the pair's totalDamage SHALL update reactively to reflect the new sum
