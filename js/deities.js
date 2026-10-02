/* SomnuMatrix — deities.js
   deities from many traditions, recognised by name when dreamt, drawn from their
   own iconography, awake from the first night, and speaking and acting as the
   dreamer dreamt them. one standard across every tradition.
   the roster mirrors the Pantheon Gate's eight tabs, and goes further.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* ---- the roster ----
   D(key, name, tradition, domains, iconography, aliases, flags)
   flags: "c" = the name is also an everyday word or given name, so it needs a
   cue ("the goddess Venus", "Lady Freyja") before it counts */
var DEITY={}, DEITY_WORDS=[];
function D(key,name,trad,domains,icons,aka,flags){
  DEITY[key]={key:key,name:name,trad:trad,domains:domains,icons:(icons||"").split(/\s+/).filter(Boolean),
    aka:(aka||"").split("|").filter(Boolean),cue:/c/.test(flags||""),dragon:/d/.test(flags||"")};
}

/* Greek */
D("zeus","Zeus","Greek","the sky, thunder, kingship","longbeard crown robe:white thunderbolt eagle glow");
D("hera","Hera","Greek","marriage, queens, the sky","crown robe:white scepter peacock");
D("poseidon","Poseidon","Greek","the sea, earthquakes, horses","longbeard robe:teal trident horse water");
D("demeter","Demeter","Greek","grain, the harvest, the turning year","veil robe:gold wheat torch");
D("athena","Athena","Greek","wisdom, craft, strategy","helmet robe:blue spear shield owl","athene|pallas athena|pallas","c");
D("apollo","Apollo","Greek","the sun, music, prophecy, healing","laurel robe:white lyre bow glow");
D("artemis","Artemis","Greek","the hunt, the wild, the moon","mooncrown robe:green bow stag","","c");
D("ares","Ares","Greek","war, courage, bloodshed","helmet armor spear shield dog");
D("aphrodite","Aphrodite","Greek","love, beauty, desire","robe:pink dove mirror","cytherea");
D("hephaestus","Hephaestus","Greek","the forge, fire, craft","beard robe:brown hammer anvil flames","hephaistos");
D("hermes","Hermes","Greek","messengers, travellers, thieves, the guide of souls","wingedhelm robe:gold caduceus");
D("hestia","Hestia","Greek","the hearth, the home, the sacred fire","veil robe:red flames");
D("dionysus","Dionysus","Greek","wine, ecstasy, theatre, rebirth","laurel robe:purple cup staff","dionysos");
D("hades","Hades","Greek","the underworld, the dead, hidden wealth","beard crown robe:black scepter dog darkaura","aidoneus|plouton");
D("persephone","Persephone","Greek","spring, and the queen of the underworld","crown robe:black pomegranate","kore");
D("hecate","Hecate","Greek","crossroads, keys, magic, the night","tripleface robe:black torches key dogs","hekate");
D("nemesis","Nemesis","Greek","retribution, balance","wings robe:grey scales sword","","c");
D("morpheus","Morpheus","Greek","dreams, the shapes of sleep","wings robe:grey veil smoke");
D("hypnos","Hypnos","Greek","sleep","wings robe:grey smoke","hupnos");
D("thanatos","Thanatos","Greek","a gentle death","wings:black robe:black sword darkaura");
D("nyx","Nyx","Greek","night itself","veil robe:black stars darkaura");
D("selene","Selene","Greek","the moon","mooncrown robe:silver glow","","c");
D("helios","Helios","Greek","the sun","halo robe:gold glow horse");
D("gaia","Gaia","Greek","the earth, the first mother","robe:green wheat","gaea","c");
D("pan","Pan","Greek","the wild, shepherds, panic","horns beard robe:brown flute goat","","c");
D("eros","Eros","Greek","desire","wings robe:pink bow","","c");
D("asclepius","Asclepius","Greek","medicine, healing","beard robe:white staff serpent","asklepios");
D("charon","Charon","Greek","the ferryman of the dead","beard veil robe:grey staff darkaura");

/* Roman */
D("jupiter","Jupiter","Roman","the sky, law, the state","longbeard crown robe:purple thunderbolt eagle","jove","c");
D("juno","Juno","Roman","marriage, women, the state","crown robe:white scepter peacock","","c");
D("minerva","Minerva","Roman","wisdom, crafts, strategy","helmet robe:blue spear owl");
D("mars","Mars","Roman","war, agriculture","helmet armor spear shield wolf","","c");
D("venus","Venus","Roman","love, beauty, victory","robe:pink dove mirror","","c");
D("mercury","Mercury","Roman","trade, messages, travel","wingedhelm robe:gold caduceus","","c");
D("neptune","Neptune","Roman","the sea, fresh water","longbeard robe:teal trident water","","c");
D("pluto","Pluto","Roman","the underworld, riches beneath","beard crown robe:black scepter darkaura","","c");
D("janus","Janus","Roman","doorways, beginnings, endings","twoface beard robe:grey key staff");
D("vesta","Vesta","Roman","the hearth, the sacred flame","veil robe:white flames","","c");
D("diana","Diana","Roman","the hunt, the moon, the crossroads","mooncrown robe:green bow stag","","c");
D("bacchus","Bacchus","Roman","wine, revelry, freedom","laurel robe:purple cup");
D("ceres","Ceres","Roman","grain, fertility, motherhood","veil robe:gold wheat","","c");
D("saturn","Saturn","Roman","time, harvest, the golden age","longbeard veil robe:grey sickle","","c");
D("vulcan","Vulcan","Roman","fire, the forge, volcanoes","beard robe:brown hammer flames","","c");
D("fortuna","Fortuna","Roman","luck, fate","veil robe:gold wheel");

