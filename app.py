#coding=utf-8
from flask import Flask
from flask import request, render_template, redirect, url_for
import tensorflow as tf
import numpy as np
from ckiptagger import data_utils, construct_dictionary, WS, POS, NER
from analysis import each_char,predict,nearest,tsen2json, wordCloudSelect, tsne2json_revised, forHeatmap,wordCollection
import json
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import time
from scipy.stats import entropy

app = Flask(__name__)


# sentence_list = ["台北市明倫社會住宅三房型租金破4萬元，沒配置冷氣、洗衣機等家電，引發社會輿論一陣譁然。內政部次長花敬群日前更在臉書發文批，台北市整天把自償率掛在嘴上，「不是因為財務有問題，而是心理有鬼」。國民黨立委陳玉珍今日在內政委員會質詢追問「心理有鬼」是有什麼鬼？花敬群批評，用興建成本來訂租金，這部分很奇怪。花敬群質疑，這很奇怪！為何將自償率當成租金計算的標準。社會住宅的租金是用市場租金打折，而興建成本若不夠政府也會補貼，這是兩件不同事情，怎會拿成本來訂租金，「用成本來訂租金這是很奇怪的事情！」陳玉珍問及，所以租金是用市場租金行情來打折，社會住宅興建成本不夠部分由中央來補貼。那麼柯文哲心理是有什麼鬼？花敬群指出，會拿成本來做租金訂價的基礎，這部分就很奇怪啊。陳玉珍說，柯的說法是錯誤、在推卸責任？怎會拿成本來當租金訂價。花敬群回應，台北市政府都發局官員都完全了解「遊戲規則」，他不是柯市長本人，不懂柯在想什麼；陳追問，所以柯市長是在找理由？花敬群聞訊冷笑三聲「呵呵呵」。民進黨立委王美惠質詢也批，台北市明倫住宅租金非常離譜，14坪就租1萬2900元，44坪就租4萬5千元，完全背離社會住宅用意，對於社會經濟弱勢是很大負擔，應讓弱勢民眾可以租的起。花敬群說，社會住宅租金大家都有默契和公式，就是用市場價格來打折。"]
# sentence_list = ["石虎「飛飛」昨日尋獲，台北市立動物園今天在動物園內舉辦記者會說明石虎的狀況。發言人曹先紹表示，飛飛的前掌和下巴有摩擦傷口，也有脫水現象，體重掉了8%，研判失蹤的17天都在內部捕捉齧齒類等小動物食用，至於吃了哪些東西，要等待分析結果才會知道，目前飛飛要進入檢疫舍檢查是否有其他疫病，觀察1個月後才有機會再回到園區。曹先紹表示，昨天下午例行性巡視誘捕籠，發現放在石虎戶外活動場旁、水獺與白鼻心區的上方誘捕籠內捕獲到石虎，經過檢查後，確定是失蹤17天的飛飛。飛飛昨天傍晚開始，進行抽血、照X光、測量體重、體溫等一系列生理檢查，發現有脫水現象，體重從2.96公斤降至2.7公斤，前掌與下巴有外傷，獸醫馬上進行處置。"]
# sentence_list = ["台鐵還在修！今加開1483班客運4.5萬人次座位，公路總局指出，在台鐵完成搶修前，公路總局仍將督導業者持續因應人潮狀況機動加班，台鐵瑞芳往猴硐因連日豪雨發生邊坡滑動，造成東西正線路線不通，截至今天中午12時統計，共影響321列次、2萬6673人。瑞芳往猴硐間辦理公路接駁，至今共開行客運4276班車、疏運旅客約7萬3710人，台鐵局公布今天晚間24時以前的列車行駛計畫，對號列車部分，12月6日加開台東往宜蘭5271（普悠瑪）、5279、5280次自強號，及花蓮往宜蘭5272、5273、5274次普悠瑪自強號；樹林往宜蘭、花蓮、台東列車，樹林往宜蘭間停駛。為兼顧防疫與航空業營運，中央流行疫情指揮中心先前與民航局制定相關規範，指揮中心12月5日公布的境外移入個案，其中案694是一名本國籍30多歲的男性。他11月8日從印尼入境，居家檢疫14天。沒想到12月2日要準備回印尼工作，自費採檢結果是陽性。由於案694檢疫出關後，已經在社區趴趴走長達11天。台大兒童醫院院長黃立民認為，不排除案694是在台灣感染。但指揮中心強調案694多半待在家中，外出都是開車，且全程戴口罩。"]
# sentence_list = ["因台北市限縮迪化汙水處理廠投放時間以及外縣市水肥進場， 引起桃園業者反彈，意外釀成兩縣市隔空交火的「水肥大戰」。台北市長柯文哲喊話，需中央出面協調。卻被桃園市政府新聞處長詹賀舜反嗆，不需要什麼事都找中央。 對此，柯文哲今（19日）受訪再稱，本來想回對方一句， 「那沒問題啊，我找我們里長跟他談一下。」對於台北市限制外縣市水肥進場，在桃園業者拋出不滿後，由於柯文哲先是回應一句「桃園為什麼自己不丟？」，連帶惹火桃園市政府，桃園市環保局長呂理德出面批評柯文哲「不厚道！」、「練肖話！」桃園更回擊， 桃園送往台北處理的水肥，1年不過1萬噸到3萬噸，但桃園一年處理的台北醫療廢棄物、廚餘、汙泥、廢鐵、廢紙與廢木材等廢棄項目 ，1年可是高達24萬7122 公噸。"]
# sentence_list = ["台北市立動物園昨天找到脫逃17天的石虎「飛飛」，動物園表示，飛飛消化道裡有食物和糞便，研判是為了追捕老鼠鑽入仿岩，將增加仿岩安全檢查頻率，同時補強結構。飛飛在6月2日因右後腳傷重截肢，被行政院農委會特生中心送到動物園收容照養，卻在11月22日跑到人造仿岩上方抓扒，之後鑽入破口消失。經過17天的搜索，動物園12月9日下午約5時許在石虎區旁的水獺區上方誘捕籠內找到飛飛，籠內約150公克雞胸肉被吃光。動物園發言人曹先紹今天說明，研判飛飛是在展區內追逐老鼠，所以鑽入人造仿岩的破口，因為透過X光檢查，可看出飛飛的消化道內有食物和糞便，會蒐集飛飛近期的排泄物，確認到底是吃了什麼東西。獸醫師補充，找到飛飛時牠的毛髮是乾的，且體溫正常，代表沒有淋到雨，推測這幾天可能只是躲起來了，且牠碰到人類時還會齜牙裂嘴威嚇，代表還有體力，是好現象。"]    
# sentence_list = ["英國近日發現新冠病毒新種病毒株，荷蘭、比利時、義大利和德國等陸續宣布禁止英國航班入境，此外，法國也在20日宣布，從晚間11時起，暫停所有從英國出發的陸、海、空交通工具包括貨運入境48小時。英法海底隧道（歐洲隧道）公司表示，晚間11時起暫停所有從英國福克斯港出發的乘客和貨運，並補充說，「建議預定在此時間之後出發的顧客不要前往該碼頭，因為無法跨越至法國」。法國貨運還是能運往英國，但有人擔心法國的貨車司機可能不會送貨去英國，以免回不去。受此影響，每天照理會穿越歐洲隧道和英國多佛港的約1萬輛貨車都是空的，這些貨平時都是定期來自法國北部和比利時大型配送中心的易腐食品，包括冬季蔬菜，像是花椰菜、高麗菜和球芽甘藍。英國通路運輸協會政策總監麥肯茲（Rod McKenzie）說，「雖然只有48小時，但法國禁令將對供應鏈造成毀滅性影響。最近幾天我們看到，由於英國脫歐庫存和耶誕節高峰，英吉利海峽兩端都排起長長隊伍，現在邊境關閉，代表包括易腐食品等食物供應都會受到影響」。麥肯茲表示，許多日常用品都仰賴歐洲隧道運輸，包括工廠零件、新鮮和冷凍蔬果以及耶誕節期間所有的送貨事宜。"]
# sentence_list = ["近日英國東南地區出現變異武漢肺炎病毒株，而過去幾天的確診案例有飆升狀況，科學家正密切觀察它對於疫情發展的影響，目前也無確切的證據顯示，異病毒株是否造成更嚴重的症狀，甚至讓疫苗因此失效。不過為了預防變異病毒蔓延，首相強生19日召開臨時記者會宣布，20日開始，倫敦、英格蘭東部與東南部包括肯特郡（Kent）等地區，將疫情警報將提升至第4級；原先已規劃5天耶誕節鬆綁計畫，也跟著宣布取消。而所謂第4級也幾乎等同在11月實施的「封城」政策。由於耶誕節即將到來，加上「封城」警報消息曝光後，不少人趁著限制命令未生效前，前往聖潘克拉斯車站（St. Pancras International）試圖離開倫敦，大批「逃難」人潮湧現擠得車站水洩不通。英國衛生大臣韓考克（Matt Hancock）上節目時搖頭表示，這些人行為是「很不負責任的」。"]
# sentence_list = ["一名網友今（21日）在PTT八卦版上指出，上週得知病毒變異的新聞時，還與妻子慶幸「自己口罩戴很大，並且每天用超多消毒紙巾，而且快要一年沒有去辦公室上班了」，認為應該不會有事才對，孰料，當晚妻子就高燒39度不退，緊急送醫發現是病毒感染，醫師語重心長說「看你這個指數應該是Covid，加油」，兩人相當疑惑，「到底是怎麼被傳染的，我們都已經在家龜了這麼多個月」。在妻子確診後，他也開始進入高燒不退的被感染模式，夫妻倆聽從英國NHS（國民保健署）指示，自主居家隔離直至26日，期間多喝水及發燒時服用退燒藥。如今，網友確診第4日病情愈發嚴重，不僅每日睡眠不到3小時，甚至半夜會因為高燒而驚醒，也漸漸失去味覺，網友表示，只能吃醬油比較有味道，嗅覺也變得很詭異「一直會聞到一股荷葉邊系服特有的汗酸臭味」，洗澡N次換了好幾套衣服臭酸味仍然存在。"]
# sentence_list = ["北韓領導人金正恩在勞動黨第八次全國代表大會會議中，被推舉為勞動黨總書記，但金正恩胞妹、曾任勞動黨中央委員會第一副部長的金與正，則未被選為政治局候選委員，也沒列入勞動黨部長名單。"]
# sentence_list = ["中國螞蟻集團即將上市，預料募資金額與市值都將創下紀錄。從電商託管帳戶到行動支付，螞蟻今日已成長為滲入中國消費金融各個層面的巨無霸。其他科技公司效仿螞蟻之餘，不能忘記其背後獨特的時空背景。"]
# sentence_list = ["北韓領導人金正恩在勞動黨第八次全國代表大會會議中，被推舉為勞動黨總書記，但金正恩胞妹、曾任勞動黨中央委員會第一副部長的金與正，則未被選為政治局候選委員，也沒列入勞動黨部長名單。"]
# sentence_list = ["總統蔡英文親自下令海巡署艦艇塗裝TAIWAN字樣，引發朝野一番口水戰，但此事背後其實隱藏著更重要的軍事意涵，即台灣反制中國，在戰術運用上悄悄地加重了應對「灰色地帶衝突」的力道。事實上，灰色地帶衝突在蔡英文國安核心圈，也成為一門新顯學。總統府發言人張惇涵2月17日透過臉書表示：「面對灰色地帶衝突的應對，TAIWAN的塗裝，能讓我們海巡艦艇有更清楚的辨識、更安全的執法；但不挑釁、不屈服，始終是我們堅持的立場。」張淳涵的這一段話，藏在臉書最後面，一般只注意到他在文章前端所強調的此決策為蔡英文親自發令，少有人注意到總統府在文末罕見地揭示了台海對峙的重要戰術調整，即台灣注意到、且正在應對中國不斷挑釁的「灰色地帶衝突」。「灰色地帶衝突（gray-zone conflict）」指的是介於戰爭（黑色）與和平（白色）之間的衝突。美國戰略與國際研究中心（Center for Strategic and International Studies，CSIS）定義灰色地帶衝突為：「在穩定嚇阻與保證外的任何努力，企圖不用訴諸武力而達到國家的安全目標。」簡而言之，包括機艦繞島、潛艦上浮、兩棲艦操演，或緊追、碰撞、劫持、包圍船隻等，都為灰色地帶衝突。更廣義的灰色地帶衝突，甚至是在「準軍事」手段外，包括經濟、資訊攻擊。國際政治史上，灰色地帶衝突並非新概念，過去的戰爭邊緣、間接路線、間接戰略都是類似作法。但近年因網路使決策反應時間壓縮，甚至形成「總統上刺刀」、領導人親上火線的狀況，加上冠上一個新名稱「灰色地帶衝突」，此一舊酒新瓶因此紅了起來。值得注意的是，蔡英文的國安核心圈一段時間以來，積極理解「灰色地帶衝突」，甚至陳水扁擔任總統時的國安頭子、現任台灣日本關係協會會長邱義仁也對友人透露，他仔細地在研究灰色地帶衝突。蔡團隊警覺並開始研究「灰色地帶衝突」，後來甚至連蔡英文上任後成立的國防智庫財團法人國家安全研究院，都針對此議題出了專刊探討。蔡核心圈注意灰色地帶衝突，是於2020年確定連任後，美國智庫甚至是時任白宮國安顧問歐布萊恩（Robert O'Brien）都曾提醒台灣，必須注意中國利用灰色地帶衝突施壓台海；之後，中國果然開始進行密集的軍機、艦繞台，甚至經常發生中國抽砂船頻繁到澎湖、金馬盜採砂石的不尋常狀況。另一方面，包括總統府發生被中國駭客侵入核心幕僚電腦，駭客撈到的文件後來外洩，驚動朝野政局，都讓蔡國安核心驚覺對岸的灰色地帶衝突，已經不止運用在軍事上，甚至以資訊戰在進行。對「灰色地帶衝突」的警覺，促使蔡英文對國安政策的調整。例如海巡署因常在海上第一線應處灰色地帶衝突，角色更加吃重，蔡英文除了把過去慣由警方擔任的署長職務，改為由海軍將領擔任，更讓海巡積極造艦、增加船艦噸位，甚至包括這一次在艦艇上塗裝TAIWAN字樣；另一方面，由於軍事合作比較敏感，蔡政府也透過海巡，與相關國家進行不少檯面下的交往合作。除了「準軍事」應對，總統府的「日常」也已經把「灰色地帶衝突」放入決策大腦。例如前一陣子發生的在社群平台Dcard出現一篇名為「2020我是空軍我好累」發文，以飛官口吻抨擊頻繁應處共機作為和政府兩岸政策，引發關注，此事後來雖證明為假，但府方就會對其來源、動機、目標，甚至是內容解析進行研判，是否為有人想製造灰色地帶衝突。"]
# sentence_list = ["報導指出，決意離婚的福原愛，已在今年1月時向江宏傑提出離婚。福原愛是在2016年9月跟江宏傑結婚，2017年2月在東京迪士尼樂園盛大舉行婚禮。福原愛婚後將活動重心移到台灣，2017年10月女兒出生，2019年4月再生下一子。福原愛時常在社群網路分享與江宏傑的恩愛合照，給外界生活幸福之感。不過，福原愛的朋友卻這麼說，「福原愛生第一胎時孕吐非常嚴重，真的很辛苦，但江宏傑對待福原愛的口氣總是很不好。」儘管一直被江宏傑責罵，但福原愛總是自責「都是因為我內分泌失衡的錯」。2019年，發生了一件對福原愛來說最為關鍵的事件，就是福原愛去看牙醫。江宏傑在平日總嫌福原愛衣著過於華麗與時尚，所以當天要去看牙前就要求福原愛換穿樸素的衣著，然後才陪福原愛去看牙。但沒想到看完牙後回程途中，江宏傑就嚴厲地對福原愛開罵說，「（妳看牙）嘴巴張開的方式像在引誘人一樣，妳這個婊子。」福原愛被江宏傑用這樣的言詞痛罵，至今仍無法釋懷。週刊文春直接連繫上福原愛本人詢問說，「是因為江宏傑的言語霸凌才決定離婚的嗎？」"]
# sentence_list = ["英特爾公布最新季報。光看數字，看到的是一家非常賺錢的公司。英特爾營收連年成長，每股盈餘也連續5年上升。其營收與淨利都超過常拿來對比的台積電。但漂亮的財報背後是盛極而衰。英特爾的未來愁雲密佈，導致其不到三年之間兩度更換執行長（後面會討論）。其危機可歸納出四個主要原因。第一，英特爾錯過了手機。蘋果於2005年改用英特爾CPU，英特爾完成統一電腦市場的霸業，志得意滿。隨後沒多久，賈伯斯跑去問英特爾願不願意為他們的新產品開發晶片。英特爾拒絕了。這個新產品是iPhone。英特爾由此錯過了手機這班列車。當時的CEO事後追憶，痛心疾首：當時他們提出一個價錢，一分都不願意提高。那價錢低於我們預估的成本。我看不出潛力。看起來不像是能靠規模打平的。事後來看，我們的預估錯誤，其規模超過任何人的想像100倍。英特爾的第二個危機：晶圓代工的崛起。其中的佼佼者自然是台積電。台積電專注製造、不斷創新，規模持續快速擴大，終於在去年逼得連英特爾都外包製造給台積電。同時，英特爾也沒有發揮整合製造與設計的優勢。反而互相扯後腿，特別是製程開發跟不上設計，從10奈米製程開始延遲。台積電順勢超車。第三個危機是製程開發延遲。英特爾像遇上連環車禍一樣，一代卡住拖累下一代。其中，資料中心，也就是雲服務使用的電腦仍在高速成長。但英特爾碰上第四個危機：買家集中化。上述四大危機的交集，就是英特爾失去規模，接著失去製造的競爭力。晶圓製造需要的規模越來越大。現在新世代的晶圓廠需要數十億美金的投資，能玩的企業越來越少。目前仍在發展5奈米以下製程的企業只剩三家：台積電、三星與英特爾。其中英特爾仍卡在泥沼之中，連新CEO都不確定能否走出來。"]
# sentence_list = ["關於「台灣為什麼沒有獨角獸」的討論歷久不衰。最近政府又推新政策，希望吸引獨角獸「現身」。根據經濟日報報導：催生獨角獸，開創資本市場藍天，金管會宣布，明年第3季推出「創新板」及「戰略新板」，掛牌免獲利條件，創新板則依市值分三類，例如市值不低於新台幣15億元等，將鎖定Gogoro、KKBOX等創新公司掛牌，為股市增添生力軍。其實金管會沒有明說要找獨角獸，但所有媒體都以此為題，可見台灣對獨角獸之飢渴。接著，媒體與新創領袖也紛紛發表看法，例如雲象科技創辦人葉肇元寫得相當詳細。其實台灣已經有獨角獸了。國發會去年說Gogoro與Appier這2家公司估值皆已超過10億美金。只是Gogoro不否認，Appier不承認，留下一些懸疑。假設真的沒有好了。為什麼沒有呢？首先來定義問題。獨角獸是指未上市，且估值超過10億美金，約300億台幣的新創。另有一說是還要「創立未滿10年」。由此我們可以推論獨角獸有三個前提：第一，服務大市場。估值超過300億台幣，代表投資人相信該公司未來能賺很多錢。因此這公司必然是服務一個大市場。大市場可概分兩種。一種是客單價低，但顧客數多。最知名的是臉書、YouTube等B2C網路服務。另一種是顧客數較少，但客單價高，通常是B2B服務。第二，開放市場。要在10年創造300億估值，必須成長速度飛快。這代表新創所在的市場大致開放，產品能迅速的觸及客戶，沒有特別的壁壘。例如賣石油的壁壘非常高，在台灣幾乎不可能成功。但app理論上能觸及所有手機用戶。第三，風險資本。10年內達成300億元估值非常困難，風險極高，需要大量願意承擔長期風險的資金才行。而既然風險極高，代表投資者必須分散風險，因此這類資金的資金規模需要更大。我們稱這類資金為創投其實直譯為「風險資本」更適合，因為其價值就在於承擔風險。"]
# sentence_list = ["上週我請會員投票選擇希望我分析的科技公司財報。原本第一名是Spotify，我已經在上週討論。沒想到過了一個週末，最終統計數字出來，居然是亞馬遜以一票之差奪得冠軍！可見遲到的通訊投票的確足以改變選情！不過再想一想，我其實不知道為何大家想看亞馬遜？在科技業4大天王之中，只有亞馬遜在台灣完全沒有消費性業務（有AWS）。莫非島讀會員真的很關心雲服務？要討論財報，必須先理解亞馬遜全公司的核心營運指標：自由現金流（freecashflow）。過去我提過亞馬遜是一家追求規模經濟的公司。其核心業務如AWS雲服務、物流與倉儲、第三方商城，以及AmazonPrime會員訂閱等，共同的特點是建置成本高，但回收慢。例如AWS必須先建資料庫中心，才能跟顧客每月每月地收費。物流要建倉庫、車隊、機隊、招募司機等，但每次只能收到一點遞送費。AmazonPrime中的影音內容、快速到貨服務等，也都是前置成本高，回收則細水長流的生意。這類生意的好處是護城河很高，競爭者不敢挑戰。壞處是在投資尚未回收之前，財報上都是虧錢。因此利潤不是亞馬遜最好的指標。"]
# sentence_list = ["蘋果春季發表會沒有石破天驚的新技術，而是穩紮穩打的持續擴大領先差距。AirTag 追蹤器是蘋果埋藏數年的伏筆的第一個應用，iMac 彩色桌上型電腦順應著 iPhone 與 iPad 的絕對領先，而 Podcasts 訂閱制亦完全符合蘋果擴大服務營收的大方向。看蘋果發表會仍然是一種享受；享受的不是創新翻轉世界的驚喜，而是類似欣賞洋基隊碾壓競爭者的無情。"]
# sentence_list = ["Netflix帶給全球影視娛樂產業最大的一個啟示是「全球發行平台」的威力，除了大幅削減複雜的中間人體系，也有助於打破市場疆界，加速不同國家、語言、文化的內容流動速度。以美國市場為例，對「非美國製」的內容需求度越來越高。例如，娛樂產業調研機構Parrot Analytics表示這股趨勢起自2019年，而COVID-19更起了加速作用，一方面因為美國影視產業的產能大幅受創，另一方面人們在家看影片的時間也變多。根據Parrot Analytics，2020年第三季美國人消費的影視內容當中，非美國製的內容占了將近三成，前五名依序為英國、日本、加拿大、韓國以及印度。其中印度的成長速度飛快，2018年第一季時只占0.3%，2020年第四季時已占到1.5%。"]

