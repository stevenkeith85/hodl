import axios from 'axios';
import { useContext } from 'react';
import { SignedInContext } from '../contexts/SignedInContext';


export const useSignOut = () => {
  const { setSignedInAddress } = useContext(SignedInContext);
  
  const signOut = async () => {
    
      const r = await axios.post(
        '/api/auth/logout',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      setSignedInAddress(null);
  }

  return signOut;
}