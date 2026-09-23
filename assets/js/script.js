/* ─── "לאליזה" — תווים מנגנים ─── */
(function(){
  // F5=16, E5=22, D5=28, C5=34, B4=40, A4=46
  const melody=[
    [659.25,'מי',22,false],[622.25,'רה#',28,true],[659.25,'מי',22,false],
    [622.25,'רה#',28,true],[659.25,'מי',22,false],[493.88,'סי',40,false],
    [587.33,'רה',28,false],[523.25,'דו',34,false],[440.00,'לה',46,false]
  ];
  const layer=document.getElementById('notesLayer');
  const startX=66,gap=48;
  let ctx;
  function unlock(){
    ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
    if(ctx.state==='suspended')ctx.resume();
  }
  // הדפדפן חוסם צליל עד האינטראקציה הראשונה (לחיצה/מקש) בדף — פותחים אותו בה
  ['pointerdown','keydown','touchend'].forEach(t=>
    document.addEventListener(t,unlock,{once:true,capture:true}));
  function playNote(freq,g,gesture){
    g.classList.add('lit');clearTimeout(g._lit);g._lit=setTimeout(()=>g.classList.remove('lit'),450);
    // ריחוף לפני שהצליל נפתח — רק הדגשה, כדי שלא יצטברו תווים שיתנגנו יחד בפתיחה
    if(!gesture&&(!ctx||ctx.state!=='running'))return;
    unlock();
    const t=ctx.currentTime;
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),gain=ctx.createGain(),g2=ctx.createGain();
    o.type='triangle';o.frequency.value=freq;
    o2.type='sine';o2.frequency.value=freq*2;g2.gain.value=.12;
    gain.gain.setValueAtTime(.0001,t);
    gain.gain.exponentialRampToValueAtTime(.3,t+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,t+1.4);
    o.connect(gain);o2.connect(g2);g2.connect(gain);gain.connect(ctx.destination);
    o.start(t);o2.start(t);o.stop(t+1.5);o2.stop(t+1.5);
  }
  const notes=[];
  melody.forEach((n,i)=>{
    const[freq,name,y,sharp]=n;
    const x=startX+i*gap;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','note-g');g.setAttribute('tabindex','0');
    g.setAttribute('role','button');g.setAttribute('aria-label','תו '+name);
    // מהקו האמצעי (סי, y=40) ומעלה — רגל למטה משמאל; מתחתיו — רגל למעלה מימין
    const down=y<=40;
    let inner='';
    if(sharp)inner+=`<text x="${x-18}" y="${y+5}" font-size="14" fill="#fff">♯</text>`;
    inner+=`<ellipse cx="${x}" cy="${y}" rx="6.4" ry="4.8" transform="rotate(-18 ${x} ${y})"/>`;
    inner+=down
      ?`<line x1="${x-6}" y1="${y+1}" x2="${x-6}" y2="${y+32}"/>`
      :`<line x1="${x+6}" y1="${y-1}" x2="${x+6}" y2="${y-32}"/>`;
    inner+=`<rect x="${x-17}" y="${down?y-14:y-36}" width="36" height="50" fill="transparent"/>`;
    g.innerHTML=inner;
    const act=gesture=>playNote(freq,g,gesture);
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act(true);}});
    layer.appendChild(g);
    notes.push(act);
  });

  // לחיצה, גרירה (מגע) או ריחוף (עכבר): התו נקבע לפי המיקום לרוחב החמשה
  const svg=document.getElementById('staffSvg');
  let dragging=false,last=-1;
  function noteAt(e){
    const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const i=Math.round((p.x-startX)/gap);
    return i>=0&&i<notes.length?i:-1;
  }
  function hit(e,gesture){
    const i=noteAt(e);
    if(i>=0&&i!==last)notes[i](gesture);
    last=i;
  }
  svg.addEventListener('pointerdown',e=>{
    last=-1;
    if(e.pointerType!=='mouse'){dragging=true;svg.setPointerCapture(e.pointerId);}
    hit(e,true);
  });
  svg.addEventListener('pointermove',e=>{if(dragging||e.pointerType==='mouse')hit(e);});
  svg.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')last=-1;});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>
    svg.addEventListener(t,()=>{dragging=false;}));
})();

/* ─── טופס ─── */
document.getElementById('leadForm').addEventListener('submit',function(){
  setTimeout(()=>{
    this.style.display='none';
    document.getElementById('formSuccess').style.display='block';
  },400);
});

/* ══ DESIGN PANEL SCRIPT (למחיקה בסוף) ══ */
(function(){
  const inks=[{n:'דיו כחול',c:'#2C4770'},{n:'יין',c:'#6E2B3A'},{n:'יער',c:'#31523F'},{n:'גרפיט',c:'#3C3A35'}];
  const fonts=[{n:'Bellefair',v:"'Bellefair', serif"},{n:'Karantina',v:"'Karantina', serif"}];
  const root=document.documentElement.style;
  function build(el,arr,render,apply){
    arr.forEach((item,i)=>{
      const b=render(item);
      if(i===0)b.classList.add('sel');
      b.onclick=()=>{apply(item);el.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');};
      el.appendChild(b);
    });
  }
  build(document.getElementById('dpInks'),inks,
    i=>{const b=document.createElement('button');b.className='swatch';b.title=i.n;b.style.background=i.c;return b;},
    i=>root.setProperty('--accent',i.c));
  build(document.getElementById('dpFonts'),fonts,
    f=>{const b=document.createElement('button');b.className='opt';b.textContent=f.n;return b;},
    f=>root.setProperty('--font-display',f.v));
  document.getElementById('dpOverlay').oninput=e=>root.setProperty('--overlay',e.target.value/100);
  document.getElementById('dpToggle').onclick=()=>document.getElementById('dp').classList.toggle('open');
})();
