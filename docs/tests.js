const Quiz = (() => {
  let papers=[],worksheets=[];
  const attempts=new Map();
  function parseAnswer(raw){
    const normalized=String(raw??'').trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296)).replace(/．/g,'.').replace(/−/g,'-');
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized))return null;
    const value=Number(normalized);return Number.isFinite(value)?value:null;
  }
  function grade(questions,answers){
    return questions.map((question,i)=>{
      const value=parseAnswer(answers[i]);
      return {correct:value!==null&&Math.abs(value-Number(question.answer))<1e-9,blank:String(answers[i]??'').trim()===''};
    });
  }
  const range=p=>`第${p.start}～${p.end}课`;
  const label=p=>p.name||(p.level===1?'测试一 · 基础练习':'测试二 · 进阶挑战');
  function init(data,images){papers=data;worksheets=images;}
  function catalog(){
    return `<section class="test-hub courses" id="tests"><div class="section-title"><div class="eyebrow">CHECK YOUR MATH SUPERPOWERS</div><h2>分段测试 · 巧算小挑战</h2><p>每三课一站，先练基础，再挑战进阶。最后一站复习第19～20课。</p></div><div class="test-groups">${Array.from({length:7},(_,i)=>{
      const group=papers.filter(p=>p.group===i+1),p=group[0];
      return `<section class="test-group"><div class="test-group-heading"><span class="test-group-number">${String(i+1).padStart(2,'0')}</span><div><h3>${range(p)}</h3><p>${escapeHTML(lessons.filter(l=>l.number>=p.start&&l.number<=p.end).map(l=>l.title).join(' · '))}</p></div></div><div class="test-options">${group.map(p=>`<a class="test-option ${p.level===2?'advanced':''}" href="#test/${p.id}"><strong>${label(p)}</strong><span>10题 · 100分 · ${p.level===1?'用对方法':'多想一步'}</span><b aria-hidden="true">${p.level===1?'✦':'✦✦'}</b></a>`).join('')}</div></section>`;
    }).join('')}</div></section>${fullCatalog()}${printCatalog()}`;
  }

  function fullCatalog(){
    const finals=papers.filter(p=>p.comprehensive);
    return `<section class="courses final-hub" id="comprehensive"><div class="section-title"><div class="eyebrow">THE BIG MATH CHALLENGE</div><h2>全课程综合测试 · A / B / C卷</h2><p>每卷25题，覆盖第1～20课。先稳稳完成A卷，再向B、C卷挑战。</p></div><div class="final-grid">${finals.map((p,i)=>`<a class="final-card final-${i}" href="#test/${p.id}"><span class="final-letter">${String.fromCharCode(65+i)}</span><h3>${escapeHTML(p.name.split(' · ')[1])}</h3><p>${['直接应用巧算方法，巩固基础。','练进位、补零和更复杂的数字。','组合方法、反向推理、判断条件。'][i]}</p><strong>25题 · 每题4分 · 100分</strong><span class="final-entry">开始${String.fromCharCode(65+i)}卷</span></a>`).join('')}</div></section>`;
  }
  function printCatalog(){
    return `<section class="courses printable-hub" id="print-tests"><div class="section-title"><div class="eyebrow">PENCIL & PAPER TIME</div><h2>可打印的简单测试题</h2><p>拿出铅笔，在纸上慢慢算。7张原始图文试卷，按A4整页打印。</p><a class="primary" href="print-tests.html?sheet=all" target="_blank" rel="noopener">打印全部7张</a></div><div class="worksheet-grid">${worksheets.map((w,i)=>`<article class="worksheet-card"><a href="${w.src}" target="_blank" rel="noopener" aria-label="查看${w.name}原图"><img src="${w.src}" alt="${w.name}原始图文测试题" width="${w.width}" height="${w.height}" loading="lazy"></a><div class="worksheet-info"><h3>${w.name}</h3><div><a class="secondary" href="print-tests.html?sheet=${i}" target="_blank" rel="noopener">打印这一张</a><a class="worksheet-download" href="${w.src}" download>下载原图</a></div></div></article>`).join('')}</div></section>`;
  }
  function renderPrint(){document.querySelector('#main').innerHTML=`<div class="lesson-page"><nav class="breadcrumb"><a href="#tests">综合测试</a> / 可打印试卷</nav>${printCatalog()}</div>`;document.title='可打印的简单测试题 · 巧算探索站';}
  function state(p){if(!attempts.has(p.id))attempts.set(p.id,{answers:Array(p.questions.length).fill(''),submitted:false});return attempts.get(p.id);}
  function results(p,s){
    const points=100/p.questions.length;const graded=grade(p.questions,s.answers),correct=graded.filter(r=>r.correct).length,blank=graded.filter(r=>r.blank).length;
    return `<section class="test-result" id="test-result" tabindex="-1" aria-label="测试结果"><div class="score-circle"><strong>${correct*points}</strong><span>分 / 100</span></div><div><span class="eyebrow">这次的小收获</span><h2>${correct===p.questions.length?'全部答对，巧算方法用得真棒！':correct/p.questions.length>=0.7?'已经掌握不少方法，再练练这几题！':'一步一步来，看看解析再试一次！'}</h2><p>答对${correct}题 · ${blank?`未作答${blank}题 · `:''}每题${points}分。下方可以查看答案与解析。</p><button class="secondary" type="button" id="retry-test">重新做这套题</button></div></section>`;
  }
  function render(id){
    if(id===null){document.querySelector('#main').innerHTML=`<div class="lesson-page"><nav class="breadcrumb"><a href="#courses">探索地图</a> / 综合测试</nav>${catalog()}</div>`;document.title='综合测试 · 巧算探索站';return true;}
    const p=papers.find(p=>p.id===id);if(!p)return false;
    const s=state(p),graded=s.submitted?grade(p.questions,s.answers):null;
    document.title=`${range(p)} ${label(p)} · 巧算探索站`;
    document.querySelector('#main').innerHTML=`<article class="lesson-page test-paper"><nav class="breadcrumb" aria-label="面包屑"><a href="#courses">探索地图</a> / <a href="#tests">综合测试</a> / ${range(p)}</nav><header class="lesson-heading" style="--tint:${p.level===1?'#ecfaf0':'#f1eeff'}"><div class="eyebrow">${p.comprehensive?'全课程综合测试':'第'+p.group+'站'} · ${range(p)}</div><h1>${label(p)}</h1><p>一共${p.questions.length}题，每题${100/p.questions.length}分。先独立计算，只填数字，不用写单位；余数题请看清要填“商”还是“余数”。不计时，慢慢想。</p><div class="test-meta"><span>覆盖${range(p)}</span><span>满分100分</span><span id="test-progress">已填写${s.answers.filter(v=>v.trim()).length} / ${p.questions.length}题</span></div></header>${s.submitted?results(p,s):''}<form id="test-form" novalidate><div class="test-questions">${p.questions.map((q,i)=>`<section class="test-question ${graded?(graded[i].correct?'is-correct':'is-incorrect'):''}"><div class="question-heading"><span class="question-number">${String(i+1).padStart(2,'0')}</span><span class="question-topic">第${q.lesson}课 · ${escapeHTML(lessons[q.lesson-1].title)}</span>${graded?`<strong class="question-mark">${graded[i].correct?'✓ 答对了':graded[i].blank?'未作答':'再练练'}</strong>`:''}</div><label for="test-answer-${i}" class="question-prompt">${escapeHTML(q.prompt)}</label><input class="test-answer" id="test-answer-${i}" name="answer-${i}" data-question="${i}" inputmode="decimal" autocomplete="off" placeholder="你的答案" aria-label="第${i+1}题：${escapeHTML(q.prompt)}" value="${escapeHTML(s.answers[i])}" ${s.submitted?'readonly':''}>${graded?`<div class="question-review"><p>正确答案：<strong>${escapeHTML(q.answer)}</strong></p><details ${graded[i].correct?'':'open'}><summary>查看巧算解析</summary><p>${escapeHTML(q.explanation)}</p><a href="#lesson/${q.lesson}">复习第${q.lesson}课</a></details></div>`:''}</section>`).join('')}</div>${s.submitted?'<div class="test-submit"><a class="primary" href="#tests">回到综合测试</a></div>':'<div class="test-submit"><p>检查一下，有没有漏题？交卷后就能看答案和解析。</p><button class="primary" type="submit">交卷，看看我的收获</button></div>'}</form></article>`;
    if(s.submitted){document.querySelector('#retry-test').addEventListener('click',()=>{attempts.delete(id);render(id);window.scrollTo(0,0);});}
    else{
      document.querySelector('#test-form').addEventListener('input',e=>{
        if(!e.target.matches('[data-question]'))return;
        s.answers[Number(e.target.dataset.question)]=e.target.value;
        document.querySelector('#test-progress').textContent=`已填写${s.answers.filter(v=>v.trim()).length} / ${p.questions.length}题`;
      });
      document.querySelector('#test-form').addEventListener('submit',e=>{e.preventDefault();s.submitted=true;render(id);document.querySelector('#test-result').focus();document.querySelector('#test-result').scrollIntoView({block:'start'});});
    }
    return true;
  }
  return {init,catalog,render,renderPrint,parseAnswer,grade};
})();
if(typeof module!=='undefined'&&module.exports)module.exports={parseAnswer:Quiz.parseAnswer,grade:Quiz.grade};