/* Norse */
D("odin","Odin","Norse","wisdom, war, poetry, the dead, runes","onesight longbeard hat:brimmed robe:grey spear ravens wolves","woden|wotan|allfather|the allfather");
D("frigg","Frigg","Norse","marriage, foresight, the home","veil robe:blue key","frigga","c");
D("thor","Thor","Norse","thunder, strength, protection","beard hair:red robe:red hammer goat storm","donar|thunor");
D("sif","Sif","Norse","golden hair, the harvest","hair:gold robe:gold wheat","","c");
D("loki","Loki","Norse","trickery, change, fire","robe:green flames serpent");
D("baldr","Baldr","Norse","light, beauty, innocence","robe:white glow","balder|baldur");
D("tyr","Tyr","Norse","law, oaths, war","helmet armor sword onehand wolf","tiw|tyr");
D("heimdall","Heimdall","Norse","watchfulness, the rainbow bridge","helmet armor horn glow","heimdallr");
D("bragi","Bragi","Norse","poetry, eloquence","longbeard robe:brown harp");
D("idunn","Idunn","Norse","youth, renewal","robe:green apple","idun|iduna");
D("vidar","Vidar","Norse","silence, vengeance","armor sword","vidarr");
D("njord","Njord","Norse","the sea, wind, wealth","beard robe:teal water","njordr");
D("freyr","Freyr","Norse","fertility, sunshine, rain, peace","robe:gold boar sword","frey|yngvi");
D("freyja","Freyja","Norse","love, seidr, war, the fallen","robe:green cats glow","freya","c");
D("skadi","Skadi","Norse","winter, mountains, the hunt","robe:white bow wolf","skathi");
D("hel","Hel","Norse","the dead, Helheim","halfface robe:black darkaura","","c");

/* Egyptian */
D("ra","Ra","Egyptian","the sun, creation, kingship","head:falcon sundisc robe:white ankh staff glow","re|ra-horakhty|amun-ra","c");
D("amun","Amun","Egyptian","the hidden one, air, kingship","plumes robe:blue ankh scepter","amon");
D("ptah","Ptah","Egyptian","craftsmen, creation by word","cap skin:green robe:white scepter");
D("thoth","Thoth","Egyptian","writing, wisdom, the moon, magic","head:ibis mooncrown robe:white pen book","djehuty|tehuti");
D("maat","Ma'at","Egyptian","truth, balance, order","feather wings robe:white scales","maat|ma'at");
D("osiris","Osiris","Egyptian","the dead, rebirth, the Nile's rising","skin:green crownwhite robe:white crookflail","usir");
D("isis","Isis","Egyptian","magic, motherhood, the throne","cowhorns sundisc wings robe:white ankh","aset","c");
D("set","Set","Egyptian","storms, the desert, chaos, strength","head:setanimal robe:red scepter storm","seth|sutekh","c");
D("nephthys","Nephthys","Egyptian","mourning, night, protector of the dead","wings veil robe:black","nebet-het");
D("horus","Horus","Egyptian","the sky, kingship, protection","head:falcon crownred robe:white ankh","heru");
D("anubis","Anubis","Egyptian","embalming, the dead, weighing hearts","head:jackal robe:black scales ankh","anpu|inpu");
D("sekhmet","Sekhmet","Egyptian","war, plague, healing, the sun's fury","head:lion sundisc robe:red ankh flames","sakhmet");
D("hathor","Hathor","Egyptian","love, music, joy, the sky","cowhorns sundisc robe:red mirror");
D("bastet","Bastet","Egyptian","cats, the home, protection, joy","head:cat robe:green ankh cats","bast");
D("sobek","Sobek","Egyptian","the Nile, crocodiles, strength","head:croc sundisc robe:green ankh water","sebek");
D("nut","Nut","Egyptian","the sky, the stars","skin:blue robe:blue stars glow","","c");
D("geb","Geb","Egyptian","the earth","skin:green robe:green bird","","c");
D("taweret","Taweret","Egyptian","childbirth, protection","head:hippo robe:white ankh","tawaret|taueret");

