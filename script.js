const synth = window.speechSynthesis;
let voices = [];

function populateVoices() {
  voices = synth.getVoices();
  const voiceSelect = document.getElementById('voiceSelect');
  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });

  // Optionally preselect Hindi voice if available
  const hindiVoiceIndex = voices.findIndex(v => v.lang === 'hi-IN');
  if (hindiVoiceIndex >= 0) {
    voiceSelect.selectedIndex = hindiVoiceIndex;
  }
}

populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speakText() {
  const text = document.getElementById('textInput').value;
  const selectedVoiceIndex = document.getElementById('voiceSelect').value;
  const pitch = document.getElementById('pitch').value;
  const rate = document.getElementById('rate').value;
  const status = document.getElementById('statusMsg');

  if (!text) {
    status.innerText = 'Please enter some text!';
    status.style.color = 'red';
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[selectedVoiceIndex];
  utterance.pitch = pitch;
  utterance.rate = rate;
  synth.speak(utterance);

  status.innerText = 'Speaking...';
  status.style.color = 'white';

  utterance.onend = () => {
    status.innerText = 'Done!';
  };
}

// Update pitch and rate display values
document.getElementById('pitch').addEventListener('input', function () {
  document.getElementById('pitchValue').innerText = this.value;
});
document.getElementById('rate').addEventListener('input', function () {
  document.getElementById('rateValue').innerText = this.value;
});
