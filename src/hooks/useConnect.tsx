import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { getProviderSignerAddress } from '../lib/getSigner';


export const useConnect = () => {
  const { setProvider, setSigner, setWalletAddress } = useContext(WalletContext);
  
  const connect = async (dialog = false): Promise<Boolean> => {
    try {
      const { provider, signer, address } = await getProviderSignerAddress(dialog);
      
      setProvider(provider);
      setSigner(signer);
      setWalletAddress(address);

      return true;
    } catch (e) {
      return false;
    }
  }
  
  return connect;
}