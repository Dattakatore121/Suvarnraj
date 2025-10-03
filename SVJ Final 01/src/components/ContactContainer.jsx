import React, { useEffect, useState } from 'react'
import Contact from '../pages/Contact'
import axios from 'axios';

function ContactContainer() {


  const [usersEnquiry, setUsers] = useState([]);

  const getEnquiryData = async () => {

    try{

      let response = await axios.get(`http://localhost:3000/enquiredUsers`);
      setUsers(response.data);
    }
    catch(err){
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getEnquiryData();
  }, []);

  return (
    <div>
      {

        usersEnquiry.length != 0 ? (
          <div>
            <Contact data={usersEnquiry}/>
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

export default ContactContainer;