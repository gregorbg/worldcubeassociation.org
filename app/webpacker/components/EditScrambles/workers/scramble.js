import { randomScrambleForEvent } from 'cubing/scramble';

onmessage = (event) => {
  console.log('Received message from the main thread:', event.data);

  // Perform some computation
  randomScrambleForEvent(event.data).then(
    // Send the result back to the main thread
    (cubingScr) => postMessage(cubingScr.toString()),
  );
};
