const assert=require('node:assert/strict');
const fs=require('node:fs');
const {parseAnswer,grade}=require('./docs/tests.js');
assert.equal(parseAnswer(''),null);
assert.equal(parseAnswer('   '),null);
assert.equal(parseAnswer('Infinity'),null);
assert.equal(parseAnswer('1e3'),null);
assert.equal(parseAnswer('１２．５０'),12.5);
assert.equal(parseAnswer(' 0 '),0);
assert.equal(parseAnswer('.25'),.25);
const papers=JSON.parse(fs.readFileSync('./docs/tests-data.json','utf8'));
assert.equal(papers.length,17);
for(const p of papers){
 const count=p.comprehensive?25:10;
 assert.equal(p.questions.length,count);
 assert.equal(grade(p.questions,p.questions.map(q=>q.answer)).filter(r=>r.correct).length,count);
 assert.equal(grade(p.questions,Array(count).fill('')).filter(r=>r.correct).length,0);
 const answers=p.questions.map(q=>q.answer);answers[0]='wrong';answers[1]='';
 const evaluated=grade(p.questions,answers);
 assert.equal(evaluated.filter(r=>r.correct).length,count-2);
 assert.equal(evaluated.filter(r=>r.blank).length,1);
}
const finals=papers.filter(p=>p.comprehensive);
assert.deepEqual(finals.map(p=>p.id),['final-a','final-b','final-c']);
for(const p of finals){assert.equal(new Set(p.questions.map(q=>q.lesson)).size,20);assert.equal(100/p.questions.length,4);}
console.log('17 papers: 10/25-question grading, full-course coverage, blanks and numeric input verified.');
