{
let autoSaveSettings = false;

let audioContext;
let source;
let stream;

async function startAudio() {
    if (audioContext) return;

    audioContext = new AudioContext();
    stream = await navigator.mediaDevices.getUserMedia({ audio: storage_table.aux_audioSettings });
    source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination);
}

function stopAudio() {
    if (!audioContext) return;

    source.disconnect();
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();
    audioContext = null;
}

window.aux_setEnabled = async function (state) {
    if (state) {
        startAudio();
    } else {
        stopAudio();
    }
    if (autoSaveSettings) storage_save();
}

window.aux_setEchoCancellation = async function (state) {
    storage_table.aux_audioSettings.echoCancellation = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (autoSaveSettings) storage_save();
}

window.aux_setNoiseSuppression = async function (state) {
    storage_table.aux_audioSettings.noiseSuppression = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (autoSaveSettings) storage_save();
}

window.aux_setAutoGainControl = async function (state) {
    storage_table.aux_audioSettings.autoGainControl = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (autoSaveSettings) storage_save();
}

aux_setEnabled(storage_table.aux_enabled);
aux_setEchoCancellation(storage_table.echoCancellation);
aux_setNoiseSuppression(storage_table.noiseSuppression);
aux_setAutoGainControl(storage_table.autoGainControl);

autoSaveSettings = true;
}