(() => {
  const showcase = document.querySelector('.showcase');
  const panels = Array.from(showcase.querySelectorAll('[data-image]'));
  const studies = [['West-facing studio', 'Late afternoon'], ['Glass in morning light', 'Early morning'], ['Paper in relief', 'Low evening light']];
  const controls = showcase.querySelector('.carousel-arrows');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer;
  function change(step) {
    const last = index;
    index = (index + step + panels.length) % panels.length;
    window.clearTimeout(timer);
    for (const [i, panel] of panels.entries()) {
      panel.classList.remove('reveal');
      panel.hidden = i !== index && i !== last;
      panel.setAttribute('aria-hidden', String(i !== index));
      panel.classList.toggle('current', i === index);
    }
    const active = panels[index];
    active.style.setProperty('--clip', step > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)');
    if (!reduce.matches) {
      void active.offsetWidth;
      active.classList.add('reveal');
    }
    const finish = () => { panels.forEach((panel, i) => { panel.hidden = i !== index; }); };
    if (reduce.matches) finish(); else timer = window.setTimeout(finish, 470);
    document.querySelector('#study-caption').textContent = studies[index][0];
    document.querySelector('#light-kind').textContent = studies[index][1];
    document.querySelector('#photo-count').textContent = String(index + 1).padStart(2, '0') + ' / 03';
    document.querySelector('#study-status').textContent = `Study ${index + 1} of 3. ${studies[index][0]}.`;
  }
  controls.hidden = false;
  document.querySelector('#previous').addEventListener('click', () => change(-1));
  document.querySelector('#next').addEventListener('click', () => change(1));
  controls.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); change(e.key === 'ArrowRight' ? 1 : -1); }
  });
  const method = document.querySelector('#method');
  document.querySelector('a[href="#method"]').addEventListener('click', () => { method.open = true; });
  if (location.hash === '#method') method.open = true;
})();


