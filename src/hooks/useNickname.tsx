import axios from 'axios'

export const useNickname = () => {
  const updateNickname = async (nickname) => {
    try {
      const r = await axios.post(
        '/api/profile/nickname',
        { nickname },
        {
          headers: {
            'Accept': 'application/json'
          },
        }
      );

      return {
        success: true,
        message: 'Successfully updated nickname'
      }

    } catch (error) {
      const { message } = await error.response.data;

      return {
        success: false,
        message
      }
    }
  }

  return updateNickname;
}
