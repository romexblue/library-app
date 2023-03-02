import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../helpers/AuthContext';
import FloorButtons from './FloorButtons';

const Floor = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      navigate('/')
    }
  }, [navigate, authContext]);

  return (
    <div>      
      <FloorButtons />
    </div>

  )
}

export default Floor