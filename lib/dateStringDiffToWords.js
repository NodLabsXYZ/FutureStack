import {
  timeDiffToWords
} from '.'

const dateStringDiffToWords = (oldDateString, newDateString) => {
  const oldTime = new Date(oldDateString).getTime()
  const newTime = newDateString ? 
    new Date(newDateString).getTime() :
    Date.now();
  return timeDiffToWords(oldTime, newTime);
}

export default dateStringDiffToWords;