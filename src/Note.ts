interface Frequency {
  [key: string]: number;
}

const FREQUENCIES: Frequency = {
  C4: 261.63,
  DB4: 277.18,
  D4: 293.66,
  EB4: 311.13,
  E4: 329.63,
  F4: 349.23,
  GB4: 369.99,
  G4: 392.0,
  AB4: 415.3,
  A4: 440.0,
  BB4: 466.16,
  B4: 493.88,
  C5: 523.25,
};

/** Class representing a Metronome tick extends OscillatorNode Web Audio API */
class MetronomeTick extends OscillatorNode {
  beatNumber: number;
  noteLength: number;
  ctx: AudioContext;
  gainNode: GainNode;

  /**
   * @param ctx        - The audioContext
   * @param beatNumber -  A zero based number determining which beat the note belongs.
   * @param noteLength -  How long in seconds should the note be played.
   */

  constructor(
    ctx: AudioContext,
    gainNode: GainNode,
    beatNumber: number = 0,
    noteLength: number = 0.05
  ) {
    super(ctx, { frequency: 380, type: "triangle" });
    this.beatNumber = beatNumber;
    this.noteLength = noteLength;
    this.ctx = ctx;
    this.gainNode = gainNode;
    this.connect(this.gainNode);
  }

  play(time: number) {
    this.start(time);
    this.stop(time + this.noteLength);
  }

  /** Set the frequency to value at certain time
   * @param time string | number  String must be a natural note or flat note with octave i.e. C4 Db5
   */
  setPitch(value: string | number, time: number = this.ctx.currentTime): void {
    if (typeof value === "number") this.frequency.setValueAtTime(value, time);
    else {
      const upper = value.toUpperCase();
      if (value[1] === "#" || !FREQUENCIES[upper]) {
        throw new Error(
          "Invalid pitch, Include only notes from C4 to C5, and no sharps only flats"
        );
      } else {
        this.frequency.setValueAtTime(FREQUENCIES[upper], time);
      }
    }
  }
}

export { MetronomeTick };
