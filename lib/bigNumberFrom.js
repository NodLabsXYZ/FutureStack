import { ethers } from 'ethers';

const bigNumberFrom = (number) =>
  ethers.BigNumber.from(number);

export default bigNumberFrom;