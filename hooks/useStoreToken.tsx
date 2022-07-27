import axios from 'axios'

export const useStoreToken = () => {

  const store = async (tokenId, mimeType, filter) => {
    try {
      const r = await axios.post(
        '/api/mint/store',
        {
          tokenId,
          mimeType,
          filter
        },
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      return true;

    } catch (error) {
      return false;
    }
  }

  return [store];
}