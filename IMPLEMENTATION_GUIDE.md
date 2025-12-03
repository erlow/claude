# Implementation Guide

This guide explains how to integrate the Customer Service Module into different environments and use cases.

## Table of Contents
1. [Node.js Backend Integration](#nodejs-backend-integration)
2. [Web Frontend Integration](#web-frontend-integration)
3. [LMS Integration](#lms-integration)
4. [Scoring System Integration](#scoring-system-integration)
5. [Customization Guide](#customization-guide)

---

## Node.js Backend Integration

### Basic Setup

```javascript
const express = require('express');
const CustomerServiceModule = require('./src/module/CustomerServiceModule');

const app = express();
app.use(express.json());

// Store active sessions (use Redis/database in production)
const sessions = new Map();

// Start session endpoint
app.post('/api/session/start', (req, res) => {
  const { userId, cefrLevel } = req.body;

  const module = new CustomerServiceModule();
  const session = module.startSession(userId, cefrLevel);

  sessions.set(session.sessionId, module);

  res.json(session);
});

// Get scenarios endpoint
app.get('/api/scenarios/:level', (req, res) => {
  const module = new CustomerServiceModule();
  const scenarios = module.getAvailableScenarios(req.params.level);
  res.json(scenarios);
});

// Select scenario endpoint
app.post('/api/session/:sessionId/scenario', (req, res) => {
  const module = sessions.get(req.params.sessionId);

  if (!module) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const scenarioData = module.selectScenario(req.body.scenarioId);
  res.json(scenarioData);
});

// Submit response endpoint
app.post('/api/session/:sessionId/response', (req, res) => {
  const module = sessions.get(req.params.sessionId);

  if (!module) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { type, data } = req.body;
  const result = module.submitResponse(type, data);

  res.json(result);
});

// Complete and export session
app.post('/api/session/:sessionId/complete', async (req, res) => {
  const module = sessions.get(req.params.sessionId);

  if (!module) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const sessionData = module.completeSession('completed');

  // Save to file or database
  const exportPath = `./exports/session_${req.params.sessionId}.json`;
  await module.exportSessionToFile(exportPath);

  // Clean up
  sessions.delete(req.params.sessionId);

  res.json({
    message: 'Session completed',
    data: sessionData,
    exportPath: exportPath
  });
});

app.listen(3000, () => {
  console.log('Customer Service Module API running on port 3000');
});
```

### With Database Storage

```javascript
const mongoose = require('mongoose');

// Session schema
const SessionSchema = new mongoose.Schema({
  sessionId: String,
  userId: String,
  cefrLevel: String,
  scenarioId: String,
  responses: Array,
  behaviorMetrics: Object,
  status: String,
  createdAt: Date,
  completedAt: Date
});

const Session = mongoose.model('Session', SessionSchema);

// Save session after completion
app.post('/api/session/:sessionId/complete', async (req, res) => {
  const module = sessions.get(req.params.sessionId);
  const sessionData = module.completeSession('completed');

  // Save to database
  const dbSession = new Session({
    ...sessionData,
    createdAt: new Date(sessionData.startTime),
    completedAt: new Date(sessionData.endTime)
  });

  await dbSession.save();

  res.json({ message: 'Session saved', sessionId: sessionData.sessionId });
});
```

---

## Web Frontend Integration

### React Example

```jsx
import React, { useState, useEffect } from 'react';

function CustomerServiceAssessment() {
  const [sessionId, setSessionId] = useState(null);
  const [cefrLevel, setCefrLevel] = useState('B1');
  const [scenarios, setScenarios] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [response, setResponse] = useState('');

  // Start session
  const startSession = async () => {
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_' + Date.now(),
        cefrLevel: cefrLevel
      })
    });

    const data = await res.json();
    setSessionId(data.sessionId);
    setScenarios(data.availableScenarios);
  };

  // Select scenario
  const selectScenario = async (scenarioId) => {
    const res = await fetch(`/api/session/${sessionId}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId })
    });

    const data = await res.json();
    setCurrentExercise(data.firstExercise);
  };

  // Submit response
  const submitResponse = async () => {
    const res = await fetch(`/api/session/${sessionId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: currentExercise.type,
        data: response
      })
    });

    const data = await res.json();

    if (data.hasMoreExercises) {
      setCurrentExercise(data.nextExercise);
      setResponse('');
    } else {
      // Complete session
      await fetch(`/api/session/${sessionId}/complete`, {
        method: 'POST'
      });
      alert('Assessment complete!');
    }
  };

  return (
    <div>
      {!sessionId ? (
        <div>
          <select value={cefrLevel} onChange={e => setCefrLevel(e.target.value)}>
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Proficient</option>
          </select>
          <button onClick={startSession}>Start Assessment</button>
        </div>
      ) : !currentExercise ? (
        <div>
          <h2>Select a Scenario</h2>
          {scenarios.map(scenario => (
            <div key={scenario.id} onClick={() => selectScenario(scenario.id)}>
              <h3>{scenario.title}</h3>
              <p>{scenario.context}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>Customer says:</h3>
          <p>"{currentExercise.prompt}"</p>

          <h4>{currentExercise.instruction}</h4>

          {currentExercise.type === 'text_input' && (
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Type your response..."
            />
          )}

          {currentExercise.type === 'multiple_choice' && (
            <div>
              {currentExercise.config.options.map(option => (
                <label key={option.id}>
                  <input
                    type="radio"
                    value={option.id}
                    checked={response === option.id}
                    onChange={e => setResponse(e.target.value)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          )}

          <button onClick={submitResponse}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default CustomerServiceAssessment;
```

### Vue.js Example

```vue
<template>
  <div class="assessment">
    <div v-if="!sessionId" class="level-selection">
      <h2>Select CEFR Level</h2>
      <select v-model="cefrLevel">
        <option value="A1">A1 - Beginner</option>
        <option value="B1">B1 - Intermediate</option>
        <option value="C1">C1 - Advanced</option>
      </select>
      <button @click="startSession">Start</button>
    </div>

    <div v-else-if="currentExercise" class="exercise">
      <div class="customer-message">
        <p>"{{ currentExercise.prompt }}"</p>
      </div>

      <textarea
        v-if="currentExercise.type === 'text_input'"
        v-model="response"
        :placeholder="currentExercise.instruction"
      ></textarea>

      <button @click="submitResponse">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sessionId: null,
      cefrLevel: 'B1',
      currentExercise: null,
      response: ''
    };
  },
  methods: {
    async startSession() {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_' + Date.now(),
          cefrLevel: this.cefrLevel
        })
      });
      const data = await res.json();
      this.sessionId = data.sessionId;
    },
    async submitResponse() {
      await fetch(`/api/session/${this.sessionId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: this.currentExercise.type,
          data: this.response
        })
      });
      this.response = '';
    }
  }
};
</script>
```

---

## LMS Integration

### Moodle Integration Example

```php
<?php
// Moodle plugin integration example

