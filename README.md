# English Customer Service Module

An immersive, interactive customer service simulation for English language assessment across all CEFR levels (A1-C2).

## Overview

This module provides a realistic customer service experience where learners interact with virtual customers through various communication channels. All interactions are tracked and exported in JSON format for automated scoring.

## Features

- **CEFR-Adapted Scenarios**: Exercises tailored for levels A1 through C2
- **Multiple Interaction Types**:
  - Multiple choice responses
  - Written text input
  - Simulated spoken responses
- **Comprehensive Tracking**: All user behaviors and responses recorded
- **JSON Export**: Structured data output for external scoring agents
- **Immersive Scenarios**: Realistic customer service situations

## Project Structure

```
/
├── src/
│   ├── scenarios/          # Customer service scenarios by CEFR level
│   ├── exercises/          # Exercise type implementations
│   ├── module/             # Core module logic
│   └── utils/              # Utility functions
├── data/                   # JSON data files
├── examples/               # Usage examples
└── README.md
```

## CEFR Level Descriptions

- **A1**: Basic greetings, simple requests
- **A2**: Simple customer queries, basic problem-solving
- **B1**: Complex situations requiring explanations
- **B2**: Complaint handling, detailed responses
- **C1**: Complex negotiations, nuanced communication
- **C2**: Advanced problem-solving with idiomatic expressions

## Usage

See `/examples` directory for implementation examples.

## Output Format

All responses are exported in JSON format with:
- User metadata
- Scenario information
- Response data (timing, content, corrections)
- Behavioral metrics

## License

MIT
