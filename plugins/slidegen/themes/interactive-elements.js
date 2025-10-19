/**
 * Interactive Elements JavaScript Library for Marp Presentations
 * Provides functionality for polls, quizzes, animations, and engagement features
 * Compatible with HTML exports and responsive design
 */

class InteractiveElements {
  constructor() {
    this.polls = new Map();
    this.quizzes = new Map();
    this.reveals = new Map();
    this.progressTrackers = new Map();
    this.hotspots = new Map();
    this.storagePrefix = 'marp_interactive_';
    
    // Bind methods to preserve context
    this.handlePollVote = this.handlePollVote.bind(this);
    this.checkQuizAnswer = this.checkQuizAnswer.bind(this);
    this.toggleReveal = this.toggleReveal.bind(this);
    
    this.init();
  }

  /**
   * Initialize all interactive elements
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeElements());
    } else {
      this.initializeElements();
    }
  }

  /**
   * Initialize all interactive elements on the page
   */
  initializeElements() {
    this.initPolls();
    this.initQuizzes();
    this.initReveals();
    this.initProgressTrackers();
    this.initHotspots();
    this.loadStoredData();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
    
    console.log('Interactive Elements initialized successfully');
  }

  /* ==========================================================================
     Poll Management
     ========================================================================== */

  /**
   * Initialize all polls on the page
   */
  initPolls() {
    document.querySelectorAll('.interactive-poll').forEach(poll => {
      const pollId = poll.dataset.pollId || this.generateId('poll');
      poll.dataset.pollId = pollId;
      
      this.polls.set(pollId, {
        element: poll,
        votes: {},
        totalVotes: 0,
        userVoted: false,
        options: []
      });

      // Initialize poll options
      const options = poll.querySelectorAll('.poll-option');
      options.forEach((option, index) => {
        const value = option.dataset.value || `option_${index}`;
        option.dataset.value = value;
        
        this.polls.get(pollId).options.push(value);
        
        // Add click handler
        option.addEventListener('click', (e) => {
          e.preventDefault();
          this.handlePollVote(pollId, value);
        });
        
        // Add keyboard support
        option.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handlePollVote(pollId, value);
          }
        });
        
        // Make focusable
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        option.setAttribute('aria-label', `Vote for ${option.querySelector('.option-text').textContent}`);
      });
    });
  }

  /**
   * Handle poll vote
   */
  handlePollVote(pollId, value) {
    const poll = this.polls.get(pollId);
    if (!poll || poll.userVoted) return;

    // Update vote count
    poll.votes[value] = (poll.votes[value] || 0) + 1;
    poll.totalVotes++;
    poll.userVoted = true;

    // Update UI
    this.updatePollDisplay(pollId);
    this.savePollData(pollId);
    
    // Announce result to screen readers
    this.announceToScreenReader(`Vote recorded for ${value}. Total votes: ${poll.totalVotes}`);
  }

  /**
   * Update poll display with current vote counts
   */
  updatePollDisplay(pollId) {
    const poll = this.polls.get(pollId);
    const pollElement = poll.element;

    // Update vote counts and bars
    pollElement.querySelectorAll('.poll-option').forEach(option => {
      const value = option.dataset.value;
      const votes = poll.votes[value] || 0;
      const percentage = poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;

      const countElement = option.querySelector('.option-count');
      const fillElement = option.querySelector('.option-fill');
      
      if (countElement) countElement.textContent = votes;
      if (fillElement) {
        fillElement.style.width = `${percentage}%`;
        fillElement.setAttribute('aria-label', `${percentage.toFixed(1)}% of votes`);
      }
      
      if (votes > 0) {
        option.classList.add('voted');
      }
      
      // Disable further voting
      if (poll.userVoted) {
        option.classList.add('disabled');
        option.setAttribute('aria-disabled', 'true');
      }
    });

    // Update total votes
    const totalElement = pollElement.querySelector('.total-votes span');
    if (totalElement) totalElement.textContent = poll.totalVotes;
  }

  /* ==========================================================================
     Quiz Management
     ========================================================================== */

  /**
   * Initialize all quizzes on the page
   */
  initQuizzes() {
    document.querySelectorAll('.quiz-question').forEach(quiz => {
      const questionId = quiz.dataset.questionId || this.generateId('quiz');
      quiz.dataset.questionId = questionId;
      
      this.quizzes.set(questionId, {
        element: quiz,
        answered: false,
        correct: false,
        selectedValue: null
      });

      // Add click handler to check answer button
      const checkButton = quiz.querySelector('.check-answer');
      if (checkButton) {
        checkButton.addEventListener('click', () => this.checkQuizAnswer(questionId));
      }
      
      // Add keyboard support for radio buttons
      const radioButtons = quiz.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
          this.quizzes.get(questionId).selectedValue = radio.value;
        });
      });
    });
  }

  /**
   * Check quiz answer and show feedback
   */
  checkQuizAnswer(questionId) {
    const quiz = this.quizzes.get(questionId);
    if (!quiz || quiz.answered) return;
    
    const quizElement = quiz.element;
    const selectedOption = quizElement.querySelector(`input[name="${questionId}"]:checked`);
    
    if (!selectedOption) {
      this.showAlert('Please select an answer first!');
      return;
    }

    const isCorrect = selectedOption.value === 'correct';
    quiz.answered = true;
    quiz.correct = isCorrect;
    quiz.selectedValue = selectedOption.value;

    // Show feedback
    const feedback = quizElement.querySelector('.quiz-feedback');
    const correctFeedback = feedback.querySelector('.feedback-correct');
    const incorrectFeedback = feedback.querySelector('.feedback-incorrect');

    feedback.classList.add('show');
    feedback.setAttribute('aria-live', 'polite');
    
    if (isCorrect) {
      correctFeedback.style.display = 'block';
      incorrectFeedback.style.display = 'none';
      this.announceToScreenReader('Correct answer!');
    } else {
      correctFeedback.style.display = 'none';
      incorrectFeedback.style.display = 'block';
      this.announceToScreenReader('Incorrect answer. Please review the explanation.');
    }

    // Disable further changes
    quizElement.querySelectorAll('input').forEach(input => {
      input.disabled = true;
    });
    
    const checkButton = quizElement.querySelector('.check-answer');
    checkButton.disabled = true;
    checkButton.textContent = 'Answered';
    checkButton.setAttribute('aria-label', 'Question answered');

    this.saveQuizData(questionId);
  }

  /* ==========================================================================
     Reveal Management
     ========================================================================== */

  /**
   * Initialize all reveal containers
   */
  initReveals() {
    document.querySelectorAll('.reveal-container').forEach(container => {
      const trigger = container.querySelector('.reveal-trigger');
      const content = container.querySelector('.reveal-content');
      const revealId = content.id || this.generateId('reveal');
      
      content.id = revealId;
      
      this.reveals.set(revealId, {
        container,
        trigger,
        content,
        isOpen: false
      });
      
      // Add click handler
      trigger.addEventListener('click', () => this.toggleReveal(revealId));
      
      // Add keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleReveal(revealId);
        }
      });
      
      // Set up ARIA attributes
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', revealId);
      content.setAttribute('aria-hidden', 'true');
    });
  }

  /**
   * Toggle reveal content visibility
   */
  toggleReveal(revealId) {
    const reveal = this.reveals.get(revealId);
    if (!reveal) return;

    reveal.isOpen = !reveal.isOpen;
    
    if (reveal.isOpen) {
      reveal.content.classList.add('show');
      reveal.trigger.classList.add('active');
      reveal.trigger.querySelector('.trigger-text').textContent = 'Click to hide';
      reveal.trigger.setAttribute('aria-expanded', 'true');
      reveal.content.setAttribute('aria-hidden', 'false');
      
      this.announceToScreenReader('Content revealed');
    } else {
      reveal.content.classList.remove('show');
      reveal.trigger.classList.remove('active');
      reveal.trigger.querySelector('.trigger-text').textContent = 'Click to reveal solution';
      reveal.trigger.setAttribute('aria-expanded', 'false');
      reveal.content.setAttribute('aria-hidden', 'true');
      
      this.announceToScreenReader('Content hidden');
    }
  }

  /* ==========================================================================
     Progress Tracker Management
     ========================================================================== */

  /**
   * Initialize progress trackers
   */
  initProgressTrackers() {
    document.querySelectorAll('.progress-tracker').forEach(tracker => {
      const trackerId = tracker.dataset.trackerId || this.generateId('progress');
      const totalSteps = parseInt(tracker.dataset.totalSteps) || 5;
      
      tracker.dataset.trackerId = trackerId;
      
      this.progressTrackers.set(trackerId, {
        element: tracker,
        currentStep: 1,
        totalSteps: totalSteps
      });

      // Initialize display
      this.updateProgress(trackerId, 1, totalSteps);
      
      // Add click handlers to steps
      tracker.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('click', () => {
          this.updateProgress(trackerId, index + 1, totalSteps);
        });
        
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.updateProgress(trackerId, index + 1, totalSteps);
          }
        });
      });
    });
  }

  /**
   * Update progress tracker display
   */
  updateProgress(trackerId, currentStep, totalSteps) {
    const tracker = this.progressTrackers.get(trackerId);
    if (!tracker) return;
    
    tracker.currentStep = currentStep;
    const percentage = (currentStep / totalSteps) * 100;
    
    const element = tracker.element;
    const currentStepElement = element.querySelector('.current-step');
    const progressFill = element.querySelector('.progress-fill');
    
    if (currentStepElement) currentStepElement.textContent = currentStep;
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
      progressFill.setAttribute('aria-valuenow', currentStep);
      progressFill.setAttribute('aria-valuemax', totalSteps);
    }
    
    // Update step indicators
    element.querySelectorAll('.step').forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNumber < currentStep) {
        step.classList.add('completed');
        step.setAttribute('aria-label', `Step ${stepNumber}: Completed`);
      } else if (stepNumber === currentStep) {
        step.classList.add('active');
        step.setAttribute('aria-label', `Step ${stepNumber}: Current`);
      } else {
        step.setAttribute('aria-label', `Step ${stepNumber}: Upcoming`);
      }
    });
    
    this.announceToScreenReader(`Progress updated: Step ${currentStep} of ${totalSteps}`);
  }

  /* ==========================================================================
     Hotspot Management
     ========================================================================== */

  /**
   * Initialize interactive hotspots
   */
  initHotspots() {
    document.querySelectorAll('.interactive-hotspot').forEach(hotspot => {
      const hotspotId = hotspot.dataset.hotspotId || this.generateId('hotspot');
      const trigger = hotspot.querySelector('.hotspot-trigger');
      const content = hotspot.querySelector('.hotspot-content');
      
      hotspot.dataset.hotspotId = hotspotId;
      
      this.hotspots.set(hotspotId, {
        element: hotspot,
        trigger,
        content,
        isVisible: false
      });
      
      // Add interaction handlers
      trigger.addEventListener('mouseenter', () => this.showHotspot(hotspotId));
      trigger.addEventListener('mouseleave', () => this.hideHotspot(hotspotId));
      trigger.addEventListener('focus', () => this.showHotspot(hotspotId));
      trigger.addEventListener('blur', () => this.hideHotspot(hotspotId));
      
      // Make focusable
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-describedby', content.id || `${hotspotId}-content`);
      
      if (!content.id) {
        content.id = `${hotspotId}-content`;
      }
    });
  }

  /**
   * Show hotspot content
   */
  showHotspot(hotspotId) {
    const hotspot = this.hotspots.get(hotspotId);
    if (!hotspot) return;
    
    hotspot.content.style.opacity = '1';
    hotspot.content.style.visibility = 'visible';
    hotspot.isVisible = true;
  }

  /**
   * Hide hotspot content
   */
  hideHotspot(hotspotId) {
    const hotspot = this.hotspots.get(hotspotId);
    if (!hotspot) return;
    
    hotspot.content.style.opacity = '0';
    hotspot.content.style.visibility = 'hidden';
    hotspot.isVisible = false;
  }

  /* ==========================================================================
     Data Persistence
     ========================================================================== */

  /**
   * Save poll data to localStorage
   */
  savePollData(pollId) {
    const poll = this.polls.get(pollId);
    if (!poll) return;
    
    try {
      localStorage.setItem(`${this.storagePrefix}poll_${pollId}`, JSON.stringify({
        votes: poll.votes,
        totalVotes: poll.totalVotes,
        userVoted: poll.userVoted,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save poll data:', e);
    }
  }

  /**
   * Save quiz data to localStorage
   */
  saveQuizData(questionId) {
    const quiz = this.quizzes.get(questionId);
    if (!quiz) return;
    
    try {
      localStorage.setItem(`${this.storagePrefix}quiz_${questionId}`, JSON.stringify({
        answered: quiz.answered,
        correct: quiz.correct,
        selectedValue: quiz.selectedValue,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save quiz data:', e);
    }
  }

  /**
   * Load stored data from localStorage
   */
  loadStoredData() {
    // Load poll data
    this.polls.forEach((poll, pollId) => {
      try {
        const stored = localStorage.getItem(`${this.storagePrefix}poll_${pollId}`);
        if (stored) {
          const data = JSON.parse(stored);
          poll.votes = data.votes || {};
          poll.totalVotes = data.totalVotes || 0;
          poll.userVoted = data.userVoted || false;
          this.updatePollDisplay(pollId);
        }
      } catch (e) {
        console.warn('Failed to load poll data:', e);
      }
    });

    // Load quiz data
    this.quizzes.forEach((quiz, questionId) => {
      try {
        const stored = localStorage.getItem(`${this.storagePrefix}quiz_${questionId}`);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.answered) {
            quiz.answered = data.answered;
            quiz.correct = data.correct;
            quiz.selectedValue = data.selectedValue;
            
            // Update UI to show answered state
            const quizElement = quiz.element;
            const checkButton = quizElement.querySelector('.check-answer');
            if (checkButton) {
              checkButton.disabled = true;
              checkButton.textContent = 'Answered';
            }
            
            // Select the previously chosen answer
            if (data.selectedValue) {
              const radio = quizElement.querySelector(`input[value="${data.selectedValue}"]`);
              if (radio) {
                radio.checked = true;
                radio.disabled = true;
              }
            }
            
            // Disable all inputs
            quizElement.querySelectorAll('input').forEach(input => {
              input.disabled = true;
            });
          }
        }
      } catch (e) {
        console.warn('Failed to load quiz data:', e);
      }
    });
  }

  /* ==========================================================================
     Accessibility and Utility Functions
     ========================================================================== */

  /**
   * Set up keyboard navigation
   */
  setupKeyboardNavigation() {
    // Add keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open reveals
        this.reveals.forEach((reveal, revealId) => {
          if (reveal.isOpen) {
            this.toggleReveal(revealId);
          }
        });
      }
    });
  }

  /**
   * Set up accessibility features
   */
  setupAccessibility() {
    // Add ARIA live region for announcements
    if (!document.getElementById('interactive-announcements')) {
      const announcer = document.createElement('div');
      announcer.id = 'interactive-announcements';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const announcer = document.getElementById('interactive-announcements');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  /**
   * Show accessible alert
   */
  showAlert(message) {
    // Use native alert for now, could be enhanced with custom modal
    alert(message);
    this.announceToScreenReader(message);
  }

  /**
   * Generate unique ID
   */
  generateId(prefix) {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /* ==========================================================================
     Public API Methods
     ========================================================================== */

  /**
   * Manually trigger poll vote (for external use)
   */
  votePoll(pollId, value) {
    this.handlePollVote(pollId, value);
  }

  /**
   * Manually check quiz answer (for external use)
   */
  checkQuiz(questionId) {
    this.checkQuizAnswer(questionId);
  }

  /**
   * Manually toggle reveal (for external use)
   */
  toggleContent(revealId) {
    this.toggleReveal(revealId);
  }

  /**
   * Manually update progress (for external use)
   */
  setProgress(trackerId, step) {
    const tracker = this.progressTrackers.get(trackerId);
    if (tracker) {
      this.updateProgress(trackerId, step, tracker.totalSteps);
    }
  }

  /**
   * Get poll results
   */
  getPollResults(pollId) {
    const poll = this.polls.get(pollId);
    return poll ? {
      votes: { ...poll.votes },
      totalVotes: poll.totalVotes,
      userVoted: poll.userVoted
    } : null;
  }

  /**
   * Get quiz results
   */
  getQuizResults(questionId) {
    const quiz = this.quizzes.get(questionId);
    return quiz ? {
      answered: quiz.answered,
      correct: quiz.correct,
      selectedValue: quiz.selectedValue
    } : null;
  }

  /**
   * Reset all interactive elements
   */
  resetAll() {
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
    
    // Reinitialize
    this.polls.clear();
    this.quizzes.clear();
    this.reveals.clear();
    this.progressTrackers.clear();
    this.hotspots.clear();
    
    this.initializeElements();
  }
}

// Global functions for inline event handlers (backward compatibility)
function checkQuizAnswer(questionId) {
  if (window.interactiveElements) {
    window.interactiveElements.checkQuizAnswer(questionId);
  }
}

function toggleReveal(revealId) {
  if (window.interactiveElements) {
    window.interactiveElements.toggleReveal(revealId);
  }
}

function votePoll(pollId, value) {
  if (window.interactiveElements) {
    window.interactiveElements.handlePollVote(pollId, value);
  }
}

function setProgress(trackerId, step) {
  if (window.interactiveElements) {
    window.interactiveElements.setProgress(trackerId, step);
  }
}

// Initialize interactive elements when script loads
window.interactiveElements = new InteractiveElements();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveElements;
}

// AMD support
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return InteractiveElements;
  });
}