/* Yoruba */
D("obatala","Obatala","Yoruba","the shaping of bodies, purity, clarity","robe:white staff dove glow","oxala|oshala|orisanla|orishanla");
D("oduduwa","Oduduwa","Yoruba","the founding ancestor, kingship","crown robe:white staff","odudua");
D("esu","Esu","Yoruba","crossroads, messages, choices","robe:red staff key","eshu|elegba|elegua|exu");
D("ogun","Ogun","Yoruba","iron, labour, war, the road cut through","robe:green machete anvil dog","ogum|ogoun");
D("sango","Sango","Yoruba","thunder, fire, justice, kingship","crown robe:red axe storm flames","shango|xango|chango");
D("oya","Oya","Yoruba","storms, wind, the marketplace, the gates of the dead","robe:purple machete storm","yansa|iansa");
D("osun","Osun","Yoruba","sweet rivers, love, wealth, fertility","robe:gold mirror fan water","oshun|oxum");
D("yemoja","Yemoja","Yoruba","the mother of waters, motherhood","robe:blue fan water","yemaya|yemanja|iemanja");
D("orunmila","Orunmila","Yoruba","wisdom, divination, destiny","robe:white book","orula");
D("ososi","Ososi","Yoruba","the hunt, the forest, justice","robe:blue bow stag","ochosi|oxossi|oshosi");
D("osanyin","Osanyin","Yoruba","herbs, healing, the forest's medicine","robe:green gourd bird","osain|ossain");
D("obaluaye","Obaluaye","Yoruba","sickness and its healing, the earth","veil robe:brown staff","babalu aye|babaluaye|omolu|sopona|shopona");
D("olokun","Olokun","Yoruba","the deep ocean, wealth, mystery","crown robe:blue water");
D("aganju","Aganju","Yoruba","volcanoes, the wilderness","robe:red staff flames","aganyu");
D("ibeji","Ibeji","Yoruba","twins, joy, abundance","small twins robe:red");
D("osumare","Osumare","Yoruba","the rainbow, continuity","robe:teal serpent glow","oshumare|oxumare");

/* Celtic */
D("dagda","The Dagda","Irish","abundance, life and death, the seasons","longbeard robe:brown club cauldron harp","dagda|eochaid ollathair");
D("morrigan","The Morrígan","Irish","fate, war, sovereignty, prophecy","robe:black ravens spear","morrigan|morrigu|the morrigan");
D("brigid","Brigid","Irish","poetry, healing, smithcraft, the sacred flame","hair:red robe:white flames cup","brighid|brigit","c");
D("lugh","Lugh","Irish","every skill, light, kingship","helmet robe:gold spear glow","lugh lamfhada");
D("nuada","Nuada","Irish","kingship, justice, the silver hand","crown armor sword silverhand","nuadu|nodens");
D("airmid","Airmid","Irish","healing herbs","robe:green gourd");
D("manannan","Manannán","Irish","the sea, the otherworld, mists","beard robe:teal water horse smoke","manannan|manannan mac lir");
D("aengus","Aengus","Irish","love, youth, dreams","robe:gold swan","oengus|aengus og");
D("ogma","Ogma","Irish","eloquence, writing, strength","beard robe:brown book");
D("eriu","Ériu","Irish","sovereignty, the land of Ireland","crown robe:green","eriu");
D("rhiannon","Rhiannon","Welsh","sovereignty, horses, birds, the otherworld","robe:gold horse bird","","c");
D("arawn","Arawn","Welsh","Annwn, the otherworld, the hunt","crown robe:grey dogs darkaura");
D("cerridwen","Cerridwen","Welsh","transformation, the cauldron, inspiration","robe:black cauldron","ceridwen");
D("arianrhod","Arianrhod","Welsh","the silver wheel, the stars, fate","mooncrown robe:silver glow");
D("bran","Bran","Welsh","the blessed head, protection, the raven","giant crown robe:grey raven","bran the blessed|bendigeidfran","c");
D("gwydion","Gwydion","Welsh","magic, trickery, poetry","robe:blue staff");
D("math","Math","Welsh","magic, kingship, wisdom","crown longbeard robe:purple staff","math fab mathonwy","c");
D("orddu","Orddu","Welsh","the hag of the uplands, witchcraft","veil robe:black cauldron");
D("cernunnos","Cernunnos","Gaulish","the wild, animals, plenty, the horned god","antlers robe:green stag serpent","herne|herne the hunter|the horned god|horned one");
D("epona","Epona","Gaulish","horses, fertility, safe journeys","robe:white horse wheat");
D("taranis","Taranis","Gaulish","thunder, the sky's wheel","beard robe:blue wheel thunderbolt storm");
D("matres","The Matres","Gaulish","the Mothers: plenty and protection","trio robe:red wheat","matronae");

