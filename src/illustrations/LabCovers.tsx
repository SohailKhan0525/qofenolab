import { useId } from "react";

const ink = "#302e2a";
const canvas = { display: "block", width: "100%", height: "100%" } as const;
const count = (n: number) => Array.from({ length: n }, (_, i) => i);
const fixed = (v: number) => Number(v.toFixed(2));

function Sailcloth({ x, y, w, h, lit, grain }: {
  x: number; y: number; w: number; h: number; lit: string; grain: string;
}) {
  const outline = `M${-w * .49},0Q0,${h * -.08} ${w * .48},0C${w * .41},${h * .25} ${w * .48},${h * .7} ${w * .57},${h * .95}Q${w * .24},${h * .78} 0,${h * .94}Q${-w * .24},${h * 1.04} ${-w * .52},${h * .81}Q${-w * .33},${h * .44} ${-w * .49},0Z`;
  return <g transform={`translate(${x} ${y}) rotate(-7)`}>
    <path d={outline} fill={lit} stroke={ink} strokeWidth="1.3" strokeLinejoin="round" />
    <path d={outline} fill={grain} />
    <g fill="none" stroke="#986943" strokeWidth=".72" opacity=".78">
      {[-.31, -.15, .02, .19, .35].map((fraction) =>
        <path key={fraction} d={`M${w * fraction} 1 Q${w * (fraction + .11)} ${h * .44} ${w * (fraction + .025)} ${h * (.91 - Math.abs(fraction) * .18)}`} />)}
      <path d={`M${-w * .44},${h * .59} Q0,${h * .78} ${w * .5},${h * .55}`} strokeDasharray="2 1.4" />
    </g>
    <path d={`M${-w * .56} 0Q0 ${-h * .08} ${w * .54} -1`} stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </g>;
}

function Shrouds({ x, y, center, deck, width }: { x: number; y: number; center: number; deck: number; width: number }) {
  return <g fill="none" stroke={ink} strokeWidth=".84">
    {[-1, -.5, 0, .5, 1].map(t => <path key={t} d={`M${x} ${y}L${center + width * t} ${deck}`} />)}
    {count(10).map(i => {
      const t = .26 + i * .076;
      const cx = x + (center - x) * t;
      const height = y + (deck - y) * t;
      return <path key={i} d={`M${cx - width * t} ${height}q${width * t} 1 ${2 * width * t} -.2`} strokeWidth=".64" />;
    })}
  </g>;
}

