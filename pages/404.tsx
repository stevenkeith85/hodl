import { HodlImpactAlert } from '../components/HodlImpactAlert'
import { authenticate } from '../lib/jwt';


export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);
  
    return {
      props: {
        address: req.address || null,
      }
    }
  }


const NotFound = ({ address}) => (
    <HodlImpactAlert
        title="Failure To Launch"
        message="Sorry, we can't find that page"
    />
)

export default NotFound