/* Chinese */
D("pangu","Pangu","Chinese","the first being, who shaped heaven and earth","giant horns beard robe:brown axe","pan gu");
D("nuwa","Nüwa","Chinese","the making of humankind, the mending of the sky","serpenttail robe:gold","nuwa|nu wa");
D("fuxi","Fuxi","Chinese","the trigrams, hunting, writing","serpenttail robe:brown book","fu xi");
D("jadeemperor","The Jade Emperor","Chinese","the court of heaven","crown longbeard robe:gold scepter glow","jade emperor|yuhuang|yu huang");
D("xiwangmu","Xiwangmu","Chinese","immortality, the west, the peaches of long life","crown robe:red peach","queen mother of the west|xi wang mu");
D("laojun","Taishang Laojun","Chinese","the Dao, alchemy, long life","longbeard robe:grey fan gourd","laozi|lao tzu|lao jun|taishang laojun");
D("shennong","Shennong","Chinese","farming, herbal medicine","horns robe:green wheat","shen nong");
D("houyi","Houyi","Chinese","archery, the one who shot down nine suns","armor bow","hou yi");
D("change","Chang'e","Chinese","the moon","mooncrown robe:white rabbit glow","chang'e|chang e");
D("guanyin","Guanyin","Chinese","compassion, mercy","halo veil robe:white vase lotus glow","kuan yin|kwan yin|guan yin|kannon");
D("mazu","Mazu","Chinese","the sea, sailors, fishers","crown robe:red water","tianhou|matsu");
D("guanyu","Guan Yu","Chinese","loyalty, righteousness, war","skin:red longbeard armor glaive horse","guan gong|guandi");
D("zaojun","Zao Jun","Chinese","the kitchen, the household's conduct","robe:red","kitchen god|zao shen");
D("yanluo","Yanluo Wang","Chinese","judgement of the dead","crown longbeard robe:black book darkaura","yanluo|king yan|yan wang");
D("zhongkui","Zhong Kui","Chinese","vanquisher of ghosts and demons","longbeard robe:red sword");
D("nezha","Nezha","Chinese","protection, the youthful warrior","small robe:red spear wheel flames","ne zha");
D("sunwukong","Sun Wukong","Chinese","the Monkey King, rebellion, mischief","head:monkey crown robe:gold staff","monkey king|sun wu kong|wukong");
D("hexiangu","He Xiangu","Chinese","one of the Eight Immortals","robe:pink lotus");
D("caoguojiu","Cao Guojiu","Chinese","one of the Eight Immortals, nobility, the stage","crown robe:red castanets");
D("litieguai","Li Tieguai","Chinese","one of the Eight Immortals, the sick and poor","beard robe:brown gourd staff","iron crutch li");
D("lancaihe","Lan Caihe","Chinese","one of the Eight Immortals, minstrels","robe:blue flowerbasket");
D("ludongbin","Lü Dongbin","Chinese","one of the Eight Immortals, scholars","longbeard robe:white sword fan","lu dongbin|lu dong bin");
D("hanxiangzi","Han Xiangzi","Chinese","one of the Eight Immortals, music","robe:green flute");
D("zhangguolao","Zhang Guolao","Chinese","one of the Eight Immortals, old age","longbeard robe:grey drum","zhang guo lao");
D("zhongliquan","Zhongli Quan","Chinese","one of the Eight Immortals, the fan that restores life","beard robe:brown fan");

/* Hindu */
D("brahma","Brahma","Hindu","creation","fourfaces arms4 beard robe:red book lotus swan");
D("vishnu","Vishnu","Hindu","preservation, the cosmic order","skin:blue arms4 crown robe:yellow conch discus club lotus","","c");
D("shiva","Shiva","Hindu","destruction and renewal, yoga, the great ascetic","skin:blue thirdeye mooncrown arms4 robe:grey trident drum serpent bull","siva|mahadeva","c");
D("lakshmi","Lakshmi","Hindu","wealth, fortune, beauty","arms4 crown robe:red lotus coins","laxmi","c");
D("saraswati","Saraswati","Hindu","knowledge, music, speech","arms4 robe:white harp book swan","sarasvati","c");
D("parvati","Parvati","Hindu","devotion, power, the mountain's daughter","crown robe:red lotus","","c");
D("durga","Durga","Hindu","protection, victory over demons","arms8 crown robe:red trident sword discus bow lion","","c");
D("kali","Kali","Hindu","time, death, liberation","skin:black arms4 robe:black sword skull flames","","c");
D("ganesha","Ganesha","Hindu","beginnings, the remover of obstacles","head:elephant arms4 robe:yellow axe noose peach rat","ganesh|ganapati|vinayaka","c");
D("hanuman","Hanuman","Hindu","devotion, strength, courage","head:monkey crown robe:orange club","anjaneya");
D("krishna","Krishna","Hindu","love, joy, divine play","skin:blue crown robe:yellow flute cow","govinda","c");
D("rama","Rama","Hindu","righteousness, the ideal king","skin:blue crown robe:yellow bow","","c");
D("indra","Indra","Hindu","storms, the king of the gods","crown robe:gold thunderbolt storm","","c");
D("agni","Agni","Hindu","fire, the sacrificial flame","skin:red robe:red flames");
D("surya","Surya","Hindu","the sun","crown halo robe:gold lotus glow","","c");
D("yama","Yama","Hindu","death, dharma, judge of the dead","skin:green crown robe:red noose club","yamaraja|yamraj");
D("kartikeya","Kartikeya","Hindu","war, victory","crown robe:red spear peacock","murugan|skanda","c");
D("ganga","Ganga","Hindu","the holy river, purification","crown robe:white water","","c");

/* Japanese */
D("amaterasu","Amaterasu","Japanese","the sun, the imperial line","halo robe:white mirror glow","amaterasu omikami");
D("susanoo","Susanoo","Japanese","storms, the sea","beard robe:blue sword storm","susanowo|susano-o");
D("tsukuyomi","Tsukuyomi","Japanese","the moon","mooncrown robe:grey","tsukiyomi");
D("izanagi","Izanagi","Japanese","creation, the first father","beard robe:white spear");
D("izanami","Izanami","Japanese","creation and death, the first mother","veil robe:black darkaura");
D("inari","Inari","Japanese","rice, foxes, prosperity","robe:red wheat dog","inari okami");
D("hachiman","Hachiman","Japanese","archery, war, protection","helmet armor bow");
D("raijin","Raijin","Japanese","thunder, lightning","horns robe:red drum storm","raiden");
D("fujin","Fujin","Japanese","the wind","horns robe:green smoke","fuujin");
D("benzaiten","Benzaiten","Japanese","water, music, eloquence","robe:white harp water","benten");
D("ebisu","Ebisu","Japanese","fishers, luck, merchants","beard robe:gold fish");
D("tenjin","Tenjin","Japanese","scholarship, learning","hat:cap robe:black book");

