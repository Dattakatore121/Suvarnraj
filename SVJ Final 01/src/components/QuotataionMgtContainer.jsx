import { useEffect, useState } from 'react';
import Quotations from '../pages/Quotations';
import axios from 'axios';

function QuotataionMgtContainer() {

  const [quotCustomers, setCustomers] = useState([]);

  const getCustomers = async () => {
    try{
        let response = await axios.get(`http://localhost:3000/quotCusts`);
        setCustomers(response.data);
    }
    catch(err){
        console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div>
      {
        quotCustomers.length != 0 ? (
          <div>
            <Quotations data={quotCustomers}/>
          </div>
        ) : (
          <div>
            Loading..
          </div>
        )
      }
    </div>
  )
}

export default QuotataionMgtContainer;