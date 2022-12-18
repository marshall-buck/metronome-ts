import Note from "./note";

interface TimeSig {
  beats: number;
  noteValue: number;
}

interface TimeSigs {
  [key: string]: TimeSig;
}

interface Beat {
  quarter: number;
  eighth: number;
  sixteenth: number;
  dtdEighth: number;
}

interface NoteQueue {
  currentBeat: number;
  nextNoteTime: number;
}

const TIME_SIGS: TimeSigs = {
  0: { beats: 3, noteValue: 4 },
  1: { beats: 4, noteValue: 4 },
  2: { beats: 5, noteValue: 4 },
  3: { beats: 6, noteValue: 4 },
  4: { beats: 6, noteValue: 8 },
  5: { beats: 7, noteValue: 8 },
  6: { beats: 9, noteValue: 8 },
  7: { beats: 12, noteValue: 8 },
};

const BEATS: Beat = { quarter: 1, eighth: 2, sixteenth: 4, dtdEighth: 3 };

const VOLUME_SLIDER_RAMP_TIME = 0.2;
const DEFAULT_VOLUME = 0.5;
const DEFAULT_TEMPO = 120;
const SECONDS_PER_MINUTE = 60;

// How far ahead to schedule audio (sec) .1 default,
// this is used with interval, to overlap with next
// interval (in case interval is late)
const LOOKAHEAD = 0.1;

// How frequently to call scheduling function (in milliseconds) 100 default
const INTERVAL = 100;

/**
 * Metronome class, that controls a metronome extends {AudioContext}
 */

class Metronome extends AudioContext {
  static _timerID: string | number | NodeJS.Timeout | undefined = undefined;
  static _timeSig: TimeSig = TIME_SIGS["1"];
  static _tempo: number = DEFAULT_TEMPO;
  static _masterVolume: number = DEFAULT_VOLUME;

  public currentBeat: number = 0;
  public isPlaying: boolean = false;

  public notesInQueue: NoteQueue[] = [];
  public nextNoteTime: number = 0;
  public lastNoteDrawn: number = Metronome._timeSig.beats - 1;
  public masterGainNode: GainNode = new GainNode(this);
  public drawBeatModifier: number = BEATS.quarter;

  constructor() {
    super();

    this.masterGainNode.gain.setValueAtTime(
      Metronome._masterVolume,
      this.currentTime
    );
    this.masterGainNode.connect(this.destination);
    console.log(this);
  }

  /** Start metronome */
  start(): void {
    this.isPlaying = !this.isPlaying;
    if (this.state === "suspended") {
      this.resume();
    }

    this.nextNoteTime = this.currentTime;
  }
  /**************GETTERS AND SETTTERS*************************/
  /**Change masterGainNode volume   */
  get masterVolume() {
    return Metronome._masterVolume;
  }

  set masterVolume(volume: number) {
    this.masterGainNode.gain.exponentialRampToValueAtTime(
      volume,
      this.currentTime + VOLUME_SLIDER_RAMP_TIME
    );
  }
  /** Change Tempo getter and setters */
  get tempo() {
    return Metronome._tempo;
  }

  set tempo(value: number) {
    Metronome._tempo =
      value * Metronome.tempoModifier(Metronome._timeSig.noteValue);
  }

  /** TimeSignature getter and setters */

  get timeSig(): TimeSig {
    return Metronome._timeSig as TimeSig;
  }

  set timeSig(value: TimeSig | string) {
    const sig = TIME_SIGS[value as string];
    Metronome._timeSig = sig;
  }

  private static tempoModifier(num: number): number {
    switch (num) {
      case 16:
        return 4;

      case 8:
        return 2;

      case 4:
        return 1;

      default:
        return 1;
    }
  }

  /** Triggers the note to play */
  playTone(time: number): void {
    const note = new Note(this, this.masterGainNode);

    note.play(time);
  }

  //***********SCHEDULING******************* */

  /** Sets the next note beat, based on time signature and tempo */
  nextNote() {
    const secondsPerBeat = SECONDS_PER_MINUTE / this.tempo;
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    // Advance the beat number, wrap to 1 when reaching timeSig.beats
    this.currentBeat = (this.currentBeat + 1) % Metronome._timeSig.beats;
  }

  /** Schedules Notes to be played */
  scheduler = () => {
    if (Metronome._timerID) Metronome.clearTimerID();
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.currentTime + LOOKAHEAD) {
      this.scheduleNote();
      this.nextNote();
    }

    Metronome._timerID = setInterval(this.scheduler, INTERVAL);
  };

  /** Pushes next note into queue */
  scheduleNote() {
    // Push the note into the queue, even if we're not playing.
    this.notesInQueue.push({
      currentBeat: this.currentBeat,
      nextNoteTime: this.nextNoteTime,
    });

    this.playTone(this.nextNoteTime);
  }

  /**Clears timerID from setInterval */
  private static clearTimerID = () => {
    clearInterval(Metronome._timerID);
    Metronome._timerID = undefined;
  };

  reset() {
    console.log("reset");
    if (this.state !== "suspended") this.suspend();

    Metronome.clearTimerID();
    this.currentBeat = 0;
    this.notesInQueue.length = 0;
    this.nextNoteTime = 0;
    this.isPlaying = false;
    console.log(this);
  }

  /**modifies beat to compensate for playing off beats */
}

export default Metronome;