/* Mesopotamian */
D("anu","Anu","Mesopotamian","the heavens","crown longbeard robe:blue scepter","an","c");
D("enlil","Enlil","Mesopotamian","wind, air, kingship","crown longbeard robe:grey storm");
D("enki","Enki","Mesopotamian","fresh water, wisdom, craft, magic","longbeard crown robe:blue water fish","");
D("inanna","Inanna","Mesopotamian","love, war, the morning and evening star","crown robe:red lion stars","ishtar");
D("ereshkigal","Ereshkigal","Mesopotamian","the great below, the dead","crown robe:black darkaura","irkalla");
D("marduk","Marduk","Mesopotamian","kingship, justice, the storm","crown longbeard robe:blue thunderbolt");
D("nergal","Nergal","Mesopotamian","plague, war, the underworld","crown robe:red sword darkaura");
D("shamash","Shamash","Mesopotamian","the sun, justice","halo longbeard robe:gold scales glow","utu");
D("nanna","Nanna","Mesopotamian","the moon","mooncrown longbeard robe:silver","sin|suen","c");
D("ninhursag","Ninhursag","Mesopotamian","the mountains, birth, the earth","crown robe:green");

/* Mesoamerican and Andean */
D("tezcatlipoca","Tezcatlipoca","Aztec","night, the smoking mirror, sorcery","robe:black mirror darkaura smoke");
D("huitzilopochtli","Huitzilopochtli","Aztec","the sun, war","helmet robe:blue spear shield glow");
D("tlaloc","Tlaloc","Aztec","rain, storms, fertility","robe:teal storm water");
D("xochiquetzal","Xochiquetzal","Aztec","flowers, beauty, love, craft","crown robe:pink flowerbasket");
D("mictlantecuhtli","Mictlantecuhtli","Aztec","the land of the dead","skull robe:black darkaura","mictlantecutli");
D("coatlicue","Coatlicue","Aztec","the earth, the mother of the gods","robe:green serpent");
D("chalchiuhtlicue","Chalchiuhtlicue","Aztec","rivers, lakes, birth","robe:teal water");
D("xipetotec","Xipe Totec","Aztec","renewal, spring, the flayed one","robe:gold wheat","xipe totec");
D("itzamna","Itzamna","Maya","the heavens, writing, healing","longbeard robe:white book");
D("ixchel","Ix Chel","Maya","the moon, weaving, midwifery","mooncrown robe:blue serpent","ix chel|ixchel");
D("chaac","Chaac","Maya","rain, lightning","robe:teal axe storm","chac|chaak");
D("kinichahau","Kinich Ahau","Maya","the sun","halo robe:gold glow","kinich ahau|kinich ajaw");
D("inti","Inti","Inca","the sun","halo crown robe:gold glow");
D("pachamama","Pachamama","Inca","the earth, the harvest, mountains","robe:green wheat","mama pacha");
D("viracocha","Viracocha","Inca","creation, the sea, the sun's maker","longbeard crown robe:white staff","wiracocha");
D("mamaquilla","Mama Quilla","Inca","the moon, marriage","mooncrown robe:silver","mama killa|mama quilla");

/* Slavic */
D("perun","Perun","Slavic","thunder, oak, war","longbeard robe:red axe storm");
D("veles","Veles","Slavic","the underworld, cattle, magic, wealth","horns beard robe:brown serpent darkaura","volos");
D("mokosh","Mokosh","Slavic","women, weaving, the damp earth","veil robe:red wheat","makosh");
D("svarog","Svarog","Slavic","fire, the forge, the sky","longbeard robe:red hammer flames");
D("dazhbog","Dazhbog","Slavic","the sun, giving","halo robe:gold glow","dazbog");
D("morana","Morana","Slavic","winter, death, rebirth","veil robe:white darkaura","marzanna|mara","c");
D("jarilo","Jarilo","Slavic","spring, vegetation","laurel robe:white horse wheat","yarilo");
D("stribog","Stribog","Slavic","the winds","longbeard robe:grey smoke");
D("babayaga","Baba Yaga","Slavic","the wild witch of the forest","veil robe:brown staff cauldron","baba yaga");

/* Akan */
D("nyame","Nyame","Akan","the sky, the high god","halo robe:gold glow","onyame|onyankopon");
D("asaseyaa","Asase Yaa","Akan","the earth, truth, fertility","robe:green wheat","asase yaa|asase afua");
D("anansi","Anansi","Akan","stories, wisdom, trickery","robe:brown spider","ananse|kwaku anansi");
D("tano","Tano","Akan","the river Tano, war, thunder","robe:blue water storm","ta kora");

/* Polynesian */
D("pele","Pele","Hawaiian","volcanoes, fire, the land's making","hair:red robe:red flames","pelehonuamea","c");
D("maui","Māui","Polynesian","trickery, the fishing up of islands, the sun's slowing","robe:brown hook","maui","c");
D("tangaroa","Tangaroa","Polynesian","the sea","beard robe:teal water fish","kanaloa|tagaloa");
D("tane","Tāne","Polynesian","forests, birds, light","robe:green bird","tane mahuta|kane","c");
D("hina","Hina","Polynesian","the moon","mooncrown robe:white","","c");
D("papatuanuku","Papatūānuku","Polynesian","the earth mother","robe:green","papatuanuku");

