---
name: julekalender
description: Create animated winner-selection visualizations for Christmas calendar gift drawings. Takes a list of names and produces entertaining ~60-second animations that build suspense before revealing a random winner. Use when users want to build interactive randomizers, name selection games, or similar participant-selection entertainment.
---

# Julekalender - Winner Selection Randomizer

You are an expert at creating animated visualizations that randomly select a winner from a list of names. This is for workplace Christmas calendar traditions where daily winners are selected through entertaining animations.

## Project Context

**Purpose**: Create engaging ~60-second animated experiences that build suspense before revealing a random winner from a participant list.

**Use Case**: Daily standup meetings where one person wins a gift from the pool. Should be more fun than Excel!

## Input Format

Always read from `names.txt` (or specified file) with this format:
```
Alice
Bob
Charlie
# David - on vacation
Emma
# Frank - already won
```

**Rules**:
- One name per line
- Lines starting with `#` are comments/disabled (skip them)
- Whitespace should be trimmed
- Empty lines ignored
- Case-sensitive names

## Output Requirements

### Animation
- **Duration**: Approximately 60 seconds of entertainment
- **Pacing**: Build suspense gradually, don't reveal winner too early
- **Clarity**: Viewers should easily track their name and understand what's happening
- **Engagement**: Should be fun to watch, not boring
- **Fairness**: Truly random selection (using crypto.getRandomValues() or seeded random)

### Winner Announcement
- Clear, unmistakable winner reveal
- Visual celebration (confetti, spotlight, grow/pulse effect, etc.)
- Display winner name prominently
- Optional: Show "Winner: [Name]" text overlay

### User Experience
- Easy to run (open HTML file or run simple command)
- Should work locally without internet if possible (or minimal CDN dependencies)
- Optionally include sound (with mute button)
- Restart/replay capability helpful
- Responsive to different screen sizes

## Technology Recommendations

### Preferred: p5.js
**Use p5.js for most visualizations** - it's the sweet spot of power and simplicity:
- Excellent for races, particle effects, creative animations
- Built-in random/noise functions
- Easy canvas drawing
- Good for generative animations
- Can use seeded randomness (reproducible/debuggable)

### Alternative Technologies
Choose based on specific needs:

- **HTML + CSS animations** - For very simple slot machines, fading circles
- **Vanilla Canvas API** - If you want zero dependencies
- **Matter.js** - For physics-based (marble runs, dice, collisions)
- **Phaser 3** - For complex games (snake.io, battle royale with collisions)
- **Three.js** - For 3D effects (space race, rotating objects)

### General Recommendation
**Start with p5.js** unless the concept specifically requires physics or 3D.

## Project Structure

Create in `visualizations/` directory:

```
/julekalender
  /visualizations
    /horse-race
      index.html
      README.md
    /space-race
      index.html
      README.md
  /julekalender-skill
    SKILL.md
    templates/
      viewer.html
  names.txt
  IDEAS.md
  README.md
```

Each visualization is self-contained in its own folder.

## Template-Based Approach

### STEP 0: Read the Template

**Before creating any HTML file:**

1. Read `julekalender-skill/templates/viewer.html` using the Read tool
2. Use it as the starting point (similar to algorithmic-art skill)
3. Keep the structure: header, controls sidebar, main canvas
4. Replace only the animation algorithm and specific parameter controls

The template provides:
- Clean layout structure
- Seed navigation (for testing different random outcomes)
- Parameter controls framework
- Action buttons (regenerate, reset)
- Consistent styling

### What to Keep vs Replace

**KEEP (from template):**
- Overall HTML structure and layout
- Sidebar organization (Seed → Parameters → Actions)
- Seed controls (prev/next/random/jump) - useful for testing!
- Regenerate/Reset buttons
- Basic styling approach

**REPLACE:**
- The animation algorithm itself
- Parameter definitions (specific to each visualization)
- UI controls for those parameters
- Visualization-specific logic

## Implementation Patterns

### Loading Names from Electron App

**ALWAYS USE THIS PATTERN** for all Julekalender visualizations:

```javascript
// Global state
let names = [];
let setupComplete = false;

// Load names function (with fallback for browser testing)
function loadNames() {
    if (window.JULEKALENDER_NAMES && window.JULEKALENDER_NAMES.length > 0) {
        names = window.JULEKALENDER_NAMES;
    } else {
        // Fallback for standalone browser testing
        const FALLBACK_NAMES = `Alice
Bob
Charlie
Diana
Erik
Frank
Grace
Henry`;
        names = FALLBACK_NAMES
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    }
    return names;
}

// p5.js setup - create canvas and wait for names
function setup() {
    createCanvas(1200, 900);
    canvas.parent('canvas-container');

    // Check if names already available
    if (window.JULEKALENDER_NAMES && window.JULEKALENDER_NAMES.length > 0) {
        initializeWithNames();
    }
    // Otherwise wait for event
}

// CRITICAL: Listen for Electron name injection event
window.addEventListener('julekalender-names-loaded', (event) => {
    if (!setupComplete) {
        initializeWithNames();
    }
});

// Initialize visualization once names are ready
function initializeWithNames() {
    if (setupComplete) return;

    loadNames();

    if (names.length === 0) {
        console.error('No names loaded!');
        return;
    }

    // Your initialization code here
    initializeVisualization();

    // Hide loading message
    document.querySelector('.loading').style.display = 'none';
    setupComplete = true;
}
```

**Why this pattern?**
- Handles race condition between p5.js and Electron injection
- Works both in Electron app AND standalone browser testing
- Prevents double-initialization
- Guarantees names are available before animation starts

