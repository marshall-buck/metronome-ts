import "./style.css";

import Metronome from "./models/metronome";

const mn: Metronome = new Metronome();

let anF: number;

/******************* START/PAUSE *****************************/
const startButton = document.querySelector("#start") as HTMLInputElement;

/** Toggle button to show Stop or Start */
function toggleStartButton() {
  if (startButton.innerText === "Start") startButton.innerText = "Stop";
  else startButton.innerText = "Start";
}

/** Handles starting/Stopping metronome */
function handleStart() {
  mn.start();
  toggleStartButton();

  if (mn.isPlaying) {
    // Start playing
    mn.scheduler(); // kick off scheduling
    anF = requestAnimationFrame(animatePads); // start the drawing loop.
  } else {
    mn.reset();
    cancelAnimationFrame(anF);
  }
}

startButton?.addEventListener("click", handleStart);

/******************* TEMPO CONTROL *****************************/
const tempoSlider: HTMLInputElement = document.querySelector(
  "input[name=tempo]"
) as HTMLInputElement;
tempoSlider.value = mn.tempo.toString();
const tempoLabel = document.querySelector(
  "label[for=tempo] span"
) as HTMLElement;
tempoLabel.innerText = mn.tempo.toString();
/** Handler to change Tempo */
function changeTempoHandler(e: Event) {
  const target = e.target as HTMLInputElement;
  const tempo = +target.value;
  mn.tempo = tempo;
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
  mn.setVolume(+target.value);
}

masterVolume?.addEventListener("input", volumeSliderHandler);

/******************* DRAW PADS CONTROL *****************************/
const selectTimeSig = document.querySelector("#time-sig");

/** Handles resetting pads to proper amount of beats */
function populatePadsHandler(e: Event) {
  const target = e.target as HTMLSelectElement;
  const padContainer = document.querySelector(
    "#beats-container"
  ) as HTMLElement;
  padContainer.innerHTML = "";

  const beats = numberOfPads(target.value);
  for (let i = 0; i < beats; i++) {
    const pad = document.createElement("div");
    pad.className = "beat";
    padContainer?.appendChild(pad);
  }
}

/** return number of pads to draw */
function numberOfPads(beats: string): number {
  mn.timeSig = beats;
  return mn.timeSig.beats;
}

selectTimeSig?.addEventListener("input", populatePadsHandler);

/** function to update the UI, so we can see when the beat progress.
 This is a loop: it reschedules itself to redraw at the end. */
function animatePads() {
  let drawNote = mn.lastNoteDrawn;
  const currentTime = mn.currentTime;
  const pads = document.querySelectorAll(".beat");
  while (
    mn.notesInQueue.length &&
    mn.notesInQueue[0].nextNoteTime < currentTime
  ) {
    drawNote = mn.notesInQueue[0].currentBeat;
    mn.notesInQueue.shift(); // Remove note from queue
  }

  // We only need to draw if the note has moved.
  // TODO:  Figure out offBeats

  if (mn.lastNoteDrawn !== drawNote) {
    pads.forEach((pad, idx) => {
      //  To highlight beat every n beats drawNote/ n
      // idx === drawNote / 2 will act like eight notes, must
      //  also set time sig beats to 8

      if (idx === drawNote / mn.playBeat) {
        pad.classList.toggle("active");
      } else pad.setAttribute("class", "beat");
    });

    mn.lastNoteDrawn = drawNote;
  }
  // Set up to draw again
  anF = requestAnimationFrame(animatePads);
}
