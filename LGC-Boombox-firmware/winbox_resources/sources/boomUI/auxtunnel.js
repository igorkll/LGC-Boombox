{
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
    storage_table.aux_enabled = state;
    if (state) {
        await startAudio();
    } else {
        stopAudio();
    }
    if (window.aux_inited) storage_save();
}

window.aux_setEchoCancellation = async function (state) {
    storage_table.aux_audioSettings.echoCancellation = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (window.aux_inited) storage_save();
}

window.aux_setNoiseSuppression = async function (state) {
    storage_table.aux_audioSettings.noiseSuppression = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (window.aux_inited) storage_save();
}

window.aux_setAutoGainControl = async function (state) {
    storage_table.aux_audioSettings.autoGainControl = state;
    if (audioContext) {
        stopAudio();
        await startAudio();
    }
    if (window.aux_inited) storage_save();
}

window.aux_update = async () => {
    await aux_setEnabled(storage_table.aux_enabled);
    await aux_setEchoCancellation(storage_table.aux_audioSettings.echoCancellation);
    await aux_setNoiseSuppression(storage_table.aux_audioSettings.noiseSuppression);
    await aux_setAutoGainControl(storage_table.aux_audioSettings.autoGainControl);
};

aux_update();

}