// src/pages/Dashboard.js

import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import SkillBar from '../components/SkillBar';
import GapCard from '../components/GapCard';
import ActivityGrid from '../components/ActivityGrid';
import { useSkills } from '../context/SkillsContext';
import { useNavigate } from 'react-router-dom';


// fallback demo data
const DEFAULT_SKILLS = [
  { name: 'React.js', level: 82 },
  { name: 'JavaScript', level: 75 },
  { name: 'CSS/Tailwind', level: 68 },
  { name: 'TypeScript', level: 20 },
  { name: 'Node.js', level: 45 },
];

const DEFAULT_GAPS = [
  { name: 'TypeScript', freq: 89, status: 'missing' },
  { name: 'Jest + RTL', freq: 64, status: 'beginner' },
  { name: 'System Design', freq: 58, status: null },
  { name: 'REST API design', freq: 51, status: 'learning' },
  { name: 'Docker basics', freq: 40, status: 'low priority' },
];


export default function Dashboard(){

 const {
  skills,
  analyses,
  activity,
  streak,
  avgLevel,
  criticalGaps
 } = useSkills();

 const navigate = useNavigate();


 // prevent undefined errors
 const safeSkills = skills || [];
 const safeGaps = criticalGaps || [];
 const safeActivity = activity || [];


 // show firebase data if available
 const displaySkills = useMemo(()=>{

  if(safeSkills.length > 0)
   return safeSkills.slice(0,5);

  return DEFAULT_SKILLS;

 },[safeSkills]);


 const displayGaps = useMemo(()=>{

  if(safeGaps.length > 0)
   return safeGaps;

  return DEFAULT_GAPS;

 },[safeGaps]);


 const readiness =
 avgLevel > 0
 ? avgLevel
 : 68;


 const skillCount =
 safeSkills.length > 0
 ? safeSkills.length
 : 14;


 const gapCount =
 displayGaps.length;


 const currentStreak =
 streak > 0
 ? streak
 : 12;


 const syncLabel =
 'synced just now';



 return(

 <Layout>

 <div style={styles.page}>


 {/* header */}

 <div style={styles.topbar}>

 <div>

 <div style={styles.filepath}>

 // overview.tsx

 </div>

 <div style={styles.pageTitle}>

 Command Center

 </div>

 </div>


 <div style={styles.liveChip}>

 <span style={styles.liveDot}/>

 live · {syncLabel}

 </div>

 </div>



 {/* stats */}

 <div style={styles.statRow}>

 <StatCard

 label="READINESS"

 value={readiness}

 unit="%"

 sub="auto calculated"

 />

 <StatCard

 label="SKILLS TRACKED"

 value={skillCount}

 unit=" skills"

 sub="firebase data"

 />

 <StatCard

 label="GAP COUNT"

 value={gapCount}

 unit=" gaps"

 sub="analysis"

 subColor="#f85149"

 />

 <StatCard

 label="STREAK"

 value={currentStreak}

 unit=" days"

 sub="activity log"

 subColor="#8b949e"

 />

 </div>



 {/* main content */}

 <div style={styles.contentRow}>


 {/* gap analysis */}

 <div style={styles.gapPanel}>


 <div style={styles.panelHeader}>

 <span style={styles.panelLabel}>

 GAP_ANALYSIS.JSON

 </span>


 <div style={styles.jdChip}>

 {gapCount} gaps

 </div>

 </div>



 <div style={styles.gapList}>

 {displayGaps.map((gap,i)=>(

 <GapCard

 key={i}

 name={gap.name}

 freq={gap.freq}

 status={gap.status}

 />

 ))}

 </div>



 <button

 style={styles.analyzeBtn}

 onClick={()=>navigate('/analyze')}

 >

 + run new analysis

 </button>


 </div>



 {/* right column */}

 <div style={styles.rightCol}>


 {/* skills */}

 <div style={styles.panel}>


 <div style={styles.panelHeader}>

 <span style={styles.panelLabel}>

 SKILL_SNAPSHOT[]

 </span>


 <span style={styles.avgChip}>

 avg {readiness}%

 </span>

 </div>



 <div style={{marginTop:16}}>

 {displaySkills.map((s,i)=>(

 <SkillBar

 key={i}

 name={s.name}

 level={s.level}

 />

 ))}

 </div>



 <button

 style={styles.viewAllBtn}

 onClick={()=>navigate('/skills')}

 >

 view all skills →

 </button>


 </div>



 {/* activity */}

 <div style={styles.panel}>

 <ActivityGrid

 activity={safeActivity}

 />

 </div>


 </div>


 </div>


 </div>

 </Layout>

 );

}



const styles = {

 page:{

  padding:24,

  display:'flex',

  flexDirection:'column',

  gap:20

 },

 topbar:{

  display:'flex',

  justifyContent:'space-between'

 },

 filepath:{

  fontSize:11,

  color:'#6e7681'

 },

 pageTitle:{

  fontSize:22,

  fontWeight:700,

  color:'#e6edf3'

 },

 liveChip:{

  fontSize:11,

  color:'#8b949e'

 },

 liveDot:{

  width:7,

  height:7,

  borderRadius:'50%',

  background:'#3fb950'

 },

 statRow:{

  display:'flex',

  gap:16

 },

 contentRow:{

  display:'flex',

  gap:16

 },

 gapPanel:{

  flex:1,

  background:'#1c2128',

  padding:20

 },

 rightCol:{

  width:280,

  display:'flex',

  flexDirection:'column',

  gap:16

 },

 panel:{

  background:'#1c2128',

  padding:16

 },

 panelHeader:{

  display:'flex',

  justifyContent:'space-between'

 },

 panelLabel:{

  fontSize:10,

  color:'#6e7681'

 },

 jdChip:{

  fontSize:10,

  color:'#f85149'

 },

 avgChip:{

  fontSize:10,

  color:'#6e7681'

 },

 gapList:{

  marginTop:8

 },

 analyzeBtn:{

  marginTop:16

 },

 viewAllBtn:{

  marginTop:12,

  color:'#388bfd'

 }

};