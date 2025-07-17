function speakText() {
  const text = document.getElementById('textInput').value;
  const selectedLang = document.getElementById('languageSelect').value;
  const pitch = document.getElementById('pitch').value;
  const rate = document.getElementById('rate').value;
  const status = document.getElementById('statusMsg');

  if (!text) {
    status.innerText = 'Please enter some text!';
    status.style.color = 'red';
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = selectedLang;
  speech.pitch = pitch;
  speech.rate = rate;

  window.speechSynthesis.speak(speech);

  status.innerText = 'Speaking...';
  status.style.color = 'white';

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