**NEVER** call `loadNames()` directly in `setup()` - always wait for the event or check first!

### Random Selection

**Option 1: Pre-select winner (recommended)**
```javascript
let winner;
let names;

async function setup() {
  names = await loadNames();

  // Use seeded random (reproducible for debugging/testing)
  randomSeed(params.seed);
  winner = random(names);

  // Now animate towards revealing winner
  // Animation is entertainment - winner already chosen fairly
}
```

**Option 2: Cryptographically random (if not using seeds)**
```javascript
function selectWinner(names) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomIndex = array[0] % names.length;
  return names[randomIndex];
}
```

### Animation Timing Structure
```javascript
// Suggested pacing for ~60 second animations
const PHASES = {
  INTRO: 5000,      // 5s - Show all participants
  BUILD: 40000,     // 40s - Main animation/competition
  CLIMAX: 10000,    // 10s - Final moments, down to 2-3
  REVEAL: 5000      // 5s - Winner announcement
};

let startTime;

function draw() {
  const elapsed = millis() - startTime;

  if (elapsed < PHASES.INTRO) {
    // Show all names, intro phase
  } else if (elapsed < PHASES.INTRO + PHASES.BUILD) {
    // Main animation
  } else if (elapsed < PHASES.INTRO + PHASES.BUILD + PHASES.CLIMAX) {
    // Narrow down to final contestants
  } else {
    // Reveal winner with fanfare
  }
}
```

### Seeded Randomness (from algorithmic-art)
```javascript
let params = {
  seed: 12345,  // Allows reproducible testing
  // ... other parameters
};

function setup() {
  randomSeed(params.seed);
  noiseSeed(params.seed);
  // Now all random() calls are reproducible
}
```

**Why use seeds?**
- Debug animations (same seed = same behavior)
- Test edge cases (few names vs many names)
- Reproduce issues
- Speed controls during development

## Visualization Design Best Practices

### Show All Names Initially
- Let people see they're included
- Build investment/excitement
- Display all names at start (5 seconds)

### Eliminate Gradually
- Don't remove everyone at once
- Pace eliminations to build suspense
- Speed up eliminations as time goes on

### Create Tension
- Near-misses and close calls
- Slow down near the end
- Down to final 2-3 before winner

### Visual Feedback
- Highlight active/leading names
- Color coding for different states
- Animation when names are eliminated
- Clear visual hierarchy

### Polish
- Smooth animations (easing, not linear)
- Sound effects at key moments (optional, with mute)
- Confetti/particle effects for winner
- Background music (very optional, must be mutable)

## Common Features Checklist

### Must-Have
- [ ] Load names from file
- [ ] Skip commented lines (`#`)
- [ ] Random winner selection
- [ ] ~60 second animation
- [ ] Clear winner announcement
- [ ] Easy to run locally
- [ ] README with instructions

### Nice-to-Have
- [ ] Restart button
- [ ] Seed controls (for testing variations)
- [ ] Speed controls (2x, 0.5x for development)
- [ ] Sound toggle
- [ ] Fullscreen mode
- [ ] Parameter tweaking (speeds, colors, etc.)

## Implementation Process

When user requests a visualization:

1. **Ask which concept** if not specified (reference IDEAS.md)
2. **Read the viewer template** (`templates/viewer.html`)
3. **Confirm technology choice** (usually p5.js)
4. **Create visualization folder** in `visualizations/`
5. **Implement using template** as starting point:
   - Load names from `../../names.txt`
   - Pre-select winner using seed
   - Build animation algorithm
   - Add parameter controls if useful
   - Test with different name counts
6. **Create README** for the specific visualization
7. **Test**: Try with 5 names, 20 names, 50 names

## Visualization-Specific Guidance

### For Race Visualizations (horse, space, mountain)
- Each name = one racer
- Random speed variations
- Photo finish at end
- Visual progress indicators

### For Battle/Elimination (battle royale, gladiator)
- Start with all names visible
- Random elimination with effects
- Health bars or status indicators
- Dramatic final showdown

### For Physics-Based (marble run, dice)
- Use Matter.js or p5.play
- Real physics simulation
- Names on physical objects
- Winner = last standing or first to finish

### For Abstract (slot machine, elimination circles)
- Visual representation for each name
- Gradual narrowing
- Speed variations for suspense
- Clear final selection

## Questions to Ask User

If visualization concept not clear:
- Which visualization from IDEAS.md interests you?
- Any specific theme? (Christmas, retro, minimalist, sci-fi, etc.)
- Should it include sound effects?
- Any team in-jokes or culture to incorporate?
- Typical number of participants? (affects design)

## Quality Standards

- **Clean code**: Well-commented, organized
- **Performant**: Smooth 60fps if animated
- **Fair randomness**: Truly random, verifiable
- **Reproducible**: Seeds allow testing same scenario
- **Fun**: Entertainment value is paramount!
- **Documentation**: README explains how to run

## Creative Freedom

Each visualization should be unique! The template provides structure, but:
- Create original animation algorithms
- Design unique visual styles
- Add personality and flair
- Make it memorable

**The goal**: Create something MORE FUN than an Excel randomizer while being fair and random.

## Resources

- **templates/viewer.html**: Starting point for all HTML artifacts
- **IDEAS.md**: Brainstormed visualization concepts
- **Algorithmic-art skill**: Reference for p5.js patterns and structure

---

Remember: Entertainment and suspense are just as important as randomness. Make something people look forward to watching every day!
