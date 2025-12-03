# Customer Service Module - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
5. [Data Structures](#data-structures)
6. [JSON Export Format](#json-export-format)

## Overview

The Customer Service Module provides a complete system for creating and administering immersive English language assessments focused on customer service scenarios. The module tracks all user interactions and exports comprehensive data for scoring.

## Installation

```bash
# If this were a published package
npm install customer-service-module

# Or use directly from source
const CustomerServiceModule = require('./src/module/CustomerServiceModule');
```

## Quick Start

```javascript
const CustomerServiceModule = require('./src/module/CustomerServiceModule');

// Initialize module
const module = new CustomerServiceModule();

// Start session
const session = module.startSession('user123', 'B1');

// Select scenario
const scenario = module.selectScenario('B1_PROBLEM_SOLVING');

// Submit responses
module.submitResponse('spoken', {
  transcription: 'Hello, how can I help you?',
  duration: 3,
  audioUrl: 'audio.mp3'
});

// Export results
const json = module.exportSessionJSON();
```

## API Reference

### CustomerServiceModule

Main class for managing customer service assessment sessions.

#### Constructor

```javascript
const module = new CustomerServiceModule();
```

#### Methods

##### `startSession(userId, cefrLevel)`

Start a new assessment session.

**Parameters:**
- `userId` (string): Unique identifier for the user
- `cefrLevel` (string): CEFR level - 'A1', 'A2', 'B1', 'B2', 'C1', or 'C2'

**Returns:** Object
```javascript
{
  sessionId: string,
  userId: string,
  cefrLevel: string,
  availableScenarios: Array<ScenarioSummary>
}
```

**Example:**
```javascript
const session = module.startSession('student_456', 'B2');
console.log(`Session started: ${session.sessionId}`);
```

---

##### `getAvailableScenarios(cefrLevel)`

Get list of scenarios for a CEFR level.

**Parameters:**
- `cefrLevel` (string): CEFR level

**Returns:** Array of scenario summaries

**Example:**
```javascript
const scenarios = module.getAvailableScenarios('A2');
scenarios.forEach(s => console.log(s.title));
```

---

##### `selectScenario(scenarioId)`

Select and start a specific scenario.

**Parameters:**
- `scenarioId` (string): ID of the scenario to start

**Returns:** Object
```javascript
{
  scenario: {
    id: string,
    title: string,
    context: string,
    customerProfile: string,
    situation: string,
    totalExercises: number
  },
  firstExercise: Exercise
}
```

**Example:**
```javascript
const data = module.selectScenario('A1_GREETING');
console.log(`Starting: ${data.scenario.title}`);
console.log(`First exercise type: ${data.firstExercise.type}`);
```

---

##### `getCurrentExercise()`

Get the current exercise information.

**Returns:** Exercise object or null if all exercises completed

**Example:**
```javascript
const exercise = module.getCurrentExercise();
if (exercise) {
  console.log(`Prompt: ${exercise.prompt}`);
  console.log(`Type: ${exercise.type}`);
}
```

---

##### `submitResponse(responseType, responseData)`

Submit a response to the current exercise.

**Parameters:**
- `responseType` (string): 'multiple_choice', 'text_input', or 'spoken'
- `responseData` (varies by type):
  - **multiple_choice**: string (option ID)
  - **text_input**: string (text content)
  - **spoken**: object `{ transcription: string, duration: number, audioUrl?: string, audioBlob?: any }`

**Returns:** Object
```javascript
{
  responseRecorded: boolean,
  currentExerciseNumber: number,
  totalExercises: number,
  hasMoreExercises: boolean,
  nextExercise: Exercise | null,
  scenarioCompleted: boolean
}
```

**Examples:**

```javascript
// Multiple choice
const result1 = module.submitResponse('multiple_choice', 'a');

// Text input
const result2 = module.submitResponse('text_input',
  'Thank you for contacting us. How can I help you today?'
);

// Spoken response
const result3 = module.submitResponse('spoken', {
  transcription: 'I would be happy to help you with that.',
  duration: 5,
  audioUrl: 'recordings/response_001.mp3'
});

if (result3.scenarioCompleted) {
  console.log('All exercises completed!');
}
```

---

##### `trackBehavior(action, data)`

Track user behavior during the session.

**Parameters:**
- `action` (string): 'pause', 'correction', 'hesitation', 'navigation'
- `data` (object): Additional data about the action

**Example:**
```javascript
// Track a pause
module.trackBehavior('pause', { duration: 10 });

// Track a correction
module.trackBehavior('correction', {
  exerciseId: 'B1_DELIVERY_E2',
  originalText: 'old text',
  correctedText: 'new text'
});

// Track navigation
module.trackBehavior('navigation', { type: 'back' });
```

---

##### `completeSession(status)`

Mark the session as complete.

**Parameters:**
- `status` (string): 'completed', 'partial', or 'abandoned'

**Returns:** Complete session data object

**Example:**
```javascript
const sessionData = module.completeSession('completed');
console.log(`Session duration: ${sessionData.duration} seconds`);
```

---

##### `exportSessionJSON(pretty)`

Export session data as JSON string.

**Parameters:**
- `pretty` (boolean): Whether to format with indentation (default: true)

**Returns:** JSON string

**Example:**
```javascript
const json = module.exportSessionJSON(true);
console.log(json);
```

---

##### `exportSessionToFile(filePath)`

Export session data to a JSON file.

**Parameters:**
- `filePath` (string): Path where to save the file

**Returns:** Promise with result object

**Example:**
```javascript
const result = await module.exportSessionToFile('./data/session_001.json');
if (result.success) {
  console.log(`Saved to ${result.filePath}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

---

##### `getSessionInfo()`

Get current session information.

**Returns:** Session info object or null

**Example:**
```javascript
const info = module.getSessionInfo();
console.log(`Progress: ${info.currentExercise}/${info.totalExercises}`);
```

---

##### `reset()`

Reset the module for a new session.

**Example:**
```javascript
module.reset();
```

---

##### `static getCEFRLevels()`

Get information about all CEFR levels.

**Returns:** Array of CEFR level information

**Example:**
```javascript
const levels = CustomerServiceModule.getCEFRLevels();
levels.forEach(level => {
  console.log(`${level.level} - ${level.name}: ${level.description}`);
});
```

---

## Data Structures

### Exercise Object

```javascript
{
  exerciseId: string,
  type: 'multiple_choice' | 'text_input' | 'spoken',
  prompt: string,
  instruction: string,
  config: {
    // For multiple_choice:
    options: Array<{ id: string, text: string }>,

    // For text_input:
    minLength: number,
    maxLength: number,
    placeholder: string,

    // For spoken:
    expectedDuration: number,
    recordingTimeLimit: number
  },
  timeLimit: number
}
```

### Response Object

```javascript
{
  exerciseId: string,
  type: 'multiple_choice' | 'text_input' | 'spoken',
  value: string | any,
  timestamp: number,
  timeSpent: number,
  attemptNumber: number,
  metadata: {
    // Type-specific metadata
    // Multiple choice: selectedText, allOptions
    // Text input: wordCount, charCount
    // Spoken: audioData, transcription, duration

    expectedElements: Array<string>,
    withinTimeLimit: boolean
  }
}
```

## JSON Export Format

The exported JSON has the following structure:

```json
{
  "sessionId": "session_1234567890_abc123",
  "userId": "user_456",
  "cefrLevel": "B1",
  "scenarioId": "B1_PROBLEM_SOLVING",
  "startTime": "2024-01-15T10:30:00.000Z",
  "endTime": "2024-01-15T10:45:30.000Z",
  "duration": 930,
  "status": "completed",

  "responses": [
    {
      "exerciseId": "B1_DELIVERY_E1",
      "type": "spoken",
      "value": "I'm very sorry to hear about the delay...",
      "timestamp": 1705318200000,
      "timeSpent": 45,
      "attemptNumber": 1,
      "metadata": {
        "audioData": {
          "duration": 12,
          "audioUrl": "audio_001.mp3"
        },
        "transcription": "I'm very sorry to hear about the delay...",
        "expectedElements": ["empathy", "apologize", "solution"],
        "withinTimeLimit": true,
        "withinDurationLimit": true
      }
    },
    {
      "exerciseId": "B1_DELIVERY_E2",
      "type": "text_input",
      "value": "I understand your frustration...",
      "timestamp": 1705318290000,
      "timeSpent": 90,
      "attemptNumber": 1,
      "metadata": {
        "wordCount": 45,
        "charCount": 287,
        "expectedElements": ["understanding", "options", "compensation"],
        "withinTimeLimit": true,
        "meetsMinLength": true,
        "meetsMaxLength": true
      }
    }
  ],

  "behaviorMetrics": {
    "totalTimeSpent": 930,
    "averageResponseTime": 67.5,
    "pauseCount": 3,
    "pauseDurations": [5, 8, 3],
    "averagePauseDuration": 5.33,
    "correctionsMade": 2,
    "hesitationMarkers": 1,
    "navigationType": ["forward", "forward"],
    "interactionPattern": [
      {
        "action": "pause",
        "timestamp": 1705318220000,
        "data": { "duration": 5 }
      }
    ],
    "totalInteractions": 8
  },

  "summary": {
    "totalExercises": 3,
    "exercisesByType": {
      "spoken": 1,
      "text_input": 1,
      "multiple_choice": 1
    },
    "averageTimePerExercise": 310,
    "completionRate": 100
  }
}
```

## Scoring Integration

The exported JSON is designed to be consumed by a scoring agent. Key fields for assessment:

- **responses[].value**: The actual user response
- **responses[].metadata.expectedElements**: What should be present in the response
- **responses[].timeSpent**: How long the user took
- **behaviorMetrics**: User behavior patterns (hesitation, corrections, etc.)

Example scoring workflow:

```javascript
const fs = require('fs');

// Load exported session
const sessionData = JSON.parse(fs.readFileSync('session.json'));

// Score each response
sessionData.responses.forEach(response => {
  const score = scoreResponse(
    response.value,
    response.metadata.expectedElements,
    response.type
  );

  console.log(`Exercise ${response.exerciseId}: ${score}/100`);
});
```

## Error Handling

All methods throw descriptive errors:

```javascript
try {
  module.startSession('user123', 'Z1'); // Invalid level
} catch (error) {
  console.error(error.message);
  // "Invalid CEFR level: Z1. Must be A1, A2, B1, B2, C1, or C2"
}
```

## Best Practices

1. **Always start a session** before selecting scenarios
2. **Track behaviors** throughout the session for richer data
3. **Export immediately** after completion to avoid data loss
4. **Validate responses** before submission
5. **Handle errors gracefully** in production environments

## Support

For issues or questions, refer to the main README.md or contact support.