class mod_customerservice {
    public function start_assessment($userid, $cefr_level) {
        // Call Node.js API
        $url = 'http://localhost:3000/api/session/start';
        $data = array(
            'userId' => $userid,
            'cefrLevel' => $cefr_level
        );

        $response = $this->call_api($url, $data);
        return $response;
    }

    public function save_results($session_id) {
        global $DB;

        // Get results from API
        $url = "http://localhost:3000/api/session/{$session_id}/complete";
        $results = $this->call_api($url, array(), 'POST');

        // Save to Moodle gradebook
        $grade = new stdClass();
        $grade->userid = $results->userId;
        $grade->rawgrade = $this->calculate_grade($results);

        grade_update('mod/customerservice', $grade);
    }

    private function calculate_grade($results) {
        // Scoring logic
        return 85; // Example score
    }
}
```

### Canvas LMS Integration

```javascript
// Canvas LMS External Tool (LTI) integration
const lti = require('ims-lti');

app.post('/lti/launch', (req, res) => {
  const consumer = new lti.Provider(
    req.body.oauth_consumer_key,
    config.lti.secret
  );

  consumer.valid_request(req, (err, isValid) => {
    if (isValid) {
      // Start session with Canvas user info
      const module = new CustomerServiceModule();
      const session = module.startSession(
        req.body.user_id,
        req.body.custom_cefr_level
      );

      res.redirect(`/assessment/${session.sessionId}`);
    }
  });
});
```

---

## Scoring System Integration

### Automated Scoring Example

```javascript
const natural = require('natural');
const analyzer = new natural.SentimentAnalyzer();

