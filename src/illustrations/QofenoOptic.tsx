import { useId } from "react";

/* An orthographic assembly drawing. Circles perpendicular to the optical axis
   project as ellipses; grooves, lens curves and screw heads share that frame. */
const ink = "#26221c";
const ivory = "#f6f1e7";
const accent = "#ad482c";
const squash = 0.455;
const tau = 2 * Math.PI;
const seq = (length: number) => Array.from({length}, (_, index) => index);
const round = (value: number) => Number(value.toFixed(2));
const point = (x: number, y: number) => `${round(x)},${round(y)}`;
const polar = (x: number, r: number, t: number) => point(x + r * squash * Math.cos(t), r * Math.sin(t));
const ellipse = (x: number, r: number) => `M${point(x, -r)}a${round(r*squash)},${r} 0 1 1 -.01,0Z`;
const annulus = (x: number, outer: number, inner: number) => ellipse(x, outer) + ellipse(x, inner);
const wall = (x: number, end: number, r: number) =>
  `M${point(x, -r)}H${end}a${round(r*squash)},${r} 0 0 1 0,${2*r}H${x}a${round(r*squash)},${r} 0 0 0 0,${-2*r}Z`;
const arc = (x: number, r: number, a: number, b: number) =>
  `M${polar(x,r,a)}A${round(r*squash)},${r} 0 ${b-a > Math.PI ? 1 : 0} 1 ${polar(x,r,b)}`;

// Adapt the starter's seeded stippling to a small repeating lithographic screen.
// Its variable radius and naturally uneven spacing remain legible in a small print.
function dotScreen(seed: number, count: number) {
  function rand() {
    seed |= 0;
    seed = seed + 0x6d2b79f5 | 0;
    let h = Math.imul(seed ^ seed >>> 15, 1 | seed);
    h = h + Math.imul(h ^ h >>> 7, 61 | h) ^ h;
    return ((h ^ h >>> 14) >>> 0) / 4294967296;
  }
  let dots = "";
  for (let i = 0; i < count; i++) {
    const x = rand()*37, y = rand()*37;
    dots += `M${point(x,y)}l${round(.04 + rand()*.28)},${round(rand()*.18-.09)}`;
  }
  return dots;
}
const pepper = dotScreen(347, 210), fleck = dotScreen(291, 54);

function Rim({ x, outer, inner, fill }: {x:number;outer:number;inner:number;fill:string}) {
  return <path d={annulus(x,outer,inner)} fill={fill} fillRule="evenodd" stroke={ink} strokeWidth="1.15" />;
}

function Thread({ x, r, n, pitch = 2.4 }: {x:number;r:number;n:number;pitch?:number}) {
  return <g fill="none" strokeLinecap="round">
    <path d={seq(n).map(i=>arc(x+i*pitch,r,-1.52,1.54)).join("")} stroke={ink} strokeWidth=".9" />
    <path d={seq(n).map(i=>arc(x+i*pitch+.8,r-.15,-1.47,.1)).join("")} stroke={ivory} strokeWidth=".65" />
  </g>;
}

function Band({ start, end, r, coating, grain }: {start:number;end:number;r:number;coating:string;grain:string}) {
  const outline=wall(start,end,r);
  return <>
    <path d={outline} fill={coating} stroke={ink} strokeWidth="1.35" />
    <path d={outline} fill={grain} opacity=".54" />
  </>;
}

function Holes({ x, r, scale = 1 }: {x:number;r:number;scale?:number}) {
  return <g>{[.32,2.35,4.46].map(t=> <g key={t} transform={`translate(${polar(x,r,t)}) scale(${scale*squash} ${scale})`}>
    <circle r="3.4" fill={ink} stroke={ivory} strokeWidth=".8"/>
    <path d="m-1.35 1.7 2.9-3.4" stroke="#b8ac98" strokeWidth="1"/>
  </g>)}</g>;
}

