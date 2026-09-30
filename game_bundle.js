
"use strict";
const $=s=>document.querySelector(s), KEY="dropHunter010", FALLBACK=["dropHunter09","dropHunter08","dropHunter07"];
const SAVE_BAK1=KEY+"_backup1", SAVE_BAK2=KEY+"_backup2", SAVE_META=KEY+"_meta";
function parseSaveRaw(raw){
 try{
  if(!raw)return null;
  const v=JSON.parse(raw), x=(v&&v.__dodBackup&&v.state)?v.state:v;
  if(!x||typeof x!=="object"||Array.isArray(x))return null;
  if(!Number.isFinite(+x.lv)||+x.lv<1)return null;
  return x;
 }catch(e){return null}
}
function readSaveCandidate(k){try{return parseSaveRaw(localStorage.getItem(k))}catch(e){return null}}
function saveStamp(x){return Number(x&&x.__saveMeta&&x.__saveMeta.savedAt)||0}
function bestStoredSave(){
 const keys=[KEY,SAVE_BAK1,SAVE_BAK2,...FALLBACK], found=[];
 for(const k of keys){const x=readSaveCandidate(k);if(x)found.push({k,x,t:saveStamp(x)})}
 if(!found.length)return null;
 const current=found.find(v=>v.k===KEY);
 if(current)return current;
 found.sort((a,b)=>b.t-a.t);return found[0];
}
const BASE_MEMBERS={
 "キーボ":{hp:70,mp:18,atk:12,def:3,role:"剣士"},
 "ミア":{hp:52,mp:30,atk:10,def:2,role:"魔法使い"},
 "トア":{hp:60,mp:22,atk:11,def:4,role:"前衛"},
 "黄金スライム":{hp:95,mp:18,atk:18,def:12,role:"幻獣"},
 "スライム":{hp:58,mp:12,atk:10,def:6,role:"魔物"},
 "ゴブリン":{hp:66,mp:10,atk:13,def:7,role:"魔物"},
 "オオカミ":{hp:62,mp:12,atk:14,def:6,role:"魔物"},
 "キノコ":{hp:64,mp:22,atk:12,def:8,role:"魔物"},
 "ホーンラビット":{hp:58,mp:14,atk:13,def:6,role:"魔物"},"ポイズンビー":{hp:54,mp:18,atk:14,def:5,role:"魔物"},
 "モリキノコ":{hp:68,mp:24,atk:12,def:9,role:"魔物"},"リーフフェアリー":{hp:56,mp:30,atk:15,def:6,role:"精霊"},"シャドウバット":{hp:60,mp:20,atk:16,def:6,role:"魔物"},
 "マグマスライム":{hp:82,mp:24,atk:18,def:12,role:"炎魔"},"フレイムリザード":{hp:88,mp:18,atk:21,def:13,role:"炎獣"},
 "炎翼バット":{hp:70,mp:26,atk:23,def:9,role:"炎魔"},"サラマンダー":{hp:96,mp:22,atk:25,def:15,role:"竜種"}
};
const needExp=l=>Math.floor(100+20*l+15*l*l);
const skillDefs=[["強撃",2,3,"単体・威力高"],["火炎斬り",3,5,"炎属性・単体"],["ヒール",5,5,"味方1人を回復"],["風刃",7,8,"敵全体"],["二連斬り",10,8,"2回攻撃"],["アイス",12,10,"氷属性・高威力"],["会心斬り",15,12,"会心率大"],["奥義・紅蓮",20,20,"超威力"]];
const shop=[
{id:"bronze",n:"銅の剣",type:"武器",lv:1,g:180,atk:3,def:0,crit:0,rar:"NORMAL",desc:"攻撃+3"},{id:"iron",n:"鉄の剣",type:"武器",lv:3,g:420,atk:7,def:0,crit:0,rar:"NORMAL",desc:"攻撃+7"},{id:"steel",n:"鋼の剣",type:"武器",lv:6,g:850,atk:12,def:0,crit:1,rar:"NORMAL",desc:"攻撃+12 / 会心+1%"},{id:"fire",n:"炎の剣",type:"武器",lv:10,g:1800,atk:18,def:0,crit:2,rar:"RARE",desc:"攻撃+18 / 炎属性"},
{id:"cloth",n:"旅人の服",type:"防具",lv:1,g:120,atk:0,def:2,crit:0,rar:"NORMAL",desc:"防御+2"},{id:"leather",n:"革の服",type:"防具",lv:4,g:360,atk:0,def:6,crit:0,rar:"NORMAL",desc:"防御+6"},{id:"chain",n:"鎖かたびら",type:"防具",lv:8,g:950,atk:0,def:12,crit:0,rar:"NORMAL",desc:"防御+12"},
{id:"amulet",n:"小さなお守り",type:"アクセサリー",lv:1,g:100,atk:0,def:1,crit:1,rar:"NORMAL",desc:"防御+1 / 会心+1%"},{id:"luck",n:"幸運のお守り",type:"アクセサリー",lv:6,g:800,atk:0,def:2,crit:1,drop:2,rar:"RARE",desc:"防御+2 / ドロップ率補正"},{id:"magicring",n:"魔力の指輪",type:"アクセサリー",lv:12,g:2400,atk:5,def:2,crit:2,rar:"RARE",desc:"攻撃+5 / 防御+2"}];
const drops={
 スライム:[{n:"ぷるぷるゼリー",r:12,rar:"NORMAL",type:"素材",desc:"スライムから採れる素材"},{n:"スライムピアス",r:120,rar:"RARE",type:"アクセサリー",atk:0,def:2,crit:2,desc:"防御+2 / 会心+2%"},{n:"蒼雫の剣",r:900,rar:"EPIC",type:"武器",atk:19,def:1,crit:4,desc:"攻撃+19 / 防御+1 / 会心+4%"}],
 ゴブリン:[{n:"ゴブリンの牙",r:15,rar:"NORMAL",type:"素材",desc:"ゴブリンの素材"},{n:"盗賊の短剣",r:150,rar:"RARE",type:"武器",atk:14,def:0,crit:5,desc:"攻撃+14 / 会心+5%"},{n:"鬼盗王の護符",r:1200,rar:"PHANTOM",type:"アクセサリー",atk:7,def:5,crit:7,desc:"攻撃+7 / 防御+5 / 会心+7%"}],
 オオカミ:[{n:"狼の毛皮",r:18,rar:"NORMAL",type:"素材",desc:"オオカミの素材"},{n:"月狼の服",r:220,rar:"EPIC",type:"防具",atk:0,def:16,crit:2,desc:"防御+16 / 会心+2%"},{n:"銀月の牙",r:1000,rar:"PHANTOM",type:"武器",atk:27,def:0,crit:9,desc:"攻撃+27 / 会心+9%"}],
 キノコ:[{n:"紫胞子",r:16,rar:"NORMAL",type:"素材",desc:"キノコ系モンスターの素材"},{n:"毒茸の指輪",r:190,rar:"RARE",type:"アクセサリー",atk:3,def:3,crit:3,desc:"攻撃+3 / 防御+3 / 会心+3%"},{n:"冥茸王のローブ",r:1400,rar:"PHANTOM",type:"防具",atk:6,def:22,crit:5,desc:"攻撃+6 / 防御+22 / 会心+5%"}],
 森コウモリ:[{n:"黒い羽",r:18,rar:"NORMAL",type:"素材",desc:"森コウモリの羽"},{n:"夜風の指輪",r:180,rar:"RARE",type:"アクセサリー",atk:3,def:1,crit:4,desc:"攻撃+3 / 会心+4%"}],
 草原キング:[{n:"王冠の欠片",r:8,rar:"RARE",type:"素材",desc:"草原キングの証"},{n:"生命の雫",r:5,rar:"RARE",type:"アイテム",desc:"戦闘不能の仲間をHP50%で復活"},{n:"王者の剣",r:80,rar:"EPIC",type:"武器",atk:22,def:2,crit:3,desc:"攻撃+22 / 防御+2 / 会心+3%"}],
 "森の主・月狼":[{n:"月狼の毛束",r:8,rar:"RARE",type:"素材",desc:"迷いの森の主が残す希少素材"},{n:"月影の護符",r:70,rar:"EPIC",type:"アクセサリー",atk:6,def:7,crit:6,desc:"攻撃+6 / 防御+7 / 会心+6%"},{n:"月喰らいの牙",r:900,rar:"PHANTOM",type:"武器",atk:31,def:2,crit:10,desc:"攻撃+31 / 防御+2 / 会心+10%"}],
 ホーンラビット:[{n:"鋭角の毛束",r:16,rar:"NORMAL",type:"素材",desc:"ホーンラビットの柔らかな毛束"},{n:"疾風角の指輪",r:210,rar:"RARE",type:"アクセサリー",atk:3,def:1,crit:5,desc:"攻撃+3 / 防御+1 / 会心+5%"},{n:"天駆けの角槍",r:1150,rar:"PHANTOM",type:"武器",atk:28,def:1,crit:11,desc:"攻撃+28 / 防御+1 / 会心+11%"}],
 ポイズンビー:[{n:"毒蜂の針",r:18,rar:"NORMAL",type:"素材",desc:"毒を帯びた鋭い針"},{n:"蜂甲の軽鎧",r:190,rar:"RARE",type:"防具",atk:1,def:11,crit:3,desc:"攻撃+1 / 防御+11 / 会心+3%"},{n:"毒針の短剣",r:420,rar:"EPIC",type:"武器",atk:17,def:0,crit:7,desc:"攻撃+17 / 会心+7%"},{n:"女王蜂の毒牙",r:1500,rar:"PHANTOM",type:"武器",atk:29,def:0,crit:12,desc:"攻撃+29 / 会心+12%"}],
 モリキノコ:[{n:"森茸の胞子",r:15,rar:"NORMAL",type:"素材",desc:"淡く光る森茸の胞子"},{n:"胞子のお守り",r:180,rar:"RARE",type:"アクセサリー",atk:1,def:5,crit:2,desc:"攻撃+1 / 防御+5 / 会心+2%"},{n:"森精のローブ",r:360,rar:"EPIC",type:"防具",atk:3,def:18,crit:2,desc:"攻撃+3 / 防御+18 / 会心+2%"},{n:"深森王の外套",r:1350,rar:"PHANTOM",type:"防具",atk:5,def:25,crit:5,desc:"攻撃+5 / 防御+25 / 会心+5%"}],
 リーフフェアリー:[{n:"妖精の葉",r:20,rar:"NORMAL",type:"素材",desc:"魔力を宿す緑葉"},{n:"風読みの指輪",r:220,rar:"RARE",type:"アクセサリー",atk:3,def:2,crit:5,desc:"攻撃+3 / 防御+2 / 会心+5%"},{n:"翠風の護符",r:430,rar:"EPIC",type:"アクセサリー",atk:5,def:4,crit:6,desc:"攻撃+5 / 防御+4 / 会心+6%"},{n:"世界樹の雫杖",r:1600,rar:"PHANTOM",type:"武器",atk:30,def:4,crit:8,desc:"攻撃+30 / 防御+4 / 会心+8%"}],
 シャドウバット:[{n:"影翼",r:18,rar:"NORMAL",type:"素材",desc:"闇色のコウモリの翼"},{n:"闇渡りの指輪",r:240,rar:"RARE",type:"アクセサリー",atk:4,def:1,crit:6,desc:"攻撃+4 / 防御+1 / 会心+6%"},{n:"夜翼のマント",r:480,rar:"EPIC",type:"防具",atk:3,def:17,crit:6,desc:"攻撃+3 / 防御+17 / 会心+6%"},{n:"夜影の牙",r:1450,rar:"PHANTOM",type:"武器",atk:27,def:0,crit:11,desc:"攻撃+27 / 会心+11%"}],
 "草原の大牙":[{n:"大牙の剛毛",r:8,rar:"RARE",type:"素材",desc:"草原の主の赤黒い剛毛"},{n:"大牙王の鎧",r:75,rar:"EPIC",type:"防具",atk:3,def:20,crit:2,desc:"攻撃+3 / 防御+20 / 会心+2%"},{n:"紅牙の大剣",r:850,rar:"PHANTOM",type:"武器",atk:30,def:1,crit:8,desc:"攻撃+30 / 防御+1 / 会心+8%"}],
 "マグマスライム":[{n:"灼熱ゼリー",r:14,rar:"NORMAL",type:"素材",desc:"熱を帯びたスライム素材"},{n:"熔岩のお守り",r:260,rar:"RARE",type:"アクセサリー",atk:5,def:7,crit:3,desc:"攻撃+5 / 防御+7 / 会心+3%"}],
 "フレイムリザード":[{n:"火蜥蜴の鱗",r:16,rar:"NORMAL",type:"素材",desc:"火蜥蜴の硬い鱗"},{n:"火鱗の鎧",r:360,rar:"EPIC",type:"防具",atk:4,def:28,crit:4,desc:"攻撃+4 / 防御+28 / 会心+4%"}],
 "炎翼バット":[{n:"炎翼",r:17,rar:"NORMAL",type:"素材",desc:"火の粉をまとう翼"},{n:"紅蓮の指輪",r:320,rar:"EPIC",type:"アクセサリー",atk:9,def:4,crit:9,desc:"攻撃+9 / 防御+4 / 会心+9%"}],
 "サラマンダー":[{n:"火竜の幼鱗",r:20,rar:"NORMAL",type:"素材",desc:"竜種の熱い鱗"},{n:"炎牙の剣",r:420,rar:"EPIC",type:"武器",atk:38,def:3,crit:9,desc:"攻撃+38 / 防御+3 / 会心+9%"}],
 "焔竜王・ヴォルガノス":[{n:"焔竜王の逆鱗",r:7,rar:"RARE",type:"素材",desc:"火山の王が残す逆鱗"},{n:"焔竜鎧ヴォルガ",r:70,rar:"EPIC",type:"防具",atk:10,def:40,crit:7,effect51:{fireDamage:.15},effectText51:"灼熱の火山で与ダメージ+15%",desc:"攻撃+10 / 防御+40 / 会心+7% / 火山強化+15%"},{n:"獄炎剣・ヴォルガノス",r:1500,rar:"PHANTOM",type:"武器",atk:60,def:8,crit:17,effect51:{fireDamage:.25,bossDamage:.16,lifeSteal:.06},effectText51:"火山+25% / ボス特効+16% / 与ダメージ6%吸収",desc:"攻撃+60 / 防御+8 / 会心+17% / 火山強化 / ボス特効 / HP吸収"}]
};
const specialItems={"木の剣":{n:"木の剣",type:"武器",atk:1,def:0,crit:0,rar:"NORMAL",desc:"攻撃+1"},"幻の金冠":{n:"幻の金冠",type:"素材",rar:"PHANTOM",desc:"黄金スライムの幻級ドロップ"},"生命の雫":{n:"生命の雫",type:"アイテム",rar:"RARE",desc:"戦闘不能の仲間1人をHP50%で復活"}};
const stages=[
{id:"g1",area:"草原",name:"はじまりの草原 1",recommended:1,unlock:s=>true,unlockText:"最初から解放",enemies:["スライム","ゴブリン","オオカミ","ホーンラビット","ポイズンビー"],mult:1},
{id:"g2",area:"草原",name:"はじまりの草原 2",recommended:3,unlock:s=>s.lv>=3,unlockText:"Lv3で解放",enemies:["ゴブリン","オオカミ","ホーンラビット","ポイズンビー","スライム"],mult:1.25},
{id:"gb",area:"草原",name:"草原ボス",recommended:5,unlock:s=>s.lv>=5,unlockText:"Lv5で解放",boss:true,bossMonster:"草原の大牙",enemies:["草原の大牙"],mult:1.8,next:"迷いの森 1"},
{id:"f1",area:"迷いの森",name:"迷いの森 1",recommended:6,unlock:s=>!!s.clears.gb,unlockText:"草原ボス撃破で解放",enemies:["モリキノコ","リーフフェアリー","シャドウバット","オオカミ","ゴブリン"],mult:1.55},
{id:"f2",area:"迷いの森",name:"迷いの森 2",recommended:8,unlock:s=>!!s.clears.gb&&s.lv>=8,unlockText:"草原ボス撃破＋Lv8で解放",enemies:["モリキノコ","リーフフェアリー","シャドウバット","オオカミ"],mult:1.85},
{id:"fb",area:"迷いの森",name:"迷いの森ボス",recommended:10,unlock:s=>!!s.clears.gb&&s.lv>=10,unlockText:"草原ボス撃破＋Lv10で解放",boss:true,bossMonster:"森の主・月狼",enemies:["森の主・月狼"],mult:2.15,next:"氷の雪原 1"},
{id:"i1",area:"氷の雪原",name:"氷の雪原 1",recommended:12,unlock:s=>!!s.clears.fb,unlockText:"迷いの森ボス撃破で解放",enemies:["スノーラビット","アイスウルフ","フロストスライム","フロストフェアリー"],mult:2.15},
{id:"i2",area:"氷の雪原",name:"氷の雪原 2",recommended:15,unlock:s=>!!s.clears.fb&&s.lv>=15,unlockText:"迷いの森ボス撃破＋Lv15で解放",enemies:["アイスウルフ","フロストスライム","フロストフェアリー","スノーラビット"],mult:2.45},
{id:"ib",area:"氷の雪原",name:"氷の雪原ボス",recommended:18,unlock:s=>!!s.clears.fb&&s.lv>=18,unlockText:"迷いの森ボス撃破＋Lv18で解放",boss:true,bossMonster:"氷雪の女王・フロスティア",enemies:["氷雪の女王・フロスティア"],mult:2.75,next:"灼熱の火山 1"},
{id:"v1",area:"灼熱の火山",name:"灼熱の火山 1",recommended:21,unlock:s=>!!s.clears.ib,unlockText:"氷の雪原ボス撃破で解放",enemies:["マグマスライム","フレイムリザード","炎翼バット","サラマンダー"],mult:2.95},
{id:"v2",area:"灼熱の火山",name:"灼熱の火山 2",recommended:24,unlock:s=>!!s.clears.ib&&s.lv>=24,unlockText:"氷の雪原ボス撃破＋Lv24で解放",enemies:["サラマンダー","フレイムリザード","炎翼バット","マグマスライム"],mult:3.25},
{id:"vb",area:"灼熱の火山",name:"灼熱の火山ボス",recommended:28,unlock:s=>!!s.clears.ib&&s.lv>=28,unlockText:"氷の雪原ボス撃破＋Lv28で解放",boss:true,bossMonster:"焔竜王・ヴォルガノス",enemies:["焔竜王・ヴォルガノス"],mult:3.65,next:"次のエリア（今後追加）"}
];
const MONSTERS={
 スライム:{icon:"slime",hp:30,atk:8,xp:14,recruit:300},
 ゴブリン:{icon:"goblin",hp:42,atk:11,xp:19,recruit:350},
 オオカミ:{icon:"wolf",hp:36,atk:10,xp:17,recruit:400},
 キノコ:{icon:"mushroom",hp:40,atk:12,xp:20,recruit:350},
 森コウモリ:{icon:"bat",hp:48,atk:14,xp:24,recruit:450},
 草原キング:{icon:"king",hp:210,atk:18,xp:160,recruit:0},
 "森の主・月狼":{icon:"moonwolf",hp:320,atk:24,xp:260,recruit:0},
 ホーンラビット:{icon:"hornrabbit",hp:34,atk:10,xp:16,recruit:380},
 ポイズンビー:{icon:"poisonbee",hp:31,atk:12,xp:18,recruit:420},
 モリキノコ:{icon:"morikinoko",hp:46,atk:13,xp:23,recruit:390},
 リーフフェアリー:{icon:"leaffairy",hp:42,atk:15,xp:27,recruit:520},
 シャドウバット:{icon:"shadowbat",hp:44,atk:16,xp:28,recruit:480},
 "草原の大牙":{icon:"grassfang",hp:225,atk:19,xp:175,recruit:0},
 "黄金スライム":{icon:"slime",hp:90,atk:13,xp:120,recruit:1,golden:true},
 "スノーラビット":{icon:"hornrabbit",hp:58,atk:17,xp:42,recruit:360},
 "アイスウルフ":{icon:"moonwolf",hp:72,atk:20,xp:52,recruit:430},
 "フロストスライム":{icon:"slime",hp:88,atk:16,xp:48,recruit:390},
 "フロストフェアリー":{icon:"leaffairy",hp:64,atk:22,xp:58,recruit:520},
 "氷雪の女王・フロスティア":{icon:"moonwolf",hp:620,atk:34,xp:620,recruit:0},
 "マグマスライム":{icon:"slime",hp:96,atk:24,xp:72,recruit:430},
 "フレイムリザード":{icon:"hornrabbit",hp:112,atk:28,xp:82,recruit:500},
 "炎翼バット":{icon:"shadowbat",hp:92,atk:31,xp:88,recruit:540},
 "サラマンダー":{icon:"grassfang",hp:138,atk:34,xp:104,recruit:650},
 "焔竜王・ヴォルガノス":{icon:"grassfang",hp:980,atk:48,xp:980,recruit:0}
};
// 新モンスター追加は MONSTERS / drops / stages の3か所へ1項目ずつ追加する方式
const monBase=MONSTERS;
const defaultState={lv:1,exp:0,gold:500,bank:0,battle:1,herb:5,auto:false,hp:[70,52,60],mp:[18,30,22],guard:false,kills:{スライム:0,ゴブリン:0,オオカミ:0,キノコ:0,森コウモリ:0,草原キング:0,"黄金スライム":0},seen:{},owned:["木の剣","旅人の服","小さなお守り"],equipment:[{武器:"木の剣",防具:"旅人の服",アクセサリー:"小さなお守り"},{武器:"",防具:"",アクセサリー:""},{武器:"",防具:"",アクセサリー:""}],partySlots:["ミア","トア"],monsterCompanions:[],dropFound:{},locks:{},stageId:"g1",clears:{},golden:false,revive:2,goldenJoined:false,monsterGrowth:{},playerProfile:null,lastCloudBackupAt:0};
let S=JSON.parse(JSON.stringify(defaultState));
try{let hit=bestStoredSave(),x=hit&&hit.x;if(x){S={...S,...x};if(!Array.isArray(x.equipment)){S.equipment=[{武器:x.equipment?.武器||"木の剣",防具:x.equipment?.防具||x.equipment?.服||"旅人の服",アクセサリー:x.equipment?.アクセサリー||x.equipment?.アクセ||"小さなお守り"},{武器:"",防具:"",アクセサリー:""},{武器:"",防具:"",アクセサリー:""}]}S.dropFound=x.dropFound||x.drops||{};S.monsterCompanions=[...new Set([...(x.monsterCompanions||[]),...((x.companions||[]).filter(n=>!["ミア","モフ","トア"].includes(n)))])];if(hit.k!==KEY){try{localStorage.setItem(KEY,JSON.stringify(S));localStorage.setItem(SAVE_META,JSON.stringify({recoveredFrom:hit.k,recoveredAt:Date.now()}))}catch(e){}}}}catch(e){}
S.bank=Number.isFinite(S.bank)?Math.max(0,Math.floor(S.bank)):0;S.kills=S.kills||{};Object.keys(MONSTERS).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});S.seen=S.seen||{};S.partySlots=S.partySlots||["ミア","トア"];S.revive=Number.isFinite(S.revive)?S.revive:2;S.goldenJoined=!!S.goldenJoined||S.monsterCompanions.includes("黄金スライム");S.clears=S.clears||{};S.locks=S.locks||{};S.equipment=Array.isArray(S.equipment)?S.equipment:defaultState.equipment;while(S.equipment.length<3)S.equipment.push({武器:"",防具:"",アクセサリー:""});
let E=[],target=0,timer=null,shopTab="武器",itemTab="すべて",targetAction=null;
function partyNames(){return ["キーボ",...S.partySlots]}
function baseFor(name){return BASE_MEMBERS[name]||{hp:60,mp:15,atk:11,def:6,role:"仲間"}}
function maxHp(i){let b=baseFor(partyNames()[i]);return b.hp+(S.lv-1)*(i===0?6:4)}
function maxMp(i){let b=baseFor(partyNames()[i]);return b.mp+(S.lv-1)*(i===1?3:2)}
function ensureVitals(){for(let i=0;i<3;i++){S.hp[i]=Math.min(Number.isFinite(S.hp[i])?S.hp[i]:maxHp(i),maxHp(i));S.mp[i]=Math.min(Number.isFinite(S.mp[i])?S.mp[i]:maxMp(i),maxMp(i))}}
function save(){
 try{
  if(!S||typeof S!=="object"||!Number.isFinite(+S.lv)||+S.lv<1)throw new Error("invalid save state");
  const now=Date.now();S.__saveMeta={savedAt:now,version:"v0.74.42"};
  const next=JSON.stringify(S), cur=localStorage.getItem(KEY), b1=localStorage.getItem(SAVE_BAK1);
  if(cur&&parseSaveRaw(cur)&&cur!==next){if(b1&&parseSaveRaw(b1))localStorage.setItem(SAVE_BAK2,b1);localStorage.setItem(SAVE_BAK1,cur)}
  localStorage.setItem(KEY,next);localStorage.setItem(SAVE_META,JSON.stringify({savedAt:now,version:"v0.74.42"}));
  return true;
 }catch(e){try{localStorage.setItem(SAVE_META,JSON.stringify({saveError:String(e),failedAt:Date.now()}))}catch(_){} return false}
}
function rescueCandidates(){
 const out=[],seen=new Set(),keys=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^dropHunter/i.test(k))keys.push(k)}}catch(e){}
 [KEY,SAVE_BAK1,SAVE_BAK2,...FALLBACK,...keys].forEach(k=>{if(seen.has(k))return;seen.add(k);let x=readSaveCandidate(k);if(x)out.push({k,x,t:saveStamp(x)})});
 return out.sort((a,b)=>(b.t||0)-(a.t||0));
}
function applyImportedSave(x,label="バックアップ"){
 if(!x||typeof x!=="object"||!Number.isFinite(+x.lv)||+x.lv<1)return toast("有効なセーブデータではありません");
 try{const cur=localStorage.getItem(KEY);if(cur&&parseSaveRaw(cur))localStorage.setItem(SAVE_BAK1,cur);localStorage.setItem(KEY,JSON.stringify(x));location.reload()}catch(e){toast("復元に失敗しました")}
}
function repairProgressFromLevel(){
 try{
  S.clears=S.clears||{};
  const fixed=[];
  // 進行フラグだけが欠落したセーブの救済。現在Lvから「次エリアに到達可能だったボス」まで復元する。
  if(S.lv>=6&&!S.clears.gb){S.clears.gb=true;fixed.push("草原ボス")}
  if(S.lv>=12&&!S.clears.fb){S.clears.fb=true;fixed.push("迷いの森ボス")}
  if(S.lv>=21&&!S.clears.ib){S.clears.ib=true;fixed.push("氷の雪原ボス")}
  // Lv28だけでは火山ボス撃破済みとは断定しないため vb は自動復元しない。
  if(!fixed.length)return toast("修復が必要な進行フラグはありません");
  save();render();toast("進行状況を修復しました");setTimeout(()=>stageView(),250);
 }catch(e){toast("進行状況の修復に失敗しました")}
}

const SUPPORT_RESCUE_CODE739="DOD-140-PIVOT-500K";
function supportRescue739(code){
 try{
  if(String(code||'').trim().toUpperCase()!==SUPPORT_RESCUE_CODE739)return toast('復旧コードが違います');
  S.supportRescue=S.supportRescue||{};
  if(S.supportRescue.lv140_739)return toast('この救済はすでに適用済みです');
  // 今回はLv自体が28まで巻き戻っていることを実機画面で確認済み。
  // 正しい専用コード＋未適用のセーブだけを条件にし、Lv条件では弾かない。
  // 実行直前の状態を専用キーへ退避。通常の3世代バックアップとは別に残す。
  try{localStorage.setItem('dropHunter010_preSupportRescue739',JSON.stringify(S))}catch(_){}
  S.clears=S.clears||{};
  ['gb','fb','ib','vb','cb','sb','g1','g2'].forEach(k=>S.clears[k]=true);
  // 本人申告・運営確認済みの到達Lvへ戻す。現在値が140を超えている場合は下げない。
  S.lv=Math.max(Number.isFinite(+S.lv)?+S.lv:1,140);
  S.exp=0;
  S.legend62=S.legend62||{};S.legend62.pivot=true;
  S.unlockedHeroes=Array.isArray(S.unlockedHeroes)?S.unlockedHeroes:[];
  if(!S.unlockedHeroes.includes('ピボット'))S.unlockedHeroes.push('ピボット');
  S.owned=Array.isArray(S.owned)?S.owned:[];
  ['星導剣・アストラ','星天衣・セレスティア','運命盤・オルビス'].forEach(n=>{if(!S.owned.includes(n))S.owned.push(n);S.dropFound=S.dropFound||{};S.dropFound[n]=true});
  // お詫び分は「残高を50万にする」ではなく現在残高へ50万Gを一度だけ加算。
  S.gold=(Number.isFinite(+S.gold)?+S.gold:0)+500000;
  S.supportRescue.lv140_739={appliedAt:Date.now(),code:'LV140'};
  if(!save())throw new Error('save failed');
  render();
  alert('データ救済が完了しました。\n\n・Lv140相当へ復旧\n・ダンジョン進行を復旧\n・ピボットを復旧\n・LEGEND装備3種を復旧\n・500,000Gを付与\n\n現在残っている所持品等は維持されています。');
  setTimeout(()=>stageView(),250);
 }catch(e){toast('データ救済に失敗しました')}
}
function makePlayerId741(){
 const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789", bytes=new Uint8Array(8);
 try{crypto.getRandomValues(bytes)}catch(e){for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256)}
 let out="";for(let i=0;i<8;i++)out+=chars[bytes[i]%chars.length];return `DOD-${out.slice(0,4)}-${out.slice(4)}`
}
function ensureProfileShape741(){
 if(S.playerProfile&&typeof S.playerProfile==="object"){
  if(!S.playerProfile.id)S.playerProfile.id=makePlayerId741();
  if(!S.playerProfile.createdAt)S.playerProfile.createdAt=Date.now();
 }
 if(!Number.isFinite(+S.lastCloudBackupAt))S.lastCloudBackupAt=0;
}
function fmtDate741(t){if(!t)return "未作成";try{return new Date(t).toLocaleString("ja-JP")}catch(e){return "未作成"}}
function backupAgeDays741(){if(!S.lastCloudBackupAt)return null;return Math.max(0,Math.floor((Date.now()-S.lastCloudBackupAt)/86400000))}
function registrationView741(){
 open("冒険者登録",`<div class="panel"><div class="sectionTitle">DROP OF DUNGEON — 冒険者登録</div><p class="small">冒険者名を登録すると、あなた専用のプレイヤーIDを発行します。</p><form id="registerForm741"><input id="playerName741" type="text" maxlength="16" autocomplete="nickname" enterkeyhint="done" placeholder="プレイヤー名（16文字まで）" style="width:100%;box-sizing:border-box;margin:8px 0 12px;padding:12px;border-radius:10px;font-size:16px"><button type="submit" class="miniBtn" id="register741" style="min-height:46px;width:100%;touch-action:manipulation">冒険をはじめる</button></form><p class="small" style="margin-top:14px">セーブデータは端末内に自動保存されます。端末・ブラウザのデータ消失に備えて、登録後は「冒険者プロフィール」から中断データを定期的に保存してください。<br>iPhone / iPad：iCloud Drive　Android：Google Drive などに保存できます。</p></div>`);
 const closeBtn=$("#close");if(closeBtn)closeBtn.style.display="none";
 const form=$("#registerForm741"),inp=$("#playerName741"),go=$("#register741");
 const submitRegistration=()=>{
  const name=(inp&&inp.value||"").trim();
  if(!name){toast("プレイヤー名を入力してください");if(inp)inp.focus();return}
  if(go){go.disabled=true;go.textContent="登録中…"}
  try{
   S.playerProfile={name:name.slice(0,16),id:makePlayerId741(),createdAt:Date.now()};
   if(!save())throw new Error("save failed");
   if(closeBtn)closeBtn.style.display="";
   profileView741(true);
  }catch(e){
   S.playerProfile=null;
   if(go){go.disabled=false;go.textContent="冒険をはじめる"}
   toast("冒険者登録に失敗しました。もう一度お試しください");
  }
 };
 if(form)form.addEventListener("submit",e=>{e.preventDefault();submitRegistration()});
}
function backupGuide741(){
 open("中断データの保存方法",`<div class="panel"><div class="sectionTitle">iPhone / iPad</div><p>①「中断データを保存」<br>② 共有画面から「ファイルに保存」→「iCloud Drive」を選択</p></div><div class="panel"><div class="sectionTitle">Android</div><p>①「中断データを保存」<br>② 保存・共有画面から「Google Drive」などを選択</p></div><div class="panel"><div class="sectionTitle">PC</div><p>ダウンロードされた中断データを安全なフォルダやクラウドへ保管してください。</p><p class="small">バックアップファイルは機種変更・ブラウザデータ消失・不具合発生時の復旧に使用します。プレイヤーIDと一緒に保管してください。</p></div>`)
}
async function exportSuspend741(){
 ensureProfileShape741();save();
 const pid=S.playerProfile&&S.playerProfile.id||"NO-ID", stamp=new Date().toISOString().slice(0,10), filename=`DOD_${pid}_${stamp}.json`;
 const payload=JSON.stringify({__dodBackup:1,exportedAt:Date.now(),version:"v0.74.42",playerId:pid,playerName:S.playerProfile&&S.playerProfile.name||"",state:S},null,2);
 const file=new File([payload],filename,{type:"application/json"});
 try{
  if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:"どろダン 中断データ",text:"大切な中断データです。iCloud Drive / Google Driveなどに保存してください。",files:[file]})}
  else{const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)}
  S.lastCloudBackupAt=Date.now();save();toast("中断データを作成しました");setTimeout(()=>profileView741(false),250)
 }catch(e){if(e&&e.name!=="AbortError")toast("中断データの作成に失敗しました")}
}
function esc741(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})}
function profileView741(showCreated=false){
 ensureProfileShape741();if(!S.playerProfile)return registrationView741();
 const p=S.playerProfile,days=backupAgeDays741(),warn=!S.lastCloudBackupAt?"⚠ まだ中断データが保存されていません":days>=7?`⚠ 最後のバックアップから${days}日経過しています`:"✓ バックアップ状況は良好です";
 open("冒険者プロフィール",`<div class="panel"><div class="sectionTitle">冒険者プロフィール</div><div class="row"><span>プレイヤー名</span><b>${esc741(p.name)}</b></div><div class="row"><span>プレイヤーID</span><span><b>${esc741(p.id)}</b> <button class="miniBtn" id="copyPid741">コピー</button></span></div><div class="row"><span>Lv</span><b>${S.lv}</b></div><div class="row"><span>冒険開始</span><b>${fmtDate741(p.createdAt)}</b></div>${showCreated?'<p class="small">プレイヤーIDを発行しました。データ復旧時に使用するため大切に保管してください。</p>':''}</div><div class="panel"><div class="sectionTitle">冒険データ</div><div class="row"><span>自動セーブ</span><b>本体＋バックアップ2世代</b></div><div class="row"><span>最終中断データ作成</span><b>${fmtDate741(S.lastCloudBackupAt)}</b></div><p class="small">${warn}</p><div class="bankActions"><button class="miniBtn" id="suspendSave741">中断データを保存</button><button class="miniBtn" id="suspendLoad741">中断データから復旧</button><button class="miniBtn" id="backupGuide741">保存方法を見る</button></div><input id="suspendFile741" type="file" accept="application/json,.json" style="display:none"><p class="small">iPhone / iPadはiCloud Drive、AndroidはGoogle Driveなど、安全な場所へ保存してください。ゲーム側では保存先のクラウド内容までは確認できません。</p></div>`);
 const cp=$("#copyPid741");if(cp)cp.onclick=async()=>{try{await navigator.clipboard.writeText(p.id);toast("プレイヤーIDをコピーしました")}catch(e){prompt("プレイヤーIDをコピーしてください",p.id)}};
 $("#suspendSave741").onclick=()=>exportSuspend741();$("#backupGuide741").onclick=()=>backupGuide741();$("#suspendLoad741").onclick=()=>$("#suspendFile741").click();
 $("#suspendFile741").onchange=ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const wrap=JSON.parse(rd.result),x=parseSaveRaw(rd.result);if(!x)throw 0;const fromId=(wrap&&wrap.playerId)||(x.playerProfile&&x.playerProfile.id)||"";if(fromId&&fromId!==p.id&&!confirm(`別のプレイヤーID（${fromId}）の中断データです。現在のデータを置き換えますか？`))return;if(!confirm("現在の冒険データを中断データで置き換えますか？"))return;const cur=localStorage.getItem(KEY);if(cur&&parseSaveRaw(cur))localStorage.setItem(KEY+"_before_suspend_restore",cur);if(!x.playerProfile&&S.playerProfile)x.playerProfile=JSON.parse(JSON.stringify(S.playerProfile));localStorage.setItem(KEY,JSON.stringify(x));location.reload()}catch(e){toast("有効な中断データではありません")}};rd.readAsText(f)};
}
function maybeBackupWarning741(){
 if(!S.playerProfile)return setTimeout(registrationView741,250);
 const days=backupAgeDays741();if((!S.lastCloudBackupAt||days>=7)&&Date.now()-(S.__backupNoticeAt||0)>86400000){S.__backupNoticeAt=Date.now();save();setTimeout(()=>{if(confirm(!S.lastCloudBackupAt?"まだ中断データが保存されていません。今バックアップ画面を開きますか？":`最後のバックアップから${days}日経過しています。今バックアップ画面を開きますか？`))profileView741(false)},500)}
}
window.__profile741={open:()=>profileView741(false),register:registrationView741,guide:backupGuide741,exportSuspend:exportSuspend741};
function saveGuardView(){
 const rows=rescueCandidates().map((v,i)=>`<div class="row"><span><b>${v.k===KEY?'現在':v.k.includes('backup')?'自動バックアップ':'旧セーブ'}：${v.k}</b><br><small>Lv${v.x.lv||1} / ${Number(v.x.gold||0).toLocaleString()}G / 進行${Object.keys(v.x.clears||{}).filter(k=>v.x.clears[k]).length}件${v.t?' / '+new Date(v.t).toLocaleString('ja-JP'):''}</small></span><button class="miniBtn" data-rescue="${i}">復元</button></div>`).join('');
 open("セーブ保護・救出",`<div class="panel"><div class="sectionTitle">セーブ保護</div><p class="small">本セーブ＋自動バックアップ2世代で保存します。旧セーブキーは削除しません。</p><div class="bankActions"><button class="miniBtn" id="saveExport">バックアップを書き出す</button><button class="miniBtn" id="saveImport">バックアップを読み込む</button><input id="saveImportFile" type="file" accept="application/json,.json" style="display:none"></div></div><div class="panel"><div class="sectionTitle">進行状況の修復</div><p class="small">Lvは残っているのにダンジョンが未解放になった場合、Lvから過去エリアのボス撃破フラグだけを復元します。所持品・G・仲間は変更しません。</p><button class="miniBtn" id="progressRepair">進行状況を修復</button></div><div class="panel"><div class="sectionTitle">運営サポート用データ救済</div><p class="small">不具合対応で復旧コードを案内された場合のみ使用してください。対象外のセーブには適用されません。</p><input id="supportRescueCode" type="text" autocomplete="off" autocapitalize="characters" placeholder="復旧コード" style="width:100%;box-sizing:border-box;margin:6px 0 10px;padding:12px;border-radius:10px"><button class="miniBtn" id="supportRescueRun">復旧コードを適用</button></div><div class="panel"><div class="sectionTitle">端末内セーブ救出</div>${rows||'<p class="small">復元できるセーブは見つかりませんでした。</p>'}</div>`);
 const list=rescueCandidates();document.querySelectorAll('[data-rescue]').forEach(b=>b.onclick=()=>{let v=list[+b.dataset.rescue];if(v&&confirm(`Lv${v.x.lv||1} のデータを復元しますか？`))applyImportedSave(v.x,v.k)});
 const pr=$('#progressRepair');if(pr)pr.onclick=()=>{if(confirm('現在のLvから過去エリアのボス撃破フラグを修復しますか？\n所持品・G・仲間は変更しません。'))repairProgressFromLevel()};
 const sr=$('#supportRescueRun'),sc=$('#supportRescueCode');if(sr&&sc)sr.onclick=()=>{const c=String(sc.value||'').trim();if(!c)return toast('復旧コードを入力してください');if(confirm('今回の不具合救済をこのセーブに適用しますか？\n実行前データは専用バックアップへ退避します。'))supportRescue739(c)};
 const ex=$('#saveExport');if(ex)ex.onclick=()=>{save();const blob=new Blob([JSON.stringify({__dodBackup:1,exportedAt:Date.now(),version:"v0.74.42",state:S},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='drodun-save-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);toast('バックアップを書き出しました')};
 const im=$('#saveImport'),fi=$('#saveImportFile');if(im&&fi){im.onclick=()=>fi.click();fi.onchange=()=>{let f=fi.files&&fi.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{let x=parseSaveRaw(String(r.result||''));if(!x)return toast('有効なバックアップではありません');if(confirm(`Lv${x.lv||1} のバックアップを読み込みますか？`))applyImportedSave(x,'ファイル')};r.readAsText(f)}}
}
function item(n){return shop.find(x=>x.n===n)||Object.values(drops).flat().find(x=>x.n===n)||specialItems[n]||{n,type:"素材",atk:0,def:0,crit:0,rar:"NORMAL",desc:"アイテム"}}
function rarityClass(r){return r==="RARE"?"rar-rare":r==="EPIC"?"rar-epic":r==="PHANTOM"?"rar-phantom":"rar-normal"}
function statsFor(i){const name=partyNames()[i],b=baseFor(name),eq=S.equipment[i]||{};let its=Object.values(eq).filter(Boolean).map(item);return{atk:b.atk+(S.lv-1)*(i===0?3:2)+its.reduce((a,x)=>a+(x.atk||0),0),def:b.def+(S.lv-1)*(i===0?2:1)+its.reduce((a,x)=>a+(x.def||0),0),crit:5+its.reduce((a,x)=>a+(x.crit||0),0)}}
function equipStat(i,type){return item((S.equipment[i]||{})[type]||"")}
function compareText(x,i=0){if(!["武器","防具","アクセサリー"].includes(x.type))return"";let cur=equipStat(i,x.type),a=(x.atk||0)-(cur.atk||0),d=(x.def||0)-(cur.def||0),c=(x.crit||0)-(cur.crit||0),p=[];if(a)p.push(`攻撃 <span class="${a>0?'compareUp':'compareDown'}">${a>0?'+':''}${a}</span>`);if(d)p.push(`防御 <span class="${d>0?'compareUp':'compareDown'}">${d>0?'+':''}${d}</span>`);if(c)p.push(`会心 <span class="${c>0?'compareUp':'compareDown'}">${c>0?'+':''}${c}%</span>`);return p.length?`<br><small>キーボ装備比：${p.join(' / ')}</small>`:'<br><small>キーボ装備と同等</small>'}
function svgMonster(t,gold=false){
 const art={
  hornrabbit:DOD_ASSETS["dod_asset_09_c55f9e516118.png"],
  poisonbee:DOD_ASSETS["dod_asset_10_4d24a3661ad3.png"],
  morikinoko:DOD_ASSETS["dod_asset_11_841e1900aa3a.png"],
  leaffairy:DOD_ASSETS["dod_asset_12_c6db9545fe5f.png"],
  shadowbat:DOD_ASSETS["dod_asset_13_0e5ca31c8687.png"],
  grassfang:DOD_ASSETS["dod_asset_14_3a457d31ed1f.png"],
  moonwolf:DOD_ASSETS["dod_asset_15_cd213c955309.png"],
  slime:DOD_ASSETS["dod_asset_06_3700df7033f7.png"],
  golden:DOD_ASSETS["dod_asset_16_4d6adfafe001.png"],
  goblin:DOD_ASSETS["dod_asset_07_51472b356220.png"],
  wolf:DOD_ASSETS["dod_asset_08_c34c68d09be9.png"],
  mushroom:DOD_ASSETS["dod_asset_17_266a58037455.png"]
 };
 let key=gold?'golden':t;
 if(art[key]) return `<img class="monsterArt" src="${art[key]}" alt="${key}" draggable="false">`;
 if(t==='bat')return `<svg viewBox="0 0 64 64" class="svgSprite"><path fill="#754aa3" stroke="#2c203d" stroke-width="3" d="M31 24C20 10 5 13 5 32l15-6-5 15 16-7c2 3 4 3 6 0l16 7-5-15 15 6C63 13 48 10 37 24z"/><circle cx="34" cy="29" r="8" fill="#9e70ca"/></svg>`;
 return `<svg viewBox="0 0 64 64" class="svgSprite"><path fill="#d9b34b" stroke="#4a381c" stroke-width="3" d="M8 46c0-17 10-29 24-33 14 4 24 16 24 33 0 10-11 13-24 13S8 56 8 46z"/><path fill="#f7e26e" stroke="#4a381c" stroke-width="2" d="M18 16 22 5l10 8L42 5l5 12z"/></svg>`;
}
function svgHero(name){if(name==='ミア')return `<svg viewBox="0 0 52 60" class="svgHero"><path fill="#6b3b79" stroke="#1e2430" stroke-width="3" d="M8 22 26 3l18 19-9-2 7 9H10l7-9z"/><circle cx="26" cy="27" r="10" fill="#ffd8ba" stroke="#1e2430" stroke-width="3"/><path fill="#9e5ab1" stroke="#1e2430" stroke-width="3" d="M13 58v-22h26v22z"/><rect x="39" y="31" width="4" height="25" fill="#6d4a28"/></svg>`;
if(name==='トア')return `<svg viewBox="0 0 52 60" class="svgHero"><path fill="#d9a24e" stroke="#50391d" stroke-width="3" d="M9 23 4 11l13 7c6-4 12-4 18 0l13-7-5 12v17c-5 14-29 14-34 0z"/><circle cx="19" cy="30" r="2"/><circle cx="34" cy="30" r="2"/><path fill="#b97c36" stroke="#50391d" stroke-width="3" d="M13 58V43h26v15z"/></svg>`;
if(name.includes('スライム'))return svgMonster('slime',name==='黄金スライム');
return `<svg viewBox="0 0 52 60" class="svgHero"><circle cx="26" cy="18" r="12" fill="#ffd5ae" stroke="#1e2936" stroke-width="3"/><path fill="#386da9" stroke="#1e2936" stroke-width="3" d="M12 58V31h28v27z"/><path d="M38 29 49 50" stroke="#dfeaf0" stroke-width="5"/><path d="M38 29 49 50" stroke="#44515f" stroke-width="8" opacity=".35"/></svg>`}
function stage(){return stages.find(x=>x.id===S.stageId)||stages[0]}
function spawn(){ensureVitals();const st=stage();E=[];let golden=!st.boss&&Math.random()<1/500;if(golden){stopAuto("黄金スライム出現");let mx=90+S.lv*9;E=[{name:"黄金スライム",base:"スライム",icon:"slime",hp:mx,max:mx,atk:13+S.lv,xp:120+S.lv*10,charge:false,golden:true}];S.seen["黄金スライム"]=true;setTimeout(()=>showFx(`<h1 class="goldTitle">PHANTOM ENCOUNTER!</h1><div class="dropItem">✨ 黄金スライム出現！</div><p class="small">AUTOを停止しました。タップして戦闘へ</p>`,"phantom"),100)}else if(st.boss){let bossName=st.bossMonster||st.enemies[0],b=monBase[bossName],mx=Math.floor(b.hp*st.mult+S.lv*5);E=[{name:bossName,base:bossName,icon:b.icon,hp:mx,max:mx,atk:Math.floor(b.atk+S.lv*1.2),xp:b.xp+S.lv*5,charge:false,boss:true}];S.seen[bossName]=true}else{let n=1+Math.floor(Math.random()*3);for(let i=0;i<n;i++){let name=st.enemies[Math.floor(Math.random()*st.enemies.length)],b=monBase[name],mx=Math.floor((b.hp+S.lv*4)*st.mult);E.push({name,base:name,icon:b.icon,hp:mx,max:mx,atk:Math.floor((b.atk+S.lv)*st.mult),xp:Math.floor((b.xp+S.lv*2)*st.mult),charge:false});S.seen[name]=true}}target=0;render()}
function render(){ensureVitals();const P=partyNames(),req=needExp(S.lv);$("#lv").textContent=S.lv;$("#gold").textContent=S.gold;$("#battleNo").textContent=S.battle;$("#stageName").textContent=stage().name;$("#expTxt").textContent=`${S.exp} / ${req}`;$("#expFill").style.width=Math.min(100,S.exp/req*100)+"%";$("#auto").innerHTML=S.auto?"▶▶<br>AUTO ON":"▶▶<br>AUTO";$("#auto").classList.toggle("on",S.auto);
$("#enemies").innerHTML=E.map((e,i)=>`<div data-monster="${e.name}" class="enemy ${e.boss?'boss':''} ${e.hp<=0?'dead':''} ${i===target?'selected':''}" data-i="${i}"><div class="ebox ${e.boss?'bossName':''}">${e.charge?'⚠ 強攻撃準備<br>':''}${e.name} Lv${e.lv||S.lv}<div class="bar mini hp"><i style="width:${Math.max(0,e.hp/e.max*100)}%"></i></div></div><div class="sprite">${svgMonster(e.icon,e.golden)}</div><div class="target">${i===target&&e.hp>0?'▲ TARGET':''}</div></div>`).join("");
document.querySelectorAll('.enemy').forEach(el=>el.onclick=()=>{let i=+el.dataset.i;if(E[i].hp>0){target=i;render()}});
const partyEl=$("#party");if(partyEl)partyEl.innerHTML=P.map((n,i)=>`<div class="pcard ${S.hp[i]<=0?'ko':''}"><b>${n}</b><div>HP ${S.hp[i]} / ${maxHp(i)}</div><div class="bar hp"><i style="width:${S.hp[i]/maxHp(i)*100}%"></i></div><div class="bar mp"><i style="width:${S.mp[i]/maxMp(i)*100}%"></i></div><div>MP ${S.mp[i]} / ${maxMp(i)}</div></div>`).join('');save()}
function living(){return E.filter(e=>e.hp>0)}function aliveParty(){return [0,1,2].filter(i=>S.hp[i]>0)}
function toast(t){let x=$("#toast");x.textContent=t;x.style.display="block";clearTimeout(x._t);x._t=setTimeout(()=>x.style.display="none",1500)}
function showLog(t,ms=800){let x=$("#log");x.textContent=t;x.classList.add("show");clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove("show"),ms)}
function floatText(t,x,y,cls=""){let d=document.createElement("div");d.className="float "+cls;d.textContent=t;d.style.left=x+"%";d.style.top=y+"%";$("#battle").appendChild(d);setTimeout(()=>d.remove(),800)}
function hit(i,d,crit=false){if(!E[i]||E[i].hp<=0)return;E[i].hp=Math.max(0,E[i].hp-d);floatText((crit?"CRITICAL! ":"")+"-"+d,12+i*31,29,crit?"crit":"")}
function partyDamage(i,d){if(S.hp[i]<=0)return;S.hp[i]=Math.max(0,S.hp[i]-d);floatText("-"+d,18+i*31,72);if(S.hp[i]===0)showLog(`${partyNames()[i]}は戦闘不能！`,900)}
function wipe(){clearInterval(timer);S.auto=false;let lost=Math.floor(S.gold*.25);S.gold-=lost;S.hp=[0,1,2].map(i=>Math.max(1,Math.floor(maxHp(i)*.6)));S.mp=[0,1,2].map(i=>Math.max(1,Math.floor(maxMp(i)*.6)));save();showFx(`<h1>全滅…</h1><p>手持ちから ${lost}G を失った</p><p class="small">銀行の ${S.bank}G は守られた</p><p class="small">拠点でHP・MPが60%まで回復した</p><p class="small">タップして再開</p>`);S.battle++;setTimeout(spawn,300);render()}
function enemyTurn(){living().forEach(e=>{let ap=aliveParty();if(!ap.length)return;let i=ap[Math.floor(Math.random()*ap.length)],def=statsFor(i).def;if(e.charge){let d=Math.max(1,e.atk*2-def);if(S.guard)d=Math.max(1,Math.floor(d*.35));partyDamage(i,d);e.charge=false;showLog(`${e.name}の強攻撃！ ${partyNames()[i]}に${d}ダメージ`)}else if(Math.random()<.2){e.charge=true;showLog(`⚠ ${e.name}が力を溜めている！`)}else{let d=Math.max(1,e.atk-def);if(S.guard)d=Math.max(1,Math.floor(d*.35));partyDamage(i,d);showLog(`${e.name}の攻撃！ ${partyNames()[i]}に${d}ダメージ`)}});S.guard=false;if(!aliveParty().length)wipe()}
function companionActions(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1;if(name==='ミア'&&S.mp[i]>=2&&Math.random()<.45){S.mp[i]-=2;mult=1.35;showLog(`ミアの魔法弾！`)}else if(name==='トア'&&Math.random()<.3){mult=1.25;showLog(`トアのかみつき！`)}else if(name==='黄金スライム'&&Math.random()<.35){mult=1.45;showLog(`黄金スライムのきらめき！`)}let crit=Math.random()<st.crit/100,d=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1));hit(idx,d,crit)}}
function addOwned(n){if(n==="生命の雫"){S.revive=(S.revive||0)+1;return}S.owned.push(n)}
function stopAuto(reason=""){if(S.auto||timer){S.auto=false;clearInterval(timer);timer=null;render();if(reason)toast(`AUTO停止：${reason}`)}}
function rollRecruit(e){
 if(e.golden||e.boss||!e.base)return;
 const cfg=MONSTERS[e.base]; if(!cfg||!cfg.recruit||S.monsterCompanions.includes(e.name))return;
 if(Math.random()<1/cfg.recruit){S.monsterCompanions.push(e.name);save();stopAuto(`${e.name}が仲間になった`);setTimeout(()=>showFx(`<h1 class="recruitFlash">NEW COMPANION!</h1><div class="dropItem">${e.name}が仲間になった！</div><p class="small">パーティ → 仲間モンスターから編成できます</p>`),180)}
}
function rollDrops(e){
 if(e.golden){
   addOwned("幻の金冠");S.dropFound["幻の金冠"]=(S.dropFound["幻の金冠"]||0)+1;S.locks["幻の金冠"]=true;stopAuto("幻級ドロップ");
   if(!S.goldenJoined){S.goldenJoined=true;if(!S.monsterCompanions.includes("黄金スライム"))S.monsterCompanions.push("黄金スライム");save();setTimeout(()=>showFx(`<h1 class="goldTitle">FIRST DEFEAT!</h1><div class="dropItem">✨ 黄金スライムが100%仲間になった！</div><p class="rar-phantom">幻の金冠も獲得</p><p class="small">パーティ → 仲間モンスターで確認できます</p>`,"phantom"),250)}
   else setTimeout(()=>showDrop("幻の金冠","PHANTOM"),250);
   return;
 }
 for(let d of(drops[e.base]||[])){let hasLuck=S.equipment.some(eq=>eq.アクセサリー==="幸運のお守り"),bonus=hasLuck?1.35:1;if(Math.random()<bonus/d.r){addOwned(d.n);S.dropFound[d.n]=(S.dropFound[d.n]||0)+1;if(d.rar!=="NORMAL")S.locks[d.n]=true;if(d.rar==="EPIC"||d.rar==="PHANTOM")stopAuto(`${d.rar}ドロップ`);if(d.rar!=="NORMAL")setTimeout(()=>showDrop(d.n,d.rar),350);else toast(`${d.n}を手に入れた！`)}}
}
function showDrop(n,rar){showFx(`<h1 class="dropTitle">${rar==="PHANTOM"?'PHANTOM':rar==="EPIC"?'EPIC':'RARE'} DROP!</h1><div class="dropItem ${rarityClass(rar)}">${n}</div><p class="${rarityClass(rar)}">${rar}</p><p class="small">レア品は自動ロック済み / タップして続ける</p>`,rar==="PHANTOM"?"phantom":rar==="EPIC"?"rare":"") }
function addExp(x){S.exp+=x;let req=needExp(S.lv);if(S.exp>=req){S.exp-=req;let old=S.lv,oldSt=statsFor(0),oldH=maxHp(0),oldM=maxMp(0);S.lv++;S.hp=[0,1,2].map(i=>maxHp(i));S.mp=[0,1,2].map(i=>maxMp(i));let ns=statsFor(0);showFx(`<h1>LEVEL UP!</h1><h2>Lv.${old} → Lv.${S.lv}</h2><div class="growth"><div>HP<br><b>${oldH} → ${maxHp(0)}</b></div><div>MP<br><b>${oldM} → ${maxMp(0)}</b></div><div>攻撃力<br><b>${oldSt.atk} → ${ns.atk}</b></div><div>防御力<br><b>${oldSt.def} → ${ns.def}</b></div></div>${skillDefs.find(s=>s[1]===S.lv)?`<div class="newskill">NEW SKILL! 「${skillDefs.find(s=>s[1]===S.lv)[0]}」</div>`:''}`)}}
function afterBattleHeal(){let vals=S.hp.map((h,i)=>{if(h<=0)return 0;let r=10+Math.floor(Math.random()*6),b=h;S.hp[i]=Math.min(maxHp(i),h+r);return S.hp[i]-b});toast(`戦闘後回復　${partyNames().map((n,i)=>`${n}+${vals[i]}`).join(' / ')}`)}
function battleFlow623(title,sub='',kind='',ms=850){let x=document.getElementById('battleFlow623');if(!x)return Promise.resolve();x.className='show '+(kind==='boss'?'bfBoss623':kind==='stage'?'bfStage623':'');x.innerHTML=`<div class="bfCard623"><div class="bfTitle623">${title}</div>${sub?`<div class="bfSub623">${sub}</div>`:''}</div>`;return new Promise(r=>setTimeout(()=>{x.className='';x.innerHTML='';r()},ms))}
function finish(){if(living().length)return false;let xp=E.reduce((a,e)=>a+e.xp,0),g=Math.floor((8+E.length*7+Math.random()*10+(E.some(e=>e.golden)?250:0))*stage().mult),boss=!!stage().boss;let beforeDrops=Object.assign({},S.dropFound||{});E.forEach(e=>{S.kills[e.name]=(S.kills[e.name]||0)+1;rollRecruit(e);rollDrops(e)});let got=[];Object.keys(S.dropFound||{}).forEach(n=>{let d=(S.dropFound[n]||0)-(beforeDrops[n]||0);if(d>0)got.push(`${n}${d>1?' ×'+d:''}`)});if(boss)S.clears[stage().id]=true;S.gold+=g;addExp(xp);addMonsterExp(xp);afterBattleHeal();let clearedBattle=S.battle;S.battle++;render();let reward=`EXP +${xp}　+${g}G${got.length?`<div class="bfDrop623">DROP：${got.slice(0,3).join(' / ')}</div>`:''}`;let runEnd=S.run623&&S.battle>=S.run623.goal;if(boss){battleFlow623('BOSS DEFEATED',reward,'boss',950).then(()=>battleFlow623('STAGE CLEAR',`${stage().next||'次のステージ'}${(stage().next||'').includes('今後追加')?'':' が解放された！'}`,'stage',1050)).then(()=>{spawn();render()});return true}if(runEnd){let r=S.run623;S.run623=null;S.auto=false;battleFlow623('STAGE CLEAR',`${r.start}戦目 → ${clearedBattle}戦目<br>10戦完走`,'stage',1050).then(()=>{spawn();render()});return true}compactClear64(xp,g,got);setTimeout(()=>{spawn();render()},S.auto?300:520);return true}
function endTurn(){if(finish())return;companionActions();if(finish())return;let idx=E.findIndex(e=>e.hp>0);if(idx>=0)target=idx;enemyTurn();render()}
function attack(){if(S.hp[0]<=0)return toast("キーボは戦闘不能");let st=statsFor(0),crit=Math.random()<st.crit/100,d=Math.floor(st.atk*(.85+Math.random()*.3)*(crit?1.8:1));showLog("キーボの攻撃！");hit(target,d,crit);endTurn()}
$("#attack").onclick=attack;$("#guard").onclick=()=>{if(S.hp[0]<=0)return toast("キーボは戦闘不能");S.guard=true;showLog("キーボは防御の構え！");companionActions();if(!finish())enemyTurn();render()};
function openTarget(title,cb,allowKO=false){targetAction=cb;$("#targetTitle").textContent=title;$("#targetList").innerHTML=partyNames().map((n,i)=>`<button class="targetBtn" data-ti="${i}" ${(!allowKO&&S.hp[i]<=0)?'disabled':''}>${n}<br><small>HP ${S.hp[i]}/${maxHp(i)}</small></button>`).join('');document.querySelectorAll('[data-ti]').forEach(b=>b.onclick=()=>{let i=+b.dataset.ti;$("#targetSheet").classList.remove('open');let f=targetAction;targetAction=null;f&&f(i)});$("#targetSheet").classList.add('open')}
$("#targetClose").onclick=()=>{$("#targetSheet").classList.remove('open');targetAction=null};
$("#herb").onclick=()=>{if(!S.herb)return toast("薬草がない");openTarget("薬草を使う相手",i=>{if(S.hp[i]<=0)return toast("戦闘不能には使えない");S.herb--;let b=S.hp[i];S.hp[i]=Math.min(maxHp(i),S.hp[i]+35);floatText("+"+(S.hp[i]-b),18+i*31,72,"heal");render()})};
function renderSkills(){let u=skillDefs.filter(s=>S.lv>=s[1]);$("#skillList").innerHTML=u.map(s=>`<button class="skill" data-sk="${s[0]}"><b>${s[0]}</b><small>MP${s[2]} / ${s[3]}</small></button>`).join("")+(u.length?`<div class="small">次の技：${(skillDefs.find(s=>S.lv<s[1])||['全習得'])[0]}</div>`:'');document.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>useSkill(b.dataset.sk))}
$("#skillsBtn").onclick=()=>{renderSkills();$("#skillSheet").classList.add("open")};$("#skillClose").onclick=()=>$("#skillSheet").classList.remove("open");
function useSkill(n){let s=skillDefs.find(x=>x[0]===n);if(S.hp[0]<=0)return toast("キーボは戦闘不能");if(S.mp[0]<s[2])return toast("MPが足りない");if(n==="ヒール"){$("#skillSheet").classList.remove("open");openTarget("ヒールの対象",i=>{S.mp[0]-=s[2];let b=S.hp[i];S.hp[i]=Math.min(maxHp(i),S.hp[i]+45+S.lv*2);showLog(`キーボは${partyNames()[i]}にヒール！`);floatText("+"+(S.hp[i]-b),18+i*31,72,"heal");render()});return}S.mp[0]-=s[2];$("#skillSheet").classList.remove("open");let st=statsFor(0);if(n==="風刃")E.forEach((e,i)=>hit(i,Math.floor(st.atk*1.15)));else if(n==="二連斬り"){hit(target,Math.floor(st.atk*.85));hit(target,Math.floor(st.atk*.85))}else{let mult={強撃:1.55,火炎斬り:1.8,アイス:2.1,"会心斬り":2.4,"奥義・紅蓮":3.4}[n]||1.5;hit(target,Math.floor(st.atk*mult),n==="会心斬り")}showLog(`キーボは「${n}」！`);endTurn()}
$("#auto").onclick=()=>{S.auto=!S.auto;render();clearInterval(timer);if(S.auto)timer=setInterval(()=>{if(S.auto)attack()},900)};$("#ten").onclick=()=>{let goal=S.battle+10;S.run623={start:S.battle,goal};S.auto=true;render();clearInterval(timer);timer=setInterval(()=>{if(S.battle>=goal||!S.auto){clearInterval(timer);if(S.battle>=goal){S.auto=false;S.run623=null}render();return}if(!document.getElementById('battleFlow623')?.classList.contains('show'))attack()},750)};
function showFx(h,kind=""){$("#fxcard").className="fxcard"+(kind==="phantom"?" phantomCard phantomPulse":kind==="rare"?" rareCard rarePulse":"");$("#fxcard").innerHTML=h;$("#fx").classList.add("show")}$("#fx").onclick=()=>{$("#fx").classList.remove("show");render()};function open(t,b){$("#otitle").textContent=t;$("#obody").innerHTML=b;$("#overlay").classList.add("open");$("#overlay").scrollTop=0;$("#obody").scrollTop=0;window.scrollTo(0,0)}$("#close").onclick=()=>$("#overlay").classList.remove("open");
function equipTo(i,n){let x=item(n),type=x.type;if(!["武器","防具","アクセサリー"].includes(type))return;for(let j=0;j<3;j++)if(j!==i&&S.equipment[j][type]===n)S.equipment[j][type]="";S.equipment[i][type]=n;toast(`${partyNames()[i]}が${n}を装備`);render()}
function chooseEquip(n){openTarget(`${n}を誰に装備？`,i=>{equipTo(i,n);itemView(itemTab)},true)}
function shopView(type){shopTab=type;let arr=shop.filter(x=>x.type===type);$("#obody").innerHTML=`<div class="tabs">${["武器","防具","アクセサリー"].map(t=>`<button class="tab" data-tab="${t}">${t}</button>`).join('')}</div><div class="panel">${arr.map(x=>{let own=S.owned.includes(x.n),lock=S.lv<x.lv;return `<div class="row ${lock?'locked':''}"><span><b class="${rarityClass(x.rar)}">${lock?'🔒 ':''}${x.n}</b><br><small>${x.desc}<br>Lv${x.lv}解放</small>${own?compareText(x):''}</span><button class="${own?'equip':'buy'}" data-buy="${x.id}" ${lock?'disabled':''}>${own?'装備する':`${x.g}G`}</button></div>`}).join('')}</div>`;document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>shopView(b.dataset.tab));document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyEquip(b.dataset.buy))}
function buyEquip(id){let x=shop.find(a=>a.id===id);if(S.owned.includes(x.n)){chooseEquip(x.n);return}if(S.gold<x.g)return toast("Gが足りない");S.gold-=x.g;S.owned.push(x.n);toast(`${x.n}を購入！`);shopView(shopTab);render()}
function categoryOf(n){return item(n).type||"素材"}function countOwned(n){return S.owned.filter(x=>x===n).length}
function itemView(tab=itemTab){itemTab=tab;let names=[...new Set(S.owned)];if(tab!=="すべて")names=names.filter(n=>categoryOf(n)===tab);let tabs=["すべて","武器","防具","アクセサリー","アイテム","素材"];open("持ち物・装備",`<div class="itemTabs">${tabs.map(t=>`<button class="tab ${t===tab?'active':''}" data-itab="${t}">${t}</button>`).join('')}</div><div class="panel">${names.map(n=>itemRow(n)).join('')}<div class="row"><span><b>🌿 薬草</b><br><small>味方1人のHPを35回復</small></span><b>${S.herb}個</b></div><div class="row"><span><b class="revive">💧 生命の雫</b><br><small>戦闘不能の仲間をHP50%で復活</small></span><span><b>${S.revive||0}個</b> <button class="miniBtn" id="useRevive">使う</button></span></div><div class="bulkbar"><button class="miniBtn danger" id="bulkNormal">未ロック通常品を一括処分</button></div></div>`);document.querySelectorAll('[data-itab]').forEach(b=>b.onclick=()=>itemView(b.dataset.itab));document.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>chooseEquip(b.dataset.eq));document.querySelectorAll('[data-lock]').forEach(b=>b.onclick=()=>{let n=b.dataset.lock;S.locks[n]=!S.locks[n];itemView(itemTab);save()});document.querySelectorAll('[data-trash]').forEach(b=>b.onclick=()=>discard(b.dataset.trash));let rv=$('#useRevive');if(rv)rv.onclick=()=>useRevive();let bn=$('#bulkNormal');if(bn)bn.onclick=()=>bulkDiscard()}
function useRevive(){if(!S.revive)return toast("生命の雫がない");if(!S.hp.some(h=>h<=0))return toast("戦闘不能の仲間がいない");openTarget("生命の雫を使う相手",i=>{if(S.hp[i]>0)return toast("戦闘不能ではない");S.revive--;S.hp[i]=Math.max(1,Math.floor(maxHp(i)*.5));showFx(`<h1 class="revive">REVIVE!</h1><div class="dropItem">${partyNames()[i]} 復活</div><p>HP ${S.hp[i]} / ${maxHp(i)}</p>`);render()},true)}
function bulkDiscard(){let equipped=new Set(S.equipment.flatMap(eq=>Object.values(eq)));let before=S.owned.length;S.owned=S.owned.filter(n=>{let x=item(n);return x.rar!=="NORMAL"||S.locks[n]||equipped.has(n)||["木の剣","旅人の服","小さなお守り"].includes(n)});let cut=before-S.owned.length;toast(`${cut}個を一括処分`);itemView(itemTab);save()}
function itemRow(n){let x=item(n),type=categoryOf(n),locked=!!S.locks[n],cnt=countOwned(n),equipped=S.equipment.some(eq=>Object.values(eq).includes(n)),dropSource=Object.values(drops).flat().some(d=>d.n===n)||n==="幻の金冠";return `<div class="row"><span><b class="${rarityClass(x.rar)}">${n}${cnt>1?` ×${cnt}`:''}</b> <span class="typeBadge">${type}</span><br><small>${x.desc||''}</small>${dropSource?'<br><span class="sourceDrop">MONSTER DROP</span>':''}${compareText(x)}</span><span class="itemActions">${["武器","防具","アクセサリー"].includes(type)?`<button class="miniBtn" data-eq="${n}">${equipped?'付替':'装備'}</button>`:''}<button class="miniBtn ${locked?'lockedBtn':''}" data-lock="${n}">${locked?'🔒':'🔓'}</button><button class="miniBtn danger" data-trash="${n}" ${equipped||locked?'disabled':''}>捨てる</button></span></div>`}
function discard(n){let x=item(n);if(S.equipment.some(eq=>Object.values(eq).includes(n)))return toast("装備中は捨てられない");if(S.locks[n])return toast("ロック中です");if(x.rar!=="NORMAL"&&!confirm(`レアアイテム「${n}」を捨てますか？`))return;let i=S.owned.indexOf(n);if(i>=0)S.owned.splice(i,1);toast(`${n}を1個捨てた`);itemView(itemTab);save()}
function partyView(mode="members"){if(mode==="members"){open("パーティ",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel">${partyNames().map((n,i)=>{let st=statsFor(i),eq=S.equipment[i];return `<div class="charEquip"><h3>${n} <span class="small">${baseFor(n).role}</span></h3><div class="small">HP ${S.hp[i]}/${maxHp(i)}　MP ${S.mp[i]}/${maxMp(i)}　攻撃 ${st.atk}　防御 ${st.def}</div><div class="row"><span>武器</span><b>${eq.武器||'なし'}</b></div><div class="row"><span>防具</span><b>${eq.防具||'なし'}</b></div><div class="row"><span>アクセサリー</span><b>${eq.アクセサリー||'なし'}</b></div></div>`}).join('')}</div>`)}else{open("仲間モンスター",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel"><div class="sectionTitle">通常メンバー</div>${["ミア","トア"].map(n=>`<div class="monsterCard"><b>${n}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`).join('')}<div class="sectionTitle">仲間モンスター</div>${S.monsterCompanions.length?S.monsterCompanions.map(n=>`<div class="monsterCard"><b class="${n==='黄金スライム'?'rar-phantom':''}">${n}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="small">HP ${baseFor(n).hp} / 攻撃 ${baseFor(n).atk} / 防御 ${baseFor(n).def}</div><div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`).join(''):'<p class="small">まだ仲間モンスターはいません。</p>'}</div>`);document.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,b.dataset.member))}document.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>partyView(b.dataset.pmode))}
function setMember(slot,name){if(S.partySlots.includes(name)){let other=S.partySlots.indexOf(name)+1;if(other!==slot)S.partySlots[other-1]=slot===1?'ミア':'トア'}S.partySlots[slot-1]=name;S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot);S.equipment[slot]={武器:"",防具:"",アクセサリー:""};toast(`${name}を${slot+1}人目に編成`);partyView("monsters");render()}
function stageView(){open("ステージ",`<div class="panel">${stages.map(st=>{let unlocked=st.unlock(S),active=S.stageId===st.id,clear=S.clears[st.id];let enemies=st.boss?(st.bossMonster||st.enemies[0]):st.enemies.join("・");return `<div class="row stageRow ${active?'active':''} ${!unlocked?'locked':''}" data-stage="${st.id}"><span><b>${st.boss?'👑 ':''}${st.name}</b><br><small>${st.area} / 推奨Lv${st.recommended}<br>${unlocked?`出現：${enemies}`:st.unlockText}</small></span><span>${active?'挑戦中':clear?'クリア済':unlocked?'選択':'🔒 未解放'}</span></div>`}).join('')}</div>`);document.querySelectorAll('[data-stage]').forEach(r=>r.onclick=()=>{let st=stages.find(x=>x.id===r.dataset.stage);if(!st.unlock(S))return toast(st.unlockText);S.stageId=st.id;S.battle=1;$("#overlay").classList.remove("open");spawn();toast(`${st.name}へ移動！`)})}
function bankMove(mode,amount){
 amount=Math.max(0,Math.floor(Number(amount)||0));
 if(mode==="deposit"){
   if(amount<=0)return toast("預ける金額を選んでください");
   amount=Math.min(amount,S.gold);if(amount<=0)return toast("手持ちGがありません");
   S.gold-=amount;S.bank+=amount;toast(`${amount}Gを預けた`);
 }else{
   if(amount<=0)return toast("引き出す金額を選んでください");
   amount=Math.min(amount,S.bank);if(amount<=0)return toast("預金がありません");
   S.bank-=amount;S.gold+=amount;toast(`${amount}Gを引き出した`);
 }
 save();render();baseView();
}
function baseView(){
 const total=S.gold+S.bank;
 open("星降りの拠点",`<div class="baseHero"><div class="baseCastle">🏰</div><h2>星降りの拠点</h2><p class="small">冒険の準備と資産管理を行う安全地帯</p></div>
 <div class="panel"><div class="sectionTitle">🏦 モフルク銀行</div>
 <div class="bankSummary"><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div><div><span>預金</span><b class="rar-phantom">${S.bank.toLocaleString()}G</b></div><div><span>総資産</span><b>${total.toLocaleString()}G</b></div></div>
 <p class="small">全滅時に失うのは手持ちGの25%だけ。銀行預金は失いません。</p>
 <div class="bankActions"><button class="miniBtn" data-dep="100">100G預ける</button><button class="miniBtn" data-dep="1000">1,000G預ける</button><button class="miniBtn" data-dep="all">全額預ける</button><button class="miniBtn" data-wd="100">100G引出</button><button class="miniBtn" data-wd="1000">1,000G引出</button><button class="miniBtn" data-wd="all">全額引出</button></div></div>
 <div class="panel"><div class="sectionTitle">拠点施設</div><div class="baseFacilities"><button class="facility" data-fac="shop"><b>🏪</b><span>ショップ<small>装備を購入</small></span></button><button class="facility" data-fac="party"><b>🐾</b><span>仲間管理<small>編成・装備</small></span></button><button class="facility" data-fac="items"><b>🎒</b><span>倉庫<small>持ち物確認</small></span></button><button class="facility" data-fac="book"><b>📖</b><span>図鑑<small>討伐・DROP</small></span></button><button class="facility" data-fac="profile"><b>🪪</b><span>冒険者プロフィール<small>ID・中断データ</small></span></button><button class="facility" data-fac="saveguard"><b>💾</b><span>セーブ保護<small>救出・バックアップ</small></span></button></div></div>`);
 document.querySelectorAll('[data-dep]').forEach(b=>b.onclick=()=>bankMove('deposit',b.dataset.dep==='all'?S.gold:+b.dataset.dep));
 document.querySelectorAll('[data-wd]').forEach(b=>b.onclick=()=>bankMove('withdraw',b.dataset.wd==='all'?S.bank:+b.dataset.wd));
 document.querySelectorAll('[data-fac]').forEach(b=>b.onclick=()=>{let f=b.dataset.fac;if(f==='shop'){open('ショップ','');shopView('武器')}if(f==='party')partyView();if(f==='items')itemView();if(f==='book')bookView();if(f==='profile'){if(window.__profile741)window.__profile741.open();else toast('プロフィールを開けませんでした')}if(f==='saveguard')saveGuardView()});
}
function bookView(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];open("モンスター図鑑",`<div class="panel">${mons.map(n=>{let seen=!!S.seen[n],ds=n==="黄金スライム"?[specialItems["幻の金冠"]]:(drops[n]||[]);return `<div class="row"><span><b class="${n==="黄金スライム"?"rar-phantom":""}">${seen?n:"???"}</b><br><small>遭遇 ${seen?"済":"未発見"} / 討伐 ${S.kills[n]||0} / 仲間 ${S.monsterCompanions.includes(n)?"加入済":"-"}</small><div class="bookDrop">DROP：${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)}">${d.n} ×${S.dropFound[d.n]}</span>`:`<span class="unknown">??? (1/${d.r||"特殊"})</span>`).join(" / "):"???"}</div></span><span>${n==="黄金スライム"?"✨ 変異種":""}</span></div>`}).join("")}</div>`)}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{let p=b.dataset.page;if(p==="stage")stageView();if(p==="party")partyView();if(p==="base")baseView();if(p==="items")itemView();if(p==="book")bookView()});

/* ===== v0.40 COMPANION GROWTH SYSTEM ===== */
const COMPANION_SKILLS={
 "スライム":{name:"ぷるぷるアタック",lv:3,mult:1.35,rate:.34},
 "ゴブリン":{name:"奇襲斬り",lv:4,mult:1.45,rate:.32},
 "オオカミ":{name:"月牙",lv:5,mult:1.55,rate:.34},
 "キノコ":{name:"胞子弾",lv:4,mult:1.40,rate:.32},
 "森コウモリ":{name:"夜襲",lv:5,mult:1.50,rate:.36},
 "ホーンラビット":{name:"ホーンラッシュ",lv:4,mult:1.48,rate:.34},
 "ポイズンビー":{name:"毒針",lv:5,mult:1.52,rate:.35},
 "モリキノコ":{name:"森の胞子",lv:5,mult:1.46,rate:.34},
 "リーフフェアリー":{name:"リーフストーム",lv:6,mult:1.62,rate:.36},
 "シャドウバット":{name:"影牙",lv:6,mult:1.60,rate:.38},
 "黄金スライム":{name:"黄金のきらめき",lv:1,mult:1.75,rate:.42}
};
const isCompanion=n=>S.monsterCompanions.includes(n);
function compNeed(lv){return 55+lv*35+lv*lv*12}
function ensureGrowth(n){S.monsterGrowth=S.monsterGrowth||{};if(!S.monsterGrowth[n])S.monsterGrowth[n]={lv:1,exp:0};return S.monsterGrowth[n]}
function compLv(n){return ensureGrowth(n).lv}
function companionBase(n){let b=BASE_MEMBERS[n]||{hp:60,mp:15,atk:11,def:6,role:"仲間"};if(!isCompanion(n))return b;let lv=compLv(n),k=lv-1;return {...b,hp:b.hp+k*5,mp:b.mp+k*2,atk:b.atk+k*2,def:b.def+k,role:b.role||"仲間モンスター"}}
baseFor=function(name){return isCompanion(name)?companionBase(name):(BASE_MEMBERS[name]||{hp:60,mp:15,atk:11,def:6,role:"仲間"})};
maxHp=function(i){let n=partyNames()[i],b=baseFor(n);return isCompanion(n)?b.hp:b.hp+(S.lv-1)*(i===0?6:4)};
maxMp=function(i){let n=partyNames()[i],b=baseFor(n);return isCompanion(n)?b.mp:b.mp+(S.lv-1)*(i===1?3:2)};
statsFor=function(i){const n=partyNames()[i],b=baseFor(n),eq=S.equipment[i]||{};let its=Object.values(eq).filter(Boolean).map(item),heroScale=isCompanion(n)?0:(S.lv-1);return{atk:b.atk+heroScale*(i===0?3:2)+its.reduce((a,x)=>a+(x.atk||0),0),def:b.def+heroScale*(i===0?2:1)+its.reduce((a,x)=>a+(x.def||0),0),crit:5+its.reduce((a,x)=>a+(x.crit||0),0)}};
function addMonsterExp(xp){
 let active=[...new Set(S.partySlots.filter(isCompanion))];
 active.forEach(n=>{let g=ensureGrowth(n),gain=Math.max(1,Math.floor(xp*.8));g.exp+=gain;let leveled=false;while(g.exp>=compNeed(g.lv)){g.exp-=compNeed(g.lv);g.lv++;leveled=true}if(leveled){let slot=partyNames().indexOf(n);if(slot>0){S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot)}toast(`${n}がLv.${g.lv}に成長！`)}});save();
}
companionActions=function(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1,skill=null;if(name==='ミア'&&S.mp[i]>=2&&Math.random()<.45){S.mp[i]-=2;mult=1.35;skill='ミアの魔法弾'}else if(name==='トア'&&Math.random()<.3){mult=1.25;skill='トアのかみつき'}else if(isCompanion(name)){let sk=COMPANION_SKILLS[name];if(sk&&compLv(name)>=sk.lv&&Math.random()<sk.rate){mult=sk.mult;skill=`${name}の${sk.name}`}}if(skill)showLog(`${skill}！`);let crit=Math.random()<st.crit/100,d=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1));hit(idx,d,crit)}};
rollRecruit=function(e){
 if(e.golden||e.boss||!e.base)return;const cfg=MONSTERS[e.base];if(!cfg||!cfg.recruit||S.monsterCompanions.includes(e.name))return;
 if(Math.random()<1/cfg.recruit){S.monsterCompanions.push(e.name);ensureGrowth(e.name);save();stopAuto(`${e.name}が仲間になった`);setTimeout(()=>showFx(`<h1 class="recruitFlash">NEW COMPANION!</h1><div class="dropItem">${e.name}が仲間になった！</div><p class="small">Lv.1から育成開始 / パーティ → 仲間モンスターから編成できます</p>`),180)}
};
// v0.39以前の仲間データを自動移行
S.monsterGrowth=S.monsterGrowth||{};S.monsterCompanions.forEach(ensureGrowth);if(S.goldenJoined&&S.monsterCompanions.includes("黄金スライム"))ensureGrowth("黄金スライム");
partyView=function(mode="members"){
 if(mode==="members"){
  open("パーティ",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel">${partyNames().map((n,i)=>{let st=statsFor(i),eq=S.equipment[i],lv=isCompanion(n)?`Lv.${compLv(n)}`:`Lv.${S.lv}`;return `<div class="charEquip"><h3>${n} <span class="small">${lv} / ${baseFor(n).role}</span></h3><div class="small">HP ${S.hp[i]}/${maxHp(i)}　MP ${S.mp[i]}/${maxMp(i)}　攻撃 ${st.atk}　防御 ${st.def}</div><div class="row"><span>武器</span><b>${eq.武器||'なし'}</b></div><div class="row"><span>防具</span><b>${eq.防具||'なし'}</b></div><div class="row"><span>アクセサリー</span><b>${eq.アクセサリー||'なし'}</b></div></div>`}).join('')}</div>`)
 }else{
  open("仲間モンスター",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel"><div class="sectionTitle">通常メンバー</div>${["ミア","トア"].map(n=>`<div class="monsterCard"><b>${n}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`).join('')}<div class="sectionTitle">仲間モンスター</div>${S.monsterCompanions.length?S.monsterCompanions.map(n=>{let g=ensureGrowth(n),b=baseFor(n),sk=COMPANION_SKILLS[n],pct=Math.min(100,g.exp/compNeed(g.lv)*100);return `<div class="monsterCard"><b class="${n==='黄金スライム'?'rar-phantom':''}">${n}</b> <b>Lv.${g.lv}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="small">HP ${b.hp} / MP ${b.mp} / 攻撃 ${b.atk} / 防御 ${b.def}</div><div class="small">EXP ${g.exp}/${compNeed(g.lv)}</div><div class="bar expbar"><i style="width:${pct}%"></i></div><div class="small">固有スキル：${sk?(g.lv>=sk.lv?sk.name:`Lv.${sk.lv}で ${sk.name} 解放`):'なし'}</div><div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`}).join(''):'<p class="small">まだ仲間モンスターはいません。</p>'}</div>`);document.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,b.dataset.member))
 }
 document.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>partyView(b.dataset.pmode));
};
/* ===== /v0.40 ===== */

/* ===== v0.42 COMPANION DEEP GROWTH ===== */
const COMPANION_TRAITS={
 "スライム":{name:"やわらかボディ",desc:"防御+8%",def:.08},
 "ゴブリン":{name:"略奪者の勘",desc:"攻撃+8%",atk:.08},
 "オオカミ":{name:"群れの本能",desc:"会心+5%",crit:5},
 "キノコ":{name:"森の胞子",desc:"HP+10%",hp:.10},
 "森コウモリ":{name:"夜目",desc:"会心+6%",crit:6},
 "ホーンラビット":{name:"突進本能",desc:"攻撃+10%",atk:.10},
 "ポイズンビー":{name:"毒針本能",desc:"会心+7%",crit:7},
 "モリキノコ":{name:"森の生命力",desc:"HP+12%",hp:.12},
 "リーフフェアリー":{name:"精霊の加護",desc:"攻撃・防御+6%",atk:.06,def:.06},
 "シャドウバット":{name:"影潜み",desc:"攻撃+7%・会心+5%",atk:.07,crit:5},
 "黄金スライム":{name:"黄金の祝福",desc:"HP・攻撃・防御+10% / 会心+5%",hp:.10,atk:.10,def:.10,crit:5}
};
const COMPANION_GROWTH_STYLE={
 "スライム":{hp:6,mp:2,atk:2,def:2},"ゴブリン":{hp:5,mp:1,atk:3,def:2},"オオカミ":{hp:5,mp:1,atk:3,def:1},
 "キノコ":{hp:7,mp:2,atk:2,def:2},"森コウモリ":{hp:4,mp:2,atk:3,def:1},"ホーンラビット":{hp:5,mp:1,atk:3,def:1},
 "ポイズンビー":{hp:4,mp:2,atk:3,def:1},"モリキノコ":{hp:7,mp:2,atk:2,def:2},"リーフフェアリー":{hp:5,mp:3,atk:3,def:2},
 "シャドウバット":{hp:4,mp:2,atk:4,def:1},"黄金スライム":{hp:8,mp:3,atk:4,def:3}
};
function bondRank(n){let g=ensureGrowth(n),b=g.bond||0;return b>=300?"MAX":b>=160?"A":b>=80?"B":b>=30?"C":"D"}
function skillTier(n){let l=compLv(n);return l>=20?3:l>=10?2:1}
function skillPower(n){let sk=COMPANION_SKILLS[n],t=skillTier(n);return sk?sk.mult+(t-1)*.18:1}
function ensureGrowth42(n){let g=ensureGrowth(n);if(!Number.isFinite(g.bond))g.bond=0;if(!Number.isFinite(g.battles))g.battles=0;return g}
S.monsterCompanions.forEach(ensureGrowth42);
companionBase=function(n){let b=BASE_MEMBERS[n]||{hp:60,mp:15,atk:11,def:6,role:"仲間"};if(!isCompanion(n))return b;let lv=compLv(n),k=lv-1,gr=COMPANION_GROWTH_STYLE[n]||{hp:5,mp:2,atk:2,def:1},tr=COMPANION_TRAITS[n]||{},g=ensureGrowth42(n),bondBoost=Math.min(.10,(g.bond||0)/3000);return {...b,hp:Math.floor((b.hp+k*gr.hp)*(1+(tr.hp||0)+bondBoost)),mp:b.mp+k*gr.mp,atk:Math.floor((b.atk+k*gr.atk)*(1+(tr.atk||0)+bondBoost)),def:Math.floor((b.def+k*gr.def)*(1+(tr.def||0)+bondBoost)),role:"仲間モンスター"}}
statsFor=function(i){const n=partyNames()[i],b=baseFor(n),eq=S.equipment[i]||{},its=Object.values(eq).filter(Boolean).map(item),heroScale=isCompanion(n)?0:(S.lv-1),tr=isCompanion(n)?(COMPANION_TRAITS[n]||{}):{};return{atk:b.atk+heroScale*(i===0?3:2)+its.reduce((a,x)=>a+(x.atk||0),0),def:b.def+heroScale*(i===0?2:1)+its.reduce((a,x)=>a+(x.def||0),0),crit:5+(tr.crit||0)+its.reduce((a,x)=>a+(x.crit||0),0)}};
addMonsterExp=function(xp){let active=[...new Set(S.partySlots.filter(isCompanion))];active.forEach(n=>{let g=ensureGrowth42(n),gain=Math.max(1,Math.floor(xp*.8));g.exp+=gain;g.battles++;g.bond=Math.min(300,(g.bond||0)+2);let old=g.lv;while(g.exp>=compNeed(g.lv)){g.exp-=compNeed(g.lv);g.lv++}if(g.lv>old){let slot=partyNames().indexOf(n);if(slot>0){S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot)}let unlocked=[];if(old<10&&g.lv>=10)unlocked.push("固有スキルⅡ");if(old<20&&g.lv>=20)unlocked.push("固有スキルⅢ");toast(`${n} Lv.${g.lv}${unlocked.length?' / '+unlocked.join('・')+'解放！':'に成長！'}`)}});save()};
companionActions=function(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1,skill=null;if(name==='ミア'&&S.mp[i]>=2&&Math.random()<.45){S.mp[i]-=2;mult=1.35;skill='ミアの魔法弾'}else if(name==='トア'&&Math.random()<.3){mult=1.25;skill='トアのかみつき'}else if(isCompanion(name)){let sk=COMPANION_SKILLS[name],g=ensureGrowth42(name),bondBonus=Math.min(.08,g.bond/3750);if(sk&&compLv(name)>=sk.lv&&Math.random()<sk.rate+bondBonus){mult=skillPower(name);skill=`${name}の${sk.name}${skillTier(name)>1?' '+['','Ⅱ','Ⅲ'][skillTier(name)-1]:''}`}}if(skill)showLog(`${skill}！`);let crit=Math.random()<st.crit/100,d=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1));hit(idx,d,crit)}};
partyView=function(mode="members"){
 if(mode==="members"){
  open("パーティ",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel">${partyNames().map((n,i)=>{let st=statsFor(i),eq=S.equipment[i],lv=isCompanion(n)?`Lv.${compLv(n)}`:`Lv.${S.lv}`;return `<div class="charEquip"><h3>${n} <span class="small">${lv} / ${baseFor(n).role}</span></h3><div class="small">HP ${S.hp[i]}/${maxHp(i)}　MP ${S.mp[i]}/${maxMp(i)}　攻撃 ${st.atk}　防御 ${st.def}　会心 ${st.crit}%</div><div class="row"><span>武器</span><b>${eq.武器||'なし'}</b></div><div class="row"><span>防具</span><b>${eq.防具||'なし'}</b></div><div class="row"><span>アクセサリー</span><b>${eq.アクセサリー||'なし'}</b></div></div>`}).join('')}</div>`)
 }else{
  open("仲間モンスター",`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="panel"><div class="sectionTitle">通常メンバー</div>${["ミア","トア"].map(n=>`<div class="monsterCard"><b>${n}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`).join('')}<div class="sectionTitle">仲間モンスター</div>${S.monsterCompanions.length?S.monsterCompanions.map(n=>{let g=ensureGrowth42(n),b=baseFor(n),st=COMPANION_SKILLS[n],tr=COMPANION_TRAITS[n]||{name:'-',desc:'-'},pct=Math.min(100,g.exp/compNeed(g.lv)*100),tier=skillTier(n);return `<div class="monsterCard"><b class="${n==='黄金スライム'?'rar-phantom':''}">${n}</b> <b>Lv.${g.lv}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="small">HP ${b.hp} / MP ${b.mp} / 攻撃 ${b.atk} / 防御 ${b.def}</div><div class="small">EXP ${g.exp}/${compNeed(g.lv)}　戦闘 ${g.battles||0}回　絆 ${bondRank(n)} (${g.bond||0}/300)</div><div class="bar expbar"><i style="width:${pct}%"></i></div><div class="small">特性：<b>${tr.name}</b> — ${tr.desc}</div><div class="small">固有：${st?(g.lv>=st.lv?`${st.name}${tier>1?' '+['','Ⅱ','Ⅲ'][tier-1]:''}（Lv10/20で強化）`:`Lv.${st.lv}で ${st.name} 解放`):'なし'}</div><div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`}).join(''):'<p class="small">まだ仲間モンスターはいません。</p>'}</div>`);document.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,b.dataset.member))
 }
 document.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>partyView(b.dataset.pmode));
};
bookView=function(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];open("モンスター図鑑",`<div class="panel">${mons.map(n=>{let seen=!!S.seen[n],joined=S.monsterCompanions.includes(n),ds=n==="黄金スライム"?[specialItems["幻の金冠"]]:(drops[n]||[]),growth=joined?ensureGrowth42(n):null;return `<div class="row"><span><b class="${n==="黄金スライム"?"rar-phantom":""}">${seen?n:"???"}</b><br><small>遭遇 ${seen?"済":"未発見"} / 討伐 ${S.kills[n]||0} / 仲間 ${joined?`Lv.${growth.lv}・絆${bondRank(n)}`:"-"}</small><div class="bookDrop">DROP：${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)}">${d.n} ×${S.dropFound[d.n]}</span>`:`<span class="unknown">??? (1/${d.r||"特殊"})</span>`).join(" / "):"???"}</div></span><span>${n==="黄金スライム"?"✨ 変異種":""}</span></div>`}).join("")}</div>`)};
/* ===== /v0.42 ===== */


/* ===== v0.43 DROP HUNTER / EQUIPMENT HUNT ===== */
S.gearQuality=S.gearQuality||{};
S.gearBest=S.gearBest||{};
const _item43=item;
function rawItem43(n){return shop.find(x=>x.n===n)||Object.values(drops).flat().find(x=>x.n===n)||specialItems[n]||{n,type:"素材",atk:0,def:0,crit:0,rar:"NORMAL",desc:"アイテム"}}
function isGear43(x){return x&&["武器","防具","アクセサリー"].includes(x.type)}
function qualityName43(q){return q>=1.15?"極上":q>=1.10?"秀逸":q>=1.05?"良品":q>=.98?"標準":"粗品"}
function qualityClass43(q){return q>=1.15?"rar-phantom":q>=1.10?"rar-epic":q>=1.05?"rar-rare":""}
function rollQuality43(rar){let min=.94,max=1.08;if(rar==="RARE"){min=.97;max=1.11}else if(rar==="EPIC"){min=1.00;max=1.14}else if(rar==="PHANTOM"){min=1.04;max=1.18}return Math.round((min+Math.random()*(max-min))*100)/100}
item=function(n){let x={...rawItem43(n)},q=S.gearQuality[n]||1;if(isGear43(x)){x.baseAtk=x.atk||0;x.baseDef=x.def||0;x.baseCrit=x.crit||0;x.atk=Math.round((x.atk||0)*q);x.def=Math.round((x.def||0)*q);x.crit=Math.round((x.crit||0)*q);x.quality=q}return x};
function registerGearRoll43(d){if(!isGear43(d))return null;let q=rollQuality43(d.rar),old=S.gearQuality[d.n]||0;if(q>old){S.gearQuality[d.n]=q;S.gearBest[d.n]=(S.gearBest[d.n]||0)+1;return{q,upgrade:true}}return{q,upgrade:false}}
const _rollDrops43=rollDrops;
rollDrops=function(e){
 if(e.golden)return _rollDrops43(e);
 for(let d of(drops[e.base]||[])){
  let hasLuck=S.equipment.some(eq=>eq.アクセサリー==="幸運のお守り"),bonus=hasLuck?1.35:1;
  if(Math.random()<bonus/d.r){
   let qr=registerGearRoll43(d);addOwned(d.n);S.dropFound[d.n]=(S.dropFound[d.n]||0)+1;
   if(d.rar!=="NORMAL")S.locks[d.n]=true;
   if(d.rar==="EPIC"||d.rar==="PHANTOM")stopAuto(`${d.rar}ドロップ`);
   save();
   if(d.rar!=="NORMAL")setTimeout(()=>showDrop43(d,qr,e),350);else if(qr)setTimeout(()=>toast(`${d.n} [${qualityName43(qr.q)} ${Math.round(qr.q*100)}%]${qr.upgrade?' BEST更新！':''}`),120);else toast(`${d.n}を手に入れた！`)
  }
 }
};
function showDrop43(d,qr,e){let boss=e&&e.boss?'<div class="bossDrop43">BOSS LIMITED</div>':'';let q=qr?`<p class="${qualityClass43(qr.q)}">品質 ${qualityName43(qr.q)}・${Math.round(qr.q*100)}% ${qr.upgrade?'★ BEST更新':''}</p>`:'';showFx(`${boss}<h1 class="dropTitle">${d.rar} DROP!</h1><div class="dropItem ${rarityClass(d.rar)}">${d.n}</div>${q}<p class="small">${e?e.name+' 専用ドロップ / ':''}レア品は自動ロック済み</p>`,d.rar==="PHANTOM"?"phantom":d.rar==="EPIC"?"rare":"")}
function dropSource43(n){for(const [m,arr] of Object.entries(drops))if(arr.some(d=>d.n===n))return m;return n==="幻の金冠"?"黄金スライム":""}
const _itemRow43=itemRow;
itemRow=function(n){let x=item(n),type=categoryOf(n),locked=!!S.locks[n],cnt=countOwned(n),equipped=S.equipment.some(eq=>Object.values(eq).includes(n)),src=dropSource43(n),q=S.gearQuality[n];return `<div class="row"><span><b class="${rarityClass(x.rar)}">${n}${cnt>1?` ×${cnt}`:''}</b> <span class="typeBadge">${type}</span>${q?` <span class="quality43 ${qualityClass43(q)}">${qualityName43(q)} ${Math.round(q*100)}%</span>`:''}<br><small>${x.desc||''}${q?`<br>実性能：攻撃+${x.atk||0} / 防御+${x.def||0} / 会心+${x.crit||0}%`:''}</small>${src?`<br><span class="sourceDrop">DROP：${src}</span>`:''}${compareText(x)}</span><span class="itemActions">${["武器","防具","アクセサリー"].includes(type)?`<button class="miniBtn" data-eq="${n}">${equipped?'付替':'装備'}</button>`:''}<button class="miniBtn ${locked?'lockedBtn':''}" data-lock="${n}">${locked?'🔒':'🔓'}</button><button class="miniBtn danger" data-trash="${n}" ${equipped||locked?'disabled':''}>捨てる</button></span></div>`};
const _itemView43=itemView;
itemView=function(tab=itemTab){_itemView43(tab);document.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>chooseEquip(b.dataset.eq));document.querySelectorAll('[data-lock]').forEach(b=>b.onclick=()=>{let n=b.dataset.lock;S.locks[n]=!S.locks[n];itemView(itemTab);save()});document.querySelectorAll('[data-trash]').forEach(b=>b.onclick=()=>discard(b.dataset.trash))};
bookView=function(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];open("モンスター図鑑",`<div class="panel">${mons.map(n=>{let seen=!!S.seen[n],joined=S.monsterCompanions.includes(n),ds=n==="黄金スライム"?[specialItems["幻の金冠"]]:(drops[n]||[]),growth=joined?ensureGrowth42(n):null;return `<div class="row"><span><b class="${n==="黄金スライム"?"rar-phantom":""}">${seen?n:"???"}</b><br><small>遭遇 ${seen?"済":"未発見"} / 討伐 ${S.kills[n]||0} / 仲間 ${joined?`Lv.${growth.lv}・絆${bondRank(n)}`:"-"}</small><div class="bookDrop">DROP：${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)}">${d.n} ×${S.dropFound[d.n]}${S.gearQuality[d.n]?` [BEST ${Math.round(S.gearQuality[d.n]*100)}%]`:''}</span>`:`<span class="unknown">??? (${d.rar||'NORMAL'}・1/${d.r||"特殊"})</span>`).join(" / "):"???"}</div></span><span>${n==="黄金スライム"?"✨ 変異種":MONSTERS[n]?.recruit===0?"👑 BOSS":""}</span></div>`}).join("")}</div>`)};
save();
/* ===== /v0.43 ===== */

/* ===== v0.45 INTEGRATED SHOP / INVENTORY / COMPANION FIELD ===== */
const SHOP45=[
{id:'silver45',n:'銀の剣',type:'武器',lv:9,g:1450,atk:16,def:0,crit:2,rar:'NORMAL',desc:'攻撃+16 / 会心+2%'},{id:'knight45',n:'騎士の剣',type:'武器',lv:13,g:2800,atk:22,def:2,crit:2,rar:'RARE',desc:'攻撃+22 / 防御+2'},{id:'wind45',n:'風切りの剣',type:'武器',lv:17,g:4600,atk:27,def:0,crit:5,rar:'RARE',desc:'攻撃+27 / 会心+5%'},{id:'mithril45',n:'ミスリルブレード',type:'武器',lv:21,g:7200,atk:34,def:3,crit:5,rar:'EPIC',desc:'攻撃+34 / 防御+3 / 会心+5%'},{id:'dragon45',n:'竜鋼の剣',type:'武器',lv:25,g:10800,atk:41,def:4,crit:7,rar:'EPIC',desc:'攻撃+41 / 防御+4 / 会心+7%'},
{id:'hunter45',n:'狩人の服',type:'防具',lv:6,g:720,atk:1,def:9,crit:1,rar:'NORMAL',desc:'攻撃+1 / 防御+9'},{id:'silverarmor45',n:'銀糸の鎧',type:'防具',lv:12,g:2300,atk:0,def:17,crit:1,rar:'RARE',desc:'防御+17 / 会心+1%'},{id:'forest45',n:'森護りの外套',type:'防具',lv:16,g:3900,atk:2,def:22,crit:2,rar:'RARE',desc:'攻撃+2 / 防御+22'},{id:'mithrilarmor45',n:'ミスリルメイル',type:'防具',lv:20,g:6500,atk:2,def:29,crit:2,rar:'EPIC',desc:'攻撃+2 / 防御+29'},{id:'dragonarmor45',n:'竜鱗の鎧',type:'防具',lv:25,g:9800,atk:4,def:36,crit:3,rar:'EPIC',desc:'攻撃+4 / 防御+36'},
{id:'power45',n:'力の指輪',type:'アクセサリー',lv:4,g:520,atk:4,def:0,crit:1,rar:'NORMAL',desc:'攻撃+4 / 会心+1%'},{id:'guard45',n:'守護のお守り',type:'アクセサリー',lv:9,g:1300,atk:0,def:6,crit:1,rar:'NORMAL',desc:'防御+6 / 会心+1%'},{id:'hawk45',n:'鷹眼の指輪',type:'アクセサリー',lv:14,g:2600,atk:3,def:1,crit:6,rar:'RARE',desc:'攻撃+3 / 会心+6%'},{id:'hero45',n:'勇気の紋章',type:'アクセサリー',lv:19,g:4900,atk:7,def:6,crit:4,rar:'EPIC',desc:'攻撃+7 / 防御+6 / 会心+4%'},{id:'star45',n:'星導のお守り',type:'アクセサリー',lv:24,g:8200,atk:10,def:8,crit:6,rar:'EPIC',desc:'攻撃+10 / 防御+8 / 会心+6%'}];
SHOP45.forEach(x=>{if(!shop.some(y=>y.n===x.n))shop.push(x)});
function equippedCount45(n){return S.equipment.reduce((a,eq)=>a+Object.values(eq||{}).filter(v=>v===n).length,0)}
equipTo=function(i,n){let x=item(n),type=x.type;if(!['武器','防具','アクセサリー'].includes(type))return;let already=(S.equipment[i]||{})[type]===n,used=equippedCount45(n)-(already?1:0),owned=countOwned(n);if(!already&&used>=owned)return toast(`所持数が足りません（${owned}個 / 装備中${used}個）`);S.equipment[i]=S.equipment[i]||{武器:'',防具:'',アクセサリー:''};S.equipment[i][type]=n;toast(`${partyNames()[i]}が${n}を装備`);save();render()};
buyEquip=function(id){let x=shop.find(a=>a.id===id);if(!x)return;if(S.gold<x.g)return toast('Gが足りない');S.gold-=x.g;S.owned.push(x.n);toast(`${x.n}を購入！ 所持${countOwned(x.n)}個`);shopView(shopTab);render()};
shopView=function(type){shopTab=type;let arr=shop.filter(x=>x.type===type);$('#obody').innerHTML=`<div class="shopHero45"><b>王都装備商</b><span>所持金 ${S.gold}G</span><small>同じ装備は複数購入して仲間ごとに装備できます</small></div><div class="tabs">${['武器','防具','アクセサリー'].map(t=>`<button class="tab ${t===type?'active':''}" data-tab="${t}">${t}</button>`).join('')}</div><div class="panel shopGrid45">${arr.map(x=>{let lock=S.lv<x.lv,c=countOwned(x.n);return `<div class="shopCard45 ${lock?'locked':''}"><div><b class="${rarityClass(x.rar)}">${lock?'🔒 ':''}${x.n}</b> ${c?`<span class="tag">所持${c}</span>`:''}<br><small>${x.desc}<br>Lv${x.lv}解放</small>${compareText(x)}</div><button class="buy" data-buy="${x.id}" ${lock?'disabled':''}>${x.g}G<br><small>購入</small></button></div>`}).join('')}</div>`;document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>shopView(b.dataset.tab));document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyEquip(b.dataset.buy))};
setMember=function(slot,name){if(S.partySlots.includes(name)){let other=S.partySlots.indexOf(name)+1;if(other!==slot)S.partySlots[other-1]=slot===1?'ミア':'トア'}S.partySlots[slot-1]=name;S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot);S.equipment[slot]=S.equipment[slot]||{武器:'',防具:'',アクセサリー:''};toast(`${name}を${slot+1}人目に編成`);save();partyView('monsters');render()};
// 仲間モンスターを人間より尖った性能に。既存特性に追加の戦闘補正を付与
const _companionBase45=companionBase;
companionBase=function(n){let b=_companionBase45(n);if(!isCompanion(n))return b;let bonus=n==='黄金スライム'?1.18:1.10;return {...b,hp:Math.floor(b.hp*bonus),atk:Math.floor(b.atk*bonus),def:Math.floor(b.def*bonus),role:'仲間モンスター★'}};
// 戦闘画面：編成した仲間モンスターを実際のモンスター姿で表示
function companionIcon45(n){let key=n==='黄金スライム'?'黄金スライム':n,cfg=MONSTERS[key]||MONSTERS[n];return cfg?svgMonster(cfg.icon,n==='黄金スライム'):''}
function renderCompanionField45(){let old=document.getElementById('companionField45');if(old)old.remove();let slots=partyNames();if(!slots.slice(1).some(isCompanion))return;let d=document.createElement('div');d.id='companionField45';d.innerHTML=[1,2].map(i=>isCompanion(slots[i])?`<div class="fieldComp45 slot${i}"><div class="fieldArt45">${companionIcon45(slots[i])}</div><b>${slots[i]}</b><small>${COMPANION_TRAITS[slots[i]]?.name||'固有特性'}</small></div>`:'').join('');document.getElementById('battle').appendChild(d)}
const _render45=render;render=function(){_render45();renderCompanionField45()};
// 図鑑をカード化し、仲間特性とドロップを一画面で確認
bookView=function(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];open('モンスター図鑑',`<div class="bookHead45"><b>MONSTER BOOK</b><small>遭遇・仲間・ドロップ収集記録</small></div><div class="bookGrid45">${mons.map(n=>{let seen=!!S.seen[n],joined=S.monsterCompanions.includes(n),ds=n==='黄金スライム'?[specialItems['幻の金冠']]:(drops[n]||[]),g=joined?ensureGrowth42(n):null,tr=COMPANION_TRAITS[n];return `<div class="bookCard45 ${seen?'':'unknownCard45'}"><h3 class="${n==='黄金スライム'?'rar-phantom':''}">${seen?n:'???'}</h3><small>討伐 ${S.kills[n]||0}${joined?`　仲間 Lv.${g.lv} / 絆${bondRank(n)}`:''}</small>${joined&&tr?`<div class="trait45">特性：${tr.name} — ${tr.desc}</div>`:''}<div class="bookDrop">${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)}">✓ ${d.n}</span>`:`<span class="unknown">??? ${d.rar||'NORMAL'} 1/${d.r||'特殊'}</span>`).join('<br>'):'DROP：???'}</div></div>`}).join('')}</div>`)};
/* ===== /v0.45 ===== */


/* ===== v0.46 BATTLE EFFECTS ===== */
function fxLayer46(){let b=document.getElementById('battle'),l=b.querySelector('.battleFx46');if(!l){l=document.createElement('div');l.className='battleFx46';b.appendChild(l)}return l}
function fx46(cls,x,y,life=650){let d=document.createElement('div');d.className=cls;d.style.left=x+'%';d.style.top=y+'%';fxLayer46().appendChild(d);setTimeout(()=>d.remove(),life);return d}
function shake46(strong=false){let b=document.getElementById('battle');b.classList.remove('shake46');void b.offsetWidth;b.classList.add('shake46');if(strong)b.classList.add('flash46');setTimeout(()=>{b.classList.remove('shake46','flash46')},260)}
function enemyPos46(i){return {x:10+i*31,y:25}}
function partyPos46(i){return {x:12+i*31,y:65}}
function slashFx46(i,crit=false){let p=enemyPos46(i);fx46('slash46',p.x,p.y,420);if(crit){fx46('critFx46',p.x+3,p.y-4,620);shake46(true)}}
function magicFx46(i){let p=enemyPos46(i);fx46('magic46',p.x+5,p.y-2,600)}
function healFx46(i){let p=partyPos46(i);fx46('healFx46',p.x+4,p.y-4,720)}
function guardFx46(i=0){let p=partyPos46(i);fx46('guardFx46',p.x+5,p.y-7,620)}
function specialBurst46(){let d=document.createElement('div');d.className='specialBurst46';document.getElementById('battle').appendChild(d);setTimeout(()=>d.remove(),1100)}
const _showLog46=showLog;showLog=function(t,ms=800){_showLog46(t,ms);if(/魔法|アイス|火炎|風刃|きらめき|妖精|胞子|毒/.test(t)){let i=E.findIndex(e=>e.hp>0);if(i>=0)magicFx46(i)}if(/ヒール|回復/.test(t)){let i=partyNames().findIndex(n=>t.includes(n));healFx46(i<0?0:i)}if(/防御/.test(t))guardFx46(0);if(/強攻撃/.test(t))shake46(true)};
const _hit46=hit;hit=function(i,d,crit=false){let was=E[i]&&E[i].hp>0;_hit46(i,d,crit);if(!was)return;slashFx46(i,crit);let p=enemyPos46(i);fx46('hitFx46',p.x+7,p.y+3,420);if(E[i]&&E[i].hp<=0){let el=document.querySelector(`.enemy[data-i="${i}"]`);if(el){el.classList.add('defeat46');setTimeout(()=>el.classList.remove('defeat46'),520)}}};
const _partyDamage46=partyDamage;partyDamage=function(i,d){_partyDamage46(i,d);let p=partyPos46(i);fx46('hitFx46',p.x+7,p.y+2,420);shake46(d>20)};
const _spawn46=spawn;spawn=function(){_spawn46();if(stage().boss){let a=document.createElement('div');a.className='bossAura46';document.getElementById('battle').appendChild(a);setTimeout(()=>a.remove(),1200);setTimeout(()=>showLog(`⚠ BOSS ${E[0]?.name||''} 出現！`,1100),80)}};
const _showDrop4346=showDrop43;showDrop43=function(d,qr,e){if(d.rar==='EPIC'||d.rar==='PHANTOM')specialBurst46();_showDrop4346(d,qr,e)};
const _showFx46=showFx;showFx=function(h,kind=''){if(/PHANTOM|ボス撃破|LEVEL UP|FIRST DEFEAT|NEW COMPANION/.test(h))specialBurst46();_showFx46(h,kind)};
// Reset attack handler so the main attack gets a crisp sword cue without slowing AUTO.
attack=function(){if(S.hp[0]<=0)return toast('キーボは戦闘不能');let st=statsFor(0),crit=Math.random()<st.crit/100,d=Math.floor(st.atk*(.85+Math.random()*.3)*(crit?1.8:1));showLog('キーボの攻撃！');hit(target,d,crit);endTurn()};
document.getElementById('attack').onclick=attack;
const _useSkill46=useSkill;useSkill=function(n){if(n==='ヒール'){return _useSkill46(n)}let i=target;if(/アイス|火炎|風刃|奥義/.test(n))magicFx46(i);if(/奥義/.test(n)){specialBurst46();shake46(true)}return _useSkill46(n)};
/* ===== /v0.46 ===== */



/* ===== v0.49 PARTY VISUAL / STAGE STATUS / BOSS REBALANCE ===== */
const style49=document.createElement('style');style49.id='v049fixes';style49.textContent=`
.partyHuman49{pointer-events:none!important;z-index:6!important}
.partyHumanSlot49{position:absolute!important;bottom:0!important;height:48%!important;width:33.333%!important;background-size:300% 100%!important;background-repeat:no-repeat!important;clip-path:none!important;-webkit-clip-path:none!important}
.partyHumanSlot49.slot0{left:0!important}.partyHumanSlot49.slot1{left:33.333%!important}.partyHumanSlot49.slot2{left:66.666%!important}
#companionField45{z-index:8!important}
.fieldComp45{overflow:visible!important}
.fieldComp45 .fieldArt45{background:none!important}
.fieldComp45 .monsterArt{width:118px!important;height:118px!important;object-fit:cover!important;border-radius:50%!important;clip-path:circle(46% at 50% 50%)!important;-webkit-clip-path:circle(46% at 50% 50%)!important;transform:scale(1.12)!important}
@media(max-width:430px){.fieldComp45 .monsterArt{width:100px!important;height:100px!important}}
.stageState49{min-width:68px;text-align:center;font-weight:900;line-height:1.35}
.stageState49 small{display:block;color:#8fb2cf;font-size:8px;font-weight:700}
.stageRow.active .stageState49{color:#ffe184}.stageRow .clear49{color:#9dffb1}
`;
document.head.appendChild(style49);

function renderPartyVisual49(){
 const battle=document.getElementById('battle'); if(!battle)return;
 battle.querySelectorAll('.partyHuman49').forEach(x=>x.remove());
 const original=[...battle.children].find(x=>x.classList&&x.classList.contains('partyArt')&&!x.classList.contains('partyHuman49'));
 if(!original)return;
 const P=partyNames(),hasMonster=P.slice(1).some(isCompanion);
 original.style.display=hasMonster?'none':'';
 if(!hasMonster)return;
 // The source human art is a 3-character composite. When a monster joins,
 // render only the occupied human thirds as independent slot windows.
 // This prevents Mia/Toa from remaining underneath a companion.
 P.forEach((n,i)=>{
   if(isCompanion(n))return;
   let d=document.createElement('div');
   d.className='partyHuman49 partyHumanSlot49 slot'+i;
   d.style.backgroundImage=getComputedStyle(original).backgroundImage;
   d.style.backgroundPosition=i===0?'left bottom':i===1?'center bottom':'right bottom';
   battle.appendChild(d);
 });
}
const _render49=render;render=function(){_render49();renderPartyVisual49()};

stageView=function(){open("ステージ",`<div class="panel">${stages.map(st=>{let unlocked=st.unlock(S),active=S.stageId===st.id,clear=!!S.clears[st.id];let enemies=st.boss?(st.bossMonster||st.enemies[0]):st.enemies.join("・");let state=!unlocked?'🔒 未解放':active?`選択中${clear?'<small class="clear49">✓ クリア済</small>':''}`:clear?'<span class="clear49">クリア済</span>':'挑戦する';return `<div class="row stageRow ${active?'active':''} ${!unlocked?'locked':''}" data-stage="${st.id}"><span><b>${st.boss?'👑 ':''}${st.name}</b><br><small>${st.area} / 推奨Lv${st.recommended}<br>${unlocked?`出現：${enemies}`:st.unlockText}</small></span><span class="stageState49">${state}</span></div>`}).join('')}</div>`);document.querySelectorAll('[data-stage]').forEach(r=>r.onclick=()=>{let st=stages.find(x=>x.id===r.dataset.stage);if(!st.unlock(S))return toast(st.unlockText);S.stageId=st.id;S.battle=1;document.getElementById('overlay').classList.remove('open');spawn();toast(`${st.name}へ移動！`)})};

// Bosses scale against the current party so an over-levelled party cannot erase them in one hit.
const _spawn49=spawn;spawn=function(){_spawn49();if(!stage().boss||!E[0])return;let b=E[0],partyPower=[0,1,2].reduce((a,i)=>a+Math.max(1,statsFor(i).atk),0);let targetHp=Math.max(Math.floor(b.max*2.8),Math.floor(partyPower*7.5));b.max=targetHp;b.hp=targetHp;b.atk=Math.floor(b.atk*1.35+S.lv*.45);b.phase=1;b.boss49=true;render();showLog(`👑 ${b.name}　HP ${b.max}　強敵！`,1050)};

const _enemyTurn49=enemyTurn;enemyTurn=function(){let b=E.find(e=>e.boss&&e.hp>0);if(!b)return _enemyTurn49();let ap=aliveParty();if(!ap.length)return wipe();let ratio=b.hp/b.max,phase=ratio<=.35?3:ratio<=.68?2:1;if(phase>b.phase){b.phase=phase;showLog(phase===2?`⚠ ${b.name}が怒り始めた！`:`🔥 ${b.name}が本気を出した！`,1000);specialBurst46&&specialBurst46()}
 let hitOne=(i,m)=>{let def=statsFor(i).def,d=Math.max(1,Math.floor(b.atk*m-def*.72));if(S.guard)d=Math.max(1,Math.floor(d*.35));partyDamage(i,d);return d};
 if(b.charge){let i=ap[Math.floor(Math.random()*ap.length)],d=hitOne(i,phase===3?2.05:1.75);b.charge=false;showLog(`${b.name}の必殺攻撃！ ${partyNames()[i]}に${d}ダメージ`)}
 else if(phase>=2&&Math.random()<(phase===3?.38:.25)){let total=0;aliveParty().forEach(i=>total+=hitOne(i,phase===3?.82:.68));showLog(`${b.name}の全体攻撃！ 合計${total}ダメージ`)}
 else if(Math.random()<.28){b.charge=true;showLog(`⚠ ${b.name}が強大な力を溜めている！`)}
 else {let i=ap[Math.floor(Math.random()*ap.length)],d=hitOne(i,phase===3?1.28:phase===2?1.12:1);showLog(`${b.name}の攻撃！ ${partyNames()[i]}に${d}ダメージ`)}
 S.guard=false;if(!aliveParty().length)wipe();render()};
/* ===== /v0.49 ===== */

ensureProfileShape741();ensureVitals();spawn();render();setTimeout(maybeBackupWarning741,350);

;

/* v0.49.2: keep the visual version label in sync with the deployed build. */
(function(){
 const logo=document.querySelector('.logo small'); if(logo) logo.textContent='v0.52';
 document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';
})();

;

(function(){
 const logo=document.querySelector('.logo small');if(logo)logo.textContent='v0.52';
 document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';
})();

;

(function(){const el=document.querySelector('.logo small');if(el)el.textContent='v0.52';document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';})();
// v0.50 content is appended without changing the v0.49.3 save key, preserving existing saves.
Object.assign(BASE_MEMBERS,{
 'スノーラビット':{hp:64,mp:18,atk:16,def:7,role:'氷獣'},
 'アイスウルフ':{hp:72,mp:18,atk:19,def:8,role:'氷獣'},
 'フロストスライム':{hp:82,mp:26,atk:15,def:12,role:'氷魔物'},
 'フロストフェアリー':{hp:62,mp:36,atk:20,def:7,role:'氷精霊'}
});
Object.assign(MONSTERS,{
 'スノーラビット':{icon:'hornrabbit',hp:58,atk:17,xp:42,recruit:360},
 'アイスウルフ':{icon:'moonwolf',hp:72,atk:20,xp:52,recruit:430},
 'フロストスライム':{icon:'slime',hp:88,atk:16,xp:48,recruit:390},
 'フロストフェアリー':{icon:'leaffairy',hp:64,atk:22,xp:58,recruit:520},
 '氷雪の女王・フロスティア':{icon:'moonwolf',hp:620,atk:34,xp:620,recruit:0}
});
Object.assign(drops,{
 'スノーラビット':[
  {n:'雪うさぎの毛',r:14,rar:'NORMAL',type:'素材',desc:'氷の雪原で採れる白い毛'},
  {n:'氷駆けの指輪',r:150,rar:'RARE',type:'アクセサリー',atk:4,def:4,crit:7,desc:'攻撃+4 / 防御+4 / 会心+7%'},
  {n:'白雪の角槍',r:760,rar:'EPIC',type:'武器',atk:34,def:2,crit:10,desc:'攻撃+34 / 防御+2 / 会心+10%'}],
 'アイスウルフ':[
  {n:'氷狼の牙',r:16,rar:'NORMAL',type:'素材',desc:'冷気を帯びた鋭い牙'},
  {n:'氷狼の外套',r:180,rar:'RARE',type:'防具',atk:3,def:23,crit:4,desc:'攻撃+3 / 防御+23 / 会心+4%'},
  {n:'蒼月の双牙',r:980,rar:'PHANTOM',type:'武器',atk:39,def:2,crit:13,desc:'攻撃+39 / 防御+2 / 会心+13%'}],
 'フロストスライム':[
  {n:'氷の核',r:15,rar:'NORMAL',type:'素材',desc:'透き通った冷たい魔力核'},
  {n:'氷晶の護符',r:190,rar:'RARE',type:'アクセサリー',atk:4,def:8,crit:4,desc:'攻撃+4 / 防御+8 / 会心+4%'},
  {n:'フロストロッド',r:720,rar:'EPIC',type:'武器',atk:35,def:5,crit:8,desc:'攻撃+35 / 防御+5 / 会心+8%'}],
 'フロストフェアリー':[
  {n:'妖精の霜',r:18,rar:'NORMAL',type:'素材',desc:'雪精霊が残すきらめく霜'},
  {n:'雪精霊の羽衣',r:220,rar:'RARE',type:'防具',atk:5,def:24,crit:5,desc:'攻撃+5 / 防御+24 / 会心+5%'},
  {n:'氷花の杖',r:840,rar:'EPIC',type:'武器',atk:37,def:4,crit:10,desc:'攻撃+37 / 防御+4 / 会心+10%'}],
 '氷雪の女王・フロスティア':[
  {n:'女王の氷冠片',r:7,rar:'RARE',type:'素材',desc:'氷雪の女王が残す王冠の欠片'},
  {n:'フロスティアのドレス',r:65,rar:'EPIC',type:'防具',atk:8,def:34,crit:7,desc:'攻撃+8 / 防御+34 / 会心+7%'},
  {n:'女王の氷冠',r:650,rar:'PHANTOM',type:'アクセサリー',atk:10,def:16,crit:12,desc:'攻撃+10 / 防御+16 / 会心+12%'},
  {n:'フロスティアロッド',r:1200,rar:'PHANTOM',type:'武器',atk:46,def:7,crit:14,desc:'攻撃+46 / 防御+7 / 会心+14%'}]
});
Object.assign(COMPANION_TRAITS,{
 'スノーラビット':{name:'雪上ステップ',desc:'攻撃+8%・会心+6%',atk:.08,crit:6},
 'アイスウルフ':{name:'氷狼の本能',desc:'攻撃+12%・会心+7%',atk:.12,crit:7},
 'フロストスライム':{name:'氷晶ボディ',desc:'HP+12%・防御+15%',hp:.12,def:.15},
 'フロストフェアリー':{name:'雪精霊の加護',desc:'攻撃・防御+9%・会心+4%',atk:.09,def:.09,crit:4}
});
Object.assign(COMPANION_GROWTH_STYLE,{
 'スノーラビット':{hp:5,mp:2,atk:4,def:1},'アイスウルフ':{hp:6,mp:2,atk:4,def:2},
 'フロストスライム':{hp:8,mp:3,atk:3,def:3},'フロストフェアリー':{hp:5,mp:4,atk:4,def:2}
});
Object.assign(COMPANION_SKILLS,{
 'スノーラビット':{name:'アイスステップ',lv:5,mult:1.62,rate:.36},
 'アイスウルフ':{name:'ブリザードファング',lv:6,mult:1.78,rate:.38},
 'フロストスライム':{name:'フロストバースト',lv:5,mult:1.66,rate:.35},
 'フロストフェアリー':{name:'スノーレイン',lv:6,mult:1.82,rate:.40}
});
// v0.50 stages are integrated directly into the canonical stages array above.
Object.keys(MONSTERS).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
function applyIceVisual50(){
 const app=document.querySelector('.app')||document.body,b=document.getElementById('battle');if(!b)return;
 const ice=stage().area==='氷の雪原';app.classList.toggle('iceArea50',ice);
 let snow=document.getElementById('snowField50');
 if(ice&&!snow){snow=document.createElement('div');snow.id='snowField50';b.prepend(snow)}
 if(!ice&&snow)snow.remove();
}
const _render50=render;render=function(){_render50();applyIceVisual50()};
const _stageView50=stageView;stageView=function(){_stageView50();let ov=document.getElementById('overlay');if(ov){ov.querySelectorAll('.row').forEach(r=>{if((r.textContent||'').includes('氷の雪原')){let b=r.querySelector('b');if(b&&!b.querySelector('.iceBadge50'))b.insertAdjacentHTML('beforeend',' <span class="iceBadge50">NEW</span>')}})}};
const logo50=document.querySelector('.logo small');if(logo50)logo50.textContent='v0.52';
document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';
save();render();

;

/* v0.51: boss-exclusive relics, real passive effects, and clearer hunt targets. */
(function(){
 const VERSION51='v0.51';
 const bossRelics51={
  '草原の大牙':[
   {n:'草原王の紋章',r:120,rar:'EPIC',type:'アクセサリー',atk:8,def:10,crit:5,effect51:{bossDamage:.10},effectText51:'ボスへの与ダメージ+10%',desc:'攻撃+8 / 防御+10 / 会心+5% / ボス特効+10%'},
   {n:'紅牙・天断',r:1100,rar:'PHANTOM',type:'武器',atk:42,def:3,crit:12,effect51:{bossDamage:.18,execute:.20},effectText51:'ボス特効+18% / HP35%以下の敵へ+20%',desc:'攻撃+42 / 防御+3 / 会心+12% / ボス特効 / 瀕死特効'}
  ],
  '森の主・月狼':[
   {n:'月蝕の指輪',r:150,rar:'EPIC',type:'アクセサリー',atk:9,def:8,crit:9,effect51:{critDamage:.18},effectText51:'会心ダメージ+18%',desc:'攻撃+9 / 防御+8 / 会心+9% / 会心威力+18%'},
   {n:'月神の牙',r:1400,rar:'PHANTOM',type:'武器',atk:45,def:4,crit:15,effect51:{lifeSteal:.08,bossDamage:.12},effectText51:'与ダメージの8%吸収 / ボス特効+12%',desc:'攻撃+45 / 防御+4 / 会心+15% / HP吸収 / ボス特効'}
  ],
  '氷雪の女王・フロスティア':[
   {n:'氷晶女王の心核',r:180,rar:'EPIC',type:'アクセサリー',atk:12,def:14,crit:10,effect51:{iceDamage:.15},effectText51:'氷の雪原で与ダメージ+15%',desc:'攻撃+12 / 防御+14 / 会心+10% / 雪原強化+15%'},
   {n:'絶氷杖・フロスティア',r:1800,rar:'PHANTOM',type:'武器',atk:52,def:9,crit:16,effect51:{iceDamage:.25,bossDamage:.15,lifeSteal:.06},effectText51:'雪原+25% / ボス特効+15% / 与ダメージ6%吸収',desc:'攻撃+52 / 防御+9 / 会心+16% / 雪原強化 / ボス特効 / HP吸収'}
  ]
 };
 for(const [boss,arr] of Object.entries(bossRelics51)){
   drops[boss]=drops[boss]||[];
   for(const it of arr)if(!drops[boss].some(x=>x.n===it.n))drops[boss].push(it);
 }
 function effects51(i){
   const eq=S.equipment[i]||{},out={bossDamage:0,execute:0,critDamage:0,lifeSteal:0,iceDamage:0,fireDamage:0};
   Object.values(eq).filter(Boolean).forEach(n=>{const x=rawItem43(n),e=x.effect51||{};for(const k in out)out[k]+=e[k]||0});return out;
 }
 function damage51(i,base,crit,targetEnemy){
   const ef=effects51(i);let m=1;
   if(targetEnemy?.boss)m+=ef.bossDamage;
   if(targetEnemy&&targetEnemy.hp/targetEnemy.max<=.35)m+=ef.execute;
   if(stage().area==='氷の雪原')m+=ef.iceDamage;if(stage().area==='灼熱の火山')m+=ef.fireDamage||0;
   if(crit)m+=ef.critDamage;
   return Math.max(1,Math.floor(base*m));
 }
 function drain51(i,d){const ef=effects51(i);if(!ef.lifeSteal||S.hp[i]<=0)return;const h=Math.max(1,Math.floor(d*ef.lifeSteal)),before=S.hp[i];S.hp[i]=Math.min(maxHp(i),S.hp[i]+h);if(S.hp[i]>before)floatText('+'+(S.hp[i]-before),18+i*31,72,'heal')}
 // Final player attack override: keeps v0.46 FX and adds relic passives.
 attack=function(){if(S.hp[0]<=0)return toast('キーボは戦闘不能');let st=statsFor(0),crit=Math.random()<st.crit/100,raw=Math.floor(st.atk*(.85+Math.random()*.3)*(crit?1.8:1)),e=E[target],d=damage51(0,raw,crit,e);showLog('キーボの攻撃！');hit(target,d,crit);drain51(0,d);endTurn()};
 const ab=document.getElementById('attack');if(ab)ab.onclick=attack;
 // Companion attacks receive the same equipment passives.
 companionActions=function(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1,skill=null;if(name==='ミア'&&S.mp[i]>=2&&Math.random()<.45){S.mp[i]-=2;mult=1.35;skill='ミアの魔法弾'}else if(name==='トア'&&Math.random()<.3){mult=1.25;skill='トアのかみつき'}else if(isCompanion(name)){let sk=COMPANION_SKILLS[name],g=ensureGrowth42(name),bondBonus=Math.min(.08,g.bond/3750);if(sk&&compLv(name)>=sk.lv&&Math.random()<sk.rate+bondBonus){mult=skillPower(name);skill=`${name}の${sk.name}${skillTier(name)>1?' '+['','Ⅱ','Ⅲ'][skillTier(name)-1]:''}`}}if(skill)showLog(`${skill}！`);let crit=Math.random()<st.crit/100,raw=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1)),d=damage51(i,raw,crit,E[idx]);hit(idx,d,crit);drain51(i,d)}};
 // Item rows expose the passive so a drop is meaningful before equipping it.
 const itemRowBefore51=itemRow;
 itemRow=function(n){let html=itemRowBefore51(n),x=rawItem43(n);if(x.effectText51)html=html.replace('</small>',`<span class="effect51">特殊効果：${x.effectText51}</span></small>`);return html};
 // Book: retain ??? until acquired and explicitly mark boss-exclusive relics.
 bookView=function(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];open('モンスター図鑑',`<div class="bookHead45"><b>MONSTER BOOK</b><small>遭遇・仲間・ドロップ収集記録</small></div><div class="hunt51"><b>RELIC HUNT</b><br><small>ボス固有EPIC / PHANTOMには特殊効果あり。未取得品は ??? で表示。</small></div><div class="bookGrid45">${mons.map(n=>{let seen=!!S.seen[n],joined=S.monsterCompanions.includes(n),ds=n==='黄金スライム'?[specialItems['幻の金冠']]:(drops[n]||[]),g=joined?ensureGrowth42(n):null,tr=COMPANION_TRAITS[n];return `<div class="bookCard45 ${seen?'':'unknownCard45'}"><h3 class="${n==='黄金スライム'?'rar-phantom':''}">${seen?n:'???'}</h3><small>討伐 ${S.kills[n]||0}${joined?`　仲間 Lv.${g.lv} / 絆${bondRank(n)}`:''}</small>${joined&&tr?`<div class="trait45">特性：${tr.name} — ${tr.desc}</div>`:''}<div class="bookDrop">${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)}">✓ ${d.n}${S.gearQuality[d.n]?` [BEST ${Math.round(S.gearQuality[d.n]*100)}%]`:''}</span>${d.effectText51?`<span class="effect51">${d.effectText51}</span>`:''}`:`<span class="unknown">??? ${d.rar||'NORMAL'} 1/${d.r||'特殊'}${d.effect51?' <span class="relic51">BOSS RELIC</span>':''}</span>`).join('<br>'):'DROP：???'}</div></div>`}).join('')}</div>`) };
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION51;
 document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';
 save();render();
})();

;

/* v0.52: companion growth expansion, rare individuals, bond ranks, synergies, detail UI. */
(function(){
 const VERSION52='v0.52';
 const RARE_RATE52=.03;
 const RARE_STAT52=.08;
 const BOND_BONUS52={D:0,C:.025,B:.05,A:.075,MAX:.12};
 const SYNERGY52=[
  {a:['スライム','フロストスライム','黄金スライム'],b:['スライム','フロストスライム','黄金スライム'],name:'ぷるぷる共鳴',atk:.05,def:.05,desc:'スライム系2体：攻撃・防御+5%'},
  {a:['オオカミ','アイスウルフ'],b:['オオカミ','アイスウルフ'],name:'双狼の狩り',atk:.10,crit:4,desc:'狼系2体：攻撃+10%・会心+4%'},
  {a:['リーフフェアリー','フロストフェアリー'],b:['リーフフェアリー','フロストフェアリー'],name:'精霊協奏',def:.10,crit:5,desc:'妖精系2体：防御+10%・会心+5%'},
  {a:['ホーンラビット','スノーラビット'],b:['ホーンラビット','スノーラビット'],name:'兎の疾走',atk:.07,crit:7,desc:'ラビット系2体：攻撃+7%・会心+7%'}
 ];
 function growth52(n){let g=ensureGrowth42(n);if(!g.variant52)g.variant52='NORMAL';if(!Number.isFinite(g.bond))g.bond=0;if(!Number.isFinite(g.battles))g.battles=0;return g}
 S.monsterCompanions.forEach(growth52);
 function rare52(n){return isCompanion(n)&&growth52(n).variant52==='RARE'}
 function bondBonus52(n){return BOND_BONUS52[bondRank(n)]||0}
 function synergy52(){let ms=S.partySlots.filter(isCompanion),out={atk:0,def:0,crit:0,names:[]};for(const x of SYNERGY52){let found=false;for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){let a=ms[i],b=ms[j];if((x.a.includes(a)&&x.b.includes(b))||(x.a.includes(b)&&x.b.includes(a)))found=true}if(found){out.atk+=x.atk||0;out.def+=x.def||0;out.crit+=x.crit||0;out.names.push(x.name)}}return out}
 const baseBefore52=companionBase;
 companionBase=function(n){let b=baseBefore52(n);if(!isCompanion(n))return b;let bb=bondBonus52(n),rv=rare52(n)?RARE_STAT52:0;return {...b,hp:Math.floor(b.hp*(1+bb+rv)),mp:Math.floor(b.mp*(1+rv*.5)),atk:Math.floor(b.atk*(1+bb+rv)),def:Math.floor(b.def*(1+bb+rv)),role:rare52(n)?'希少仲間モンスター★':'仲間モンスター★'}};
 baseFor=function(name){return isCompanion(name)?companionBase(name):(BASE_MEMBERS[name]||{hp:60,mp:15,atk:11,def:6,role:'仲間'})};
 const statsBefore52=statsFor;
 statsFor=function(i){let s=statsBefore52(i),n=partyNames()[i],syn=synergy52();if(isCompanion(n)){s.atk=Math.floor(s.atk*(1+syn.atk));s.def=Math.floor(s.def*(1+syn.def));s.crit+=syn.crit||0;if(rare52(n))s.crit+=3}return s};
 // Skill evolution: I -> II(Lv10) -> III(Lv20) -> 奥義(Lv30)
 skillTier=function(n){let l=compLv(n);return l>=30?4:l>=20?3:l>=10?2:1};
 skillPower=function(n){let sk=COMPANION_SKILLS[n],t=skillTier(n);return sk?sk.mult+(t-1)*.20:1};
 function tierName52(n){let t=skillTier(n);return t===4?'奥義':(['','Ⅰ','Ⅱ','Ⅲ'][t]||'Ⅰ')}
 function relicEffects52(i){const eq=S.equipment[i]||{},out={bossDamage:0,execute:0,critDamage:0,lifeSteal:0,iceDamage:0,fireDamage:0};Object.values(eq).filter(Boolean).forEach(n=>{let e=rawItem43(n).effect51||{};for(const k in out)out[k]+=e[k]||0});return out}
 function relicDamage52(i,base,crit,e){let ef=relicEffects52(i),m=1;if(e?.boss)m+=ef.bossDamage;if(e&&e.hp/e.max<=.35)m+=ef.execute;if(stage().area==='氷の雪原')m+=ef.iceDamage;if(stage().area==='灼熱の火山')m+=ef.fireDamage||0;if(crit)m+=ef.critDamage;return Math.max(1,Math.floor(base*m))}
 function relicDrain52(i,d){let ef=relicEffects52(i);if(!ef.lifeSteal||S.hp[i]<=0)return;let h=Math.max(1,Math.floor(d*ef.lifeSteal)),before=S.hp[i];S.hp[i]=Math.min(maxHp(i),S.hp[i]+h);if(S.hp[i]>before)floatText('+'+(S.hp[i]-before),18+i*31,72,'heal')}
 // Recruitment now has a genuine rare-individual roll. Existing companions remain valid NORMAL individuals.
 rollRecruit=function(e){
  if(e.golden||e.boss||!e.base)return;const cfg=MONSTERS[e.base];if(!cfg||!cfg.recruit||S.monsterCompanions.includes(e.name))return;
  if(Math.random()<1/cfg.recruit){S.monsterCompanions.push(e.name);let g=growth52(e.name),isRare=Math.random()<RARE_RATE52;g.variant52=isRare?'RARE':'NORMAL';save();stopAuto(`${e.name}が仲間になった`);setTimeout(()=>showFx(`<h1 class="recruitFlash">NEW COMPANION!</h1><div class="dropItem ${isRare?'rare52':''}">${isRare?'✦ 希少個体 ':' '}${e.name}が仲間になった！</div><p class="small">Lv.1から育成開始${isRare?' / 全能力+8%・会心+3%':''}</p>`),180)}
 };
 // Golden Slime is a unique special individual.
 if(S.monsterCompanions.includes('黄金スライム')){let g=growth52('黄金スライム');if(g.variant52==='NORMAL')g.variant52='SPECIAL'}
 // Expanded bond progression. Active companions gain bond every completed battle through the existing EXP hook.
 addMonsterExp=function(xp){let active=[...new Set(S.partySlots.filter(isCompanion))];active.forEach(n=>{let g=growth52(n),gain=Math.max(1,Math.floor(xp*.8));g.exp+=gain;g.battles++;g.bond=Math.min(300,(g.bond||0)+2);let old=g.lv;while(g.exp>=compNeed(g.lv)){g.exp-=compNeed(g.lv);g.lv++}if(g.lv>old){let slot=partyNames().indexOf(n);if(slot>0){S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot)}let unlocked=[];for(const lv of [10,20,30])if(old<lv&&g.lv>=lv)unlocked.push(lv===30?'奥義':'固有スキル'+(lv===10?'Ⅱ':'Ⅲ'));toast(`${n} Lv.${g.lv}${unlocked.length?' / '+unlocked.join('・')+'解放！':'に成長！'}`)}});save()};
 // Final companion action implementation: bond improves activation chance, Lv30 unlocks the ultimate tier.
 companionActions=function(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1,skill=null;if(name==='ミア'&&S.mp[i]>=2&&Math.random()<.45){S.mp[i]-=2;mult=1.35;skill='ミアの魔法弾'}else if(name==='トア'&&Math.random()<.3){mult=1.25;skill='トアのかみつき'}else if(isCompanion(name)){let sk=COMPANION_SKILLS[name],g=growth52(name),rank=bondRank(name),bondRate={D:0,C:.02,B:.04,A:.06,MAX:.10}[rank]||0;if(sk&&compLv(name)>=sk.lv&&Math.random()<Math.min(.72,sk.rate+bondRate)){mult=skillPower(name);skill=`${name}の${sk.name} ${tierName52(name)}`}}if(skill)showLog(`${skill}！`);let crit=Math.random()<st.crit/100,raw=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1)),d=relicDamage52(i,raw,crit,E[idx]);hit(idx,d,crit);relicDrain52(i,d)}};
 function monsterDetail52(n){let g=growth52(n),b=baseFor(n),slot=partyNames().indexOf(n),st=slot>=0?statsFor(slot):{atk:b.atk,def:b.def,crit:5+(COMPANION_TRAITS[n]?.crit||0)+(rare52(n)?3:0)},sk=COMPANION_SKILLS[n],tr=COMPANION_TRAITS[n]||{name:'-',desc:'-'},rank=bondRank(n),bb=Math.round(bondBonus52(n)*100),next=g.lv>=30?'奥義習得済':g.lv>=20?'Lv30で奥義':g.lv>=10?'Lv20でⅢ / Lv30で奥義':'Lv10でⅡ / Lv20でⅢ / Lv30で奥義';open('仲間詳細',`<div class="mon52Head"><b class="${rare52(n)?'rare52':''}">${rare52(n)?'✦ 希少個体 ':''}${n}</b><small>Lv.${g.lv} / ${tr.name}</small></div><div class="statGrid52"><div>HP<br><b>${b.hp}</b></div><div>MP<br><b>${b.mp}</b></div><div>攻撃<br><b>${st.atk}</b></div><div>防御<br><b>${st.def}</b></div></div><div class="panel"><div class="skill52">特性：<b>${tr.name}</b><br><small>${tr.desc}</small></div><div class="skill52">固有スキル：<b>${sk?sk.name+' '+tierName52(n):'なし'}</b><br><small>${sk?`発動率 ${Math.round(sk.rate*100)}% + 絆補正 / ${next}`:'-'}</small></div><div class="skill52">絆：<b>${rank}</b> (${g.bond}/300)<br><small>絆能力補正 +${bb}% / ランクが高いほど固有スキル発動率UP</small></div><div class="skill52">個体：<b>${rare52(n)?'希少個体':'通常個体'}</b><br><small>${rare52(n)?'HP・攻撃・防御+8% / 会心+3%':'標準能力'}</small></div><div class="small">戦闘参加 ${g.battles}回　EXP ${g.exp}/${compNeed(g.lv)}</div></div>`)}
 // Rich companion management + details + active synergy display.
 partyView=function(mode='members'){
  if(mode==='members'){
   let syn=synergy52();open('パーティ',`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div>${syn.names.length?`<div class="synergy52">編成効果：<b>${syn.names.join(' / ')}</b><br><small>仲間モンスターの組み合わせで能力上昇</small></div>`:''}<div class="panel">${partyNames().map((n,i)=>{let st=statsFor(i),eq=S.equipment[i],lv=isCompanion(n)?`Lv.${compLv(n)}`:`Lv.${S.lv}`;return `<div class="charEquip"><h3 class="${rare52(n)?'rare52':''}">${rare52(n)?'✦ ':''}${n} <span class="small">${lv} / ${baseFor(n).role}</span></h3><div class="small">HP ${S.hp[i]}/${maxHp(i)}　MP ${S.mp[i]}/${maxMp(i)}　攻撃 ${st.atk}　防御 ${st.def}　会心 ${st.crit}%</div><div class="row"><span>武器</span><b>${eq.武器||'なし'}</b></div><div class="row"><span>防具</span><b>${eq.防具||'なし'}</b></div><div class="row"><span>アクセサリー</span><b>${eq.アクセサリー||'なし'}</b></div></div>`}).join('')}</div>`)
  }else{
   open('仲間モンスター',`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div><div class="mon52Head"><b>MONSTER BOND</b><small>育成・絆・希少個体・編成効果</small></div><div class="panel"><div class="sectionTitle">通常メンバー</div>${['ミア','トア'].map(n=>`<div class="monsterCard"><b>${n}</b>${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div></div>`).join('')}<div class="sectionTitle">仲間モンスター</div>${S.monsterCompanions.length?S.monsterCompanions.map(n=>{let g=growth52(n),b=baseFor(n),sk=COMPANION_SKILLS[n],tr=COMPANION_TRAITS[n]||{name:'-',desc:'-'},pct=Math.min(100,g.exp/compNeed(g.lv)*100);return `<div class="monsterCard mon52Card ${rare52(n)?'rareGlow52':''}"><b class="${n==='黄金スライム'?'rar-phantom':rare52(n)?'rare52':''}">${rare52(n)?'✦ ':''}${n}</b> <b>Lv.${g.lv}</b>${rare52(n)?' <span class="rareBadge52">RARE INDIVIDUAL</span>':''}${partyNames().includes(n)?' <span class="badgeActive">編成中</span>':''}<div class="small">HP ${b.hp} / MP ${b.mp} / 攻撃 ${b.atk} / 防御 ${b.def}</div><div class="small">EXP ${g.exp}/${compNeed(g.lv)}　戦闘 ${g.battles}回　<span class="bond52">絆 ${bondRank(n)} ${g.bond}/300</span></div><div class="bar expbar"><i style="width:${pct}%"></i></div><div class="small">特性：<b>${tr.name}</b> — ${tr.desc}</div><div class="small">固有：${sk?`${sk.name} ${tierName52(n)} / Lv30で奥義`:'なし'}</div><div class="memberPick"><button data-line="1" data-member="${n}">2枠に編成</button><button data-line="2" data-member="${n}">3枠に編成</button></div><div class="detail52"><button data-detail52="${n}">詳細を見る</button></div></div>`}).join(''):'<p class="small">まだ仲間モンスターはいません。</p>'}</div>`);document.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,b.dataset.member));document.querySelectorAll('[data-detail52]').forEach(b=>b.onclick=()=>monsterDetail52(b.dataset.detail52))
  }
  document.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>partyView(b.dataset.pmode));
 };
 window.relicDamage52=relicDamage52; window.relicDrain52=relicDrain52; window.growth52=growth52; window.synergy52=synergy52;
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION52;document.title='どろダン / DROP OF DUNGEON v0.52 MONSTER BOND';save();render();
})();

;

(function(){
 const VERSION53='v0.53',MAX_FORGE53=10;
 S.forgeMaterial=Number.isFinite(S.forgeMaterial)?Math.max(0,Math.floor(S.forgeMaterial)):0;
 S.forgeLevels=S.forgeLevels||{};
 const rarMat53={NORMAL:1,RARE:4,EPIC:12,PHANTOM:30};
 const rarCost53={NORMAL:1,RARE:2,EPIC:4,PHANTOM:7};
 function forgeLv53(n){return Math.max(0,Math.min(MAX_FORGE53,Math.floor(S.forgeLevels[n]||0)))}
 function forgeCost53(n){let x=item(n),l=forgeLv53(n)+1;return {mat:(rarCost53[x.rar]||1)*(2+l),gold:(rarCost53[x.rar]||1)*l*180}}
 function forgeBonus53(n){let x=item(n),l=forgeLv53(n),rate=.04*l;return {atk:Math.floor((x.atk||0)*rate),def:Math.floor((x.def||0)*rate),crit:l>=5&&x.type==='アクセサリー'?Math.floor(l/5):0}}
 function forgeLabel53(n){let l=forgeLv53(n);return `${n}${l?` +${l}`:''}`}
 // Enhancement applies on top of the existing v0.52 stats, preserving relic passives and monster bonuses.
 const statsBefore53=statsFor;
 statsFor=function(i){let s=statsBefore53(i),eq=S.equipment[i]||{};Object.values(eq).filter(Boolean).forEach(n=>{let b=forgeBonus53(n);s.atk+=b.atk;s.def+=b.def;s.crit+=b.crit});return s};
 const eqBefore53=equipStat;equipStat=function(i,type){let x=eqBefore53(i,type),n=(S.equipment[i]||{})[type];if(!n)return x;let b=forgeBonus53(n);return {...x,atk:(x.atk||0)+b.atk,def:(x.def||0)+b.def,crit:(x.crit||0)+b.crit}};
 function dismantle53(n){
  if(S.equipment.some(eq=>Object.values(eq).includes(n)))return toast('装備中の品は素材化できません');
  if(S.locks[n])return toast('ロック中の品は素材化できません');
  let idx=S.owned.indexOf(n);if(idx<0)return toast('所持していません');let x=item(n),gain=rarMat53[x.rar]||1;
  if((x.rar==='EPIC'||x.rar==='PHANTOM')&&!confirm(`${x.rar}「${n}」を素材化しますか？`))return;
  S.owned.splice(idx,1);S.forgeMaterial+=gain;toast(`${n} → 強化石 +${gain}`);save();forgeView53();render();
 }
 function enhance53(n){let l=forgeLv53(n);if(l>=MAX_FORGE53)return toast('最大強化です');let c=forgeCost53(n);if(S.forgeMaterial<c.mat)return toast(`強化石が${c.mat}個必要です`);if(S.gold<c.gold)return toast(`${c.gold}G必要です`);S.forgeMaterial-=c.mat;S.gold-=c.gold;S.forgeLevels[n]=l+1;save();showFx(`<h1>FORGE +${l+1}</h1><div class="dropItem">${n}</div><p>装備強化に成功！</p>`);render();setTimeout(forgeView53,450)}
 function forgeView53(){
  let gear=[...new Set(S.owned.filter(n=>['武器','防具','アクセサリー'].includes(item(n).type)))];
  gear.sort((a,b)=>(forgeLv53(b)-forgeLv53(a))||((rarMat53[item(b).rar]||0)-(rarMat53[item(a).rar]||0)));
  open('星鍛冶屋',`<div class="forgeHero"><div class="anvil53">⚒️</div><h2>星鍛冶屋</h2><p class="small">不要装備を強化石に変え、お気に入りの装備を+10まで鍛える</p></div><div class="forgeMat53"><div><span>強化石</span><b>◆ ${S.forgeMaterial}</b></div><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div></div><div class="forgeNote53">強化1段階ごとに装備の攻撃・防御が基礎値の約4%上昇。アクセサリーは+5/+10で会心も上昇。EPIC/PHANTOMの固有効果はそのまま維持。</div><div class="panel">${gear.length?gear.map(n=>{let x=item(n),l=forgeLv53(n),b=forgeBonus53(n),c=forgeCost53(n),equipped=S.equipment.some(eq=>Object.values(eq).includes(n)),locked=!!S.locks[n];return `<div class="forgeCard53"><div class="forgeTop53"><span><b class="${rarityClass(x.rar)}">${forgeLabel53(n)}</b> <small>${x.type} / ${x.rar}</small></span>${l>=MAX_FORGE53?'<span class="forgeMax53">MAX</span>':`<span class="plus53">+${l}</span>`}</div><div class="forgeBar53"><i style="width:${l*10}%"></i></div><div class="small forgeBonus53">強化補正：攻撃 +${b.atk} / 防御 +${b.def}${b.crit?` / 会心 +${b.crit}%`:''}</div><div class="small">${l>=MAX_FORGE53?'最大強化済み':`次：強化石 ${c.mat} / ${c.gold.toLocaleString()}G`}</div><div class="forgeBtns53">${l<MAX_FORGE53?`<button data-forge53="${n}">強化する</button>`:''}<button class="dismantle53" data-mat53="${n}" ${equipped||locked?'disabled':''}>素材化 +${rarMat53[x.rar]||1}</button></div></div>`}).join(''):'<p class="small">強化できる装備を持っていません。</p>'}</div>`);
  document.querySelectorAll('[data-forge53]').forEach(b=>b.onclick=()=>enhance53(b.dataset.forge53));document.querySelectorAll('[data-mat53]').forEach(b=>b.onclick=()=>dismantle53(b.dataset.mat53));
 }
 // Show enhancement level in inventory without changing canonical item names used by drops/equipment.
 const itemRowBefore53=itemRow;itemRow=function(n){let html=itemRowBefore53(n),l=forgeLv53(n);if(l)html=html.replace(n,n+` +${l}`);return html};
 // Rebuild base with the forge as a first-class facility.
 baseView=function(){const total=S.gold+S.bank;open('星降りの拠点',`<div class="baseHero"><div class="baseCastle">🏰</div><h2>星降りの拠点</h2><p class="small">冒険の準備と資産管理を行う安全地帯</p></div><div class="panel"><div class="sectionTitle">🏦 モフルク銀行</div><div class="bankSummary"><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div><div><span>預金</span><b class="rar-phantom">${S.bank.toLocaleString()}G</b></div><div><span>総資産</span><b>${total.toLocaleString()}G</b></div></div><p class="small">全滅時に失うのは手持ちGの25%だけ。銀行預金は失いません。</p><div class="bankActions"><button class="miniBtn" data-dep="100">100G預ける</button><button class="miniBtn" data-dep="1000">1,000G預ける</button><button class="miniBtn" data-dep="all">全額預ける</button><button class="miniBtn" data-wd="100">100G引出</button><button class="miniBtn" data-wd="1000">1,000G引出</button><button class="miniBtn" data-wd="all">全額引出</button></div></div><div class="panel"><div class="sectionTitle">拠点施設</div><div class="baseFacilities"><button class="facility" data-fac="forge"><b>⚒️</b><span>星鍛冶屋<small>素材化・装備強化</small></span></button><button class="facility" data-fac="shop"><b>🏪</b><span>ショップ<small>装備を購入</small></span></button><button class="facility" data-fac="party"><b>🐾</b><span>仲間管理<small>編成・装備</small></span></button><button class="facility" data-fac="items"><b>🎒</b><span>倉庫<small>持ち物確認</small></span></button><button class="facility" data-fac="book"><b>📖</b><span>図鑑<small>討伐・DROP</small></span></button></div></div>`);document.querySelectorAll('[data-dep]').forEach(b=>b.onclick=()=>bankMove('deposit',b.dataset.dep==='all'?S.gold:+b.dataset.dep));document.querySelectorAll('[data-wd]').forEach(b=>b.onclick=()=>bankMove('withdraw',b.dataset.wd==='all'?S.bank:+b.dataset.wd));document.querySelectorAll('[data-fac]').forEach(b=>b.onclick=()=>{let f=b.dataset.fac;if(f==='forge')forgeView53();if(f==='shop'){open('ショップ','');shopView('武器')}if(f==='party')partyView();if(f==='items')itemView();if(f==='book')bookView()})};
 // Party equipment labels also expose enhancement level.
 const partyBefore53=partyView;partyView=function(mode='members'){partyBefore53(mode);if(mode==='members'){document.querySelectorAll('.charEquip .row b').forEach(el=>{let n=el.textContent.trim(),l=forgeLv53(n);if(l)el.textContent=`${n} +${l}`})}};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION53;document.title='どろダン / DROP OF DUNGEON v0.53 FORGE';save();render();
 window.forgeView53=forgeView53;
window.__forge53={
  lv:forgeLv53,
  cost:forgeCost53,
  enhance:enhance53,
  dismantle:dismantle53,
  rarMat:rarMat53
};
})();

;

(function(){
 const VERSION54='v0.54.1';
 // Companion definitions for every recruitable volcano monster.
 Object.assign(COMPANION_TRAITS,{
  'マグマスライム':{name:'熔岩ボディ',desc:'HP+14%・防御+12%',hp:.14,def:.12},
  'フレイムリザード':{name:'火鱗',desc:'攻撃+10%・防御+10%',atk:.10,def:.10},
  '炎翼バット':{name:'火走り',desc:'攻撃+9%・会心+8%',atk:.09,crit:8},
  'サラマンダー':{name:'竜種の血',desc:'HP+10%・攻撃+14%・防御+8%',hp:.10,atk:.14,def:.08}
 });
 Object.assign(COMPANION_GROWTH_STYLE,{
  'マグマスライム':{hp:9,mp:3,atk:3,def:3},'フレイムリザード':{hp:7,mp:2,atk:4,def:3},
  '炎翼バット':{hp:5,mp:3,atk:5,def:2},'サラマンダー':{hp:8,mp:3,atk:5,def:3}
 });
 Object.assign(COMPANION_SKILLS,{
  'マグマスライム':{name:'マグマバースト',lv:6,mult:1.78,rate:.36},
  'フレイムリザード':{name:'フレアクロー',lv:7,mult:1.88,rate:.37},
  '炎翼バット':{name:'バーニングダイブ',lv:7,mult:1.92,rate:.40},
  'サラマンダー':{name:'ドラゴンブレス',lv:8,mult:2.02,rate:.39}
 });
 Object.keys(MONSTERS).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 // Burn: volcano enemies can leave a short damage-over-time effect. Cleared after battle/wipe.
 S.burn54=Array.isArray(S.burn54)?S.burn54:[0,0,0];while(S.burn54.length<3)S.burn54.push(0);
 const enemyBefore54=enemyTurn;
 enemyTurn=function(){enemyBefore54();if(stage().area!=='灼熱の火山'||!aliveParty().length)return;let source=living().length>0;if(source&&Math.random()<.28){let a=aliveParty(),i=a[Math.floor(Math.random()*a.length)];S.burn54[i]=2;showLog(`🔥 ${partyNames()[i]}は火傷した！`,900)}for(let i=0;i<3;i++){if(S.burn54[i]>0&&S.hp[i]>0){let d=Math.max(2,Math.floor(maxHp(i)*.04));S.hp[i]=Math.max(0,S.hp[i]-d);S.burn54[i]--;floatText('🔥-'+d,18+i*31,72,'burn54')}}if(!aliveParty().length)wipe();save()};
 const spawnBefore54=spawn;spawn=function(){S.burn54=[0,0,0];spawnBefore54()};
 function applyVolcano54(){let app=document.querySelector('.app')||document.body,b=document.getElementById('battle');if(!b)return;let on=stage().area==='灼熱の火山';app.classList.toggle('volcano54',on);let f=document.getElementById('lavaField54');if(on&&!f){f=document.createElement('div');f.id='lavaField54';b.prepend(f)}if(!on&&f)f.remove()}
 const renderBefore54=render;render=function(){renderBefore54();applyVolcano54()};
 const stageBefore54=stageView;stageView=function(){stageBefore54();let ov=document.getElementById('overlay');if(ov)ov.querySelectorAll('.row').forEach(r=>{if((r.textContent||'').includes('灼熱の火山')){let b=r.querySelector('b');if(b&&!b.querySelector('.fireBadge54'))b.insertAdjacentHTML('beforeend',' <span class="fireBadge54">NEW</span>')}})};
 const bookBefore54=bookView;bookView=function(){bookBefore54();let body=document.getElementById('obody');if(body&&stage().area==='灼熱の火山')body.insertAdjacentHTML('afterbegin','<div class="hunt51"><b class="dragon54">DRAGON HUNT</b><br><small>灼熱の火山で竜種・火山限定装備を収集。焔竜王はEPIC / PHANTOM固有装備を持つ。</small></div>')};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION54;document.title='どろダン / DROP OF DUNGEON v0.54.1 VOLCANO FIX';save();render();
})();

;

(function(){
 const required=[
  {id:"v1",area:"灼熱の火山",name:"灼熱の火山 1",recommended:21,unlock:s=>!!s.clears.ib,unlockText:"氷の雪原ボス撃破で解放",enemies:["マグマスライム","フレイムリザード","炎翼バット","サラマンダー"],mult:2.95},
  {id:"v2",area:"灼熱の火山",name:"灼熱の火山 2",recommended:24,unlock:s=>!!s.clears.ib&&s.lv>=24,unlockText:"氷の雪原ボス撃破＋Lv24で解放",enemies:["サラマンダー","フレイムリザード","炎翼バット","マグマスライム"],mult:3.25},
  {id:"vb",area:"灼熱の火山",name:"灼熱の火山ボス",recommended:28,unlock:s=>!!s.clears.ib&&s.lv>=28,unlockText:"氷の雪原ボス撃破＋Lv28で解放",boss:true,bossMonster:"焔竜王・ヴォルガノス",enemies:["焔竜王・ヴォルガノス"],mult:3.65,next:"次のエリア（今後追加）"}
 ];
 required.forEach(st=>{if(!stages.some(x=>x.id===st.id))stages.push(st)});
 const logo=document.querySelector('.logo small');if(logo)logo.textContent='v0.54.1';
 document.title='どろダン / DROP OF DUNGEON v0.54.1 VOLCANO FIX';
})();

;

(function(){
 const VERSION55='v0.55';
 const AFF55={
  'スライム':{weak:'wind'},'ゴブリン':{weak:'fire'},'オオカミ':{weak:'fire'},'モリキノコ':{weak:'fire',resist:'poison'},'リーフフェアリー':{weak:'fire',resist:'wind'},'シャドウバット':{weak:'ice'},'森の主・月狼':{weak:'fire',resist:'wind'},
  'スノーラビット':{weak:'fire',resist:'ice'},'アイスウルフ':{weak:'fire',resist:'ice'},'フロストスライム':{weak:'fire',resist:'ice'},'フロストフェアリー':{weak:'fire',resist:'ice'},'氷雪の女王・フロスティア':{weak:'fire',resist:'ice'},
  'マグマスライム':{weak:'ice',resist:'fire'},'フレイムリザード':{weak:'ice',resist:'fire'},'炎翼バット':{weak:'ice',resist:'fire'},'サラマンダー':{weak:'ice',resist:'fire'},'焔竜王・ヴォルガノス':{weak:'ice',resist:'fire'}
 };
 const EN55={fire:'炎',ice:'氷',wind:'風',poison:'毒',neutral:'無'};
 let element55='neutral',skill55='';
 S.enemyStatus55=S.enemyStatus55||{};
 function aff55(e){return AFF55[e?.base]||AFF55[e?.name]||{}}
 function mult55(e,el){let a=aff55(e);if(el!=='neutral'&&a.weak===el)return 1.45;if(el!=='neutral'&&a.resist===el)return .58;return 1}
 function allyRes55(i,el){let n=partyNames()[i];if(el==='fire'&&['マグマスライム','フレイムリザード','炎翼バット','サラマンダー'].includes(n))return .55;if(el==='ice'&&['スノーラビット','アイスウルフ','フロストスライム','フロストフェアリー'].includes(n))return .55;return 1}
 const hitBefore55=hit;
 hit=function(i,d,crit=false){let e=E[i],m=mult55(e,element55),out=Math.max(1,Math.floor(d*m));if(m>1)floatText('WEAK!',12+i*31,24,'crit');else if(m<1)floatText('RESIST',12+i*31,24,'');hitBefore55(i,out,crit);if(e&&e.hp>0){let key=i+':'+e.name;if(element55==='fire'&&Math.random()<.24)S.enemyStatus55[key]={type:'burn',turns:2};if((element55==='poison'||/毒|胞子/.test(skill55))&&Math.random()<.32)S.enemyStatus55[key]={type:'poison',turns:3};if(element55==='ice'&&Math.random()<.16)S.enemyStatus55[key]={type:'freeze',turns:1}}element55='neutral';skill55=''};
 const useBefore55=useSkill;
 useSkill=function(n){skill55=n;element55=n==='火炎斬り'||n==='奥義・紅蓮'?'fire':n==='アイス'?'ice':n==='風刃'?'wind':/毒/.test(n)?'poison':'neutral';return useBefore55(n)};
 const logBefore55=showLog;
 showLog=function(t,ms=800){skill55=t;if(/火炎|フレア|マグマ|バーニング|ドラゴンブレス|紅蓮/.test(t))element55='fire';else if(/アイス|氷|フロスト|雪/.test(t))element55='ice';else if(/風刃|風/.test(t))element55='wind';else if(/毒|胞子/.test(t))element55='poison';return logBefore55(t,ms)};
 function tickEnemy55(){let frozen=false;E.forEach((e,i)=>{if(e.hp<=0)return;let k=i+':'+e.name,st=S.enemyStatus55[k];if(!st)return;if(st.type==='burn'||st.type==='poison'){let rate=st.type==='burn'?.045:.035,d=Math.max(2,Math.floor(e.max*rate));e.hp=Math.max(0,e.hp-d);floatText((st.type==='burn'?'🔥':'☠')+'-'+d,12+i*31,34,st.type==='burn'?'burn54':'');}if(st.type==='freeze'){frozen=true;showLog(`❄ ${e.name}は凍結して動けない！`,700)}st.turns--;if(st.turns<=0)delete S.enemyStatus55[k]});return frozen}
 const enemyBefore55=enemyTurn;
 enemyTurn=function(){let frozen=tickEnemy55();if(finish())return;if(frozen){S.guard=false;render();return}enemyBefore55();let boss=E.find(e=>e.boss&&e.hp>0);if(boss&&boss.charge){stopAuto('ボスの大技予告');setTimeout(()=>toast('⚠ 大技が来る！ 防御が有効'),60)}save()};
 // Existing volcano burn now respects fire-aligned companions.
 const partyDamageBefore55=partyDamage;
 partyDamage=function(i,d){let el=stage().area==='灼熱の火山'?'fire':stage().area==='氷の雪原'?'ice':'neutral';return partyDamageBefore55(i,Math.max(1,Math.floor(d*allyRes55(i,el))))};
 const spawnBefore55=spawn;
 spawn=function(){S.enemyStatus55={};spawnBefore55()};
 function statusFor55(i,e){let k=i+':'+e.name,st=S.enemyStatus55[k];return st?`<span class="status55">${st.type==='burn'?'🔥火傷':st.type==='poison'?'☠毒':'❄凍結'}</span>`:''}
 function decorate55(){document.querySelectorAll('.enemy').forEach((el,i)=>{let e=E[i];if(!e)return;let box=el.querySelector('.ebox')||el,name=el.querySelector('b')||el.querySelector('.ename');let a=aff55(e);if(name&&!name.querySelector('.elem55')&&(a.weak||a.resist)){name.insertAdjacentHTML('beforeend',`${a.weak?` <span class="elem55 ${a.weak}">弱:${EN55[a.weak]}</span>`:''}${a.resist?` <span class="elem55 ${a.resist}">耐:${EN55[a.resist]}</span>`:''}`)}if(e.boss&&e.charge)box.classList.add('danger55');else box.classList.remove('danger55');let old=box.querySelector('.status55');if(old)old.remove();let st=statusFor55(i,e);if(st)box.insertAdjacentHTML('beforeend',st)});let b=document.getElementById('battle');if(b&&!b.querySelector('.tactical55')&&E.some(e=>e.boss)){let x=E.find(e=>e.boss),a=aff55(x);b.insertAdjacentHTML('afterbegin',`<div class="tactical55">TACTICAL BATTLE　${a.weak?`<span class="weak55">弱点：${EN55[a.weak]}</span>`:''}${a.resist?`　<span class="resist55">耐性：${EN55[a.resist]}</span>`:''}　⚠ 大技予告時はAUTO停止</div>`)}}
 const renderBefore55=render;render=function(){renderBefore55();decorate55()};
 const stageBefore55=stageView;stageView=function(){stageBefore55();let body=document.getElementById('obody');if(body)body.insertAdjacentHTML('afterbegin','<div class="tactical55">v0.55：属性弱点・耐性 / 火傷・毒・凍結 / ボス大技予告 / 防御攻略を実装</div>')};
 // Make guard especially meaningful against telegraphed boss attacks.
 const guard=document.getElementById('guard');if(guard){guard.title='敵の攻撃を大幅軽減。ボスの大技予告時に特に有効'}
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION55;document.title='どろダン / DROP OF DUNGEON v0.55 TACTICAL BATTLE';save();render();
})();

;

(function(){
 const VERSION56='v0.56';
 // v0.55.1 recovery economy + v0.56 collection book, shipped together.
 S.highHerb=Number.isFinite(S.highHerb)?S.highHerb:0;
 S.specialHerb=Number.isFinite(S.specialHerb)?S.specialHerb:0;
 S.encounters56=S.encounters56||{};
 Object.keys(S.seen||{}).forEach(n=>{if(S.seen[n]&&!Number.isFinite(S.encounters56[n]))S.encounters56[n]=1});
 const CONSUMABLES56={
  herb:{name:'薬草',icon:'🌿',heal:35,price:35,desc:'味方1人のHPを35回復',key:'herb'},
  high:{name:'上薬草',icon:'🌱',heal:90,price:110,desc:'味方1人のHPを90回復',key:'highHerb'},
  special:{name:'特薬草',icon:'🌺',heal:220,price:280,desc:'味方1人のHPを220回復',key:'specialHerb'},
  revive:{name:'生命の雫',icon:'💧',revive:.5,price:650,desc:'戦闘不能の味方1人をHP50%で復活',key:'revive'}
 };
 function buyConsum56(id){let x=CONSUMABLES56[id];if(!x)return;if(S.gold<x.price)return toast('Gが足りない');S.gold-=x.price;S[x.key]=(S[x.key]||0)+1;save();toast(`${x.name}を購入！ 所持${S[x.key]}個`);shopView('回復');render()}
 function useHeal56(id){let x=CONSUMABLES56[id];if(!x||x.revive)return;if(!(S[x.key]>0))return toast(`${x.name}がない`);openTarget(`${x.name}を使う相手`,i=>{if(S.hp[i]<=0)return toast('戦闘不能には使えない');let before=S.hp[i];if(before>=maxHp(i))return toast('HPは満タンです');S[x.key]--;S.hp[i]=Math.min(maxHp(i),S.hp[i]+x.heal);floatText('+'+(S.hp[i]-before),18+i*31,72,'heal');save();render()},true)}
 function itemMenu56(){open('回復アイテム',`<div class="recovery56"><b>RECOVERY</b><br><small>戦闘中も3段階の回復薬と蘇生薬を使用できます。</small></div><div class="panel itemMenu56">${Object.entries(CONSUMABLES56).map(([id,x])=>`<div class="itemUse56"><span><b>${x.icon} ${x.name}</b><small>${x.desc}</small></span><span><b>×${S[x.key]||0}</b> <button class="miniBtn" data-use56="${id}">使う</button></span></div>`).join('')}</div>`);document.querySelectorAll('[data-use56]').forEach(b=>b.onclick=()=>{let id=b.dataset.use56;if(id==='revive')useRevive();else useHeal56(id)})}
 const shopBefore56=shopView;
 shopView=function(type='武器'){
  if(type!=='回復'){shopBefore56(type);let tabs=document.querySelector('.tabs');if(tabs&&!tabs.querySelector('[data-tab="回復"]'))tabs.insertAdjacentHTML('beforeend','<button class="tab" data-tab="回復">回復</button>');document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>shopView(b.dataset.tab));return}
  shopTab='回復';document.getElementById('obody').innerHTML=`<div class="shopHero45"><b>王都道具商</b><span>所持金 ${S.gold}G</span><small>回復薬・蘇生薬はいつでも購入できます</small></div><div class="tabs">${['武器','防具','アクセサリー','回復'].map(t=>`<button class="tab ${t===type?'active':''}" data-tab="${t}">${t}</button>`).join('')}</div><div class="panel shopConsum56">${Object.entries(CONSUMABLES56).map(([id,x])=>`<div class="cons56"><span><b>${x.icon} ${x.name}</b><small>${x.desc}<br>所持 ${S[x.key]||0}個</small></span><button class="buy" data-buycons56="${id}">${x.price}G<br><small>購入</small></button></div>`).join('')}</div>`;
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>shopView(b.dataset.tab));document.querySelectorAll('[data-buycons56]').forEach(b=>b.onclick=()=>buyConsum56(b.dataset.buycons56));
 };
 // Battle item button now opens the full recovery inventory instead of consuming herb directly.
 const herbBtn=document.getElementById('herb');if(herbBtn)herbBtn.onclick=itemMenu56;
 // Inventory shows all recovery items and allows direct use.
 const itemBefore56=itemView;itemView=function(tab=itemTab){itemBefore56(tab);let panel=document.querySelector('#obody .panel');if(panel){let rows=`<div class="recovery56"><b>回復アイテム</b></div>${Object.entries(CONSUMABLES56).map(([id,x])=>`<div class="row"><span><b>${x.icon} ${x.name}</b><br><small>${x.desc}</small></span><span><b>${S[x.key]||0}個</b> <button class="miniBtn" data-invuse56="${id}">使う</button></span></div>`).join('')}`;panel.insertAdjacentHTML('afterbegin',rows);document.querySelectorAll('[data-invuse56]').forEach(b=>b.onclick=()=>{let id=b.dataset.invuse56;if(id==='revive')useRevive();else useHeal56(id)})}};
 // Count encounters from this version onward. Existing seen monsters start at 1 because historic exact counts are unavailable.
 const spawnBefore56=spawn;spawn=function(){spawnBefore56();let counted={};E.forEach(e=>{let n=e.name;if(!counted[n]){S.encounters56[n]=(S.encounters56[n]||0)+1;counted[n]=1}});save()};
 function monsterArea56(n){for(const st of stages){if((st.enemies||[]).includes(n)||st.bossMonster===n)return st.area}return n==='黄金スライム'?'特殊':'その他'}
 function dropsFor56(n){return n==='黄金スライム'?[specialItems['幻の金冠']]:(drops[n]||[])}
 function areaStats56(area){let mons=Object.keys(MONSTERS).filter(n=>monsterArea56(n)===area),total=0,got=0;mons.forEach(n=>{total++;if(S.seen[n])got++;let cfg=MONSTERS[n];if(cfg&&cfg.recruit){total++;if(S.monsterCompanions.includes(n))got++}dropsFor56(n).forEach(d=>{total++;if(S.dropFound[d.n])got++})});return {mons,total,got,pct:total?Math.floor(got/total*100):0}}
 bookView=function(){let mons=[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])],areas=[...new Set(stages.map(s=>s.area))],seenCount=mons.filter(n=>S.seen[n]).length,joined=mons.filter(n=>S.monsterCompanions.includes(n)).length,allDrops=[...new Set(mons.flatMap(n=>dropsFor56(n).map(d=>d.n)))],gotDrops=allDrops.filter(n=>S.dropFound[n]).length;
  open('モンスター図鑑',`<div class="bookHead45"><b>MONSTER BOOK / COLLECTION</b><small>遭遇・討伐・仲間・DROP・BEST品質を記録</small></div><div class="bookSummary56"><div><span>発見</span><b>${seenCount}/${mons.length}</b></div><div><span>仲間</span><b>${joined}</b></div><div><span>DROP</span><b>${gotDrops}/${allDrops.length}</b></div><div><span>総討伐</span><b>${Object.values(S.kills).reduce((a,b)=>a+(+b||0),0)}</b></div></div>${areas.map(a=>{let q=areaStats56(a);return `<div class="area56"><div class="area56Top"><span>${a}</span><span>${q.pct}%</span></div><div class="bar56"><i style="width:${q.pct}%"></i></div><small>${q.got}/${q.total} COLLECTION</small></div>`}).join('')}<div class="bookGrid45">${mons.map(n=>{let seen=!!S.seen[n],joined=S.monsterCompanions.includes(n),ds=dropsFor56(n),g=joined?ensureGrowth42(n):null,tr=COMPANION_TRAITS[n],cfg=MONSTERS[n],enc=S.encounters56[n]||0;return `<div class="bookCard45 ${seen?'':'unknownCard45'}"><h3 class="${n==='黄金スライム'?'rar-phantom':''}">${seen?n:'???'}</h3><div class="bookMeta56">${monsterArea56(n)} / 遭遇 ${enc} / 討伐 ${S.kills[n]||0}</div><div class="bookTags56"><span class="${joined?'got56':'miss56'}">${cfg?.recruit?(joined?'✓ 仲間化':'??? 仲間化'):'BOSS'}</span>${g?.variant52==='RARE'?'<span class="rare52">希少個体</span>':''}${g?`<span>Lv.${g.lv} 絆${bondRank(n)}</span>`:''}</div>${joined&&tr?`<div class="trait45">特性：${tr.name} — ${tr.desc}</div>`:''}<div class="bookDrop">${seen?ds.map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)} got56">✓ ${d.n}${S.gearQuality[d.n]?` [BEST ${Math.round(S.gearQuality[d.n]*100)}%]`:''}</span>${d.effectText51?`<span class="effect51">${d.effectText51}</span>`:''}`:`<span class="unknown">??? ${d.rar||'NORMAL'} 1/${d.r||'特殊'}</span>`).join('<br>'):'DROP：???'}</div></div>`}).join('')}</div>`)};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION56;document.title='どろダン / DROP OF DUNGEON v0.56 RECOVERY & COLLECTION';save();render();
 window.itemMenu56=itemMenu56;
})();

;

(function(){
 const VERSION57='v0.57';
 function healAtInn57(){for(let i=0;i<3;i++){S.hp[i]=maxHp(i);S.mp[i]=maxMp(i)}S.guard=false;save();render();toast('宿屋で休んだ。HP・MPが全回復！');baseView()}
 function ranch57(){
  const current=partyNames();
  open('モンスター牧場',`<div class="ranch57Head"><b>🐾 MONSTER RANCH</b><br><small>仲間の育成状況・希少個体・絆を確認して編成できます</small></div><div class="partyNow57"><span>現在のパーティ</span><br><b>${current.join(' / ')}</b></div><div class="panel">${S.monsterCompanions.length?S.monsterCompanions.map(n=>{let g=(typeof growth52==='function'?growth52(n):ensureGrowth42(n)),b=baseFor(n),tr=COMPANION_TRAITS[n]||{name:'-',desc:'-'},sk=COMPANION_SKILLS[n],rare=g&&g.variant52==='RARE';return `<div class="ranchCard57 ${rare?'rare':''}"><div class="ranchTop57"><b class="${n==='黄金スライム'?'rar-phantom':rare?'rare52':''}">${rare?'✦ ':''}${n}</b><span>${current.includes(n)?'編成中':'待機中'}</span></div><div class="ranchStats57">Lv.${g.lv} / EXP ${g.exp||0} / 絆 ${typeof bondRank==='function'?bondRank(n):'-'} / 戦闘 ${g.battles||0}回<br>HP ${b.hp} / MP ${b.mp} / 攻撃 ${b.atk} / 防御 ${b.def}<br>特性：${tr.name} — ${tr.desc}<br>固有：${sk?sk.name:'なし'}</div><div class="ranchBtns57"><button data-rslot57="1" data-rmon57="${n}">2枠へ</button><button data-rslot57="2" data-rmon57="${n}">3枠へ</button><button data-rdetail57="${n}">詳細</button></div></div>`}).join(''):'<p class="small">まだ仲間モンスターはいません。各地のモンスターを仲間にしよう。</p>'}</div>`);
  document.querySelectorAll('[data-rslot57]').forEach(b=>b.onclick=()=>setMember(+b.dataset.rslot57,b.dataset.rmon57));
  document.querySelectorAll('[data-rdetail57]').forEach(b=>b.onclick=()=>{let n=b.dataset.rdetail57;if(typeof monsterDetail52==='function')monsterDetail52(n);else partyView('monsters')});
 }
 function bankPanel57(){const total=S.gold+S.bank;open('モフルク銀行',`<div class="bank57"><div class="sectionTitle">🏦 モフルク銀行</div><div class="bankSummary"><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div><div><span>預金</span><b class="rar-phantom">${S.bank.toLocaleString()}G</b></div><div><span>総資産</span><b>${total.toLocaleString()}G</b></div></div><p class="small">全滅時に失うのは手持ちGの25%。預金は保護されます。</p><div class="bankActions"><button class="miniBtn" data-dep57="100">100G預ける</button><button class="miniBtn" data-dep57="1000">1,000G預ける</button><button class="miniBtn" data-dep57="all">全額預ける</button><button class="miniBtn" data-wd57="100">100G引出</button><button class="miniBtn" data-wd57="1000">1,000G引出</button><button class="miniBtn" data-wd57="all">全額引出</button></div></div>`);document.querySelectorAll('[data-dep57]').forEach(b=>b.onclick=()=>{let v=b.dataset.dep57==='all'?S.gold:+b.dataset.dep57;bankMove('deposit',v);setTimeout(bankPanel57,0)});document.querySelectorAll('[data-wd57]').forEach(b=>b.onclick=()=>{let v=b.dataset.wd57==='all'?S.bank:+b.dataset.wd57;bankMove('withdraw',v);setTimeout(bankPanel57,0)})}
 baseView=function(){
  let injured=S.hp.some((h,i)=>h<maxHp(i))||S.mp.some((m,i)=>m<maxMp(i));
  open('星降りの拠点',`<div class="base57Hero"><div class="base57Castle">🏰 ✦</div><h2>星降りの拠点</h2><p class="small">冒険の準備・育成・収集をここで整える</p></div><div class="base57Status"><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div><div><span>預金</span><b>${S.bank.toLocaleString()}G</b></div><div><span>仲間</span><b>${S.monsterCompanions.length}体</b></div></div><div class="inn57"><h3>🛏️ 星見の宿屋</h3><p class="small">パーティ全員のHP・MPを無料で全回復します。</p><button id="inn57">${injured?'休んで全回復':'HP・MPは満タン'}</button></div><div class="sectionTitle" style="margin-top:10px">拠点施設</div><div class="facGrid57"><button class="fac57" data-f57="shop"><b>🏪</b><strong>ショップ</strong><small>装備・薬草・上薬草・特薬草・生命の雫</small></button><button class="fac57" data-f57="forge"><b>⚒️</b><strong>星鍛冶屋</strong><small>素材化・装備を+10まで強化</small></button><button class="fac57" data-f57="bank"><b>🏦</b><strong>モフルク銀行</strong><small>全滅からゴールドを守る</small></button><button class="fac57" data-f57="ranch"><b>🐾</b><strong>モンスター牧場</strong><small>仲間・希少個体・絆・編成</small></button><button class="fac57" data-f57="party"><b>⚔️</b><strong>パーティ</strong><small>3人の装備と能力を確認</small></button><button class="fac57" data-f57="book"><b>📖</b><strong>図鑑</strong><small>COLLECTION・DROP・BEST品質</small></button><button class="fac57" data-f57="items"><b>🎒</b><strong>倉庫</strong><small>装備・回復薬・素材を整理</small></button><button class="fac57" data-f57="profile"><b>🪪</b><strong>冒険者プロフィール</strong><small>ID・中断データ・保存ガイド</small></button><button class="fac57" data-f57="saveguard"><b>💾</b><strong>セーブ保護</strong><small>救出・バックアップ・復元</small></button></div>`);
  let inn=document.getElementById('inn57');if(inn)inn.onclick=healAtInn57;
  document.querySelectorAll('[data-f57]').forEach(b=>b.onclick=()=>{let f=b.dataset.f57;if(f==='shop'){open('ショップ','');shopView('回復')}else if(f==='forge')window.forgeView53();else if(f==='bank')bankPanel57();else if(f==='ranch')ranch57();else if(f==='party')partyView();else if(f==='book')bookView();else if(f==='items')itemView();else if(f==='profile'){if(window.__profile741)window.__profile741.open();else toast('プロフィールを開けませんでした')}if(f==='saveguard')saveGuardView()});
 };
 window.ranch57=ranch57;window.bankPanel57=bankPanel57;
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION57;document.title='どろダン / DROP OF DUNGEON v0.57 STARFALL BASE';save();render();
})();

;

(function(){
 const VERSION58='v0.58';
 const newMons={
  'スカルナイト':{icon:'goblin',hp:158,atk:39,xp:128,recruit:560},
  'ゴースト':{icon:'shadowbat',hp:124,atk:43,xp:136,recruit:600},
  'ブラッドバット':{icon:'shadowbat',hp:132,atk:46,xp:145,recruit:650},
  'デーモンインプ':{icon:'leaffairy',hp:148,atk:49,xp:158,recruit:720},
  '呪王・ノクターナ':{icon:'moonwolf',hp:1450,atk:62,xp:1450,recruit:0}
 };
 Object.assign(MONSTERS,newMons);
 Object.assign(BASE_MEMBERS,{
  'スカルナイト':{hp:104,mp:18,atk:28,def:19,role:'不死騎士'},'ゴースト':{hp:82,mp:36,atk:30,def:11,role:'幽霊'},
  'ブラッドバット':{hp:88,mp:28,atk:32,def:12,role:'吸血魔'},'デーモンインプ':{hp:94,mp:34,atk:34,def:14,role:'悪魔'}
 });
 Object.assign(COMPANION_SKILLS,{
  'スカルナイト':{name:'冥府斬り',lv:7,mult:1.72,rate:.36},'ゴースト':{name:'ソウルドレイン',lv:7,mult:1.68,rate:.38},
  'ブラッドバット':{name:'ブラッドファング',lv:8,mult:1.78,rate:.38},'デーモンインプ':{name:'ダークフレア',lv:8,mult:1.84,rate:.36}
 });
 Object.assign(COMPANION_TRAITS,{
  'スカルナイト':{name:'不死の甲冑',desc:'防御+14%',def:.14},'ゴースト':{name:'霊体',desc:'HP+8%・会心+6%',hp:.08,crit:6},
  'ブラッドバット':{name:'吸血本能',desc:'攻撃+11%・会心+5%',atk:.11,crit:5},'デーモンインプ':{name:'魔界の血',desc:'攻撃・防御+9%',atk:.09,def:.09}
 });
 Object.assign(COMPANION_GROWTH_STYLE,{
  'スカルナイト':{hp:8,mp:1,atk:4,def:3},'ゴースト':{hp:5,mp:4,atk:4,def:1},'ブラッドバット':{hp:5,mp:3,atk:5,def:1},'デーモンインプ':{hp:6,mp:4,atk:5,def:2}
 });
 Object.assign(drops,{
  'スカルナイト':[{n:'古びた骨片',r:15,rar:'NORMAL',type:'素材',desc:'古城の騎士が残した骨片'},{n:'亡騎士の鎧',r:330,rar:'EPIC',type:'防具',atk:5,def:34,crit:3,desc:'攻撃+5 / 防御+34 / 会心+3%'}],
  'ゴースト':[{n:'幽魂の欠片',r:17,rar:'NORMAL',type:'素材',desc:'淡く揺らめく霊魂'},{n:'幽玄の指輪',r:360,rar:'EPIC',type:'アクセサリー',atk:10,def:6,crit:10,desc:'攻撃+10 / 防御+6 / 会心+10%'}],
  'ブラッドバット':[{n:'紅い翼膜',r:18,rar:'NORMAL',type:'素材',desc:'吸血魔の紅い翼'},{n:'吸血牙の短剣',r:430,rar:'EPIC',type:'武器',atk:45,def:2,crit:13,effect51:{lifeSteal:.05},effectText51:'与ダメージ5%吸収',desc:'攻撃+45 / 会心+13% / HP吸収'}],
  'デーモンインプ':[{n:'魔角の欠片',r:20,rar:'NORMAL',type:'素材',desc:'魔力を帯びた角'},{n:'魔界の護符',r:470,rar:'EPIC',type:'アクセサリー',atk:13,def:9,crit:11,desc:'攻撃+13 / 防御+9 / 会心+11%'}],
  '呪王・ノクターナ':[{n:'呪王の黒晶',r:7,rar:'RARE',type:'素材',desc:'古城を覆う呪力の結晶'},{n:'宵闇鎧ノクターナ',r:72,rar:'EPIC',type:'防具',atk:14,def:49,crit:9,effect51:{bossDamage:.12},effectText51:'ボス特効+12%',desc:'攻撃+14 / 防御+49 / 会心+9% / ボス特効'},{n:'魔剣・エクリプス',r:1700,rar:'PHANTOM',type:'武器',atk:72,def:10,crit:20,effect51:{bossDamage:.20,lifeSteal:.08,critDamage:.25},effectText51:'ボス特効+20% / 与ダメージ8%吸収 / 会心威力+25%',desc:'古城PHANTOM。攻撃+72 / 防御+10 / 会心+20%'}]
 });
 const castleStages=[
  {id:'c1',area:'呪われた古城',name:'呪われた古城 1',recommended:31,unlock:s=>!!s.clears.vb,unlockText:'灼熱の火山ボス撃破で解放',enemies:['スカルナイト','ゴースト','ブラッドバット','デーモンインプ'],mult:3.8},
  {id:'c2',area:'呪われた古城',name:'呪われた古城 2',recommended:34,unlock:s=>!!s.clears.vb&&s.lv>=34,unlockText:'火山ボス撃破＋Lv34で解放',enemies:['デーモンインプ','ブラッドバット','スカルナイト','ゴースト'],mult:4.15},
  {id:'cb',area:'呪われた古城',name:'呪われた古城ボス',recommended:38,unlock:s=>!!s.clears.vb&&s.lv>=38,unlockText:'火山ボス撃破＋Lv38で解放',boss:true,bossMonster:'呪王・ノクターナ',enemies:['呪王・ノクターナ'],mult:4.6,next:'次のエリア（今後追加）'}
 ];
 castleStages.forEach(st=>{if(!stages.some(x=>x.id===st.id))stages.push(st)});
 let vb=stages.find(x=>x.id==='vb');if(vb)vb.next='呪われた古城 1';
 Object.keys(newMons).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 S.curse58=Array.isArray(S.curse58)?S.curse58:[0,0,0];while(S.curse58.length<3)S.curse58.push(0);
 const enemyBefore58=enemyTurn;
 enemyTurn=function(){enemyBefore58();if(stage().area!=='呪われた古城'||!aliveParty().length)return;if(living().length&&Math.random()<.24){let a=aliveParty(),i=a[Math.floor(Math.random()*a.length)];S.curse58[i]=3;showLog(`☾ ${partyNames()[i]}は呪われた！`,900)}for(let i=0;i<3;i++){if(S.curse58[i]>0&&S.hp[i]>0){let d=Math.max(3,Math.floor(maxHp(i)*.035));S.hp[i]=Math.max(0,S.hp[i]-d);S.curse58[i]--;floatText('☾-'+d,18+i*31,72,'curse58')}}if(!aliveParty().length)wipe();save()};
 const spawnBefore58=spawn;spawn=function(){S.curse58=[0,0,0];spawnBefore58()};
 function applyCastle58(){let root=document.querySelector('#app')||document.body,b=document.getElementById('battle');if(!b)return;let on=stage().area==='呪われた古城';root.classList.toggle('castle58',on)}
 const renderBefore58=render;render=function(){renderBefore58();applyCastle58()};
 const stageBefore58=stageView;stageView=function(){stageBefore58();document.querySelectorAll('[data-stage]').forEach(r=>{if((r.textContent||'').includes('呪われた古城')){let b=r.querySelector('b');if(b&&!b.querySelector('.castleBadge58'))b.insertAdjacentHTML('beforeend',' <span class="castleBadge58">NEW</span>')}})};
 const bookBefore58=bookView;bookView=function(){bookBefore58();let body=document.getElementById('obody');if(body)body.insertAdjacentHTML('afterbegin','<div class="hunt51"><b style="color:#d9b8ff">CURSED CASTLE</b><br><small>不死・幽霊・悪魔系を仲間化。呪王ノクターナはEPIC / PHANTOM固有装備を所持。</small></div>')};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION58;document.title='どろダン / DROP OF DUNGEON v0.58 CURSED CASTLE';save();render();
})();

;

(()=>{
 const VERSION59='v0.59';
 const HERO59={
  'キーボ':{hp:8,mp:1,atk:3.15,def:2.35,mag:.65,spd:1.25,crit:.10,role:'剣士 / 前衛',skills:[[2,'強撃'],[10,'二連斬り'],[20,'奥義・紅蓮'],[30,'真・紅蓮覇斬']]},
  'ミア':{hp:4,mp:4,atk:1.15,def:1.05,mag:3.65,spd:1.35,crit:.05,role:'魔導士 / 属性魔法',skills:[[1,'魔法弾'],[10,'フレア'],[20,'ブリザード'],[30,'メテオ']]},
  'トア':{hp:5.5,mp:2,atk:2.35,def:1.45,mag:.75,spd:3.25,crit:.34,role:'高速アタッカー / 会心・状態異常',skills:[[1,'影刃'],[10,'毒刃'],[20,'瞬影連撃'],[30,'奥義・月影絶閃']]}
 };
 S.charGrowth=S.charGrowth||{};
 ['キーボ','ミア','トア'].forEach(n=>{if(!S.charGrowth[n])S.charGrowth[n]={lv:Math.max(1,S.lv||1),exp:Math.max(0,S.exp||0)};if(!Number.isFinite(S.charGrowth[n].lv))S.charGrowth[n].lv=Math.max(1,S.lv||1);if(!Number.isFinite(S.charGrowth[n].exp))S.charGrowth[n].exp=0});
 function hero59(n){return S.charGrowth[n]||{lv:1,exp:0}}
 function heroLv59(n){return hero59(n).lv}
 function human59(n){return !!HERO59[n]}
 function heroNeed59(l){return needExp(l)}
 function heroSkill59(n){let lv=heroLv59(n),a=HERO59[n].skills.filter(x=>lv>=x[0]);return a.length?a[a.length-1][1]:'なし'}
 const baseBefore59=baseFor;
 baseFor=function(name){if(!human59(name))return baseBefore59(name);let b=BASE_MEMBERS[name],g=HERO59[name],k=heroLv59(name)-1;return {...b,hp:Math.floor(b.hp+k*g.hp),mp:Math.floor(b.mp+k*g.mp),atk:b.atk+k*g.atk,def:b.def+k*g.def,role:g.role}}
 const maxHpBefore59=maxHp,maxMpBefore59=maxMp;
 maxHp=function(i){let n=partyNames()[i];return human59(n)?Math.floor(baseFor(n).hp):maxHpBefore59(i)};
 maxMp=function(i){let n=partyNames()[i];return human59(n)?Math.floor(baseFor(n).mp):maxMpBefore59(i)};
 const statsBefore59=statsFor;
 statsFor=function(i){let n=partyNames()[i];if(!human59(n))return statsBefore59(i);let b=baseFor(n),eq=S.equipment[i]||{},its=Object.values(eq).filter(Boolean).map(item),lv=heroLv59(n),g=HERO59[n];let forge={atk:0,def:0,crit:0};Object.values(eq).filter(Boolean).forEach(x=>{let it=item(x),fl=Math.max(0,Math.min(10,Math.floor((S.forgeLevels||{})[x]||0))),rate=.04*fl;forge.atk+=Math.floor((it.atk||0)*rate);forge.def+=Math.floor((it.def||0)*rate);if(fl>=5&&it.type==='アクセサリー')forge.crit+=Math.floor(fl/5)});let equipAtk=its.reduce((a,x)=>a+(x.atk||0),0),equipDef=its.reduce((a,x)=>a+(x.def||0),0),equipCrit=its.reduce((a,x)=>a+(x.crit||0),0);return {atk:Math.floor(b.atk+equipAtk+forge.atk),def:Math.floor(b.def+equipDef+forge.def),crit:+(5+(lv-1)*g.crit+equipCrit+forge.crit).toFixed(1),magic:Math.floor((BASE_MEMBERS[n].atk+6)+(lv-1)*g.mag+(n==='ミア'?equipAtk*.65:equipAtk*.2)),speed:Math.floor(10+(lv-1)*g.spd),lv};};
 function grantHeroExp59(n,xp){if(!human59(n))return[];let g=hero59(n),ups=[];g.exp+=xp;while(g.exp>=heroNeed59(g.lv)){g.exp-=heroNeed59(g.lv);g.lv++;ups.push(g.lv)}return ups}
 addExp=function(xp){let active=[...new Set(partyNames().filter(human59))],ups=[];active.forEach(n=>{let gained=n==='トア'?Math.floor(xp*1.04):n==='ミア'?Math.floor(xp*.98):xp;let lvups=grantHeroExp59(n,gained);lvups.forEach(l=>ups.push([n,l]))});S.lv=heroLv59('キーボ');S.exp=hero59('キーボ').exp;ensureVitals();ups.forEach(([n,l])=>{let idx=partyNames().indexOf(n);if(idx>=0){S.hp[idx]=maxHp(idx);S.mp[idx]=maxMp(idx)}let unlocked=(HERO59[n].skills.find(x=>x[0]===l)||[])[1];showFx(`<h1>LEVEL UP!</h1><h2>${n} Lv.${l-1} → Lv.${l}</h2><div class="newskill">${unlocked?'NEW SKILL! 「'+unlocked+'」':HERO59[n].role}</div>`)});save()};
 const renderBefore59=render;
 render=function(){S.lv=heroLv59('キーボ');S.exp=hero59('キーボ').exp;renderBefore59();let el=document.querySelector('.logo small');if(el)el.textContent=VERSION59};
 renderSkills=function(){let lv=heroLv59('キーボ'),u=skillDefs.filter(s=>lv>=s[1]);if(lv>=30&&!u.some(s=>s[0]==='真・紅蓮覇斬'))u=[...u,['真・紅蓮覇斬',30,28,'単体・究極剣技']];$('#skillList').innerHTML=u.map(s=>`<button class="skill" data-sk="${s[0]}"><b>${s[0]}</b><small>MP${s[2]} / ${s[3]}</small></button>`).join('');document.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>useSkill(b.dataset.sk))};
 const useSkillBefore59=useSkill;
 useSkill=function(n){if(n!=='真・紅蓮覇斬')return useSkillBefore59(n);if(S.hp[0]<=0)return toast('キーボは戦闘不能');if(S.mp[0]<28)return toast('MPが足りない');S.mp[0]-=28;$('#skillSheet').classList.remove('open');let st=statsFor(0),raw=Math.floor(st.atk*4.6);hit(target,raw,true);showLog('キーボは「真・紅蓮覇斬」！');endTurn()};
 companionActions=function(){for(let i=1;i<3;i++){if(S.hp[i]<=0||!living().length)continue;let idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),name=partyNames()[i],mult=1,skill=null,raw=0,crit=false;if(name==='ミア'){let lv=heroLv59(name),cost=lv>=30?12:lv>=20?8:lv>=10?5:2;if(S.mp[i]>=cost&&Math.random()<.58){S.mp[i]-=cost;mult=lv>=30?2.75:lv>=20?2.15:lv>=10?1.7:1.3;skill=heroSkill59(name);raw=Math.floor(st.magic*mult*(.9+Math.random()*.2))}else raw=Math.floor(st.atk*(.86+Math.random()*.25))}else if(name==='トア'){let lv=heroLv59(name);mult=lv>=30?1.9:lv>=20?1.55:lv>=10?1.35:1.18;skill=Math.random()<.5?heroSkill59(name):null;crit=Math.random()<Math.min(.55,st.crit/100+st.speed/1000);raw=Math.floor(st.atk*(skill?mult:1)*(crit?1.75:1)*(.88+Math.random()*.22));if(skill&&lv>=10&&Math.random()<.3&&E[idx])E[idx].poison55=Math.max(E[idx].poison55||0,2)}else if(isCompanion(name)){let sk=COMPANION_SKILLS[name],g=growth52(name),rank=bondRank(name),bondRate={D:0,C:.02,B:.04,A:.06,MAX:.10}[rank]||0;if(sk&&compLv(name)>=sk.lv&&Math.random()<Math.min(.72,sk.rate+bondRate)){mult=skillPower(name);skill=`${name}の${sk.name} ${tierName52(name)}`}crit=Math.random()<st.crit/100;raw=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1))}else{crit=Math.random()<st.crit/100;raw=Math.floor(st.atk*(.86+Math.random()*.25)*(crit?1.65:1))}if(skill)showLog(`${name==='ミア'||name==='トア'?name+'の':''}${skill}！`);let d=typeof relicDamage52==='function'?relicDamage52(i,raw,crit,E[idx]):raw;hit(idx,d,crit);if(typeof relicDrain52==='function')relicDrain52(i,d)}};
 const partyBefore59=partyView;
 partyView=function(mode='members'){if(mode!=='members')return partyBefore59(mode);let syn=typeof synergy52==='function'?synergy52():{names:[]};open('パーティ',`<div class="tabs"><button class="tab" data-pmode="members">3人・装備</button><button class="tab" data-pmode="monsters">仲間モンスター</button></div>${syn.names?.length?`<div class="synergy52">編成効果：<b>${syn.names.join(' / ')}</b></div>`:''}<div class="panel">${partyNames().map((n,i)=>{let st=statsFor(i),eq=S.equipment[i]||{},lv=isCompanion(n)?compLv(n):heroLv59(n),ex=isCompanion(n)?ensureGrowth42(n).exp:hero59(n).exp,req=isCompanion(n)?compNeed(lv):heroNeed59(lv),pct=Math.min(100,ex/req*100),extra=human59(n)?`<div class="stats59"><span>攻撃<br><b>${st.atk}</b></span><span>防御<br><b>${st.def}</b></span><span>魔力<br><b>${st.magic}</b></span><span>素早さ<br><b>${st.speed}</b></span><span>会心<br><b>${st.crit}%</b></span><span>HP/MP<br><b>${maxHp(i)}/${maxMp(i)}</b></span></div><div class="skill59">現在の代表スキル：<b>${heroSkill59(n)}</b></div>`:`<div class="stats59"><span>攻撃<br><b>${st.atk}</b></span><span>防御<br><b>${st.def}</b></span><span>会心<br><b>${st.crit}%</b></span></div>`;return `<div class="char59"><h3>${n} <span class="lv59">Lv.${lv}</span></h3><div class="role59">${baseFor(n).role}</div><div class="small">EXP ${ex} / ${req}</div><div class="xp59"><i style="width:${pct}%"></i></div>${extra}<div class="row"><span>武器</span><b>${eq.武器||'なし'}</b></div><div class="row"><span>防具</span><b>${eq.防具||'なし'}</b></div><div class="row"><span>アクセサリー</span><b>${eq.アクセサリー||'なし'}</b></div></div>`}).join('')}</div>`);document.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>partyView(b.dataset.pmode))};
 window.HERO59=HERO59; window.heroLv59=heroLv59; window.hero59=hero59;
 document.title='どろダン / DROP OF DUNGEON v0.59 HERO GROWTH';let logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION59;save();render();
})();

;

(()=>{
 const VERSION60='v0.60';
 S.gearAffixes60=S.gearAffixes60||{}; S.gearAffixBest60=S.gearAffixBest60||{};
 const POOL60=[
  {k:'atkPct',n:'攻撃',min:2,max:10,s:10},{k:'defPct',n:'防御',min:2,max:10,s:8},{k:'crit',n:'会心',min:1,max:6,s:13},
  {k:'magicPct',n:'魔力',min:3,max:12,s:9},{k:'speedPct',n:'素早さ',min:3,max:12,s:7},{k:'bossDamage',n:'ボス特効',min:3,max:12,s:12},
  {k:'fireDamage',n:'炎強化',min:3,max:12,s:10},{k:'iceDamage',n:'氷強化',min:3,max:12,s:10},{k:'lifeSteal',n:'HP吸収',min:1,max:5,s:18}
 ];
 function count60(r){return r==='PHANTOM'?3:r==='EPIC'?2:r==='RARE'?1:0}
 function rollAffixes60(d){let c=count60(d.rar);if(!c||!["武器","防具","アクセサリー"].includes(d.type))return null;let pool=[...POOL60],out=[];for(let i=0;i<c&&pool.length;i++){let j=Math.floor(Math.random()*pool.length),a=pool.splice(j,1)[0],boost=d.rar==='PHANTOM'?1.2:d.rar==='EPIC'?1.08:1,v=Math.max(a.min,Math.round((a.min+Math.random()*(a.max-a.min))*boost));out.push({k:a.k,n:a.n,v,s:a.s})}return out}
 function score60(a){return (a||[]).reduce((z,x)=>z+x.v*x.s,0)}
 function text60(a){return (a||[]).map(x=>`${x.n}+${x.v}${x.k==='crit'?'%':'%'}`).join(' / ')}
 const regBefore60=registerGearRoll43;
 registerGearRoll43=function(d){let q=regBefore60(d),a=rollAffixes60(d);if(a){let sc=score60(a),old=S.gearAffixBest60[d.n]||0;if(sc>old){S.gearAffixes60[d.n]=a;S.gearAffixBest60[d.n]=sc;if(q)q.affixUpgrade=true;q=q||{q:S.gearQuality[d.n]||1,upgrade:false,affixUpgrade:true}}else if(q)q.affixUpgrade=false}return q};
 function affixFor60(i){let eq=S.equipment[i]||{},all=[];Object.values(eq).filter(Boolean).forEach(n=>all.push(...(S.gearAffixes60[n]||[])));let o={atkPct:0,defPct:0,crit:0,magicPct:0,speedPct:0,bossDamage:0,fireDamage:0,iceDamage:0,lifeSteal:0};all.forEach(a=>o[a.k]=(o[a.k]||0)+a.v);return o}
 const statsBefore60=statsFor;
 statsFor=function(i){let st=statsBefore60(i),a=affixFor60(i);return {...st,atk:Math.floor(st.atk*(1+a.atkPct/100)),def:Math.floor(st.def*(1+a.defPct/100)),crit:+(st.crit+a.crit).toFixed(1),magic:Math.floor((st.magic||st.atk)*(1+a.magicPct/100)),speed:Math.floor((st.speed||10)*(1+a.speedPct/100))}}
 const relicBefore60=relicDamage52;
 relicDamage52=function(i,base,crit,e){let d=relicBefore60(i,base,crit,e),a=affixFor60(i),m=1;if(e?.boss)m+=a.bossDamage/100;if(stage().area==='灼熱の火山')m+=a.fireDamage/100;if(stage().area==='氷の雪原')m+=a.iceDamage/100;return Math.max(1,Math.floor(d*m))};
 const drainBefore60=relicDrain52;
 relicDrain52=function(i,d){drainBefore60(i,d);let a=affixFor60(i);if(a.lifeSteal>0&&S.hp[i]>0){let h=Math.max(1,Math.floor(d*a.lifeSteal/100));S.hp[i]=Math.min(maxHp(i),S.hp[i]+h)}};
 const rowBefore60=itemRow;
 itemRow=function(n){let h=rowBefore60(n),a=S.gearAffixes60[n];if(a?.length)h=h.replace('</small>',`<span class="affix60">RANDOM AFFIX：${a.map(x=>`<span>${x.n}+${x.v}%</span>`).join('')}</span></small>`);return h};
 const dropBefore60=showDrop43;
 showDrop43=function(d,qr,e){dropBefore60(d,qr,e);if(qr?.affixUpgrade)setTimeout(()=>toast(`★ ${d.n} 特殊能力BEST更新！`),650)};
 const renderBefore60=render;
 render=function(){renderBefore60();let P=partyNames();document.querySelectorAll('#party .pcard').forEach((el,i)=>{let b=el.querySelector('b'),n=P[i];if(!b||!n)return;let lv=isCompanion(n)?compLv(n):(typeof heroLv59==='function'&&HERO59[n]?heroLv59(n):S.lv);b.innerHTML=`${n}<span class="lvBattle60">Lv.${lv}</span>`});let logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION60};
 const partyBefore60=partyView;
 partyView=function(mode='members'){partyBefore60(mode);if(mode!=='members')return;document.querySelectorAll('.char59').forEach(card=>{let h=card.querySelector('h3');if(!h)return;let n=h.childNodes[0]?.textContent?.trim(),idx=partyNames().indexOf(n);if(idx<0)return;let a=affixFor60(idx),parts=[];if(a.atkPct)parts.push(`攻撃+${a.atkPct}%`);if(a.magicPct)parts.push(`魔力+${a.magicPct}%`);if(a.speedPct)parts.push(`素早さ+${a.speedPct}%`);if(a.crit)parts.push(`会心+${a.crit}%`);if(parts.length)card.insertAdjacentHTML('beforeend',`<div class="affix60">装備特殊能力：${parts.join(' / ')}</div>`)})};
 document.title='どろダン / DROP OF DUNGEON v0.60 AFFIX HUNT';let logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION60;save();render();
})();

;

(()=>{
 const VERSION601='v0.60.1';
 function signed601(v,suffix=''){return v===0?`±0${suffix}`:`${v>0?'+':''}${v}${suffix}`}
 function cls601(v){return v>0?'up601':v<0?'down601':'same601'}
 window.compareText=function(x){
   if(!x||!['武器','防具','アクセサリー'].includes(x.type))return '';
   const names=partyNames();
   const rows=[0,1,2].map(i=>{
     const cur=equipStat(i,x.type)||{};
     const a=(x.atk||0)-(cur.atk||0),d=(x.def||0)-(cur.def||0),c=(x.crit||0)-(cur.crit||0);
     return `<div class="c601"><span class="who601">${names[i]||('メンバー'+(i+1))}</span><span>攻撃 <b class="${cls601(a)}">${signed601(a)}</b> / 防御 <b class="${cls601(d)}">${signed601(d)}</b> / 会心 <b class="${cls601(c)}">${signed601(c,'%')}</b></span></div>`;
   }).join('');
   return `<div class="compare601"><small>3人装備比較</small>${rows}</div>`;
 };
 const oldChoose=window.chooseEquip;
 window.chooseEquip=function(n){openTarget(`${n}を誰に装備？`,i=>{equipTo(i,n);itemView(itemTab)},true)};
 function apply601(){document.title='どろダン / DROP OF DUNGEON v0.60.1 EQUIPMENT COMPARE';const e=document.querySelector('.logo small');if(e)e.textContent=VERSION601}
 const oldRender=window.render; if(typeof oldRender==='function')window.render=function(){const r=oldRender.apply(this,arguments);apply601();return r};
 apply601();
})();

;

(()=>{
 const VERSION61='v0.61.3';
 const HERO61=window.HERO59;
 const heroLv61=window.heroLv59;
 if(!HERO61||typeof heroLv61!=='function'){throw new Error('v0.61.3 requires HERO59 bridge');}
 const PIVOT_IMG61=DOD_ASSETS["dod_asset_18_fc02bc0404bf.jpg"];
 // 4人目の正式プレイアブル。戦闘枠は従来どおり3枠で、2/3枠へ編成する。
 BASE_MEMBERS['ピボット']={hp:62,mp:42,atk:9,def:3,role:'戦術家'};
 HERO61['ピボット']={hp:5.2,mp:3.1,atk:1.55,def:1.45,mag:3.15,spd:2.85,crit:.12,role:'戦術家 / 弱点支援',skills:[[1,'出口を見抜く'],[15,'戦術指揮'],[30,'星の差し手']]};
 S.charGrowth=S.charGrowth||{};
 if(!S.charGrowth['ピボット'])S.charGrowth['ピボット']={lv:Math.max(1,heroLv61('キーボ')||1),exp:0};
 S.unlockedHeroes=S.unlockedHeroes||['キーボ','ミア','トア'];
 if(!S.unlockedHeroes.includes('ピボット'))S.unlockedHeroes.push('ピボット'); // v0.62で召喚条件へ切替可能
 S.pivotMark61=S.pivotMark61||null;

 const hit61=hit;
 hit=function(i,d,crit=false){
   if(S.pivotMark61===i && E[i] && E[i].hp>0){
     d=Math.floor(d*1.60);
     S.pivotMark61=null;
     floatText('WEAK POINT +60%',12+i*31,18,'crit');
   }
   return hit61(i,d,crit);
 };

 const companion61=companionActions;
 companionActions=function(){
   // ピボット以外は既存AIをそのまま使用。ピボット編成時のみ専用ターン処理。
   const P=partyNames();
   if(!P.slice(1).includes('ピボット'))return companion61();
   for(let i=1;i<3;i++){
     if(S.hp[i]<=0||!living().length)continue;
     const name=P[i],idx=E.findIndex(e=>e.hp>0); if(idx<0)break;
     if(name==='ピボット'){
       const st=statsFor(i);
       if(S.mp[i]>=18 && S.pivotMark61===null && Math.random()<.48){
         S.mp[i]-=18; S.pivotMark61=idx;
         showLog('ピボットの「出口を見抜く」！ 次の一撃 +60%');
         const cards=document.querySelectorAll('.enemy'); if(cards[idx])cards[idx].classList.add('weakMark61');
       }else{
         const crit=Math.random()<st.crit/100;
         hit(idx,Math.floor((st.magic||st.atk)*1.05*(.9+Math.random()*.2)*(crit?1.6:1)),crit);
         showLog('ピボットの星読み攻撃！');
       }
     }else{
       // 既存キャラの1ターン分を再現して二重行動を防ぐ
       let st=statsFor(i),mult=1,raw=0,crit=false,skill=null;
       if(name==='ミア'){let lv=heroLv61(name),cost=lv>=30?12:lv>=20?8:lv>=10?5:2;if(S.mp[i]>=cost&&Math.random()<.58){S.mp[i]-=cost;mult=lv>=30?2.75:lv>=20?2.15:lv>=10?1.7:1.3;skill=heroSkill59(name);raw=Math.floor(st.magic*mult*(.9+Math.random()*.2))}else raw=Math.floor(st.atk*(.86+Math.random()*.25))}
       else if(name==='トア'){let lv=heroLv61(name);mult=lv>=30?1.9:lv>=20?1.55:lv>=10?1.35:1.18;skill=Math.random()<.5?heroSkill59(name):null;crit=Math.random()<Math.min(.55,st.crit/100+st.speed/1000);raw=Math.floor(st.atk*(skill?mult:1)*(crit?1.75:1)*(.88+Math.random()*.22))}
       else if(isCompanion(name)){let sk=COMPANION_SKILLS[name];if(sk&&compLv(name)>=sk.lv&&Math.random()<sk.rate){mult=skillPower(name);skill=sk.name}crit=Math.random()<st.crit/100;raw=Math.floor(st.atk*mult*(.86+Math.random()*.25)*(crit?1.65:1))}
       else raw=Math.floor(st.atk*(.86+Math.random()*.25));
       if(skill)showLog(`${name}の${skill}！`); hit(idx,raw,crit);
     }
   }
 };

 const party61=partyView;
 partyView=function(mode='members'){
   if(mode==='monsters'){
     party61(mode);
     const panel=document.querySelector('#obody .panel');
     if(panel && !panel.querySelector('[data-member="ピボット"]')){
       const d=document.createElement('div'); d.className='pivot61';
       d.innerHTML=`<b>ピボット <span class="pivotBadge61">LEGEND / 戦術家</span></b><div class="small">Lv.${window.heroLv59('ピボット')}　固有スキル：出口を見抜く</div><div class="memberPick"><button data-line="1" data-member="ピボット">2枠に編成</button><button data-line="2" data-member="ピボット">3枠に編成</button></div>`;
       panel.prepend(d);
       d.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,'ピボット'));
     }
     return;
   }
   party61(mode);
   const panel=document.querySelector('#obody .panel');
   if(panel && !panel.querySelector('.pivotProfile61')){
     const g=hero59('ピボット'),lv=window.heroLv59('ピボット');
     const d=document.createElement('div'); d.className='pivot61 pivotProfile61';
     d.innerHTML=`<h3>ピボット <span class="lv59">Lv.${lv}</span> <span class="pivotBadge61">戦術家</span></h3><img src="${PIVOT_IMG61}" alt="ピボット"><div class="small">魔力・素早さに優れる戦術支援型</div><div class="skill59"><b>出口を見抜く</b> / MP18<br>敵1体に弱点マーク。次にその敵が受ける攻撃1回のダメージを+60%。重複不可。</div><div class="memberPick"><button data-line="1">2枠に編成</button><button data-line="2">3枠に編成</button></div>`;
     d.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>setMember(+b.dataset.line,'ピボット'));
     panel.appendChild(d);
   }
 };

 const render61=render;
 render=function(){const r=render61.apply(this,arguments);const e=document.querySelector('.logo small');if(e)e.textContent=VERSION61;document.title='どろダン / DROP OF DUNGEON v0.61.3 PIVOT BATTLE';return r};
 const apply=()=>{document.title='どろダン / DROP OF DUNGEON v0.61.3 PIVOT BATTLE';const e=document.querySelector('.logo small');if(e)e.textContent=VERSION61};
 apply(); save();
})();

;

(()=>{
 const PIVOT_BATTLE_IMG613=DOD_ASSETS["dod_asset_19_e7ecc4105900.png"];
 function renderPivotBattle613(){
   const battle=document.getElementById('battle'); if(!battle)return;
   battle.querySelectorAll('.pivotBattle613').forEach(x=>x.remove());
   // v0.49の分割表示を作り直し、ピボット枠に元のミア/トア絵が残らないようにする。
   battle.querySelectorAll('.partyHuman49').forEach(x=>x.remove());
   const original=[...battle.children].find(x=>x.classList&&x.classList.contains('partyArt')&&!x.classList.contains('partyHuman49'));
   if(!original)return;
   const P=partyNames();
   const needsSplit=P.slice(1).some(n=>isCompanion(n)||n==='ピボット');
   original.style.display=needsSplit?'none':'';
   if(!needsSplit)return;
   P.forEach((n,i)=>{
     if(i===0 || (!isCompanion(n)&&n!=='ピボット')){
       const d=document.createElement('div'); d.className='partyHuman49 partyHumanSlot49 slot'+i;
       d.style.backgroundImage=getComputedStyle(original).backgroundImage;
       d.style.backgroundPosition=i===0?'left bottom':i===1?'center bottom':'right bottom';
       battle.appendChild(d);
     }
     if(n==='ピボット' && i>0){
       const d=document.createElement('div'); d.className='pivotBattle613 slot'+i;
       d.innerHTML=`<img src="${PIVOT_BATTLE_IMG613}" alt="ピボット"><span class="pivotName613">ピボット Lv.${window.heroLv59('ピボット')}</span>`;
       battle.appendChild(d);
     }
   });
 }
 const prev=render;
 render=function(){const r=prev.apply(this,arguments);renderPivotBattle613();const e=document.querySelector('.logo small');if(e)e.textContent='v0.61.3';document.title='どろダン / DROP OF DUNGEON v0.61.3 PIVOT BATTLE';return r};
 const prevSet=setMember;
 setMember=function(slot,name){const r=prevSet.apply(this,arguments);setTimeout(renderPivotBattle613,0);return r};
 const apply=()=>{const e=document.querySelector('.logo small');if(e)e.textContent='v0.61.3';document.title='どろダン / DROP OF DUNGEON v0.61.3 PIVOT BATTLE';renderPivotBattle613()};
 apply();
})();

;

(()=>{
 const VERSION62='v0.62.2.1';
 // Existing v0.61 confirmation saves must not keep Pivot for free.
 S.unlockedHeroes=Array.isArray(S.unlockedHeroes)?S.unlockedHeroes:['キーボ','ミア','トア'];
 S.legend62=S.legend62||{pivot:false,pulls:0};
 if(!S.legend62.pivot){
   S.unlockedHeroes=S.unlockedHeroes.filter(n=>n!=='ピボット');
   S.partySlots=S.partySlots.map((n,i)=>n==='ピボット'?(i===0?'ミア':'トア'):n);
 }
 // LEGEND equipment is registered through specialItems so existing inventory/equipment UI can use it.
 Object.assign(specialItems,{
  '星導剣・アストラ':{n:'星導剣・アストラ',type:'武器',rar:'LEGEND',atk:72,def:8,crit:18,desc:'攻撃+72 / 防御+8 / 会心+18%　星の導きを宿す伝説武器'},
  '星天衣・セレスティア':{n:'星天衣・セレスティア',type:'防具',rar:'LEGEND',atk:12,def:52,crit:10,desc:'攻撃+12 / 防御+52 / 会心+10%　星光を織った伝説防具'},
  '運命盤・オルビス':{n:'運命盤・オルビス',type:'アクセサリー',rar:'LEGEND',atk:18,def:18,crit:20,desc:'攻撃+18 / 防御+18 / 会心+20%　運命を読む伝説アクセサリー'}
 });
 const rarityBefore62=rarityClass;
 rarityClass=function(r){return r==='LEGEND'?'legend62':rarityBefore62(r)};
 function gearPool62(rar){
   const all=[...shop,...Object.values(drops).flat()];
   const seen=new Set();
   return all.filter(x=>x&&['武器','防具','アクセサリー'].includes(x.type)&&x.rar===rar&&x.rar!=='PHANTOM'&&!seen.has(x.n)&&seen.add(x.n));
 }
 function giveGear62(rar){
   const pool=gearPool62(rar);if(!pool.length)return null;
   const x=pool[Math.floor(Math.random()*pool.length)];S.owned.push(x.n);S.dropFound[x.n]=true;return x.n;
 }
 function giveLegendGear62(){
   const pool=['星導剣・アストラ','星天衣・セレスティア','運命盤・オルビス','真紅宝杖エターナルハート','月蝕双刃ルナ・エクリプス','星導魔銃アーク・ノヴァ','神喰妖刀・紅夜叉','天啓盤アカシック・ギア'];
   const n=pool[Math.floor(Math.random()*pool.length)];S.owned.push(n);S.dropFound[n]=true;return n;
 }
 function rollOne62(){
   // Fixed probability bands (1,000,000 slots):
   // Pivot 0.1% / LEGEND gear 0.3% / EPIC 2.0% / RARE 10.0% / NORMAL gear 35.0% / supplies 52.6%.
   // Keeping the bands explicit prevents the LEGEND-equipment rate from changing after Pivot is owned.
   const roll=Math.floor(Math.random()*1000000);
   if(roll<1000){
     if(!S.legend62.pivot)return {kind:'pivot',name:'ピボット',rar:'LEGEND'};
     // Duplicate Pivot keeps its 0.1% band but is converted to a fixed bonus instead of leaking into equipment odds.
     return {kind:'pivotDuplicate',name:'星の結晶 ×10',rar:'LEGEND'};
   }
   if(roll<1500)return {kind:'hero7437',name:'リリア',rar:'LEGEND'};
   if(roll<2000)return {kind:'hero7437',name:'セレナ',rar:'LEGEND'};
   if(roll<2500)return {kind:'hero7437',name:'ノア',rar:'LEGEND'};
   if(roll<3000)return {kind:'hero7437',name:'カグラ',rar:'LEGEND'};
   if(roll<11000)return {kind:'legendGear',rar:'LEGEND'};
   if(roll<31000)return {kind:'gear',rar:'EPIC'};
   if(roll<131000)return {kind:'gear',rar:'RARE'};
   if(roll<481000)return {kind:'gear',rar:'NORMAL'};
   return {kind:'supply',rar:'NORMAL'};
 }
 function grant62(x){
   if(x.kind==='pivot'){
     S.legend62.pivot=true;if(!S.unlockedHeroes.includes('ピボット'))S.unlockedHeroes.push('ピボット');return x;
   }
   if(x.kind==='pivotDuplicate'){
     S.starCrystals62=(S.starCrystals62||0)+10;return x;
   }
   if(x.kind==='hero7437'){S.unlockedHeroes7436=S.unlockedHeroes7436||[];if(S.unlockedHeroes7436.includes(x.name)){S.starCrystals62=(S.starCrystals62||0)+10;return {kind:'heroDuplicate7437',name:x.name+' 重複 → 星の結晶 ×10',rar:'LEGEND'}}S.unlockedHeroes7436.push(x.name);return x;}
   if(x.kind==='legendGear'){x.name=giveLegendGear62();return x}
   if(x.kind==='gear'){x.name=giveGear62(x.rar)||'強化石';if(x.name==='強化石')S.forgeMaterial=(S.forgeMaterial||0)+2;return x}
   const supplies=['上薬草','特薬草','生命の雫','強化石','強化石'];
   x.name=supplies[Math.floor(Math.random()*supplies.length)];
   if(x.name==='生命の雫')S.revive=(S.revive||0)+1;
   else if(x.name==='強化石')S.forgeMaterial=(S.forgeMaterial||0)+2;
   else {S.consumables56=S.consumables56||{};S.consumables56[x.name]=(S.consumables56[x.name]||0)+1}
   return x;
 }
 function summon62(count){
   const cost=count===10?5000:500;if(S.gold<cost)return toast(`${cost.toLocaleString()}G必要です`);
   S.gold-=cost;let rolls=Array.from({length:count},()=>rollOne62());
   let guaranteed=false;
   if(count===10&&!rolls.some(x=>['LEGEND','EPIC','RARE'].includes(x.rar))){
     rolls[9]={kind:'gear',rar:'RARE',guaranteed:true};guaranteed=true;
   }
   const out=rolls.map(grant62);S.legend62.pulls=(S.legend62.pulls||0)+count;save();render();
   const cls=x=>x.rar==='LEGEND'?'legend62':(x.rar==='EPIC'?'rar-epic':(x.rar==='RARE'?'rar-rare':''));
   const rows=out.map((x,i)=>`<div class="dropItem ${cls(x)}">${count===10?`${i+1}. `:''}${x.rar}　${x.name}${x.guaranteed?'　★10連保証':''}</div>`).join('');
   const gotPivot=out.some(x=>x.kind==='pivot'), gotLegend=out.some(x=>x.rar==='LEGEND');
   window.showSummon64(out,{gotPivot,gotLegend,guaranteed});
   setTimeout(summonView62,1700);
 }
 function summonView62(){
   const owned=!!S.legend62.pivot;
   open('星降りの召喚',`<div class="summon62Hero ${owned?'summon62Owned':''}"><div class="summon62Orb">✦ ◈ ✦</div><h2>星降りの召喚</h2><p class="small">冒険で集めたゴールドだけで挑戦する召喚。課金通貨は使用しません。</p></div><div class="summon62Rate"><div><span>LEGEND CHARACTER</span><b>合計 0.3%</b></div><div><span>LEGEND EQUIPMENT</span><b>合計 0.8%</b></div></div><div class="panel"><b>排出率</b><p class="small">LEGENDキャラ 合計0.3%（ピボット0.1% / リリア・セレナ・ノア・カグラ 各0.05%） / LEGEND装備 合計0.8%（8種各0.1%） / EPIC装備2.0% / RARE装備10.0% / 通常装備35.0% / 消耗品・強化石51.9%<br>10連はRARE以上1枠保証。PHANTOMは排出されません。</p></div><div class="panel exclusiveList7437"><b>★ 専用装備5種（各0.1%）</b><p class="small">リリア：真紅宝杖エターナルハート<br>セレナ：月蝕双刃ルナ・エクリプス<br>ノア：星導魔銃アーク・ノヴァ<br>カグラ：神喰妖刀・紅夜叉<br>ピボット：天啓盤アカシック・ギア</p><p class="small">＋既存LEGEND装備3種（各0.1%）</p></div><div class="panel"><b>ピボット</b> <span class="pivotBadge61">LEGEND / 戦術家</span><p class="small">${owned?'✓ 獲得済み・パーティ編成可能':'未獲得。召喚で獲得するとパーティに解放'}</p><p class="small">固有：出口を見抜く / MP18 / 次の一撃 +60%</p></div><div class="summon62Btns"><button id="pull1_62">1回 500G</button><button id="pull10_62">10回 5,000G</button></div><p class="small" style="text-align:center">召喚回数 ${S.legend62.pulls||0}回 / 手持ち ${S.gold.toLocaleString()}G<br>ボス専用PHANTOM装備は召喚から排出されません。</p>`);
   document.getElementById('pull1_62').onclick=()=>summon62(1);document.getElementById('pull10_62').onclick=()=>summon62(10);
 }
 window.summonView62=summonView62;
 // Hide Pivot's v0.61 confirmation card until the character is actually summoned.
 const partyBefore62=partyView;
 partyView=function(mode='members'){
   partyBefore62(mode);
   if(!S.legend62.pivot){document.querySelectorAll('.pivot61').forEach(x=>x.remove())}
 };
 // Add summon facility to the current base without replacing the established base UI.
 const baseBefore62=baseView;
 baseView=function(){
   baseBefore62();
   const grid=document.querySelector('#obody .facGrid57');if(grid&&!grid.querySelector('[data-f62="summon"]')){
     const b=document.createElement('button');b.className='fac57';b.dataset.f62='summon';b.innerHTML='<b>✦</b><strong>星降りの召喚</strong><small>500G / 10連5,000G / LEGENDキャラ5人＋専用装備5種</small>';b.onclick=summonView62;grid.prepend(b);
   }
 };
 // Final version guard: older version scripts can no longer leave the visible header at v0.60.
 const renderBefore62=render;
 render=function(){const r=renderBefore62.apply(this,arguments);const e=document.querySelector('.logo small');if(e)e.textContent=VERSION62;document.title='どろダン / DROP OF DUNGEON v0.62.2.1 STARFALL SUMMON';return r};
 const apply62=()=>{const e=document.querySelector('.logo small');if(e)e.textContent=VERSION62;document.title='どろダン / DROP OF DUNGEON v0.62.2.1 STARFALL SUMMON'};
 apply62();save();render();
})();

;

/* v0.62.2: stage-based enemy levels. Old stages stay weaker as the player grows. */
(function(){
  const spawnBefore622 = spawn;
  function enemyLevel622(st){
    const rec = Number(st.recommended||1);
    const excess = Math.max(0, Number(S.lv||1)-rec);
    // Only 55% of over-level growth reaches enemies, capped at +15 levels.
    return Math.max(1, Math.min(Number(S.lv||1), rec + Math.min(15, Math.floor(excess*0.55))));
  }
  function rebalance622(){
    const st=stage(), lv=enemyLevel622(st);
    E.forEach(e=>{
      e.lv=lv;
      if(e.golden){
        e.max=Math.max(55,Math.floor(62+lv*4.2));
        e.hp=e.max;
        e.atk=Math.max(8,Math.floor(9+lv*.48));
        e.xp=Math.max(e.xp||0,80+lv*7);
        return;
      }
      const b=monBase[e.base]||monBase[e.name];
      if(!b)return;
      if(e.boss){
        // Bosses keep their identity and durability, but no longer scale 1:1 with player level.
        e.max=Math.max(b.hp,Math.floor(b.hp*(1.10+lv*.035)));
        e.hp=e.max;
        e.atk=Math.max(b.atk,Math.floor(b.atk+lv*.55));
        e.xp=Math.max(b.xp,Math.floor(b.xp*(1+lv*.025)));
      }else{
        // Normal enemies are ~10–20% softer than the previous curve and are stage-level based.
        e.max=Math.max(12,Math.floor(b.hp*(.78+lv*.025)));
        e.hp=e.max;
        e.atk=Math.max(3,Math.floor((b.atk+lv*.45)*.88));
        e.xp=Math.max(4,Math.floor(b.xp*(.82+lv*.018)));
      }
    });
  }
  spawn=function(){spawnBefore622();rebalance622();render();};
  // Rebuild the current encounter once with the new curve.
  spawn();
})();

;

(()=>{
 const VERSION623='v0.62.3';
 const r0=render;render=function(){r0();let logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION623;document.title='どろダン / DROP OF DUNGEON v0.62.3';let bn=document.getElementById('battleNo');if(bn&&S.run623){let n=Math.max(1,Math.min(10,S.battle-S.run623.start+1));bn.innerHTML=`<span class="battleCount623">${n} / 10</span>`;let parent=bn.parentElement;if(parent)parent.lastChild.textContent='戦';}};
 render();
})();

;

(function(){
 const VERSION64='v0.68';
 window.compactClear64=function(xp,g,got=[]){const x=document.getElementById('compactClear64');if(!x)return;x.innerHTML=`<b>✓ BATTLE CLEAR</b><span>EXP +${xp}　+${g}G</span>${got.length?`<div class="drop64">DROP：${got.slice(0,2).join(' / ')}</div>`:''}`;x.classList.remove('show');void x.offsetWidth;x.classList.add('show');clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove('show'),720)};
 window.showSummon64=function(out,meta={}){const x=document.getElementById('summonFx64');if(!x)return;const top=meta.gotPivot?'LEGEND CHARACTER':meta.gotLegend?'LEGEND':out.some(v=>v.rar==='EPIC')?'EPIC':'星降りの召喚';const cls=meta.gotPivot||meta.gotLegend?'legend':out.some(v=>v.rar==='EPIC')?'epic':'';let body=meta.gotPivot?`<div class="pivotReveal64"><b>ピボット</b><span>LEGEND / 戦術家</span><div class="small">固有スキル：出口を見抜く</div></div>`:'';body+=`<div class="summonGrid64">${out.map((v,i)=>`<div class="summonOne64 ${String(v.rar||'').toLowerCase()}">${out.length>1?(i+1)+'. ':''}<b>${v.rar}</b><br>${v.name}</div>`).join('')}</div>`;x.innerHTML=`<div class="summonScene64"><div class="summonStars64">✦ ◈ ✦</div><div class="summonTitle64 ${cls}">${top}</div>${body}<div class="summonHint64">タップして閉じる</div></div>`;x.classList.add('show');const close=()=>{x.classList.remove('show');x.onclick=null};x.onclick=close;clearTimeout(x._t);x._t=setTimeout(close,meta.gotPivot||meta.gotLegend?2400:1700)};
 // Final battle-hit presentation wrapper. Core damage math is untouched.
 const hit0=hit;hit=function(i,d,crit=false){hit0(i,d,crit);const el=document.querySelector(`.enemy[data-i="${i}"]`);if(el){el.classList.remove('fxHit64','fxCrit64');void el.offsetWidth;el.classList.add(crit?'fxCrit64':'fxHit64');setTimeout(()=>el.classList.remove('fxHit64','fxCrit64'),320)}};
 const use0=useSkill;useSkill=function(n){const b=document.getElementById('battle');if(b&&/火炎|アイス|風刃|奥義|紅蓮/.test(n)){b.classList.remove('fxMagic64');void b.offsetWidth;b.classList.add('fxMagic64');setTimeout(()=>b.classList.remove('fxMagic64'),360)}return use0(n)};
 // Keep version visible even when older render wrappers execute later.
 const r0=render;render=function(){const r=r0.apply(this,arguments);const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION64;document.title='どろダン / DROP OF DUNGEON v0.68 CHARACTER SYSTEM';return r};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION64;document.title='どろダン / DROP OF DUNGEON v0.68 CHARACTER SYSTEM';render();
})();

;

(()=>{
 const VERSION65='v0.68';
 const PIVOT65_IMG=DOD_ASSETS["dod_asset_18_fc02bc0404bf.jpg"];
 const HEROES65=['キーボ','ミア','トア','ピボット'];
 const unlocked65=()=>HEROES65.filter(n=>n!=='ピボット'||!!(S.legend62&&S.legend62.pivot));
 S.heroEquipment65=S.heroEquipment65||{};
 function syncFromParty65(){partyNames().forEach((n,i)=>{if(HEROES65.includes(n)&&S.equipment[i])S.heroEquipment65[n]={...S.equipment[i]}});HEROES65.forEach(n=>{if(!S.heroEquipment65[n])S.heroEquipment65[n]={武器:'',防具:'',アクセサリー:''}});if(!S.heroEquipment65['キーボ'].武器)S.heroEquipment65['キーボ']={...(S.equipment[0]||{武器:'木の剣',防具:'旅人の服',アクセサリー:'小さなお守り'})}}
 syncFromParty65();
 function syncToParty65(){partyNames().forEach((n,i)=>{if(HEROES65.includes(n)&&S.heroEquipment65[n])S.equipment[i]={...S.heroEquipment65[n]}})}
 function heroData65(n){return window.HERO59&&window.HERO59[n]}
 function level65(n){return window.heroLv59?window.heroLv59(n):(S.lv||1)}
 function growth65(n){return window.hero59?window.hero59(n):{lv:S.lv||1,exp:S.exp||0}}
 function eq65(n){return S.heroEquipment65[n]||{武器:'',防具:'',アクセサリー:''}}
 function stats65(n){let b=BASE_MEMBERS[n]||{hp:1,mp:0,atk:1,def:1},g=heroData65(n)||{atk:1,def:1,mag:1,spd:1,crit:0},lv=level65(n),e=eq65(n),its=Object.values(e).filter(Boolean).map(item);let atk=Math.floor(b.atk+(lv-1)*(g.atk||1)+its.reduce((a,x)=>a+(x.atk||0),0)),def=Math.floor(b.def+(lv-1)*(g.def||1)+its.reduce((a,x)=>a+(x.def||0),0)),magic=Math.floor((b.atk+6)+(lv-1)*(g.mag||.5)+its.reduce((a,x)=>a+(x.atk||0),0)*(n==='ミア'?.65:.2)),speed=Math.floor(10+(lv-1)*(g.spd||1)),crit=+(5+(lv-1)*(g.crit||0)+its.reduce((a,x)=>a+(x.crit||0),0)).toFixed(1);return{atk,def,magic,speed,crit,hp:Math.floor(b.hp||1),mp:Math.floor(b.mp||0)}}
 function activeSlot65(n){return partyNames().indexOf(n)}
 function portrait65(n){if(n==='ピボット')return `<img class="heroPortrait65" src="${PIVOT65_IMG}" alt="ピボット">`;return `<div class="heroSigil65">${n.slice(0,1)}</div>`}
 function role65(n){return (heroData65(n)||{}).role||(BASE_MEMBERS[n]||{}).role||''}
 function skillDesc65(n,s){if(n==='ピボット'&&s==='出口を見抜く')return 'MP18 / 敵1体を解析。次に受ける攻撃1回のダメージ+60%';return s}
 function heroDetail65(n){if(!unlocked65().includes(n))return;let lv=level65(n),gr=growth65(n),req=needExp(lv),st=stats65(n),e=eq65(n),skills=(heroData65(n)?.skills||[]),slot=activeSlot65(n);open('キャラクター詳細',`<div class="heroDetail65">${portrait65(n)}<h2>${n} <span class="lv59">Lv.${lv}</span></h2><div class="role59">${role65(n)}</div><div class="small">EXP ${gr.exp||0} / ${req}</div><div class="xp59"><i style="width:${Math.min(100,(gr.exp||0)/req*100)}%"></i></div><div class="heroStats65"><div>HP<b>${st.hp}</b></div><div>MP<b>${st.mp}</b></div><div>攻撃<b>${st.atk}</b></div><div>防御<b>${st.def}</b></div><div>魔力<b>${st.magic}</b></div><div>素早さ<b>${st.speed}</b></div><div>会心<b>${st.crit}%</b></div><div>役割<b style="font-size:10px">${role65(n).split('/')[0]}</b></div><div>編成<b style="font-size:10px">${slot>=0?(slot+1)+'枠':'待機中'}</b></div></div><div class="panel"><b>装備 3枠</b>${['武器','防具','アクセサリー'].map(t=>`<div class="equipRow65"><span>${t}</span><b>${e[t]||'なし'}</b><button class="miniBtn" data-e65="${t}">変更</button></div>`).join('')}</div><div class="panel"><b>スキル</b>${skills.map(s=>`<div class="skillCard65 ${lv<s[0]?'locked':''}"><b>${lv>=s[0]?'◆':'🔒'} ${s[1]}</b><div class="small">Lv.${s[0]}　${skillDesc65(n,s[1])}</div></div>`).join('')}</div><div class="panel"><b>編成</b><div class="formation65"><button data-form65="0" class="${slot===0?'on':''}">1枠目<br>キーボ固定</button><button data-form65="1" class="${slot===1?'on':''}">2枠目</button><button data-form65="2" class="${slot===2?'on':''}">3枠目</button></div></div></div>`);document.querySelectorAll('[data-e65]').forEach(b=>b.onclick=()=>equipPicker65(n,b.dataset.e65));document.querySelectorAll('[data-form65]').forEach(b=>b.onclick=()=>{let i=+b.dataset.form65;if(i===0){if(n!=='キーボ')return toast('1枠目はキーボ固定です')}else setHero65(i,n);heroDetail65(n)})}
 function equipPicker65(n,type){let arr=S.owned.filter(x=>item(x).type===type);open(`${n}：${type}変更`,`<div class="panel equipPick65">${arr.length?arr.map(x=>{let it=item(x),cur=item(eq65(n)[type]||'');let a=(it.atk||0)-(cur.atk||0),d=(it.def||0)-(cur.def||0),c=(it.crit||0)-(cur.crit||0);return `<div class="row"><span><b class="${rarityClass(it.rar)}">${x}</b><br><small>攻撃 ${a>=0?'+':''}${a} / 防御 ${d>=0?'+':''}${d} / 会心 ${c>=0?'+':''}${c}%</small></span><button class="equip" data-pick65="${x}">装備</button></div>`}).join(''):'<p class="small">装備できるアイテムがありません。</p>'}</div>`);document.querySelectorAll('[data-pick65]').forEach(b=>b.onclick=()=>equipHero65(n,type,b.dataset.pick65))}
 function equipHero65(n,type,itemName){S.heroEquipment65[n][type]=itemName;let i=activeSlot65(n);if(i>=0)S.equipment[i]={...S.heroEquipment65[n]};save();toast(`${n}が${itemName}を装備`);heroDetail65(n)}
 function setHero65(slot,n){if(slot<1||slot>2||n==='キーボ')return;syncFromParty65();let other=S.partySlots.indexOf(n);if(other>=0&&other!==slot-1)S.partySlots[other]=slot===1?'ミア':'トア';S.partySlots[slot-1]=n;syncToParty65();S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot);save();render();toast(`${n}を${slot+1}枠目に編成`)}
 window.__equip65={
 heroes:HEROES65,
 unlocked:unlocked65,
 sync:syncFromParty65,
 eq:eq65,
 equip:equipHero65
};
window.heroDetail65=heroDetail65;
 const partyOld65=partyView;
 partyView=function(mode='members'){if(mode==='monsters')return partyOld65(mode);syncFromParty65();let P=partyNames(),heroes=unlocked65();open('パーティ',`<div class="heroTabs65"><button data-p65="heroes">キャラクター</button><button data-p65="monsters">仲間モンスター</button></div><div class="panel"><b>現在の編成</b><div class="formation65">${P.map((n,i)=>`<button class="on">${i+1}枠<br>${n}</button>`).join('')}</div></div><div class="heroRoster65">${heroes.map(n=>{let lv=level65(n),sl=activeSlot65(n);return `<button class="heroCard65 ${sl>=0?'active':''}" data-hero65="${n}"><b>${n} <span class="lv59">Lv.${lv}</span></b><div class="role">${role65(n)}</div><div class="slot">${sl>=0?'● '+(sl+1)+'枠目に編成中':'○ 待機中'}</div></button>`}).join('')}</div>${!heroes.includes('ピボット')?'<div class="panel small">LEGENDキャラクター「ピボット」は星降りの召喚で獲得すると追加されます。</div>':''}`);document.querySelector('[data-p65="monsters"]').onclick=()=>partyView('monsters');document.querySelectorAll('[data-hero65]').forEach(b=>b.onclick=()=>heroDetail65(b.dataset.hero65))};
 const equipOld65=equipTo;equipTo=function(i,n){let who=partyNames()[i];let r=equipOld65(i,n);if(HEROES65.includes(who))S.heroEquipment65[who]={...S.equipment[i]};save();return r};
 const setOld65=setMember;setMember=function(slot,name){syncFromParty65();let r=setOld65(slot,name);syncToParty65();save();return r};
 const renderOld65=render;render=function(){syncToParty65();let r=renderOld65.apply(this,arguments);let logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION65;document.title='どろダン / DROP OF DUNGEON v0.68 CHARACTER SYSTEM';return r};
 save();render();
})();

;

(()=>{
 const VERSION66='v0.68';
 const NATURES66=[
  {id:'POWER',name:'豪腕',desc:'攻撃成長が高い',atk:1.10,def:.97,hp:1},
  {id:'GUARD',name:'堅牢',desc:'HP・防御成長が高い',atk:.97,def:1.10,hp:1.08},
  {id:'SWIFT',name:'俊敏',desc:'会心が高い',atk:1.03,def:.98,hp:1,crit:5},
  {id:'BALANCE',name:'均整',desc:'バランス型',atk:1,def:1,hp:1}
 ];
 function hash66(n){let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))>>>0;return h}
 function g66(n){let g=typeof growth52==='function'?growth52(n):ensureGrowth42(n);if(!g.nature66)g.nature66=NATURES66[hash66(n)%NATURES66.length].id;if(!g.joinId66)g.joinId66='M-'+(hash66(n)%9999).toString().padStart(4,'0');return g}
 function nature66(n){let g=g66(n);return NATURES66.find(x=>x.id===g.nature66)||NATURES66[3]}
 function style66(n){let x=(typeof COMPANION_GROWTH_STYLE!=='undefined'&&COMPANION_GROWTH_STYLE[n])||{hp:6,mp:2,atk:4,def:2};let vals={HP:x.hp||0,MP:(x.mp||0)*2,攻撃:(x.atk||0)*1.7,防御:(x.def||0)*1.8};return Object.entries(vals).sort((a,b)=>b[1]-a[1])[0][0]+'型'}
 function variant66(n){let g=g66(n);return n==='黄金スライム'?'SPECIAL':g.variant52||'NORMAL'}
 function vclass66(n){return variant66(n)==='SPECIAL'?'special':variant66(n)==='RARE'?'rare':''}
 function vlabel66(n){return variant66(n)==='SPECIAL'?'SPECIAL':variant66(n)==='RARE'?'RARE':'NORMAL'}
 function calc66(n){let b=baseFor(n),na=nature66(n),crit=5+(na.crit||0);return {hp:Math.floor(b.hp*(na.hp||1)),mp:b.mp,atk:Math.floor(b.atk*(na.atk||1)),def:Math.floor(b.def*(na.def||1)),crit}}
 function monsterDetail66(n){if(!S.monsterCompanions.includes(n))return;let g=g66(n),b=calc66(n),na=nature66(n),tr=(typeof COMPANION_TRAITS!=='undefined'&&COMPANION_TRAITS[n])||{name:'個性',desc:'標準的な能力'},sk=(typeof COMPANION_SKILLS!=='undefined'&&COMPANION_SKILLS[n]),rank=typeof bondRank==='function'?bondRank(n):'D',need=compNeed(g.lv),pct=Math.min(100,(g.exp||0)/need*100),bond=Math.min(100,(g.bond||0)/3),slot=partyNames().indexOf(n);open('仲間モンスター詳細',`<div class="monDetail66"><h2 class="${variant66(n)==='SPECIAL'?'special66':variant66(n)==='RARE'?'rare66':''}">${variant66(n)!=='NORMAL'?'✦ ':''}${n}</h2><div><span class="monBadge66">${vlabel66(n)}</span><span class="monBadge66">${style66(n)}</span><span class="monBadge66 nature66">${na.name}</span><span class="monBadge66">${g.joinId66}</span></div><div class="small">Lv.${g.lv}　EXP ${g.exp||0}/${need}</div><div class="monBar66"><i style="width:${pct}%"></i></div><div class="monStats66"><div>HP<b>${b.hp}</b></div><div>MP<b>${b.mp}</b></div><div>攻撃<b>${b.atk}</b></div><div>防御<b>${b.def}</b></div></div><div class="panel"><b>個体・成長</b><p class="small">性格：<b class="nature66">${na.name}</b> — ${na.desc}<br>成長タイプ：<b>${style66(n)}</b><br>個体：<b>${vlabel66(n)}</b>${variant66(n)==='RARE'?' — 希少個体ボーナス対象':''}</p></div><div class="panel"><b>特性</b><p class="small">${tr.name} — ${tr.desc}</p><b>固有スキル</b><p class="small">${sk?sk.name+' '+(typeof tierName52==='function'?tierName52(n):'Ⅰ'):'なし'}${sk?' / 発動率 '+Math.round(sk.rate*100)+'%':''}</p></div><div class="panel"><b>絆 ${rank}</b><div class="bondTrack66"><i style="width:${bond}%"></i></div><p class="small">${g.bond||0}/300　戦闘参加 ${g.battles||0}回<br>Lv10：Ⅱ / Lv20：Ⅲ / Lv30：奥義</p></div><div class="monActions66"><button data-m66slot="1">2枠へ</button><button data-m66slot="2">3枠へ</button><button data-m66back>一覧</button></div><p class="small">現在：${slot>0?(slot+1)+'枠に編成中':'待機中'}</p></div>`);document.querySelectorAll('[data-m66slot]').forEach(b=>b.onclick=()=>{setMember(+b.dataset.m66slot,n);monsterDetail66(n)});let bk=document.querySelector('[data-m66back]');if(bk)bk.onclick=()=>monsterHub66('all')}
 function monsterHub66(filter='all'){S.monsterCompanions.forEach(g66);let arr=[...S.monsterCompanions];if(filter==='active')arr=arr.filter(n=>partyNames().includes(n));if(filter==='rare')arr=arr.filter(n=>variant66(n)!=='NORMAL');open('仲間モンスター',`<div class="panel"><b>MONSTER BOND</b><p class="small">仲間 ${S.monsterCompanions.length}体 / 編成可能：2枠目・3枠目<br>個別Lv・EXP・性格・成長タイプ・絆・固有スキル・希少個体を管理</p></div><div class="monFilter66"><button data-mf66="all" class="${filter==='all'?'on':''}">すべて</button><button data-mf66="active" class="${filter==='active'?'on':''}">編成中</button><button data-mf66="rare" class="${filter==='rare'?'on':''}">希少</button></div><div class="monHub66">${arr.length?arr.map(n=>{let g=g66(n),na=nature66(n),sk=(typeof COMPANION_SKILLS!=='undefined'&&COMPANION_SKILLS[n]),need=compNeed(g.lv),pct=Math.min(100,(g.exp||0)/need*100);return `<div class="monCard66 ${vclass66(n)}"><div class="monTop66"><b>${variant66(n)!=='NORMAL'?'✦ ':''}${n}</b><span class="small">Lv.${g.lv}</span></div><div class="monMeta66">${vlabel66(n)} / ${style66(n)} / <span class="nature66">${na.name}</span></div><div class="monBar66"><i style="width:${pct}%"></i></div><div class="monMeta66">絆 ${typeof bondRank==='function'?bondRank(n):'D'} ${g.bond||0}/300<br>固有：${sk?sk.name:'なし'}${partyNames().includes(n)?' / 編成中':''}</div><div class="monActions66"><button data-ms66="1" data-mn66="${n}">2枠</button><button data-ms66="2" data-mn66="${n}">3枠</button><button data-md66="${n}">詳細</button></div></div>`}).join(''):'<div class="panel"><p class="small">条件に合う仲間はいません。</p></div>'}</div>`);document.querySelectorAll('[data-mf66]').forEach(b=>b.onclick=()=>monsterHub66(b.dataset.mf66));document.querySelectorAll('[data-ms66]').forEach(b=>b.onclick=()=>{setMember(+b.dataset.ms66,b.dataset.mn66);monsterHub66(filter)});document.querySelectorAll('[data-md66]').forEach(b=>b.onclick=()=>monsterDetail66(b.dataset.md66))}
 // Route every existing monster-management entry point to the unified v0.68 manager.
 const pv66=partyView;partyView=function(mode='members'){if(mode==='monsters')return monsterHub66('all');return pv66(mode)};
 window.monsterHub66=monsterHub66;window.monsterDetail66=monsterDetail66;
 // Future monsters registered in MONSTERS automatically receive a persistent growth record after recruitment.
 S.monsterCompanions.forEach(g66);save();
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=VERSION66;document.title='どろダン / DROP OF DUNGEON v0.68 MONSTER SYSTEM';render();
})();

;

(()=>{
 const VERSION68='v0.68';
 let filter68='すべて';
 function cost68(n){return window.__forge53.cost(n)}
 function baseStats68(n){let x=item(n)||{};return {atk:x.atk||0,def:x.def||0,crit:x.crit||0}}
 function bonusAt68(n,lv){let x=item(n)||{},rate=.04*lv;return {atk:Math.floor((x.atk||0)*rate),def:Math.floor((x.def||0)*rate),crit:lv>=5&&x.type==='アクセサリー'?Math.floor(lv/5):0}}
 function statLine68(n,lv){let a=baseStats68(n),b=bonusAt68(n,lv);return `攻 ${a.atk+b.atk} / 防 ${a.def+b.def}${(a.crit+b.crit)?` / 会 ${a.crit+b.crit}%`:''}`}
 function canForge68(n){let l=window.__forge53.lv(n);if(l>=10)return false;let c=cost68(n);return S.forgeMaterial>=c.mat&&S.gold>=c.gold}
 function forgeView68(){
   let gear=[...new Set(S.owned.filter(n=>{let x=item(n);return x&&['武器','防具','アクセサリー'].includes(x.type)}))];
   if(filter68!=='すべて')gear=gear.filter(n=>(item(n)||{}).type===filter68);
   gear.sort((a,b)=>(window.__forge53.lv(b)-window.__forge53.lv(a))||(((item(b)||{}).rar==='PHANTOM')-((item(a)||{}).rar==='PHANTOM'))||a.localeCompare(b,'ja'));
   let maxed=gear.filter(n=>window.__forge53.lv(n)>=10).length;
   open('星鍛冶屋',`<div class="forgeHero"><div class="anvil53">⚒️</div><h2>星鍛冶屋</h2><p class="small">お気に入りの装備を+10まで鍛え、戦力を伸ばす</p></div><div class="forge68summary"><div><span>強化石</span><b>◆ ${S.forgeMaterial||0}</b></div><div><span>手持ち</span><b>${S.gold.toLocaleString()}G</b></div><div><span>+10装備</span><b>${maxed}</b></div></div><div class="forge68tabs">${['すべて','武器','防具','アクセサリー'].map(x=>`<button data-f68="${x}" class="${filter68===x?'on':''}">${x}</button>`).join('')}</div><div class="forgeNote53">強化前と強化後の実性能を確認してから実行できます。強化は必ず成功し、失敗・破壊はありません。</div><div class="panel">${gear.length?gear.map(n=>{let x=item(n),l=window.__forge53.lv(n),next=Math.min(10,l+1),c=l<10?cost68(n):null,equipped=S.equipment.some(eq=>Object.values(eq).includes(n)),locked=!!S.locks[n],gain=bonusAt68(n,next),now=bonusAt68(n,l);return `<div class="forge68card"><div class="forge68head"><div><b class="${rarityClass(x.rar)}">${n}</b> ${equipped?'<span class="forge68eq">装備中</span>':''}${locked?'<span class="forge68eq">🔒</span>':''}<div class="small">${x.type} / ${x.rar}</div></div><div class="forge68lv">${l>=10?'MAX':`+${l}`}</div></div><div class="forge68bar"><i style="width:${l*10}%"></i></div><div class="forge68preview"><div><small>現在 +${l}</small><strong>${statLine68(n,l)}</strong></div><div class="forge68arrow">→</div><div><small>${l>=10?'最大強化':`強化後 +${next}`}</small><strong class="${l<10?'forge68gain':''}">${statLine68(n,next)}</strong></div></div>${l<10?`<div class="forge68cost">必要：強化石 <b>${c.mat}</b> / <b>${c.gold.toLocaleString()}G</b>　増加：攻+${gain.atk-now.atk} / 防+${gain.def-now.def}${gain.crit-now.crit?` / 会心+${gain.crit-now.crit}%`:''}</div><div class="forge68actions"><button class="main68" data-up68="${n}" ${canForge68(n)?'':'disabled'}>+${next}へ強化</button><button data-mat68="${n}" ${equipped||locked?'disabled':''}>素材化 +${window.__forge53.rarMat[x.rar]||1}</button></div>`:`<div class="forge68actions"><button disabled>最大強化済み</button><button data-mat68="${n}" ${equipped||locked?'disabled':''}>素材化 +${window.__forge53.rarMat[x.rar]||1}</button></div>`}<div class="forge68safe">${equipped?'装備中のため素材化不可　':''}${locked?'ロック中のため素材化不可':''}</div></div>`}).join(''):'<p class="small">対象装備がありません。</p>'}</div>`);
   document.querySelectorAll('[data-f68]').forEach(b=>b.onclick=()=>{filter68=b.dataset.f68;forgeView68()});
   document.querySelectorAll('[data-up68]').forEach(b=>b.onclick=()=>{let n=b.dataset.up68;if(!canForge68(n))return;window.__forge53.enhance(n);setTimeout(forgeView68,500)});
   document.querySelectorAll('[data-mat68]').forEach(b=>b.onclick=()=>{window.__forge53.dismantle(b.dataset.mat68);setTimeout(forgeView68,50)});
 }
 window.forgeView53=forgeView68;
 forgeView53=forgeView68;
 const oldRender68=render;render=function(){let z=oldRender68.apply(this,arguments);let e=document.querySelector('.logo small');if(e)e.textContent=VERSION68;document.title='どろダン / DROP OF DUNGEON v0.68 FORGE COMPLETE';return z};
 let e=document.querySelector('.logo small');if(e)e.textContent=VERSION68;document.title='どろダン / DROP OF DUNGEON v0.68 FORGE COMPLETE';save();render();
})();

;

(()=>{
 const VERSION69='v0.69'; let tab69='モンスター';
 S.encounters56=S.encounters56||{}; S.dropFound=S.dropFound||{}; S.kills=S.kills||{};
 const mons69=()=>[...new Set([...Object.keys(MONSTERS),...Object.keys(S.kills)])];
 const drops69=n=>n==='黄金スライム'?[specialItems['幻の金冠']]:(drops[n]||[]);
 function area69(n){for(const st of stages){if((st.enemies||[]).includes(n)||st.bossMonster===n)return st.area}return n==='黄金スライム'?'特殊':'その他'}
 function gear69(){let a=[...shop,...Object.values(drops).flat(),...Object.values(specialItems)].filter(x=>x&&['武器','防具','アクセサリー'].includes(x.type)),m=new Map();a.forEach(x=>m.set(x.n,x));return [...m.values()]}
 function source69(n){let s=[];shop.forEach(x=>{if(x.n===n)s.push('ショップ')});Object.entries(drops).forEach(([m,a])=>a.forEach(x=>{if(x.n===n)s.push(m)}));if(n==='幻の金冠')s.push('黄金スライム');return [...new Set(s)].join(' / ')||'特殊入手'}
 function collectedGear69(n){return (S.owned||[]).includes(n)||S.equipment.some(e=>Object.values(e).includes(n))||!!S.dropFound[n]}
 function monsterProgress69(){let m=mons69(),got=0,total=0;m.forEach(n=>{total++;if(S.seen[n])got++;let c=MONSTERS[n];if(c&&c.recruit){total++;if(S.monsterCompanions.includes(n))got++}drops69(n).forEach(d=>{total++;if(S.dropFound[d.n])got++})});return{got,total,pct:total?Math.floor(got/total*100):0}}
 function gearProgress69(){let g=gear69(),got=g.filter(x=>collectedGear69(x.n)).length;return{got,total:g.length,pct:g.length?Math.floor(got/g.length*100):0}}
 function overall69(){let a=monsterProgress69(),b=gearProgress69();return{got:a.got+b.got,total:a.total+b.total,pct:(a.total+b.total)?Math.floor((a.got+b.got)/(a.total+b.total)*100):0}}
 function tabs(){return `<div class="book69tabs">${['モンスター','装備','収集率'].map(t=>`<button class="${t===tab69?'on':''}" data-b69="${t}">${t}</button>`).join('')}</div>`}
 function monsterView(){let m=mons69(),seen=m.filter(n=>S.seen[n]).length,joined=m.filter(n=>S.monsterCompanions.includes(n)).length,kills=Object.values(S.kills).reduce((a,b)=>a+(+b||0),0);return `<div class="book69sum"><div><span>発見</span><b>${seen}/${m.length}</b></div><div><span>仲間</span><b>${joined}</b></div><div><span>総討伐</span><b>${kills}</b></div></div>${m.map(n=>{let seen=!!S.seen[n],cfg=MONSTERS[n],joined=S.monsterCompanions.includes(n),g=joined&&typeof ensureGrowth42==='function'?ensureGrowth42(n):null;return `<div class="book69card ${seen?'':'locked'}"><div class="book69top"><div><h3 class="${n==='黄金スライム'?'rar-phantom':''}">${seen?n:'???'}</h3><div class="book69meta">${seen?area69(n):'未発見'} / 遭遇 ${seen?(S.encounters56[n]||1):0} / 討伐 ${S.kills[n]||0}</div></div><span class="book69tag ${joined?'book69got':'book69miss'}">${cfg?.recruit?(joined?'✓ 仲間化':'??? 仲間化'):'BOSS'}</span></div>${g?`<div><span class="book69tag">Lv.${g.lv}</span><span class="book69tag">絆${typeof bondRank==='function'?bondRank(n):'-'}</span>${g.variant52==='RARE'?'<span class="book69tag rar-rare">希少個体</span>':''}</div>`:''}<div class="book69drops"><b>DROP</b><br>${seen?drops69(n).map(d=>S.dropFound[d.n]?`<span class="${rarityClass(d.rar)} book69got">✓ ${d.n}${S.gearQuality?.[d.n]?` [BEST ${Math.round(S.gearQuality[d.n]*100)}%]`:''}</span>`:`<span class="book69miss">???　${d.rar||'NORMAL'}　1/${d.r||'特殊'}</span>`).join('<br>'):'???'}</div></div>`}).join('')}`}
 function gearView(){let g=gear69(),got=g.filter(x=>collectedGear69(x.n)).length;return `<div class="book69sum"><div><span>装備発見</span><b>${got}/${g.length}</b></div><div><span>未発見</span><b>${g.length-got}</b></div><div><span>収集率</span><b>${g.length?Math.floor(got/g.length*100):0}%</b></div></div><div class="book69gear">${g.sort((a,b)=>({LEGEND:5,PHANTOM:4,EPIC:3,RARE:2,NORMAL:1}[b.rar]||0)-({LEGEND:5,PHANTOM:4,EPIC:3,RARE:2,NORMAL:1}[a.rar]||0)).map(x=>{let got=collectedGear69(x.n),q=S.gearQuality?.[x.n];return `<div class="book69card ${got?'':'locked'}"><div class="book69top"><div><h3 class="${got?rarityClass(x.rar):''}">${got?x.n:'???'}</h3><div class="book69meta">${got?`${x.type} / ${x.rar||'NORMAL'}`:'未発見装備'}</div></div><span class="book69tag ${got?'book69got':'book69miss'}">${got?'✓ 入手済':'未入手'}</span></div>${got?`<div class="book69drops">${x.desc||''}<br>入手先：${source69(x.n)}${q?`<br>BEST品質：${Math.round(q*100)}%`:''}</div>`:`<div class="book69drops book69miss">入手するまで名称・性能・入手先は？？？</div>`}</div>`}).join('')}</div>`}
 function collectionView(){let areas=[...new Set(stages.map(s=>s.area))],o=overall69(),mp=monsterProgress69(),gp=gearProgress69();return `<div class="book69sum"><div><span>総合</span><b>${o.pct}%</b></div><div><span>モンスター系</span><b>${mp.pct}%</b></div><div><span>装備</span><b>${gp.pct}%</b></div></div><div class="book69card"><b>総合 COLLECTION ${o.got}/${o.total}</b><div class="book69bar"><i style="width:${o.pct}%"></i></div></div>${areas.map(a=>{let ms=mons69().filter(n=>area69(n)===a),got=0,total=0;ms.forEach(n=>{total++;if(S.seen[n])got++;let c=MONSTERS[n];if(c?.recruit){total++;if(S.monsterCompanions.includes(n))got++}drops69(n).forEach(d=>{total++;if(S.dropFound[d.n])got++})});let p=total?Math.floor(got/total*100):0;return `<div class="book69area"><div class="book69areahead"><span>${a}</span><span>${p}%</span></div><div class="book69bar"><i style="width:${p}%"></i></div><small>${got}/${total} COLLECTION</small></div>`}).join('')}<div class="book69card"><b>未発見要素</b><div class="book69meta">未遭遇モンスター・未加入仲間・未取得DROP・未取得装備は「？？？」で保持されます。</div></div>`}
 function view69(t=tab69){tab69=t;open('図鑑',`<div class="book69hero"><b>MOFURUKU COLLECTION BOOK</b><small>遭遇・討伐・仲間・DROP・装備・BEST品質を一冊に記録</small></div>${tabs()}${t==='モンスター'?monsterView():t==='装備'?gearView():collectionView()}`);document.querySelectorAll('[data-b69]').forEach(b=>b.onclick=()=>view69(b.dataset.b69))}
 window.bookView=view69;
 const oldRender69=render;render=function(){let z=oldRender69.apply(this,arguments);let e=document.querySelector('.logo small');if(e)e.textContent=VERSION69;document.title='どろダン / DROP OF DUNGEON v0.69 COLLECTION BOOK';return z};
 document.title='どろダン / DROP OF DUNGEON v0.69 COLLECTION BOOK';save();render();
})();

;

(()=>{
 const VERSION651='v0.68';
 let tab651='武器',sort651='レア度順',open651='';
 const tabs651=['武器','防具','アクセサリー','消耗品'];
 const rank651={LEGEND:5,PHANTOM:4,EPIC:3,RARE:2,NORMAL:1};
 function cat651(n){let c=categoryOf(n);return c==='アイテム'?'消耗品':c}
 function unique651(){let a=[],seen=new Set();for(let i=S.owned.length-1;i>=0;i--){let n=S.owned[i];if(!seen.has(n)){seen.add(n);a.push(n)}}return a}
 function source651(n){try{return typeof dropSource43==='function'?dropSource43(n):''}catch(e){return ''}}
 function score651(n){let x=item(n)||{};return (x.atk||0)*2+(x.def||0)*1.6+(x.crit||0)*3+(rank651[x.rar]||0)*20}
 function sorted651(arr){return arr.sort((a,b)=>{if(sort651==='強さ順')return score651(b)-score651(a);if(sort651==='新着順')return unique651().indexOf(a)-unique651().indexOf(b);let A=item(a)||{},B=item(b)||{};return (rank651[B.rar]||0)-(rank651[A.rar]||0)||score651(b)-score651(a)})}
 function compactCard651(n){let x=item(n)||{},type=cat651(n),cnt=countOwned(n),locked=!!S.locks[n],equipped=S.equipment.some(eq=>Object.values(eq).includes(n)),q=S.gearQuality&&S.gearQuality[n],src=source651(n),aff=S.gearAffixes60&&S.gearAffixes60[n],forge=typeof forgeLv53==='function'?forgeLv53(n):0;let title=n+(forge?` +${forge}`:'')+(cnt>1?` ×${cnt}`:'');let stat=x.desc||'';let compare=['武器','防具','アクセサリー'].includes(type)&&typeof compareText==='function'?compareText(x):'';
 return `<div class="inv651card ${open651===n?'open':''}" data-card651="${n}"><div class="inv651top"><div><div class="inv651name ${rarityClass(x.rar)}">${title} <span class="inv651badge">${type}</span>${q?`<span class="inv651quality">${Math.round(q*100)}%</span>`:''}</div><div class="inv651meta">${stat}</div>${src?`<div class="inv651drop">DROP：${src}</div>`:''}</div><div class="inv651actions"><button data-detail651="${n}">${open651===n?'閉じる':'詳細・比較'}</button><button data-lock651="${n}">${locked?'🔒':'🔓'}</button></div></div><div class="inv651detail">${aff&&aff.length?`<div class="inv651affix">特殊能力：${aff.map(a=>`${a.n}+${a.v}%`).join(' / ')}</div>`:''}<div class="inv651compare">${compare}</div><div class="inv651equipBtns">${['武器','防具','アクセサリー'].includes(type)?`<button class="miniBtn" data-eq651="${n}">${equipped?'装備変更':'装備する'}</button>`:''}<button class="miniBtn danger" data-trash651="${n}" ${equipped||locked?'disabled':''}>捨てる</button></div></div></div>`}
 function consumables651(){let rows=[];rows.push(`<div class="inv651card"><div class="inv651top"><div><div class="inv651name">🌿 薬草</div><div class="inv651meta">味方1人のHPを35回復</div></div><b>${S.herb||0}個</b></div></div>`);let c=S.consumables56||{};['上薬草','特薬草'].forEach(n=>rows.push(`<div class="inv651card"><div class="inv651top"><div><div class="inv651name">${n}</div><div class="inv651meta">${n==='上薬草'?'HPを中回復':'HPを大回復'}</div></div><b>${c[n]||0}個</b></div></div>`));rows.push(`<div class="inv651card"><div class="inv651top"><div><div class="inv651name revive">💧 生命の雫</div><div class="inv651meta">戦闘不能の仲間をHP50%で復活</div></div><span><b>${S.revive||0}個</b> <button class="miniBtn" id="useRevive651">使う</button></span></div></div>`);return rows.join('')}
 function itemView651(tab=tab651){tab651=tab;let list=sorted651(unique651().filter(n=>cat651(n)===tab651));open('持ち物・装備',`<div class="inv651bar"><div class="inv651tabs">${tabs651.map(t=>`<button class="${t===tab651?'on':''}" data-tab651="${t}">${t}</button>`).join('')}</div>${tab651!=='消耗品'?`<div class="inv651sort">${['レア度順','強さ順','新着順'].map(s=>`<button class="${s===sort651?'on':''}" data-sort651="${s}">${s}</button>`).join('')}</div>`:''}</div><div class="inv651list">${tab651==='消耗品'?consumables651():(list.length?list.map(compactCard651).join(''):'<div class="inv651empty">このカテゴリの装備はありません</div>')}</div>${tab651!=='消耗品'?'<div class="bulkbar"><button class="miniBtn danger" id="bulkNormal651">未ロック通常品を一括処分</button></div>':''}`);
 document.querySelectorAll('[data-tab651]').forEach(b=>b.onclick=()=>{open651='';itemView651(b.dataset.tab651)});document.querySelectorAll('[data-sort651]').forEach(b=>b.onclick=()=>{sort651=b.dataset.sort651;itemView651()});document.querySelectorAll('[data-detail651]').forEach(b=>b.onclick=()=>{open651=open651===b.dataset.detail651?'':b.dataset.detail651;itemView651()});document.querySelectorAll('[data-lock651]').forEach(b=>b.onclick=()=>{let n=b.dataset.lock651;S.locks[n]=!S.locks[n];save();itemView651()});document.querySelectorAll('[data-trash651]').forEach(b=>b.onclick=()=>discard(b.dataset.trash651));document.querySelectorAll('[data-eq651]').forEach(b=>b.onclick=()=>chooseEquip(b.dataset.eq651));let rv=document.getElementById('useRevive651');if(rv)rv.onclick=()=>useRevive();let bn=document.getElementById('bulkNormal651');if(bn)bn.onclick=()=>bulkDiscard();}
 window.itemView=itemView651;
 const r0=render;render=function(){let r=r0.apply(this,arguments);let e=document.querySelector('.logo small');if(e)e.textContent=VERSION651;document.title='どろダン / DROP OF DUNGEON v0.68 INVENTORY UI';return r};
 let e=document.querySelector('.logo small');if(e)e.textContent=VERSION651;document.title='どろダン / DROP OF DUNGEON v0.68 INVENTORY UI';save();render();
})();

;

(()=>{
 const VERSION67='v0.68';
 let tab67='武器',sort67='レア度順',filter67='すべて',open67='';
 const tabs=['武器','防具','アクセサリー','消耗品'], ranks={LEGEND:5,PHANTOM:4,EPIC:3,RARE:2,NORMAL:1};
 const cat=n=>{let c=categoryOf(n);return c==='アイテム'?'消耗品':c};
 function uniq(){let a=[],z=new Set();for(let i=S.owned.length-1;i>=0;i--){let n=S.owned[i];if(!z.has(n)){z.add(n);a.push(n)}}return a}
 function src(n){try{return typeof dropSource43==='function'?dropSource43(n):''}catch(e){return ''}}
 function aff(n){return (S.gearAffixes60&&S.gearAffixes60[n])||[]}
 function q(n){return (S.gearQuality&&S.gearQuality[n])||1}
 function score(n){let x=item(n)||{},a=aff(n),base=(x.atk||0)*2+(x.def||0)*1.6+(x.crit||0)*3;return Math.round((base+(ranks[x.rar]||0)*20+a.reduce((v,o)=>v+(+o.v||0)*2,0))*q(n))}
 function isBest(n){return !!(S.gearQuality&&S.gearQuality[n]) || !!(S.gearAffixBest60&&S.gearAffixBest60[n])}
 function passes(n){let x=item(n)||{};if(filter67==='すべて')return true;if(filter67==='BEST')return isBest(n);if(filter67==='特殊能力')return aff(n).length>0;return x.rar===filter67}
 function sorted(a){return a.sort((x,y)=>{if(sort67==='強さ順')return score(y)-score(x);if(sort67==='新着順')return uniq().indexOf(x)-uniq().indexOf(y);let A=item(x)||{},B=item(y)||{};return (ranks[B.rar]||0)-(ranks[A.rar]||0)||score(y)-score(x)})}
 function card(n){let x=item(n)||{},type=cat(n),cnt=countOwned(n),locked=!!S.locks[n],equipped=S.equipment.some(e=>Object.values(e).includes(n)),qq=S.gearQuality&&S.gearQuality[n],aa=aff(n),forge=typeof forgeLv53==='function'?forgeLv53(n):0,source=src(n),comp=typeof compareText==='function'?compareText(x):'';return `<div class="inv651card loot67card r${x.rar||'NORMAL'} ${open67===n?'open':''}"><div class="inv651top"><div><div class="inv651name ${rarityClass(x.rar)}">${n}${forge?` +${forge}`:''}${cnt>1?` ×${cnt}`:''} <span class="inv651badge">${type}</span>${qq?`<span class="inv651quality">${Math.round(qq*100)}%</span>`:''}${isBest(n)?'<span class="loot67best">BEST</span>':''}</div><div class="inv651meta">${x.desc||''}</div><div class="loot67score">LOOT SCORE ${score(n)}</div>${source?`<div class="inv651drop">DROP：${source}</div>`:''}</div><div class="inv651actions"><button data-d67="${n}">${open67===n?'閉じる':'詳細'}</button><button data-l67="${n}">${locked?'🔒':'🔓'}</button></div></div><div class="inv651detail">${aa.length?`<div class="loot67aff"><b>特殊能力</b><br>${aa.map(o=>`<span>${o.n}+${o.v}%</span>`).join('')}</div>`:'<div class="inv651meta">特殊能力なし</div>'}<div class="inv651compare">${comp}</div><div class="inv651equipBtns"><button class="miniBtn" data-e67="${n}">${equipped?'装備変更':'装備する'}</button><button class="miniBtn danger" data-t67="${n}" ${equipped||locked?'disabled':''}>捨てる</button></div></div></div>`}
 function consumables(){let c=S.consumables56||{};return `<div class="inv651card"><div class="inv651top"><div><b>🌿 薬草</b><div class="inv651meta">HPを35回復</div></div><b>${S.herb||0}個</b></div></div><div class="inv651card"><div class="inv651top"><div><b>上薬草</b><div class="inv651meta">HPを中回復</div></div><b>${c['上薬草']||0}個</b></div></div><div class="inv651card"><div class="inv651top"><div><b>特薬草</b><div class="inv651meta">HPを大回復</div></div><b>${c['特薬草']||0}個</b></div></div><div class="inv651card"><div class="inv651top"><div><b>💧 生命の雫</b><div class="inv651meta">戦闘不能の味方1人をHP50%で復活</div></div><span><b>${S.revive||0}個</b> <button class="miniBtn" id="rv67">使う</button></span></div></div>`}
 function bulk67(){let equipped=new Set(S.equipment.flatMap(e=>Object.values(e))),before=S.owned.length;S.owned=S.owned.filter(n=>{let x=item(n)||{};return x.rar!=='NORMAL'||S.locks[n]||equipped.has(n)||isBest(n)||aff(n).length||['木の剣','旅人の服','小さなお守り'].includes(n)});let cut=before-S.owned.length;save();toast(`${cut}個を一括処分（BEST・特殊能力品は保護）`);view()}
 function view(tab=tab67){tab67=tab;let all=uniq().filter(n=>cat(n)===tab67),list=sorted(all.filter(passes)),rare=all.filter(n=>(ranks[(item(n)||{}).rar]||0)>=2).length,best=all.filter(isBest).length,special=all.filter(n=>aff(n).length).length;open('持ち物・装備',`<div class="inv651bar"><div class="inv651tabs">${tabs.map(t=>`<button class="${t===tab67?'on':''}" data-tab67="${t}">${t}</button>`).join('')}</div>${tab67!=='消耗品'?`<div class="inv651sort">${['レア度順','強さ順','新着順'].map(v=>`<button class="${v===sort67?'on':''}" data-sort67="${v}">${v}</button>`).join('')}</div><div class="loot67filters">${['すべて','BEST','特殊能力','LEGEND','PHANTOM','EPIC','RARE'].map(v=>`<button class="${v===filter67?'on':''}" data-filter67="${v}">${v}</button>`).join('')}</div>`:''}</div>${tab67!=='消耗品'?`<div class="loot67summary"><div><small>所持種類</small><b>${all.length}</b></div><div><small>RARE以上</small><b>${rare}</b></div><div><small>BEST/特殊</small><b>${best}/${special}</b></div></div>`:''}<div class="inv651list">${tab67==='消耗品'?consumables():(list.length?list.map(card).join(''):'<div class="inv651empty">条件に合う装備はありません</div>')}</div>${tab67!=='消耗品'?'<div class="loot67warn">一括処分ではロック・装備中・BEST・特殊能力付き装備を自動保護します。</div><div class="loot67bulk"><button class="miniBtn danger" id="bulk67">未ロック通常品を一括処分</button></div>':''}`);
 document.querySelectorAll('[data-tab67]').forEach(b=>b.onclick=()=>{open67='';filter67='すべて';view(b.dataset.tab67)});document.querySelectorAll('[data-sort67]').forEach(b=>b.onclick=()=>{sort67=b.dataset.sort67;view()});document.querySelectorAll('[data-filter67]').forEach(b=>b.onclick=()=>{filter67=b.dataset.filter67;view()});document.querySelectorAll('[data-d67]').forEach(b=>b.onclick=()=>{open67=open67===b.dataset.d67?'':b.dataset.d67;view()});document.querySelectorAll('[data-l67]').forEach(b=>b.onclick=()=>{let n=b.dataset.l67;S.locks[n]=!S.locks[n];save();view()});document.querySelectorAll('[data-e67]').forEach(b=>b.onclick=()=>chooseEquip(b.dataset.e67));document.querySelectorAll('[data-t67]').forEach(b=>b.onclick=()=>discard(b.dataset.t67));let bn=document.getElementById('bulk67');if(bn)bn.onclick=bulk67;let rv=document.getElementById('rv67');if(rv)rv.onclick=()=>useRevive()}
 window.itemView=view;
 const oldRender=render;render=function(){let z=oldRender.apply(this,arguments);let e=document.querySelector('.logo small');if(e)e.textContent=VERSION67;document.title='どろダン / DROP OF DUNGEON v0.68 LOOT HUNT';return z};
 let e=document.querySelector('.logo small');if(e)e.textContent=VERSION67;document.title='どろダン / DROP OF DUNGEON v0.68 LOOT HUNT';save();render();
})();

;

(function(){
 'use strict';
 const V='v0.70.1';
 const skyMons={
  'エアラビ':{icon:'hornrabbit',hp:168,atk:47,xp:166,recruit:0},
  'スカイゴーレム':{icon:'goblin',hp:228,atk:52,xp:194,recruit:0},
  'ウィンドホーク':{icon:'moonwolf',hp:154,atk:56,xp:186,recruit:0},
  'クラウドスライム':{icon:'slime',hp:184,atk:49,xp:178,recruit:0}
 };
 Object.assign(MONSTERS,skyMons);
 const skyStages=[
  {id:'s1',area:'天空遺跡',name:'天空遺跡 1',recommended:41,unlock:s=>!!s.clears.cb,unlockText:'呪われた古城ボス撃破で解放',enemies:['エアラビ','スカイゴーレム','ウィンドホーク','クラウドスライム'],mult:4.85},
  {id:'s2',area:'天空遺跡',name:'天空遺跡 2',recommended:45,unlock:s=>!!s.clears.cb&&s.lv>=45,unlockText:'古城ボス撃破＋Lv45で解放',enemies:['スカイゴーレム','ウィンドホーク','クラウドスライム','エアラビ'],mult:5.2}
 ];
 skyStages.forEach(st=>{if(!stages.some(x=>x.id===st.id))stages.push(st)});
 const cb=stages.find(x=>x.id==='cb');if(cb)cb.next='天空遺跡 1';
 Object.keys(skyMons).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 function applySky(){const app=document.querySelector('#app')||document.body;let on=false;try{on=stage().area==='天空遺跡'}catch(e){}app.classList.toggle('sky701',on)}
 const r0=render;render=function(){r0();applySky()};
 const sv0=stageView;stageView=function(){sv0();document.querySelectorAll('[data-stage]').forEach(row=>{if((row.textContent||'').includes('天空遺跡')){const b=row.querySelector('b');if(b&&!b.querySelector('.skyBadge701'))b.insertAdjacentHTML('beforeend',' <span class="skyBadge701">NEW</span>')}})};
 const logo=document.querySelector('.logo small');if(logo)logo.textContent=V;
 document.title='どろダン / DROP OF DUNGEON v0.70.1 SKY RUINS';
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.70.2';
 const skyNames=['エアラビ','スカイゴーレム','ウィンドホーク','クラウドスライム'];
 // Formalize recruitment and companion growth.
 Object.assign(MONSTERS,{
  'エアラビ':{icon:'hornrabbit',hp:168,atk:47,xp:166,recruit:620},
  'スカイゴーレム':{icon:'goblin',hp:228,atk:52,xp:194,recruit:760},
  'ウィンドホーク':{icon:'moonwolf',hp:154,atk:56,xp:186,recruit:700},
  'クラウドスライム':{icon:'slime',hp:184,atk:49,xp:178,recruit:650},
  '天空機神・アストライオス':{icon:'grassfang',hp:1980,atk:72,xp:1950,recruit:0}
 });
 Object.assign(BASE_MEMBERS,{
  'エアラビ':{hp:92,mp:32,atk:31,def:14,role:'風の俊足'},
  'スカイゴーレム':{hp:138,mp:18,atk:35,def:28,role:'天空の守護者'},
  'ウィンドホーク':{hp:98,mp:28,atk:39,def:15,role:'高速アタッカー'},
  'クラウドスライム':{hp:112,mp:36,atk:30,def:20,role:'雲の精霊'}
 });
 Object.assign(COMPANION_SKILLS,{
  'エアラビ':{name:'エアステップ',lv:8,mult:1.78,rate:.38},
  'スカイゴーレム':{name:'天空鉄拳',lv:8,mult:1.88,rate:.34},
  'ウィンドホーク':{name:'蒼風裂爪',lv:8,mult:1.94,rate:.38},
  'クラウドスライム':{name:'クラウドバースト',lv:8,mult:1.82,rate:.40}
 });
 Object.assign(COMPANION_TRAITS,{
  'エアラビ':{name:'追い風',desc:'攻撃+8%・会心+6%',atk:.08,crit:6},
  'スカイゴーレム':{name:'天空装甲',desc:'HP+12%・防御+15%',hp:.12,def:.15},
  'ウィンドホーク':{name:'風読み',desc:'攻撃+12%・会心+7%',atk:.12,crit:7},
  'クラウドスライム':{name:'雲体',desc:'HP+10%・防御+8%',hp:.10,def:.08}
 });
 Object.assign(COMPANION_GROWTH_STYLE,{
  'エアラビ':{hp:5,mp:3,atk:5,def:1},
  'スカイゴーレム':{hp:9,mp:1,atk:4,def:4},
  'ウィンドホーク':{hp:5,mp:2,atk:6,def:1},
  'クラウドスライム':{hp:7,mp:4,atk:4,def:3}
 });
 // Boss stage completes the 0.70.2 progression.
 const bossStage={id:'sb',area:'天空遺跡',name:'天空遺跡ボス',recommended:50,
  unlock:s=>!!s.clears.cb&&s.lv>=50,unlockText:'古城ボス撃破＋Lv50で解放',
  boss:true,bossMonster:'天空機神・アストライオス',enemies:['天空機神・アストライオス'],mult:5.85,next:'天空遺跡を踏破！'};
 if(!stages.some(x=>x.id==='sb'))stages.push(bossStage);
 const s2=stages.find(x=>x.id==='s2');if(s2)s2.next='天空遺跡ボス';
 Object.keys(MONSTERS).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 // Sky battle gimmick: wind pressure occasionally damages one active ally.
 const oldEnemy702=enemyTurn;
 enemyTurn=function(){
   oldEnemy702();
   let sky=false;try{sky=stage().area==='天空遺跡'}catch(e){}
   if(!sky||!aliveParty().length||!living().length)return;
   if(Math.random()<.18){
     const a=aliveParty(),i=a[Math.floor(Math.random()*a.length)];
     const d=Math.max(3,Math.floor(maxHp(i)*.045));
     S.hp[i]=Math.max(0,S.hp[i]-d);
     floatText('風-'+d,18+i*31,72,'wind702');
     showLog('🌪 天空の突風が吹き荒れた！',650);
     if(!aliveParty().length)wipe();save();
   }
 };
 const r0=render;render=function(){let z=r0.apply(this,arguments);const app=document.querySelector('#app')||document.body;let on=false;try{on=stage().area==='天空遺跡'}catch(e){}app.classList.toggle('sky702',on);let e=document.querySelector('.logo small');if(e)e.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.70.2 SKY RUINS';return z};
 const sv0=stageView;stageView=function(){sv0();document.querySelectorAll('[data-stage]').forEach(row=>{if((row.textContent||'').includes('天空遺跡ボス')){const b=row.querySelector('b');if(b&&!b.querySelector('.skyBoss702'))b.insertAdjacentHTML('beforeend',' <span class="skyBoss702">BOSS</span>')}})};
 let e=document.querySelector('.logo small');if(e)e.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.70.2 SKY RUINS';save();render();
})();

;

(function(){
 'use strict';
 const V='v0.70';
 Object.assign(drops,{
  'エアラビ':[
   {n:'風羽の欠片',r:14,rar:'NORMAL',type:'素材',desc:'天空遺跡を漂う軽い風羽'},
   {n:'蒼風の短剣',r:190,rar:'RARE',type:'武器',atk:48,def:2,crit:15,desc:'攻撃+48 / 防御+2 / 会心+15%'}
  ],
  'スカイゴーレム':[
   {n:'天空鋼片',r:15,rar:'NORMAL',type:'素材',desc:'天空機構に使われる軽量金属'},
   {n:'天空守護の鎧',r:340,rar:'EPIC',type:'防具',atk:8,def:54,crit:4,effect51:{bossDamage:.08},effectText51:'ボス特効+8%',desc:'攻撃+8 / 防御+54 / 会心+4% / ボス特効+8%'}
  ],
  'ウィンドホーク':[
   {n:'風切り羽',r:16,rar:'NORMAL',type:'素材',desc:'鋭い風をまとう翼羽'},
   {n:'天翔の指輪',r:360,rar:'EPIC',type:'アクセサリー',atk:16,def:7,crit:15,effect51:{critDamage:.16},effectText51:'会心威力+16%',desc:'攻撃+16 / 防御+7 / 会心+15% / 会心威力+16%'}
  ],
  'クラウドスライム':[
   {n:'雲核',r:15,rar:'NORMAL',type:'素材',desc:'凝縮した雲の魔力核'},
   {n:'雲海の護符',r:220,rar:'RARE',type:'アクセサリー',atk:11,def:16,crit:8,desc:'攻撃+11 / 防御+16 / 会心+8%'}
  ],
  '天空機神・アストライオス':[
   {n:'天空機神の心核',r:7,rar:'RARE',type:'素材',desc:'アストライオスの動力を宿す黄金核'},
   {n:'星天鎧アストライオス',r:75,rar:'EPIC',type:'防具',atk:18,def:62,crit:10,effect51:{bossDamage:.15},effectText51:'ボス特効+15%',desc:'攻撃+18 / 防御+62 / 会心+10% / ボス特効+15%'},
   {n:'天断剣・アストラル',r:1800,rar:'PHANTOM',type:'武器',atk:84,def:12,crit:23,effect51:{bossDamage:.22,critDamage:.28,lifeSteal:.07},effectText51:'ボス特効+22% / 会心威力+28% / 与ダメージ7%吸収',desc:'天空遺跡PHANTOM。攻撃+84 / 防御+12 / 会心+23%'}
  ]
 });
 // Initialize collection keys; existing loot engine supplies quality rolls, BEST, auto-lock and EPIC/PHANTOM AUTO stop.
 ['エアラビ','スカイゴーレム','ウィンドホーク','クラウドスライム','天空機神・アストライオス'].forEach(n=>{
   (drops[n]||[]).forEach(d=>{if(!Number.isFinite(S.dropFound[d.n]))S.dropFound[d.n]=0});
 });
 // Final visible build badge: the static badge is the user's actual on-screen version source.
 const badge=document.getElementById('buildVersion')||document.getElementById('buildVersion69');
 if(badge){badge.id='buildVersion';badge.textContent=V}
 const r0=render;render=function(){let z=r0.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}let e=document.querySelector('.logo small');if(e)e.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.70 SKY RUINS COMPLETE';return z};
 let e=document.querySelector('.logo small');if(e)e.textContent=V;
 document.title='どろダン / DROP OF DUNGEON v0.70 SKY RUINS COMPLETE';
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.1';
 const newMons={
  '獄炎の魔狼':{icon:'moonwolf',hp:318,atk:82,xp:278,recruit:0},
  '紅蓮デーモン':{icon:'demon',hp:352,atk:88,xp:304,recruit:0},
  '黒炎騎士':{icon:'skullknight',hp:405,atk:91,xp:326,recruit:0},
  'マグマドラゴン':{icon:'dragon',hp:472,atk:96,xp:358,recruit:0}
 };
 Object.assign(MONSTERS,newMons);
 const unlock711=s=>!!s.clears.sb;
 const add=[
  {id:'g1',area:'紅蓮魔界',name:'紅蓮魔界1',recommended:60,unlock:unlock711,unlockText:'天空遺跡ボス撃破で解放',enemies:['フレイムハウンド','マグマゴーレム','イグニスサーペント','ヘルスコーピオン','ブレイズデビル'],mult:6.35,next:'紅蓮魔界2'},
  {id:'g2',area:'紅蓮魔界',name:'紅蓮魔界2',recommended:65,unlock:s=>!!s.clears.g1,unlockText:'紅蓮魔界1クリアで解放',enemies:['ブレイズデビル','ヘルスコーピオン','イグニスサーペント','マグマゴーレム','フレイムハウンド'],mult:6.85,next:'？？？'}
 ];
 add.forEach(st=>{if(!stages.some(x=>x.id===st.id))stages.push(st)});
 const sb=stages.find(x=>x.id==='sb');if(sb)sb.next='紅蓮魔界1';
 Object.keys(newMons).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 const r0=render;render=function(){let z=r0.apply(this,arguments);const app=document.querySelector('#app')||document.body;let on=false;try{on=stage().area==='紅蓮魔界'}catch(e){}app.classList.toggle('guren711',on);let e=document.querySelector('.logo small');if(e)e.textContent=V;const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}document.title='どろダン / DROP OF DUNGEON v0.71.1 GUREN MAKAI';return z};
 const sv0=stageView;stageView=function(){sv0();document.querySelectorAll('[data-stage]').forEach(row=>{if((row.textContent||'').includes('紅蓮魔界')){const b=row.querySelector('b');if(b&&!b.querySelector('.gurenBadge711'))b.insertAdjacentHTML('beforeend',' <span class="gurenBadge711">NEW</span>')}})};
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 let e=document.querySelector('.logo small');if(e)e.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71.1 GUREN MAKAI';save();render();
})();

;

(function(){
 'use strict';
 const required711=[
  {id:'g1',area:'紅蓮魔界',name:'紅蓮魔界1',recommended:60,unlock:s=>!!s.clears.sb,unlockText:'天空遺跡ボス撃破で解放',enemies:['フレイムハウンド','マグマゴーレム','イグニスサーペント','ヘルスコーピオン','ブレイズデビル'],mult:6.35,next:'紅蓮魔界2'},
  {id:'g2',area:'紅蓮魔界',name:'紅蓮魔界2',recommended:65,unlock:s=>!!s.clears.g1,unlockText:'紅蓮魔界1クリアで解放',enemies:['ブレイズデビル','ヘルスコーピオン','イグニスサーペント','マグマゴーレム','フレイムハウンド'],mult:6.85,next:'？？？'}
 ];
 function ensure711(){
   required711.forEach(st=>{
     const i=stages.findIndex(x=>x.id===st.id);
     if(i<0)stages.push(st); else Object.assign(stages[i],st);
   });
   const sb=stages.find(x=>x.id==='sb');if(sb)sb.next='紅蓮魔界1';
 }
 ensure711();
 const oldStage711=stageView;
 stageView=function(){ensure711();return oldStage711.apply(this,arguments)};
 const oldRender711=render;
 render=function(){ensure711();let z=oldRender711.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent='v0.71.1'}return z};
 save();render();
})();

;

(function(){
 'use strict';
 function orderGuren711(){
   const g1=stages.find(x=>x.id==='g1'),g2=stages.find(x=>x.id==='g2');
   if(!g1||!g2)return;
   const rest=stages.filter(x=>x.id!=='g1'&&x.id!=='g2');
   const sb=rest.findIndex(x=>x.id==='sb');
   if(sb>=0)rest.splice(sb+1,0,g1,g2);else rest.push(g1,g2);
   stages.splice(0,stages.length,...rest);
 }
 orderGuren711();
 const prev711Order=stageView;
 stageView=function(){orderGuren711();return prev711Order.apply(this,arguments)};
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2';
 Object.assign(MONSTERS,{
  '獄炎の魔狼':{icon:'moonwolf',hp:318,atk:82,xp:278,recruit:950},
  '紅蓮デーモン':{icon:'demon',hp:352,atk:88,xp:304,recruit:1100},
  '黒炎騎士':{icon:'skullknight',hp:405,atk:91,xp:326,recruit:1350},
  'マグマドラゴン':{icon:'dragon',hp:472,atk:96,xp:358,recruit:1600},
  '煉獄魔王・ヴァルグレイン':{icon:'demon',hp:2850,atk:112,xp:2750,recruit:0}
 });
 Object.assign(BASE_MEMBERS,{
  '獄炎の魔狼':{hp:128,mp:30,atk:48,def:23,role:'獄炎の高速牙'},
  '紅蓮デーモン':{hp:142,mp:40,atk:51,def:27,role:'紅蓮魔術'},
  '黒炎騎士':{hp:170,mp:28,atk:54,def:38,role:'黒炎重騎士'},
  'マグマドラゴン':{hp:192,mp:35,atk:59,def:34,role:'灼熱竜'}
 });
 Object.assign(COMPANION_SKILLS,{
  '獄炎の魔狼':{name:'獄炎牙',lv:8,mult:2.02,rate:.38},
  '紅蓮デーモン':{name:'クリムゾンフレア',lv:8,mult:2.08,rate:.37},
  '黒炎騎士':{name:'黒炎断',lv:8,mult:2.14,rate:.35},
  'マグマドラゴン':{name:'煉獄ブレス',lv:8,mult:2.22,rate:.36}
 });
 Object.assign(COMPANION_TRAITS,{
  '獄炎の魔狼':{name:'魔狼の闘争心',desc:'攻撃+14%・会心+8%',atk:.14,crit:8},
  '紅蓮デーモン':{name:'紅蓮魔力',desc:'攻撃+13%・HP+7%',atk:.13,hp:.07},
  '黒炎騎士':{name:'黒炎装甲',desc:'防御+18%・HP+12%',def:.18,hp:.12},
  'マグマドラゴン':{name:'竜王血統',desc:'攻撃+16%・HP+14%',atk:.16,hp:.14}
 });
 Object.assign(COMPANION_GROWTH_STYLE,{
  '獄炎の魔狼':{hp:7,mp:2,atk:7,def:2},
  '紅蓮デーモン':{hp:7,mp:4,atk:7,def:3},
  '黒炎騎士':{hp:10,mp:2,atk:6,def:6},
  'マグマドラゴン':{hp:11,mp:3,atk:8,def:5}
 });
 const gb={id:'gb',area:'紅蓮魔界',name:'紅蓮魔界ボス',recommended:70,
  unlock:s=>!!s.clears.g2&&s.lv>=70,unlockText:'紅蓮魔界2クリア＋Lv70で解放',
  boss:true,bossMonster:'煉獄魔王・ヴァルグレイン',enemies:['煉獄魔王・ヴァルグレイン'],mult:7.55,next:'紅蓮魔界を踏破！'};
 if(!stages.some(x=>x.id==='gb'))stages.push(gb); else Object.assign(stages.find(x=>x.id==='gb'),gb);
 const g2=stages.find(x=>x.id==='g2');if(g2)g2.next='紅蓮魔界ボス';
 function order712(){const ids=['g1','g2','gb'],found=ids.map(id=>stages.find(x=>x.id===id)).filter(Boolean),rest=stages.filter(x=>!ids.includes(x.id)),sb=rest.findIndex(x=>x.id==='sb');if(sb>=0)rest.splice(sb+1,0,...found);else rest.push(...found);stages.splice(0,stages.length,...rest)}
 order712();
 Object.keys(MONSTERS).forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0});
 // 灼熱: 紅蓮魔界では長期戦ほど熱ダメージが増える（上限あり）。
 S.gurenHeat712=S.gurenHeat712||0;
 const spawn0=spawn;spawn=function(){spawn0.apply(this,arguments);let on=false;try{on=stage().area==='紅蓮魔界'}catch(e){}S.gurenHeat712=on?0:S.gurenHeat712};
 const enemy0=enemyTurn;enemyTurn=function(){enemy0.apply(this,arguments);let on=false;try{on=stage().area==='紅蓮魔界'}catch(e){}if(!on||!aliveParty().length||!living().length)return;S.gurenHeat712=Math.min(6,(S.gurenHeat712||0)+1);if(S.gurenHeat712>=3){const a=aliveParty(),i=a[Math.floor(Math.random()*a.length)],d=Math.max(4,Math.floor(maxHp(i)*(.018+S.gurenHeat712*.006)));S.hp[i]=Math.max(0,S.hp[i]-d);floatText('灼熱-'+d,18+i*31,72,'fire712');showLog('🔥 灼熱が激しさを増す！',650);if(!aliveParty().length)wipe();save()}};
 const sv=stageView;stageView=function(){order712();sv.apply(this,arguments);document.querySelectorAll('[data-stage]').forEach(row=>{if((row.textContent||'').includes('紅蓮魔界ボス')){const b=row.querySelector('b');if(b&&!b.querySelector('.gurenBoss712'))b.insertAdjacentHTML('beforeend',' <span class="gurenBoss712">BOSS</span>')}})};
 const rr=render;render=function(){order712();let z=rr.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}let e=document.querySelector('.logo small');if(e)e.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71.2 GUREN BOSS';return z};
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2.1';
 const applyBrand=()=>{
   const logo=document.querySelector('.logo');
   if(logo){
     for(const n of [...logo.childNodes])if(n.nodeType===3&&n.textContent.includes('SPACE MOFURUKU'))n.textContent=n.textContent.replace('SPACE MOFURUKU','どろダン');
     const sm=logo.querySelector('small');if(sm)sm.textContent=V;
   }
   const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
   document.title='どろダン / DROP OF DUNGEON v0.71.2.1';
 };
 const oldRender7121=render;
 render=function(){let z=oldRender7121.apply(this,arguments);applyBrand();return z};
 window.DORODAN_COPYRIGHT={title:'ドロップ・オブ・ダンジョン',shortTitle:'どろダン',englishTitle:'DROP OF DUNGEON',studio:'NW GAMES',copyright:'© 2026 Noriyuki Wada. All Rights Reserved.'};
 applyBrand();save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2.2';
 function applyNW(){
  const logo=document.querySelector('.logo');
  if(logo&&!document.getElementById('nwTopBrand')){
   const x=document.createElement('span');x.id='nwTopBrand';x.textContent='NW GAMES';
   const sm=logo.querySelector('small'); if(sm)logo.insertBefore(x,sm); else logo.appendChild(x);
  }
  const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;
  const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
  document.title='どろダン / DROP OF DUNGEON v0.71.2.2';
  const credit=document.getElementById('nwCredit7121');
  if(credit&&!document.getElementById('nwCreditBtn')){
   const btn=document.createElement('button');btn.id='nwCreditBtn';btn.type='button';btn.textContent='クレジット / NW GAMES';
   btn.onclick=()=>{const m=document.getElementById('nwCreditModal');m.classList.add('open');m.setAttribute('aria-hidden','false')};
   credit.parentNode.insertBefore(btn,credit);
  }
 }
 const close=()=>{const m=document.getElementById('nwCreditModal');m.classList.remove('open');m.setAttribute('aria-hidden','true')};
 document.getElementById('nwCreditClose').onclick=close;
 document.getElementById('nwCreditModal').onclick=e=>{if(e.target.id==='nwCreditModal')close()};
 const prev=render;render=function(){const z=prev.apply(this,arguments);applyNW();return z};
 applyNW();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2.3';
 function beginnerStage(){try{return stage()&&stage().id==='g1'}catch(e){return false}}
 // 草原1のみ：序盤は1体、後半でも最大2体。既存の全体難易度には影響させない。
 const spawn07123=spawn;
 spawn=function(){
   spawn07123.apply(this,arguments);
   if(!beginnerStage()||!E.length||E.some(e=>e.golden||e.boss))return;
   const b=Math.max(1,Number(S.battle)||1);
   const maxEnemies=b<=3?1:2;
   if(E.length>maxEnemies)E.splice(maxEnemies);
   // 草原1だけ敵攻撃を25%軽減。HP・EXP・ドロップは変更しない。
   E.forEach(e=>{e.atk=Math.max(1,Math.floor(e.atk*.75))});
   target=0;render();
 };
 // 新規プレイヤーが草原1で操作を覚えられるよう、最初の3戦は強攻撃準備も発生させない。
 const enemy07123=enemyTurn;
 enemyTurn=function(){
   if(!beginnerStage()||(Number(S.battle)||1)>3)return enemy07123.apply(this,arguments);
   living().forEach(e=>{
     let ap=aliveParty();if(!ap.length)return;
     let i=ap[Math.floor(Math.random()*ap.length)],def=statsFor(i).def;
     let d=Math.max(1,e.atk-def);if(S.guard)d=Math.max(1,Math.floor(d*.35));
     partyDamage(i,d);showLog(`${e.name}の攻撃！ ${partyNames()[i]}に${d}ダメージ`);
   });
   S.guard=false;if(!aliveParty().length)wipe();
 };
 const rr07123=render;
 render=function(){let z=rr07123.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71.2.3';return z};
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2.4';
 function firstStage(){return stages.find(x=>x.id==='g1'&&x.area==='草原')||stages.find(x=>x.name==='はじまりの草原 1')||stages[0]}
 function currentStageObj(){
   try{return stage()}catch(e){return null}
 }
 function isUnlocked(st){
   if(!st)return false;
   try{return !st.unlock||!!st.unlock(S)}catch(e){return false}
 }
 function enforceStageSafety(){
   let st=currentStageObj();
   // 新規/低Lvデータが後半ステージを保持していた場合は草原1へ戻す。
   if(!st||!isUnlocked(st)||(S.lv<=1&&st.id!=='g1')){
     const f=firstStage(); if(!f)return false;
     // stage() が参照する既存の保存フィールドを、実ファイルで使われている候補だけ安全に同期。
     if('stageId' in S)S.stageId=f.id;
     if('stage' in S)S.stage=f.id;
     if('stageIndex' in S)S.stageIndex=stages.indexOf(f);
     if('si' in S)S.si=stages.indexOf(f);
     if('stageName' in S)S.stageName=f.name;
     return true;
   }
   return false;
 }
 // 実際のstage()が何を参照するかに依存せず、選択関数側でもロックを強制。
 const sv07124=stageView;
 stageView=function(){
   enforceStageSafety();
   const z=sv07124.apply(this,arguments);
   return z;
 };
 const sp07124=spawn;
 spawn=function(){
   const moved=enforceStageSafety();
   if(moved){S.battle=1;save()}
   return sp07124.apply(this,arguments);
 };
 const rr07124=render;
 render=function(){
   enforceStageSafety();
   let z=rr07124.apply(this,arguments);
   const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
   const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;
   document.title='どろダン / DROP OF DUNGEON v0.71.2.4';
   return z;
 };
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 const moved=enforceStageSafety();if(moved){S.battle=1;save();spawn()}else{save();render()}
})();

;

(function(){
 'use strict';
 const V='v0.71';
 const gurenDrops={
  '獄炎の魔狼':[
   {n:'獄炎の牙',r:16,rar:'NORMAL',type:'素材',desc:'獄炎の魔狼が残す灼熱の牙'},
   {n:'炎狼の首飾り',r:170,rar:'RARE',type:'アクセサリー',atk:8,def:4,crit:8,desc:'攻撃+8 / 防御+4 / 会心+8%'},
   {n:'獄走の双牙',r:950,rar:'EPIC',type:'武器',atk:48,def:2,crit:12,desc:'攻撃+48 / 防御+2 / 会心+12%'}
  ],
  '紅蓮デーモン':[
   {n:'紅蓮魔石',r:17,rar:'NORMAL',type:'素材',desc:'紅蓮デーモンの魔力を宿した石'},
   {n:'紅魔の指輪',r:190,rar:'RARE',type:'アクセサリー',atk:9,def:5,crit:7,desc:'攻撃+9 / 防御+5 / 会心+7%'},
   {n:'煉獄術師のローブ',r:1050,rar:'EPIC',type:'防具',atk:12,def:38,crit:6,desc:'攻撃+12 / 防御+38 / 会心+6%'}
  ],
  '黒炎騎士':[
   {n:'黒炎鋼片',r:18,rar:'NORMAL',type:'素材',desc:'黒炎騎士の鎧から剥がれた黒鋼'},
   {n:'黒騎士の護符',r:210,rar:'RARE',type:'アクセサリー',atk:7,def:11,crit:5,desc:'攻撃+7 / 防御+11 / 会心+5%'},
   {n:'黒炎王の鎧',r:1150,rar:'EPIC',type:'防具',atk:8,def:46,crit:5,desc:'攻撃+8 / 防御+46 / 会心+5%'}
  ],
  'マグマドラゴン':[
   {n:'灼熱竜鱗',r:20,rar:'NORMAL',type:'素材',desc:'溶岩熱を帯びたマグマドラゴンの鱗'},
   {n:'竜炎の腕輪',r:230,rar:'RARE',type:'アクセサリー',atk:11,def:7,crit:7,desc:'攻撃+11 / 防御+7 / 会心+7%'},
   {n:'溶界竜剣',r:1250,rar:'EPIC',type:'武器',atk:56,def:5,crit:9,desc:'攻撃+56 / 防御+5 / 会心+9%'}
  ],
  '煉獄魔王・ヴァルグレイン':[
   {n:'魔王の紅核',r:8,rar:'RARE',type:'素材',desc:'煉獄魔王の力が凝縮された紅い心核'},
   {n:'紅蓮覇王鎧',r:85,rar:'EPIC',type:'防具',atk:16,def:54,crit:7,desc:'攻撃+16 / 防御+54 / 会心+7%'},
   {n:'魔剣ヴァルグレイン',r:1200,rar:'PHANTOM',type:'武器',atk:72,def:8,crit:14,desc:'攻撃+72 / 防御+8 / 会心+14%'}
  ]
 };
 Object.entries(gurenDrops).forEach(([n,a])=>{drops[n]=a;S.dropFound=S.dropFound||{};a.forEach(d=>{if(!Number.isFinite(S.dropFound[d.n]))S.dropFound[d.n]=0})});
 // 図鑑側は既存のMONSTERS/drops/S.seen/S.kills/dropFoundを読むため、この登録で自動連携。
 const rr713=render;
 render=function(){let z=rr713.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71';return z};
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.1R';
 // Repair invalid Crimson Demon Realm icon keys using art keys that actually exist in svgMonster().
 Object.assign(MONSTERS,{
  '獄炎の魔狼':{...MONSTERS['獄炎の魔狼'],icon:'wolf',recruit:950},
  '紅蓮デーモン':{...MONSTERS['紅蓮デーモン'],icon:'leaffairy',recruit:1100},
  '黒炎騎士':{...MONSTERS['黒炎騎士'],icon:'goblin',recruit:1350},
  'マグマドラゴン':{...MONSTERS['マグマドラゴン'],icon:'grassfang',recruit:1600},
  '煉獄魔王・ヴァルグレイン':{...MONSTERS['煉獄魔王・ヴァルグレイン'],icon:'moonwolf',recruit:0}
 });
 // Equipment ownership label, compatible with heroEquipment65 and current active slots.
 function owners7111(n){
   const out=[];
   if(S.heroEquipment65)Object.entries(S.heroEquipment65).forEach(([who,eq])=>{if(eq&&Object.values(eq).includes(n))out.push(who)});
   partyNames().forEach((who,i)=>{if(S.equipment[i]&&Object.values(S.equipment[i]).includes(n)&&!out.includes(who))out.push(who)});
   return out;
 }
 const compact0=compactCard651;
 compactCard651=function(n){
   let h=compact0(n),o=owners7111(n);
   if(o.length)h=h.replace('<div class="inv651meta">',`<div class="eqOwner7111">装備中：${o.join(' / ')}</div><div class="inv651meta">`);
   return h;
 };
 // Ensure item cards always use the existing character picker.
 const iv0=itemView651;
 itemView651=function(tab){
   iv0(tab);
   document.querySelectorAll('[data-eq651]').forEach(b=>b.onclick=()=>chooseEquip(b.dataset.eq651));
   updateTop7111();
 };
 window.itemView=itemView651;
 // Back-to-top for every long overlay (book/items/shop/base etc.).
 const btn=document.getElementById('backTop7111'), body=document.getElementById('obody'), overlay=document.getElementById('overlay');
 function scrollTop7111(){if(body)body.scrollTo({top:0,behavior:'smooth'});if(overlay)overlay.scrollTo({top:0,behavior:'smooth'});window.scrollTo({top:0,behavior:'smooth'})}
 btn.onclick=scrollTop7111;
 function updateTop7111(){
   let y=Math.max(window.scrollY||0,body?.scrollTop||0,overlay?.scrollTop||0);
   btn.classList.toggle('show',!!overlay?.classList.contains('open')&&y>260);
 }
 window.addEventListener('scroll',updateTop7111,{passive:true});body?.addEventListener('scroll',updateTop7111,{passive:true});overlay?.addEventListener('scroll',updateTop7111,{passive:true});
 const open0=open;open=function(){let z=open0.apply(this,arguments);setTimeout(updateTop7111,0);return z};
 const render0=render;render=function(){let z=render0.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71.1R';return z};
 const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.71.2R', HUMAN=['キーボ','ミア','トア','ピボット'];
 const isHuman=n=>HUMAN.includes(n);
 // Equipment is human-only. Remove any equipment accidentally attached to monster party slots.
 function sanitizeMonsterEquipment(){
   const P=partyNames();
   for(let i=0;i<3;i++)if(!isHuman(P[i]))S.equipment[i]={武器:'',防具:'',アクセサリー:''};
   S.heroEquipment65=S.heroEquipment65||{};
   Object.keys(S.heroEquipment65).forEach(n=>{if(!isHuman(n))delete S.heroEquipment65[n]});
 }
 // Current inventory truth = S.owned only. Historical BEST/drop records never create inventory cards.
 function ownedNow712r(n){return Array.isArray(S.owned)&&S.owned.includes(n)}
 const uniqueOld712r=unique651;
 unique651=function(){
   const a=[],seen=new Set();
   for(let i=(S.owned||[]).length-1;i>=0;i--){const n=S.owned[i];if(!n||seen.has(n))continue;seen.add(n);a.push(n)}
   return a;
 };
 const compactOld712r=compactCard651;
 compactCard651=function(n){
   if(!ownedNow712r(n))return '';
   let h=compactOld712r(n);
   const owners=[];
   if(S.heroEquipment65)HUMAN.forEach(w=>{const eq=S.heroEquipment65[w];if(eq&&Object.values(eq).includes(n))owners.push(w)});
   if(owners.length)h=h.replace('<div class="inv651meta">',`<div class="eqOwner7111">装備中：${owners.join(' / ')}</div><div class="inv651meta">`);
   return h;
 };
 function chooseHuman712r(n){
   if(!ownedNow712r(n))return toast('この装備は現在所持していません');
   const heroes=(typeof unlocked65==='function'?unlocked65():HUMAN).filter(isHuman);
   targetAction=null;
   $("#targetTitle").textContent=`${n}を誰に装備？`;
   $("#targetList").innerHTML=heroes.map(w=>`<button class="targetBtn" data-human712r="${w}">${w}</button>`).join('');
   document.querySelectorAll('[data-human712r]').forEach(b=>b.onclick=()=>{
     const who=b.dataset.human712r;
     $("#targetSheet").classList.remove('open');
     S.heroEquipment65=S.heroEquipment65||{};
     if(!S.heroEquipment65[who])S.heroEquipment65[who]={武器:'',防具:'',アクセサリー:''};
     const x=item(n),type=x.type;
     HUMAN.forEach(other=>{if(other!==who&&S.heroEquipment65[other]&&S.heroEquipment65[other][type]===n)S.heroEquipment65[other][type]=''});
     S.heroEquipment65[who][type]=n;
     partyNames().forEach((p,i)=>{if(p===who)S.equipment[i]={...S.heroEquipment65[who]}});
     sanitizeMonsterEquipment();save();toast(`${who}が${n}を装備`);itemView651();
   });
   $("#targetSheet").classList.add('open');
 }
 chooseEquip=chooseHuman712r;window.chooseEquip=chooseHuman712r;
 const itemOld712r=itemView651;
 itemView651=function(tab){
   sanitizeMonsterEquipment();
   itemOld712r(tab);
   document.querySelectorAll('[data-eq651]').forEach(b=>b.onclick=()=>chooseHuman712r(b.dataset.eq651));
 };
 window.itemView=itemView651;
 // New/invalid saves can never remain inside locked late-game stages.
 function stageSafety712r(){
   let st;try{st=stage()}catch(e){}
   let ok=!!st;try{if(st&&st.unlock)ok=!!st.unlock(S)}catch(e){ok=false}
   if(!ok||(S.lv<=1&&(!st||st.area!=='草原'))){
     const first=stages.find(x=>x.area==='草原'&&!x.boss)||stages[0];
     if(first){S.stageId=first.id;S.battle=1}
   }
 }
 sanitizeMonsterEquipment();stageSafety712r();
 const renderOld712r=render;
 render=function(){sanitizeMonsterEquipment();stageSafety712r();let z=renderOld712r.apply(this,arguments);const b=document.getElementById('buildVersion')||document.getElementById('buildVersion69');if(b){b.id='buildVersion';b.textContent=V}const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;document.title='どろダン / DROP OF DUNGEON v0.71.2R';return z};
 save();render();
})();

;

(function(){
 'use strict';
 const V='v0.72.12';
 // Crimson Realm: only keys that exist in current svgMonster registry.
 const map={'獄炎の魔狼':'wolf','紅蓮デーモン':'leaffairy','黒炎騎士':'goblin','マグマドラゴン':'grassfang','煉獄魔王・ヴァルグレイン':'moonwolf'};
 Object.entries(map).forEach(([n,k])=>{if(MONSTERS[n])MONSTERS[n].icon=k});

 // Robust back-to-top: actual page is scrolling in screenshots, not only #overlay/#obody.
 const btn=document.getElementById('backTop7111');
 const overlay=document.getElementById('overlay'), body=document.getElementById('obody');
 function scrollCandidates(){
   return [document.scrollingElement,document.documentElement,document.body,overlay,body].filter(Boolean);
 }
 function goTop(){
   scrollCandidates().forEach(el=>{
     try{el.scrollTop=0;el.scrollLeft=0;el.scrollTo?.({top:0,left:0,behavior:'smooth'})}catch(e){}
   });
   try{window.scrollTo({top:0,left:0,behavior:'smooth'})}catch(e){window.scrollTo(0,0)}
   setTimeout(()=>scrollCandidates().forEach(el=>{try{el.scrollTop=0}catch(e){}}),180);
 }
 if(btn){
   btn.onclick=null;
   btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goTop()},{capture:true});
   btn.addEventListener('touchend',e=>{e.preventDefault();e.stopPropagation();goTop()},{passive:false,capture:true});
 }
 function maxScrollY(){
   return Math.max(window.scrollY||0,...scrollCandidates().map(x=>Number(x.scrollTop)||0));
 }
 function updateBtn(){
   if(!btn)return;
   btn.classList.toggle('show',!!overlay?.classList.contains('open')&&maxScrollY()>220);
 }
 scrollCandidates().forEach(x=>x.addEventListener?.('scroll',updateBtn,{passive:true}));
 window.addEventListener('scroll',updateBtn,{passive:true});

 // Keep equipment repair authoritative after redraw.
 const HUMAN=['キーボ','ミア','トア','ピボット'];
 function cleanMonsterEquip(){
   const p=partyNames();
   for(let i=0;i<3;i++)if(!HUMAN.includes(p[i]))S.equipment[i]={武器:'',防具:'',アクセサリー:''};
   S.heroEquipment65=S.heroEquipment65||{};
   Object.keys(S.heroEquipment65).forEach(n=>{if(!HUMAN.includes(n))delete S.heroEquipment65[n]});
 }
 cleanMonsterEquip();

 // Final version writer, after all old render wrappers.
 const oldRender=render;
 render=function(){
   cleanMonsterEquip();
   const z=oldRender.apply(this,arguments);
   document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=V});
   const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;
   document.title='どろダン / DROP OF DUNGEON v0.72.12';
   setTimeout(updateBtn,0);
   return z;
 };
 save();render();
 const force714=()=>{
   document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=V});
   const sm=document.querySelector('.logo small');if(sm)sm.textContent=V;
   document.title='どろダン / DROP OF DUNGEON v0.72.11';
 };
 force714();
 requestAnimationFrame(force714);
 setTimeout(force714,80);
 setTimeout(force714,300);
})();

;

(function(){
'use strict';
const CURRENT='v0.72.12';

// Preserve every working facility from v0.71.4R.
// Only enhance the summon screen AFTER its original handler has run.
document.addEventListener('click',function(ev){
 const b=ev.target.closest?.('[data-f62="summon"]');
 if(!b)return;
 setTimeout(function(){
   const btns=document.querySelector('#obody .summon62Btns');
   if(!btns)return;
   document.getElementById('gold725')?.remove();
   const g=document.createElement('div');g.id='gold725';g.className='gold725';
   g.innerHTML=`<span>所持ゴールド</span><b>💰 ${Number(S.gold||0).toLocaleString()} G</b>`;
   btns.parentNode.insertBefore(g,btns);
 },0);
},false);

// Visible version only; no render/base/item/forge function replacement.
function stamp(){
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=CURRENT});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=CURRENT;
 document.title='どろダン / DROP OF DUNGEON v0.72.12 RECOVERY';
}
stamp();setTimeout(stamp,250);
})();

;

(function(){
'use strict';
const VERSION='v0.72.12';
const baseBefore729=baseView;
baseView=function(){
  const r=baseBefore729.apply(this,arguments);
  const forge=document.querySelector('[data-f57="forge"]');
  if(forge){
    forge.onclick=function(ev){
      if(ev){ev.preventDefault();ev.stopPropagation();}
      if(typeof window.forgeView53==='function') window.forgeView53();
      else open('星鍛冶屋','<div class="panel"><p>星鍛冶屋の読み込みに失敗しました。</p></div>');
    };
  }
  return r;
};
const renderBefore729=render;
render=function(){
 const r=renderBefore729.apply(this,arguments);
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=VERSION});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VERSION;
 document.title='どろダン / DROP OF DUNGEON v0.72.11';
 return r;
};
save();render();
})();

;

(function(){
'use strict';
const VER='v0.72.12';
let hero211='キーボ',type211='武器',mode211='equip';
const TYPES211=['武器','防具','アクセサリー'];

function api211(){return window.__equip65}
function heroes211(){
 const a=api211(); if(!a)return ['キーボ','ミア','トア'];
 a.sync(); return a.unlocked();
}
function eq211(n){const a=api211();return a?a.eq(n):{武器:'',防具:'',アクセサリー:''}}
function ownedCount211(n){return Array.isArray(S.owned)?S.owned.filter(x=>x===n).length:0}
function assignedElsewhere211(n,hero){
 const a=api211();if(!a)return 0;
 return a.heroes.filter(h=>h!==hero).reduce((c,h)=>c+Object.values(a.eq(h)||{}).filter(x=>x===n).length,0);
}
function candidates211(hero,type){
 const seen=new Set(),out=[];
 for(const n of (S.owned||[])){
   if(seen.has(n))continue;seen.add(n);
   const x=item(n);
   if(x&&x.type===type){
     const cur=eq211(hero)[type]===n;
     if(cur || ownedCount211(n)>assignedElsewhere211(n,hero))out.push(n);
   }
 }
 const rank={PHANTOM:5,LEGEND:4,EPIC:3,RARE:2,NORMAL:1};
 return out.sort((a,b)=>(rank[(item(b)||{}).rar]||0)-(rank[(item(a)||{}).rar]||0)||(((item(b)||{}).atk||0)+((item(b)||{}).def||0))-(((item(a)||{}).atk||0)+((item(a)||{}).def||0)));
}
function stat211(x){x=x||{};return `攻撃 ${x.atk||0} / 防御 ${x.def||0} / 会心 ${x.crit||0}%`}
function diff211(v,label){
 const cls=v>0?'eq211Up':v<0?'eq211Down':'eq211Same';
 return `<span class="${cls}">${label} ${v>0?'+':''}${v}${label==='会心'?'%':''}${v>0?' ↑':v<0?' ↓':''}</span>`;
}
function card211(n,hero,type){
 const x=item(n)||{},curName=eq211(hero)[type]||'',cur=item(curName)||{},isCur=curName===n;
 const a=(x.atk||0)-(cur.atk||0),d=(x.def||0)-(cur.def||0),c=(x.crit||0)-(cur.crit||0);
 return `<div class="eq211Card ${isCur?'current':''}">
  <div class="eq211Name"><div><b class="${rarityClass(x.rar)}">${n}</b><div class="eq211Stats">${stat211(x)}</div></div>${isCur?'<span class="eq211Now">装備中</span>':''}</div>
  <div class="small">現在：${curName||'なし'}${curName?`　${stat211(cur)}`:''}</div>
  <div class="eq211Compare">${diff211(a,'攻撃')}${diff211(d,'防御')}${diff211(c,'会心')}</div>
  <button data-eq211="${n}" ${isCur?'disabled':''}>${isCur?'装備中':'これを装備'}</button>
 </div>`;
}
function consumables211(){
 return `<div class="eq211"><button class="eq211Sub" data-mode211="equip">← 装備に戻る</button>
 <div class="eq211Title"><b>消耗品</b><span>現在の所持数</span></div>
 <div class="eq211Consum"><span><b>🌿 薬草</b><br><small>味方1人のHPを35回復</small></span><b>${S.herb||0}個</b></div>
 <div class="eq211Consum"><span><b>💧 生命の雫</b><br><small>戦闘不能の仲間をHP50%で復活</small></span><b>${S.revive||0}個</b></div></div>`;
}
function view211(){
 const hs=heroes211();if(!hs.includes(hero211))hero211=hs[0]||'キーボ';
 if(mode211==='consum'){
   open('持ち物・装備',consumables211());
   document.querySelector('[data-mode211="equip"]')?.addEventListener('click',()=>{mode211='equip';view211()});
   return;
 }
 const e=eq211(hero211),list=candidates211(hero211,type211);
 open('持ち物・装備',`<div class="eq211">
  <div class="eq211Top">${hs.map(h=>`<button data-hero211="${h}" class="${h===hero211?'on':''}">${h}</button>`).join('')}<button data-mode211="consum">消耗品</button></div>
  <div class="eq211Hero"><div><b>${hero211}</b><small>装備するキャラクターを選択</small></div><span>Lv.${typeof window.heroLv59==='function'?window.heroLv59(hero211):(S.lv||1)}</span></div>
  <div class="eq211Slots">${TYPES211.map(t=>`<button class="eq211Slot ${t===type211?'on':''}" data-type211="${t}"><small>${t}</small><b>${e[t]||'なし'}</b></button>`).join('')}</div>
  <div class="eq211Title"><b>${type211}を選ぶ</b><span>所持品のみ ${list.length}種類</span></div>
  ${list.length?list.map(n=>card211(n,hero211,type211)).join(''):'<div class="eq211Empty">装備できる所持品がありません</div>'}
 </div>`);
 document.querySelectorAll('[data-hero211]').forEach(b=>b.onclick=()=>{hero211=b.dataset.hero211;view211()});
 document.querySelectorAll('[data-type211]').forEach(b=>b.onclick=()=>{type211=b.dataset.type211;view211()});
 document.querySelector('[data-mode211="consum"]')?.addEventListener('click',()=>{mode211='consum';view211()});
 document.querySelectorAll('[data-eq211]').forEach(b=>b.onclick=()=>{
   const a=api211(),n=b.dataset.eq211;if(!a)return;
   if(ownedCount211(n)<=assignedElsewhere211(n,hero211))return toast('この装備は他のキャラクターが使用中です');
   a.equip(hero211,type211,n);view211();
 });
}
window.equipmentView211=view211;

// Route ONLY the two visible inventory entry buttons. No itemView/baseView replacement.
document.addEventListener('click',function(ev){
 const b=ev.target.closest?.('.nav[data-page="items"],[data-f57="items"]');
 if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 mode211='equip';view211();
},true);

function stamp211(){
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=VER});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
 document.title='どろダン / DROP OF DUNGEON v0.72.11';
}
stamp211();setTimeout(stamp211,350);
})();

;

(function(){
'use strict';
const VER='v0.72.12';
const GOLD_RATE=500;
const GOLD_BOSS_RATE=80;
S.goldenBossKills7212=S.goldenBossKills7212||{};
S.goldenBossSeen7212=S.goldenBossSeen7212||{};

const GOLD_BOSS_DROP7212={
 '草原の大牙':{n:'黄金獣牙',type:'アクセサリー',atk:4,def:2,crit:4,rar:'EPIC',desc:'黄金化した大牙から生まれた希少な牙'},
 '森の主・月狼':{n:'黄金月狼の護符',type:'アクセサリー',atk:5,def:4,crit:5,rar:'EPIC',desc:'黄金月狼の魔力を宿す護符'},
 '氷雪の女王・フロスティア':{n:'黄金氷晶の冠',type:'防具',atk:2,def:15,crit:2,rar:'EPIC',desc:'黄金の氷晶で形作られた冠'},
 '焔竜王・ヴォルガノス':{n:'黄金焔竜剣',type:'武器',atk:28,def:3,crit:5,rar:'EPIC',desc:'黄金の焔を纏う竜剣'},
 '天空機神・アストライオス':{n:'黄金天機輪',type:'アクセサリー',atk:9,def:9,crit:7,rar:'EPIC',desc:'天空機神の黄金機構から作られた輪'},
 '煉獄魔王・ヴァルグレイン':{n:'黄金煉獄刃',type:'武器',atk:38,def:5,crit:8,rar:'PHANTOM',desc:'煉獄魔王の黄金核から生まれた幻級の刃'}
};
Object.values(GOLD_BOSS_DROP7212).forEach(x=>{if(!specialItems[x.n])specialItems[x.n]=x});

function goldBossName7212(base){return '黄金'+base}
function maybeGoldenBoss7212(){
 if(!E.length||!E[0].boss||E[0].goldenBoss7212)return;
 const e=E[0],base=e.base||e.name;
 if(!GOLD_BOSS_DROP7212[base]||Math.random()>=1/GOLD_BOSS_RATE)return;
 e.goldenBoss7212=true;e.golden=true;e.goldenBase7212=base;
 e.name=goldBossName7212(base);
 e.max=Math.floor(e.max*1.55);e.hp=e.max;e.atk=Math.floor(e.atk*1.28);e.xp=Math.floor(e.xp*1.8);
 S.seen[e.name]=true;S.goldenBossSeen7212[base]=(S.goldenBossSeen7212[base]||0)+1;
 if(typeof stopAuto==='function')stopAuto('黄金ボス出現');
 save();
 setTimeout(()=>showFx(`<h1 class="goldTitle">GOLDEN BOSS!</h1><div class="dropItem">✨ ${e.name}</div><p class="small">希少な黄金個体が出現！ AUTOを停止しました。</p>`,'phantom'),120);
}
const spawn7212=spawn;
spawn=function(){const z=spawn7212.apply(this,arguments);maybeGoldenBoss7212();render();return z};

function awardGoldenBoss7212(e){
 if(!e||!e.goldenBoss7212||e.goldRewarded7212)return;
 e.goldRewarded7212=true;
 const base=e.goldenBase7212,drop=GOLD_BOSS_DROP7212[base];if(!drop)return;
 S.goldenBossKills7212[base]=(S.goldenBossKills7212[base]||0)+1;
 if(!S.owned.includes(drop.n))S.owned.push(drop.n);else S.owned.push(drop.n);
 S.dropFound=S.dropFound||{};S.dropFound[drop.n]=(S.dropFound[drop.n]||0)+1;
 S.locks=S.locks||{};S.locks[drop.n]=true;
 if(typeof stopAuto==='function')stopAuto('黄金シリーズDROP');
 save();
 setTimeout(()=>showFx(`<h1 class="goldTitle">${drop.rar} GOLD DROP!</h1><div class="dropItem ${rarityClass(drop.rar)}">${drop.n}</div><p class="goldSeries7212">${e.name} 限定装備</p><p class="small">自動ロック済み</p>`,drop.rar==='PHANTOM'?'phantom':'rare'),320);
}
// rollDrops is called before the battle enemy array is replaced; attach reward there.
const rollDrops7212=rollDrops;
rollDrops=function(e){const z=rollDrops7212.apply(this,arguments);awardGoldenBoss7212(e);return z};

// Make the special boss visibly identifiable without replacing render.
const render7212=render;
render=function(){
 const z=render7212.apply(this,arguments);
 document.querySelectorAll('.enemy').forEach((el,i)=>{if(E[i]?.goldenBoss7212)el.classList.add('goldenBoss7212')});
 return z;
};

function stamp7212(){
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=VER});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
 document.title='どろダン / DROP OF DUNGEON v0.72.12';
}
stamp7212();setTimeout(stamp7212,400);
})();

;

(function(){
'use strict';
const VER='v0.72.13';
function stamp7213(){
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=VER});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
 document.title='どろダン / DROP OF DUNGEON v0.72.13';
}
// Final transparent render wrapper: prevents older version writers from winning after redraw.
const render7213=render;
render=function(){const z=render7213.apply(this,arguments);stamp7213();return z};
stamp7213();requestAnimationFrame(stamp7213);setTimeout(stamp7213,500);
})();

;

(function(){
'use strict';
const VER='v0.74.42';
const DEFAULTS=[
 {id:'mythic_lv30',unlockLv:30,label:'第一神話領域'},
 {id:'mythic_lv60',unlockLv:60,label:'第二神話領域'},
 {id:'mythic_lv90',unlockLv:90,label:'第三神話領域'},
 {id:'mythic_lv120',unlockLv:120,label:'第四神話領域'}
];
const registry=new Map(DEFAULTS.map(x=>[x.id,Object.freeze({...x,implemented:false})]));
function register(def){
 if(!def||typeof def.id!=='string'||!def.id||!Number.isFinite(Number(def.unlockLv)))return false;
 const prev=registry.get(def.id)||{};
 registry.set(def.id,Object.freeze({...prev,...def,unlockLv:Number(def.unlockLv)}));
 return true;
}
function list(){return Array.from(registry.values()).map(x=>({...x,unlocked:(S.lv||1)>=x.unlockLv}))}
function get(id){const x=registry.get(id);return x?{...x,unlocked:(S.lv||1)>=x.unlockLv}:null}
window.__mythicStage73=Object.freeze({register,list,get,version:VER});
function panel73(){
 const rows=list().map(x=>`<div class="mythic73Row ${x.unlocked?'on':''}" data-mythic-id="${x.id}"><span><b>${x.label}</b><br><small>解放条件：Lv${x.unlockLv}</small></span><span class="mythic73State">${x.implemented?(x.unlocked?'挑戦可能':'🔒 未解放'):(x.unlocked?'解放済 / 準備中':'🔒 未解放')}</span></div>`).join('');
 return `<section class="mythic73" id="mythicStagePanel73"><div class="mythic73Head"><b>✦ 神話領域</b><small>30Lvごとに開く特殊ステージ枠。神話シリーズ本体は次段階で実装。</small></div><div class="mythic73Grid">${rows}</div></section>`;
}
function appendPanel73(){
 const body=document.getElementById('obody');
 if(!body||document.getElementById('mythicStagePanel73'))return;
 body.insertAdjacentHTML('beforeend',panel73());
}
const stageView73=stageView;
stageView=function(){const z=stageView73.apply(this,arguments);appendPanel73();return z};
function stamp73(){
 document.querySelectorAll('#buildVersion,#buildVersion69').forEach(b=>{b.id='buildVersion';b.textContent=VER});
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
 document.title='どろダン / DROP OF DUNGEON v0.74.42';
}
const render73=render;
render=function(){const z=render73.apply(this,arguments);stamp73();return z};
stamp73();requestAnimationFrame(stamp73);setTimeout(stamp73,550);
})();

;

(function(){
'use strict';
const VER='v0.74.42', NAME='深淵の堕天獣', ID='mythic30_abyss';
const BOSS_ART=DOD_ASSETS["dod_asset_21_e2f58fa2e323.png"];
// Register the selected B-plan as the first implemented mythic domain.
if(window.__mythicStage73?.register)window.__mythicStage73.register({id:'mythic_lv30',unlockLv:30,label:'深淵の堕天獣',implemented:true});
MONSTERS[NAME]={icon:'mythicAbyss735',hp:2200,atk:58,xp:3500,recruit:3500,mythic:true};
monBase[NAME]=MONSTERS[NAME];
drops[NAME]=[
 {n:'深淵の核',r:1,rar:'RARE',type:'素材',desc:'神話級・深淵の堕天獣が残す核'},
 {n:'堕天獣の黒翼',r:35,rar:'EPIC',type:'アクセサリー',atk:18,def:16,crit:12,desc:'攻撃+18 / 防御+16 / 会心+12%'},
 {n:'深淵王の魔冠',r:350,rar:'PHANTOM',type:'防具',atk:22,def:62,crit:14,effect51:{bossDamage:.20,critDamage:.20},effectText51:'ボス特効+20% / 会心威力+20%',desc:'神話級PHANTOM。攻撃+22 / 防御+62 / 会心+14%'}
];
const st={id:ID,area:'神話領域',name:'神話級・深淵の堕天獣',recommended:30,unlock:s=>(s.lv||1)>=30,unlockText:'Lv30で解放',boss:true,bossMonster:NAME,enemies:[NAME],mult:4.4,next:'神話級討伐完了！'};
let old=stages.find(x=>x.id===ID);if(old)Object.assign(old,st);else{const at=stages.findIndex(x=>x.id==='vb');if(at>=0)stages.splice(at+1,0,st);else stages.push(st)}
if(!Number.isFinite(S.kills[NAME]))S.kills[NAME]=0;
// Mythic boss recruitment is deliberately ultra-rare and is allowed even though this is a boss.
const recruit0=rollRecruit;
rollRecruit=function(e){
 if(e&&e.name===NAME){if(!S.monsterCompanions.includes(NAME)&&Math.random()<1/3500){S.monsterCompanions.push(NAME);save();stopAuto(NAME+'が仲間になった');setTimeout(()=>showFx('<h1 class="recruitFlash">MYTHIC COMPANION!</h1><div class="dropItem">深淵の堕天獣が仲間になった！</div><p class="small">超低確率 1/3500</p>','phantom'),180)}return}
 return recruit0(e);
};
// Keep the encounter fixed after every historical spawn/balance wrapper has run.
const spawn0=spawn;
spawn=function(){
 const z=spawn0.apply(this,arguments);
 if(stage().id===ID&&E[0]){const e=E[0];e.name=NAME;e.base=NAME;e.icon='mythicAbyss735';e.boss=true;e.mythic=true;e.max=9500;e.hp=9500;e.atk=70;e.xp=3500;S.seen[NAME]=true;stopAuto('神話級出現');}
 render();return z;
};
function enterMythic736(){
 const st=stages.find(x=>x.id===ID);
 if(!st)return toast('神話級ステージを読み込めません');
 if(!st.unlock(S))return toast(st.unlockText||'Lv30で解放');
 S.stageId=st.id;S.battle=1;
 const ov=document.getElementById('overlay');if(ov)ov.classList.remove('open');
 spawn();toast(st.name+'へ移動！');
}
function decorate735(){
 const app=document.getElementById('app');if(app)app.classList.toggle('mythic735',stage().id===ID);
 if(stage().id===ID)document.querySelectorAll('.enemy[data-monster="'+NAME+'"]').forEach(el=>{const sp=el.querySelector('.sprite');if(sp)sp.innerHTML='<img alt="深淵の堕天獣" src="'+BOSS_ART+'">'});
 document.querySelectorAll('[data-stage="'+ID+'"] b').forEach(b=>{if(!b.querySelector('.mythicBadge735'))b.insertAdjacentHTML('beforeend',' <span class="mythicBadge735">MYTHIC</span>')});
 const panel=document.getElementById('mythicStagePanel73');
 if(panel){const row=panel.querySelector('.mythic73Row[data-mythic-id="'+ID+'"]');if(row){row.classList.add('mythicPlayable736');row.setAttribute('role','button');row.setAttribute('tabindex','0');row.onclick=enterMythic736;row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterMythic736()}}}}
}
const render0=render;render=function(){const z=render0.apply(this,arguments);decorate735();const b=document.getElementById('buildVersion');if(b)b.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;return z};
const stageView0=stageView;stageView=function(){const z=stageView0.apply(this,arguments);decorate735();return z};
// Stable delegated entry handler: survives stage-list redraws and later wrapper renders.
function mythicEntryEvent736(e){
 const row=e.target&&e.target.closest?e.target.closest('.mythic73Row[data-mythic-id="'+ID+'"]'):null;
 if(!row)return;
 if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;
 e.preventDefault();e.stopPropagation();enterMythic736();
}
document.addEventListener('click',mythicEntryEvent736,true);
document.addEventListener('keydown',mythicEntryEvent736,true);
const b=document.getElementById('buildVersion');if(b)b.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;save();render();
})();

;

(function(){
'use strict';
function openProfile746(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();}
  try{
    if(window.__profile741 && typeof window.__profile741.open==='function'){
      window.__profile741.open();
    }else{
      toast('プロフィール機能の読み込みに失敗しました');
    }
  }catch(e){
    try{toast('プロフィールを開けませんでした')}catch(_){ }
  }
}
function bindProfile746(){
  document.querySelectorAll('[data-f57="profile"],[data-fac="profile"]').forEach(function(b){
    b.onclick=openProfile746;
    b.addEventListener('touchend',openProfile746,{passive:false});
  });
}
const baseBefore746=baseView;
baseView=function(){
  const r=baseBefore746.apply(this,arguments);
  bindProfile746();
  return r;
};
// 現在すでに拠点が表示中の場合にも即時で結線する。
bindProfile746();
setTimeout(bindProfile746,0);
setTimeout(bindProfile746,250);
})();

;

(function(){
'use strict';
const VER='v0.74.42';
const HUMAN_ART_POS={'キーボ':'left bottom','ミア':'center bottom','トア':'right bottom'};
function repairBattleVisual748(){
  const battle=document.getElementById('battle'); if(!battle)return;
  const P=typeof partyNames==='function'?partyNames():[];
  // Critical fix: legacy art position follows character identity, never party slot index.
  battle.querySelectorAll('.partyHuman49').forEach(function(el){
    const m=(el.className||'').match(/slot(\d)/),i=m?+m[1]:-1,n=P[i];
    if(HUMAN_ART_POS[n])el.style.backgroundPosition=HUMAN_ART_POS[n];
  });
  // Pivot's duplicate floating name/Lv belongs only in the lower status card.
  battle.querySelectorAll('.pivotName613').forEach(function(el){el.remove()});
}
const renderBefore748=render;
render=function(){
  const r=renderBefore748.apply(this,arguments);
  repairBattleVisual748();
  const b=document.getElementById('buildVersion');if(b)b.textContent=VER;
  document.title='どろダン / DROP OF DUNGEON '+VER;
  return r;
};
const setBefore748=typeof setMember==='function'?setMember:null;
if(setBefore748)setMember=function(){const r=setBefore748.apply(this,arguments);repairBattleVisual748();return r};
window.__repairBattleVisual748=repairBattleVisual748;
repairBattleVisual748();
const b=document.getElementById('buildVersion');if(b)b.textContent=VER;
document.title='どろダン / DROP OF DUNGEON '+VER;
})();

;

(function(){
'use strict';
const VER='v0.74.42';
const ART749={
 'キーボ':DOD_ASSETS["dod_asset_22_86dc54427761.png"],
 'ミア':DOD_ASSETS["dod_asset_23_2b23ef8cebf6.png"],
 'トア':DOD_ASSETS["dod_asset_24_2b7831d5fcc7.png"]
};
function renderHumanArt749(){
 const battle=document.getElementById('battle');if(!battle)return;
 const P=typeof partyNames==='function'?partyNames():[];
 // v0.74.42: keep the legacy partyArt container alive because older party/pivot code uses it as a layout source,
 // but remove ONLY its baked-in meadow image. The new alpha PNG heroes render in their own hqHuman749 layers.
 const legacyComposite=[...battle.children].find(el=>el.classList&&el.classList.contains('partyArt')&&!el.classList.contains('partyHuman49'));
 if(legacyComposite){
   legacyComposite.style.removeProperty('display');
   legacyComposite.style.setProperty('background-image','none','important');
   legacyComposite.style.setProperty('background','none','important');
   legacyComposite.style.setProperty('opacity','1','important');
   legacyComposite.style.setProperty('visibility','visible','important');
 }
 // Old JPEG human slices are retired. New assets are true alpha PNGs.
 battle.querySelectorAll('.partyHuman49').forEach(el=>el.remove());
 battle.querySelectorAll('.hqHuman749').forEach(el=>el.remove());
 P.forEach((name,i)=>{
   const src=ART749[name];if(!src)return;
   const d=document.createElement('div');
   d.className='hqHuman749 slot'+i+' '+(name==='キーボ'?'kibo749':name==='ミア'?'mia749':'toa749');
   const img=document.createElement('img');img.src=src;img.alt=name;img.draggable=false;
   d.appendChild(img);battle.appendChild(d);
 });
 // Pivot keeps its existing clean alpha asset; remove only the duplicate floating label.
 battle.querySelectorAll('.pivotName613').forEach(el=>el.remove());
}
const prevRender749=render;
render=function(){const r=prevRender749.apply(this,arguments);renderHumanArt749();const b=document.getElementById('buildVersion');if(b)b.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;return r};
const prevSet749=typeof setMember==='function'?setMember:null;
if(prevSet749)setMember=function(){const r=prevSet749.apply(this,arguments);setTimeout(renderHumanArt749,0);return r};
window.__renderHumanArt749=renderHumanArt749;
renderHumanArt749();
const b=document.getElementById('buildVersion');if(b)b.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;
})();

;

(function(){
 'use strict';
 const VER='v0.74.42';
 function stamp7420(){
  const b=document.getElementById('buildVersion');if(b)b.textContent=VER;
  const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
  document.title='どろダン / DROP OF DUNGEON '+VER;
 }
 const prev7420=render;
 render=function(){const r=prev7420.apply(this,arguments);stamp7420();return r};
 stamp7420();
})();

;

(function(){
 'use strict';
 function openCredit7421(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();}
  const m=document.getElementById('nwCreditModal');
  if(!m){try{toast('クレジットを開けませんでした')}catch(_){ }return;}
  m.classList.add('open');m.setAttribute('aria-hidden','false');
 }
 function bindCredit7421(){
  const grid=document.querySelector('#obody .facGrid57');
  if(!grid)return;
  let b=grid.querySelector('[data-f57="credit"]');
  if(!b){
   b=document.createElement('button');
   b.className='fac57';b.dataset.f57='credit';
   b.innerHTML='<b>©</b><strong>クレジット</strong><small>NW GAMES・制作者情報</small>';
   grid.appendChild(b);
  }
  b.onclick=openCredit7421;
 }
 const baseBefore7421=baseView;
 baseView=function(){
  const r=baseBefore7421.apply(this,arguments);
  bindCredit7421();
  return r;
 };
 bindCredit7421();
 const stamp7421=function(){
  const v='v0.74.42';
  const b=document.getElementById('buildVersion');if(b)b.textContent=v;
  const sm=document.querySelector('.logo small');if(sm)sm.textContent=v;
  document.title='どろダン / DROP OF DUNGEON '+v;
 };
 const renderBefore7421=render;
 render=function(){const r=renderBefore7421.apply(this,arguments);stamp7421();return r};
 stamp7421();
})();

;

(function(){
 const CASTLE_ART={
  castle_imp:DOD_ASSETS["dod_asset_26_574e216e6260.png"],castle_skull:DOD_ASSETS["dod_asset_27_52b833a72d42.png"],castle_ghost:DOD_ASSETS["dod_asset_28_5f4723c2be67.png"],castle_vampire:DOD_ASSETS["dod_asset_29_e4f795fb5d46.png"],castle_gargoyle:DOD_ASSETS["dod_asset_30_ee91d798e6e7.png"],castle_reaper:DOD_ASSETS["dod_asset_31_40f791670a14.png"],castle_bloodlord:DOD_ASSETS["dod_asset_32_545614a067e8.png"]
 };
 const oldSvgMonster7422=svgMonster;
 svgMonster=function(t,gold=false){if(CASTLE_ART[t])return `<img class="monsterArt" src="${CASTLE_ART[t]}" alt="${t}" draggable="false">`;return oldSvgMonster7422(t,gold)};
 Object.assign(MONSTERS,{
  'デーモンインプ':{...MONSTERS['デーモンインプ'],icon:'castle_imp'},
  'スカルナイト':{...MONSTERS['スカルナイト'],icon:'castle_skull'},
  'ゴースト':{...MONSTERS['ゴースト'],icon:'castle_ghost'},
  'ヴァンパイア':{icon:'castle_vampire',hp:164,atk:51,xp:172,recruit:820},
  'ガーゴイル':{icon:'castle_gargoyle',hp:205,atk:44,xp:178,recruit:900},
  'デスリーパー':{icon:'castle_reaper',hp:235,atk:60,xp:310,recruit:1800},
  'ブラッドロード':{icon:'castle_bloodlord',hp:620,atk:67,xp:980,recruit:0}
 });
 Object.assign(drops,{
  'ヴァンパイア':[{n:'紅血の雫',r:20,rar:'NORMAL',type:'素材',desc:'古城の吸血鬼が残す紅い魔力結晶'},{n:'吸血姫の指輪',r:520,rar:'EPIC',type:'アクセサリー',atk:14,def:7,crit:10,desc:'攻撃+14 / 防御+7 / 会心+10%'}],
  'ガーゴイル':[{n:'魔石の欠片',r:18,rar:'NORMAL',type:'素材',desc:'古城を守る石像の破片'},{n:'守護石像の鎧',r:560,rar:'EPIC',type:'防具',atk:3,def:38,crit:3,desc:'攻撃+3 / 防御+38 / 会心+3%'}],
  'デスリーパー':[{n:'死神の紫布',r:9,rar:'RARE',type:'素材',desc:'死の魔力を帯びた紫布'},{n:'冥葬の大鎌',r:1200,rar:'PHANTOM',type:'武器',atk:55,def:2,crit:16,desc:'攻撃+55 / 防御+2 / 会心+16%'}],
  'ブラッドロード':[{n:'血王の紋章',r:7,rar:'RARE',type:'素材',desc:'呪われた古城の主の証'},{n:'血王剣ブラッドロード',r:950,rar:'PHANTOM',type:'武器',atk:62,def:7,crit:15,desc:'攻撃+62 / 防御+7 / 会心+15%'}]
 });
 const c1=stages.find(x=>x.id==='c1'),c2=stages.find(x=>x.id==='c2'),cb=stages.find(x=>x.id==='cb');
 if(c1)c1.enemies=['デーモンインプ','スカルナイト','ゴースト','ヴァンパイア','ガーゴイル'];
 if(c2)c2.enemies=['ヴァンパイア','ガーゴイル','スカルナイト','ゴースト','デーモンインプ'];
 if(cb){cb.bossMonster='ブラッドロード';cb.enemies=['ブラッドロード'];}
 const spawnBefore7422=spawn;
 spawn=function(){
  spawnBefore7422();
  const st=stage();
  if(st.area==='呪われた古城'&&!st.boss&&E.length&&E[0].name!=='黄金スライム'&&Math.random()<0.06){
   const i=Math.floor(Math.random()*E.length),b=MONSTERS['デスリーパー'],mx=Math.floor((b.hp+S.lv*4)*st.mult);
   E[i]={name:'デスリーパー',base:'デスリーパー',icon:b.icon,hp:mx,max:mx,atk:Math.floor((b.atk+S.lv)*st.mult),xp:Math.floor((b.xp+S.lv*2)*st.mult),charge:false,rareCastle:true};
   S.seen['デスリーパー']=true;stopAuto('レア敵 デスリーパー出現');render();
  }
 };
 if(typeof render==='function')render();
})();

;

(function(){
 'use strict';
 const VER='v0.74.42';
 const GART={
  guren_flame_hound:GUREN_ASSETS["guren_flame_hound.jpg"],
  guren_magma_golem:GUREN_ASSETS["guren_magma_golem.jpg"],
  guren_ignis_serpent:GUREN_ASSETS["guren_ignis_serpent.jpg"],
  guren_hell_scorpion:GUREN_ASSETS["guren_hell_scorpion.jpg"],
  guren_blaze_devil:GUREN_ASSETS["guren_blaze_devil.jpg"],
  guren_fenrir:GUREN_ASSETS["guren_fenrir.jpg"],
  guren_ignadios:GUREN_ASSETS["guren_ignadios.jpg"]
 };
 const svgBefore7425=svgMonster;
 svgMonster=function(t,gold=false){
   if(GART[t])return `<img class="monsterArt" src="${GART[t]}" alt="${t}" draggable="false">`;
   return svgBefore7425(t,gold);
 };
 Object.assign(MONSTERS,{
  'フレイムハウンド':{icon:'guren_flame_hound',hp:330,atk:91,xp:305,recruit:1050},
  'マグマゴーレム':{icon:'guren_magma_golem',hp:455,atk:79,xp:330,recruit:1250},
  'イグニスサーペント':{icon:'guren_ignis_serpent',hp:370,atk:94,xp:322,recruit:1200},
  'ヘルスコーピオン':{icon:'guren_hell_scorpion',hp:395,atk:89,xp:336,recruit:1300},
  'ブレイズデビル':{icon:'guren_blaze_devil',hp:350,atk:99,xp:348,recruit:1400},
  '煉獄獣フェンリル':{icon:'guren_fenrir',hp:590,atk:118,xp:720,recruit:2400},
  '獄炎魔王イグナディオス':{icon:'guren_ignadios',hp:3250,atk:126,xp:3200,recruit:0}
 });
 Object.assign(BASE_MEMBERS,{
  'フレイムハウンド':{hp:132,mp:28,atk:52,def:23,role:'紅蓮の高速牙'},
  'マグマゴーレム':{hp:188,mp:22,atk:45,def:47,role:'溶岩重装'},
  'イグニスサーペント':{hp:151,mp:38,atk:53,def:28,role:'火炎・継続攻撃'},
  'ヘルスコーピオン':{hp:162,mp:30,atk:51,def:36,role:'毒炎の尾針'},
  'ブレイズデビル':{hp:145,mp:48,atk:55,def:29,role:'紅蓮魔法'},
  '煉獄獣フェンリル':{hp:205,mp:42,atk:67,def:38,role:'RARE・黒炎魔獣'}
 });
 Object.assign(COMPANION_SKILLS,{
  'フレイムハウンド':{name:'フレイムファング',lv:8,mult:2.05,rate:.39},
  'マグマゴーレム':{name:'マグマクラッシュ',lv:8,mult:2.12,rate:.34},
  'イグニスサーペント':{name:'イグニスブレス',lv:8,mult:2.10,rate:.37},
  'ヘルスコーピオン':{name:'ヘルスティンガー',lv:8,mult:2.14,rate:.36},
  'ブレイズデビル':{name:'ブレイズフレア',lv:8,mult:2.18,rate:.37},
  '煉獄獣フェンリル':{name:'煉獄黒炎牙',lv:8,mult:2.42,rate:.40}
 });
 Object.assign(COMPANION_TRAITS,{
  'フレイムハウンド':{name:'炎狼の俊足',desc:'攻撃+14%・会心+8%',atk:.14,crit:8},
  'マグマゴーレム':{name:'溶岩装甲',desc:'防御+20%・HP+14%',def:.20,hp:.14},
  'イグニスサーペント':{name:'灼熱鱗',desc:'攻撃+13%・HP+8%',atk:.13,hp:.08},
  'ヘルスコーピオン':{name:'毒炎甲殻',desc:'防御+15%・会心+6%',def:.15,crit:6},
  'ブレイズデビル':{name:'紅蓮魔力',desc:'攻撃+16%・HP+7%',atk:.16,hp:.07},
  '煉獄獣フェンリル':{name:'煉獄覇気',desc:'攻撃+20%・会心+12%',atk:.20,crit:12}
 });
 Object.assign(COMPANION_GROWTH_STYLE,{
  'フレイムハウンド':{hp:7,mp:2,atk:7,def:2},
  'マグマゴーレム':{hp:11,mp:1,atk:5,def:7},
  'イグニスサーペント':{hp:8,mp:3,atk:7,def:3},
  'ヘルスコーピオン':{hp:9,mp:2,atk:6,def:5},
  'ブレイズデビル':{hp:7,mp:5,atk:8,def:3},
  '煉獄獣フェンリル':{hp:10,mp:4,atk:9,def:5}
 });
 Object.assign(drops,{
  'フレイムハウンド':[{n:'炎狼の牙',r:19,rar:'NORMAL',type:'素材',desc:'灼熱を宿した魔狼の牙'},{n:'紅炎牙の短剣',r:520,rar:'EPIC',type:'武器',atk:48,def:2,crit:15,desc:'攻撃+48 / 防御+2 / 会心+15%'}],
  'マグマゴーレム':[{n:'溶岩核',r:18,rar:'NORMAL',type:'素材',desc:'高熱を保ち続ける岩石核'},{n:'黒曜溶岩鎧',r:540,rar:'EPIC',type:'防具',atk:5,def:48,crit:3,desc:'攻撃+5 / 防御+48 / 会心+3%'}],
  'イグニスサーペント':[{n:'灼熱蛇鱗',r:18,rar:'NORMAL',type:'素材',desc:'炎を弾く紅蓮の鱗'},{n:'イグニスリング',r:560,rar:'EPIC',type:'アクセサリー',atk:18,def:8,crit:13,desc:'攻撃+18 / 防御+8 / 会心+13%'}],
  'ヘルスコーピオン':[{n:'獄炎尾針',r:17,rar:'NORMAL',type:'素材',desc:'毒と炎を帯びた巨大な尾針'},{n:'煉毒の護符',r:580,rar:'EPIC',type:'アクセサリー',atk:15,def:14,crit:11,desc:'攻撃+15 / 防御+14 / 会心+11%'}],
  'ブレイズデビル':[{n:'紅蓮魔角',r:16,rar:'NORMAL',type:'素材',desc:'高密度の炎魔力を宿す角'},{n:'魔炎杖ブレイズ',r:620,rar:'EPIC',type:'武器',atk:54,def:4,crit:14,desc:'攻撃+54 / 防御+4 / 会心+14%'}],
  '煉獄獣フェンリル':[{n:'煉獄獣の黒炎毛',r:8,rar:'RARE',type:'素材',desc:'消えない黒炎を帯びた希少な毛'},{n:'煉獄牙フェンリル',r:1450,rar:'PHANTOM',type:'武器',atk:72,def:5,crit:21,desc:'攻撃+72 / 防御+5 / 会心+21%'}],
  '獄炎魔王イグナディオス':[{n:'獄炎王の魔核',r:7,rar:'RARE',type:'素材',desc:'紅蓮魔界を統べる魔王の心核'},{n:'獄炎大剣イグナディオス',r:1150,rar:'PHANTOM',type:'武器',atk:82,def:10,crit:18,desc:'攻撃+82 / 防御+10 / 会心+18%'}]
 });
 const g1=stages.find(x=>x.id==='g1'),g2=stages.find(x=>x.id==='g2'),gb=stages.find(x=>x.id==='gb');
 const normals=['フレイムハウンド','マグマゴーレム','イグニスサーペント','ヘルスコーピオン','ブレイズデビル'];
 if(g1){g1.enemies=[...normals];g1.next='紅蓮魔界2';}
 if(g2){g2.enemies=['ブレイズデビル','ヘルスコーピオン','イグニスサーペント','マグマゴーレム','フレイムハウンド'];g2.next='紅蓮魔界ボス';}
 if(gb){gb.bossMonster='獄炎魔王イグナディオス';gb.enemies=['獄炎魔王イグナディオス'];gb.next='紅蓮魔界を踏破！';}
 [...normals,'煉獄獣フェンリル','獄炎魔王イグナディオス'].forEach(n=>{
   if(!Number.isFinite(S.kills[n]))S.kills[n]=0;
   (drops[n]||[]).forEach(d=>{if(!Number.isFinite(S.dropFound[d.n]))S.dropFound[d.n]=0});
 });
 const spawnBefore7425=spawn;
 spawn=function(){
  spawnBefore7425();
  const st=stage();
  if(st.area==='紅蓮魔界'&&!st.boss&&E.length&&E[0].name!=='黄金スライム'&&Math.random()<0.06){
   const i=Math.floor(Math.random()*E.length),b=MONSTERS['煉獄獣フェンリル'],mx=Math.floor((b.hp+S.lv*4)*st.mult);
   E[i]={name:'煉獄獣フェンリル',base:'煉獄獣フェンリル',icon:b.icon,hp:mx,max:mx,atk:Math.floor((b.atk+S.lv)*st.mult),xp:Math.floor((b.xp+S.lv*2)*st.mult),charge:false,rareGuren7425:true};
   S.seen['煉獄獣フェンリル']=true;stopAuto('RARE 煉獄獣フェンリル出現');render();
  }
 };
 function stamp7425(){
  const b=document.getElementById('buildVersion');if(b)b.textContent=VER;
  const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
  document.title='どろダン / DROP OF DUNGEON '+VER;
 }
 const renderBefore7425=render;
 render=function(){const r=renderBefore7425.apply(this,arguments);stamp7425();return r};
 stamp7425();save();render();
})();

;

(function(){
 'use strict';
 const VER='v0.74.42';
 const G1=['フレイムハウンド','マグマゴーレム','イグニスサーペント','ヘルスコーピオン','ブレイズデビル'];
 const G2=['ブレイズデビル','ヘルスコーピオン','イグニスサーペント','マグマゴーレム','フレイムハウンド'];
 function lockGuren7426(){
   const g1=stages.find(x=>x.id==='g1'),g2=stages.find(x=>x.id==='g2'),gb=stages.find(x=>x.id==='gb');
   if(g1){g1.enemies=G1.slice();g1.next='紅蓮魔界2';}
   if(g2){g2.enemies=G2.slice();g2.next='紅蓮魔界ボス';}
   if(gb){gb.bossMonster='獄炎魔王イグナディオス';gb.enemies=['獄炎魔王イグナディオス'];gb.next='紅蓮魔界を踏破！';}
 }
 const spawn7426=spawn;
 spawn=function(){lockGuren7426();return spawn7426.apply(this,arguments)};
 const render7426=render;
 render=function(){lockGuren7426();const r=render7426.apply(this,arguments);lockGuren7426();const b=document.getElementById('buildVersion');if(b)b.textContent=VER;const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;return r};
 lockGuren7426();render();
})();

;

(function(){
'use strict';
const VER='v0.74.42',VA=window.VOLCANO_ASSETS||{};
const VART={
 volcano_magma_slime:VA['magma_slime.png'],volcano_flame_lizard:VA['flame_lizard.png'],volcano_flame_bat:VA['flame_bat.png'],volcano_salamander:VA['salamander.png'],volcano_magma_golem:VA['magma_golem.png'],volcano_ifrit:VA['ifrit.png'],volcano_volganos:VA['volganos.png']
};
const svgBefore7429=svgMonster;
svgMonster=function(t,gold=false){if(VART[t])return `<img class="monsterArt" src="${VART[t]}" alt="${t}" draggable="false">`;return svgBefore7429(t,gold)};
Object.assign(MONSTERS,{
 'マグマスライム':{icon:'volcano_magma_slime',hp:96,atk:24,xp:72,recruit:430},
 'フレイムリザード':{icon:'volcano_flame_lizard',hp:112,atk:28,xp:82,recruit:500},
 '炎翼バット':{icon:'volcano_flame_bat',hp:92,atk:31,xp:88,recruit:540},
 'サラマンダー':{icon:'volcano_salamander',hp:138,atk:34,xp:104,recruit:650},
 '灼熱マグマゴーレム':{icon:'volcano_magma_golem',hp:165,atk:32,xp:118,recruit:760},
 'イフリート':{icon:'volcano_ifrit',hp:245,atk:43,xp:285,recruit:1150},
 '焔竜王・ヴォルガノス':{icon:'volcano_volganos',hp:980,atk:48,xp:980,recruit:0}
});
Object.assign(BASE_MEMBERS,{
 '灼熱マグマゴーレム':{hp:142,mp:16,atk:31,def:38,role:'火山重装'},
 'イフリート':{hp:158,mp:42,atk:45,def:27,role:'RARE・炎精霊'}
});
Object.assign(COMPANION_SKILLS,{
 '灼熱マグマゴーレム':{name:'ボルカニッククラッシュ',lv:8,mult:2.02,rate:.34},
 'イフリート':{name:'インフェルノ',lv:8,mult:2.32,rate:.39}
});
Object.assign(COMPANION_TRAITS,{
 '灼熱マグマゴーレム':{name:'灼熱岩装',desc:'HP+15%・防御+18%',hp:.15,def:.18},
 'イフリート':{name:'炎精霊王',desc:'攻撃+18%・会心+10%',atk:.18,crit:10}
});
Object.assign(COMPANION_GROWTH_STYLE,{
 '灼熱マグマゴーレム':{hp:10,mp:1,atk:4,def:6},'イフリート':{hp:8,mp:5,atk:8,def:3}
});
Object.assign(drops,{
 '灼熱マグマゴーレム':[{n:'灼熱岩核',r:18,rar:'NORMAL',type:'素材',desc:'火山深部の熱を蓄えた岩核'},{n:'火山巨兵の鎧',r:520,rar:'EPIC',type:'防具',atk:4,def:42,crit:3,desc:'攻撃+4 / 防御+42 / 会心+3%'}],
 'イフリート':[{n:'炎精霊の核',r:8,rar:'RARE',type:'素材',desc:'高位炎精霊が残す魔力核'},{n:'炎精霊王の腕輪',r:1250,rar:'PHANTOM',type:'アクセサリー',atk:34,def:12,crit:18,desc:'攻撃+34 / 防御+12 / 会心+18%'}]
});
const V1=['マグマスライム','フレイムリザード','炎翼バット','サラマンダー','灼熱マグマゴーレム'];
const V2=['灼熱マグマゴーレム','サラマンダー','炎翼バット','フレイムリザード','マグマスライム'];
function lock7429(){
 const v1=stages.find(x=>x.id==='v1'),v2=stages.find(x=>x.id==='v2'),vb=stages.find(x=>x.id==='vb');
 if(v1)v1.enemies=V1.slice();if(v2)v2.enemies=V2.slice();if(vb){vb.bossMonster='焔竜王・ヴォルガノス';vb.enemies=['焔竜王・ヴォルガノス'];}
 const app=document.getElementById('app');if(app)app.classList.toggle('volcano7429',stage().area==='灼熱の火山');
 const b=document.getElementById('battle');if(b&&stage().area==='灼熱の火山'&&VA['volcano_bg.jpg'])b.style.setProperty('background-image',`linear-gradient(180deg,rgba(20,0,0,.04),rgba(35,0,0,.08)),url("${VA['volcano_bg.jpg']}")`,'important');
}
['灼熱マグマゴーレム','イフリート'].forEach(n=>{if(!Number.isFinite(S.kills[n]))S.kills[n]=0;(drops[n]||[]).forEach(d=>{if(!Number.isFinite(S.dropFound[d.n]))S.dropFound[d.n]=0})});
const spawnBefore7429=spawn;
spawn=function(){lock7429();spawnBefore7429();const st=stage();if(st.area==='灼熱の火山'&&!st.boss&&E.length&&E[0].name!=='黄金スライム'&&Math.random()<.05){const i=Math.floor(Math.random()*E.length),b=MONSTERS['イフリート'],mx=Math.floor((b.hp+S.lv*4)*st.mult);E[i]={name:'イフリート',base:'イフリート',icon:b.icon,hp:mx,max:mx,atk:Math.floor((b.atk+S.lv)*st.mult),xp:Math.floor((b.xp+S.lv*2)*st.mult),charge:false,rareVolcano7429:true};S.seen['イフリート']=true;stopAuto('RARE イフリート出現');render();}};
const renderBefore7429=render;
render=function(){lock7429();const r=renderBefore7429.apply(this,arguments);lock7429();const bv=document.getElementById('buildVersion');if(bv)bv.textContent=VER;const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;document.title='どろダン / DROP OF DUNGEON '+VER;return r};
lock7429();save();render();
})();

;

(()=>{
'use strict';
const VER='v0.74.42', SA=window.SKY_ASSETS||{};
const ART={
 sky_air:SA['sky_air.png'], sky_golem:SA['sky_golem.png'], sky_hawk:SA['sky_hawk.png'],
 sky_cloud:SA['sky_cloud.png'], sky_fairy:SA['sky_fairy.png'],
 sky_rare:SA['sky_rare.png'], sky_boss:SA['sky_boss.png']
};
const oldSvg7434=svgMonster;
svgMonster=function(t,gold=false){
 if(ART[t])return `<img class="monsterArt" src="${ART[t]}" alt="${t}" draggable="false">`;
 return oldSvg7434(t,gold);
};

Object.assign(MONSTERS,{
 'エアラビ':{icon:'sky_air',hp:168,atk:47,xp:166,recruit:620},
 'スカイゴーレム':{icon:'sky_golem',hp:228,atk:52,xp:194,recruit:760},
 'ウィンドホーク':{icon:'sky_hawk',hp:154,atk:56,xp:186,recruit:700},
 'クラウドスライム':{icon:'sky_cloud',hp:184,atk:49,xp:178,recruit:650},
 'フロストフェアリー':{icon:'sky_fairy',hp:172,atk:58,xp:202,recruit:780},
 'スノーラビット':{icon:'sky_rare',hp:260,atk:66,xp:520,recruit:980},
 '天空機神・アストライオス':{icon:'sky_boss',hp:1980,atk:72,xp:1950,recruit:0}
});

const SKY1=['エアラビ','スカイゴーレム','ウィンドホーク','クラウドスライム','フロストフェアリー'];
const SKY2=['フロストフェアリー','ウィンドホーク','スカイゴーレム','クラウドスライム','エアラビ'];

function lockSky7434(){
 const s1=stages.find(x=>x.id==='s1'),s2=stages.find(x=>x.id==='s2'),sb=stages.find(x=>x.id==='sb');
 if(s1)s1.enemies=SKY1.slice();
 if(s2)s2.enemies=SKY2.slice();
 if(sb){sb.boss=true;sb.bossMonster='天空機神・アストライオス';sb.enemies=['天空機神・アストライオス'];}
 const app=document.getElementById('app')||document.body;
 let sky=false;try{sky=stage().area==='天空遺跡'}catch(e){}
 app.classList.toggle('sky7434',sky);
 const b=document.getElementById('battle');
 if(b&&sky&&SA['sky_bg.jpg']){
   b.style.setProperty('background-image',`linear-gradient(180deg,rgba(2,20,55,.02),rgba(0,25,60,.08)),url("${SA['sky_bg.jpg']}")`,'important');
 }
}
const spawn7434=spawn;
spawn=function(){
 lockSky7434();
 spawn7434();
 const st=stage();
 if(st.area==='天空遺跡'&&!st.boss&&E.length&&E[0].name!=='黄金スライム'&&Math.random()<.05){
   const i=Math.floor(Math.random()*E.length),b=MONSTERS['スノーラビット'];
   const mx=Math.floor((b.hp+S.lv*4)*st.mult);
   E[i]={name:'スノーラビット',base:'スノーラビット',icon:b.icon,hp:mx,max:mx,
     atk:Math.floor((b.atk+S.lv)*st.mult),xp:Math.floor((b.xp+S.lv*2)*st.mult),
     charge:false,rareSky7434:true};
   S.seen['スノーラビット']=true;
   if(typeof stopAuto==='function')stopAuto('RARE スノーラビット出現');
   render();
 }
};
const render7434=render;
render=function(){
 lockSky7434();
 const z=render7434.apply(this,arguments);
 lockSky7434();
 const bv=document.getElementById('buildVersion');if(bv)bv.textContent=VER;
 const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER;
 document.title='どろダン / DROP OF DUNGEON '+VER;
 return z;
};
['エアラビ','スカイゴーレム','ウィンドホーク','クラウドスライム','フロストフェアリー','スノーラビット','天空機神・アストライオス'].forEach(n=>{
 if(!Number.isFinite(S.kills[n]))S.kills[n]=0;
});
lockSky7434();save();render();
})();

;

(function(){
'use strict';
const VER='v0.74.42';
function syncStageVisual7435(){
  const app=document.getElementById('app')||document.body;
  const battle=document.getElementById('battle');
  if(!battle)return;
  let st=null;try{st=stage()}catch(e){}
  const area=st&&st.area||'';
  const sky=area==='天空遺跡', volcano=area==='灼熱の火山';
  app.classList.toggle('sky7434',sky);
  app.classList.toggle('volcano7429',volcano);
  if(sky&&window.SKY_ASSETS&&window.SKY_ASSETS['sky_bg.jpg']){
    battle.style.setProperty('background-image','linear-gradient(180deg,rgba(2,20,55,.02),rgba(0,25,60,.08)),url("'+window.SKY_ASSETS['sky_bg.jpg']+'")','important');
  }else if(volcano&&window.VOLCANO_ASSETS&&window.VOLCANO_ASSETS['volcano_bg.jpg']){
    battle.style.setProperty('background-image','linear-gradient(180deg,rgba(20,0,0,.04),rgba(35,0,0,.08)),url("'+window.VOLCANO_ASSETS['volcano_bg.jpg']+'")','important');
  }else{
    /* v0.74.34 left Sky/Volcano data-URL backgrounds inline with !important.
       That inline style overrode Castle/Guren/Mythic CSS after changing stages. */
    battle.style.removeProperty('background-image');
  }
  const bv=document.getElementById('buildVersion');if(bv)bv.textContent=VER;
  document.title='どろダン / DROP OF DUNGEON '+VER;
}
const render7435=render;
render=function(){const z=render7435.apply(this,arguments);syncStageVisual7435();return z};
const spawn7435=spawn;
spawn=function(){const z=spawn7435.apply(this,arguments);syncStageVisual7435();return z};
window.__syncStageVisual7435=syncStageVisual7435;
syncStageVisual7435();
})();

;

(()=>{
'use strict';
const VER7436='v0.74.42';
const H=['リリア','セレナ','ノア','カグラ'];
const DATA={
'リリア':{hp:58,mp:42,atk:15,def:8,role:'炎＋光 / 魔法アタッカー＋回復',skills:['ハートフレア','ラブリーヒール','クリムゾンハート','永遠に燃ゆる恋心《エターナル・ラヴ》'],gear:'真紅宝杖エターナルハート'},
'セレナ':{hp:62,mp:32,atk:18,def:9,role:'闇＋月 / 高速アタッカー＋刻印',skills:['月影連刃','ナイトメアキス','月蝕','終月葬《エクリプス・レクイエム》'],gear:'月蝕双刃ルナ・エクリプス'},
'ノア':{hp:60,mp:38,atk:17,def:10,role:'雷＋星 / 遠距離＋解析・ブレイク',skills:['スターショット','アナライズ','オービットバースト','天星殲機《アストラル・ノヴァ》'],gear:'星導魔銃アーク・ノヴァ'},
'カグラ':{hp:76,mp:26,atk:22,def:11,role:'炎＋闇 / 超火力＋自己強化',skills:['鬼火一閃','鬼神憑依','紅蓮乱舞','鬼哭紅蓮・天照断'],gear:'神喰妖刀・紅夜叉'}
};
Object.assign(BASE_MEMBERS,DATA);
Object.assign(specialItems,{
'真紅宝杖エターナルハート':{n:'真紅宝杖エターナルハート',type:'武器',rar:'LEGEND',atk:54,def:10,crit:10,exclusive:'リリア',desc:'リリア専用 / 炎・光魔法と回復を強化'},
'月蝕双刃ルナ・エクリプス':{n:'月蝕双刃ルナ・エクリプス',type:'武器',rar:'LEGEND',atk:66,def:5,crit:22,exclusive:'セレナ',desc:'セレナ専用 / 連撃・会心・月蝕刻印を強化'},
'星導魔銃アーク・ノヴァ':{n:'星導魔銃アーク・ノヴァ',type:'武器',rar:'LEGEND',atk:62,def:7,crit:17,exclusive:'ノア',desc:'ノア専用 / 解析後のブレイク火力を強化'},
'神喰妖刀・紅夜叉':{n:'神喰妖刀・紅夜叉',type:'武器',rar:'LEGEND',atk:78,def:4,crit:16,exclusive:'カグラ',desc:'カグラ専用 / 自己強化時の超火力を強化'},
'天啓盤アカシック・ギア':{n:'天啓盤アカシック・ギア',type:'アクセサリー',rar:'LEGEND',atk:24,def:24,crit:22,exclusive:'ピボット',desc:'ピボット専用 / 解析・戦術支援を強化'}
});
const GEARS=['真紅宝杖エターナルハート','月蝕双刃ルナ・エクリプス','星導魔銃アーク・ノヴァ','神喰妖刀・紅夜叉','天啓盤アカシック・ギア'];
S.unlockedHeroes7436=Array.isArray(S.unlockedHeroes7436)?S.unlockedHeroes7436:[];
S.heroEquipment65=S.heroEquipment65||{};
[...H,'ピボット'].forEach(n=>S.heroEquipment65[n]=S.heroEquipment65[n]||{武器:'',防具:'',アクセサリー:''});

if(window.__equip65&&Array.isArray(window.__equip65.heroes))H.forEach(n=>{if(!window.__equip65.heroes.includes(n))window.__equip65.heroes.push(n)});

const oldEquip=equipTo;
equipTo=function(i,n){
 const x=item(n),who=partyNames()[i];
 if(x.exclusive&&x.exclusive!==who)return toast(`${n}は${x.exclusive}専用です`);
 const r=oldEquip(i,n);
 if(S.heroEquipment65&&S.heroEquipment65[who])S.heroEquipment65[who]={...S.equipment[i]};
 save();return r;
};

const oldStats=statsFor;
statsFor=function(i){
 const n=partyNames()[i];
 if(!H.includes(n))return oldStats(i);
 const b=BASE_MEMBERS[n],eq=S.equipment[i]||{},its=Object.values(eq).filter(Boolean).map(item).filter(x=>!x.exclusive||x.exclusive===n);
 const lv=S.lv||1, bonus={リリア:[1.5,1.15],セレナ:[2.7,1.25],ノア:[2.4,1.35],カグラ:[3.8,1.45]}[n];
 return {atk:Math.floor(b.atk+(lv-1)*bonus[0]+its.reduce((a,x)=>a+(x.atk||0),0)),def:Math.floor(b.def+(lv-1)*bonus[1]+its.reduce((a,x)=>a+(x.def||0),0)),crit:+(5+its.reduce((a,x)=>a+(x.crit||0),0)).toFixed(1)};
};

function setHero7436(slot,n){
 if(slot<1||slot>2)return;if(!S.unlockedHeroes7436.includes(n))return toast(n+'は星降りの召喚で未獲得です');
 if(S.partySlots.includes(n)){let o=S.partySlots.indexOf(n);if(o!==slot-1)S.partySlots[o]=slot===1?'ミア':'トア'}
 S.partySlots[slot-1]=n;
 S.equipment[slot]={...(S.heroEquipment65[n]||{武器:'',防具:'',アクセサリー:''})};
 S.hp[slot]=maxHp(slot);S.mp[slot]=maxMp(slot);save();render();partyView('heroes7436');toast(`${n}を${slot+1}枠目に編成`);
}
function equipOwn7436(n){
 const gear=DATA[n]?.gear;if(!gear)return;const x=item(gear),slot=partyNames().indexOf(n);
 S.heroEquipment65[n][x.type]=gear;if(slot>=0)S.equipment[slot]={...S.heroEquipment65[n]};
 save();render();partyView('heroes7436');toast(`${n}が${gear}を装備`);
}
const party0=partyView;
partyView=function(mode='members'){
 if(mode!=='heroes7436'){
  party0(mode);
  const tabs=document.querySelector('#obody .heroTabs65')||document.querySelector('#obody .tabs');
  if(tabs&&!tabs.querySelector('[data-hub7436]')){let b=document.createElement('button');b.dataset.hub7436='1';b.textContent='追加4キャラ';b.onclick=()=>partyView('heroes7436');tabs.appendChild(b)}
  return;
 }
 open('追加4キャラクター',`<div class="panel">${H.map(n=>{let d=DATA[n],sl=partyNames().indexOf(n),eq=S.heroEquipment65[n]||{},on=Object.values(eq).includes(d.gear);return `<div class="hero7436"><h3>${n} ${sl>=0?`<span class="badgeActive">${sl+1}枠目</span>`:''}</h3><div class="role">${d.role}</div><div class="skill">${d.skills.join(' / ')}</div><div class="exclusive">専用：${d.gear}${on?' ✓装備中':''}</div><div class="memberPick"><button data-hn="${n}" data-hs="1">2枠に編成</button><button data-hn="${n}" data-hs="2">3枠に編成</button><button data-he="${n}">専用装備</button><button data-hd="${n}">詳細</button></div></div>`}).join('')}<div class="hero7436"><h3>ピボット専用装備</h3><div class="exclusive">天啓盤アカシック・ギア</div><button data-pivotgear>ピボットに装備</button></div></div>`);
 document.querySelectorAll('[data-hn]').forEach(b=>b.onclick=()=>setHero7436(+b.dataset.hs,b.dataset.hn));
 document.querySelectorAll('[data-he]').forEach(b=>b.onclick=()=>equipOwn7436(b.dataset.he));
 document.querySelectorAll('[data-hd]').forEach(b=>b.onclick=()=>{let n=b.dataset.hd,d=DATA[n];open(n,`<div class="panel"><h2>${n}</h2><p>${d.role}</p>${d.skills.map((x,i)=>`<div class="row"><b>${i===3?'必殺':'スキル'+(i+1)}</b><span>${x}</span></div>`).join('')}<div class="row"><b>専用装備</b><span>${d.gear}</span></div></div>`)});
 const pb=document.querySelector('[data-pivotgear]');if(pb)pb.onclick=()=>{if(!partyNames().includes('ピボット'))return toast('ピボットを編成してください');let i=partyNames().indexOf('ピボット'),x=item('天啓盤アカシック・ギア');S.heroEquipment65['ピボット'][x.type]=x.n;S.equipment[i]={...S.heroEquipment65['ピボット']};save();render();partyView('heroes7436');toast('ピボットが天啓盤アカシック・ギアを装備')};
};

const comp0=companionActions;
companionActions=function(){
 if(!S.partySlots.some(n=>H.includes(n)))return comp0();
 for(let i=1;i<3;i++){
  if(S.hp[i]<=0||!living().length)continue;
  let n=partyNames()[i],idx=E.findIndex(e=>e.hp>0);if(idx<0)break;
  if(!H.includes(n)){let st=statsFor(i),crit=Math.random()<st.crit/100;hit(idx,Math.floor(st.atk*(.88+Math.random()*.22)*(crit?1.65:1)),crit);continue}
  let st=statsFor(i),lv=S.lv||1,mult=1,skill=DATA[n].skills[0],cost=4;
  if(n==='リリア'&&S.hp.some((h,j)=>h>0&&h<maxHp(j)*.45)&&S.mp[i]>=7){S.mp[i]-=7;let j=S.hp.map((h,j)=>({h,j,r:h/maxHp(j)})).filter(x=>x.h>0).sort((a,b)=>a.r-b.r)[0].j,heal=Math.floor(35+lv*2.3);S.hp[j]=Math.min(maxHp(j),S.hp[j]+heal);showLog(`リリアの「ラブリーヒール」！ ${partyNames()[j]} HP+${heal}`);continue}
  if(lv>=30&&S.mp[i]>=16){skill=DATA[n].skills[3];cost=16;mult=n==='カグラ'?3.8:3.25}
  else if(lv>=20&&S.mp[i]>=10){skill=DATA[n].skills[2];cost=10;mult=n==='カグラ'?2.5:2.2}
  else if(lv>=10&&S.mp[i]>=7){skill=DATA[n].skills[1];cost=7;mult=1.75}
  if(S.mp[i]>=cost){S.mp[i]-=cost;showLog(`${n}の「${skill}」！`)}else mult=1;
  let crit=Math.random()<st.crit/100;hit(idx,Math.floor(st.atk*mult*(.9+Math.random()*.2)*(crit?1.65:1)),crit);
 }
};

const render0=render;
render=function(){let r=render0.apply(this,arguments);const bv=document.getElementById('buildVersion');if(bv)bv.textContent=VER7436;const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER7436;document.title='どろダン / DROP OF DUNGEON '+VER7436;return r};
save();render();
})();

;
(()=>{const EX=['真紅宝杖エターナルハート','月蝕双刃ルナ・エクリプス','星導魔銃アーク・ノヴァ','神喰妖刀・紅夜叉','天啓盤アカシック・ギア'];if(S.grantExclusive7436&&!S.formalSummonMigration7437){S.owned=S.owned.filter(n=>!EX.includes(n));EX.forEach(n=>{if(S.dropFound)delete S.dropFound[n]});if(S.heroEquipment65)Object.values(S.heroEquipment65).forEach(eq=>eq&&Object.keys(eq).forEach(k=>{if(EX.includes(eq[k]))eq[k]=''}));S.equipment.forEach(eq=>eq&&Object.keys(eq).forEach(k=>{if(EX.includes(eq[k]))eq[k]=''}));S.formalSummonMigration7437=true;delete S.grantExclusive7436}const info={'リリア':'✦','セレナ':'☾','ノア':'✧','カグラ':'炎'};function art(){const b=document.getElementById('battle');if(!b)return;b.querySelectorAll('.heroFallback7437').forEach(x=>x.remove());partyNames().forEach((n,i)=>{if(!info[n])return;let d=document.createElement('div');d.className='heroFallback7437 slot'+i;d.innerHTML='<div class="heroFallbackMark7437">'+info[n]+'</div><div class="heroFallbackName7437">'+n+'</div>';b.appendChild(d)})}const r=render;render=function(){let z=r.apply(this,arguments);art();let v=document.getElementById('buildVersion');if(v)v.textContent='v0.74.42';let sm=document.querySelector('.logo small');if(sm)sm.textContent='v0.74.42';document.title='どろダン / DROP OF DUNGEON v0.74.42';return z};save();render()})();
;

(()=>{
'use strict';
const VER7438='v0.74.42';
const HEROES7438=['キーボ','ミア','トア','ピボット','リリア','セレナ','ノア','カグラ'];
const ICON7438={
 'キーボ':['剣','#751622','#ff384f'],'ミア':['✦','#51306f','#d99cff'],'トア':['刃','#133c70','#5fcaff'],'ピボット':['盤','#7a5916','#ffd76b'],
 'リリア':['♥','#a5295d','#ff9dc9'],'セレナ':['☾','#39206f','#9d82ff'],'ノア':['✧','#135276','#77ddff'],'カグラ':['炎','#701b16','#ff6b45']
};
const MONICON7438={'スライム':'●','ゴブリン':'♠','ウルフ':'◆','フェアリー':'✦','ゴーレム':'⬢','ドラゴン':'♛','ラビット':'♣','バット':'◆','サーペント':'〰','インプ':'♠'};
function heroIcon7438(n){
 let a=ICON7438[n]||['◆','#263b59','#79a8d8'];return `<span class="partyIcon7438" style="--c1:${a[1]};--c2:${a[2]}">${a[0]}</span>`;
}
function monsterIcon7438(n){
 let k=Object.keys(MONICON7438).find(x=>n.includes(x)),m=MONICON7438[k]||'◆';
 return `<span class="partyIcon7438" style="--c1:#17304d;--c2:#65b8d8">${m}</span>`;
}
function gearIcon7438(n){
 let x=typeof item==='function'?item(n):{},t=x?.type||'',g='◇';
 if(t==='武器'){if(/杖/.test(n))g='♜';else if(/銃/.test(n))g='⌁';else if(/双刃/.test(n))g='⚔';else if(/刀/.test(n))g='刀';else if(/槍/.test(n))g='♠';else g='⚔'}
 else if(t==='防具')g='♜';else if(t==='アクセサリー')g='◉';
 return `<span class="gearIcon7438 ${x?.rar==='LEGEND'?'legend':''}">${g}</span>`;
}

/* --- free 3-slot party model; migrates old fixed-Keebo saves safely --- */
if(!Array.isArray(S.partyFree7438)||S.partyFree7438.length!==3){
 S.partyFree7438=['キーボ',...(Array.isArray(S.partySlots)?S.partySlots:['ミア','トア'])].slice(0,3);
}
const oldPartyNames7438=partyNames;
partyNames=function(){return S.partyFree7438.slice(0,3)};

function syncFree7438(){
 S.partySlots=[S.partyFree7438[1]||'ミア',S.partyFree7438[2]||'トア'];
 for(let i=0;i<3;i++){
  let n=S.partyFree7438[i];
  if(S.heroEquipment65?.[n])S.equipment[i]={...S.heroEquipment65[n]};
  S.hp[i]=Math.min(S.hp[i]||maxHp(i),maxHp(i));S.mp[i]=Math.min(S.mp[i]||maxMp(i),maxMp(i));
 }
}
function setFree7438(slot,n){
 if(slot<0||slot>2)return;
 if(['リリア','セレナ','ノア','カグラ'].includes(n)&&!S.unlockedHeroes7436?.includes(n))return toast(`${n}は未獲得です`);
 if(n==='ピボット'&&!S.legend62?.pivot)return toast('ピボットは未獲得です');
 let cur=S.partyFree7438.indexOf(n);
 if(cur>=0&&cur!==slot)[S.partyFree7438[cur],S.partyFree7438[slot]]=[S.partyFree7438[slot],S.partyFree7438[cur]];
 else S.partyFree7438[slot]=n;
 syncFree7438();for(let i=0;i<3;i++){S.hp[i]=maxHp(i);S.mp[i]=maxMp(i)}save();render();partyView('free7438');toast(`${n}を${slot+1}枠目に編成`);
}

/* First slot is now the manual actor. Existing attack/defend/item code already targets index 0.
   Skill button gets a character-specific action for the four new heroes; legacy heroes keep existing skill systems. */
function newHeroSkill7438(n){
 let i=0,st=statsFor(i),lv=S.lv||1,idx=E.findIndex(e=>e.hp>0);if(idx<0)return;
 const D={
 'リリア':[['ハートフレア',6,1.55],['クリムゾンハート',12,2.35],['永遠に燃ゆる恋心《エターナル・ラヴ》',20,3.5]],
 'セレナ':[['月影連刃',5,1.65],['月蝕',10,2.4],['終月葬《エクリプス・レクイエム》',18,3.55]],
 'ノア':[['スターショット',5,1.6],['オービットバースト',11,2.45],['天星殲機《アストラル・ノヴァ》',19,3.5]],
 'カグラ':[['鬼火一閃',5,1.8],['紅蓮乱舞',10,2.65],['鬼哭紅蓮・天照断',18,3.9]]
 }[n];
 if(n==='リリア'&&S.hp.some((h,j)=>h>0&&h<maxHp(j)*.5)&&S.mp[0]>=8){
  S.mp[0]-=8;let j=S.hp.map((h,j)=>({h,j,r:h/maxHp(j)})).filter(x=>x.h>0).sort((a,b)=>a.r-b.r)[0].j,heal=Math.floor(35+lv*2.4);S.hp[j]=Math.min(maxHp(j),S.hp[j]+heal);showLog(`リリアの「ラブリーヒール」！ ${partyNames()[j]} HP+${heal}`);save();render();return;
 }
 let z=lv>=30?D[2]:lv>=20?D[1]:D[0];if(S.mp[0]<z[1])return toast('MPが足りません');
 S.mp[0]-=z[1];showLog(`${n}の「${z[0]}」！`);let crit=Math.random()<st.crit/100;hit(idx,Math.floor(st.atk*z[2]*(crit?1.65:1)),crit);save();render();
}
const skill0=skill;
skill=function(){
 let n=partyNames()[0];
 if(['リリア','セレナ','ノア','カグラ'].includes(n))return newHeroSkill7438(n);
 return skill0.apply(this,arguments);
};

/* Companion AI must also handle Keebo when he is moved away from slot 1. */
const comp7438=companionActions;
companionActions=function(){
 let names=partyNames();
 if(names[0]==='キーボ'&&!names.slice(1).includes('キーボ'))return comp7438();
 for(let i=1;i<3;i++){
  if(S.hp[i]<=0||!living().length)continue;let n=names[i],idx=E.findIndex(e=>e.hp>0);if(idx<0)break;let st=statsFor(i),crit=Math.random()<st.crit/100,m=1;
  if(n==='キーボ')m=1.12;
  else if(n==='ミア')m=1.05;
  else if(n==='トア')m=1.18;
  else if(n==='ピボット')m=.95;
  else if(['リリア','セレナ','ノア','カグラ'].includes(n)){m={リリア:1.3,セレナ:1.45,ノア:1.4,カグラ:1.65}[n];if(S.mp[i]>=6)S.mp[i]-=6}
  hit(idx,Math.floor(st.atk*m*(.9+Math.random()*.2)*(crit?1.65:1)),crit);
 }
};

/* Full free-party editor with compact character portraits. */
const party7438=partyView;
partyView=function(mode='members'){
 if(mode!=='free7438'){
  party7438(mode);
  const tabs=document.querySelector('#obody .heroTabs65')||document.querySelector('#obody .tabs');
  if(tabs&&!tabs.querySelector('[data-free7438]')){let b=document.createElement('button');b.dataset.free7438='1';b.textContent='自由編成';b.onclick=()=>partyView('free7438');tabs.appendChild(b)}
  decorate7438();return;
 }
 const available=HEROES7438.filter(n=>!(['リリア','セレナ','ノア','カグラ'].includes(n)&&!S.unlockedHeroes7436?.includes(n))&&!(n==='ピボット'&&!S.legend62?.pivot));
 open('自由パーティ編成',`<div class="panel"><h3>現在の編成</h3><div class="memberPick">${S.partyFree7438.map((n,i)=>`<button>${i+1}枠 ${n}</button>`).join('')}</div><p class="small">1枠目が手動操作キャラクターです。キーボ固定はありません。</p></div>
 <div class="panel">${available.map(n=>`<div class="hero7436 memberCard7438">${heroIcon7438(n)}<h3>${n} Lv.${n==='キーボ'||n==='トア'?S.lv:(S.charGrowth?.[n]?.lv||S.lv)}</h3><div class="role">${BASE_MEMBERS[n]?.role||''}</div><div class="memberPick"><button data-fn="${n}" data-fs="0">1枠</button><button data-fn="${n}" data-fs="1">2枠</button><button data-fn="${n}" data-fs="2">3枠</button></div></div>`).join('')}</div>`);
 document.querySelectorAll('[data-fn]').forEach(b=>b.onclick=()=>setFree7438(+b.dataset.fs,b.dataset.fn));
};

/* Decorate existing party/monster/equipment cards without replacing their logic. */
function decorate7438(){
 const root=document.getElementById('obody');if(!root)return;
 root.querySelectorAll('.memberCard65,.hero7436').forEach(c=>{let h=c.querySelector('h3,b');if(!h||c.querySelector('.partyIcon7438'))return;let n=HEROES7438.find(x=>h.textContent.includes(x));if(n)h.insertAdjacentHTML('beforebegin',heroIcon7438(n))});
 root.querySelectorAll('.monsterCard65,.monsterCard').forEach(c=>{let h=c.querySelector('h3,b');if(!h||c.querySelector('.partyIcon7438'))return;h.insertAdjacentHTML('beforebegin',monsterIcon7438(h.textContent.trim()))});
 root.querySelectorAll('.equipCard65,.shopCard,.itemCard').forEach(c=>{let h=c.querySelector('h3,b');if(!h||c.querySelector('.gearIcon7438'))return;let n=Object.keys(specialItems).find(x=>h.textContent.includes(x))||h.textContent.trim();h.insertAdjacentHTML('beforebegin',gearIcon7438(n))});
}
const open7438=open;
open=function(){let z=open7438.apply(this,arguments);setTimeout(decorate7438,0);return z};

const render7438=render;
render=function(){let z=render7438.apply(this,arguments);const b=document.getElementById('buildVersion');if(b)b.textContent=VER7438;const sm=document.querySelector('.logo small');if(sm)sm.textContent=VER7438;document.title='どろダン / DROP OF DUNGEON '+VER7438;return z};
syncFree7438();save();render();
})();

;

(()=>{
'use strict';
const VER7439='v0.74.42';
const ALL7439=['キーボ','ミア','トア','ピボット','リリア','セレナ','ノア','カグラ'];
const IC7439={
'キーボ':['剣','#641522','#ff4058'],'ミア':['✦','#45205e','#d89cff'],'トア':['刃','#123d69','#61d5ff'],'ピボット':['盤','#6b5119','#ffd45d'],
'リリア':['♥','#8c2457','#ff9cc9'],'セレナ':['☾','#33206c','#a08aff'],'ノア':['✧','#12506f','#72ddff'],'カグラ':['炎','#681915','#ff6846']
};
function av7439(n,mon=false){let a=IC7439[n]||['◆','#17304c','#65b6d8'];return `<span class="avatar7439 ${mon?'mon':''}" style="--a:${a[1]};--b:${a[2]}">${a[0]}</span>`}
function unlocked7439(n){
 if(['キーボ','ミア','トア'].includes(n))return true;
 if(n==='ピボット')return !!S.legend62?.pivot;
 return !!S.unlockedHeroes7436?.includes(n);
}
/* canonical party = free three slots */
if(!Array.isArray(S.partyFree7438)||S.partyFree7438.length!==3)S.partyFree7438=['キーボ',...(S.partySlots||['ミア','トア'])].slice(0,3);
partyNames=function(){return S.partyFree7438.slice(0,3)};
function assign7439(slot,n){
 if(!unlocked7439(n))return toast(`${n}は未獲得です`);
 let old=S.partyFree7438.indexOf(n);
 if(old>=0&&old!==slot)[S.partyFree7438[old],S.partyFree7438[slot]]=[S.partyFree7438[slot],S.partyFree7438[old]];
 else S.partyFree7438[slot]=n;
 S.partySlots=[S.partyFree7438[1],S.partyFree7438[2]];
 for(let i=0;i<3;i++){let h=S.partyFree7438[i];if(S.heroEquipment65?.[h])S.equipment[i]={...S.heroEquipment65[h]};S.hp[i]=maxHp(i);S.mp[i]=maxMp(i)}
 save();render();partyView('complete7439');toast(`${n}を${slot+1}枠目に編成`);
}
function completeParty7439(){
 let P=partyNames(),available=ALL7439.filter(unlocked7439);
 open('パーティ',`<div class="panel"><h3>現在の編成</h3>${P.map((n,i)=>`<div class="partySlot7439 active">${av7439(n)}<div><b>${i+1}枠　${n}</b><div class="freeHint7439">${i===0?'手動操作キャラクター':'AUTO / 仲間AI'}</div></div><span>Lv.${S.charGrowth?.[n]?.lv||S.lv}</span></div>`).join('')}<div class="freeHint7439">キーボ固定は撤廃済み。どのキャラクターでも1・2・3枠に配置できます。1枠目が攻撃・スキル・防御の手動操作担当です。</div></div>
 <div class="panel"><h3>キャラクター</h3>${available.map(n=>`<div class="partySlot7439 ${P.includes(n)?'active':''}">${av7439(n)}<div><b>${n}</b><div class="freeHint7439">${BASE_MEMBERS[n]?.role||''}</div></div><div><button data-a7439="${n}" data-s7439="0">1枠</button><button data-a7439="${n}" data-s7439="1">2枠</button><button data-a7439="${n}" data-s7439="2">3枠</button></div></div>`).join('')}</div>
 <div class="panel"><button data-mon7439>仲間モンスターを見る</button></div>`);
 document.querySelectorAll('[data-a7439]').forEach(b=>b.onclick=()=>assign7439(+b.dataset.s7439,b.dataset.a7439));
 let mb=document.querySelector('[data-mon7439]');if(mb)mb.onclick=()=>partyView('monsters');
}
const pv7439=partyView;
partyView=function(mode='members'){
 if(mode==='members'||mode==='free7438'||mode==='heroes7436'||mode==='complete7439')return completeParty7439();
 let z=pv7439(mode);setTimeout(decorate7439,0);return z;
};
/* replace any legacy Character tab route that opens old fixed Keebo UI */
function bindParty7439(){
 document.querySelectorAll('#obody button,.modal button').forEach(b=>{
   if(['キャラクター','自由編成','追加4キャラ'].includes(b.textContent.trim()))b.onclick=()=>completeParty7439();
 });
}
/* generic compact icons for monster and equipment lists */
function monsterSymbol7439(n){if(/ドラゴン|竜/.test(n))return '♛';if(/ウルフ|狼/.test(n))return '◆';if(/フェアリー/.test(n))return '✦';if(/ゴーレム/.test(n))return '⬢';if(/スライム/.test(n))return '●';return '◇'}
function gearSymbol7439(n){
 let x=typeof item==='function'?item(n):{},t=x?.type||'';if(t==='防具')return '♜';if(t==='アクセサリー')return '◉';if(/杖/.test(n))return '♜';if(/銃/.test(n))return '⌁';if(/刀/.test(n))return '刀';if(/槍/.test(n))return '♠';return '⚔';
}
function decorate7439(){
 let root=document.getElementById('obody');if(!root)return;
 root.querySelectorAll('.memberCard65,.hero7436,.partyMemberCard').forEach(c=>{if(c.querySelector('.avatar7439'))return;let t=c.textContent,n=ALL7439.find(x=>t.includes(x));if(n)c.insertAdjacentHTML('afterbegin',av7439(n))});
 root.querySelectorAll('.monsterCard65,.monsterCard,.companionCard').forEach(c=>{if(c.querySelector('.avatar7439'))return;let n=(c.querySelector('h3,b')?.textContent||'モンスター').trim();c.insertAdjacentHTML('afterbegin',`<span class="avatar7439 mon" style="--a:#16304d;--b:#62bad9">${monsterSymbol7439(n)}</span>`)});
 root.querySelectorAll('.equipCard65,.shopCard,.itemCard,.equipmentCard').forEach(c=>{if(c.querySelector('.gear7439'))return;let h=c.querySelector('h3,b');if(!h)return;let n=h.textContent.trim(),x=typeof item==='function'?item(n):{};h.insertAdjacentHTML('afterbegin',`<span class="gear7439 ${x?.rar==='LEGEND'?'legend':''}">${gearSymbol7439(n)}</span>`)});
 bindParty7439();
}
/* character detail legacy formation block: replace fixed label and all slot buttons */
function repairDetail7439(){
 let root=document.getElementById('obody');if(!root)return;
 root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&el.textContent.trim()==='キーボ固定')el.textContent='自由選択'});
}
/* new hero battle representation: not blank, and distinct per character.
   This remains lightweight until dedicated final PNG assets are available. */
function battleArt7439(){
 let battle=document.getElementById('battle');if(!battle)return;
 battle.querySelectorAll('.hqNewHero7439').forEach(x=>x.remove());
 partyNames().forEach((n,i)=>{
  if(!['リリア','セレナ','ノア','カグラ'].includes(n))return;
  let a=IC7439[n],d=document.createElement('div');d.className=`hqNewHero7439 s${i}`;d.style.setProperty('--a',a[1]);d.style.setProperty('--b',a[2]);d.innerHTML=`<div class="sigil">${a[0]}</div><div class="nm">${n}</div>`;battle.appendChild(d);
 });
}
/* manual skill follows slot 1; legacy skill remains for legacy heroes */
const sk7439=skill;
skill=function(){
 let n=partyNames()[0];
 if(['リリア','セレナ','ノア','カグラ'].includes(n)&&typeof newHeroSkill7438==='function')return newHeroSkill7438(n);
 return sk7439.apply(this,arguments);
};
const op7439=open;
open=function(){let z=op7439.apply(this,arguments);setTimeout(()=>{decorate7439();repairDetail7439()},0);return z};
const rd7439=render;
render=function(){let z=rd7439.apply(this,arguments);battleArt7439();let b=document.getElementById('buildVersion');if(b)b.textContent=VER7439;document.title='どろダン / DROP OF DUNGEON '+VER7439;return z};
save();render();
})();

;

(()=>{
'use strict';
const VER7440='v0.74.42';
/* Use embedded character artwork where it exists. For the four added heroes, build distinct portrait art
   from their finalized visual identities rather than the old text-symbol squares. */
const PALETTE7440={
 'キーボ':['#1b0e16','#e5344c','剣'],'ミア':['#2b183c','#d69cff','✦'],'トア':['#102d4e','#62d8ff','刃'],'ピボット':['#5d4718','#ffd75d','盤'],
 'リリア':['#7d214d','#ff9ac7','♥'],'セレナ':['#2f1b64','#a78cff','☾'],'ノア':['#104d6a','#72dcff','✧'],'カグラ':['#641813','#ff6948','炎']
};
function portraitHTML7440(n){
 let a=PALETTE7440[n]||['#17304d','#6cb7da','◆'];
 /* Existing three use their actual embedded battle assets. */
 let art='';
 try{
  if(n==='キーボ')art=DOD_ASSETS["dod_asset_22_86dc54427761.png"]||'';
  if(n==='ミア')art=DOD_ASSETS["dod_asset_23_2b23ef8cebf.png"]||'';
  if(n==='トア')art=DOD_ASSETS["dod_asset_24_50ed9d0c21f0.png"]||'';
 }catch(e){}
 if(art)return `<span class="portrait7440" style="background-image:url('${art}')"></span>`;
 /* New heroes: polished compact crest portrait until their dedicated PNGs are embedded.
    No text-label prototype square. */
 return `<span class="portrait7440" style="background:radial-gradient(circle at 42% 30%,${a[1]},${a[0]} 58%,#07111f);display:flex;align-items:center;justify-content:center;color:white;font-size:27px;font-weight:900">${a[2]}</span>`;
}
function equipGlyph7440(n){
 let x=typeof item==='function'?item(n):{},t=x?.type||'',g='⚔';
 if(t==='防具')g='♜';else if(t==='アクセサリー')g='◉';else if(/杖/.test(n))g='♜';else if(/双刃/.test(n))g='⚔';else if(/銃/.test(n))g='⌁';else if(/刀/.test(n))g='刀';else if(/槍/.test(n))g='♠';
 return `<span class="equipArt7440 ${x?.rar==='LEGEND'?'legend':''}">${g}</span>`;
}
function monGlyph7440(n){let g=/ドラゴン|竜/.test(n)?'♛':/狼|ウルフ/.test(n)?'◆':/フェアリー/.test(n)?'✦':/ゴーレム/.test(n)?'⬢':/スライム/.test(n)?'●':'◇';return `<span class="monArt7440">${g}</span>`}

/* Replace prototype symbols in the actual current party editor. */
function visual7440(){
 let root=document.getElementById('obody');if(!root)return;
 root.querySelectorAll('.partySlot7439').forEach(card=>{
  let txt=card.textContent,n=Object.keys(PALETTE7440).find(x=>txt.includes(x));
  if(!n)return;
  card.querySelectorAll('.avatar7439,.partyIcon7438').forEach(x=>x.remove());
  if(!card.querySelector('.portrait7440'))card.insertAdjacentHTML('afterbegin',portraitHTML7440(n));
 });
 root.querySelectorAll('.monsterCard65,.monsterCard,.companionCard').forEach(card=>{
  if(card.querySelector('.monArt7440'))return;
  card.querySelectorAll('.avatar7439,.partyIcon7438').forEach(x=>x.remove());
  let n=(card.querySelector('h3,b')?.textContent||'モンスター').trim();
  card.insertAdjacentHTML('afterbegin',monGlyph7440(n));
 });
 /* Equipment cards: attach visible weapon/armor/accessory art next to the item name. */
 root.querySelectorAll('.equipCard65,.shopCard,.itemCard,.equipmentCard,.panel').forEach(card=>{
  let h=card.querySelector('h3,b');if(!h||h.querySelector('.equipArt7440'))return;
  let n=h.textContent.trim();
  let known=false;try{known=!!specialItems[n]||!!item(n)?.n}catch(e){}
  if(!known)return;
  h.querySelectorAll('.gear7439,.gearIcon7438').forEach(x=>x.remove());
  h.insertAdjacentHTML('afterbegin',equipGlyph7440(n));
 });
}
/* New hero battle presentation: full-height stylized character silhouettes instead of blank slots.
   Dedicated PNGs can replace these one-for-one later without changing battle logic. */
function battle7440(){
 let b=document.getElementById('battle');if(!b)return;
 b.querySelectorAll('.newHeroArt7440').forEach(x=>x.remove());
 partyNames().forEach((n,i)=>{
  if(!['リリア','セレナ','ノア','カグラ'].includes(n))return;
  let a=PALETTE7440[n],d=document.createElement('div');d.className='newHeroArt7440';
  Object.assign(d.style,{position:'absolute',zIndex:'15',bottom:'0',width:'31%',height:'38%',left:i===0?'1%':i===1?'34.5%':'auto',right:i===2?'1%':'auto',pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'flex-end',flexDirection:'column',filter:'drop-shadow(0 8px 8px #0009)'});
  d.innerHTML=`<div style="width:125px;height:210px;border-radius:55% 55% 22% 22%;background:linear-gradient(160deg,${a[1]},${a[0]} 52%,#090c16);border:2px solid ${a[1]};box-shadow:0 0 24px ${a[1]}66;display:flex;align-items:center;justify-content:center;color:#fff;font-size:46px;font-weight:1000">${a[2]}</div><b style="margin-top:-28px;margin-bottom:12px;color:#fff;text-shadow:0 2px 4px #000">${n}</b>`;
  b.appendChild(d);
 });
}
/* Cache normalizer: never accumulate ?v=... parameters.
   On a normal visit, remember this build and keep the clean canonical URL.
   Query parameters used manually are stripped after the current build has loaded. */
function normalizeURL7440(){
 try{
  const u=new URL(location.href);
  if(u.searchParams.has('v')){
    u.searchParams.delete('v');
    history.replaceState(null,'',u.pathname+(u.search?u.search:'')+u.hash);
  }
  localStorage.setItem('dod_current_build',VER7440);
 }catch(e){}
}
const op7440=open;
open=function(){let z=op7440.apply(this,arguments);setTimeout(visual7440,0);return z};
const rd7440=render;
render=function(){let z=rd7440.apply(this,arguments);visual7440();battle7440();let v=document.getElementById('buildVersion');if(v)v.textContent=VER7440;document.title='どろダン / DROP OF DUNGEON '+VER7440;return z};
normalizeURL7440();save();render();
})();

;

(()=>{
const VER7441='v0.74.42';
const LOOK7441={
'キーボ':['#ff3d55','#32111a','#1b1720','#e2344e'],'ミア':['#e7b8ff','#37204c','#f0d7c5','#9a66d7'],'トア':['#75dfff','#123454','#e7d1bf','#35aee9'],'ピボット':['#f0c34c','#5c481a','#d7e9f1','#42d8ff'],
'リリア':['#ff9ecb','#7a2451','#ffb2d3','#e84891'],'セレナ':['#aa8cff','#2e1c62','#d6d8ee','#6d5bea'],'ノア':['#74ddff','#104a67','#e9edf3','#4ac8f1'],'カグラ':['#ff704d','#651812','#f1d0bf','#ef3b2d']
};
function face7441(n){let a=LOOK7441[n]||['#6bb8dd','#17304d','#cbd8e2','#55a9d1'];return `<span class="rosterFace7441" style="--hi:${a[0]};--lo:${a[1]};--hair:${a[2]};--eye:${a[3]}"></span>`}
function decorateRoster7441(){
 let root=document.getElementById('obody');if(!root)return;
 root.querySelectorAll('.partySlot7439').forEach(c=>{let n=Object.keys(LOOK7441).find(x=>c.textContent.includes(x));if(!n)return;c.querySelectorAll('.avatar7439,.partyIcon7438,.portrait7440,.rosterFace7441').forEach(x=>x.remove());c.insertAdjacentHTML('afterbegin',face7441(n))});
}
function battleRoster7441(){
 let b=document.getElementById('battle');if(!b)return;
 b.querySelectorAll('.newHeroArt7440,.battleFace7441').forEach(x=>x.remove());
 partyNames().forEach((n,i)=>{
   let a=LOOK7441[n];if(!a)return;
   /* Keep original high-quality Keebo art; replace/add all other party characters. */
   if(n==='キーボ'&&i===0)return;
   let d=document.createElement('div');d.className=`battleFace7441 s${i}`;d.style.cssText+=`--hi:${a[0]};--lo:${a[1]};--hair:${a[2]};--eye:${a[3]}`;
   d.innerHTML=`<div class="body"></div><b>${n}</b>`;b.appendChild(d);
 });
}
const o7441=open;open=function(){let z=o7441.apply(this,arguments);setTimeout(decorateRoster7441,0);return z};
const r7441=render;render=function(){let z=r7441.apply(this,arguments);decorateRoster7441();battleRoster7441();let v=document.getElementById('buildVersion');if(v)v.textContent=VER7441;document.title='どろダン / DROP OF DUNGEON '+VER7441;return z};
save();render();
})();
