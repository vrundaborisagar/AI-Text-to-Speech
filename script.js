const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth.getVoices();
  const voiceSelect = document.getElementById('voiceSelect');
  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });

  const googleVoiceIndex = voices.findIndex(v => v.name.includes('Google UK English Female'));
  if (googleVoiceIndex >= 0) {
    voiceSelect.selectedIndex = googleVoiceIndex;
  }
}

window.speechSynthesis.onvoiceschanged = loadVoices;

function speakText() {
  const text = document.getElementById('textInput').value;
  const selectedVoice = document.getElementById('voiceSelect').value;
  const pitch = document.getElementById('pitch').value;
  const rate = document.getElementById('rate').value;
  const status = document.getElementById('statusMsg');

  if (!text) {
    status.innerText = ' Please enter some text!';
    status.style.color = 'red';
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  speech.voice = voices[selectedVoice];
  speech.pitch = pitch;
  speech.rate = rate;
  synth.speak(speech);

  status.innerText = 'Speaking...';
  status.style.color = '#0072ff';

  speech.onend = () => {
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
