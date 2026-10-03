const modules = [
 {title:'加减巧算岛',subtitle:'凑整 · 补数 · 数字规律',symbol:'＋',tint:'#fff0f4',accent:'#ffb5d1'},
 {title:'乘除发现营',subtitle:'转化 · 拆分 · 特殊数字',symbol:'×',tint:'#ecfaf0',accent:'#a7e8ba'},
 {title:'小数魔法屋',subtitle:'凑整 · 差值 · 符号',symbol:'.',tint:'#f1eeff',accent:'#c8b9ff'}
];
const mathLabels=['+3','−1','↔','1…99','×5','×9','÷5','4×9','×11','…1','×25','5□','×33','□3','100','80','×11','÷25','0.3','0.02'];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lessons=[];
const homeHTML=document.querySelector('#main').innerHTML;
function mapHTML(){return modules.map((m,i)=>`<section class="module" style="--tint:${m.tint};--accent:${m.accent}"><div class="module-header"><div class="module-heading"><span class="module-symbol" aria-hidden="true">${m.symbol}</span><div><h3>${m.title}</h3><p>${m.subtitle}</p></div></div><span class="module-count">${i===0?'01—04':i===1?'05—18':'19—20'}课</span></div><div class="lesson-grid">${lessons.filter(l=>l.module===i).map(l=>`<a class="lesson-card" href="#lesson/${l.number}"><div class="card-top"><span class="lesson-number">第 ${String(l.number).padStart(2,'0')} 课</span><span class="lesson-math" aria-hidden="true">${mathLabels[l.number-1]}</span></div><h4>${escapeHTML(l.title)}</h4><div class="card-bottom"><span>图文笔记 · 小练习</span><span class="card-dot" aria-hidden="true">✦</span></div></a>`).join('')}</div></section>`).join('')}
const walkthroughs=[
 [['597 + 324','597离600只差3。'],['(597 + 3) + (324 − 3)','给597补3，也从324拿走3，和不变。'],['600 + 321','现在只要算整百数加法。'],['921','一个加，一个减，答案不变！']],
 [['83 − 39','39离40只差1。'],['(83 + 1) − (39 + 1)','两个数同时加1，差不变。'],['84 − 40','把减数凑成整十。'],['44','算好了，再检查两边是不是加了同一个数。']],
 [['83 − 38','十位和个位交换了位置。'],['(8 − 3) × 9','先找两个十位数字的差。'],['5 × 9','两位颠倒数，用首位差乘9。'],['45','83减38，等于45。']],
 [['1 + 2 + … + 99','连续数相邻只差1。'],['99个数，首尾和100','个数：99−1+1；首尾和：1+99。'],['99 × 100 ÷ 2','倒序再写一遍，每组都是100。要取一半。'],['4950','个数 × 首尾和 ÷ 2。']],
 [['36 × 5','36是偶数，可以先除以2。'],['36 ÷ 2 × 10','因为5就是10的一半。'],['18 × 10','先算36的一半。'],['180','乘5，试试先减半、再乘10。']],
 [['76 × 9','9比10少1。'],['76 × (10 − 1)','用更容易的乘10来帮忙。'],['760 − 76','多算了一个76，要减回来。'],['684','乘9，就是乘10后减去原数。']],
 [['70 ÷ 5','5乘2等于10。'],['70 ÷ 10 × 2','先除以10，再乘2。'],['7 × 2','70除以10等于7。'],['14','除5，可以转成除10再乘2。']],
 [['13 × 36','找找36可以拆成哪两个因数。'],['13 × 4 × 9','36 = 4 × 9。'],['52 × 9','先做容易的13乘4。'],['468','拆分因数，分两次算。']],
 [['67 × 11','先把6和7分开。'],['6 + 7 = 13','中间相加满10，需要进位。'],['百位7 · 十位3 · 个位7','百位是6+1，中间写3，个位仍是7。'],['737','两边保留，中间相加，满10进1。']],
 [['71 × 61','两个数的个位都是1。'],['头积42，头和13','7×6=42；7+6=13。'],['4300 + 30 + 1','头和13要进位：42变43，中间写3。'],['4331','头积、头和、尾1，记得进位。']],
 [['48 × 25','25是100的四分之一。'],['48 ÷ 4 × 100','48能被4整除，先除4最方便。'],['12 × 100','48除以4，得到12。'],['1200','不能整除时，也可以先乘100再除4。']],
 [['68 × 62','头相同，两个尾相加正好是10。'],['(6 + 1) × 6 = 42','先算前面部分。'],['8 × 2 = 16','后面部分要写成两位。'],['4216','把42和16连着写。']],
 [['82 × 33','8+2=10；33的两个数字相同。'],['(8 + 1) × 3 = 27','前面用头加1，再乘重复数字3。'],['2 × 3 = 6，写成06','后面不足两位，补一个0。'],['2706','把27和06连起来，0不能丢。']],
 [['63 × 43','6+4=10，两个尾都是3。'],['6 × 4 + 3 = 27','头相乘，再加共同的尾。'],['3 × 3 = 9，写成09','尾的平方不足两位，要补0。'],['2709','把27和09连起来。']],
 [['78 × 96','用100作为凑整的目标。'],['补数22和4','100−78=22；100−96=4。'],['(96 − 22) × 100 + 22 × 4','交叉相减算前面，补数相乘算后面。'],['7400 + 88 = 7488','把两部分相加。']],
 [['87 × 73','两个数分别在80的两边。'],['中间数80，距离都是7','87−80=7；80−73=7。'],['80 × 80 − 7 × 7','用中间数平方减去距离平方。'],['6400 − 49 = 6351','只有两边距离相同，才这样算。']],
 [['698 × 11','从个位往左，处理相邻数字的和。'],['个位8，十位9+8=17','十位写7，向前进1。'],['百位6+9+1=16','百位写6，再向前进1；千位6+1=7。'],['7678','进位要带到下一步，不能漏。']],
 [['356 ÷ 25','25乘4等于100。'],['356 × 4 ÷ 100','先乘4，把除25转成除100。'],['1424 ÷ 100','356乘4等于1424。'],['14.24','小数点向左移两位。']],
 [['19.8 + 20.3 + 19.7','三个数都很接近20。'],['(20 − 0.2) + (20 + 0.3) + (20 − 0.3)','分别写成20加上或减去差值。'],['60 − 0.2 + 0.3 − 0.3','先合并整数，再处理差值。'],['59.8','0.3和−0.3抵消，剩下60−0.2。']],
 [['86.52 − 43.98','43.98离44只差0.02。'],['86.52 − (44 − 0.02)','把减数写成44−0.02。'],['86.52 − 44 + 0.02','减去括号，里面的符号要变。'],['42.54','多减了0.02，要加回来。']]
];
const exercises=[
 ['398 + 125',523,'给398补2，从125减去2。'],['92 − 48',44,'两个数同时加2，变成94−50。'],['72 − 27',45,'(7−2)×9。'],['1 + 2 + … + 20',210,'20×(1+20)÷2。'],['48 × 5',240,'48÷2×10。'],['23 × 9',207,'230−23。'],['90 ÷ 5',18,'90÷10×2。'],['12 × 35',420,'35=5×7，先算12×5。'],['46 × 11',506,'4+6=10，中间写0，百位进1。'],['31 × 41',1271,'头积12，头和7，尾1。'],['32 × 25',800,'32÷4×100。'],['43 × 47',2021,'(4+1)×4=20；3×7=21。'],['73 × 22',1606,'(7+1)×2=16；3×2=06。'],['42 × 62',2604,'4×6+2=26；2×2=04。'],['92 × 98',9016,'补数8和2；90×100+16。'],['64 × 56',3584,'中间数60，差4；3600−16。'],['234 × 11',2574,'个位4，十位7，百位5，千位2。'],['225 ÷ 25',9,'225×4÷100。'],['9.8 + 10.2 + 9.9',29.9,'三个10，再算−0.2+0.2−0.1。'],['72.5 − 29.98',42.52,'先减30，再加0.02。']
];
function inline(text){return escapeHTML(text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function markdown(text){
 let html='',list='',paragraph=[];
 const flush=()=>{if(paragraph.length){html+=`<p>${inline(paragraph.join(' '))}</p>`;paragraph=[];}if(list){html+=`</${list}>`;list='';}};
 for(const raw of text.split('\n')){
  const line=raw.trim();
  if(!line){flush();continue;}
  if(line.startsWith('### ')){flush();html+=`<h3>${inline(line.slice(4))}</h3>`;continue;}
  const item=line.match(/^(- |\d+\. )(.+)/);
  if(item){if(paragraph.length){html+=`<p>${inline(paragraph.join(' '))}</p>`;paragraph=[];}const tag=item[1]==='- '?'ul':'ol';if(list!==tag){if(list)html+=`</${list}>`;html+=`<${tag}>`;list=tag;}html+=`<li>${inline(item[2])}</li>`;continue;}
  if(list){html+=`</${list}>`;list='';}paragraph.push(line);
 }
 flush();return html;
}
let currentStep=0,currentLesson=null;
function renderLesson(l){
 const m=modules[l.module],step=walkthroughs[l.number-1],exercise=exercises[l.number-1];currentStep=0;currentLesson=l;
 const sections=l.sections.filter(s=>s.heading!=='总结');
 const content=sections.map((s,i)=>i<2?`<section class="learning-card content-section"><h2>${escapeHTML(s.heading)}</h2>${markdown(s.content)}</section>`:`<details class="learning-card"><summary>${escapeHTML(s.heading)}</summary><div class="content-section">${markdown(s.content)}</div></details>`).join('');
 document.querySelector('#main').innerHTML=`<article class="lesson-page" style="--tint:${m.tint};--accent:${m.accent}"><nav class="breadcrumb" aria-label="面包屑"><a href="#courses">探索地图</a> / ${m.title} / 第${l.number}课</nav><header class="lesson-heading"><div class="eyebrow">${m.symbol} ${m.title} · 第 ${String(l.number).padStart(2,'0')} 课</div><h1>${escapeHTML(l.title)}</h1><p>${escapeHTML(l.summary)}</p></header><div class="lesson-layout"><div class="learning-column"><section class="learning-card step-card"><span class="step-label">动手看一看</span><h2>把巧算拆成4小步</h2><div class="step-expression" id="step-expression" aria-live="polite">${escapeHTML(step[0][0])}</div><p class="step-note" id="step-note">${escapeHTML(step[0][1])}</p><div class="step-controls"><button class="secondary" id="step-back" disabled>上一步</button><div class="step-progress" id="step-progress" aria-label="第1步，共4步">${step.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div><button class="primary" id="step-next">下一步</button></div></section>${l.number===3?'<aside class="tip"><strong>笔记更正 · 四位数要多观察一步</strong><p>原图里的四位数示例有误：9261 − 1629 = 7632。正确计算是 (9−1)×999 + (2−6)×90。完全颠倒的四位数，还要算中间两位带来的差，不能只乘999。原始图片保留供对照。</p></aside>':''}${content}<section class="learning-card practice"><span class="step-label">扩展练习 · 试试刚学到的方法</span><h2>轮到你啦！</h2><div class="practice-question">${escapeHTML(exercise[0])} = ?</div><form id="practice-form"><label for="answer">你的答案</label><div class="answer-row"><input id="answer" name="answer" inputmode="decimal" autocomplete="off" placeholder="在这里写得数" required><button class="primary" type="submit">检查</button></div></form><p class="feedback" id="feedback" role="status"></p><details><summary>需要一点提示？</summary><p>${escapeHTML(exercise[2])}</p></details></section></div><aside class="notebook"><div class="notebook-top"><strong>我的图文笔记</strong><button class="secondary" id="zoom-image">放大原图</button></div><button class="image-button" id="notebook-image" aria-label="放大第${l.number}课原始笔记"><img src="${l.image}" alt="第${l.number}课 ${escapeHTML(l.title)} 康奈尔图文课堂笔记" width="1055" height="1491" fetchpriority="high"></button><p class="image-help">点图片放大 · 原始PNG，保留全部细节</p></aside></div><nav class="lesson-nav" aria-label="相邻课程">${l.number>1?`<a href="#lesson/${l.number-1}"><small>上一课</small>${escapeHTML(lessons[l.number-2].title)}</a>`:'<a href="#courses">回到探索地图</a>'}${l.number<20?`<a href="#lesson/${l.number+1}"><small>下一课</small>${escapeHTML(lessons[l.number].title)}</a>`:'<a href="#courses">20课探索完毕，回地图复习</a>'}</nav></article>`;
 document.querySelector('#step-back').addEventListener('click',()=>setStep(currentStep-1));
 document.querySelector('#step-next').addEventListener('click',()=>setStep(currentStep===3?0:currentStep+1));
 document.querySelector('#practice-form').addEventListener('submit',e=>{e.preventDefault();const raw=document.querySelector('#answer').value.trim();const val=Number(raw);const feedback=document.querySelector('#feedback');if(!raw||!Number.isFinite(val)){feedback.textContent='请写一个数字，可以带小数点。';feedback.className='feedback';return;}const correct=Math.abs(val-exercise[1])<1e-8;feedback.className='feedback'+(correct?' correct':'');feedback.textContent=correct?'✦ 算对了！试着说说，你用了什么方法？':'再观察一下数字，试试下面的提示。你可以再算一次。';});
 const zoom=()=>{const image=document.querySelector('#viewer-image');image.src=l.image;image.alt=`第${l.number}课 ${l.title} 原始笔记`;document.querySelector('#image-viewer').showModal();};
 document.querySelector('#zoom-image').addEventListener('click',zoom);document.querySelector('#notebook-image').addEventListener('click',zoom);
 document.title=`第${l.number}课 ${l.title} · 巧算探索站`;
}
function setStep(n){currentStep=n;const steps=walkthroughs[currentLesson.number-1];const expression=document.querySelector('#step-expression');expression.textContent=steps[n][0];expression.classList.remove('animate');void expression.offsetWidth;expression.classList.add('animate');document.querySelector('#step-note').textContent=steps[n][1];document.querySelector('#step-back').disabled=n===0;document.querySelector('#step-next').textContent=n===3?'再看一次':'下一步';document.querySelector('#step-progress').innerHTML=steps.map((_,i)=>`<span class="${i<=n?'active':''}"></span>`).join('');document.querySelector('#step-progress').setAttribute('aria-label',`第${n+1}步，共4步`);}
function render(){
 const match=location.hash.match(/^#lesson\/(\d+)$/);const l=match&&lessons.find(l=>l.number===Number(match[1]));
 if(l){renderLesson(l);window.scrollTo(0,0);return;}
 document.querySelector('#main').innerHTML=homeHTML;document.querySelector('#course-map').innerHTML=mapHTML();document.title='巧算探索站 · 20课小学数学笔记';if(location.hash==='#courses')document.querySelector('#courses').scrollIntoView();else window.scrollTo(0,0);
}
document.querySelector('#close-viewer').addEventListener('click',()=>document.querySelector('#image-viewer').close());
document.querySelector('#image-viewer').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close();});
window.addEventListener('hashchange',()=>{if(lessons.length)render();});
fetch('course-data.json').then(r=>{if(!r.ok)throw Error('load');return r.json()}).then(data=>{lessons=data;render();}).catch(()=>{document.querySelector('#course-map').innerHTML='<div class="load-error">课程暂时没有加载成功。<br><button class="secondary" onclick="location.reload()">重新加载</button></div>'});
