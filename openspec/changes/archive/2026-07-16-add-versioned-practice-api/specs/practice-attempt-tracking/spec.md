## ADDED Requirements

### Requirement: Activity submissions create append-only activity attempts
The system SHALL record each submitted main practice activity as an append-only activity attempt.

#### Scenario: Submit activity attempt
- **WHEN** a learner submits answers for one practice activity containing multiple items
- **THEN** the system creates one activity attempt with user ID, lesson ID, practice set ID, activity ID, attempt number, total item count, correct item count, duration, client attempt ID, and submitted time

#### Scenario: Preserve previous attempts
- **WHEN** a learner submits the same practice activity again
- **THEN** the system creates a new activity attempt and preserves earlier attempts

### Requirement: Activity submissions create item attempt rows
The system SHALL record each small exercise item result inside an activity submission as an item attempt linked to the parent activity attempt.

#### Scenario: Save item-level results
- **WHEN** an activity submission contains item results
- **THEN** the system stores one item attempt per item with item ID, interaction type, answer unit, evaluation mode, user answer JSON, optional correct answer JSON, correctness, score, optional error tags, and submitted time

#### Scenario: Support wrong-item analysis
- **WHEN** item attempt rows are queried by item ID, interaction type, answer unit, evaluation mode, or correctness
- **THEN** the system can identify frequently wrong items and exercise categories without reading localStorage

### Requirement: Attempt submission is idempotent
The system SHALL prevent duplicate activity attempts caused by request retries.

#### Scenario: Duplicate client attempt ID
- **WHEN** the same learner submits the same activity with a client attempt ID that was already saved
- **THEN** the system returns the existing attempt result instead of inserting duplicate activity and item attempts

### Requirement: Attempt inserts are transactional
The system SHALL save the parent activity attempt and all child item attempts atomically.

#### Scenario: Item insert fails
- **WHEN** an item attempt cannot be saved during an activity submission
- **THEN** the system rolls back the parent activity attempt and all item attempts for that submission

### Requirement: Attempts retain practice version context
The system SHALL associate every activity and item attempt with the practice set version used at submission time.

#### Scenario: New practice version published after attempts exist
- **WHEN** a newer practice set version is published after a learner has submitted attempts against an older version
- **THEN** the older attempts remain associated with their original practice set ID