/** Threaded collar, bore left open so that the next optical element shows through. */
function Collar({x, r, bore, length, id, screw = false}: {
  x:number;r:number;bore:number;length:number;id:string;screw?:boolean;
}) {
  const inside = `M${point(x,-bore)}H${x+length}a${round(bore*squash)},${bore} 0 0 0 0,${2*bore}H${x}a${round(bore*squash)},${bore} 0 0 1 0,${-2*bore}Z`;
  return <g>
    <defs><clipPath id={`${id}-bore-${r}`}><ellipse cx={x} cy="0" rx={bore*squash} ry={bore}/></clipPath></defs>
    <Band start={x} end={x+length} r={r} coating={`url(#${id}-metal)`} grain={`url(#${id}-grain)`}/>
    <Thread x={x+1.9} r={r} n={Math.max(1, Math.floor((length-2)/2.5))} pitch={2.5}/>
    <g clipPath={`url(#${id}-bore-${r})`}><path d={inside} fill={`url(#${id}-interior)`} stroke={ink} strokeWidth="1.15"/>
      <path d={seq(Math.floor(length/3)).map(i=>arc(x+3*i+1,bore,Math.PI/2,Math.PI*1.5)).join("")} fill="none" stroke={ivory} strokeOpacity=".45" strokeWidth=".65"/>
    </g>
    <Rim x={x} outer={r} inner={bore} fill={`url(#${id}-face)`}/>
    <path d={annulus(x,r-1,bore+.5)} fillRule="evenodd" fill={`url(#${id}-grain)`} opacity=".45"/>
    <path d={arc(x,r-1.8,2.55,5.49)+arc(x,bore+1,1.3,3.45)} fill="none" stroke={ivory} strokeWidth="1.4"/>
    {screw && <Holes x={x} r={(bore+r)*.5} scale={.7}/>}
  </g>;
}

function Glass({ x,r,thickness,id,front=false }: {x:number;r:number;thickness:number;id:string;front?:boolean}) {
  const color= front ? `url(#${id}-glass)` : `url(#${id}-clear)`;
  const back=x+thickness;
  return <g>
    <path d={wall(x,back,r)} fill={front ? "#bb6c48" : "#baae91"} fillOpacity=".8" stroke={ink} strokeWidth="1.2"/>
    <ellipse cx={back} rx={squash*r} ry={r} fill="none" stroke={ink} strokeWidth=".9" />
    <ellipse cx={x} rx={squash*r} ry={r} fill={color} stroke={ink} strokeWidth="1.45" />
    <ellipse cx={x} rx={squash*r} ry={r} fill={`url(#${id}-grain)`} opacity=".59" />
    <path d={arc(x,r-2,2.12,4.7)} fill="none" stroke={ivory} strokeWidth="1.4" opacity=".93"/>
    <path d={arc(x,r-4.2,4.79,5.75)+arc(x,r-6,.29,1.88)} fill="none" stroke={ink} strokeWidth=".75" opacity=".62"/>
    <path d={`M${polar(x,r*.85,3.4)}Q${point(x-r*.35,-r*.88)} ${polar(x,r*.86,4.74)}Q${point(x-r*.17,-r*.65)} ${polar(x,r*.85,3.4)}Z`} fill={ivory} opacity=".83"/>
    <path d={arc(x+1,r*.75,3.37,4.14)} fill="none" stroke={ivory} strokeLinecap="round" strokeWidth="1.7" opacity=".82"/>
    <path d={arc(back-1,r -.7,-1.4,.4)} fill="none" stroke={ivory} strokeWidth="1"/>
  </g>;
}

function Diaphragm({x,id}:{x:number;id:string}) {
  return <g transform={`translate(${x},0) scale(${squash},1)`}>
    <circle r="73" fill={`url(#${id}-well)`} stroke={ink} strokeWidth="2"/>
    <circle r="57" fill="#676254" stroke={ivory} strokeOpacity=".5" strokeWidth=".85"/>
    {seq(9).map(i=><path key={i} transform={`rotate(${i*40})`} d="M-1-55A55 55 0 0 1 36-41L19-7 6.5-19.5Q10-34-1-55Z" fill={`url(#${id}-blade)`} stroke={ink} strokeWidth="1.05"/>)}
    <circle r="53" fill={`url(#${id}-grain)`} opacity=".45"/>
    <path d={seq(9).map((_,j)=>(j?"L":"M")+point(20*Math.cos(j*tau/9-.5),20*Math.sin(j*tau/9-.5))).join("")+"Z"} fill={ink}/>
    <path d="M-11-12q5-8 12-4" fill="none" stroke="#ad6e4e" strokeLinecap="round" strokeWidth="2.6" />
  </g>;
}

