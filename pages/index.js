import Link from 'next/link'

export async function getStaticProps() {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });

  // List all pads
  // http://localhost:9001/api/1.2.1/listAllPads?apikey=f50403c112c30485607554afa2cf37675ef791681ad36001134f55b05a3deca1
  let pads = null;
  try {
    pads = (await client.get('listAllPads')).data.data.padIDs;
  } catch (error) {
    console.log('Error fetching available pads');
    console.log(error.message)
  }

  return { props: { pads, } }
}

export default function (props) {
  return (
    <>
      To view static .mdx click
      <Link href='/pad'>here</Link>
      <br />
      {props.pads ? (
        <>


          Available pads from Etherpad:
          <br />
          {
            props.pads.map(pad => (
              <>
                <Link href={`/pads/${pad}`}>{pad}</Link>
                <br />
              </>
            ))
          }
        </>
      ) : 'Etherpad is not running'
      }
    </>
  )
}