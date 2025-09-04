let audioContext;
let source;
let stream;

async function aux_setEnabled(state) {
  if (state) {
    if (audioContext == null) {
        audioContext = new AudioContext();

        stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });
        source = audioContext.createMediaStreamSource(stream);

        source.connect(audioContext.destination);
    }
  } else {
    source.disconnect();
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();
    audioContext = null;
  }
}

setAuxEnabled(true);