function MainBarrel({id}:{id:string}) {
  const metal=`url(#${id}-metal)`, dark=`url(#${id}-black)`, face=`url(#${id}-face)`, grain=`url(#${id}-grain)`;
  const flutes=seq(38).map(i=>{
    const t=-1.53+i*3.06/37;
    const y=95*Math.sin(t),offset=95*squash*Math.cos(t);
    return `M${point(-39+offset,y)}l2.8,-1.1h56.8l2.2,.9`;
  }).join("");
  const fluteGlints=seq(38).map(i=>{
    const t=-1.53+i*3.06/37;
    const y=95*Math.sin(t),offset=95*squash*Math.cos(t);
    return `M${point(-36.2+offset,y-.2)}h55.5`;
  }).join("");
  const scaleMarks=seq(40).map(i=>{
    const t=-1.49+i*2.97/39;
    const offset=88.4*squash*Math.cos(t);
    const y=88.4*Math.sin(t);
    return `M${point(-59+offset,y)}h${i%5===0?12:i%2===0?7:4}`;
  }).join("");
  return <g>
    <Band start={34} end={63} r={70} coating={metal} grain={grain}/><Thread x={45} r={70} n={7}/>
    <Rim x={35} outer={80} inner={66} fill={face}/>
    <Band start={24} end={45} r={83} coating={dark} grain={grain}/><Thread x={35} r={83} n={3}/>
    <Rim x={24} outer={91} inner={71} fill={face}/>
    <Band start={-39} end={24} r={95} coating={dark} grain={grain}/>
    <path d={flutes} fill="none" stroke="#15120f" strokeWidth="2.1" strokeLinejoin="round"/>
    <path d={fluteGlints} fill="none" stroke="#c4bba8" strokeWidth="1.2" opacity=".68"/>
    <Thread x={20.6} r={94} n={2}/>
    <Band start={-63} end={-39} r={88.4} coating={metal} grain={grain}/>
    <path d={scaleMarks} stroke={ink} strokeWidth="1.1" fill="none"/>
    <path d="M-8.3 9.7h7.2l-3.7-4.5z" fill={accent} stroke={ivory} strokeWidth=".6"/>
    <Band start={-78} end={-62} r={94} coating={dark} grain={grain}/><Thread x={-74.5} r={94} n={4}/>
    <ellipse cx={-78} rx={94*squash} ry={94} fill={face} stroke={ink} strokeWidth="1.65"/>
    <Diaphragm x={-78} id={id}/>
    <Rim x={-78} outer={93.5} inner={71.5} fill={face}/>
    <path d={annulus(-78,92,72)} fillRule="evenodd" fill={grain} opacity=".76"/>
    <ellipse cx={-78} rx={squash*89} ry="89" fill="none" stroke={ink} strokeWidth=".8"/>
    <ellipse cx={-78} rx={squash*74} ry="74" fill="none" stroke={ink} strokeWidth="1.1"/>
    <path d={arc(-78,92.3,2.24,5.14)+arc(-78,72.4,-.2,1.7)} fill="none" stroke={ivory} strokeWidth="1.6"/>
    <Holes x={-78} r={83.1}/>
    <path d={seq(5).map(i=>arc(-78,70-i*1.65,0.17,6.14)).join("")} fill="none" stroke="#c5baa3" strokeOpacity=".55" strokeWidth=".58"/>
  </g>;
}