/* Vodou */
D("legba","Papa Legba","Vodou","the crossroads, the gate between worlds","hat:brimmed beard robe:brown staff key dog","papa legba|legba");
D("erzulie","Erzulie Freda","Vodou","love, beauty, luxury","crown robe:pink mirror","erzulie|ezili freda|erzulie freda");
D("baronsamedi","Baron Samedi","Vodou","death, the cemetery, resurrection","hat:brimmed skull robe:black staff darkaura","baron samedi");
D("damballa","Damballa","Vodou","creation, purity, the sky serpent","robe:white serpent glow","damballah|danbala");
D("ogou","Ogou","Vodou","iron, war, politics","robe:red machete","ogou feray");
D("mamanbrigitte","Maman Brigitte","Vodou","the dead, justice, graves","hair:red robe:black darkaura","maman brigitte");

/* Persian */
D("ahuramazda","Ahura Mazda","Persian","wisdom, light, truth","wings halo robe:white glow","ahura mazda|ormazd|ohrmazd");
D("mithra","Mithra","Persian","covenant, light, the sun","hat:cap robe:red dagger glow","mithras");
D("anahita","Anahita","Persian","waters, fertility, wisdom","crown robe:blue water","aredvi sura anahita");

/* Demonology, Qliphothic, Adversarial */
D("belial","Belial","Demonology","lawlessness, pride, independence","crown wings:black robe:black darkaura");
D("beelzebub","Beelzebub","Demonology","lord of the flies, dominion","head:fly crown wings:black robe:black","baal zebub|beelzebul");
D("asmodeus","Asmodeus","Demonology","lust, wrath, hidden knowledge","crown robe:red flames","ashmedai|asmoday");
D("astaroth","Astaroth","Demonology","knowledge of past and future","crown wings:black robe:purple serpent","ashtaroth");
D("mammon","Mammon","Demonology","wealth, avarice","crown robe:gold coins");
D("belphegor","Belphegor","Demonology","discovery, ingenuity, sloth","horns beard robe:brown");
D("bael","Bael","Demonology","invisibility, the first king","crown tripleface robe:black","baal");
D("paimon","Paimon","Demonology","the arts, the sciences, secret things","crown robe:gold horn horse","paymon");
D("lilith","Lilith","Qliphothic","independence, the night, the untamed","wings:black robe:black serpent owl darkaura","","c");
D("samael","Samael","Qliphothic","severity, the accuser","wings:black robe:red sword","sammael");
D("naamah","Naamah","Qliphothic","seduction, song, the world's charm","robe:purple mirror");
D("moloch","Moloch","Qliphothic","sacrifice, fire","head:bull robe:red flames","molech");
D("adramelech","Adramelech","Qliphothic","pride, the peacock's fire","crown robe:purple peacock","adrammelech");
D("lucifuge","Lucifuge Rofocale","Qliphothic","wealth, pacts, the one who flees light","crown robe:black darkaura","lucifuge rofocale|lucifuge");
D("lucifer","Lucifer","Adversarial","the light-bearer, the morning star, rebellion","wings robe:white glow","");
D("satan","Satan","Adversarial","the adversary, opposition, the test","horns wings:black robe:red flames","the adversary|shaitan");
D("azazel","Azazel","Adversarial","forbidden knowledge, the wilderness","wings:black robe:grey sword");
D("baphomet","Baphomet","Adversarial","the union of opposites","head:goat wings:black robe:black torch flames");
D("choronzon","Choronzon","Adversarial","dispersion, the abyss","formless darkaura smoke");
D("cain","Cain","Adversarial","the first wanderer, the marked one, the builder of cities","beard robe:brown thirdeye","","c");
D("prometheus","Prometheus","Adversarial","forethought, the stolen fire","beard robe:brown torch flames");
D("ahriman","Ahriman","Adversarial","the destructive spirit","crown robe:black darkaura","angra mainyu");

/* The great dragons and serpents: drawn as serpentine forms, not people.
   icons here: color:x size:n heads:n wings legs hood feathered sea */
