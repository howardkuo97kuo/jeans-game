/* Pastel letter and number block characters (original redraws of the reference sheet).
   blockSVG(ch, glyph, mood) -> svg string. mood: '' | 'happy' | 'oops' | 'think' | 'wink' */
const BLK_C={
 green:{t:'#EEF8C9',b:'#BEE46E',e:'#8DC63F',g:'#43A82A',gd:'#2E7D1E',l:'#6DBE3A',i:'#3E9B2C'},
 blue:{t:'#E8F4FC',b:'#A3D3F3',e:'#6BB2E4',g:'#2D8CD8',gd:'#1D65A8',l:'#3D9AE0',i:'#2A78C4'},
 pink:{t:'#FFEAF0',b:'#FBB5C8',e:'#F28BA7',g:'#EE3F78',gd:'#B8285A',l:'#EE6C93',i:'#C93767'},
 purple:{t:'#F0E7FB',b:'#C9ABF0',e:'#A57DDB',g:'#8546D4',gd:'#5F2FA3',l:'#8E5BD8',i:'#6B3FB8'},
 yellow:{t:'#FFF8C6',b:'#FFE265',e:'#F2C531',g:'#F5B100',gd:'#B98300',l:'#F2B705',i:'#B97A00'},
 teal:{t:'#E0F7F4',b:'#97DED6',e:'#5CC5BB',g:'#12A99E',gd:'#0B7A72',l:'#2DB9AE',i:'#0F8B85'},
 orange:{t:'#FFEAD2',b:'#FFBA6B',e:'#F59A33',g:'#F57510',gd:'#B8520A',l:'#F58A1F',i:'#B65A08'},
 coral:{t:'#FFE4E0',b:'#FFA69D',e:'#F47A70',g:'#E43E35',gd:'#A82A23',l:'#E8584E',i:'#B83028'}
};
const BLK_L={a:'green',b:'blue',c:'pink',d:'purple',e:'yellow',f:'teal',g:'purple',h:'orange',i:'coral',j:'blue',k:'yellow',l:'pink',m:'green',n:'purple',o:'orange',p:'blue',q:'coral',r:'green',s:'pink',t:'blue',u:'orange',v:'yellow',w:'blue',x:'purple',y:'green',z:'blue'};
const BLK_POSE={a:'waveL',e:'waveL',j:'waveL',s:'waveL',u:'waveL',i:'waveR',r:'waveR',z:'waveR'};
const BLK_D=[['purple','stars','waveL'],['blue','stripes','waveR'],['green','shapes2','down'],['yellow','dots','both'],['orange','stripes','cheer'],['coral','stars','waveL'],['teal','shapes','down'],['pink','triangles','waveR'],['purple','hearts','waveR'],['green','squares','waveR']];
let blkUid=0;
function blkPattern(kind,col){
  const P=[[-26,16],[26,14],[-30,38],[30,40],[-24,64],[26,66],[0,92],[-8,16],[0,60],[-34,86],[34,88]];
  const sh={
    stars:(x,y)=>`<path transform="translate(${x} ${y})" d="M0-5 1.5-1.6 5-1.2 2.4 1.2 3.1 4.8 0 3 -3.1 4.8 -2.4 1.2 -5-1.2 -1.5-1.6z"/>`,
    dots:(x,y)=>`<circle cx="${x}" cy="${y}" r="3"/>`,
    triangles:(x,y)=>`<path d="M${x} ${y-4.5}L${x+4.5} ${y+3.5}H${x-4.5}z"/>`,
    hearts:(x,y)=>`<path transform="translate(${x} ${y})" d="M0 4C-7-1-4-6 0-2 4-6 7-1 0 4z"/>`,
    squares:(x,y)=>`<rect x="${x-3.5}" y="${y-3.5}" width="7" height="7" rx="1.5"/>`
  };
  if(kind==='stripes'){let s='';for(let x=-44;x<46;x+=12)s+=`<rect x="${x}" y="0" width="6" height="110"/>`;return `<g fill="${col}" opacity=".2">${s}</g>`}
  const mixed=kind==='shapes'||kind==='shapes2';
  const order=['dots','triangles','squares','stars'];
  return `<g fill="${col}" opacity=".22">${P.map(([x,y],i)=>sh[mixed?order[i%4]:kind](x,y)).join('')}</g>`;
}
function blkArm(side,pose,c){
  const s=side==='L'?-1:1,x0=s*41;let d,h;
  const up=(side==='L'&&(pose==='waveL'||pose==='cheer'||pose==='both'))||(side==='R'&&(pose==='waveR'||pose==='cheer'||pose==='both'));
  if(pose==='think'&&side==='R'){d=`M${x0} 72Q${s*52} 84 ${s*34} 92`;h=[s*31,91]}
  else if(up){d=`M${x0} 66Q${s*54} 56 ${s*52} 40`;h=[s*52,37]}
  else{d=`M${x0} 70Q${s*52} 80 ${s*49} 92`;h=[s*49,94]}
  const wave=up?`<ellipse cx="${h[0]+s*4}" cy="${h[1]-4}" rx="2.6" ry="3.6" fill="${c.l}" transform="rotate(${s*30} ${h[0]+s*4} ${h[1]-4})"/>`:'';
  return `<path d="${d}" fill="none" stroke="${c.l}" stroke-width="8.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".28" transform="translate(-1 -1)"/>${wave}<circle cx="${h[0]}" cy="${h[1]}" r="6.4" fill="${c.l}"/><circle cx="${h[0]-1.8}" cy="${h[1]-2}" r="2" fill="#fff" opacity=".4"/>`;
}
function blkFace(mood,c){
  const INK='#1B2A55';
  const eye=(x,look)=>{const px=x+(look?look[0]:0),py=71+(look?look[1]:0);
    return `<ellipse class="eye" cx="${x}" cy="70" rx="11" ry="12" fill="#fff" stroke="${c.e}" stroke-width="1.6"/><circle cx="${px}" cy="${py}" r="8.2" fill="${c.i}"/><circle cx="${px}" cy="${py}" r="4.6" fill="${INK}"/><circle cx="${px-2.4}" cy="${py-2.8}" r="2.3" fill="#fff"/><circle cx="${px+2.6}" cy="${py+2.6}" r="1.1" fill="#fff"/>`};
  const arc=x=>`<path d="M${x-9} 73Q${x} 58 ${x+9} 73" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  const smile=`<path d="M40 83Q50 96 60 83z" fill="#7A1F2B" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M44.5 89.5Q50 86 55.5 89.5Q50 94.5 44.5 89.5z" fill="#FF7FA8"/>`;
  const cheeks=`<ellipse cx="-23" cy="84" rx="5.5" ry="3.4" fill="#FF7FA8" opacity=".45"/><ellipse cx="23" cy="84" rx="5.5" ry="3.4" fill="#FF7FA8" opacity=".45"/>`;
  let eyes,mouth,extra='';
  if(mood==='happy'){eyes=arc(-14)+arc(14);mouth=`<path d="M38 80Q50 100 62 80z" fill="#7A1F2B" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M43 90Q50 85 57 90Q50 97 43 90z" fill="#FF7FA8"/>`}
  else if(mood==='oops'){eyes=eye(-14)+eye(14);mouth=`<path d="M41 90Q45 82 50 87Q55 92 59 84" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
    extra=`<path d="M-24 56L-6 60M24 56L6 60" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M34 50Q40 60 34 66Q28 60 34 50z" fill="#8FD3FF" stroke="#3D8BFF" stroke-width="1.5"/>`}
  else if(mood==='think'){eyes=eye(-14,[-2.2,-3])+eye(14,[-2.2,-3]);mouth=`<path d="M43 87Q51 83 58 88" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
    extra=`<path d="M-24 56L-6 53" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M6 52L24 55" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`}
  else if(mood==='wink'){eyes=eye(-14)+`<path d="M5 72Q14 59 23 72" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;mouth=smile}
  else{eyes=eye(-14)+eye(14);mouth=smile}
  return `<g transform="translate(0 0)">${eyes}${extra}<g transform="translate(-50 0)">${mouth}</g>${cheeks}</g>`;
}
function blkBuild(text,colName,{pattern=null,pose='down',mood='',wide=false}={}){
  const c=BLK_C[colName],id='bk'+(++blkUid),W=wide?112:82,x0=-W/2,desc=/^[gjpqy]$/.test(text),fs=wide?46:(text.length>1?40:desc?50:58),by=desc?46:53;
  if(mood==='happy'&&pose==='down')pose='cheer';
  if(mood==='think')pose='think';
  const legL=-W*.22,legR=W*.22;
  const feet=[legL,legR].map(x=>`<rect x="${x-4.5}" y="96" width="9" height="12" fill="${c.l}"/><rect x="${x-10}" y="104" width="20" height="12" rx="6" fill="${c.l}"/><ellipse cx="${x-3}" cy="107.5" rx="4" ry="2" fill="#fff" opacity=".35"/>`).join('');
  const body=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.t}"/><stop offset=".55" stop-color="${c.t}"/><stop offset="1" stop-color="${c.b}"/></linearGradient><clipPath id="${id}c"><rect x="${x0}" y="3" width="${W}" height="96" rx="17"/></clipPath></defs>
   <ellipse cx="0" cy="118.5" rx="${W*.4}" ry="3" fill="#1B2A55" opacity=".1"/>
   ${feet}
   ${blkArm('L',mood==='think'?'down':pose,c)}${mood==='think'?'':blkArm('R',pose,c)}
   <rect x="${x0}" y="7" width="${W}" height="96" rx="17" fill="${c.e}"/>
   <rect x="${x0}" y="3" width="${W}" height="96" rx="17" fill="url(#${id})" stroke="${c.e}" stroke-width="2"/>
   ${pattern?`<g clip-path="url(#${id}c)">${blkPattern(pattern,c.g)}</g>`:''}
   <rect x="${x0+6}" y="8" width="${W*.45}" height="5" rx="2.5" fill="#fff" opacity=".7"/>
   <text x="0" y="${by+2.5}" text-anchor="middle" font-family="Fredoka,'Trebuchet MS',sans-serif" font-weight="700" font-size="${fs}" fill="${c.gd}" stroke="${c.gd}" stroke-width="3" stroke-linejoin="round">${text}</text>
   <text x="0" y="${by}" text-anchor="middle" font-family="Fredoka,'Trebuchet MS',sans-serif" font-weight="700" font-size="${fs}" fill="${c.g}" stroke="${c.g}" stroke-width="3" stroke-linejoin="round">${text}</text>
   <text x="-1" y="${by-1}" text-anchor="middle" font-family="Fredoka,'Trebuchet MS',sans-serif" font-weight="700" font-size="${fs}" fill="#fff" opacity=".18">${text}</text>
   ${blkFace(mood,c)}${mood==='think'?blkArm('R','think',c):''}`;
  const vw=W+46;
  return `<svg class="blk" viewBox="${-vw/2} 0 ${vw} 122" aria-hidden="true">${body}</svg>`;
}
const BLK_ESC=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* letters: blockSVG('b','b','happy'); digits: digitSVG(7) or two-digit numbers (10-20) */
function blockSVG(L,glyph,mood){
  const l=String(L).toLowerCase(),col=BLK_L[l]||'blue';
  return blkBuild(BLK_ESC(glyph==null?l:glyph),col,{pose:BLK_POSE[l]||'down',mood:mood||''});
}
function digitSVG(n,mood){
  n=+n;if(n<10){const [col,pat,pose]=BLK_D[n];return blkBuild(String(n),col,{pattern:pat,pose,mood:mood||''})}
  const [col,pat,pose]=BLK_D[n%10];return blkBuild(String(n),col,{pattern:pat,pose,mood:mood||'',wide:true});
}
if(typeof module!=='undefined')module.exports={blockSVG,digitSVG,BLK_C,BLK_L};
