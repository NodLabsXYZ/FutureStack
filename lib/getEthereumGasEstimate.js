import { ethers } from 'ethers';

const getEthereumGasEstimate = async (provider, abi, bytecode, deployArguments) => {
  if (!provider) return;

  const signer = provider.getSigner()
  const network = await provider.getNetwork()
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const transaction = await factory.getDeployTransaction(...deployArguments)
  const gasEstimate = await provider.estimateGas(transaction)
  
  return {
    network: network.chainId,
    gas: ethers.BigNumber.from(gasEstimate).toNumber()
  }
}

export default getEthereumGasEstimate;