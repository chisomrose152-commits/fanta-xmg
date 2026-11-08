document.getElementById('burger').onclick=()=>document.getElementById('menu').classList.toggle('open');
document.querySelectorAll('#menu a').forEach(a=>a.onclick=()=>document.getElementById('menu').classList.remove('open'));
try{
const el=document.getElementById('stage'),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,100);cam.position.set(0,.3,9);
const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(r.domElement);
// env for chrome reflections
const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
g.addColorStop(0,'#fff');g.addColorStop(.35,'#647A9B');g.addColorStop(.5,'#111');g.addColorStop(.7,'#075B59');g.addColorStop(1,'#B8BBCB');x.fillStyle=g;x.fillRect(0,0,512,256);x.fillStyle='#fff';x.fillRect(60,40,60,100);x.fillRect(300,60,120,30);
const et=new THREE.CanvasTexture(c);et.mapping=THREE.EquirectangularReflectionMapping;const pm=new THREE.PMREMGenerator(r);sc.environment=pm.fromEquirectangular(et).texture;
const chrome=new THREE.MeshStandardMaterial({color:0xdfe3ee,metalness:1,roughness:.18}),teal=new THREE.MeshStandardMaterial({color:0x075B59,metalness:.9,roughness:.25,emissive:0x053c3b});
const L=new THREE.PointLight(0x14a09b,60,30);L.position.set(-4,2,4);sc.add(L,new THREE.PointLight(0xffffff,30,30));sc.children[1].position.set(5,5,5);
const root=new THREE.Group();sc.add(root);
// F monogram
const f=new THREE.Group(),bx=(w,h,d,px,py,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m||chrome);b.position.set(px,py,0);f.add(b)};
bx(.55,3.2,.6,-.9,0);bx(2,.55,.6,-.1,1.32);bx(1.4,.5,.6,-.4,.15);
const up=new THREE.Mesh(new THREE.BoxGeometry(.28,1.5,.4),teal);up.position.set(.7,-.9,0);up.rotation.z=-.7;f.add(up);root.add(f);
// globe
const gl=new THREE.Mesh(new THREE.SphereGeometry(2.1,32,24),new THREE.MeshBasicMaterial({color:0x14a09b,wireframe:true,transparent:true,opacity:.18}));root.add(gl);
// rings
const rings=[3,3.7,4.4].map((rad,i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(rad,.035+i*.01,16,160),i==1?teal:chrome);t.rotation.set(1.2-i*.5,i*.6,0);root.add(t);return t});
// skyscrapers
const city=new THREE.Group();[[-3,2.6],[-2.3,3.6],[2.4,3],[3.1,2.2],[2.8,4]].forEach(([px,h],i)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.5,h,.5),i%2?chrome:teal);b.position.set(px,-2.6+h/2-.3,-1.2);city.add(b)});root.add(city);
// particles
const pg=new THREE.BufferGeometry(),pa=[];for(let i=0;i<260;i++)pa.push((Math.random()-.5)*14,(Math.random()-.5)*10,(Math.random()-.5)*8);pg.setAttribute('position',new THREE.Float32BufferAttribute(pa,3));sc.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.025,color:0xB8BBCB})));
function rs(){const w=el.clientWidth,h=el.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.position.z=w<500?12:9;cam.updateProjectionMatrix()}rs();addEventListener('resize',rs);
let mx=0,my=0,drag=false,rot=0;el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();mx=(e.clientX-b.left)/b.width-.5;my=(e.clientY-b.top)/b.height-.5;if(drag)rot+=e.movementX*.01});el.onpointerdown=()=>drag=true;addEventListener('pointerup',()=>drag=false);
const clk=new THREE.Clock(),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
(function loop(){requestAnimationFrame(loop);const t=still?0:clk.getElapsedTime();
f.rotation.y=Math.sin(t*.5)*.5+mx*.8+rot;f.rotation.x=my*.4;f.position.y=Math.sin(t)*.12;gl.rotation.y=t*.1;
rings.forEach((m,i)=>{m.rotation.z=t*(.12+i*.07)*(i%2?-1:1)});root.rotation.y=mx*.3;r.render(sc,cam)})();
gsap.from(root.scale,{x:.2,y:.2,z:.2,duration:2,ease:'expo.out',delay:.5});
}catch(e){document.getElementById('stage').style.background='radial-gradient(circle,#075B5966,transparent 65%)'}
// entrance
gsap.to('#veil',{opacity:0,duration:.9,delay:.3,onComplete:()=>document.getElementById('veil').remove()});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
gsap.from('.hero h1,.hero h2,.hero p,.badge,.btns',{y:40,opacity:0,stagger:.12,duration:1.1,ease:'power3.out',delay:.8});
gsap.registerPlugin(ScrollTrigger);
gsap.from('.strip .it',{y:30,opacity:0,stagger:.1,scrollTrigger:{trigger:'.strip',start:'top 90%'}});
gsap.from('.card',{y:80,opacity:0,rotateX:-18,stagger:.15,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.cards',start:'top 80%'}});
gsap.to('#stage',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
}
// 3D tilt
document.querySelectorAll('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const b=c.getBoundingClientRect(),px=(e.clientX-b.left)/b.width-.5,py=(e.clientY-b.top)/b.height-.5;c.style.transform=`rotateY(${px*14}deg) rotateX(${-py*14}deg) translateY(-6px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});