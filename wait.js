//-------------------------------------------------------------
// function wait(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function appendCharsWithDelay(div, initialText, newString, delayMs) {
//   for (const char of newString) {
//     initialText += char; // Append the new character
//     div.textContent = initialText.slice(-15); // Update the div
//     await wait(delayMs); // Wait for the specified delay
//   }
// }