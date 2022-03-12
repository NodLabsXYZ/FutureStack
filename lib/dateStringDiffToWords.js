import {
  timeDiffToWords
} from '.'

const dateStringDiffToWords = (oldDateString, newDateString) => {
  const oldTime = new Date(oldDateString + 'Z').getTime()
  const newTime = newDateString ? 
    new Date(newDateString + 'Z').getTime() :
    Date.now();
  return timeDiffToWords(oldTime, newTime);
}

export default dateStringDiffToWords;