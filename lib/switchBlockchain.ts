const switchBlockchain = async (window: any, chainId: number): Promise<boolean> => {
  const networkHex = '0x' + chainId.toString(16)

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkHex }]
    });
  } catch (error) {
    console.error(error);
    return false
  }
  return true
}

export default switchBlockchain;