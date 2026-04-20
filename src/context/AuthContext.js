// src/context/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from '../services/firebase';
import { saveProfile, getProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe =
    onAuthStateChanged(auth, async(firebaseUser)=>{

      if(firebaseUser){

        setUser(firebaseUser);

        const p =
        await getProfile(firebaseUser.uid);

        setProfile(p);

      }else{

        setUser(null);
        setProfile(null);

      }

      setLoading(false);

    });

    return unsubscribe;

  },[]);

  async function signup(
    email,
    password,
    displayName
  ){

    const cred =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await saveProfile(
      cred.user.uid,
      {
        displayName,
        email,
        instance:'hyd'
      }
    );

    const p =
    await getProfile(cred.user.uid);

    setProfile(p);

    return cred;

  }

  function login(email,password){

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  }

  function logout(){

    return signOut(auth);

  }

  const value = {

    user,
    profile,
    loading,
    signup,
    login,
    logout

  };

  return (

    <AuthContext.Provider value={value}>

      {!loading && children}

    </AuthContext.Provider>

  );

}

export function useAuth(){

  return useContext(AuthContext);

}