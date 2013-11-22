var peak = {};

peak.reset = function () {
    peak.bufferLoader = null;
    peak.bufferList = null;
    peak.buffer = null;
    peak.context = null;
    peak.callback = null;
    
    peak.sampleRate = null;
    peak.sampleSize = 1;
    peak.lengthInSeconds = null;
    peak.manupulate = null;
};

peak.reset();

peak.loaded = function (buffers) {
    peak.bufferList = buffers;
    peak.buffer = peak.bufferList[0];
    var data = peak.buffer.getChannelData(0),
        normal = [];
    
    for (var i = 0, z = 0; i < data.length; i = i + peak.sampleSize) {
        if (peak.manipulate !== null && peak.manipulate !== undefined) {
            normal[z] = peak.manipulate(data[i]);
        } else {
            normal[z] = data[i] + 0;
        }
        z++;
    }
    if (peak.callback !== null) {
        peak.callback(normal);
        peak.reset();
    }
};

peak.get = function (callback, path, sampleRate, lengthInSeconds, sampleSize, manipulate) {
    if (path !== undefined) {
        peak.callback = callback;
        if (sampleRate) peak.sampleRate = sampleRate || 48000;
        if (manipulate) peak.manipulate = manipulate || null;
        if (sampleSize) peak.sampleSize = sampleSize || 1;
        if (typeof webkitOfflineAudioContext == 'function') {
          peak.context = new webkitOfflineAudioContext(1, sampleRate * lengthInSeconds, sampleRate);
        } else {
          peak.context = new webkitAudioContext(1, sampleRate * lengthInSeconds, sampleRate);
        }
        peak.bufferLoader = new BufferLoader(
            peak.context,
            path,
            peak.loaded
        );
        peak.bufferLoader.load();
    } else {
        throw('Please provide path to audio file');
    }
};