import Note from "./note";
import { ctx, VOLUME_SLIDER_RAMP_TIME, DEFAULT_VOLUME } from "./audioCtx";

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
  trips: number;
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

const BEAT_MODS: Beat = { quarter: 1, eighth: 2, sixteenth: 4, trips: 3 };

const DEFAULT_TEMPO = 120;
const SECONDS_PER_MINUTE = 60;
const PITCH_RAMP_TIME = 0.1;

// How far ahead to schedule audio (sec) .25 default,
// this is used with interval, to overlap with next
// interval (in case interval is late)
const LOOKAHEAD = 0.25;

// How frequently to call scheduling function (in milliseconds) 100 default
const INTERVAL = 100;

/**
 * Metronome class, that controls a metronome extends {AudioContext}
 */

class Metronome {
  private _timerID: string | number | NodeJS.Timeout | undefined = undefined;
  private _drawBeatModifier: number = BEAT_MODS.quarter;

  private _timeSig: TimeSig = TIME_SIGS["1"];
  private _soundsPerBar = this._timeSig.beats * this._drawBeatModifier;
  public _tempo: number = DEFAULT_TEMPO;

  private static _adjustedTempo: number | null = null;
  // private static _adjustedTimeSigBeats: number | null;
  private _masterVolume: number = DEFAULT_VOLUME;
  public ctx: AudioContext;
  public currentBeat: number = 0;
  public isPlaying: boolean = false;
  public currentTime = ctx.currentTime;
  public notesInQueue: NoteQueue[] = [];
  public nextNoteTime: number = 0;
  public lastNoteDrawn: number = this._timeSig.beats - 1;
  public masterGainNode: GainNode = new GainNode(ctx);

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.masterGainNode.gain.setValueAtTime(
      this._masterVolume,
      this.ctx.currentTime
    );
    this.masterGainNode.connect(this.ctx.destination);
  }

  /** Start metronome */
  start(): void {
    this.isPlaying = !this.isPlaying;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.nextNoteTime = this.ctx.currentTime;
  }
  /**************GETTERS AND SETTERS*************************/
  /**Change masterGainNode volume   */
  get masterVolume() {
    return this._masterVolume;
  }

  set masterVolume(volume: number) {
    this.masterGainNode.gain.exponentialRampToValueAtTime(
      volume,
      this.ctx.currentTime + VOLUME_SLIDER_RAMP_TIME
    );
  }
  /** Change Tempo getter and setters */
  get tempo() {
    return this._tempo;
  }

  set tempo(value: number) {
    // const mod = Metronome.tempoModifier();
    // this._tempo = value * this._drawBeatModifier;

    this._tempo = value;
    Metronome._adjustTempo(value, this._drawBeatModifier);
  }

  /** TimeSignature getter and setters */

  get timeSig(): TimeSig {
    return this._timeSig as TimeSig;
  }

  set timeSig(value: TimeSig | string) {
    const sig = TIME_SIGS[value as string];
    this._timeSig = sig;
    this._soundsPerBar = this._timeSig.beats * this._drawBeatModifier;
  }
  /** public drawBeatModifier */
  get drawBeatModifier() {
    return this._drawBeatModifier;
  }

  /**   Metronome beats to play sound
   * choices are 'quarter, 'eighth', 'sixteenth' 'trips'
   */
  beatsToPlay(division: string = "quarter") {
    if (division in BEAT_MODS) {
      const mod = division as keyof Beat;
      this._drawBeatModifier = BEAT_MODS[mod];
      this._soundsPerBar = this._timeSig.beats * this._drawBeatModifier;
      Metronome._adjustTempo(this.tempo, this._drawBeatModifier);
    } else {
      throw new Error(
        "Value must be a string 'quarter, 'eighth', 'sixteenth' 'trips' "
      );
    }
  }

  private static _adjustTempo(tempo: number, mod: number): void {
    Metronome._adjustedTempo = tempo * mod;
  }
  //***********SCHEDULING******************* */

  /** Triggers the note to play */
  private playTone(time: number): void {
    const note = new Note(this.ctx, this.masterGainNode);
    // sets the division beats
    if (this.currentBeat % this._drawBeatModifier !== 0) {
      note.setPitch(100, PITCH_RAMP_TIME);
    }
    // sets beat1 pitch
    if (this.currentBeat === 0) {
      note.setPitch(1000, PITCH_RAMP_TIME);
    }
    note.play(time);
  }

  /** Pushes next note into queue */
  private scheduleNote() {
    // Push the note into the queue, even if we're not playing.
    this.notesInQueue.push({
      currentBeat: this.currentBeat,
      nextNoteTime: this.nextNoteTime,
    });

    this.playTone(this.nextNoteTime);
  }

  /** Sets the next note beat, based on time signature and tempo */
  private nextNote() {
    const secondsPerBeat =
      SECONDS_PER_MINUTE / (Metronome._adjustedTempo ?? this.tempo);
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    // Advance the beat number, wrap to 1 when reaching timeSig.beats
    this.currentBeat = (this.currentBeat + 1) % this._soundsPerBar;
  }

  /** Starts scheduling note to be played*/
  public scheduler = () => {
    if (this._timerID) this.clearTimerID();
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.ctx.currentTime + LOOKAHEAD) {
      this.scheduleNote();
      this.nextNote();
    }

    this._timerID = setInterval(this.scheduler, INTERVAL);
  };

  public shouldDrawNote(): boolean | number {
    let drawNote = this.lastNoteDrawn;

    while (
      this.notesInQueue.length &&
      this.notesInQueue[0].nextNoteTime < this.ctx.currentTime
    ) {
      drawNote = this.notesInQueue[0].currentBeat;
      this.notesInQueue.shift(); // Remove note from queue
    }

    // We only need to draw if the note has moved.
    if (this.lastNoteDrawn !== drawNote) {
      this.lastNoteDrawn = drawNote;
      return drawNote;
    }
    return false;
  }

  /**Clears timerID from setInterval */
  private clearTimerID = () => {
    clearInterval(this._timerID);
    this._timerID = undefined;
  };
  /** Suspends audioContext and resets metronome to beat 1 */
  public reset() {
    if (this.ctx.state !== "suspended") this.ctx.suspend();

    this.clearTimerID();
    this.currentBeat = 0;
    this.notesInQueue.length = 0;
    this.nextNoteTime = 0;
    this.isPlaying = false;
  }
}

const mn = new Metronome(ctx);
export { mn };
