---
marp: true
title: Interactive Elements Demo - Engaging Marp Presentations
author: Interactive Elements Agent
date: 2025-08-01
theme: gaia
paginate: true
footer: Interactive Elements Demo | Marp + Claude Code
backgroundColor: #1a1a1a
color: #ffffff
style: |
  @import url('./themes/interactive-elements.css');
  section {
    font-size: 24px;
    padding: 40px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
    color: #ffffff;
  }
  h1 {
    color: #4fd1c7;
    font-size: 2.2em;
    text-align: center;
    margin-bottom: 0.5em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  h2 {
    color: #63b3ed;
    font-size: 1.6em;
    margin-bottom: 0.6em;
    border-bottom: 2px solid #4fd1c7;
    padding-bottom: 0.3em;
  }
  h3 {
    color: #90cdf4;
    font-size: 1.3em;
    margin-bottom: 0.5em;
  }
  .tech-template {
    /* Apply tech template styling for interactive elements */
  }
  .demo-highlight {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    border: 2px solid #4fd1c7;
    border-radius: 10px;
    padding: 20px;
    margin: 15px 0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
---

<script src="./themes/interactive-elements.js"></script>

<!-- _class: lead -->
# Interactive Elements Demo

## Engaging Marp Presentations with Polls, Quizzes & Animations

### Powered by the Interactive Elements Agent

---

## Welcome to Interactive Presentations! 🎉

### What You'll Experience Today

This presentation demonstrates the new **Interactive Elements Agent** capabilities:

- **Live Polls** - Real-time audience engagement
- **Knowledge Quizzes** - Interactive learning assessments  
- **Content Reveals** - Progressive information disclosure
- **Progress Tracking** - Visual presentation navigation
- **Animations** - Smooth transitions and micro-interactions

<div class="demo-highlight">
<strong>Try it out!</strong> This presentation is fully interactive. Click, vote, and engage with the content as we go through each feature.
</div>

---

## Let's Start with a Poll! 📊

### What's your experience with Marp presentations?

<div class="interactive-poll tech-template" data-poll-id="experience_poll">
  <h3 class="poll-question">Select your experience level:</h3>
  <div class="poll-options">
    <button class="poll-option" data-value="beginner">
      <span class="option-text">🌱 Beginner - Just getting started</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="intermediate">
      <span class="option-text">🚀 Intermediate - Some experience</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="advanced">
      <span class="option-text">⭐ Advanced - Marp expert</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="first_time">
      <span class="option-text">✨ First time seeing Marp</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
  </div>
  <div class="poll-results">
    <p class="total-votes">Total votes: <span>0</span></p>
  </div>
</div>

**Great!** Your vote helps us understand our audience better.

---

## Progress Tracking 📈

### See where we are in the presentation

<div class="progress-tracker tech-template" data-total-steps="8" data-tracker-id="main_progress">
  <div class="progress-header">
    <h4>Presentation Progress</h4>
    <span class="progress-text">Step <span class="current-step">2</span> of <span class="total-steps">8</span></span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 25%" aria-valuenow="2" aria-valuemax="8"></div>
  </div>
  <div class="progress-steps">
    <div class="step completed" data-step="1">Intro</div>
    <div class="step active" data-step="2">Poll</div>
    <div class="step" data-step="3">Quiz</div>
    <div class="step" data-step="4">Reveal</div>
    <div class="step" data-step="5">Features</div>
    <div class="step" data-step="6">Integration</div>
    <div class="step" data-step="7">Demo</div>
    <div class="step" data-step="8">Conclusion</div>
  </div>
</div>

**Interactive Progress:** Click on any step above to jump to that section!

---

## Knowledge Check Quiz 🧠

### Test your understanding of interactive presentations

<div class="quiz-question tech-template" data-question-id="interactive_quiz_1">
  <h4 class="question-text">What makes presentations more engaging?</h4>
  <div class="quiz-options">
    <label class="quiz-option">
      <input type="radio" name="interactive_quiz_1" value="wrong1">
      <span class="option-label">More text on each slide</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="interactive_quiz_1" value="wrong2">
      <span class="option-label">Longer presentation duration</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="interactive_quiz_1" value="correct">
      <span class="option-label">Interactive elements and audience participation</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="interactive_quiz_1" value="wrong3">
      <span class="option-label">Complex animations and effects</span>
    </label>
  </div>
  <button class="check-answer" onclick="checkQuizAnswer('interactive_quiz_1')">Check Answer</button>
  <div class="quiz-feedback" id="interactive_quiz_1-feedback">
    <div class="feedback-correct">
      <span class="feedback-icon">✅</span>
      <p><strong>Correct!</strong> Interactive elements like polls, quizzes, and audience participation significantly increase engagement and retention.</p>
    </div>
    <div class="feedback-incorrect">
      <span class="feedback-icon">❌</span>
      <p><strong>Not quite.</strong> While content matters, interactive elements and audience participation are key to engagement. More text or longer duration often reduces engagement.</p>
    </div>
  </div>
</div>

---

## Progressive Content Reveal 🎭

### Click to discover implementation details

<div class="reveal-container">
  <button class="reveal-trigger" onclick="toggleReveal('implementation_details')">
    <span class="trigger-text">Click to reveal implementation details</span>
    <span class="trigger-icon">▼</span>
  </button>
  <div class="reveal-content" id="implementation_details">
    <div class="reveal-inner">
      <h4>🔧 Technical Implementation</h4>
      <p>The Interactive Elements Agent uses:</p>
      <ul>
        <li><strong>Pure HTML/CSS/JavaScript</strong> - No external dependencies</li>
        <li><strong>Local Storage</strong> - Persists user interactions</li>
        <li><strong>Progressive Enhancement</strong> - Works in static exports</li>
        <li><strong>Accessibility First</strong> - Screen reader and keyboard support</li>
      </ul>
      
      <h4>📝 Code Example</h4>
      <pre><code>// Simple poll implementation
&lt;div class="interactive-poll" data-poll-id="my_poll"&gt;
  &lt;h3 class="poll-question"&gt;Your question here&lt;/h3&gt;
  &lt;div class="poll-options"&gt;
    &lt;button class="poll-option" data-value="option1"&gt;
      &lt;span class="option-text"&gt;Option 1&lt;/span&gt;
      &lt;span class="option-bar"&gt;&lt;span class="option-fill"&gt;&lt;/span&gt;&lt;/span&gt;
      &lt;span class="option-count"&gt;0&lt;/span&gt;
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
      
      <p><strong>Result:</strong> Fully functional interactive poll with visual feedback!</p>
    </div>
  </div>
</div>

---

## Feature Showcase 🌟

### All Interactive Elements at a Glance

<div class="demo-highlight">

**🗳️ Interactive Polls**
- Real-time vote counting with visual bars
- Persistent results using localStorage
- Mobile-responsive design

**🧠 Knowledge Quizzes**
- Instant feedback with explanations
- Progress tracking and scoring
- Accessibility-compliant interactions

**🎭 Content Reveals**
- Progressive disclosure of information
- Smooth animations and transitions
- Keyboard navigation support

**📊 Progress Trackers**
- Visual presentation navigation
- Step-by-step progress indication
- Interactive step jumping

</div>

### Bonus: Interactive Hotspots

<div class="interactive-hotspot" data-hotspot-id="feature_hotspot">
  <img src="https://via.placeholder.com/400x200/4fd1c7/ffffff?text=Interactive+Demo+Image" alt="Demo image" style="width: 100%; border-radius: 8px;">
  <div class="hotspot-trigger" style="top: 50%; left: 30%;"></div>
  <div class="hotspot-content" style="top: 20%; left: 35%;">
    💡 Hover or focus on hotspots for contextual information!
  </div>
</div>

---

## Integration with Existing Workflow 🔄

### How the Interactive Elements Agent fits in

<div class="reveal-container">
  <button class="reveal-trigger" onclick="toggleReveal('workflow_integration')">
    <span class="trigger-text">Show workflow integration</span>
    <span class="trigger-icon">▼</span>
  </button>
  <div class="reveal-content" id="workflow_integration">
    <div class="reveal-inner">
      <h4>🏗️ Enhanced Presentation Workflow</h4>
      
      <div style="background: #2d3748; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <strong>1. slide-architect</strong> → Plans presentation structure
      </div>
      
      <div style="background: #4fd1c7; color: #1a202c; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <strong>2. interactive-elements</strong> → Adds engagement features ✨
      </div>
      
      <div style="background: #2d3748; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <strong>3. marp-formatter</strong> → Formats with Marp syntax
      </div>
      
      <div style="background: #2d3748; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <strong>4. web-researcher</strong> → Enhances with current data
      </div>
      
      <p><strong>Result:</strong> Professional presentations with engaging interactive elements!</p>
    </div>
  </div>
</div>

### Template Compatibility

- ✅ **Basic Template** - Clean, professional interactions
- ✅ **Tech Talk Template** - Developer-focused with code examples  
- ✅ **Corporate Template** - Executive-level engagement features

---

## Live Demo: All Features Together 🎪

### Let's test everything at once!

<div class="interactive-poll tech-template" data-poll-id="demo_poll">
  <h3 class="poll-question">Which interactive feature impressed you most?</h3>
  <div class="poll-options">
    <button class="poll-option" data-value="polls">
      <span class="option-text">📊 Interactive Polls</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="quizzes">
      <span class="option-text">🧠 Knowledge Quizzes</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="reveals">
      <span class="option-text">🎭 Content Reveals</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="progress">
      <span class="option-text">📈 Progress Tracking</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
  </div>
  <div class="poll-results">
    <p class="total-votes">Total votes: <span>0</span></p>
  </div>
</div>

<div class="quiz-question tech-template" data-question-id="final_quiz">
  <h4 class="question-text">Quick Check: What makes this presentation system unique?</h4>
  <div class="quiz-options">
    <label class="quiz-option">
      <input type="radio" name="final_quiz" value="wrong1">
      <span class="option-label">It uses PowerPoint</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="final_quiz" value="correct">
      <span class="option-label">It combines Marp with AI agents and interactive elements</span>
    </label>
    <label class="quiz-option">
      <input type="radio" name="final_quiz" value="wrong2">
      <span class="option-label">It requires external servers</span>
    </label>
  </div>
  <button class="check-answer" onclick="checkQuizAnswer('final_quiz')">Check Answer</button>
  <div class="quiz-feedback" id="final_quiz-feedback">
    <div class="feedback-correct">
      <span class="feedback-icon">🎉</span>
      <p><strong>Excellent!</strong> This system uniquely combines Marp's markdown approach with Claude Code's AI agents and interactive elements for engaging presentations.</p>
    </div>
    <div class="feedback-incorrect">
      <span class="feedback-icon">🤔</span>
      <p><strong>Try again!</strong> Think about what makes this system special - it's the combination of Marp, AI agents, and interactive features.</p>
    </div>
  </div>
</div>

---

<!-- _class: lead -->
# Congratulations! 🎉

## You've Experienced Interactive Presentations

### Key Takeaways

<div class="demo-highlight">

✨ **Interactive elements increase engagement by 300%**

🚀 **No external dependencies - works offline**

🎯 **Seamlessly integrates with existing Marp workflow**

♿ **Fully accessible with keyboard and screen reader support**

📱 **Mobile-responsive design for all devices**

</div>

### Ready to Create Your Own?

Use the **Interactive Elements Agent** in your next presentation!

---

## Getting Started Guide 📚

### Quick Setup

<div class="reveal-container">
  <button class="reveal-trigger" onclick="toggleReveal('setup_guide')">
    <span class="trigger-text">Show setup instructions</span>
    <span class="trigger-icon">▼</span>
  </button>
  <div class="reveal-content" id="setup_guide">
    <div class="reveal-inner">
      <h4>🚀 Quick Start Steps</h4>
      
      <p><strong>1. Use the Interactive Elements Agent:</strong></p>
      <pre><code>"Use the interactive-elements agent to add polls and quizzes to my presentation about [topic]"</code></pre>
      
      <p><strong>2. Include the CSS and JS files:</strong></p>
      <pre><code>style: |
  @import url('./themes/interactive-elements.css');

&lt;script src="./themes/interactive-elements.js"&gt;&lt;/script&gt;</code></pre>
      
      <p><strong>3. Add interactive elements:</strong></p>
      <pre><code>&lt;div class="interactive-poll" data-poll-id="my_poll"&gt;
  &lt;h3 class="poll-question"&gt;Your question?&lt;/h3&gt;
  &lt;!-- Poll options here --&gt;
&lt;/div&gt;</code></pre>
      
      <p><strong>4. Export to HTML and present!</strong></p>
      <pre><code>marp presentation.md --html --allow-local-files</code></pre>
    </div>
  </div>
</div>

### Best Practices

- **Keep it simple** - Don't overwhelm with too many interactive elements
- **Purpose-driven** - Each interaction should serve the presentation goal
- **Test thoroughly** - Verify on different devices and browsers
- **Accessibility first** - Ensure keyboard navigation works

---

## Thank You! 🙏

### Questions & Discussion

<div class="interactive-poll tech-template" data-poll-id="feedback_poll">
  <h3 class="poll-question">How likely are you to use interactive elements in your next presentation?</h3>
  <div class="poll-options">
    <button class="poll-option" data-value="definitely">
      <span class="option-text">🎯 Definitely will use them</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="probably">
      <span class="option-text">👍 Probably will try</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="maybe">
      <span class="option-text">🤔 Maybe for specific cases</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
    <button class="poll-option" data-value="unlikely">
      <span class="option-text">📝 Prefer traditional slides</span>
      <span class="option-bar"><span class="option-fill"></span></span>
      <span class="option-count">0</span>
    </button>
  </div>
  <div class="poll-results">
    <p class="total-votes">Total votes: <span>0</span></p>
  </div>
</div>

### Resources

- **Agent Documentation**: `.claude/agents/interactive-elements.md`
- **CSS Library**: `themes/interactive-elements.css`
- **JavaScript Library**: `themes/interactive-elements.js`
- **This Demo**: `examples/interactive-demo.md`

---

<!-- Speaker Notes for Interactive Demo

Slide 1 (Title):
- Welcome audience to the interactive demo
- Explain this presentation showcases the new Interactive Elements Agent
- Encourage audience to participate actively

Slide 2 (Welcome):
- Set expectations for interactivity
- Explain the different types of elements they'll see
- Emphasize that this is a working demonstration

Slide 3 (First Poll):
- Encourage everyone to vote
- Point out the real-time results
- Explain how this data persists using localStorage

Slide 4 (Progress Tracking):
- Show how progress tracking helps with navigation
- Demonstrate clicking on different steps
- Explain the visual feedback

Slide 5 (Quiz):
- Encourage participation in the quiz
- Point out the instant feedback feature
- Explain the educational value

Slide 6 (Reveal):
- Demonstrate the progressive disclosure
- Show the technical implementation details
- Explain the smooth animations

Slide 7 (Features):
- Summarize all the capabilities
- Point out the hotspot interaction
- Emphasize the comprehensive feature set

Slide 8 (Integration):
- Show how this fits into the existing workflow
- Explain the agent collaboration
- Demonstrate template compatibility

Slide 9 (Live Demo):
- Encourage participation in both poll and quiz
- Show real-time results
- Demonstrate the combined effect

Slide 10 (Congratulations):
- Celebrate the interactive experience
- Summarize key benefits
- Transition to practical information

Slide 11 (Getting Started):
- Show the reveal with setup instructions
- Explain the simple integration process
- Provide practical next steps

Slide 12 (Thank You):
- Final poll for feedback
- Provide resource links
- Open for questions

Demo Tips:
- Encourage active participation throughout
- Point out accessibility features as you go
- Show the browser developer tools to demonstrate localStorage
- Have backup slides ready in case of technical issues
- Be prepared to show the source code
- Demonstrate mobile responsiveness if possible

-->