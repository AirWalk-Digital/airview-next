import Link from 'next/link'
import { useState, useEffect, } from 'react';

import Box from '@mui/material/Box';


export default function () {
  const [padList, setPadList] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/etherpad/listAllPads`)
    .then((res) => res.json())
    .then(data => {
      setPadList(data.pads)
      // console.log('data : ', data )
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  
  }, [refreshToken]);


  return (
    <>
      
      <br />
      {padList ? (
        <>


          Available pads from Etherpad:
          <br />
          <h2>Presentations</h2>
          {
            padList.map((pad, i) => (
              <Box key={i}>
                <Link  href={`/pads/ppt/${pad}`}>{pad}</Link>
              </Box>
            ))
          }
        </>
      ) : 'Etherpad is not running'
      }
    </>
  )
}