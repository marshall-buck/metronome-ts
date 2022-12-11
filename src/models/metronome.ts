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
// Play quarters
// timeSig.beats = 4
// playBeat = 4
// tempo mod = 1

// Play eight notes, only show quarter notes
// timeSig.beats = 8
// playBeat = 8
// tempoModifier = 2

// Play 16 notes, only show quarter notes
// timeSig.beats = 16
// playBeat = 8
// tempoModifier = 4

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
const DEFAULT_TEMPO = 60;
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
  timerID: string | number | NodeJS.Timeout | undefined = undefined;
  currentBeat: number = 0;
  isPlaying: boolean = false;
  volume: number = DEFAULT_VOLUME;
  notesInQueue: NoteQueue[] = [];
  tempoModifier: number = 1;
  _tempo: number = DEFAULT_TEMPO * this.tempoModifier;
  nextNoteTime: number = 0;

  _timeSig: TimeSig = TIME_SIGS["1"];
  lastNoteDrawn: number = this._timeSig.beats - 1;
  masterGainNode: GainNode = new GainNode(this);
  playBeat: number = BEATS.quarter;

  constructor() {
    super();

    this.masterGainNode.gain.setValueAtTime(this.volume, this.currentTime);
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

  /**Change masterGainNode volume   */
  setVolume(volume: number): void {
    this.masterGainNode.gain.exponentialRampToValueAtTime(
      volume,
      this.currentTime + VOLUME_SLIDER_RAMP_TIME
    );
  }
  /** Change Tempo getter and setters */
  get tempo() {
    return this._tempo;
  }

  set tempo(value: number) {
    this._tempo = value * this.tempoModifier;
  }

  /** TimeSignature getter and setters */

  get timeSig(): TimeSig | string {
    return this._timeSig;
  }

  set timeSig(value: TimeSig | string) {
    const sig = (): TimeSig => TIME_SIGS[value as string];
    this._timeSig = sig();
  }

  /** Triggers the note to play */
  playTone(time: number): void {
    const note = new Note(this, this.masterGainNode);
    if (this.currentBeat % this.playBeat !== 0) note.setPitch(700);
    note.play(time);
  }

  //***********SCHEDULING******************* */

  /** Sets the next note beat, based on time signature and tempo */
  nextNote() {
    const secondsPerBeat = SECONDS_PER_MINUTE / this.tempo;
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    // Advance the beat number, wrap to 1 when reaching timeSig.beats
    this.currentBeat = (this.currentBeat + 1) % this._timeSig.beats;
  }

  /** Schedules Notes to be played */
  scheduler = () => {
    if (this.timerID) this.clearTimerID();
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.currentTime + LOOKAHEAD) {
      this.scheduleNote();
      this.nextNote();
    }

    this.timerID = setInterval(this.scheduler, INTERVAL);
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
  clearTimerID = () => {
    clearInterval(this.timerID);
    this.timerID = undefined;
  };

  reset() {
    console.log("reset");
    if (this.state !== "suspended") this.suspend();

    this.clearTimerID();
    this.currentBeat = 0;
    this.notesInQueue.length = 0;
    this.nextNoteTime = 0;
    this.isPlaying = false;
    console.log(this);
  }

  /**modifies beat to compensate for playing off beats */
}

export default Metronome;