class ScoringEngine {
  scoreSession(sessionData) {
    const scores = sessionData.responses.map(response => {
      return this.scoreResponse(response);
    });

    return {
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      cefrLevel: sessionData.cefrLevel,
      overallScore: this.calculateOverallScore(scores),
      detailedScores: scores,
      feedback: this.generateFeedback(scores, sessionData)
    };
  }

  scoreResponse(response) {
    const score = {
      exerciseId: response.exerciseId,
      type: response.type,
      contentScore: 0,
      timingScore: 0,
      qualityScore: 0,
      totalScore: 0
    };

    // Content scoring
    if (response.type === 'text_input' || response.type === 'spoken') {
      score.contentScore = this.scoreContent(
        response.value,
        response.metadata.expectedElements
      );
    } else if (response.type === 'multiple_choice') {
      // Check if correct option
      score.contentScore = this.evaluateChoice(response);
    }

    // Timing scoring
    score.timingScore = response.metadata.withinTimeLimit ? 100 : 70;

    // Quality scoring (for text/spoken)
    if (response.type !== 'multiple_choice') {
      score.qualityScore = this.assessQuality(response.value);
    }

    // Calculate total
    score.totalScore = (
      score.contentScore * 0.6 +
      score.timingScore * 0.2 +
      score.qualityScore * 0.2
    );

    return score;
  }

  scoreContent(text, expectedElements) {
    const lowerText = text.toLowerCase();
    const foundElements = expectedElements.filter(element =>
      lowerText.includes(element.toLowerCase())
    );

    return (foundElements.length / expectedElements.length) * 100;
  }

  assessQuality(text) {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);

    // Basic quality metrics
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = uniqueWords / words.length;

    // Score based on metrics
    let score = 50; // Base score

    if (avgWordLength > 4) score += 10;
    if (avgSentenceLength > 8 && avgSentenceLength < 20) score += 15;
    if (lexicalDiversity > 0.6) score += 15;
    if (words.length > 30) score += 10;

    return Math.min(score, 100);
  }

  evaluateChoice(response) {
    // This would require answer key integration
    // For now, return neutral score
    return 50;
  }

  calculateOverallScore(scores) {
    const total = scores.reduce((sum, s) => sum + s.totalScore, 0);
    return total / scores.length;
  }

  generateFeedback(scores, sessionData) {
    const avgScore = this.calculateOverallScore(scores);
    const feedback = {
      overall: '',
      strengths: [],
      improvements: []
    };

    if (avgScore >= 85) {
      feedback.overall = 'Excellent performance! Your responses were professional and well-structured.';
    } else if (avgScore >= 70) {
      feedback.overall = 'Good work! You demonstrated solid customer service skills.';
    } else {
      feedback.overall = 'You showed effort, but there is room for improvement.';
    }

    // Analyze timing
    if (sessionData.behaviorMetrics.averageResponseTime < 60) {
      feedback.strengths.push('Quick response times');
    }

    // Analyze corrections
    if (sessionData.behaviorMetrics.correctionsMade < 2) {
      feedback.strengths.push('Confident responses with minimal corrections');
    } else {
      feedback.improvements.push('Try to be more confident in your initial responses');
    }

    return feedback;
  }
}

// Usage
const fs = require('fs');
const sessionData = JSON.parse(fs.readFileSync('session.json'));
const scorer = new ScoringEngine();
const results = scorer.scoreSession(sessionData);

console.log('Overall Score:', results.overallScore);
console.log('Feedback:', results.feedback);
```

---

## Customization Guide

### Adding Custom Scenarios

```javascript
// Add to src/scenarios/scenariosData.js

