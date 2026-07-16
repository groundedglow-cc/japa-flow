## ADDED Requirements

### Requirement: Learners can load resumable practice progress
The system SHALL expose a learner's current practice session for a lesson.

#### Scenario: Load existing session
- **WHEN** an authenticated learner requests practice session progress for a lesson with existing progress
- **THEN** the system returns the practice set ID, status, current activity ID, completion counts, last active time, and saved activity progress summary

#### Scenario: Load session before progress exists
- **WHEN** an authenticated learner requests practice session progress for a lesson without existing progress
- **THEN** the system returns an empty not-started session for the latest published practice set

### Requirement: Learners can update current practice progress
The system SHALL allow the frontend to update mutable practice progress separately from attempt history.

#### Scenario: Update current activity
- **WHEN** a learner navigates to another practice activity
- **THEN** the system records the current activity ID and last active time without creating an attempt

#### Scenario: Submission updates session summary
- **WHEN** a learner successfully submits an activity attempt
- **THEN** the system updates session status, completion counts, and last active time without modifying prior attempt rows

### Requirement: Learners can reset practice progress without deleting attempt history
The system SHALL support resetting mutable practice progress while preserving append-only attempt records.

#### Scenario: Reset session
- **WHEN** a learner resets practice progress for a lesson
- **THEN** the system clears or reinitializes the session progress for that learner and lesson

#### Scenario: Attempts remain after reset
- **WHEN** a learner resets practice progress after submitting attempts
- **THEN** the system preserves existing activity attempt and item attempt rows for analytics and history
