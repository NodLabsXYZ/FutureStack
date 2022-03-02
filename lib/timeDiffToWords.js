

const timeDiffToWords = (oldTime, newTime) => {
  if (!newTime) {
    newTime = Date.now()
  }
  const seconds = (newTime - oldTime) / 1000
  const numyears = Math.floor(seconds / 31536000);
  const numdays = Math.floor((seconds % 31536000) / 86400); 
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  
  const parts = []

  if (numyears === 1) parts.push(numyears + ' year ')
  else if (numyears > 0) parts.push(numyears + ' years ')
  
  else if (numdays === 1) parts.push(numdays + ' day ')
  else if (numdays > 0) parts.push(numdays + ' days ')
  
  else if (numhours === 1) parts.push(numhours + ' hour ')
  else if (numhours > 0) parts.push(numhours + ' hours ')
  
  else if (numminutes === 1) parts.push(numminutes + ' minute ')
  else if (numminutes > 0) parts.push(numminutes + ' minutes ')
  
  if (parts.length === 0) parts.push('Less than a minute ')
  
  return parts.join('') + 'ago'
}

export default timeDiffToWords;