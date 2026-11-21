const screen=document.getElementById('screen'),wrap=document.getElementById('screen-wrap');
function fit(){const scale=Math.min(innerWidth/402,1);screen.style.zoom=scale;wrap.style.width=402*scale+'px';}
window.addEventListener('resize',fit);fit();
window.renderFlow=function(v){const isScreen=!!SCREENS[v];wrap.hidden=!isScreen;document.getElementById('app').hidden=isScreen;if(!isScreen)return false;screen.innerHTML=SCREENS[v];if(v==='game'){renderGame();return true;}
 const byId=id=>screen.querySelector(`[data-node-id="${id}"]`);
 if(v==='home')byId('33:383').textContent=`${L.solved(state)} / 20`;
 screen.querySelectorAll('[data-name]').forEach(el=>{const name=el.dataset.name;let route=name==='导航 / 探索'?'home':name==='导航 / 地图'?'map':name==='导航 / 题目'?'quiz':name.includes('继续探索')?(L.solved(state)?'quiz':'intro'):name.includes('进入地图')?'map':name.includes('查看题目')?'quiz':name==='图标 / 返回'?(v==='reflection'?'result':'home'):null;if(route){el.dataset.route=route;el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',name);}});
 if(v==='home')byId('33:386').dataset.route='intro';
 if(v==='map'){
  const map=screen.querySelector('[data-name="园区地图 · 点击横屏查看"]');map.onclick=()=>imageDialog(map.querySelector('img').src,'园区地图 · 双指缩放或横屏查看');
  const mind=screen.querySelector('[data-name="思维导图 / 预留"]');
  mind.setAttribute('aria-expanded','false');mind.setAttribute('aria-controls','mindmap-image');
  const panel=document.createElement('div');panel.id='mindmap-image';panel.hidden=true;panel.className='mindmap-image';
  const image=document.createElement('img');image.src='assets/exploration-mindmap.svg';image.alt='探索思维导图：每组 a 至 e 为基础题，第一、二组 f 及第三、四组 f、g 为选做思考题，汇合至最终答案';
  const zoom=document.createElement('button');zoom.type='button';zoom.className='mindmap-zoom';zoom.setAttribute('aria-label','放大查看思维导图');zoom.append(image);zoom.onclick=()=>imageDialog(image.src,'探索思维导图');panel.append(zoom);mind.parentElement.append(panel);
  mind.onclick=()=>{panel.hidden=!panel.hidden;mind.setAttribute('aria-expanded',String(!panel.hidden));const text=mind.querySelector('[data-node-id="33:514"]');if(text)text.textContent=panel.hidden?'展开  ﹀':'收起  ﹀';};

 }
 if(v==='reflection')screen.querySelectorAll('img').forEach(img=>{if(img.src.endsWith('.png')){img.style.pointerEvents='auto';img.style.cursor='zoom-in';img.onclick=()=>imageDialog(img.src,'探索风景');}});
 return true;
};
function imageDialog(src,title){const d=document.createElement('dialog');d.className='image-dialog';const h=document.createElement('h2');h.textContent=title;const img=document.createElement('img');img.src=src;img.alt=title;const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>d.close();d.append(h,img,close);document.body.append(d);d.addEventListener('close',()=>d.remove());d.showModal();}
document.addEventListener('click',e=>{const r=e.target.closest('[data-route]');if(r){go(r.dataset.route);return;}const j=e.target.closest('[data-map-jump]');if(j){group=(Q.find(q=>q.id===j.dataset.mapJump)||T.find(q=>q.id===j.dataset.mapJump)).group;go('quiz');document.getElementById('q-'+j.dataset.mapJump).scrollIntoView({block:'start'});}});
document.addEventListener('keydown',e=>{const el=e.target;if((e.key==='Enter'||e.key===' ')&&el.matches('[data-route]:not(button)')){e.preventDefault();el.click();}});
const requested=location.hash.slice(1);go(['home','intro','map','quiz','result','reflection','game'].includes(requested)&& (requested!=='reflection'||state.finalDone)?requested:'home');