# f = open("ontoNote_names.txt",'r',encoding="utf-8")
# news=[]
# news_string=""
# for line in f.readlines():
#     line = line.replace("\n","")
#     line = line.replace(" ","")
#     news_string+=line
# news.append(news_string)
# news=list(news[0])
# news_char = np.array(news)

f = open("news.txt",'r',encoding="utf-8")
onto=[]
onto_sect=[]
onto_string=""
for line in f.readlines():
    line = line.replace("\n","")
    line = line.replace(" ","")
    line = line.replace("纔","才")
    onto_string += line
    onto_sect.append([line])
onto.append(onto_string)
onto_list=list(onto[0])
onto_sort = np.array(onto_list)

# print("news_.shape: ",news_char.shape)
char_list_json = json.load(open("onto_names.json"))
tra_hidden = np.load('hidden_onto.npy')
tra_hidden1 = np.load('hidden1_onto.npy')

char_list_json_news = json.load(open("./json/Characters.json"))
news_pirChart = json.load(open("./json/news.json"))
word_dountChart = json.load(open("./json/uncertainty.json"))
news_hidden = np.load('newsHidden.npy')
news_hidden1 = np.load('newsHidden1.npy')
Hiddenstates = np.load('./json/Hiddenstates.npy')


#global 
all_=0
forward_=0
backward_=0

