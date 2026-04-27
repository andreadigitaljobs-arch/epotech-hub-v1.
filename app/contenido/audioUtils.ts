export async function mergeBlobsToWav(blobs: Blob[]): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Convert blobs to ArrayBuffers and decode to AudioBuffers
  const audioBuffers: AudioBuffer[] = [];
  for (const blob of blobs) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBuffers.push(audioBuffer);
  }

  // Calculate total length and max channels
  let totalLength = 0;
  let maxChannels = 0;
  let sampleRate = 44100;

  for (const buffer of audioBuffers) {
    totalLength += buffer.length;
    if (buffer.numberOfChannels > maxChannels) maxChannels = buffer.numberOfChannels;
    sampleRate = buffer.sampleRate; // assuming all have same sample rate
  }

  // Create empty buffer
  const finalBuffer = audioContext.createBuffer(maxChannels, totalLength, sampleRate);

  // Copy data
  let offset = 0;
  for (const buffer of audioBuffers) {
    for (let channel = 0; channel < maxChannels; channel++) {
      // Use channel 0 if this buffer is mono but maxChannels is stereo
      const sourceChannel = channel < buffer.numberOfChannels ? channel : 0;
      finalBuffer.getChannelData(channel).set(buffer.getChannelData(sourceChannel), offset);
    }
    offset += buffer.length;
  }

  // Convert to WAV
  return audioBufferToWav(finalBuffer);
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result;
  if (numChannels === 2) {
    const length = buffer.getChannelData(0).length + buffer.getChannelData(1).length;
    result = new Float32Array(length);
    const inputL = buffer.getChannelData(0);
    const inputR = buffer.getChannelData(1);
    let index = 0, inputIndex = 0;
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
  } else {
    result = buffer.getChannelData(0);
  }

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const wavBuffer = new ArrayBuffer(44 + result.length * bytesPerSample);
  const view = new DataView(wavBuffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + result.length * bytesPerSample, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, result.length * bytesPerSample, true);

  let offset = 44;
  for (let i = 0; i < result.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}
