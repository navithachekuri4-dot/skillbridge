// src/services/userService.js

import { db } from "./firebase";

import {
 collection,
 doc,
 getDocs,
 getDoc,
 addDoc,
 updateDoc,
 deleteDoc,
 setDoc
} from "firebase/firestore";


// =============================
// PROFILE
// =============================

// save user profile
export async function saveProfile(userId,data){

 await setDoc(

  doc(
   db,
   "users",
   userId
  ),

  data,

  { merge:true }

 );

}


// get user profile
export async function getProfile(userId){

 const ref =
 doc(
  db,
  "users",
  userId
 );

 const snapshot =
 await getDoc(ref);

 return snapshot.exists()

  ? snapshot.data()

  : null;

}



// =============================
// SKILLS
// =============================

export async function getSkills(userId){

 const ref =
 collection(
  db,
  "users",
  userId,
  "skills"
 );

 const snapshot =
 await getDocs(ref);

 return snapshot.docs.map(doc=>({

  id:doc.id,
  ...doc.data()

 }));

}


export async function addSkill(userId,skill){

 const ref =
 collection(
  db,
  "users",
  userId,
  "skills"
 );

 const docRef =
 await addDoc(ref,skill);

 return docRef.id;

}


export async function updateSkill(userId,skillId,data){

 const ref =
 doc(
  db,
  "users",
  userId,
  "skills",
  skillId
 );

 await updateDoc(ref,data);

}


export async function deleteSkill(userId,skillId){

 const ref =
 doc(
  db,
  "users",
  userId,
  "skills",
  skillId
 );

 await deleteDoc(ref);

}



// =============================
// ANALYSIS
// =============================

export async function getAnalyses(userId){

 const ref =
 collection(
  db,
  "users",
  userId,
  "analysis"
 );

 const snapshot =
 await getDocs(ref);

 return snapshot.docs.map(doc=>({

  id:doc.id,
  ...doc.data()

 }));

}


export async function saveAnalysis(userId,data){

 await addDoc(

 collection(
  db,
  "users",
  userId,
  "analysis"
 ),

 data

 );

}



// =============================
// ACTIVITY
// =============================

export async function logActivity(userId,date){

 await setDoc(

  doc(
   db,
   "users",
   userId,
   "activity",
   date
  ),

  { date }

 );

}


export async function getActivity(userId){

 const ref =
 collection(
  db,
  "users",
  userId,
  "activity"
 );

 const snapshot =
 await getDocs(ref);

 return snapshot.docs.map(doc=>doc.data());

}