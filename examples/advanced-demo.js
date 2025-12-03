/**
 * Advanced Demo - Customer Service Module
 *
 * This demonstrates advanced features:
 * - Multiple CEFR levels
 * - Behavior tracking
 * - Session management
 * - JSON export and analysis
 */

const CustomerServiceModule = require('../src/module/CustomerServiceModule');
const fs = require('fs').promises;

async function runAdvancedDemo() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   Customer Service Module - Advanced Demonstration       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // Display all CEFR levels
  console.log('📚 Available CEFR Levels:\n');
  const levels = CustomerServiceModule.getCEFRLevels();
  levels.forEach(level => {
    console.log(`  ${level.level} - ${level.name}`);
    console.log(`  ${level.description}`);
    console.log(`  Skills: ${level.skills.join(', ')}`);
    console.log('');
  });

  // Run sessions for different levels
  await runSessionDemo('A1', 'A1_GREETING');
  console.log('\n' + '='.repeat(60) + '\n');
  await runSessionDemo('C1', 'C1_NEGOTIATION');

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   All Demos Complete!                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
}

async function runSessionDemo(cefrLevel, scenarioId) {
  console.log(`🎯 Starting ${cefrLevel} Level Session Demo\n`);

  const module = new CustomerServiceModule();

  // 1. Start session
  const session = module.startSession(`demo_user_${cefrLevel}`, cefrLevel);
  console.log(`✓ Session started: ${session.sessionId}`);
  console.log(`  Level: ${cefrLevel}`);
  console.log(`  User: ${session.userId}\n`);

  // 2. Display available scenarios
  console.log(`📋 Available scenarios for ${cefrLevel}:`);
  session.availableScenarios.forEach((scenario, index) => {
    console.log(`  ${index + 1}. ${scenario.title}`);
    console.log(`     Context: ${scenario.context}`);
    console.log(`     Exercises: ${scenario.exerciseCount}`);
    console.log(`     Objectives: ${scenario.learningObjectives.join(', ')}`);
    console.log('');
  });

  // 3. Select scenario
  console.log(`🎬 Selecting scenario: ${scenarioId}\n`);
  const scenarioData = module.selectScenario(scenarioId);

  console.log(`  Scenario: ${scenarioData.scenario.title}`);
  console.log(`  Customer: ${scenarioData.scenario.customerProfile}`);
  console.log(`  Situation: ${scenarioData.scenario.situation}`);
  console.log(`  Total exercises: ${scenarioData.scenario.totalExercises}\n`);

  // 4. Complete all exercises
  let currentExercise = scenarioData.firstExercise;
  let exerciseNum = 1;

  while (currentExercise) {
    console.log(`📝 Exercise ${exerciseNum}/${scenarioData.scenario.totalExercises}`);
    console.log(`   Type: ${currentExercise.type}`);
    console.log(`   Customer: "${currentExercise.prompt}"`);
    console.log(`   Task: ${currentExercise.instruction}`);

    // Simulate realistic user behavior
    await simulateThinking(1000, 3000);

    let response;
    switch (currentExercise.type) {
      case 'multiple_choice':
        const optionId = currentExercise.config.options[0].id;
        response = module.submitResponse('multiple_choice', optionId);
        console.log(`   ✓ Selected option: ${optionId}\n`);
        break;

      case 'text_input':
        const textResponse = generateSampleResponse(cefrLevel, currentExercise);
        // Track typing behavior
        await simulateTyping(textResponse, module);
        response = module.submitResponse('text_input', textResponse);
        console.log(`   ✓ Submitted text (${textResponse.length} chars)\n`);
        break;

      case 'spoken':
        const spokenResponse = {
          transcription: generateSampleResponse(cefrLevel, currentExercise),
          duration: Math.floor(Math.random() * 20) + 10,
          audioUrl: `audio_${exerciseNum}.mp3`
        };
        response = module.submitResponse('spoken', spokenResponse);
        console.log(`   ✓ Recorded response (${spokenResponse.duration}s)\n`);
        break;
    }

    // Occasionally track behaviors
    if (Math.random() > 0.7) {
      module.trackBehavior('pause', { duration: Math.floor(Math.random() * 5) + 2 });
      console.log('   ⏸️  User paused to think\n');
    }

    currentExercise = response.nextExercise;
    exerciseNum++;
  }

  // 5. Complete session and export
  console.log('🏁 Completing session...\n');
  const sessionData = module.completeSession('completed');

  console.log('📊 Session Statistics:');
  console.log(`   Duration: ${sessionData.duration}s`);
  console.log(`   Exercises completed: ${sessionData.summary.totalExercises}`);
  console.log(`   Exercise types:`, sessionData.summary.exercisesByType);
  console.log(`   Average time per exercise: ${sessionData.summary.averageTimePerExercise.toFixed(1)}s`);
  console.log(`   Pauses: ${sessionData.behaviorMetrics.pauseCount}`);
  console.log(`   Corrections: ${sessionData.behaviorMetrics.correctionsMade}\n`);

  // 6. Export to file
  const exportDir = './data/exports';
  try {
    await fs.mkdir(exportDir, { recursive: true });
  } catch (err) {
    // Directory exists
  }

  const exportPath = `${exportDir}/session_${cefrLevel}_${Date.now()}.json`;
  const exportResult = await module.exportSessionToFile(exportPath);

  if (exportResult.success) {
    console.log(`💾 Session exported:`);
    console.log(`   File: ${exportResult.filePath}`);
    console.log(`   Size: ${(exportResult.size / 1024).toFixed(2)} KB\n`);

    // 7. Analyze the exported data
    await analyzeSessionData(exportPath);
  }
}

