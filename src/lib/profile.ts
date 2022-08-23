import { ethers } from 'ethers'

export const isValidAddress = async address => await ethers.utils.isAddress(address);


