import Note from "./note.ts";

interface TimeSig {
  beats: number;
  noteValue: number;
}

interface BeatModifiers {
  n: number;
  "8": number;
  "16": number;
  d8: number;
}

interface NoteQueue {
  currentBeat: number;
  nextNoteTime: number;
}

const VOLUME_SLIDER_RAMP_TIME = 0.2;
const DEFAULT_VOLUME = 0.5;
const DEFAULT_TEMPO = 360;
const SECONDS_PER_MINUTE = 60;

// How far ahead to schedule audio (sec) .1 default
const SCHEDULE_AHEAD_TIME = 0.1;

// How frequently to call scheduling function (in milliseconds) 50 default
const LOOKAHEAD = 50;

/** Metronome class, that controls a metronome */
class Metronome extends AudioContext {
  timerID: string | number | NodeJS.Timeout | undefined = undefined;
  currentBeat: number = 0;

  isPlaying: boolean = false;
  volume: number = DEFAULT_VOLUME;
  notesInQueue: NoteQueue[] = [];
  tempo: number = DEFAULT_TEMPO;
  nextNoteTime: number = 0;
  // beats = sounds per bar
  timeSig: TimeSig = { beats: 4, noteValue: 4 };
  lastNoteDrawn: number = this.timeSig.beats - 1;
  beatModifiers: BeatModifiers = { n: 1, "8": 2, "16": 4, d8: 3 };
  masterGainNode: GainNode = new GainNode(this);

  constructor() {
    super();

    this.masterGainNode.gain.setValueAtTime(this.volume, this.currentTime);
    this.masterGainNode.connect(this.destination);
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
  /** Change Tempo */
  setTempo(tempo: number): void {
    this.tempo = tempo;
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
    this.currentBeat = (this.currentBeat + 1) % this.timeSig.beats;
  }

  /** Schedules Notes to be played */
  scheduler = () => {
    if (this.timerID) this.clearTimerID();
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.currentTime + SCHEDULE_AHEAD_TIME) {
      this.scheduleNote();
      this.nextNote();
    }

    this.timerID = setInterval(this.scheduler, LOOKAHEAD);
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
  clearTimerID = () => clearInterval(this.timerID);

  // close(): Promise<void> {
  //   this.clearTimerID();
  //   this.timerID = undefined;
  //   this.currentBeat = 0;

  //   this.isPlaying = false;
  //   this.volume = DEFAULT_VOLUME;
  //   this.notesInQueue = [];
  //   this.tempo = DEFAULT_TEMPO;
  //   this.nextNoteTime = 0;
  //   // beats = sounds per bar
  //   this.timeSig = { beats: 4, noteValue: 4 };
  //   this.lastNoteDrawn = this.timeSig.beats - 1;

  //   return super.close();
  // }

  /**modifies beat to compensate for playing off beats */
}

export default Metronome;
