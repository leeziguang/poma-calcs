## ADDED Requirements

### Requirement: Damage value formatting
The system SHALL format all displayed damage values using a locale-aware number string with up to 6 decimal places, with trailing zeros removed.

#### Scenario: Integer damage displayed without decimals
- **WHEN** finalDamage = 400.0
- **THEN** displayed value SHALL be "400"

#### Scenario: Non-integer damage trims trailing zeros
- **WHEN** finalDamage = 345.600000
- **THEN** displayed value SHALL be "345.6"

#### Scenario: High-precision damage displayed up to 6 decimals
- **WHEN** finalDamage = 123.456789
- **THEN** displayed value SHALL be "123.456789"

### Requirement: Move column damage display
Each move column SHALL display its own `finalDamage` and its percentage of the pair's `totalDamage` side-by-side.

#### Scenario: Move damage and percentage shown
- **WHEN** a move column's finalDamage = 200 and totalDamage = 400
- **THEN** the column SHALL display "200" and "50%"

#### Scenario: Invalid percentage displayed as dash
- **WHEN** totalDamage is 0 or NaN
- **THEN** the percentage SHALL display " - %"

### Requirement: Pair total damage display
Each pair SHALL display the sum of all move columns' `finalDamage` as the pair's total at the top of the data column list.

#### Scenario: Total damage updates reactively
- **WHEN** any move column's finalDamage changes
- **THEN** the displayed total SHALL update immediately without a page refresh

### Requirement: Tab label summary
Each pair's tab label SHALL display: pair name, level, move level (formatted), and the pair's damage as a percentage of the first pair's total damage.

#### Scenario: Tab label shows level and formatted move level
- **WHEN** pair level = 200, moveLevel = "SA 3"
- **THEN** tab label SHALL include "200" and "SA3"

#### Scenario: Regular move level formatted with /5
- **WHEN** moveLevel = "2"
- **THEN** tab label SHALL display "2/5"

#### Scenario: SA move level formatted without space
- **WHEN** moveLevel = "SA 2"
- **THEN** tab label SHALL display "SA2"

#### Scenario: First pair shows no percentage
- **WHEN** the pair is the first (index 0) in the list
- **THEN** the tab label SHALL NOT show a percentage comparison value

#### Scenario: Non-first pair shows percentage of first pair
- **WHEN** the pair's totalDamage = 600 and first pair's totalDamage = 1200
- **THEN** the tab label SHALL display "50%"

#### Scenario: Invalid comparison percentage displayed as dash
- **WHEN** the first pair's totalDamage is 0 or NaN
- **THEN** the percentage comparison SHALL display " - %"

### Requirement: Move level display formatting
The system SHALL format move level strings for compact display: regular levels (1–5) append "/5"; SA levels (SA 1–SA 5) remove the space.

#### Scenario: Regular move level format
- **WHEN** moveLevel = "1"
- **THEN** formatted string = "1/5"

#### Scenario: SA move level format
- **WHEN** moveLevel = "SA 5"
- **THEN** formatted string = "SA5"
