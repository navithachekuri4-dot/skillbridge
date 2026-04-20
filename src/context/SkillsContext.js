// src/context/SkillsContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useAuth } from "./AuthContext";

import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getAnalyses,
  saveAnalysis,
  getActivity
} from "../services/userService";

const SkillsContext = createContext(null);

export function useSkills(){
  return useContext(SkillsContext);
}

export function SkillsProvider({ children }){

  const { user } = useAuth();

  const [skills,setSkills] = useState([]);
  const [analyses,setAnalyses] = useState([]);
  const [activity,setActivity] = useState([]);
  const [streak,setStreak] = useState(0);
  const [loadingData,setLoadingData] = useState(true);


  // load firebase data
  useEffect(()=>{

    async function load(){

      if(!user) return;

      try{

        const skillsData =
        await getSkills(user.uid);

        const analysisData =
        await getAnalyses(user.uid);

        const activityData =
        await getActivity(user.uid);

        setSkills(skillsData || []);
        setAnalyses(analysisData || []);
        setActivity(activityData || []);

        setStreak(activityData?.length || 0);

      }
      catch(err){

        console.log(err);

      }

      setLoadingData(false);

    }

    load();

  },[user]);


  // create skill
  async function createSkill(skill){

    const id =
    await addSkill(user.uid,skill);

    setSkills(prev=>[
      ...prev,
      { id,...skill }
    ]);

  }


  // edit skill
  async function editSkill(id,data){

    await updateSkill(user.uid,id,data);

    setSkills(prev=>

      prev.map(s=>

        s.id===id
        ? { ...s,...data }
        : s

      )

    );

  }


  // delete skill
  async function removeSkill(id){

    await deleteSkill(user.uid,id);

    setSkills(prev=>

      prev.filter(s=>s.id!==id)

    );

  }


  // run job description analysis
  async function runAnalysis(jdText,jdTitle){

    if(!jdText) return;

    const keywords = [
      "react",
      "javascript",
      "typescript",
      "node",
      "express",
      "mongodb",
      "sql",
      "docker",
      "aws",
      "git",
      "rest api",
      "graphql",
      "system design",
      "redis",
      "kubernetes"
    ];


    const found =
    keywords.filter(word =>
      jdText.toLowerCase().includes(word)
    );


    const gaps =
    found.filter(word =>

      !skills.find(skill =>
        skill.name
        ?.toLowerCase()
        .includes(word)
      )

    );


    const result = {

      jdTitle,

      matchedSkills:
      found.length,

      gaps:
      gaps.map(g => ({

        name:g,

        freq:
        Math.floor(Math.random()*40)+60

      }))

    };


    // save in firebase
    await saveAnalysis(user.uid,result);


    // update UI
    setAnalyses(prev=>[
      result,
      ...prev
    ]);


    return result;

  }


  // calculated values
  const avgLevel =
  skills.length > 0

  ? Math.round(

    skills.reduce(
      (a,s)=>a+(s.level||0),
      0
    )

    / skills.length

  )

  : 0;


  const criticalGaps =
  analyses
  .flatMap(a=>a.gaps || [])
  .slice(0,5);


  const value = {

    skills,
    analyses,
    activity,
    streak,
    avgLevel,
    criticalGaps,
    loadingData,

    createSkill,
    editSkill,
    removeSkill,
    runAnalysis

  };


  return(

    <SkillsContext.Provider value={value}>

      {children}

    </SkillsContext.Provider>

  );

}