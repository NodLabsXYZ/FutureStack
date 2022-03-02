const ethereumNetworkIdToName = (networkId) => {
  switch (networkId.toString()) {
    case "1": return 'Mainnet';
    case "3": return 'Ropsten';
    case "4": return 'Rinkeby';
    case "5": return 'Goerli';
    case "6": return 'Kotti';
    case "42": return 'Kovan'
    case "61": return 'Classic';
    case "63": return 'Mordor';
  }
}

export default ethereumNetworkIdToName;