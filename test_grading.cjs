const assert=require('node:assert/strict');
const fs=require('node:fs');
const {parseAnswer,grade,createStopwatch,formatElapsed}=require('./docs/tests.js');
let time=0;
const clock=createStopwatch(()=>time);
clock.resume();time=1500;assert.equal(clock.elapsed(),1500);
clock.resume();time=2500;assert.equal(clock.elapsed(),2500);
clock.pause();time=12000;assert.equal(clock.elapsed(),2500);
clock.pause();clock.resume();time=13500;assert.equal(clock.elapsed(),4000);
clock.pause();time=99999;assert.equal(clock.elapsed(),4000);
assert.equal(createStopwatch(()=>time).elapsed(),0);
assert.equal(formatElapsed(4000),'00:04');
assert.equal(formatElapsed(61000),'01:01');
assert.equal(formatElapsed(3601000),'1:00:01');
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
