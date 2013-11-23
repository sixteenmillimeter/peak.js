/*
Copyleft (כ) 2013 M McWilliams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

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