D("tiamat","Tiamat","Mesopotamian","the salt sea, primordial chaos","color:teal size:4 wings legs heads:5 sea","","d");
D("kingu","Kingu","Mesopotamian","Tiamat's champion, the tablet of destinies","color:bronze size:2 legs","qingu","d");
D("mushussu","Mušḫuššu","Mesopotamian","the furious serpent of Marduk","color:blue size:1.2 legs","mushussu|mushhushshu|sirrush","d");
D("apep","Apep","Egyptian","the serpent of chaos who assails the sun","color:black size:4","apophis","d");
D("typhon","Typhon","Greek","the storm-monster, father of monsters","color:grey size:5 wings legs heads:7","typhoeus","d");
D("echidna","Echidna","Greek","mother of monsters","serpenttail robe:green darkaura","","");
D("python","Python","Greek","the serpent of Delphi","color:olive size:3","the python of delphi","dc");
D("ladon","Ladon","Greek","guardian of the golden apples","color:gold size:2 heads:3","","d");
D("draco","Draco","Greek","the dragon among the stars","color:silver size:3 wings legs stars","","dc");
D("colchian","The Colchian Dragon","Greek","guardian of the Golden Fleece","color:green size:3 legs","colchian dragon|dragon of colchis","d");
D("hydra","The Hydra","Greek","the many-headed serpent of Lerna","color:green size:2 heads:9 legs","lernaean hydra|the hydra","dc");
D("jormungandr","Jörmungandr","Norse","the world serpent","color:teal size:8 sea","jormungandr|jormungand|midgard serpent|world serpent","d");
D("fafnir","Fafnir","Norse","the dragon on the hoard","color:gold size:3 wings legs","fafner","d");
D("nidhogg","Níðhöggr","Norse","the gnawer at the world tree's root","color:black size:3 wings legs","nidhogg|nidhoggr","d");
D("ydraiggoch","Y Ddraig Goch","Welsh","the red dragon","color:red size:3 wings legs","y ddraig goch|the red dragon","d");
D("barrowwyrm","The Barrow Wyrm","Anglo-Saxon","the dragon of the burial mound","color:grey size:2 wings legs","barrow wyrm|barrow-wyrm","d");
D("zmey","Zmey Gorynych","Slavic","the three-headed dragon of the mountains","color:green size:3 wings legs heads:3","zmey gorynych|zmey|zmei","d");
D("azidahaka","Aži Dahāka","Persian","the three-headed dragon of the lie","color:black size:3 wings legs heads:3","azi dahaka|zahhak|zahak","d");
D("vritra","Vritra","Hindu","the serpent who holds back the waters","color:grey size:5","","d");
D("vasuki","Vasuki","Hindu","the serpent king","color:blue size:3 hood","","d");
D("shesha","Shesha","Hindu","the thousand-hooded serpent","color:white size:4 hood heads:7","adishesha|ananta|sheshanaga","d");
D("aoguang","Ao Guang","Chinese","the Dragon King of the Eastern Sea","color:teal size:3 legs","ao guang|dragon king","d");
D("yinglong","Yinglong","Chinese","the winged dragon of rain","color:gold size:3 wings legs","ying long","d");
D("ryujin","Ryūjin","Japanese","the dragon of the sea","color:teal size:3 legs sea","ryujin|ryu jin","d");
D("orochi","Yamata no Orochi","Japanese","the eight-headed serpent","color:red size:4 heads:8","yamata no orochi|orochi","d");
D("quetzalcoatl","Quetzalcoatl","Aztec","the feathered serpent, wind, learning","color:green size:3 feathered","kukulkan|the feathered serpent","d");
D("leviathan","Leviathan","Hebrew","the serpent of the sea","color:teal size:6 sea","","d");
D("nachash","Nachash","Adversarial","the serpent of Eden, knowledge","color:green size:1","the serpent of eden","d");

