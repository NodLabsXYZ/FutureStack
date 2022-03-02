import { ethers } from 'ethers';

const bigNumberToEth = (bigNumber) => 
  ethers.utils.formatEther(
    ethers.BigNumber.from(bigNumber)
  )

export default bigNumberToEth;