/**
 * Type definitions for the Customer Service Module
 */

/**
 * CEFR Levels
 * @typedef {'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'} CEFRLevel
 */

/**
 * Response types
 * @typedef {'multiple_choice' | 'text_input' | 'spoken'} ResponseType
 */

/**
 * Exercise difficulty
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 */

/**
 * Customer service scenario
 * @typedef {Object} Scenario
 * @property {string} id - Unique scenario identifier
 * @property {CEFRLevel} cefrLevel - Target CEFR level
 * @property {string} title - Scenario title
 * @property {string} context - Background information
 * @property {string} customerProfile - Customer personality/mood
 * @property {string} situation - The customer's issue/request
 * @property {Array<Exercise>} exercises - List of exercises in this scenario
 * @property {Array<string>} learningObjectives - What the learner should demonstrate
 */

/**
 * Exercise definition
 * @typedef {Object} Exercise
 * @property {string} id - Unique exercise identifier
 * @property {ResponseType} type - Type of response required
 * @property {string} prompt - What the customer says/asks
 * @property {string} instruction - Instructions for the learner
 * @property {Object} config - Exercise-specific configuration
 * @property {Array<string>} expectedElements - Key elements expected in response
 * @property {number} timeLimit - Time limit in seconds (optional)
 */

/**
 * User response data
 * @typedef {Object} UserResponse
 * @property {string} exerciseId - Reference to exercise
 * @property {ResponseType} type - Type of response
 * @property {string|number} value - The actual response content
 * @property {number} timestamp - When response was given
 * @property {number} timeSpent - Seconds spent on exercise
 * @property {number} attemptNumber - Number of attempts
 * @property {Object} metadata - Additional response metadata
 */

/**
 * Session data for export
 * @typedef {Object} SessionData
 * @property {string} sessionId - Unique session identifier
 * @property {string} userId - User identifier
 * @property {CEFRLevel} cefrLevel - Selected CEFR level
 * @property {string} scenarioId - Completed scenario ID
 * @property {Date} startTime - Session start time
 * @property {Date} endTime - Session end time
 * @property {Array<UserResponse>} responses - All user responses
 * @property {Object} behaviorMetrics - User behavior data
 * @property {string} status - Session status (completed, partial, abandoned)
 */

module.exports = {
  // Export for documentation purposes
};
