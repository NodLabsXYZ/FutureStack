import { ethers } from 'ethers';

const commify = (number) => 
  ethers.utils.commify(
    ethers.BigNumber.from(number)
  );

export default commify;