async function analyzeSessionData(filePath) {
  console.log('🔍 Analyzing session data...\n');

  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

  console.log('📈 Detailed Analysis:');

  // Response analysis
  const responseTypes = {};
  data.responses.forEach(r => {
    responseTypes[r.type] = (responseTypes[r.type] || 0) + 1;
  });

  console.log(`   Total responses: ${data.responses.length}`);
  Object.entries(responseTypes).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count}`);
  });

  // Timing analysis
  const timings = data.responses.map(r => r.timeSpent);
  const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
  const minTime = Math.min(...timings);
  const maxTime = Math.max(...timings);

  console.log(`\n   Timing Analysis:`);
  console.log(`   - Average: ${avgTime.toFixed(1)}s`);
  console.log(`   - Fastest: ${minTime}s`);
  console.log(`   - Slowest: ${maxTime}s`);

  // Behavior analysis
  if (data.behaviorMetrics.pauseCount > 0) {
    console.log(`\n   Behavior Patterns:`);
    console.log(`   - Pauses: ${data.behaviorMetrics.pauseCount}`);
    console.log(`   - Avg pause duration: ${data.behaviorMetrics.averagePauseDuration.toFixed(1)}s`);
  }

  // Content analysis (for text responses)
  const textResponses = data.responses.filter(r => r.type === 'text_input' || r.type === 'spoken');
  if (textResponses.length > 0) {
    const totalWords = textResponses.reduce((sum, r) => {
      return sum + (r.metadata.wordCount || r.value.split(/\s+/).length);
    }, 0);
    const avgWords = totalWords / textResponses.length;

    console.log(`\n   Content Analysis:`);
    console.log(`   - Text/Spoken responses: ${textResponses.length}`);
    console.log(`   - Average words per response: ${avgWords.toFixed(1)}`);
    console.log(`   - Total words produced: ${totalWords}`);
  }

  console.log('');
}

function generateSampleResponse(cefrLevel, exercise) {
  const responses = {
    A1: [
      "Hello! How can I help you?",
      "Yes, I can help you with that.",
      "The bathroom is over there, next to the elevator."
    ],
    A2: [
      "I recommend this smartphone. It has a good camera and the battery lasts a long time.",
      "We can make an appointment for Tuesday afternoon at 2pm or 4pm."
    ],
    B1: [
      "I'm very sorry to hear about the delay. Let me check the tracking information right away and find out what's happening with your delivery.",
      "I understand your frustration completely. I can offer you expedited shipping on a replacement order, or we can issue a refund if you prefer."
    ],
    C1: [
      "I appreciate your candor, and I want to address each of your concerns directly. While our competitors may offer lower rates, I'd like to discuss the unique value we've provided over our three-year partnership.",
      "What I can commit to immediately is a dedicated senior team lead reporting to both CTOs, bi-weekly executive reviews, and a 20% credit this quarter plus additional service credits next quarter."
    ],
    C2: [
      "I want to begin by acknowledging the gravity of this situation and taking full accountability. The service failures you've identified are unacceptable, and I understand why you're considering termination.",
      "While I respect your position, this request touches on fundamental principles that are central to our company's values and market position. However, I believe we can find an alternative approach that addresses your security needs while maintaining our commitment to privacy."
    ]
  };

  const levelResponses = responses[cefrLevel] || responses.B1;
  return levelResponses[Math.floor(Math.random() * levelResponses.length)];
}

async function simulateThinking(minMs, maxMs) {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function simulateTyping(text, module) {
  // Simulate typing with occasional corrections
  if (Math.random() > 0.8) {
    module.trackBehavior('correction', { text: text.substring(0, 10) });
  }

  await simulateThinking(500, 1500);
}

// Run the demo
if (require.main === module) {
  runAdvancedDemo().catch(console.error);
}

module.exports = runAdvancedDemo;
