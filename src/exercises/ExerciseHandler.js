/**
 * Exercise Handler - Manages different types of customer service exercises
 */

class ExerciseHandler {
  constructor() {
    this.currentExercise = null;
    this.startTime = null;
    this.responses = [];
  }

  /**
   * Initialize an exercise
   * @param {Object} exercise - Exercise configuration
   */
  startExercise(exercise) {
    this.currentExercise = exercise;
    this.startTime = Date.now();

    return {
      exerciseId: exercise.id,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      config: exercise.config,
      timeLimit: exercise.timeLimit
    };
  }

  /**
   * Process a multiple choice response
   * @param {string} selectedOption - The option ID selected by user
   * @returns {Object} Response data
   */
  handleMultipleChoiceResponse(selectedOption) {
    if (!this.currentExercise || this.currentExercise.type !== 'multiple_choice') {
      throw new Error('Invalid exercise type for multiple choice response');
    }

    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    const selectedOptionData = this.currentExercise.config.options.find(
      opt => opt.id === selectedOption
    );

    const response = {
      exerciseId: this.currentExercise.id,
      type: 'multiple_choice',
      value: selectedOption,
      selectedText: selectedOptionData ? selectedOptionData.text : '',
      timestamp: Date.now(),
      timeSpent: timeSpent,
      attemptNumber: 1,
      metadata: {
        allOptions: this.currentExercise.config.options,
        expectedElements: this.currentExercise.expectedElements,
        withinTimeLimit: timeSpent <= this.currentExercise.timeLimit
      }
    };

    this.responses.push(response);
    return response;
  }

  /**
   * Process a text input response
   * @param {string} textContent - The user's written response
   * @returns {Object} Response data
   */
  handleTextInputResponse(textContent) {
    if (!this.currentExercise || this.currentExercise.type !== 'text_input') {
      throw new Error('Invalid exercise type for text input response');
    }

    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    const wordCount = textContent.trim().split(/\s+/).length;
    const charCount = textContent.length;

    const response = {
      exerciseId: this.currentExercise.id,
      type: 'text_input',
      value: textContent,
      timestamp: Date.now(),
      timeSpent: timeSpent,
      attemptNumber: 1,
      metadata: {
        wordCount: wordCount,
        charCount: charCount,
        expectedElements: this.currentExercise.expectedElements,
        withinTimeLimit: timeSpent <= this.currentExercise.timeLimit,
        meetsMinLength: charCount >= (this.currentExercise.config.minLength || 0),
        meetsMaxLength: charCount <= (this.currentExercise.config.maxLength || Infinity)
      }
    };

    this.responses.push(response);
    return response;
  }

  /**
   * Process a spoken response (simulated with transcription)
   * @param {Object} spokenData - Object containing transcription and audio metadata
   * @returns {Object} Response data
   */
  handleSpokenResponse(spokenData) {
    if (!this.currentExercise || this.currentExercise.type !== 'spoken') {
      throw new Error('Invalid exercise type for spoken response');
    }

    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

    const response = {
      exerciseId: this.currentExercise.id,
      type: 'spoken',
      value: spokenData.transcription || spokenData.text,
      timestamp: Date.now(),
      timeSpent: timeSpent,
      attemptNumber: 1,
      metadata: {
        audioData: {
          duration: spokenData.duration || 0,
          audioUrl: spokenData.audioUrl || null,
          audioBlob: spokenData.audioBlob || null
        },
        transcription: spokenData.transcription || spokenData.text,
        expectedElements: this.currentExercise.expectedElements,
        withinTimeLimit: timeSpent <= this.currentExercise.timeLimit,
        withinDurationLimit: (spokenData.duration || 0) <= (this.currentExercise.config.recordingTimeLimit || Infinity),
        expectedDuration: this.currentExercise.config.expectedDuration
      }
    };

    this.responses.push(response);
    return response;
  }

  /**
   * Get all responses collected so far
   * @returns {Array} All responses
   */
  getAllResponses() {
    return this.responses;
  }

  /**
   * Reset the handler for a new session
   */
  reset() {
    this.currentExercise = null;
    this.startTime = null;
    this.responses = [];
  }
}

module.exports = ExerciseHandler;
