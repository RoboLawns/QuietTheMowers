export const guides = [
  {
    title: 'How to Measure Noise',
    description: 'Step-by-step protocol for measuring lawn equipment noise: distance, height, duration, time of day, and what to record.',
    slug: 'how-to-measure-noise',
    category: 'measurement',
  },
  {
    title: 'How to Run a Campaign',
    description: 'From zero to first signature: choosing your target, writing your petition, building your supporter list, and getting the word out.',
    slug: 'how-to-run-a-campaign',
    category: 'campaigning',
  },
  {
    title: 'How to Talk to Your HOA',
    description: 'Templates, talking points, and strategies for presenting to your HOA board and building consensus among neighbors.',
    slug: 'how-to-talk-to-your-hoa',
    category: 'advocacy',
  },
  {
    title: 'How to Speak at a Council Meeting',
    description: 'What to expect, how to prepare, writing 3-minute remarks, preparing speaker cards, and following up after the meeting.',
    slug: 'how-to-speak-at-council',
    category: 'advocacy',
  },
  {
    title: 'How to Build a Petition',
    description: 'Crafting petition language that resonates, choosing signature goals, collecting signatures online and offline, and verifying them.',
    slug: 'how-to-build-a-petition',
    category: 'campaigning',
  },
  {
    title: 'Electric Equipment Guide',
    description: 'What to buy, what to avoid, and what actually works for residential lawns. Battery runtime, noise comparisons, and cost analysis.',
    slug: 'electric-equipment-guide',
    category: 'getting-started',
  },
  {
    title: 'Understanding Noise Regulations',
    description: 'How noise ordinances work, what decibel limits mean, how to read municipal codes, and what makes a good ordinance.',
    slug: 'understanding-noise-regulations',
    category: 'getting-started',
  },
  {
    title: 'Getting Press Coverage',
    description: 'Writing press releases, pitching local media, using social media effectively, and telling your campaign story.',
    slug: 'getting-press-coverage',
    category: 'campaigning',
  },
];

export const guideSlugMap: Record<string, { title: string; content: string }> = {
  'how-to-measure-noise': {
    title: 'How to Measure Noise',
    content: `This guide walks you through the official Quiet The Mowers measurement protocol. Good data wins arguments.

## What You'll Need

- A sound level meter (Class 2 recommended; we rent them at /measure/rent)
- Or a smartphone with a calibrated app (see /measure/buy for recommendations)
- A tape measure or laser distance measurer
- A notebook or the measurement form (printable PDF at /measure/protocol)
- Optional: a tripod for the meter, a camera for photo documentation

## The Protocol

### 1. Choose Your Measurement Location

Measure from a location that represents typical exposure:

- **Property line**: The boundary between your property and the noise source
- **Indoor equivalent**: A window facing the noise source (note: indoor readings are typically 10-15 dB lower)
- **Multiple positions**: For stronger data, measure from 2-3 positions (e.g., property line, 50 ft away, inside near a window)

### 2. Set Up Your Equipment

- Place the sound level meter on a tripod at **ear height (approx. 5 ft / 1.5 m)** above ground
- Point the microphone toward the noise source
- Set the meter to **A-weighting (dBA)** and **Slow response**
- If using a smartphone app, calibrate before each session using the app's calibration tool
- Start with the meter in the **MAX** or **recording** mode to capture peak levels

### 3. Record the Measurement

For each noise event, record:

| Field | Description |
|-------|-------------|
| Date | YYYY-MM-DD |
| Time | Local time (HH:MM) |
| Duration | How long the equipment ran |
| Equipment type | Gas mower, leaf blower, trimmer, etc. |
| Peak dB(A) | The highest reading during the event |
| Average dB(A) | Sustained level (if your meter records this) |
| Background noise | dB level when equipment is off (baseline) |
| Distance from source | Estimated or measured in feet |
| Weather | Wind (affects readings), precipitation |
| Notes | Anything unusual: multiple machines, echoes, etc. |

### 4. Tips for Good Data

- **Measure at different times of day** and on different days to show patterns
- **Record baseline readings** — what does your neighborhood sound like when no equipment is running?
- **Take photos** of the setup showing the meter position and the noise source
- **Record audio or video** as supporting evidence (most smartphones do this well)
- **Be consistent** — use the same meter, same position, same settings each time
- **Document everything** — good notes make your data usable by campaigns and researchers

### 5. Upload Your Data

Go to /measure/upload to submit your measurements. You can:

- Attach them to an existing campaign
- Start a new campaign with your data
- Save them as a personal record
- Choose your privacy level: public, anonymous-public, or private

### Legal Note

Measurements collected using this protocol are intended for advocacy and awareness purposes. They may not meet the standards required for legal evidence. Consult with your campaign or legal advisor if you need court-admissible data.`,
  },
};
