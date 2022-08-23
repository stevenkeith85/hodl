import axios from 'axios'

export const useStoreToken = () => {

  const store = async (tokenId, mimeType, filter, aspectRatio) => {
    try {
      const r = await axios.post(
        '/api/create/store',
        {
          tokenId,
          mimeType,
          filter,
          aspectRatio
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