export default function QofenoOptic() {
  const id=`qo-${useId().replace(/[^a-zA-Z0-9_-]/g,"")}`;
  const front=-217;
  return <svg className="qofeno-optic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 452" role="img" aria-label="A focusing lens with its iris, glass elements and threaded rings aligned on an optical axis" style={{width:"100%",height:"100%",display:"block",overflow:"visible"}}>
    <title>Optical study of a focusing lens</title>
    <defs>
      <pattern id={`${id}-grain`} width="37" height="37" patternUnits="userSpaceOnUse"><path d={pepper} stroke={ink} strokeWidth=".7" strokeLinecap="round"/><path d={fleck} stroke={ivory} strokeWidth=".73" strokeLinecap="round"/></pattern>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#8e8878"/><stop offset=".11" stopColor="#dfd7c5"/><stop offset=".19" stopColor="#fff9e9"/><stop offset=".28" stopColor="#b4a994"/><stop offset=".42" stopColor="#e5d9c2"/><stop offset=".59" stopColor="#948b77"/><stop offset=".77" stopColor="#494638"/><stop offset=".89" stopColor="#8a816c"/><stop offset="1" stopColor="#464135"/></linearGradient>
      <linearGradient id={`${id}-black`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#22201a"/><stop offset=".14" stopColor="#787265"/><stop offset=".31" stopColor="#a19985"/><stop offset=".43" stopColor="#656052"/><stop offset=".61" stopColor="#38362c"/><stop offset=".83" stopColor="#24221d"/><stop offset="1" stopColor="#514c3d"/></linearGradient>
      <linearGradient id={`${id}-face`} x1="0" y1="0" x2=".83" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#fbf4de"/><stop offset=".23" stopColor="#a9a28c"/><stop offset=".38" stopColor="#e4dac2"/><stop offset=".62" stopColor="#d0c5ad"/><stop offset=".86" stopColor="#85816f"/><stop offset="1" stopColor="#d2c6ac"/></linearGradient>
      <linearGradient id={`${id}-interior`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#39362d"/><stop offset=".5" stopColor="#7d7563"/><stop offset=".86" stopColor="#a79e87"/><stop offset="1" stopColor="#4b4537"/></linearGradient>
      <radialGradient id={`${id}-well`} cx=".57" cy=".62" r=".66"><stop stopColor="#575245"/><stop offset=".66" stopColor="#464237"/><stop offset=".89" stopColor="#25231e"/><stop offset="1" stopColor="#201e19"/></radialGradient>
      <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="1" y2=".58"><stop stopColor="#b6ac96"/><stop offset=".65" stopColor="#6c6758"/><stop offset="1" stopColor="#4a463b"/></linearGradient>
      <radialGradient id={`${id}-glass`} cx=".29" cy=".23" r=".91"><stop stopColor="#fae9c9" stopOpacity=".90"/><stop offset=".25" stopColor="#efd0a6" stopOpacity=".86"/><stop offset=".54" stopColor="#d3976f" stopOpacity=".94"/><stop offset=".81" stopColor="#b66542" stopOpacity=".96"/><stop offset="1" stopColor="#7c4631"/></radialGradient>
      <radialGradient id={`${id}-clear`} cx=".28" cy=".2" r=".92"><stop stopColor="#faf2dc" stopOpacity=".93"/><stop offset=".6" stopColor="#e3d8bb" stopOpacity=".84"/><stop offset="1" stopColor="#8a8068" stopOpacity=".93"/></radialGradient>
    </defs>
    <g transform="translate(305 230) rotate(-29)">
      <g fill="none" stroke={ink} opacity=".39" strokeWidth=".9"><path d="M-303 0H314" strokeDasharray="9 4 1 4"/><path d="M-295-5v10m-5-5h10m289-5v10m-4-5h8m303-5v10m-5-5h10"/></g>
      <g data-lens-part="5" data-closed-x="-130"><Collar x={256} r={45} bore={38} length={8} id={id}/></g>
      <g data-lens-part="4" data-closed-x="-106"><Collar x={185} r={58} bore={43} length={31} id={id} screw/></g>
      <g data-lens-part="3" data-closed-x="-55"><Glass x={126} r={54} thickness={7.5} id={id}/></g>
      <g data-lens-part="2" data-closed-x="0"><MainBarrel id={id}/></g>
      <g data-lens-part="1" data-closed-x="63"><Glass x={-153} r={66.5} thickness={7.5} id={id} front/></g>
      <g data-lens-part="0" data-closed-x="112"><Collar x={front} r={75} bore={65.7} length={11} id={id} screw/></g>
    </g>
  </svg>;
}