/* ---- recognition ---- */
var CUES=/\b(god|goddess|deity|lord|lady|the great|orisa|orisha|orixa|lwa|loa|kami|divine|dragon|serpent|demon|king|queen|mother|father)\b[^.]{0,14}$/;
(function(){
  Object.keys(DEITY).forEach(function(k){
    var d=DEITY[k];
    var names=[d.name].concat(d.aka).map(function(n){ return deaccent(n).toLowerCase().replace(/[^a-z' -]/g," ").replace(/\s+/g," ").trim(); });
    names.forEach(function(n){ if(n&&n.length>1) DEITY_WORDS.push([n,k]); });
  });
  DEITY_WORDS.sort(function(a,b){ return b[0].length-a[0].length; });
})();
function deaccent(s){ try{ return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,""); }catch(e){ return String(s); } }

/* deities named in the text: {at,end,key,word}. a cue-requiring name only counts
   with a cue close before it. the cue words are blanked too, so "the goddess
   Venus" is one goddess and not also a generic one. */
function deitiesIn(low){
  var out=[], taken=[];
  DEITY_WORDS.forEach(function(p){
    var needle=" "+p[0]+" ", i=0;
    while((i=low.indexOf(needle,i))>-1){
      var s=i, e=i+needle.length-1, clash=false;
      for(var t=0;t<taken.length;t++) if(s<taken[t][1]&&e>taken[t][0]) clash=true;
      if(!clash){
        var d=DEITY[p[1]], before=low.slice(Math.max(0,s-30),s+1);
        var cued=CUES.test(before);
        if(!d.cue||cued){
          var cm=/\b(the god|the goddess|god|goddess|lady|lord|the great|the orisa|the orisha|the lwa|the loa|the dragon|the serpent|the demon)\s*$/.exec(low.slice(0,s+1));
          var s2=cm?cm.index:s;
          out.push({at:s2,end:e,key:p[1],word:p[0]});
          taken.push([s2,e]);
        }
      }
      i=e;
    }
  });
  return out.sort(function(a,b){ return a.at-b.at; });
}

/* ---- how a deity behaved in the dream, read from what was recorded ---- */
function mannerOf(c){
  var t=" "+(c.details||[]).join(" ").toLowerCase()+" ";
  if(/would not speak|wouldn't speak|said nothing|never spoke|did not speak|didn't speak|silent|without a word|in silence/.test(t)) return "silent";
  if(/whisper/.test(t)) return "whispering";
  if(/\bsang\b|singing|\bsong\b/.test(t)) return "singing";
  if(/riddle|in riddles/.test(t)) return "riddling";
  if(/angry|furious|wrath|rage|raging|stern|glared/.test(t)) return "stern";
  if(/laugh|smil|kind|gentle|warm|tender/.test(t)) return "kind";
  if(/wept|weeping|crying|mourn|sorrow/.test(t)) return "sorrowful";
  if(/command|ordered|demanded|told me to/.test(t)) return "commanding";
  if(/led me|guided me|showed me the way|took me|beckoned/.test(t)) return "guiding";
  return null;
}
var MANNER_WORDS={silent:"you did not speak; you answer only with what you do",whispering:"you spoke only in whispers",
  singing:"you sang rather than spoke",riddling:"you spoke in riddles",stern:"you were stern, even wrathful",
  kind:"you were kind and warm",sorrowful:"you were grieving",commanding:"you gave commands",guiding:"you led the dreamer onward"};

/* ---- placing a deity: one being, the same on every night they're dreamt ---- */
function deityCharacter(key){ return store.characters.filter(function(c){ return c.deity===key&&!c.city; })[0]||null; }
function placeDeity(key,attrs,opts){
  var d=DEITY[key]; if(!d) return null;
  var ch=deityCharacter(key), body=ch&&ch.objId?specById(ch.objId):null;
  if(body&&(body.realm||0)===(store.here||0)){
    if(ch.sessions.indexOf(store.session)===-1) ch.sessions.push(store.session);
    if(body.nights.indexOf(store.session)===-1) body.nights.push(store.session);
    if(opts&&opts.look) applyLook(body,opts.look,null);
    refresh(body); save(); return body;
  }
  var arch=d.dragon?"dragon":"deity";
  var s;
  if(d.dragon){
    store.open=(store.open||0)+1;
    var h=heartOf(store.here||0), ang=store.open*2.39996, rad=160+(store.open%4)*40;
    s={x:h.x+Math.cos(ang)*rad,z:h.z+Math.sin(ang)*rad,rot:Math.random()*6.283};
  } else s=spotFor("human",opts&&opts.dir,{});
  var spec={id:uid(),archetype:arch,label:d.name,name:d.name,named:"stated",deity:key,attrs:attrs||{},
    x:s.x,z:s.z,rot:s.rot||0,solid:true,detail:4,nights:[store.session],addr:s.addr||null};
  if(store.here) spec.realm=store.here;
  if(!d.dragon){ lookOf(spec); deityLook(spec,d); if(opts&&opts.look) applyLook(spec,opts.look,null); }
  store.objects.push(spec);
  if(ch){
    ch.objId=spec.id; ch.x=spec.x; ch.z=spec.z; ch.anchor={x:spec.x,z:spec.z};
    if(ch.sessions.indexOf(store.session)===-1) ch.sessions.push(store.session);
  } else {
    ch=newCharacter(arch,d.name,attrs||{});
    ch.name=d.name; ch.deity=key; ch.awake=true; ch.src={name:"stated"};
    ch.aka=[normName(d.name)].concat(d.aka.map(normName));
    ch.objId=spec.id; ch.x=spec.x; ch.z=spec.z; ch.anchor={x:spec.x,z:spec.z};
  }
  spec.charId=ch.id;
  addMesh(spec);
  store.lastDeity=spec.id;
  viewAt=null;
  updateCount(); save();
  return spec;
}

/* a deity's look begins with their own iconography; the dream can change any of it */
var ICONCOL={white:0xE8E4DA,black:0x1B1C20,red:0xA8322B,gold:0xC7A043,blue:0x2F5E9E,green:0x3F7A3A,purple:0x5E3A7E,
  grey:0x7B7D82,brown:0x6B4A32,pink:0xD99AAE,yellow:0xD4B83C,orange:0xC8662A,teal:0x2F7A7A,silver:0xA7AAB0,
  bronze:0x9A6A3A,olive:0x6B6A34};
var ICONSKIN={blue:0x3E6EB0,black:0x2A2428,green:0x4E7A4A,gold:0xC9A64E,red:0xB0503A,white:0xE8E4DA,grey:0x8A8C90};
function deityLook(spec,d){
  var L=lookOf(spec); L.src=L.src||{};
  d.icons.forEach(function(t){
    var p=t.split(":");
    if(p[0]==="robe"){ L.top=ICONCOL[p[1]]; L.bottom=shade(ICONCOL[p[1]],-0.2); L.topKind="robe"; L.src.top=L.src.bottom=L.src.topKind="tradition"; }
    if(p[0]==="armor"){ L.top=0x8A8C92; L.bottom=0x55575C; L.topKind="shirt"; L.src.top="tradition"; }
    if(p[0]==="skin"){ L.skin=ICONSKIN[p[1]]; L.src.skin="tradition"; }
    if(p[0]==="hair"){ L.hair=ICONCOL[p[1]]||L.hair; L.src.hair="tradition"; }
    if(p[0]==="hat"){ L.hat=p[1]; L.src.hat="tradition"; }
    if(p[0]==="longbeard"||p[0]==="beard"){ L.sex=L.sex||"m"; }
  });
  if(!L.hairStyle) L.hairStyle="long";
}
function hasIcon(d,t){ return d.icons.some(function(x){ return x===t||x.indexOf(t+":")===0; }); }
function iconVal(d,t){ var v=null; d.icons.forEach(function(x){ var p=x.split(":"); if(p[0]===t) v=p[1]; }); return v; }