@app.route("/", methods=['GET', 'POST'])
def index():
    json = {"news":news_pirChart,"dount":word_dountChart}
    return render_template('index.html',json = json)

# open_tsne
@app.route("/open_tsne", methods=['POST'])
def open_tsne():
    if request.method == 'POST':
        pipeline = int(request.form['pipeline'])
        select_character = int(request.form['select_character']) #based on character
        select_article = int(request.form['select_article']) #based on character
        print(select_character,select_article)

        hiddenState = Hiddenstates[pipeline]
        hiddenState1 = Hiddenstates[pipeline+1]
        revised,revised_axis,all_,forward_,backward_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState1[select_character],hiddenState1,pipeline)
        revised0,revised_axis0,all0_,forward0_,backward0_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState[select_character],hiddenState,pipeline)
        # revised0,revised_axis0 = tsne2json_revised(select_article,news_pirChart[select_article],select_character,news_hidden[select_character],news_hidden,perp)
        print("Tsne done")
        # scatter = {'hidden':{'tsne':tsen_h,'axis':axis},'hidden1':{'tsne':tsen_h1,'axis':axis_1},"revised":{"tsne":revised,"axis":revised_axis}}
        scatter = {'hidden':{'tsne':revised0,'axis':revised_axis0},"revised":{"tsne":revised,"axis":revised_axis}}
    return {"scatter":scatter,"charJson":char_list_json_news}

