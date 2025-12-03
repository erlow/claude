/**
 * Basic Usage Example - Customer Service Module
 *
 * This example demonstrates a complete workflow:
 * 1. Starting a session
 * 2. Selecting a scenario
 * 3. Answering exercises
 * 4. Exporting results to JSON
 */

const CustomerServiceModule = require('../src/module/CustomerServiceModule');

async function runBasicExample() {
  console.log('=== Customer Service Module - Basic Usage Example ===\n');

  // Initialize the module
  const module = new CustomerServiceModule();

  // 1. Start a session for a B1 level user
  console.log('1. Starting session for user "student_123" at B1 level...');
  const sessionInfo = module.startSession('student_123', 'B1');
  console.log(`   Session ID: ${sessionInfo.sessionId}`);
  console.log(`   Available scenarios: ${sessionInfo.availableScenarios.length}\n`);

  // Display available scenarios
  console.log('   Available scenarios for B1:');
  sessionInfo.availableScenarios.forEach((scenario, index) => {
    console.log(`   ${index + 1}. ${scenario.title} (${scenario.exerciseCount} exercises)`);
  });
  console.log('');

  // 2. Select a scenario
  console.log('2. Selecting scenario: "Resolving a Delivery Issue"...');
  const scenarioData = module.selectScenario('B1_PROBLEM_SOLVING');
  console.log(`   Scenario: ${scenarioData.scenario.title}`);
  console.log(`   Context: ${scenarioData.scenario.context}`);
  console.log(`   Customer: ${scenarioData.scenario.customerProfile}`);
  console.log(`   Total exercises: ${scenarioData.scenario.totalExercises}\n`);

  // 3. Complete Exercise 1 (Spoken response)
  console.log('3. Exercise 1: Spoken Response');
  const exercise1 = scenarioData.firstExercise;
  console.log(`   Customer says: "${exercise1.prompt}"`);
  console.log(`   Instruction: ${exercise1.instruction}`);
  console.log(`   Type: ${exercise1.type}\n`);

  // Simulate spoken response
  console.log('   User responds (simulated speech-to-text):');
  const spokenResponse = {
    transcription: "I'm very sorry to hear that your package hasn't arrived yet. I completely understand how frustrating this must be. Let me look into this right away and find out what's happening with your delivery.",
    duration: 12,
    audioUrl: 'simulated_audio_url.mp3',
    audioBlob: null
  };
  console.log(`   "${spokenResponse.transcription}"`);
  console.log(`   Duration: ${spokenResponse.duration} seconds\n`);

  const result1 = module.submitResponse('spoken', spokenResponse);
  console.log(`   ✓ Response recorded (${result1.currentExerciseNumber}/${result1.totalExercises})\n`);

  // 4. Complete Exercise 2 (Text input)
  console.log('4. Exercise 2: Text Input');
  const exercise2 = result1.nextExercise;
  console.log(`   Customer says: "${exercise2.prompt}"`);
  console.log(`   Instruction: ${exercise2.instruction}\n`);

  const textResponse = `I completely understand your frustration, and I sincerely apologize for this inconvenience. Let me offer you a few options to make this right:

1. I can expedite a replacement order that will arrive by tomorrow at no additional cost
2. I can issue a partial refund of 20% while we track down your original package
3. I can upgrade your order to express shipping for free on your next purchase

Additionally, I'll personally monitor your delivery and send you updates every 4 hours. Which option would work best for you?`;

  console.log('   User types response:');
  console.log(`   "${textResponse.substring(0, 100)}..."\n`);

  const result2 = module.submitResponse('text_input', textResponse);
  console.log(`   ✓ Response recorded (${result2.currentExerciseNumber}/${result2.totalExercises})\n`);

  // 5. Complete Exercise 3 (Multiple choice)
  console.log('5. Exercise 3: Multiple Choice');
  const exercise3 = result2.nextExercise;
  console.log(`   Customer says: "${exercise3.prompt}"`);
  console.log(`   Options:`);
  exercise3.config.options.forEach(opt => {
    console.log(`   ${opt.id.toUpperCase()}) ${opt.text}`);
  });
  console.log('');

  console.log('   User selects option D');
  const result3 = module.submitResponse('multiple_choice', 'd');
  console.log(`   ✓ Response recorded (${result3.currentExerciseNumber}/${result3.totalExercises})`);
  console.log(`   ✓ Scenario completed: ${result3.scenarioCompleted}\n`);

  // 6. Track some user behaviors
  console.log('6. Tracking user behaviors...');
  module.trackBehavior('pause', { duration: 5 });
  module.trackBehavior('correction', { exerciseId: 'B1_DELIVERY_E2' });
  console.log('   ✓ Behaviors tracked\n');

  // 7. Complete the session
  console.log('7. Completing session...');
  const sessionData = module.completeSession('completed');
  console.log(`   ✓ Session completed`);
  console.log(`   Duration: ${sessionData.duration} seconds`);
  console.log(`   Total responses: ${sessionData.responses.length}`);
  console.log(`   Average response time: ${sessionData.behaviorMetrics.averageResponseTime.toFixed(2)} seconds\n`);

  // 8. Export to JSON
  console.log('8. Exporting session data to JSON...');
  const jsonData = module.exportSessionJSON(true);
  console.log(`   ✓ JSON generated (${jsonData.length} characters)`);
  console.log(`   First 500 characters of JSON:`);
  console.log(`   ${jsonData.substring(0, 500)}...\n`);

  // 9. Save to file
  console.log('9. Saving to file...');
  const exportPath = `/tmp/session_${sessionData.sessionId}.json`;
  const exportResult = await module.exportSessionToFile(exportPath);

  if (exportResult.success) {
    console.log(`   ✓ Session data exported to: ${exportResult.filePath}`);
    console.log(`   File size: ${exportResult.size} bytes\n`);
  } else {
    console.log(`   ✗ Export failed: ${exportResult.error}\n`);
  }

  // 10. Display summary
  console.log('=== Session Summary ===');
  console.log(`Session ID: ${sessionData.sessionId}`);
  console.log(`User: ${sessionData.userId}`);
  console.log(`CEFR Level: ${sessionData.cefrLevel}`);
  console.log(`Scenario: ${sessionData.scenarioId}`);
  console.log(`Status: ${sessionData.status}`);
  console.log(`Exercises completed: ${sessionData.summary.totalExercises}`);
  console.log(`Exercise types: ${JSON.stringify(sessionData.summary.exercisesByType)}`);
  console.log(`Average time per exercise: ${sessionData.summary.averageTimePerExercise.toFixed(2)}s`);
  console.log(`Pauses: ${sessionData.behaviorMetrics.pauseCount}`);
  console.log(`Corrections: ${sessionData.behaviorMetrics.correctionsMade}`);

  console.log('\n=== Example Complete ===');
}

// Run the example
if (require.main === module) {
  runBasicExample().catch(console.error);
}

module.exports = runBasicExample;
