/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
function toHMS(sec: number): string {
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = Math.floor(sec - (hours * 3600) - (minutes * 60)); //  get seconds
  // add 0 if value < 10; Example: 2 => 02

  // @ts-ignore
  if (hours   < 10) {hours   = "0"+hours;}
  // @ts-ignore
  if (minutes < 10) {minutes = "0"+minutes;}
  // @ts-ignore
  if (seconds < 10) {seconds = "0"+seconds;}

  return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}

export { toHMS };
