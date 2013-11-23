peak.js
=========
Turn PCM audio into an array of sound data.

Example:

    var path = '/path/to/audio/file',
        sampleRate = 48000,
        lengthInSeconds = 10,
        sampleSize = 500,
        manipulate = function (v) {
            return Math.abs(v) * 5;
        };
        
    peak.get(function (audio){
        if (audio) {
            console.dir(audio);
            //Do stuff with array
        }
    }, path, sampleRate, lengthInSeconds, sampleSize, manipulate);