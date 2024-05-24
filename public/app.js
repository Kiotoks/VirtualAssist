const recordButton = document.getElementById('recordButton');
const statusDisplay = document.getElementById('status');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('click', async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startRecording();
    } else if (mediaRecorder.state === 'recording') {
        stopRecording();
    }
});

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.mp3');

        await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        statusDisplay.textContent = 'Recording uploaded!';
    };

    mediaRecorder.start();
    recordButton.textContent = 'Stop Recording';
    statusDisplay.textContent = 'Recording...';
}

function stopRecording() {
    mediaRecorder.stop();
    recordButton.textContent = 'Start Recording';
    statusDisplay.textContent = 'Processing...';
}
