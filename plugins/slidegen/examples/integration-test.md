---
marp: true
title: Integration Test - Interactive Elements with Basic Template
author: Interactive Elements Agent
date: 2025-08-01
theme: default
paginate: true
footer: Integration Test | Basic Template + Interactive Elements
style: |
  @import url('./themes/interactive-elements.css');
  section {
    font-size: 22px;
    padding: 40px;
  }
  h1 {
    color: #007bff;
    text-align: center;
  }
  h2 {
    color: #0056b3;
    border-bottom: 2px solid #007bff;
    padding-bottom: 0.3em;
  }
---

<script src="./themes/interactive-elements.js"></script>

<!-- _class: lead -->
# Integration Test

## Interactive Elements + Basic Template

### Testing Compatibility and Functionality

---

## Simple Poll Test

<div class="interactive-poll basic-template" data-poll-id="integration_test">
  <h3 class="poll-question">Does this poll display correctly?</h3>
  <div class="poll-options">
    <button class="poll-option" data-value="yes">
      <span class="option-text">✅ Yes, looks good</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="no">
      <span class="option-text">❌ No, has issues</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
  </div>
  <div class="poll-results">
    <p class="total-votes">Total votes: <span>0</span></p>
  </div>
</div>

---

## Quiz Test

<div class="quiz-question basic-template" data-question-id="integration_quiz">
  <h4 class="question-text">Is this quiz working properly?</h4>
  <div class="quiz-options">
    <label class="quiz-option">
      <input type="radio" name="integration_quiz" value="correct">
      <span class="option-label">Yes, it's working</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="integration_quiz" value="wrong">
      <span class="option-label">No, there are problems</span>
    </label>
  </div>
  <button class="check-answer" onclick="checkQuizAnswer('integration_quiz')">Check Answer</button>
  <div class="quiz-feedback" id="integration_quiz-feedback">
    <div class="feedback-correct">
      <span class="feedback-icon">✅</span>
      <p>Great! The integration is working correctly.</p>
    </div>
    <div class="feedback-incorrect">
      <span class="feedback-icon">❌</span>
      <p>If you see this, there might be an integration issue.</p>
    </div>
  </div>
</div>

---

## Reveal Test

<div class="reveal-container">
  <button class="reveal-trigger" onclick="toggleReveal('test_reveal')">
    <span class="trigger-text">Click to test reveal functionality</span>
    <span class="trigger-icon">▼</span>
  </button>
  <div class="reveal-content" id="test_reveal">
    <div class="reveal-inner">
      <h4>✅ Reveal Working!</h4>
      <p>If you can see this content after clicking the button above, the reveal functionality is working correctly.</p>
      <ul>
        <li>CSS animations are functioning</li>
        <li>JavaScript event handlers are working</li>
        <li>Template integration is successful</li>
      </ul>
    </div>
  </div>
</div>

---

## Progress Tracker Test

<div class="progress-tracker basic-template" data-total-steps="4" data-tracker-id="test_progress">
  <div class="progress-header">
    <h4>Test Progress</h4>
    <span class="progress-text">Step <span class="current-step">3</span> of <span class="total-steps">4</span></span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 75%"></div>
  </div>
  <div class="progress-steps">
    <div class="step completed" data-step="1">Poll</div>
    <div class="step completed" data-step="2">Quiz</div>
    <div class="step active" data-step="3">Reveal</div>
    <div class="step" data-step="4">Complete</div>
  </div>
</div>

---

<!-- _class: lead -->
# Integration Test Complete! ✅

## All Interactive Elements Working

### Ready for Production Use

If all elements above functioned correctly, the Interactive Elements Agent is successfully integrated with your slide generation system.

---

<!-- Test Notes:

This presentation tests:
1. CSS import and styling integration
2. JavaScript functionality
3. Basic template compatibility
4. Interactive element rendering
5. Event handling and user interactions
6. Responsive design
7. Accessibility features

To test:
1. Export to HTML: marp examples/integration-test.md --html --allow-local-files
2. Open in browser
3. Test all interactive elements
4. Verify styling matches basic template
5. Test on mobile devices
6. Test keyboard navigation
7. Test with screen reader if available

Expected results:
- Poll should accept votes and show visual feedback
- Quiz should provide instant feedback when answered
- Reveal should smoothly expand/collapse content
- Progress tracker should display correctly
- All elements should be keyboard accessible
- Styling should be consistent with basic template

-->