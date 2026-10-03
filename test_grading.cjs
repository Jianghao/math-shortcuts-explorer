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
assert.equal(papers.length,14);
for(const p of papers){
 assert.equal(p.questions.length,10);
 assert.equal(grade(p.questions,p.questions.map(q=>q.answer)).filter(r=>r.correct).length,10);
 assert.equal(grade(p.questions,Array(10).fill('')).filter(r=>r.correct).length,0);
 const answers=p.questions.map(q=>q.answer);answers[0]='wrong';answers[1]='';
 const evaluated=grade(p.questions,answers);
 assert.equal(evaluated.filter(r=>r.correct).length,8);
 assert.equal(evaluated.filter(r=>r.blank).length,1);
}
console.log('14 papers: perfect scores, empty submissions, wrong answers and numeric input verified.');
