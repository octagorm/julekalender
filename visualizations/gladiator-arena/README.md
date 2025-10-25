# ⚔️ Gladiator Arena

An epic battle royale visualization where participants fight as gladiators until one champion emerges victorious!

## Concept

All participants enter the arena as gladiators, arranged in a circle. They engage in randomized turn-based combat, with each battle featuring attack animations, health bars, and elimination effects. The tension builds as fighters are eliminated one by one until a single champion remains.

## Features

- **Visual Combat**: Watch gladiators move to center stage for dramatic battles
- **Health Bars**: Track each gladiator's remaining health
- **Attack Effects**: See strikes, impacts, and particle effects
- **Smart Elimination**: The pre-selected winner is subtly protected (70% avoidance in early rounds)
- **Victory Celebration**: Confetti and crown for the champion
- **Circular Arena**: Classic gladiator setup with arena markings

## How to Run

### Fra Electron App (Anbefalt)

1. Åpne Julekalender-appen
2. Administrer deltakere i hovedvinduet
3. Klikk "Start" på Gladiatorarena-kortet
4. Navnene injiseres automatisk fra appen!

### Standalone Testing (Browser)

For testing uten Electron-appen, åpne `index.html` direkte i nettleseren. Visualiseringen bruker fallback-navn for testing.

**Merk**: Når du kjører fra Electron, brukes alltid navnene fra app-dataene. Fallback-navn brukes kun når du tester standalone i nettleser.

## Controls

### Seed Navigation
- **Prev/Next**: Test different random outcomes
- **Random**: Generate a completely new battle sequence
- **Jump to Seed**: Enter a specific seed number

### Parameters
- **Animation Speed** (0.5x - 3.0x): Speed up or slow down for testing
- **Battle Intensity** (1-10): How much damage each attack deals

### Actions
- **Restart Battle**: Begin a new fight with the same seed

## Timing

- **3 seconds**: Intro - All gladiators displayed
- **~50 seconds**: Battle phase - Random fights until one remains
- **5 seconds**: Victory celebration
- **Total**: ~60 seconds

## Animation Details

### Phases
1. **INTRO**: Display all gladiators in circular formation
2. **BATTLE**: Sequential fights with random pairings
   - Fighters move to center
   - Attack animation with visual effects
   - Damage applied (defender may be eliminated)
   - Survivors return to positions
   - Slower pacing for final fights (2-3 gladiators)
3. **VICTORY**: Winner crowned with confetti celebration

### Combat Mechanics
- Each gladiator has randomized stats (attack power, defense)
- Health displayed above each fighter
- Eliminated gladiators fade out
- Winner is pre-selected (fair random) but animation creates drama

### Visual Polish
- Colored gladiators (8 distinct colors, cycling)
- Pulsing/scaling effects for active fighters
- Screen shake on damage
- Attack lines and impact particles
- Arena circle with decorative markings
- Background trails for smooth motion blur

## Technical Notes

- Built with **p5.js**
- Seeded randomness (reproducible battles)
- Responsive canvas sizing
- Self-contained HTML (no external dependencies except p5.js CDN)
- Works offline once loaded

## Customization Ideas

- Adjust `COLORS` array for different palettes
- Modify attack/defense ranges in `Gladiator` constructor
- Change arena radius in positioning logic
- Add sound effects (sword clashes, crowd cheers)
- Implement special moves or critical hits

## Testing Tips

Use seed navigation to:
- Test with few participants (seed 100)
- Test with many participants (seed 200)
- Find exciting battles (try different seeds)
- Reproduce specific scenarios

Adjust animation speed to 3x for rapid testing, or 0.5x to watch combat in slow motion.

---

**Pro tip**: The winner is fairly selected at the start, but has slight protection during battles to ensure they survive to the end. This creates dramatic tension while maintaining true randomness!
