import React, { useEffect, useState } from 'react'
import UsersData from '../pages/UsersData'
import axios from 'axios';

function RegisteredUserContainer() {

  const [users, setUsers] = useState([]);

  const getData = async () => {

    try{

      let response = await axios.get(`http://localhost:3000/users`);
      setUsers(response.data);
    }
    catch(err){
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {

        users.length != 0 ? (
          <div>

            <UsersData data={users}/>
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

export default RegisteredUserContainer;