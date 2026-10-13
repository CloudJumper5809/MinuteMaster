// Generates a lightweight synthetic audio WAV data-URL / Blob for testing the audio player and previewing audio files
export function generateTestAudioDataUrl(durationSeconds = 6): string {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSeconds;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + numSamples * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw PCM)
  view.setUint16(20, 1, true);
  // channel count (1 mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, numSamples * 2, true);

  // Generate a soft melodic chime chord to simulate recorded speech/chime
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Layered frequencies simulating vocal harmonics / notification
    const freq1 = 220 + Math.sin(t * 3) * 40;
    const freq2 = 440;
    const envelope = Math.max(0, 1 - (t % 1.5) / 1.5);
    const sample = (Math.sin(2 * Math.PI * freq1 * t) * 0.4 + Math.sin(2 * Math.PI * freq2 * t) * 0.3) * envelope;
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
    view.setInt16(44 + i * 2, intSample, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
