# Password Strength Analyzer — Design Direction

## Approach 1: Editorial Security Lab
**Very Brief Intro:** A quiet, high-trust interface inspired by security research notebooks: warm paper, ink-black type, sharp rules, and a single electric signal color. The mood is focused, calm, and useful rather than alarmist.

**Probability:** 0.07

## Approach 2: Midnight Operations Console
**Very Brief Intro:** A dark command-center experience with dense telemetry, phosphor accents, and layered status readouts. It makes password analysis feel like a live diagnostic instrument.

**Probability:** 0.03

## Approach 3: Soft Utility Almanac
**Very Brief Intro:** A friendly, daylight utility with rounded cards, gentle blue-greens, and approachable educational copy. It makes security literacy feel like a small, repeatable daily habit.

**Probability:** 0.08

## Chosen Direction: Editorial Security Lab

### Design Movement
Contemporary editorial design with references to Swiss information design, security research field notes, and modernist print systems. The visual language should feel authored, legible, and materially grounded.

### Core Principles
1. **Clarity before theatre:** Every status, score, and recommendation should be immediately understandable without a security background.
2. **Measured tension:** Use ink, paper, and acid-lime signal color to distinguish calm guidance from risk without resorting to fear-based visuals.
3. **Visible method:** Show the dimensions behind the score—length, variety, and uniqueness—so users learn how strength is built.
4. **One decisive action:** Keep the main interaction focused on entering a password and reading the result, with alternatives available but never pushy.

### Color Philosophy
Use a warm, lightly textured paper base to make the tool feel approachable and human, anchored by deep ink for serious contrast. A single signature electric-lime signal color (#C7F36B) represents detection and forward motion; it appears on progress, positive states, and the primary action. Warning states use rust and amber sparingly so the interface stays educational rather than punitive.

### Layout Paradigm
Use an asymmetric split composition: a slim editorial rail on the left establishes the tool’s identity and privacy promise, while the main analysis area occupies a wide, breathing canvas. The score card overlaps the input zone slightly, creating a desk-like arrangement rather than a centered marketing block. On small screens, the rail becomes a compact top strip and the analysis stack becomes linear.

### Signature Elements
- Thin ink rules with small monospace labels, like a printed lab sheet.
- A vertical “signal” gauge and short diagnostic chips that make the analysis feel inspectable.
- A lime cursor/marker motif used for the primary action and the strongest positive outcome.

### Interaction Philosophy
Interactions should feel immediate and informative. Typing updates the analysis without submit buttons; the visible checklist changes in place; password visibility is always explicit. Alternatives are copyable with one tap, and any local-only claim is stated at the moment it matters.

### Animation
Use short, controlled transitions: the score ring and gauge fill move in 220ms with a cubic-bezier ease-out; checklist icons fade and lift 4px when they change; the results panel enters with a restrained 180ms slide/fade. Avoid loops and gratuitous motion. Respect `prefers-reduced-motion` by removing transforms and leaving only instant state changes.

### Typography System
- **Display:** `DM Serif Display`, used for the oversized “signal” score and key editorial headlines.
- **Interface:** `Plus Jakarta Sans`, used for body copy, labels, controls, and recommendations.
- **Technical labels:** `IBM Plex Mono`, used for metadata, rules, and short diagnostic annotations.

Hierarchy rule: oversized serif numbers create confidence and memorability; sans-serif copy stays compact and operational; mono labels provide the research-note character.

### Brand Essence
**Passmark is a privacy-first password coach for people who want a clearer answer than “weak” or “strong,” showing exactly what to improve without sending the password anywhere.**

Personality: **observant, calm, exacting**.

### Brand Voice
Headlines are concise and quietly confident. CTAs are direct verbs. Microcopy explains the method in plain language and avoids security theatre, shame, or generic filler.

Example lines:
- “A stronger password is a longer idea, not a busier one.”
- “See the weak link, then make one useful change.”

### Wordmark & Logo
The mark is a compact abstract “P” built from a vertical key shaft and a split signal notch—recognizable at favicon size, with no literal lock cliché. The wordmark uses a custom-feeling lowercase treatment with a hard terminal on the final letter; the generated symbol is used independently in the header and favicon.

### Signature Brand Color
**Signal lime — `#C7F36B`**. Ownable, high-contrast against ink, and reserved for verified strength, live progress, and the main action.

### File-level Reminder
Every CSS, component, and page file should begin with a short comment reminding future edits to preserve the Editorial Security Lab system: warm paper, ink, signal lime, editorial asymmetry, DM Serif Display + Plus Jakarta Sans + IBM Plex Mono, and restrained motion.

## Style Decisions

- The left rail is a slim editorial index, never a dominant dark sidebar; it frames identity and privacy while the analyzer remains the visual center.
- Passmark’s core diagnostic motif is a vertical signal gauge with mono readouts and short chips; the generic circular score meter is not the primary brand device.
- Dark ink panels may appear as one focused diagnostic instrument, but the overall page remains warm paper, printed rules, and calm editorial spacing rather than a command-console atmosphere.