(()=>{
  const planner=document.getElementById('planner');
  if(!planner)return;
  const find=id=>document.getElementById(id);
  const city=find('df-city'),clock=find('df-clock'),facing=find('df-direction'),date=find('df-date');
  const cities={
    la:{name:'Los Angeles',latitude:34.0522,longitude:-118.2437,zone:'America/Los_Angeles'},
    ny:{name:'New York',latitude:40.7128,longitude:-74.006,zone:'America/New_York'},
    ldn:{name:'London',latitude:51.5072,longitude:-.1276,zone:'Europe/London'},
    tok:{name:'Tokyo',latitude:35.6762,longitude:139.6503,zone:'Asia/Tokyo'}
  };
  const directions=['North','East','South','West'];
  const radians=Math.PI/180,dayMs=86400000;
  const dateLabel=new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'});
  for(const place of Object.values(cities)){
    place.formatter=new Intl.DateTimeFormat(place.zone==='Europe/London'?'en-GB':'en-US',{
      timeZone:place.zone,year:'numeric',month:'numeric',day:'numeric',hourCycle:'h23',hour:'numeric',
      minute:'numeric',second:'numeric',timeZoneName:'short'
    });
  }
  // Represent civil clock fields on a UTC ruler so they can be compared independently of the visitor's zone.
  function localClock(place,instant){
    const fields={};
    for(const part of place.formatter.formatToParts(instant))fields[part.type]=part.value;
    const ruler=new Date(0);
    ruler.setUTCFullYear(+fields.year,+fields.month-1,+fields.day);
    ruler.setUTCHours(+fields.hour,+fields.minute,+fields.second,0);
    return {wall:ruler.getTime(),zone:fields.timeZoneName};
  }
  function resolveTime(place,midnight,minutes){
    const wall=midnight+minutes*60000;
    if(place.offsetDate!==midnight){
      place.offsetDate=midnight;
      place.offsets=[...new Set([-1,0,1].map(day=>{
        const instant=midnight+(day+.5)*dayMs;
        return localClock(place,instant).wall-instant;
      }))];
    }
    // At a clock change, the local hour can map to zero or two actual instants.
    const matches=[];
    for(const offset of place.offsets){
      const instant=wall-offset,reading=localClock(place,instant);
      if(reading.wall===wall)matches.push({instant,zone:reading.zone,offset:offset/3600000});
    }
    matches.sort((a,b)=>a.instant-b.instant);
    return matches;
  }
  // NOAA's fractional-year approximation. Azimuth is clockwise from geographic north.
  function sunPosition(place,minutes,midnight,offset){
    const start=new Date(midnight);start.setUTCMonth(0,1);
    const end=new Date(start);end.setUTCFullYear(start.getUTCFullYear()+1);
    const gamma=2*Math.PI/((end-start)/dayMs)*((midnight-start)/dayMs+(minutes/60-12)/24);
    const equation=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
    const decl=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
    const hour=((minutes+equation+4*place.longitude-60*offset)/4-180)*radians;
    const lat=place.latitude*radians;
    const altitude=Math.asin(Math.max(-1,Math.min(1,Math.sin(lat)*Math.sin(decl)+Math.cos(lat)*Math.cos(decl)*Math.cos(hour))));
    const azimuth=(180+Math.atan2(Math.sin(hour),Math.cos(hour)*Math.sin(lat)-Math.tan(decl)*Math.cos(lat))/radians+360)%360;
    return {altitude,azimuth};
  }
  const point=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`;
  const clockText=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  const set=(id,attrs)=>{const node=find(id);for(const [key,val] of Object.entries(attrs))node.setAttribute(key,String(val));};
  function update(){
    const place=cities[city.value],minutes=Number(clock.value),face=Number(facing.querySelector(':checked').value);
    const time=clockText(minutes),midnight=date.valueAsNumber;
    const directionName=directions[face/90];
    find('df-clock-label').textContent=time;
    clock.style.setProperty('--progress',`${minutes/Number(clock.max)*100}%`);
    find('df-svg-facing').textContent=`${directionName.toUpperCase()} WINDOW`;
    const north=(face+180)*radians;
    set('df-compass',{transform:`rotate(${180-face})`});
    set('df-compass-n',{x:-30*Math.sin(north),y:-30*Math.cos(north)+3});
    const validDate=Number.isFinite(midnight)&&date.validity.valid;
    const matches=validDate?resolveTime(place,midnight,minutes):[];
    if(!matches.length){
      const message=validDate?`${time} is skipped when the clocks move forward in ${place.name}. Choose another time.`:'Choose a valid shoot date to see the light.';
      planner.dataset.light='unavailable';set('df-floor-light',{d:''});set('df-floor-fill',{fill:'#4c4a41'});
      find('df-light-state').textContent=validDate?'Clock change':'Choose a date';
      find('df-elevation').textContent='Elevation unavailable';find('df-reading').textContent=message;
      find('df-room-desc').textContent=message;clock.setAttribute('aria-valuetext',validDate?`${time}, skipped locally`:time);
      return;
    }
    const selected=matches[0];
    const {altitude,azimuth}=sunPosition(place,minutes,midnight,selected.offset);
    const relative=(azimuth-face)*radians;
    const dx=Math.sin(relative),dy=-Math.cos(relative);
    const night=altitude<=0,direct=!night&&dy<-.001;
    const state=night?'After dark':direct?'Direct sunlight':'Indirect daylight';
    const angle=Math.round(Math.abs(altitude/radians));
    planner.dataset.light=night?'night':direct?'direct':'indirect';
    const zone=place.zone==='Asia/Tokyo'&&selected.zone==='GMT+9'?'JST':selected.zone;
    clock.setAttribute('aria-valuetext',`${time} ${zone}${matches.length>1?', first occurrence':''}`);
    if(find('df-light-state').textContent!==state)find('df-light-state').textContent=state;
    find('df-elevation').textContent=night?`Sun ${angle}° below horizon`:`Sun elevation ${angle}°`;
    find('df-room-desc').textContent=`${state} at ${time} ${zone} in ${place.name}. ${directionName}-facing window, ${dateLabel.format(midnight)}.`;
    // A window with 0.57 m sill and 2.35 m head, at 62 plan pixels per metre.
    const scale=62/Math.max(.005,Math.tan(altitude));
    const near=scale*.57,far=scale*2.35,nx=near*dx,ny=near*dy,fx=far*dx,fy=far*dy;
    const windows=[[188.4,253.4],[255.3,320.1],[322.0,386.6]];
    const y=293;
    const polygons=windows.map(([left,right])=>`M${point(left+nx,y+ny)} L${point(right+nx,y+ny)} ${point(right+fx,y+fy)} ${point(left+fx,y+fy)}Z`).join(' ');
    set('df-floor-light',{d:direct?polygons:''});
    set('df-sunbeam',{x1:287+nx,y1:y+ny,x2:287+fx,y2:y+fy});
    const fall=Math.max(0,Math.min(1,Math.sin(altitude)));
    const green=Math.round(150+76*fall),blue=Math.round(69+97*fall);
    const gradient=find('df-sunbeam').children;
    gradient[0].setAttribute('stop-color',`rgb(255,${Math.min(240,green+20)},${blue+25})`);
    gradient[1].setAttribute('stop-color',`rgb(255,${green},${blue})`);
    const length=Math.min(300,scale*.7);
    function shadow(x,y,r){
      const px=-dy*r,py=dx*r,ex=dx*length,ey=dy*length;
      return `M${point(x-px,y-py)}l${point(2*px,2*py)} ${point(ex,ey)} ${point(-2*px,-2*py)}Z`;
    }
    set('df-chair-shadow',{d:shadow(207,188,15)});set('df-table-shadow',{d:shadow(274,146,14.4)});
    set('df-floor-fill',{fill:night?'#3c3c3b':direct?'#534c40':'#4c4a41'});
    const note=night?'The sun is below the horizon.':direct?'Clear-sky estimate through an unobstructed window.':'The sun is on the other side of this window.';
    find('df-reading').textContent=matches.length>1?`Clocks turn back in ${place.name}. Showing the first ${time} (${zone}).`:`${note} ${place.name} · ${zone}.`;
  }
  city.addEventListener('change',update);facing.addEventListener('change',update);clock.addEventListener('input',update);
  date.addEventListener('input',update);date.addEventListener('change',update);
  document.addEventListener('click',event=>{
    const control=event.target instanceof Element?event.target.closest('[data-shot-preset]'):null;
    if(!control)return;
    const presets={morning:[90,480],evening:[270,1050]};
    const preset=presets[control.getAttribute('data-shot-preset')];if(!preset)return;
    city.value='la';date.value='2026-09-21';clock.value=String(preset[1]);facing.querySelector(`input[value="${preset[0]}"]`).checked=true;update();
    planner.focus({preventScroll:true});
  });
  update();
})();
