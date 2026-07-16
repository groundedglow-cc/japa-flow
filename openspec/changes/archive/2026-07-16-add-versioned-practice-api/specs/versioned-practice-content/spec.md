## ADDED Requirements

### Requirement: Published practice content can be loaded by lesson
The system SHALL expose the latest published practice content for a lesson through a learner API.

#### Scenario: Load published practice content
- **WHEN** an authenticated learner requests practice content for a lesson with a published practice set
- **THEN** the system returns the practice set identifier, version, lesson identifier, title, and full practice content document

#### Scenario: No published practice content
- **WHEN** an authenticated learner requests practice content for a lesson without a published practice set
- **THEN** the system returns a not-found response without creating user progress

### Requirement: Practice content versions are immutable after publish
The system SHALL preserve historical meaning of activity and item identifiers by treating published practice sets as immutable.

#### Scenario: Publish practice set
- **WHEN** an administrator publishes a practice set version
- **THEN** the system marks that version as published and uses it for subsequent learner content loads

#### Scenario: Change generated practice content
- **WHEN** generated practice content for a lesson changes after a version has been published
- **THEN** the system creates a new practice set version instead of modifying the published version in place

### Requirement: Practice content stores the generated document model
The system SHALL store generated lesson practice content as a JSON document that can represent activities, item groups, prompts, answers, assets, and audio metadata.

#### Scenario: Save generated content
- **WHEN** generated practice content is saved for a lesson
- **THEN** the system stores the full content document with lesson ID, schema version, content version, source metadata, and status

#### Scenario: Return content without old exercise coupling
- **WHEN** practice content is loaded
- **THEN** the response is based on the new practice set document and does not depend on the older lesson exercise records
