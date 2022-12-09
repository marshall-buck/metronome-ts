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
const DEFAULT_TEMPO = 90;
const SECONDS_PER_MINUTE = 60;
const SCHEDULE_AHEAD_TIME = 0.1; // How frequently to call scheduling function (in milliseconds)
const LOOKAHEAD = 100; // How far ahead to schedule audio (sec)

/** Metronome class, that controls a metronome */
class Metronome extends AudioContext {
  static timerID: string | number | NodeJS.Timeout | undefined = undefined;
  static currentBeat: number = 0;

  isPlaying: boolean = false;
  volume: number = DEFAULT_VOLUME;
  notesInQueue: NoteQueue[] = [];
  tempo: number = DEFAULT_TEMPO;
  nextNoteTime: number = 0;
  // beats = sounds per bar
  timeSig: TimeSig = { beats: 8, noteValue: 4 };
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
    Metronome.currentBeat = (Metronome.currentBeat + 1) % this.timeSig.beats;
  }
  /** Pushes next note into queue */
  scheduleNote() {
    // Push the note into the queue, even if we're not playing.
    this.notesInQueue.push({
      currentBeat: Metronome.currentBeat,
      nextNoteTime: this.nextNoteTime,
    });
    this.playTone(this.nextNoteTime);
  }

  /** Schedules Notes to be played */
  scheduler = () => {
    if (Metronome.timerID) this.clearTimerID();
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.currentTime + SCHEDULE_AHEAD_TIME) {
      this.scheduleNote();
      this.nextNote();
    }

    Metronome.timerID = setInterval(this.scheduler, LOOKAHEAD);
  };
  /**Clears timerID from setInterval */
  clearTimerID = () => clearInterval(Metronome.timerID);

  /**modifies beat to compensate for playing off beats */
}

export default Metronome;
