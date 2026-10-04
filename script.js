/*
 * ABYSS PROTOCOL // COMING SOON
 * Copyright (c) 2026 Sina Rezaei
 * Licensed under the MIT License. See LICENSE.
 */

const canvas = document.getElementById("ocean");
const ctx = canvas.getContext("2d");
const abyss = document.getElementById("abyss");
const glow = document.getElementById("cursorGlow");
const researcher = document.getElementById("researcher");

let w, h, particles = [], bubbles = [];
const mouse = {x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2};

function resize(){
  w = canvas.width = innerWidth * devicePixelRatio;
  h = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  createParticles();
}
function createParticles(){
  const count = Math.min(430, Math.floor(innerWidth * innerHeight / 4200));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    z: Math.random(), r: Math.random()*1.4+.15,
    speed: Math.random()*.34+.04, drift:(Math.random()-.5)*.12,
    alpha: Math.random()*.45+.06
  }));
  bubbles = Array.from({length: 30}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    r: Math.random()*2.7+.4, speed: Math.random()*.35+.08,
    wobble: Math.random()*Math.PI*2, alpha: Math.random()*.18+.04
  }));
}
function drawOcean(){
  ctx.clearRect(0,0,innerWidth,innerHeight);

  particles.forEach(p=>{
    p.y -= p.speed;
    p.x += p.drift + (mouse.x-innerWidth/2)*0.00001*(1-p.z);
    if(p.y < -5){p.y=innerHeight+5;p.x=Math.random()*innerWidth}
    if(p.x < -5)p.x=innerWidth+5;
    if(p.x > innerWidth+5)p.x=-5;
    const size=p.r*(.5+p.z*1.8);
    ctx.beginPath();
    ctx.arc(p.x,p.y,size,0,Math.PI*2);
    ctx.fillStyle=`rgba(100,211,229,${p.alpha*p.z})`;
    ctx.fill();
  });

  bubbles.forEach(b=>{
    b.y -= b.speed;
    b.wobble += .015;
    b.x += Math.sin(b.wobble)*.16;
    if(b.y < -10){b.y=innerHeight+10;b.x=Math.random()*innerWidth}
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(125,224,239,${b.alpha})`;
    ctx.lineWidth=.5;
    ctx.stroke();
  });

  requestAnimationFrame(drawOcean);
}

function pointer(e){
  mouse.tx = e.clientX;
  mouse.ty = e.clientY;
}
addEventListener("pointermove", pointer);

function animateInterface(){
  mouse.x += (mouse.tx-mouse.x)*.045;
  mouse.y += (mouse.ty-mouse.y)*.045;

  glow.style.left = mouse.x + "px";
  glow.style.top = mouse.y + "px";

  const dx=(mouse.x-innerWidth/2)/innerWidth;
  const dy=(mouse.y-innerHeight/2)/innerHeight;
  const facility=document.querySelector(".facility");
  facility.style.transform=`perspective(1200px) rotateX(${3-dy*2}deg) translate(${dx*-9}px,${dy*-6}px)`;
  researcher.style.marginLeft = `${dx*9}px`;
  researcher.style.marginTop = `${dy*6}px`;

  requestAnimationFrame(animateInterface);
}

let remaining = (7*24*60*60)+(19*60*60)+(42*60)+16;
function countdown(){
  remaining--;
  if(remaining < 0) remaining = 7*24*60*60;
  const d=Math.floor(remaining/86400);
  const hh=Math.floor((remaining%86400)/3600);
  const mm=Math.floor((remaining%3600)/60);
  const ss=remaining%60;
  document.getElementById("days").textContent=String(d).padStart(2,"0");
  document.getElementById("hours").textContent=String(hh).padStart(2,"0");
  document.getElementById("minutes").textContent=String(mm).padStart(2,"0");
  document.getElementById("seconds").textContent=String(ss).padStart(2,"0");
}
setInterval(countdown,1000);

let depth=8421, direction=-1;
setInterval(()=>{
  depth += direction * (Math.random()>.7?2:1);
  if(depth<8390 || depth>8450) direction*=-1;
  document.getElementById("depth").textContent=depth.toLocaleString();
},850);

let progress=73;
setInterval(()=>{
  progress += (Math.random()-.47)*.7;
  progress=Math.max(68,Math.min(79,progress));
  document.getElementById("progress").style.height=progress+"%";
  document.getElementById("progressValue").textContent=Math.round(progress);
},1200);

function clock(){
  const d=new Date();
  const t=[d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds()].map(x=>String(x).padStart(2,"0")).join(":");
  document.getElementById("clock").textContent=t+" UTC";
}
setInterval(clock,1000); clock();

const audioBtn=document.getElementById("audioToggle");
let audioOn=false;
let audioCtx, oscillator, gain;
audioBtn.addEventListener("click",()=>{
  audioOn=!audioOn;
  audioBtn.querySelector("small").textContent=audioOn?"ON":"OFF";
  if(audioOn){
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    oscillator=audioCtx.createOscillator();
    gain=audioCtx.createGain();
    oscillator.type="sine";
    oscillator.frequency.value=64;
    gain.gain.value=.015;
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
  }else if(oscillator){
    oscillator.stop();
    audioCtx.close();
  }
});

resize();
addEventListener("resize",resize);
drawOcean();
animateInterface();