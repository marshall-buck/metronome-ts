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
  private _frequency: number = 440;
  name: string;

  /**
   *
   * @param beatNumber -  A zero based number determining which beat the note belongs.
   * @param noteLength -  How long in seconds should the note be played.
   * @param name - Name of the note with octave, only use flats and naturals Db4 not C#4
   *                defaults to C4
   * @property frequency - Set a frequency by number or note i.e. C4, Bb4
   */

  constructor(beatNumber: number, noteLength: number, name = "C4") {
    this.name = name;
    this.beatNumber = beatNumber;
    this.noteLength = noteLength;
  }

  /** Get the note frequency */
  get frequency(): number {
    return this._frequency;
  }

  /** Set the frequency */
  set frequency(value: string | number) {
    if (typeof value === "number") this._frequency = value;
    else {
      if (value[1] === "#" || !FREQUENCIES[value]) {
        throw new Error(
          "PInvalid note, Include only notes from C4 to C5, and no sharps only flats"
        );
      } else {
        const upper = value.toUpperCase();
        this._frequency = FREQUENCIES[upper];
      }
    }
  }
}

export { Note };
