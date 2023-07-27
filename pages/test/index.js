
import React, {useState, useEffect} from 'react';

const Applications = () => {
  const [state, setState] = useState([]);
  useEffect(() => {
    const getData = async () =>{
      
    const response = await fetch("/api/compliance/applications/")
      // // console.log(response)
      const data =await response.json();
      // // console.log(data)
      setState(data);
    }
    getData()
  },[])

  return (<div>

	    {state.map(m => <li>{JSON.stringify(m)}</li>)}
	  </div>)


}

export default Applications
