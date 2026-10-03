async function preparePrint(){
 const response=await fetch('print-tests-data.json');if(!response.ok)throw Error('load');
 const all=await response.json();const selection=new URLSearchParams(location.search).get('sheet')??'all';
 const chosen=selection==='all'?all:/^\d+$/.test(selection)&&all[Number(selection)]?[all[Number(selection)]]:[];
 if(!chosen.length)throw Error('selection');
 const sheets=document.querySelector('#print-sheets');
 const loaded=chosen.map(w=>new Promise((resolve,reject)=>{const page=document.createElement('section');page.className='print-sheet';const image=new Image();image.alt=w.name+'原始测试题';image.width=w.width;image.height=w.height;image.onload=resolve;image.onerror=reject;image.src=w.src;page.append(image);sheets.append(page);}));
 await Promise.all(loaded);document.querySelector('#print-status').textContent=`${chosen.length}张原图已准备好，每张打印为一页A4。`;
 const button=document.querySelector('#print-button');button.disabled=false;button.textContent=chosen.length===1?'打印这一张':`打印全部${chosen.length}张`;button.addEventListener('click',()=>window.print());
}
preparePrint().catch(()=>{document.querySelector('#print-status').textContent='图片未能完整加载，请刷新后重试。';document.querySelector('#print-button').textContent='暂时无法打印';});
