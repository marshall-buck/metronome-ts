interface Frequency {
  [key: string]: number;
}

const FREQUENCIES: Frequency = {
  C4: 261.63,
  Db4: 277.18,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Gb4: 369.99,
  G4: 392.0,
  Ab4: 415.3,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
};

/** Class representing a Oscillator note */
class Note {
  beatNumber: number;
  noteLength: number;
  private _pitch: number = 440;

  ctx: AudioContext;

  /**
   * @param ctx        - The audioContext
   * @param beatNumber -  A zero based number determining which beat the note belongs.
   * @param noteLength -  How long in seconds should the note be played.

   *
   * @property pitch - Set a pitch by frequency number i.e 440 or note i.e. C4, Bb4
   */

  constructor(ctx: AudioContext, beatNumber: number, noteLength: number) {
    this.beatNumber = beatNumber;
    this.noteLength = noteLength;
    this.ctx = ctx;
  }

  /** Get the note frequency */
  get pitch(): number {
    return this._pitch;
  }

  /** Set the frequency */
  set pitch(value: string | number) {
    if (typeof value === "number") this._pitch = value;
    else {
      if (value[1] === "#" || !FREQUENCIES[value]) {
        throw new Error(
          "Invalid pitch, Include only notes from C4 to C5, and no sharps only flats"
        );
      } else {
        const upper = value.toUpperCase();
        this._pitch = FREQUENCIES[upper];
      }
    }
  }
}

export { Note };
