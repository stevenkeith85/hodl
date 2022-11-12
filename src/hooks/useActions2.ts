import { ActionSet } from "../models/HodlAction";
import axios from 'axios';
import { useState } from "react";


export const useActions2 = (limit = 14) : [any [], number, number, Function]=> {
  const [actions, setActions] = useState([]);
  const [next, setNext] = useState(0);
  const [total, setTotal] = useState(null);

  // TODO: can we still use SWR?
  const fetch = () => {
    if (next > total) {
      return;
    }

    axios.get(
      '/api/actions',
      {
        params: { set: ActionSet.Feed, offset: next, limit },
        headers: {
          'Accept': 'application/json',
        }
      })
      .then(r => r.data)
      .then(page => {
        setActions(old => [...old, ...page.items]);
        setNext(page.next);
        setTotal(page.total);
      });
  }

  return [actions, next, total, fetch]
  
}
