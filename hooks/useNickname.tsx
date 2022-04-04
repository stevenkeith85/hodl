import { useContext, useState } from 'react';
import { trim } from '../lib/utils';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useNickname = () => {
  const { jwt, setNickname } = useContext(WalletContext);
  const [connect] = useConnect();
  const [updateErrors, setUpdateErrors] = useState([]);

  const updateNickname = async (nickname) => {
    try {
        setUpdateErrors([]);

        const r = await fetch('/api/nickname', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': jwt
            }),
            body: JSON.stringify({
                nickname: trim(nickname).toLowerCase()
            })
        });

        if (r.status === 403) {
          await connect(false);
        } else if (r.status === 200) {  
          setNickname(nickname);
        } else {
          const { message } = await r.json();
          setUpdateErrors([message])
        }

    } catch (e) {
        console.log(e)
    }
}

return [updateNickname, updateErrors, setUpdateErrors];
}