export function SailCover() {
  const id = `sail-cover-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const grain = `url(#${id}-dots)`;
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice" style={canvas}>
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#d27c55" /><stop offset=".72" stopColor="#efb681" /><stop offset="1" stopColor="#f6cb94" />
      </linearGradient>
      <pattern id={`${id}-dots`} width="11" height="9" patternUnits="userSpaceOnUse">
        <path d="M1 2h.4m5 4h.2m3-5h.1m-7 7h.2" stroke="#654532" opacity=".42" strokeWidth=".85" strokeLinecap="round" />
      </pattern>
      <clipPath id={`${id}-orb`}><circle cx="321" cy="100" r="38" /></clipPath>
    </defs>
    <rect width="420" height="164" fill={`url(#${id}-sky)`} />
    <rect width="420" height="164" fill={grain} />
    <g fill="none" stroke="#a15d44" opacity=".48" strokeWidth=".95" strokeLinecap="round">
      <path d="M-15 58q30-1 55 1t52 0m212-21q33 2 75 0m11 1 28 .3M15 67q40-2 64 .3m4 0 17-.3m188 13q40 1 85-.6m13 1h19M-5 108q38 .2 74-.8m-43 5h54m273 15 76-1" />
    </g>
    <circle cx="321" cy="100" r="38" fill="#ffdda0" />
    <g clipPath={`url(#${id}-orb)`} stroke="#d89363" strokeLinecap="round" fill="none">
      {count(11).map(i => <path key={i} d={`M281 ${115 + i * 2.45} q15 -.7 37 .1 t44 -.2`} strokeWidth={.5 + i * .12} />)}
    </g>
    <path d="M0 151q20 1 37-4l18 1 12-3 28 4 20-2q18 0 39 5l70-1 32-3 16 .9 25-4 18 1 15-4 7 1 14-6 10 .8 9-2 10 3 15 .2 11 4 26-2 18 4v18H0Z" fill="#aa7058" />
    <path d="M0 154q62-2 104 .2t69 0 78 0 70-.7 110 .1v111H0Z" fill="#645852" />
    <g stroke="#e8ad79" strokeLinecap="round" fill="none" opacity=".85">
      {count(11).map(i => {
        const y = 157 + i * 2.8;
        const left = 288 - i * 2 + Math.sin(i * 2.6) * 13;
        return <path key={i} strokeWidth={.7 + i * .071} d={`M${left} ${y} q15 -1 32 0 t31 .3m6 .3q10 .6 20-.8m-115 1.7q9 .4 16-.4`} />;
      })}
    </g>
    <path d="M0 170q21-7 42-2t44-1 39 3 41 0 60-2 49 .4 62 2 46-2 46 1v93H0Z" fill="#454b48" />
    <g fill="none" stroke="#978576" strokeLinecap="round">
      {count(64).map(i => {
        const x = (i * 89 + i % 7 * 17) % 447 - 21;
        const y = 158 + (i * 31 % 72);
        const w = 5 + i % 15;
        return <path key={i} strokeWidth={y < 173 ? .67 : 1.1} d={`M${x} ${y}q${w * .45} ${-1 - (i % 3)} ${w} -1`} />;
      })}
    </g>
    <g fill="none" stroke={ink} strokeLinecap="round">
      <path d="M75 161 133 63M91 161l96-126m-54 29 54-28 57 18 84 98M186 42l118 119m-61-99 82 86" strokeWidth="1.05" />
      <path d="M115 169 136 57m38 113 16-145m42 147 16-120" strokeWidth="2.9" />
    </g>
    <g fill="#8f483b" stroke={ink} strokeWidth=".8" strokeLinejoin="round">
      <path d="M190 25q-9 6-16 1t-14 .6q7-5 2-10 9-3 17 1t11-2Z" />
      <path d="m248 51-19-1 5 4-8 3 21-.7Z" />
    </g>
    <g fill="#e4a977" stroke={ink} strokeWidth="1.2" strokeLinejoin="round">
      <path d="M274 129 313 148q-19-29-60-78 18 36 21 59Z" />
      <path d="M254 124 279 141q-5-23-26-56 5 24 1 39Z" fill="#f2c695" />
      <path d="M121 106q-5 26-5 46l-33 8q24-23 38-54Z" />
    </g>
    <Sailcloth x={132} y={76} w={32} h={19} lit="#e7bc8c" grain={grain} />
    <Sailcloth x={128} y={99} w={42} h={29} lit="#e9b780" grain={grain} />
    <Sailcloth x={123} y={132} w={53} h={23} lit="#d59a6c" grain={grain} />
    <Sailcloth x={187} y={49} w={34} h={20} lit="#f5d6a5" grain={grain} />
    <Sailcloth x={184} y={74} w={49} h={30} lit="#edc394" grain={grain} />
    <Sailcloth x={180} y={108} w={67} h={41} lit="#f5c998" grain={grain} />
    <Sailcloth x={243} y={70} w={30} h={18} lit="#f1cb98" grain={grain} />
    <Sailcloth x={240} y={94} w={44} h={25} lit="#e5b07d" grain={grain} />
    <Sailcloth x={237} y={123} w={51} h={29} lit="#f2c692" grain={grain} />
    <g fill={ink}>
      <path d="m179 71 13-2-2 4-8 1zm57 20 11-1-2 3-7 .5zm-109 6 9-1-1.5 3-5 .5Z" />
      <path d="M75 157q13 .8 33 4l6 9q35 6 68 5 37 0 71-8l7-6 34-4q-9 22-36 33-45 15-98 8l-58-10q-20-7-27-31Z" />
      <path d="M73 151q18 0 35 5l3 10-32-6Zm2-7 29 3 2 6-30-4Z" />
      <path d="m277 161 66-23 1.1 2.4-62 26Z" />
    </g>
    <path d="M81 163q91 29 201 1M86 169q88 30 188 4" fill="none" stroke="#c18861" strokeWidth="1.35" />
    <g fill="#deb078">
      {count(10).map(i => {
        const x = 101 + i * 16;
        const y = 174 + Math.sin(i / 9 * Math.PI) * 7;
        return <path key={i} d={`m${x} ${y} 4.1 .55-.5 2.8-4-.6z`} />;
      })}
      {count(4).map(i => <path key={i} d={`m${79+i*5.3} ${151+i*.62} 3.4 .4.4 2.6-3.3-.4z`} />)}
    </g>
    <Shrouds x={129} y={98} center={116} deck={169} width={9} />
    <Shrouds x={185} y={73} center={170} deck={173} width={12} />
    <Shrouds x={241} y={93} center={229} deck={171} width={9} />
    <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="1">
      <path d="M76 145v-4m6 5v-5m7 6v-5m7 6v-4m7 4v-3m-29-4 31 4m103 24v-4m6 4v-4m7 3v-3m6 2v-4m-21 2q12 1 23-2m30-5v-4m6 3v-4m6 3v-4m-17 3 21-5" />
      <path d="m245 62 64 87m-120-105 42 124m-37-107 57 104" opacity=".68" strokeWidth=".65" />
    </g>
    <path d="M0 194q23-13 48-9c13 2 20 7 35 5l17-2q-6 2-9 4 17-3 32 0c26 6 59 11 93 4 22-5 38-4 54-13 11-6 16-9 23-8l-5 4 18-3q-6 6-19 8 24-1 42 4 25 6 45-1 19-6 46-6v79H0Z" fill="#2c4141" />
    <g fill="none" strokeLinecap="round">
      <path d="M-5 194q36-19 66-2 14 5 33-1m-59-4 8 1m9 2q10 1 15 5m10 1 8-1M111 194q39 9 74 7m99-24q-11 12-38 15m36-8q12-1 19-6m-6 8q20-1 38 4m9 2 15-1m11-2 11-3" stroke="#efc28e" strokeWidth="1.8" />
      <path d="M-8 226q27-12 50-6t47 1l11-4m-27 10q18-1 29-6m28-8q21-7 43-2t41-2m22 28q25-9 57-2 29 7 61-4t62-3m-391 8q25-7 53-2m273-29q24-8 55-3m-240 44q14-5 37-4" stroke="#8e9a87" strokeWidth="1.9" />
    </g>
    <rect width="420" height="260" fill={grain} opacity=".38" />
  </svg>;
}

function sunArc(angle: number, rx: number, ry: number) {
  const t = angle * Math.PI / 180;
  return [fixed(196 + rx * Math.cos(t)), fixed(203 - ry * Math.sin(t))];
}

export function DayframeCover() {
  const id = `day-cover-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [sunX, sunY] = sunArc(57, 183, 159);
  const texture = `url(#${id}-grain)`;
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice" style={canvas}>
    <defs>
      <pattern id={`${id}-grain`} width="13" height="11" patternUnits="userSpaceOnUse">
        <path d="M1 1h.3m4 6h.6m6-4h.4m-8 7h.2" fill="none" stroke="#3d442f" strokeWidth=".75" strokeLinecap="round" opacity=".37" />
      </pattern>
      <clipPath id={`${id}-near`}>
        <path d="M0 212c75 5 96 24 148 15 57-11 88-34 144-46 48-11 86-15 130-10v89H0Z" />
      </clipPath>
    </defs>
    <rect width="420" height="260" fill="#e9cea0" />
    <rect width="420" height="260" fill={texture} />
    <g fill="none" stroke="#8d8257" strokeWidth=".72" opacity=".64">
      <path d="M-14 113q37-3 71-1m-40 5h23m295-42q35-1 78-.5m-71 3.5 43-.1m-278 3q14-.7 27-.4m12 .1h15" />
      <path d="M19 132h382M196 16v140" strokeDasharray="1.1 5.5" opacity=".66" />
    </g>
    <g fill="none" stroke="#7b754c">
      <path d="M13 203A183 159 0 0 1 379 203" strokeWidth=".8" strokeDasharray="1.1 3.1" />
      <path d={`M13 203A183 159 0 0 1 ${sunX} ${sunY}`} stroke="#a46737" strokeWidth="1.5" />
      <path d="M2 203A194 170 0 0 1 390 203" strokeWidth=".55" strokeDasharray="2 4" opacity=".8" />
      {count(31).map(i => {
        const t = i * 6, strong = i % 3 === 0;
        const p = sunArc(t, 185, 161);
        const q = sunArc(t, strong ? 194 : 189, strong ? 170 : 165);
        return <path key={i} d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} strokeWidth={strong ? 1.2 : .7} />;
      })}
      <path d={`M${sunX} ${sunY}V178`} stroke="#8c6640" strokeDasharray="2.2 3" strokeWidth=".9" />
    </g>
    <circle cx={sunX} cy={sunY} r="26" fill="#e7a741" stroke="#7f6a3f" strokeWidth=".8" />
    <circle cx={sunX} cy={sunY} r="26" fill={texture} />
    <circle cx={sunX} cy={sunY} r="29.3" stroke="#ac8649" strokeWidth=".65" fill="none" />
    <g fill="#a9a47b">
      <path d="M0 149q17-5 29-5 16-9 30-7l19-7q25 1 34-5 16 2 33-3l24 2q13-5 23-4 16-8 23-8 13-10 26-9 17 7 32 7l24 9 22 2 14 9 15 3 16 3 31 1 25 8v37H0Z" />
      <path d="M0 161q20-7 51-.2c26 3 48-3 72-8 21-5 38-3 63-9q21-5 40-3c29 1 49-8 69-10q21-6 43-4l27-8 17-.3 11-4q17-1 29-5v83H0Z" fill="#8c956e" />
    </g>
    <path d="M0 155c29 1 60 6 83 12 36 9 71 10 114-.3 30-8 54-6 78-4 46 4 96-10 145-12v73H0Z" fill="#b3a265" />
    <g fill="none" stroke="#727d58" strokeLinecap="round" opacity=".85">
      <path d="M0 159q46 1 83 13t95 6q29-2 61-11m-218-4q25 1 55 11m-67-7q29 4 49 10m69 5c36 1 57-3 87-11m49-6q26 4 55-1m18-3q38-7 83-8" strokeWidth=".95" />
    </g>
    <path d="M0 181q41-8 83-1c45 7 69 8 99 4 46-6 73-19 108-23 27-3 60-1 83 3q25 5 47 3v93H0Z" fill="#627755" />
    <path d="M0 190c35-10 69-5 98 1 51 11 76 8 127-1-27 12-50 25-74 31-32 8-53 4-79 1-30-4-51-5-72 2Z" fill="#d4b572" />
    <path d="M0 206c37-9 66-4 103 0q40 6 88-7-44 23-72 24c-44 3-73-5-119 3Z" fill="#a5a16b" />
    <g fill="none" stroke="#596e4f" strokeWidth="1.1" strokeLinecap="round">
      {count(11).map(i => <path key={i} d={`M${-18 + i * 19} ${199 + 5 * Math.sin(i * .39)} q${21-i*.9} -6 ${32-i*1.6} -10`} />)}
    </g>
    <path d="M24 184c52-5 76 10 118 12q49 2 86-7M50 179q25 1 46 5m103-1q36-9 79-16m32-4q28-1 60 4" fill="none" stroke="#344e3e" strokeWidth="1.2" />
    <path d="M0 212c75 5 96 24 148 15 57-11 88-34 144-46 48-11 86-15 130-10v89H0Z" fill="#334f40" />
    <g clipPath={`url(#${id}-near)`} fill="none" strokeLinecap="round">
      {count(14).map(i => <path key={i} d={`M${-30 + i * 22} 273C${102 + i * 6} ${218 + i * 3} ${220 + i * 6} ${195 + i * 1.5} 441 ${168 + i * 5.6}`} stroke={i % 3 ? "#698363" : "#91a07b"} strokeWidth={i % 3 ? 1.1 : 1.7} />)}
      <path d="M-3 218q40-2 93 17t108-8" stroke="#b4ae7b" strokeWidth="1" />
    </g>
    <g fill="#304b3c">
      {[[324,175,14],[330,174,20],[338,173,11],[351,172,8],[365,171,13],[51,183,7],[55,183,9]].map(([x,y,h]) =>
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d={`M0 0v${-h * .18}q${-h * .24} .2 ${-h * .19} ${-h * .25}L0 ${-h}q${h * .09} ${h * .3} ${h * .13} ${h * .48}t${-h * .06} ${h * .34}V0Z`} />
        </g>)}
    </g>
    <rect width="420" height="260" fill={texture} opacity=".58" />
  </svg>;
}

export function EliteCraftCover() {
  const id = `ewc-cover-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const cx = 250;
  const cy = 130;
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice" style={canvas}>
    <defs>
      <radialGradient id={`${id}-glow`} cx="0.6" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#E3FF3C" stopOpacity="0.18" />
        <stop offset="1" stopColor="#0B0B0B" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="420" height="260" fill="#0B0B0B" />
    <rect width="420" height="260" fill={`url(#${id}-glow)`} />
    <g fill="none">
      {[28, 48, 70, 94, 120, 148, 178].map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          stroke={i === 1 || i === 3 ? "#E3FF3C" : "#F4F4EF"}
          strokeOpacity={i === 1 ? 0.85 : i === 3 ? 0.45 : Math.max(0.08, 0.28 - i * 0.03)}
          strokeWidth={i === 1 ? 1.5 : 1}
          strokeDasharray={i === 2 ? "5 7" : undefined}
        />
      ))}
      <line x1="48" y1={cy} x2="392" y2={cy} stroke="#F4F4EF" strokeOpacity="0.14" strokeWidth="1" />
      <line x1={cx} y1="16" x2={cx} y2="244" stroke="#F4F4EF" strokeOpacity="0.14" strokeWidth="1" />
      <polygon
        points="250,82 292,106 292,154 250,178 208,154 208,106"
        fill="#E3FF3C"
        fillOpacity="0.1"
        stroke="#E3FF3C"
        strokeWidth="1.6"
      />
      <circle cx={cx} cy={cy} r="4" fill="#E3FF3C" />
    </g>
    <g fill="none" stroke="#8C8C86" strokeOpacity="0.4" strokeWidth="1">
      <rect x="26" y="42" width="126" height="176" rx="4" fill="#151515" fillOpacity="0.92" stroke="#F4F4EF" strokeOpacity="0.2" />
      <line x1="40" y1="68" x2="112" y2="68" stroke="#E3FF3C" strokeOpacity="0.9" strokeWidth="2" />
      <line x1="40" y1="92" x2="136" y2="92" />
      <line x1="40" y1="112" x2="124" y2="112" />
      <line x1="40" y1="132" x2="130" y2="132" />
      <rect x="40" y="162" width="64" height="22" rx="2" fill="#E3FF3C" stroke="none" />
    </g>
  </svg>;
}
