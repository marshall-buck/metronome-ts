import "./style.css";

import Metronome from "./models/metronome";

const metronome: Metronome = new Metronome();

let anF: number;

/******************* START/STOP *****************************/
const startButton = document.querySelector("#start") as HTMLInputElement;

/** Toggle button to show Stop or Start */
function toggleStartButton() {
  if (!metronome.isPlaying) startButton.innerText = "Start";
  else startButton.innerText = "Stop";
}

/** Handles starting/Stopping metronome */
function handleStart() {
  metronome.start();
  toggleStartButton();

  if (metronome.isPlaying) {
    // Start playing

    // Check if context is in suspended state (autoplay policy)
    if (metronome.state === "suspended") {
      metronome.resume();
    }

    metronome.scheduler(); // kick off scheduling
    anF = requestAnimationFrame(draw); // start the drawing loop.
  } else {
    metronome.clearTimerID();
    cancelAnimationFrame(anF);
  }
}

startButton?.addEventListener("click", handleStart);

/******************* TEMPO CONTROL *****************************/
const tempoSlider: HTMLInputElement = document.querySelector(
  "input[name=tempo]"
) as HTMLInputElement;
const tempoLabel = document.querySelector(
  "label[for=tempo] span"
) as HTMLElement;

/** Handler to change Tempo */
function changeTempoHandler(e: Event) {
  const target = e.target as HTMLInputElement;
  const tempo = +target.value;
  metronome.setTempo(tempo);
  tempoLabel.innerText = target.value;
}

tempoSlider?.addEventListener("input", changeTempoHandler);

/******************* VOLUME CONTROL *****************************/
const masterVolumeLabel = document.querySelector(
  "label[for=master-volume] span"
) as HTMLElement;
const masterVolume: HTMLInputElement | null = document.querySelector(
  "input[name=master-volume]"
);
function volumeSliderHandler(e: Event) {
  const target = e.target as HTMLInputElement;
  masterVolumeLabel.innerText = target.value;
  metronome.setVolume(+target.value);
}

masterVolume?.addEventListener("input", volumeSliderHandler);

/******************* DRAW PADS CONTROL *****************************/
const pads = document.querySelectorAll(".beat");

/** function to update the UI, so we can see when the beat progress.
 This is a loop: it reschedules itself to redraw at the end. */
function draw() {
  // console.log("draw called");

  let drawNote = metronome.lastNoteDrawn;
  const currentTime = metronome.currentTime;
  const notesInQueue = metronome.notesInQueue;

  while (notesInQueue.length && notesInQueue[0].nextNoteTime < currentTime) {
    drawNote = notesInQueue[0].currentBeat;
    notesInQueue.shift(); // Remove note from queue
  }

  // We only need to draw if the note has moved.
  // TODO:  Figure out offBeats

  if (metronome.lastNoteDrawn !== drawNote) {
    pads.forEach((pad, idx) => {
      //  To highlight beat every n beats drawNote/ n
      // idx === drawNote / 2 will act like eight notes, must also set time sig beats to 8

      if (idx === drawNote) {
        pad.classList.toggle("active");
      } else pad.setAttribute("class", "beat");
    });

    metronome.lastNoteDrawn = drawNote;
  }
  // Set up to draw again
  anF = requestAnimationFrame(draw);
}
