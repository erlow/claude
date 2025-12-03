/**
 * Customer Service Module - Main class for the immersive customer service experience
 */

const scenarios = require('../scenarios/scenariosData');
const ExerciseHandler = require('../exercises/ExerciseHandler');
const SessionManager = require('./SessionManager');

class CustomerServiceModule {
  constructor() {
    this.currentSession = null;
    this.exerciseHandler = new ExerciseHandler();
    this.currentScenario = null;
    this.currentExerciseIndex = 0;
  }

  /**
   * Start a new session
   * @param {string} userId - User identifier
   * @param {string} cefrLevel - CEFR level (A1, A2, B1, B2, C1, C2)
   * @returns {Object} Session information
   */
  startSession(userId, cefrLevel) {
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cefrLevel)) {
      throw new Error(`Invalid CEFR level: ${cefrLevel}. Must be A1, A2, B1, B2, C1, or C2`);
    }

    this.currentSession = new SessionManager(userId, cefrLevel);

    return {
      sessionId: this.currentSession.sessionId,
      userId: userId,
      cefrLevel: cefrLevel,
      availableScenarios: this.getAvailableScenarios(cefrLevel)
    };
  }

  /**
   * Get available scenarios for a CEFR level
   * @param {string} cefrLevel - CEFR level
   * @returns {Array} List of available scenarios
   */
  getAvailableScenarios(cefrLevel) {
    const levelScenarios = scenarios[cefrLevel] || [];

    return levelScenarios.map(scenario => ({
      id: scenario.id,
      title: scenario.title,
      context: scenario.context,
      learningObjectives: scenario.learningObjectives,
      exerciseCount: scenario.exercises.length
    }));
  }

  /**
   * Select and start a scenario
   * @param {string} scenarioId - ID of the scenario to start
   * @returns {Object} Scenario details and first exercise
   */
  selectScenario(scenarioId) {
    if (!this.currentSession) {
      throw new Error('No active session. Call startSession() first.');
    }

    // Find the scenario
    const levelScenarios = scenarios[this.currentSession.cefrLevel] || [];
    this.currentScenario = levelScenarios.find(s => s.id === scenarioId);

    if (!this.currentScenario) {
      throw new Error(`Scenario ${scenarioId} not found for level ${this.currentSession.cefrLevel}`);
    }

    this.currentSession.setScenario(scenarioId);
    this.currentExerciseIndex = 0;

    return {
      scenario: {
        id: this.currentScenario.id,
        title: this.currentScenario.title,
        context: this.currentScenario.context,
        customerProfile: this.currentScenario.customerProfile,
        situation: this.currentScenario.situation,
        totalExercises: this.currentScenario.exercises.length
      },
      firstExercise: this.getCurrentExercise()
    };
  }

  /**
   * Get the current exercise
   * @returns {Object} Current exercise data
   */
  getCurrentExercise() {
    if (!this.currentScenario) {
      throw new Error('No scenario selected. Call selectScenario() first.');
    }

    if (this.currentExerciseIndex >= this.currentScenario.exercises.length) {
      return null; // All exercises completed
    }

    const exercise = this.currentScenario.exercises[this.currentExerciseIndex];
    return this.exerciseHandler.startExercise(exercise);
  }

  /**
   * Submit a response to the current exercise
   * @param {string} responseType - Type of response (multiple_choice, text_input, spoken)
   * @param {*} responseData - The response data
   * @returns {Object} Response result and next exercise
   */
  submitResponse(responseType, responseData) {
    if (!this.currentScenario) {
      throw new Error('No scenario selected.');
    }

    let response;

    switch (responseType) {
      case 'multiple_choice':
        response = this.exerciseHandler.handleMultipleChoiceResponse(responseData);
        break;

      case 'text_input':
        response = this.exerciseHandler.handleTextInputResponse(responseData);
        break;

      case 'spoken':
        response = this.exerciseHandler.handleSpokenResponse(responseData);
        break;

      default:
        throw new Error(`Unknown response type: ${responseType}`);
    }

    // Add response to session
    this.currentSession.addResponse(response);

    // Move to next exercise
    this.currentExerciseIndex++;

    const hasMoreExercises = this.currentExerciseIndex < this.currentScenario.exercises.length;

    return {
      responseRecorded: true,
      currentExerciseNumber: this.currentExerciseIndex,
      totalExercises: this.currentScenario.exercises.length,
      hasMoreExercises: hasMoreExercises,
      nextExercise: hasMoreExercises ? this.getCurrentExercise() : null,
      scenarioCompleted: !hasMoreExercises
    };
  }

  /**
   * Track a user behavior event
   * @param {string} action - Action type
   * @param {Object} data - Action data
   */
  trackBehavior(action, data = {}) {
    if (this.currentSession) {
      this.currentSession.trackBehavior(action, data);
    }
  }

  /**
   * Complete the current session
   * @param {string} status - Completion status
   * @returns {Object} Session data
   */
  completeSession(status = 'completed') {
    if (!this.currentSession) {
      throw new Error('No active session to complete.');
    }

    this.currentSession.completeSession(status);
    return this.currentSession.getSessionData();
  }

  /**
   * Export session data to JSON
   * @param {boolean} pretty - Whether to format JSON
   * @returns {string} JSON string
   */
  exportSessionJSON(pretty = true) {
    if (!this.currentSession) {
      throw new Error('No active session to export.');
    }

    return this.currentSession.exportToJSON(pretty);
  }

  /**
   * Export session data to file
   * @param {string} filePath - Path to save file
   * @returns {Promise} Promise with export result
   */
  async exportSessionToFile(filePath) {
    if (!this.currentSession) {
      throw new Error('No active session to export.');
    }

    return await this.currentSession.exportToFile(filePath);
  }

  /**
   * Get current session information
   * @returns {Object} Session info
   */
  getSessionInfo() {
    if (!this.currentSession) {
      return null;
    }

    return {
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
      cefrLevel: this.currentSession.cefrLevel,
      scenarioId: this.currentSession.scenarioId,
      currentExercise: this.currentExerciseIndex + 1,
      totalExercises: this.currentScenario ? this.currentScenario.exercises.length : 0,
      responsesRecorded: this.currentSession.responses.length,
      status: this.currentSession.status
    };
  }

  /**
   * Reset the module for a new session
   */
  reset() {
    this.currentSession = null;
    this.exerciseHandler.reset();
    this.currentScenario = null;
    this.currentExerciseIndex = 0;
  }

  /**
   * Get all available CEFR levels with descriptions
   * @returns {Array} CEFR levels information
   */
  static getCEFRLevels() {
    return [
      {
        level: 'A1',
        name: 'Beginner',
        description: 'Can understand and use familiar everyday expressions and very basic phrases',
        skills: ['Basic greetings', 'Simple requests', 'Elementary phrases']
      },
      {
        level: 'A2',
        name: 'Elementary',
        description: 'Can communicate in simple and routine tasks requiring direct exchange of information',
        skills: ['Simple customer queries', 'Basic problem-solving', 'Routine situations']
      },
      {
        level: 'B1',
        name: 'Intermediate',
        description: 'Can deal with most situations likely to arise whilst working in customer service',
        skills: ['Handle concerns', 'Explain processes', 'Offer solutions', 'Show empathy']
      },
      {
        level: 'B2',
        name: 'Upper Intermediate',
        description: 'Can interact with a degree of fluency and spontaneity in demanding customer situations',
        skills: ['De-escalate conflicts', 'Complex explanations', 'Negotiate solutions', 'Professional communication']
      },
      {
        level: 'C1',
        name: 'Advanced',
        description: 'Can express ideas fluently and handle complex, high-stakes customer interactions',
        skills: ['Strategic communication', 'Crisis management', 'Complex negotiations', 'Nuanced language']
      },
      {
        level: 'C2',
        name: 'Proficient',
        description: 'Can handle the most demanding customer situations with precision and sophistication',
        skills: ['Executive communication', 'Ethical dilemmas', 'High-stakes situations', 'Advanced persuasion']
      }
    ];
  }
}

module.exports = CustomerServiceModule;