@app.route("/changePOSWS", methods=['POST'])
def changePOSWS():
    if request.method == 'POST':
        select_character = int(request.form['select_character']) #based on character
        select_article = int(request.form['select_article']) #based on character
        pipeline = int(request.form['pipeline'])

        hiddenState = Hiddenstates[pipeline]
        hiddenState1 = Hiddenstates[pipeline+1]
        revised,revised_axis,all_,forward_,backward_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState1[select_character],hiddenState1,pipeline)
        revised0,revised_axis0,all0_,forward0_,backward0_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState[select_character],hiddenState,pipeline)
        # revised0,revised_axis0 = tsne2json_revised(select_article,news_pirChart[select_article],select_character,news_hidden[select_character],news_hidden,perp)
        print("Tsne done")
        # scatter = {'hidden':{'tsne':tsen_h,'axis':axis},'hidden1':{'tsne':tsen_h1,'axis':axis_1},"revised":{"tsne":revised,"axis":revised_axis}}
        scatter = {'hidden':{'tsne':revised0,'axis':revised_axis0},"revised":{"tsne":revised,"axis":revised_axis}}
    return {"scatter":scatter,"charJson":char_list_json_news}


# changeWS
@app.route("/changeWS", methods=['POST'])
def changeWS():
    if request.method == 'POST':
        content = json.loads(request.form.get('hithere'))
        print(len(content))
        perp = request.form['perp']
        article = 2
        new_begin = int(request.form['character_begin'])
        new_end = int(request.form['character_end'])
        map_begin = int(request.form['map_begin'])
        map_end = int(request.form['map_end'])
        print(content[map_begin:map_end+1])

        sentence_list = onto_sect[int(article)]
        ws = WS("./data", )
        pos = POS("./data",)
        ner = NER("./data",)
        word_sentence_list, seq_sentence_list = ws(sentence_list,)

        print("seq_sentence_list",seq_sentence_list,len(seq_sentence_list),new_begin,new_end)
        new_BI = list("I"*(new_end-new_begin+1))
        new_BI[0] = "B"
        seq_sentence_list[new_begin:new_end+1] = new_BI
        print("seq_sentence_list","OK",len(seq_sentence_list),seq_sentence_list,new_BI)

        word_=[]
        temp_word=""
        article = sentence_list[0]
        print("article",len(article))
        for index,ws in enumerate(seq_sentence_list):
            if index !=0 and ws == 'B':
                word_.append(temp_word)
                temp_word = article[index]
            else:
                temp_word += article[index]
        word_=[word_]
        print("word_sentence_list","OK",word_)
        pos_sentence_list = pos(word_)
        entity_sentence_list, label_sentence_list, logits, hiddenState_all,c_v,w_v,label_list,sample_list = ner(word_, pos_sentence_list)
        print(entity_sentence_list)
        print("pos_sentence_list",len(pos_sentence_list))

        pos_=[]
        for i, word in enumerate (word_[0]):
            pos_ += [pos_sentence_list[0][i]]*len(word)
            print(i,word)
        ###for change_ws
        label_list_ = np.array(label_list).copy()
        for i,label in enumerate(label_list):
            label_list_[i] = label.split(':')[0]

        predict_avg_set = []
        label_set = []
        result = np.where(logits<0, 0, logits)
        for i, char in enumerate(result):
            predict_index = np.argsort(-char)
            predict_value = char[predict_index]
            predict_sum = np.sum(predict_value)
            predict_avg = (predict_value/predict_sum)[:3].tolist()
            label_ = label_list_[predict_index][:3].tolist()
            predict_avg_set.append(predict_avg)
            label_set.append(label_)

        BI = ['0']*len(new_BI)
        BI[0] = len(new_BI)

        entity_list_order = ["O"]*len(sentence_list[0])
        for entity in sorted(entity_sentence_list):
            for k in range(entity[0],entity[1]):
                entity_list_order[k]=entity[2]

        for index,char in enumerate(content[map_begin:map_end+1]):
            label = label_sentence_list[k].split(':')
            if (len(label)<2):
                label.append("non")

            char["predicts"] = predict_avg_set[new_begin+index]
            char["label_list"] = label_set[new_begin+index]
            char["entropy"] = str(entropy(result[new_begin+index]))
            char["ner"] = entity_list_order[index]
            char["BI"] = BI[index]
            char["pos"] = pos_[index]
    
    hidden = hiddenState_all[0][0]
    hidden1 =hiddenState_all[1][0]

    

    # all_xy = all_.transform(hidden1[new_begin])
    # forward_.transform(backward[:2])
    # backward_.transform(backward[:2])



    return {"content":content}

