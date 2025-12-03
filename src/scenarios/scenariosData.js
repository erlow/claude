/**
 * Customer Service Scenarios for all CEFR Levels
 * Each scenario contains realistic customer service situations adapted to proficiency level
 */

const scenarios = {
  // ============= A1 LEVEL =============
  A1: [
    {
      id: 'A1_GREETING',
      cefrLevel: 'A1',
      title: 'Welcoming a Customer',
      context: 'You work at a hotel reception desk. A customer walks in.',
      customerProfile: 'Friendly tourist who needs help',
      situation: 'Customer enters and looks around',
      learningObjectives: [
        'Use basic greetings',
        'Ask simple questions',
        'Provide basic help'
      ],
      exercises: [
        {
          id: 'A1_GREETING_E1',
          type: 'multiple_choice',
          prompt: 'Customer: *walks up to desk and smiles*',
          instruction: 'How do you greet the customer?',
          config: {
            options: [
              { id: 'a', text: 'Hello! How can I help you?' },
              { id: 'b', text: 'Good morning! Welcome!' },
              { id: 'c', text: 'Hi there! Can I help you?' },
              { id: 'd', text: 'Hey! What do you want?' }
            ]
          },
          expectedElements: ['greeting', 'offer_help'],
          timeLimit: 30
        },
        {
          id: 'A1_GREETING_E2',
          type: 'spoken',
          prompt: 'Customer: "Hello! Do you speak English?"',
          instruction: 'Respond to the customer (speak your answer)',
          config: {
            expectedDuration: 5,
            recordingTimeLimit: 15
          },
          expectedElements: ['yes', 'affirmative', 'can_help'],
          timeLimit: 20
        },
        {
          id: 'A1_GREETING_E3',
          type: 'text_input',
          prompt: 'Customer: "Where is the bathroom?"',
          instruction: 'Write your response to help the customer',
          config: {
            minLength: 10,
            maxLength: 100,
            placeholder: 'Type your response here...'
          },
          expectedElements: ['direction', 'location', 'bathroom'],
          timeLimit: 60
        }
      ]
    },
    {
      id: 'A1_SIMPLE_REQUEST',
      cefrLevel: 'A1',
      title: 'Taking a Simple Order',
      context: 'You work in a coffee shop. A customer wants to order.',
      customerProfile: 'Casual customer ordering coffee',
      situation: 'Customer wants to order a drink',
      learningObjectives: [
        'Take a simple order',
        'Confirm information',
        'Use basic numbers and prices'
      ],
      exercises: [
        {
          id: 'A1_ORDER_E1',
          type: 'multiple_choice',
          prompt: 'Customer: "Can I have a coffee, please?"',
          instruction: 'What do you say?',
          config: {
            options: [
              { id: 'a', text: 'Yes, of course! Small, medium, or large?' },
              { id: 'b', text: 'We don\'t have that.' },
              { id: 'c', text: 'No problem! What size?' },
              { id: 'd', text: 'Sure! One coffee.' }
            ]
          },
          expectedElements: ['confirmation', 'size_question'],
          timeLimit: 30
        },
        {
          id: 'A1_ORDER_E2',
          type: 'text_input',
          prompt: 'Customer: "Large, please. How much is it?"',
          instruction: 'Tell the customer the price (large coffee = $4.50)',
          config: {
            minLength: 5,
            maxLength: 50
          },
          expectedElements: ['price', '4.50', 'dollar'],
          timeLimit: 45
        }
      ]
    }
  ],

  // ============= A2 LEVEL =============
  A2: [
    {
      id: 'A2_PRODUCT_INFO',
      cefrLevel: 'A2',
      title: 'Providing Product Information',
      context: 'You work in an electronics store. A customer asks about a smartphone.',
      customerProfile: 'Curious customer comparing products',
      situation: 'Customer needs information to make a purchase decision',
      learningObjectives: [
        'Describe product features',
        'Compare options',
        'Answer specific questions'
      ],
      exercises: [
        {
          id: 'A2_PRODUCT_E1',
          type: 'spoken',
          prompt: 'Customer: "Hi, I\'m looking for a new phone. What do you recommend?"',
          instruction: 'Speak your response. Ask about their needs and suggest options.',
          config: {
            expectedDuration: 10,
            recordingTimeLimit: 30
          },
          expectedElements: ['question', 'needs', 'recommendation'],
          timeLimit: 45
        },
        {
          id: 'A2_PRODUCT_E2',
          type: 'text_input',
          prompt: 'Customer: "I need something with a good camera and long battery life. Not too expensive."',
          instruction: 'Write a response suggesting a suitable product.',
          config: {
            minLength: 30,
            maxLength: 200
          },
          expectedElements: ['camera', 'battery', 'price', 'recommendation'],
          timeLimit: 90
        },
        {
          id: 'A2_PRODUCT_E3',
          type: 'multiple_choice',
          prompt: 'Customer: "Can I return it if I don\'t like it?"',
          instruction: 'Choose the best response about the return policy.',
          config: {
            options: [
              { id: 'a', text: 'Yes, you have 30 days to return it with the receipt.' },
              { id: 'b', text: 'No, all sales are final.' },
              { id: 'c', text: 'You can return it within 14 days if it\'s unopened.' },
              { id: 'd', text: 'Maybe, you need to ask the manager.' }
            ]
          },
          expectedElements: ['return_policy', 'timeframe', 'conditions'],
          timeLimit: 30
        }
      ]
    },
    {
      id: 'A2_SCHEDULING',
      cefrLevel: 'A2',
      title: 'Making an Appointment',
      context: 'You work at a hair salon. A customer wants to book an appointment.',
      customerProfile: 'Busy customer scheduling a haircut',
      situation: 'Customer needs to find a suitable appointment time',
      learningObjectives: [
        'Discuss dates and times',
        'Check availability',
        'Confirm appointments'
      ],
      exercises: [
        {
          id: 'A2_SCHEDULE_E1',
          type: 'text_input',
          prompt: 'Customer: "Hello, I\'d like to make an appointment for next week."',
          instruction: 'Ask about their preferred day and time.',
          config: {
            minLength: 20,
            maxLength: 150
          },
          expectedElements: ['day', 'time', 'preference', 'question'],
          timeLimit: 60
        },
        {
          id: 'A2_SCHEDULE_E2',
          type: 'multiple_choice',
          prompt: 'Customer: "Tuesday afternoon would be perfect."',
          instruction: 'You check the schedule. Tuesday at 2pm and 4pm are available. What do you say?',
          config: {
            options: [
              { id: 'a', text: 'We have Tuesday at 2pm or 4pm. Which time works for you?' },
              { id: 'b', text: 'Tuesday is fully booked. Try Wednesday.' },
              { id: 'c', text: 'Yes, Tuesday afternoon is available.' },
              { id: 'd', text: 'I can book you for 2pm on Tuesday.' }
            ]
          },
          expectedElements: ['options', 'specific_times', 'question'],
          timeLimit: 30
        }
      ]
    }
  ],

  // ============= B1 LEVEL =============
  B1: [
    {
      id: 'B1_PROBLEM_SOLVING',
      cefrLevel: 'B1',
      title: 'Resolving a Delivery Issue',
      context: 'You work for an online retailer. A customer\'s package hasn\'t arrived.',
      customerProfile: 'Concerned customer waiting for an important delivery',
      situation: 'Package is late and customer needs help tracking it',
      learningObjectives: [
        'Handle customer concerns',
        'Explain processes',
        'Offer solutions',
        'Show empathy'
      ],
      exercises: [
        {
          id: 'B1_DELIVERY_E1',
          type: 'spoken',
          prompt: 'Customer: "I ordered something a week ago and it still hasn\'t arrived. The tracking says it\'s delayed but doesn\'t give any details."',
          instruction: 'Respond to the customer. Show empathy and offer to help.',
          config: {
            expectedDuration: 15,
            recordingTimeLimit: 45
          },
          expectedElements: ['empathy', 'apologize', 'investigate', 'solution'],
          timeLimit: 60
        },
        {
          id: 'B1_DELIVERY_E2',
          type: 'text_input',
          prompt: 'Customer: "This is really frustrating. I needed it for this weekend. What can you do about it?"',
          instruction: 'Write a response explaining what you can do to help. Offer specific solutions.',
          config: {
            minLength: 50,
            maxLength: 300
          },
          expectedElements: ['understanding', 'options', 'compensation', 'timeline'],
          timeLimit: 120
        },
        {
          id: 'B1_DELIVERY_E3',
          type: 'multiple_choice',
          prompt: 'Customer: "If it doesn\'t arrive by tomorrow, I\'ll need a refund."',
          instruction: 'Choose the most appropriate response.',
          config: {
            options: [
              { id: 'a', text: 'I completely understand. If it doesn\'t arrive by tomorrow, I\'ll process a full refund immediately and you can keep the item when it arrives as an apology.' },
              { id: 'b', text: 'I\'ll make a note of that. Please contact us again tomorrow if it hasn\'t arrived.' },
              { id: 'c', text: 'That\'s not our policy. You need to wait 10 business days.' },
              { id: 'd', text: 'I understand your frustration. Let me arrange expedited shipping for a replacement order at no charge, and if the original arrives, you can return it free of charge. Would that work?' }
            ]
          },
          expectedElements: ['proactive', 'solution', 'customer_satisfaction'],
          timeLimit: 45
        }
      ]
    },
    {
      id: 'B1_TECHNICAL_SUPPORT',
      cefrLevel: 'B1',
      title: 'Providing Technical Assistance',
      context: 'You work in tech support. A customer can\'t connect to WiFi.',
      customerProfile: 'Frustrated customer with limited technical knowledge',
      situation: 'Customer needs step-by-step help with a technical issue',
      learningObjectives: [
        'Give clear instructions',
        'Use appropriate technical language',
        'Check understanding',
        'Be patient'
      ],
      exercises: [
        {
          id: 'B1_TECH_E1',
          type: 'text_input',
          prompt: 'Customer: "My internet isn\'t working. I\'ve tried turning it off and on but nothing happens."',
          instruction: 'Write your first response. Ask diagnostic questions to understand the problem.',
          config: {
            minLength: 40,
            maxLength: 250
          },
          expectedElements: ['diagnostic', 'questions', 'systematic', 'reassurance'],
          timeLimit: 90
        },
        {
          id: 'B1_TECH_E2',
          type: 'spoken',
          prompt: 'Customer: "The WiFi light is blinking red. Is that bad?"',
          instruction: 'Explain what this means and provide step-by-step instructions to fix it.',
          config: {
            expectedDuration: 20,
            recordingTimeLimit: 60
          },
          expectedElements: ['explanation', 'steps', 'clear', 'check_understanding'],
          timeLimit: 90
        }
      ]
    }
  ],

  // ============= B2 LEVEL =============
  B2: [
    {
      id: 'B2_COMPLAINT_HANDLING',
      cefrLevel: 'B2',
      title: 'Managing an Angry Customer',
      context: 'You manage a restaurant. A customer had a very bad experience.',
      customerProfile: 'Angry customer who had multiple issues during their meal',
      situation: 'Customer is upset about food quality, service, and wants compensation',
      learningObjectives: [
        'De-escalate tense situations',
        'Acknowledge multiple complaints',
        'Negotiate solutions',
        'Maintain professionalism'
      ],
      exercises: [
        {
          id: 'B2_COMPLAINT_E1',
          type: 'spoken',
          prompt: 'Customer: "This is absolutely unacceptable! The food was cold, we waited 45 minutes, and when I complained, the waiter was rude. I want to speak to the manager!"',
          instruction: 'You are the manager. Respond to the customer. Address all concerns and de-escalate the situation.',
          config: {
            expectedDuration: 25,
            recordingTimeLimit: 90
          },
          expectedElements: ['acknowledgment', 'each_issue', 'apology', 'responsibility', 'solution'],
          timeLimit: 120
        },
        {
          id: 'B2_COMPLAINT_E2',
          type: 'text_input',
          prompt: 'Customer: "An apology isn\'t enough. I paid $150 for this terrible experience. This has ruined our anniversary dinner!"',
          instruction: 'Write a detailed response. Offer appropriate compensation and demonstrate genuine empathy.',
          config: {
            minLength: 80,
            maxLength: 400
          },
          expectedElements: ['empathy', 'special_occasion', 'compensation', 'future_visit', 'specifics'],
          timeLimit: 150
        },
        {
          id: 'B2_COMPLAINT_E3',
          type: 'multiple_choice',
          prompt: 'Customer: "I\'m going to leave a terrible review online if you don\'t make this right."',
          instruction: 'Choose the most professional and effective response.',
          config: {
            options: [
              { id: 'a', text: 'I understand you\'re upset, but threatening reviews isn\'t constructive. Let\'s focus on resolving this.' },
              { id: 'b', text: 'I completely understand your frustration, and you have every right to share your experience. However, I\'d like to make this right first. I\'m offering a full refund, a complimentary future meal for two, and I\'ll personally ensure we address the service issues with our staff. Would you give us a chance to restore your faith in us?' },
              { id: 'c', text: 'Please don\'t do that. I\'ll give you a full refund right now.' },
              { id: 'd', text: 'You\'re free to leave any review you want, but we\'ve offered you fair compensation.' }
            ]
          },
          expectedElements: ['professional', 'empathy', 'comprehensive_solution', 'relationship_building'],
          timeLimit: 60
        }
      ]
    },
    {
      id: 'B2_POLICY_EXPLANATION',
      cefrLevel: 'B2',
      title: 'Explaining Complex Policies',
      context: 'You work at a bank. A customer doesn\'t understand fees on their account.',
      customerProfile: 'Confused customer questioning unexpected charges',
      situation: 'Customer needs clear explanation of complex banking policies',
      learningObjectives: [
        'Explain complex information clearly',
        'Use appropriate financial terminology',
        'Ensure comprehension',
        'Handle resistance to policies'
      ],
      exercises: [
        {
          id: 'B2_POLICY_E1',
          type: 'text_input',
          prompt: 'Customer: "I don\'t understand why I was charged $35. I only went $5 over my balance. This doesn\'t make sense!"',
          instruction: 'Explain the overdraft policy clearly and empathetically.',
          config: {
            minLength: 60,
            maxLength: 350
          },
          expectedElements: ['policy_explanation', 'specific_numbers', 'empathy', 'prevention_tips'],
          timeLimit: 150
        },
        {
          id: 'B2_POLICY_E2',
          type: 'spoken',
          prompt: 'Customer: "This policy is ridiculous. Why should I pay $35 for going over by $5? Can\'t you waive this fee?"',
          instruction: 'Respond professionally. Explain the rationale and discuss possible options.',
          config: {
            expectedDuration: 30,
            recordingTimeLimit: 90
          },
          expectedElements: ['policy_rationale', 'options', 'empathy', 'alternatives'],
          timeLimit: 120
        }
      ]
    }
  ],

  // ============= C1 LEVEL =============
  C1: [
    {
      id: 'C1_NEGOTIATION',
      cefrLevel: 'C1',
      title: 'Complex Contract Negotiation',
      context: 'You\'re a sales manager. A corporate client wants to renegotiate their service contract.',
      customerProfile: 'Experienced procurement manager seeking better terms',
      situation: 'Client wants price reduction and additional services without increased cost',
      learningObjectives: [
        'Navigate complex negotiations',
        'Use persuasive language',
        'Balance company and client interests',
        'Handle objections diplomatically'
      ],
      exercises: [
        {
          id: 'C1_NEGOTIATION_E1',
          type: 'text_input',
          prompt: 'Client: "We\'ve been with your company for three years, and frankly, we\'re disappointed. Your competitors are offering 20% lower rates with more features. Unless you can match or beat their offer, we\'ll be moving our business elsewhere."',
          instruction: 'Write a strategic response. Address their concerns while protecting your company\'s interests.',
          config: {
            minLength: 100,
            maxLength: 500
          },
          expectedElements: ['value_proposition', 'relationship', 'alternative_solutions', 'strategic', 'professional'],
          timeLimit: 180
        },
        {
          id: 'C1_NEGOTIATION_E2',
          type: 'spoken',
          prompt: 'Client: "I appreciate that, but I need concrete numbers. What exactly can you offer us to make staying worthwhile?"',
          instruction: 'Present a compelling counter-offer. Be specific and persuasive.',
          config: {
            expectedDuration: 40,
            recordingTimeLimit: 120
          },
          expectedElements: ['specific_offer', 'value_addition', 'business_case', 'flexibility'],
          timeLimit: 150
        },
        {
          id: 'C1_NEGOTIATION_E3',
          type: 'multiple_choice',
          prompt: 'Client: "Your offer is interesting, but I need to include unlimited data transfer, which you\'ve said isn\'t possible at this price point."',
          instruction: 'Select the most effective negotiation strategy.',
          config: {
            options: [
              { id: 'a', text: 'I understand that\'s important to you. While unlimited isn\'t feasible at this price, what if we significantly increased your data cap to 10TB—which exceeds your current usage by 40%—and included a clause that allows flexible scaling if you approach that limit? This gives you practical unlimited service for your actual needs.' },
              { id: 'b', text: 'I\'m sorry, but unlimited data transfer isn\'t something we can offer at any price point currently.' },
              { id: 'c', text: 'If unlimited data transfer is essential, we can include it, but it would require adjusting other aspects of the package.' },
              { id: 'd', text: 'Let me be frank: unlimited data transfer at this price would be unsustainable for us. However, I\'m authorized to offer you our premium tier at the standard tier price for the first year, which includes 15TB transfer. Additionally, we can review your usage quarterly and adjust the cap as needed at no extra cost for the contract duration.' }
            ]
          },
          expectedElements: ['creative_solution', 'client_needs', 'company_limits', 'win_win'],
          timeLimit: 90
        }
      ]
    },
    {
      id: 'C1_CRISIS_MANAGEMENT',
      cefrLevel: 'C1',
      title: 'Crisis Communication',
      context: 'You\'re a customer service director. Your company had a data breach affecting customers.',
      customerProfile: 'Affected customer concerned about data security and company trustworthiness',
      situation: 'Major incident requiring transparent, reassuring, and professional communication',
      learningObjectives: [
        'Communicate during crisis situations',
        'Balance transparency with reassurance',
        'Address concerns comprehensively',
        'Rebuild trust'
      ],
      exercises: [
        {
          id: 'C1_CRISIS_E1',
          type: 'spoken',
          prompt: 'Customer: "I just heard about the data breach on the news. Was my information compromised? Why wasn\'t I notified directly? This is completely unacceptable!"',
          instruction: 'Provide a comprehensive, transparent, and reassuring response.',
          config: {
            expectedDuration: 45,
            recordingTimeLimit: 150
          },
          expectedElements: ['acknowledge', 'transparency', 'specific_information', 'actions_taken', 'customer_steps', 'reassurance'],
          timeLimit: 180
        },
        {
          id: 'C1_CRISIS_E2',
          type: 'text_input',
          prompt: 'Customer: "How can I trust your company now? What guarantees do I have that this won\'t happen again? I\'m seriously considering closing my account."',
          instruction: 'Write a detailed response addressing trust, security improvements, and why they should remain a customer.',
          config: {
            minLength: 120,
            maxLength: 600
          },
          expectedElements: ['empathy', 'accountability', 'specific_measures', 'ongoing_protection', 'relationship_value', 'choice_respect'],
          timeLimit: 240
        }
      ]
    }
  ],

  // ============= C2 LEVEL =============
  C2: [
    {
      id: 'C2_EXECUTIVE_COMMUNICATION',
      cefrLevel: 'C2',
      title: 'High-Stakes Executive Relations',
      context: 'You\'re a VP of Customer Success. A Fortune 500 client\'s CEO is considering ending a $5M annual contract.',
      customerProfile: 'CEO with high expectations, limited patience, and significant leverage',
      situation: 'Multiple service failures have jeopardized a crucial relationship',
      learningObjectives: [
        'Communicate at executive level',
        'Demonstrate strategic thinking',
        'Use sophisticated language and nuance',
        'Navigate high-stakes situations'
      ],
      exercises: [
        {
          id: 'C2_EXECUTIVE_E1',
          type: 'text_input',
          prompt: 'CEO: "I\'ve personally reviewed the service record from the past quarter, and it\'s frankly abysmal. Three major outages, inadequate communication, and what appears to be a systematic failure in your escalation procedures. I\'m not interested in excuses—I need to understand why I shouldn\'t recommend to our board that we terminate this partnership and pursue litigation for breach of SLA."',
          instruction: 'Craft a sophisticated, strategic response. Acknowledge failures, provide context, and present a compelling path forward.',
          config: {
            minLength: 150,
            maxLength: 700
          },
          expectedElements: ['executive_level', 'accountability', 'strategic_analysis', 'specific_remediation', 'value_proposition', 'measurable_commitments', 'no_defensiveness'],
          timeLimit: 300
        },
        {
          id: 'C2_EXECUTIVE_E2',
          type: 'spoken',
          prompt: 'CEO: "I appreciate the candor, but I need more than process improvements. What structural changes are you implementing, and who\'s being held accountable?"',
          instruction: 'Provide specific, strategic answers demonstrating organizational change and accountability.',
          config: {
            expectedDuration: 60,
            recordingTimeLimit: 180
          },
          expectedElements: ['organizational_changes', 'accountability', 'specific_personnel', 'metrics', 'governance', 'executive_commitment'],
          timeLimit: 240
        },
        {
          id: 'C2_EXECUTIVE_E3',
          type: 'multiple_choice',
          prompt: 'CEO: "Here\'s my bottom line: I need a 30% credit on this quarter, a dedicated team lead who reports directly to your CTO, and monthly executive reviews for the next six months. If you can\'t commit to that, we\'re done."',
          instruction: 'Choose the most strategically sound response.',
          config: {
            options: [
              { id: 'a', text: 'I accept all of your terms. We\'ll implement everything immediately.' },
              { id: 'b', text: 'I appreciate your directness, and you have every right to these demands. I can commit to the dedicated team lead and executive reviews immediately—in fact, I\'d like to personally attend those monthly sessions. Regarding the credit, a 30% credit would be unprecedented and challenging to approve, but I\'m authorized to offer 20% this quarter plus an additional 10% service credit for next quarter, effectively giving you the same value but demonstrating our commitment to future performance. Would that work?' },
              { id: 'c', text: 'Those terms are reasonable given the circumstances. Let me get approval from my leadership team and get back to you within 24 hours.' },
              { id: 'd', text: 'I understand your position completely, and I want to meet you more than halfway. Here\'s what I can commit to right now: a 25% credit for this quarter, a dedicated senior team lead—specifically Sarah Chen, who led our most successful enterprise implementation—reporting directly to both your CTO and mine, and bi-weekly executive reviews for the first three months, then monthly thereafter. Additionally, I\'d like to propose quarterly business reviews with your board to ensure complete transparency. I believe this demonstrates our commitment while establishing governance that actually exceeds your requirements. Can we move forward on these terms?' }
            ]
          },
          expectedElements: ['strategic_flexibility', 'adds_value', 'commitment', 'relationship_building', 'measured_response'],
          timeLimit: 120
        }
      ]
    },
    {
      id: 'C2_ETHICAL_DILEMMA',
      cefrLevel: 'C2',
      title: 'Navigating Ethical Complexity',
      context: 'You\'re Head of Customer Relations. A major client requests service that conflicts with company values.',
      customerProfile: 'Influential client whose business is valuable but request is ethically questionable',
      situation: 'Client wants to use your platform in ways that may violate terms of service',
      learningObjectives: [
        'Navigate ethical dilemmas professionally',
        'Balance business and values',
        'Communicate principled positions diplomatically',
        'Maintain relationships while setting boundaries'
      ],
      exercises: [
        {
          id: 'C2_ETHICAL_E1',
          type: 'text_input',
          prompt: 'Client: "We need to implement targeted monitoring of specific employee communications using your platform. This is perfectly legal in our jurisdiction, and it\'s critical for our security. If you can\'t accommodate this, we\'ll need to find a provider who will. We\'re talking about a potential expansion to a $10M contract."',
          instruction: 'Write a sophisticated response that addresses the ethical concerns while maintaining the relationship.',
          config: {
            minLength: 150,
            maxLength: 700
          },
          expectedElements: ['principled_stance', 'diplomatic', 'alternative_solutions', 'company_values', 'relationship_respect', 'nuanced'],
          timeLimit: 300
        },
        {
          id: 'C2_ETHICAL_E2',
          type: 'spoken',
          prompt: 'Client: "I respect your position, but this seems like a case of your personal values interfering with business realities. Many of your competitors offer exactly what we\'re asking for."',
          instruction: 'Articulate your company\'s position with sophistication and conviction.',
          config: {
            expectedDuration: 50,
            recordingTimeLimit: 180
          },
          expectedElements: ['company_values', 'market_position', 'principled', 'respectful', 'alternative_value', 'conviction'],
          timeLimit: 240
        }
      ]
    }
  ]
};

module.exports = scenarios;
