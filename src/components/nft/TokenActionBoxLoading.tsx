import { LikesLoading } from '../LikesLoading';
import { CommentsLoading } from '../CommentsLoading';
import { ShareIcon } from '../icons/ShareIcon';

export default function TokenActionBoxLoading({ }) {
  return (<div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <LikesLoading />
      <CommentsLoading />
    </div>
    <ShareIcon size={20} fill={'#ddd'} />
  </div>
  )
}