# open_tsne
@app.route("/wordCloud", methods=['POST'])
def wordCloud():
    if request.method == 'POST':
        click_index = int(request.form['click_index'])
        print(click_index,onto_list[click_index],onto_list[click_index-3:click_index+3])
        print(char_list_json_news[click_index])
        top_k=10
        h_direct=0

        hidden_nearest,wordCloud,diff_index_WC = nearest(click_index, news_hidden[click_index], tra_hidden,h_direct,top_k)
        if (int(request.form['wordCloudClick'])):
            return {"tra_nearest": hidden_nearest,"wordCloud": wordCloud}
        else:
            wordSelect = request.form['wordCloudSelect']
            print("wordCloudSelect",wordSelect)
            WC_Select = wordCloudSelect(wordSelect,diff_index_WC)
            return {"WC_Select":WC_Select}

@app.route("/findWord", methods=['POST'])
def findWord():
    if request.method == 'POST':
        word = request.form['word']
        wordRecode = word_dountChart['wordRecode']

        thesame=[]
        for index,w in enumerate(wordRecode):
            if (w == word):
                thesame.append(index)
        print("thesame",thesame)
        wordIndex = np.array(wordRecode)[thesame]
        temp = wordCollection(thesame,wordIndex)


    return temp

if __name__ == "__main__":
    app.run()

    