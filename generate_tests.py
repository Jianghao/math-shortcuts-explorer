"""Create 14 fixed test papers; verify each shortcut against direct arithmetic."""
from pathlib import Path
from decimal import Decimal as D
import json

def number(x):
    return format(D(str(x)).normalize(), 'f')

def question(lesson, hard, i):
    def result(prompt, answer, explanation, direct=None):
        if direct is not None:
            assert D(str(answer)) == D(str(direct)), (lesson, prompt)
        return dict(lesson=lesson, prompt=prompt, answer=number(answer), explanation=explanation)
    def product(a,b,explanation):
        return result(f'{a} × {b} = ?',a*b,explanation)
    if lesson==1:
        a=([298,497,698,899,396] if hard else [29,48,97,198,59])[i]
        b=([467,386,275,648,527] if hard else [34,25,16,41,23])[i]
        target=((a+9)//10)*10; gap=target-a
        return result(f'{a} + {b} = ?',target+b-gap,f'给{a}补{gap}，从{b}减去{gap}：{target} + {b-gap} = {a+b}。',a+b)
    if lesson==2:
        a=([704,831,625,1003,962] if hard else [83,94,125,162,81])[i]
        b=([398,597,296,699,498] if hard else [39,48,49,98,29])[i]
        target=((b+9)//10)*10; gap=target-b
        return result(f'{a} − {b} = ?',a+gap-target,f'两边同时加{gap}：{a+gap} − {target} = {a-b}。',a-b)
    if lesson==3:
        a=([842,931,763,952,821] if hard else [72,84,63,91,52])[i]
        b=int(str(a)[::-1]); factor=99 if hard else 9; diff=int(str(a)[0])-int(str(a)[-1])
        return result(f'{a} − {b} = ?',diff*factor,f'这是{len(str(a))}位颠倒数：首位差{diff} × {factor} = {a-b}。',a-b)
    if lesson==4:
        lo,hi=([(35,54),(48,72),(71,99),(16,65),(23,81)] if hard else [(1,10),(1,20),(5,14),(10,19),(1,30)])[i]
        count=hi-lo+1; answer=count*(lo+hi)//2
        return result(f'{lo} + {lo+1} + … + {hi} = ?',answer,f'共{count}个数。{count} × ({lo}+{hi}) ÷ 2 = {answer}，个数要记得加1。',sum(range(lo,hi+1)))
    if lesson==5:
        a=([37,59,83,127,245] if hard else [24,36,48,62,84])[i]
        answer=a*5
        return product(a,5,f'{a} × 10 ÷ 2 = {a*10} ÷ 2 = {answer}。' if hard else f'先减半，再乘10：{a//2} × 10 = {answer}。')
    if lesson==6:
        a=([47,68,125,73,246] if hard else [12,23,34,45,62])[i]
        b=([99,99,999,99,9] if hard else [9]*5)[i]; base=b+1
        return result(f'{a} × {b} = ?',a*base-a,f'先乘{base}，再减原数：{a*base} − {a} = {a*b}。',a*b)
    if lesson==7:
        a=([158,237,369,482,756] if hard else [40,70,90,120,160])[i]
        if hard and i in [0,2]:
            return result(f'{a} ÷ 5，余数是多少？（只填余数）',a%5,f'{a} = {a//5} × 5 + {a%5}，余数{a%5}小于5。')
        if hard:
            return result(f'{a} ÷ 5，商是多少？（只填整数商）',a//5,f'{a} = {a//5} × 5 + {a%5}，整数商是{a//5}，余数是{a%5}。')
        return result(f'{a} ÷ 5 = ?',a//10*2,f'先除10，再乘2：{a//10} × 2 = {a//5}。',a//5)
    if lesson==8:
        a,b,f=([(17,36,4),(23,28,4),(19,42,6),(27,35,5),(31,24,6)] if hard else [(12,15,3),(11,24,4),(13,21,3),(14,18,3),(16,12,3)])[i]
        other=b//f
        return product(a,b,f'把{b}拆成{f} × {other}：{a} × {f} × {other} = {a*f} × {other} = {a*b}。')
    if lesson==9:
        a=([67,78,89,95,96] if hard else [23,34,42,51,62])[i]; x,y=divmod(a,10); middle=x+y
        return product(a,11,f'中间相加{x}+{y}={middle}。'+(f'写{middle%10}，向百位进1，得到{a*11}。' if middle>=10 else f'两边保留，中间写{middle}，得到{a*11}。'))
    if lesson==10:
        a,b=([(71,61),(81,91),(61,91),(51,81),(91,91)] if hard else [(21,31),(31,41),(41,51),(21,61),(31,51)])[i]
        x,y=a//10,b//10; ans=100*x*y+10*(x+y)+1
        return result(f'{a} × {b} = ?',ans,f'头积{x*y}，头和{x+y}，尾1：{x*y} × 100 + {x+y} × 10 + 1 = {ans}。头和满10要进位。',a*b)
    if lesson==11:
        a=([46,57,73,89,99] if hard else [12,24,32,48,64])[i]
        if hard and i==2:
            return result(f'□ × 25 = {a*25}，□里填几？',a,f'乘25相当于乘100再除4。倒过来算：{a*25} × 4 ÷ 100 = {a}。')
        return product(a,25,f'{a} × 100 ÷ 4 = {a*100} ÷ 4 = {a*25}。' if hard else f'{a} ÷ 4 × 100 = {a//4} × 100 = {a*25}。')
    if lesson==12:
        a,b=([(91,99),(81,89),(73,77),(62,68),(51,59)] if hard else [(43,47),(54,56),(62,68),(72,78),(84,86)])[i]
        head=a//10; tails=(a%10)*(b%10); front=(head+1)*head; ans=front*100+tails
        return result(f'{a} × {b} = ?',ans,f'同头，尾合十。前面({head}+1) × {head} = {front}；后面{a%10} × {b%10} = {tails:02d}。连写得到{ans}，尾积必须写两位。',a*b)
    if lesson==13:
        a,b=([(91,99),(82,44),(73,22),(64,77),(91,55)] if hard else [(82,33),(73,44),(64,22),(55,33),(46,22)])[i]
        head,tail=divmod(a,10); repeat=b//10; front=(head+1)*repeat; back=tail*repeat; ans=front*100+back
        return result(f'{a} × {b} = ?',ans,f'合十数{a}，重复数{b}。前面({head}+1) × {repeat} = {front}，后面{tail} × {repeat} = {back:02d}，连写得到{ans}。',a*b)
    if lesson==14:
        a,b=([(91,11),(82,22),(73,33),(64,44),(99,19)] if hard else [(32,72),(43,63),(54,54),(25,85),(36,76)])[i]
        x,y=a//10,b//10; tail=a%10; front=x*y+tail; back=tail*tail; ans=front*100+back
        return result(f'{a} × {b} = ?',ans,f'头合十、尾相同。前面{x} × {y} + {tail} = {front}，后面{tail} × {tail} = {back:02d}，连写得到{ans}。',a*b)
    if lesson==15:
        a,b=([(89,87),(78,96),(88,86),(76,95),(84,92)] if hard else [(98,97),(96,99),(93,98),(95,96),(92,97)])[i]
        x,y=100-a,100-b; ans=(a-y)*100+x*y
        return result(f'{a} × {b} = ?',ans,f'补数是{x}和{y}。({a} − {y}) × 100 + {x} × {y} = {(a-y)*100} + {x*y} = {ans}。补数积满100时用加法合并。',a*b)
    if lesson==16:
        mid,gap=([(80,7),(70,8),(90,6),(60,9),(50,7)] if hard else [(40,2),(50,3),(60,4),(70,2),(80,3)])[i]
        a,b=mid+gap,mid-gap; ans=mid*mid-gap*gap
        return result(f'{a} × {b} = ?',ans,f'两个数离{mid}都差{gap}：{mid} × {mid} − {gap} × {gap} = {mid*mid} − {gap*gap} = {ans}。',a*b)
    if lesson==17:
        a=([698,789,897,958,999] if hard else [123,234,312,423,531])[i]; x,y,z=map(int,str(a)); carry=(y+z)//10; middle=x+y+carry
        return product(a,11,f'个位写{z}；十位{y}+{z}={y+z}，写{(y+z)%10}、进{carry}；百位{x}+{y}+{carry}={middle}，写{middle%10}、进{middle//10}；千位{x}+{middle//10}={x+middle//10}。结果{a*11}。')
    if lesson==18:
        a=([356,237,128,463,719] if hard else [100,200,500,700,1200])[i]; ans=D(a)*4/100
        if hard and i==2:
            return result(f'□ ÷ 25 = 5.12，□里填几？',128,'反过来乘25：5.12 × 100 ÷ 4 = 128。',D('5.12')*25)
        return result(f'{a} ÷ 25 = ?',ans,f'先乘4，再除100：{a} × 4 ÷ 100 = {a*4} ÷ 100 = {number(ans)}。',D(a)/25)
    if lesson==19:
        values=([['19.8','20.3','19.7','20.2'],['29.96','30.04','29.87'],['9.98','10.03','9.99','10.02'],['49.75','50.25','49.9','50.1'],['39.88','40.12','39.95']] if hard else [['9.8','10.2'],['19.7','20.3'],['29.8','30.1','30.2'],['9.9','10.1','9.8'],['19.6','20.4','20.1']])[i]
        nums=list(map(D,values)); nearest=round(nums[0]); base=D(nearest)*len(nums); difference=sum(n-nearest for n in nums); ans=base+difference
        return result(' + '.join(values)+' = ?',ans,f'每个数都凑到{nearest}，整数部分共{number(base)}，差值合计{number(difference)}；{number(base)} + ({number(difference)}) = {number(ans)}。',sum(nums))
    if lesson==20:
        a,b=([('86.52','43.98'),('102.36','59.97'),('75.08','29.99'),('120.45','79.96'),('93.27','49.98')] if hard else [('52.4','19.9'),('63.5','29.8'),('81.2','39.9'),('72.6','49.8'),('45.7','19.9')])[i]
        x,y=D(a),D(b); whole=round(y); gap=D(whole)-y; ans=x-whole+gap
        return result(f'{a} − {b} = ?',ans,f'{b} = {whole} − {number(gap)}。先减{whole}，再加回{number(gap)}：{number(x-whole)} + {number(gap)} = {number(ans)}。',x-y)
    raise ValueError(lesson)

papers=[]
for group in range(7):
    start=group*3+1; end=min(start+2,20); covered=list(range(start,end+1))
    for level in [1,2]:
        counts={lesson:0 for lesson in covered}; items=[]
        for index in range(10):
            lesson=covered[index%len(covered)]
            items.append(question(lesson,level==2,counts[lesson])); counts[lesson]+=1
        papers.append(dict(id=f'{group+1}-{level}',group=group+1,level=level,start=start,end=end,questions=items))
assert len(papers)==14 and sum(len(p['questions']) for p in papers)==140
for p in papers:
    assert len({q['prompt'] for q in p['questions']})==10
    assert set(q['lesson'] for q in p['questions'])==set(range(p['start'],p['end']+1))
for letter,hard,index in [('a',False,4),('b',True,3)]:
    items=[question(lesson,hard,index) for lesson in range(1,21)]
    items += [question(lesson,hard,2) for lesson in [4,9,12,17,20]]
    papers.append(dict(id=f'final-{letter}',comprehensive=True,level=1 if letter=='a' else 2,start=1,end=20,name=f'{letter.upper()}卷 · '+('基础综合' if letter=='a' else '进阶综合'),questions=items))

# C emphasizes combining methods, inverse problems and checking conditions.
c=[]
def cq(lesson,prompt,answer,explanation):
    c.append(dict(lesson=lesson,prompt=prompt,answer=number(answer),explanation=explanation))
cq(1,'398 + 597 + 205 = ?',398+597+205,'398补2成400，597补3成600，从205拿出5，得到400+600+200=1200。')
cq(2,'1003 − □ = 398，□里填几？',1003-398,'减数=被减数−差。1003−398=(1003+2)−400=605。')
cq(3,'(931 − 139) − (842 − 248) = ?',(931-139)-(842-248),'两组都是三位颠倒数：(9−1)×99−(8−2)×99=792−594=198。')
cq(4,'从48到72的所有整数相加，再减去60，结果是多少？',sum(range(48,73))-60,'共25个数，首尾和120。25×120÷2=1500，再减60，得1440。')
cq(5,'每支笔5元，买37支，用200元付款，找回多少元？（只填数字）',200-37*5,'37×5=370÷2=185元；200−185=15元。')
cq(6,'68 × 99 + 68 = ?',68*99+68,'68×99=68×100−68，再加68，正好抵消，结果6800。')
cq(7,'一个整数除以5，商是57，余数是4。这个整数是多少？',57*5+4,'被除数=商×除数+余数：57×5+4=285+4=289。')
cq(8,'17 × 36 + 17 × 24 = ?',17*36+17*24,'分别算也可以；共同的17可以提出，17×(36+24)=17×60=1020。')
cq(9,'□ × 11 = 858，□里填几？',858//11,'从乘11的结构检查：78×11，中间7+8=15，进位后得到858，所以填78。')
cq(10,'71 × 61 − 41 × 31 = ?',71*61-41*31,'个位都是1。71×61=4331；41×31=1271；4331−1271=3060。')
cq(11,'46 × 25 + 54 × 25 = ?',46*25+54*25,'共同乘25，可以先把46和54凑成100：100×25=2500。')
cq(12,'81 × 89 − 71 × 79 = ?',81*89-71*79,'同头尾合十：81×89=7209，71×79=5609；相减为1600。注意尾积都写09。')
cq(13,'91 × 99 − 82 × 44 = ?',91*99-82*44,'合十数乘重复数：91×99=9009，82×44=3608；9009−3608=5401。')
cq(14,'91 × 11 + 82 × 22 = ?',91*11+82*22,'两组都头合十尾相同。91×11=1001；82×22=1804；合计2805。')
cq(15,'89 × 87 = ?（补数积超过100，要正确合并）',89*87,'补数11、13；(89−13)×100+11×13=7600+143=7743，不能把76和143直接连写。')
cq(16,'87 × 73 + 7 × 7 = ?',87*73+7*7,'87和73围绕80对称：80×80−7×7，再加7×7，得到6400。')
cq(17,'999 × 11 − 789 × 11 = ?',999*11-789*11,'可以分别处理连续进位；也可以先算(999−789)×11=210×11=2310。')
cq(18,'356 ÷ 25 + 144 ÷ 25 = ?',D(356)/25+D(144)/25,'同除25，先合并：500÷25=500×4÷100=20。')
cq(19,'29.96 + 30.04 + 29.87 + 30.13 = ?',sum(map(D,['29.96','30.04','29.87','30.13'])),'四个数都凑成30，差值−0.04、+0.04、−0.13、+0.13抵消，结果120。')
cq(20,'102.36 − 59.97 − 19.99 = ?',D('102.36')-D('59.97')-D('19.99'),'先减60，加回0.03；再减20，加回0.01：102.36−60−20+0.04=22.40。')
cq(4,'从35到54的所有整数的和是890。去掉最小和最大的数，余下的和是多少？',sum(range(36,54)),'去掉35和54：890−35−54=801；也可用18×(36+53)÷2。')
cq(12,'同头尾合十的方法可直接用于哪一个算式？填编号：1. 43×47；2. 43×48；3. 43×57。',1,'只有43×47满足十位相同、个位和为10。先看条件再用口诀。')
cq(16,'平方差的方法，以60为中间数且两边距离相同，可直接用于哪一个？填编号：1. 68×51；2. 67×53；3. 66×55。',2,'67和53离60都是7。68和51、66和55两边的距离不同。')
cq(18,'□ ÷ 25 = 14.24，□里填几？',D('14.24')*25,'倒过来乘25：14.24×100÷4=1424÷4=356。')
cq(20,'□ − 43.98 = 42.54，□里填几？',D('43.98')+D('42.54'),'被减数=差+减数。42.54+43.98=42.54+44−0.02=86.52。')
assert len(c)==25
papers.append(dict(id='final-c',comprehensive=True,level=3,start=1,end=20,name='C卷 · 思维挑战',questions=c))
for p in papers:
    assert len(p['questions'])==(25 if p.get('comprehensive') else 10)
    if p.get('comprehensive'):
        assert set(q['lesson'] for q in p['questions'])==set(range(1,21))
destination=Path(__file__).resolve().parent/'docs'/'tests-data.json'
destination.write_text(json.dumps(papers,ensure_ascii=False,indent=2),encoding='utf-8')
print('14 grouped papers + 3 comprehensive papers; 215 questions; all 20 lessons covered in each comprehensive paper.')
