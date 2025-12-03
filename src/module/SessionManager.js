/**
 * Session Manager - Tracks user session, behavior, and exports data
 */

const crypto = require('crypto');

class SessionManager {
  constructor(userId, cefrLevel) {
    this.sessionId = this.generateSessionId();
    this.userId = userId;
    this.cefrLevel = cefrLevel;
    this.scenarioId = null;
    this.startTime = new Date();
    this.endTime = null;
    this.responses = [];
    this.behaviorMetrics = {
      totalTimeSpent: 0,
      averageResponseTime: 0,
      pauseCount: 0,
      pauseDurations: [],
      correctionsMade: 0,
      hesitationMarkers: 0,
      navigationType: [], // back, forward, jump
      interactionPattern: [] // timeline of user actions
    };
    this.status = 'active';
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Set the current scenario
   * @param {string} scenarioId - ID of the scenario being used
   */
  setScenario(scenarioId) {
    this.scenarioId = scenarioId;
  }

  /**
   * Add a response to the session
   * @param {Object} response - Response data from ExerciseHandler
   */
  addResponse(response) {
    this.responses.push(response);
    this.updateBehaviorMetrics(response);
  }

  /**
   * Track user behavior and interaction patterns
   * @param {string} action - Type of action (pause, correction, navigation, etc.)
   * @param {Object} data - Additional data about the action
   */
  trackBehavior(action, data = {}) {
    const timestamp = Date.now();

    this.behaviorMetrics.interactionPattern.push({
      action,
      timestamp,
      data
    });

    switch (action) {
      case 'pause':
        this.behaviorMetrics.pauseCount++;
        if (data.duration) {
          this.behaviorMetrics.pauseDurations.push(data.duration);
        }
        break;

      case 'correction':
        this.behaviorMetrics.correctionsMade++;
        break;

      case 'hesitation':
        this.behaviorMetrics.hesitationMarkers++;
        break;

      case 'navigation':
        this.behaviorMetrics.navigationType.push(data.type);
        break;
    }
  }

  /**
   * Update behavior metrics based on response
   * @param {Object} response - Response data
   */
  updateBehaviorMetrics(response) {
    // Update total time spent
    this.behaviorMetrics.totalTimeSpent += response.timeSpent;

    // Calculate average response time
    if (this.responses.length > 0) {
      const totalResponseTime = this.responses.reduce((sum, r) => sum + r.timeSpent, 0);
      this.behaviorMetrics.averageResponseTime = totalResponseTime / this.responses.length;
    }
  }

  /**
   * Complete the session
   * @param {string} status - Final status (completed, partial, abandoned)
   */
  completeSession(status = 'completed') {
    this.endTime = new Date();
    this.status = status;
  }

  /**
   * Export session data as JSON
   * @param {boolean} pretty - Whether to format JSON with indentation
   * @returns {string} JSON string of session data
   */
  exportToJSON(pretty = true) {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      cefrLevel: this.cefrLevel,
      scenarioId: this.scenarioId,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime ? this.endTime.toISOString() : null,
      duration: this.endTime ? Math.floor((this.endTime - this.startTime) / 1000) : null,
      status: this.status,
      responses: this.responses,
      behaviorMetrics: {
        ...this.behaviorMetrics,
        averagePauseDuration: this.behaviorMetrics.pauseDurations.length > 0
          ? this.behaviorMetrics.pauseDurations.reduce((a, b) => a + b, 0) / this.behaviorMetrics.pauseDurations.length
          : 0,
        totalInteractions: this.behaviorMetrics.interactionPattern.length
      },
      summary: {
        totalExercises: this.responses.length,
        exercisesByType: this.getExerciseCountByType(),
        averageTimePerExercise: this.responses.length > 0
          ? this.behaviorMetrics.totalTimeSpent / this.responses.length
          : 0,
        completionRate: this.calculateCompletionRate()
      }
    };

    return pretty ? JSON.stringify(sessionData, null, 2) : JSON.stringify(sessionData);
  }

  /**
   * Get count of exercises by type
   * @returns {Object} Count of each exercise type
   */
  getExerciseCountByType() {
    return this.responses.reduce((acc, response) => {
      acc[response.type] = (acc[response.type] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calculate completion rate
   * @returns {number} Completion rate as percentage
   */
  calculateCompletionRate() {
    // This would normally compare responses to total exercises in scenario
    // For now, return 100 if status is completed
    return this.status === 'completed' ? 100 : (this.responses.length > 0 ? 50 : 0);
  }

  /**
   * Export to file
   * @param {string} filePath - Path to save JSON file
   * @returns {Promise} Promise that resolves when file is written
   */
  async exportToFile(filePath) {
    const fs = require('fs').promises;
    const jsonData = this.exportToJSON(true);

    try {
      await fs.writeFile(filePath, jsonData, 'utf8');
      return { success: true, filePath, size: jsonData.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get session data as object
   * @returns {Object} Session data object
   */
  getSessionData() {
    return JSON.parse(this.exportToJSON(false));
  }
}

module.exports = SessionManager;
