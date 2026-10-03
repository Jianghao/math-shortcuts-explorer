from pathlib import Path
import re, json, shutil

root=Path(__file__).resolve().parent
source=root.parent
text=(source/'math_shortcuts_design_and_content.md').read_text(encoding='utf-8-sig')
matches=list(re.finditer(r'^# \d+\. 第 (\d+) 课：(.+)$', text, re.M))
lessons=[]
for i,m in enumerate(matches):
    number=int(m[1])
    end=matches[i+1].start() if i+1<len(matches) else text.index('# 22.')
    body=text[m.end():end]
    sections=[]
    for chunk in re.split(r'^## ',body,flags=re.M)[1:]:
        heading,_,content=chunk.partition('\n')
        heading=re.sub(r'^\d+\.\d+\s*','',heading).strip()
        if any(s in heading for s in ['网站','动画','页面提示栏','提示栏素材']): continue
        content=re.sub(r'\n---\s*$','',content).strip()
        if number==3:
            if heading=='万能速算口诀':
                content=content.split('### 四位数')[0].strip()
            if heading=='规律': content='- 两位颠倒数：首位差 × 9。\n- 三位颠倒数：首位差 × 99。\n- 四位完全颠倒数还要看中间两位，不能直接套用 ×999。'
            if heading=='使用提醒': content='1. 先确认是两位或三位颠倒数。\n2. 用大数减小数。\n3. 找首位数字的差，再乘 9 或 99。'
            if heading=='总结': content='**两位、三位颠倒数相减，先算首位差，再分别乘 9、99。**'
        sections.append({'heading':heading,'content':content})
    summaries=[s['content'].replace('**','').replace('`','') for s in sections if s['heading']=='总结']
    lessons.append({'number':number,'title':m[2].strip(),'module':0 if number<=4 else 1 if number<=18 else 2,'image':f'assets/lesson_{number:02d}.png','summary':summaries[0] if summaries else '', 'sections':sections})
assert len(lessons)==20
(root/'docs'/'course-data.json').write_text(json.dumps(lessons,ensure_ascii=False),encoding='utf-8')
for name in ['cover.png']+[f'lesson_{i:02d}.png' for i in range(1,21)]:
    shutil.copy2(source/name,root/'docs'/'assets'/name)
print('20 lessons and 21 original images ready')
