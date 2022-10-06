import { ethers } from 'ethers'

export const isValidAddress = address => ethers.utils.isAddress(address);