const customScenarios = {
  B1: [
    ...scenarios.B1, // Existing scenarios
    {
      id: 'B1_CUSTOM_HOTEL',
      cefrLevel: 'B1',
      title: 'Hotel Check-in Issue',
      context: 'You work at a hotel. A guest has a reservation problem.',
      customerProfile: 'Tired traveler with a booking error',
      situation: 'Guest\'s room is already occupied',
      learningObjectives: [
        'Handle booking errors professionally',
        'Offer alternatives',
        'Maintain calm under pressure'
      ],
      exercises: [
        {
          id: 'B1_CUSTOM_HOTEL_E1',
          type: 'spoken',
          prompt: 'I booked this room weeks ago and now you\'re telling me it\'s occupied?',
          instruction: 'Apologize and offer a solution',
          config: {
            expectedDuration: 20,
            recordingTimeLimit: 60
          },
          expectedElements: ['apology', 'solution', 'empathy'],
          timeLimit: 90
        }
      ]
    }
  ]
};

module.exports = customScenarios;
```

### Custom Behavior Tracking

```javascript
// Extend SessionManager

class ExtendedSessionManager extends SessionManager {
  constructor(userId, cefrLevel) {
    super(userId, cefrLevel);
    this.customMetrics = {
      mouseMovements: [],
      keystrokes: [],
      focusChanges: 0
    };
  }

  trackMouseMovement(x, y) {
    this.customMetrics.mouseMovements.push({
      x, y,
      timestamp: Date.now()
    });
  }

  trackKeystroke(key) {
    this.customMetrics.keystrokes.push({
      key,
      timestamp: Date.now()
    });
  }

  exportToJSON(pretty = true) {
    const baseData = JSON.parse(super.exportToJSON(false));
    baseData.customMetrics = this.customMetrics;
    return pretty ? JSON.stringify(baseData, null, 2) : JSON.stringify(baseData);
  }
}
```

### Audio Recording Integration

```javascript
// Frontend: Capture spoken responses with Web Audio API

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start();
  }

  async stopRecording() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Transcribe audio (using a service like Google Speech-to-Text)
        const transcription = await this.transcribeAudio(audioBlob);

        resolve({
          audioBlob,
          audioUrl,
          transcription,
          duration: this.calculateDuration()
        });

        this.audioChunks = [];
      };

      this.mediaRecorder.stop();
    });
  }

  async transcribeAudio(audioBlob) {
    // Integration with speech-to-text service
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.transcription;
  }

  calculateDuration() {
    // Calculate recording duration
    return Math.floor(this.audioChunks.length / 10); // Approximate
  }
}

// Usage in frontend
const recorder = new AudioRecorder();

async function handleSpokenExercise() {
  await recorder.startRecording();

  // User speaks...

  const audioData = await recorder.stopRecording();

  // Submit to module
  const result = await fetch(`/api/session/${sessionId}/response`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'spoken',
      data: audioData
    })
  });
}
```

---

## Production Considerations

### 1. Session Persistence

Use Redis or a database to persist sessions across server restarts.

### 2. File Storage

Store audio files and exports in cloud storage (AWS S3, Google Cloud Storage).

### 3. Scalability

- Use a queue system (RabbitMQ, Redis) for processing scoring
- Implement caching for scenario data
- Use CDN for static assets

### 4. Security

- Validate and sanitize all user inputs
- Implement rate limiting
- Use HTTPS for all communications
- Encrypt sensitive data at rest

### 5. Monitoring

- Log all session activities
- Monitor API response times
- Track error rates
- Set up alerts for failures

---

## Testing

### Unit Tests Example

```javascript
const assert = require('assert');
const CustomerServiceModule = require('../src/module/CustomerServiceModule');

describe('CustomerServiceModule', () => {
  it('should start a session', () => {
    const module = new CustomerServiceModule();
    const session = module.startSession('test_user', 'B1');

    assert.strictEqual(session.cefrLevel, 'B1');
    assert.strictEqual(session.userId, 'test_user');
    assert.ok(session.sessionId);
  });

  it('should submit a text response', () => {
    const module = new CustomerServiceModule();
    module.startSession('test_user', 'A1');
    module.selectScenario('A1_GREETING');

    const result = module.submitResponse('text_input', 'Hello, how can I help you?');

    assert.strictEqual(result.responseRecorded, true);
  });
});
```

---

## Conclusion

This implementation guide covers the main integration scenarios. Adapt the examples to your specific needs and environment.

For more details, see the [API Documentation](API.md).
