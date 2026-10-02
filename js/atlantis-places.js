/* SomnuMatrix — atlantis-places.js
   every job in Somnucor has somewhere to be. This is the list: one named
   building for each place of work, which ring it stands in, what kind of
   building it is, which of the city's posts work there, and what it is
   furnished with before anybody who works there moves a single chair.
   The server keeps the same list (schema-update-19), so the job board can
   say where a post is, and so only the people who work in a place can
   rearrange it.
   loaded as a plain script; shares scope with the other files */
"use strict";

var WORKPLACES=[
 /* ---- the Civic Ring ---- */
 {key:"The Courthouse",ring:"civic",arch:"courthouse",jobs:[9,30,70,79],fit:["lectern","filecabinet","filecabinet","noticeboard","keyrack"],
  note:"Where the city's cases are heard. The magistrates sit here, the advocates argue, the clerks keep the record."},
 {key:"The Dragon Roost",ring:"civic",arch:"institution",jobs:[8,19,86],fit:["noticeboard","filecabinet","keyrack","desk","cellbars","bunk"],
  note:"The Dragon Corp: riders of the city's dragons, each keeping a sector of Somnucor. Every patrol begins and ends here."},
 {key:"The City Treasury",ring:"civic",arch:"bank",jobs:[20,40,112],fit:["filecabinet","filecabinet","desk","weighscale","vaultround"],
  note:"Where the city's own gold is counted: taxes, tolls, and what the treasury holds."},
 {key:"The City Archive",ring:"civic",arch:"library",jobs:[2,68,69],fit:["filecabinet","filecabinet","filecabinet","lectern","mapchest"],
  note:"Every record the city keeps, and a reading room for anybody who asks."},
 {key:"The City Museum",ring:"civic",arch:"museum",jobs:[93],fit:["displaycase","displaycase","displaycase","displaycase","lectern"],
  note:"What the city has found in its dreams, set out to be looked at."},
 {key:"The City Hospital",ring:"civic",arch:"hospital",jobs:[21,31,106],fit:["herbrack","weighscale","cot","cot"],
  note:"Physicians, nurses and midwives. Nobody is turned away."},
 {key:"The Post Office",ring:"civic",arch:"shop",s:1.5,jobs:[16,36],fit:["filecabinet","keyrack","crates","weighscale","noticeboard"],
  note:"Every letter and parcel the city sends passes through here. The postmaster keeps the counter; the carriers keep the streets."},
 {key:"The Chronicle Press",ring:"civic",arch:"shop",s:1.5,jobs:[38,89],fit:["printpress","printpress","workbench","noticeboard","crates"],
  note:"Where the Obsidian Chronicle & Temple Gazette is set, printed and sent out into the city, week on week."},
 {key:"The Land Office",ring:"civic",arch:"bank",s:.9,jobs:[7,34,45,104],fit:["mapchest","filecabinet","filecabinet","noticeboard","desk"],
  note:"The realtors, assessors and rent collectors. Every plot in the city is entered in the books here."},
 {key:"The Gate Lodge",ring:"civic",arch:"station",s:.8,jobs:[4,6,39,44,53,83,90],fit:["keyrack","noticeboard","desk","benchin","clock"],
  note:"Keepers of the Hall of Doors: gatekeepers, porters, guides, the door registrar and the dream wardens."},
 {key:"The Map House",ring:"civic",arch:"library",s:.8,jobs:[1,42,61],fit:["mapchest","mapchest","maptable","lectern"],
  note:"Cartographers, surveyors and the city's planners. The map of everywhere is drawn from here."},
 {key:"The Runners' Hall",ring:"civic",arch:"station",s:.55,jobs:[5,81],fit:["benchin","noticeboard","keyrack","crates"],
  note:"Runners and couriers wait for their errands here, and set off at a run."},
 /* ---- the High Ring ---- */
 {key:"The Gardeners' Lodge",ring:"estates",arch:"cottage",s:1.6,jobs:[41,62],fit:["workbench","flowerbucket","flowerbucket","flowerbucket","crates"],
  note:"The gardeners and groundskeepers who keep the High Ring's gardens in flower."},
 /* ---- Temple Row ---- */
 {key:"The Vestry of Temple Row",ring:"temples",arch:"chapel",s:1.4,jobs:[14,52,67,82],fit:["lectern","candles","bookshelf","wardrobe","keyrack"],
  note:"The temple keepers, wardens, candle keepers and bell ringers who tend every house on the Row."},
 {key:"The Undertaker's",ring:"temples",arch:"shop",s:1.4,jobs:[37,84],fit:["coffin","coffin","coffin","lectern","candles"],
  note:"The undertakers and gravediggers. The city's own cemetery lies behind."},
 /* ---- the Market Ring: Guild Street and the rest ---- */
 {key:"The General Store",ring:"markets",arch:"shop",s:1.2,jobs:[13],fit:["shelfgoods","crates","barrel","weighscale"],note:"A little of everything, and the shopkeepers who sell it."},
 {key:"The Chandlery",ring:"markets",arch:"shop",s:1.2,jobs:[28],fit:["candles","candles","shelfgoods","barrel"],note:"Candles, lamp oil, rope and tallow."},
 {key:"The Brewhouse",ring:"markets",arch:"shop",s:1.3,jobs:[33],fit:["cask","cask","cask","barrel","workbench"],note:"Where the city's ale is brewed."},
 {key:"The Barber's",ring:"markets",arch:"shop",s:1.2,jobs:[35],fit:["barberchair","barberchair","barberchair","sink"],note:"A shave, a cut, and all the news."},
 {key:"The Butcher's",ring:"markets",arch:"shop",s:1.2,jobs:[56],fit:["butcherblock","butcherblock","weighscale"],note:"Meat, cut to order."},
 {key:"The Print Shop",ring:"markets",arch:"shop",s:1.2,jobs:[64],fit:["printpress","printpress","workbench"],note:"Bills, books and broadsides."},
 {key:"The Greengrocer's",ring:"markets",arch:"shop",s:1.2,jobs:[73],fit:["crates","crates","crates","weighscale"],note:"What the Long Fields grow, fresh each morning."},
 {key:"The Toy Shop",ring:"markets",arch:"shop",s:1.2,jobs:[75],fit:["toys","toys","toys","displaycase"],note:"The toymakers' own shop, and a window every child stops at."},
 {key:"The Bindery",ring:"markets",arch:"shop",s:1.2,jobs:[85],fit:["workbench","printpress","bookshelf","bookshelf"],note:"Books bound and mended."},
 {key:"The Jeweller's",ring:"markets",arch:"shop",s:1.2,jobs:[88],fit:["displaycase","displaycase","displaycase","weighscale"],note:"What comes up from the gem pits, set and polished."},
 {key:"The Cookhouse",ring:"markets",arch:"shop",s:1.3,jobs:[95],fit:["stove","stove","oven","longtable"],note:"Hot food for the whole market, all day."},
 {key:"The Smithy",ring:"markets",arch:"shop",s:1.3,jobs:[97],fit:["forge","anvil","anvil","workbench","barrel"],note:"Iron worked hot. You hear it before you see it."},
 {key:"The Tailor's",ring:"markets",arch:"shop",s:1.2,jobs:[99],fit:["dressform","dressform","dressform","workbench","wardrobe"],note:"Clothes cut, sewn and mended."},
 {key:"The Tavern",ring:"markets",arch:"shop",s:1.5,jobs:[100],fit:["cask","cask","longtable","barrel","fireplace"],note:"The barmen keep the taps. Everybody else keeps the tables."},
 {key:"The Cobbler's",ring:"markets",arch:"shop",s:1.2,jobs:[101],fit:["workbench","workbench","shelfgoods"],note:"Shoes and boots, made and mended."},
 {key:"The Bakery",ring:"markets",arch:"shop",s:1.2,jobs:[102],fit:["oven","oven","shelfgoods","table"],note:"Bread before dawn, and cakes by noon."},
 {key:"The Weaving Shed",ring:"markets",arch:"shop",s:1.3,jobs:[103],fit:["loom","loom","loom","crates"],note:"Cloth from the looms, by the bolt."},
 {key:"The Florist's",ring:"markets",arch:"shop",s:1.2,jobs:[105],fit:["flowerbucket","flowerbucket","flowerbucket","flowerbucket","flowerbucket"],note:"Flowers for every house on Temple Row, and for anybody else."},
 {key:"The Pottery",ring:"markets",arch:"shop",s:1.2,jobs:[109],fit:["potterswheel","potterswheel","oven","shelfgoods"],note:"Clay from the pits, thrown and fired."},
 {key:"The Watchmaker's",ring:"markets",arch:"shop",s:1.2,jobs:[110],fit:["clock","clock","clock","displaycase","workbench"],note:"Every clock in the city is wound from here."},
 {key:"The Apothecary",ring:"markets",arch:"shop",s:1.2,jobs:[15],fit:["herbrack","herbrack","displaycase","weighscale"],note:"Remedies weighed and mixed."},
 {key:"The Herbalist's",ring:"markets",arch:"shop",s:1.2,jobs:[76],fit:["herbrack","herbrack","flowerbucket","flowerbucket","table"],note:"Herbs dried, bundled and sold."},
 {key:"The Sign Shop",ring:"markets",arch:"shop",s:1.2,jobs:[72],fit:["workbench","workbench","noticeboard","crates"],note:"Every sign in the city was lettered here."},
 {key:"The Somnucor Inn",ring:"markets",arch:"hotel",jobs:[29],fit:["keyrack","noticeboard"],note:"Rooms for travellers, and an innkeeper at the desk day and night."},
 {key:"The Stables",ring:"markets",arch:"barn",s:1.3,jobs:[59,63,66,94],fit:["anvil","forge","crates","barrel","workbench"],note:"Beast handlers, stablehands, carriage drivers and the farrier."},
 /* ---- the Commons ---- */
 {key:"The City School",ring:"commons",arch:"school",jobs:[18,92],fit:["noticeboard","bookshelf"],note:"The schoolmaster and the teachers. Every child in the Commons learns here."},
 {key:"The Transport Depot",ring:"commons",arch:"station",s:.9,jobs:[12,46,58,87],fit:["noticeboard","keyrack","benchin","clock"],note:"Drivers of every kind, and the signal operators who keep them apart."},
 {key:"The Joinery",ring:"commons",arch:"warehouse",s:.8,jobs:[51,98],fit:["workbench","workbench","workbench","crates"],note:"Carpenters and roofers. Most of the city's timber passes through here."},
 {key:"The Masons' Yard",ring:"commons",arch:"warehouse",s:.8,jobs:[22],fit:["workbench","workbench","crates","crates","anvil"],note:"Stone cut and dressed for every wall in the city."},
 {key:"The Glassworks",ring:"commons",arch:"factory",s:.7,jobs:[55],fit:["forge","forge","workbench","shelfgoods"],note:"Every window in the city was blown here."},
 {key:"The Engine House",ring:"commons",arch:"factory",s:.8,jobs:[3,108],fit:["machine","workbench","filecabinet"],note:"The engineers and electricians who keep the city running."},
 {key:"The Waterworks",ring:"commons",arch:"factory",s:.8,jobs:[23,91],fit:["machine","machine","workbench","barrel"],note:"The water keepers and plumbers. Every fall and canal in the city is theirs to keep."},
 {key:"The City Depot",ring:"commons",arch:"warehouse",s:.8,jobs:[49,54,65,74],fit:["crates","crates","crates","barrel","workbench"],note:"Road crews, sweepers, lamplighters and sanitation."},
 {key:"The Wheelwright's",ring:"commons",arch:"garage",s:1.8,jobs:[57],fit:["workbench","workbench","anvil"],note:"Wheels, carts and carriages, made and mended."},
 {key:"The Reactor",ring:"commons",arch:"reactor",s:1.3,jobs:[107],fit:["bigconsole","monitor","servertower"],note:"The reactor technicians keep the Rim's power burning."},
 {key:"The Biodome",ring:"commons",arch:"biodome",jobs:[113],fit:["labbench","flowerbucket","flowerbucket","herbrack"],note:"A garden under glass, kept by the dome keepers."},
 {key:"The Menagerie Lodge",ring:"commons",arch:"cottage",s:1.6,jobs:[96],fit:["cage","cage","crates","workbench"],note:"The menagerie keepers. The creatures are kept, not caged."},
 /* ---- the Warrens ---- */
 {key:"The Gaol",ring:"warrens",arch:"institution",jobs:[32,50],fit:["bunk","cellbars","keyrack","noticeboard","filecabinet","desk"],
  note:"Where a sentence is actually served, hours worked off in the yard under the gaoler's own eye — not just a line in the city's books."},
 /* ---- the Harvest Ring ---- */
 {key:"The Pit Office",ring:"harvest",arch:"shed",s:2.2,jobs:[24,77],fit:["noticeboard","filecabinet","crates","weighscale"],note:"The quarrymen and their pit foreman. Stone, ore, coal and clay come up here."},
 {key:"The Mine Head",ring:"harvest",arch:"shed",s:2.2,jobs:[10],fit:["crates","barrel","workbench","displaycase"],note:"The miners go down from here into the gem pits."},
 {key:"The Sawmill",ring:"harvest",arch:"barn",jobs:[71],fit:["workbench","workbench","machine","crates"],note:"The sawyers turn the Long Stand's timber into planks."},
 {key:"The Charcoal Burner's Hut",ring:"harvest",arch:"shed",s:2,jobs:[43],fit:["barrel","crates","forge"],note:"Where the charcoal is burnt, slow and smoky."},
 {key:"The Forester's Lodge",ring:"harvest",arch:"cottage",s:1.6,jobs:[11,78],fit:["workbench","crates","fireplace","bunk"],note:"The foresters and lumberjacks who keep the Long Stand."},
 {key:"The Farmhouse",ring:"harvest",arch:"farmhouse",jobs:[47],fit:["longtable","stove","crates"],note:"The farmhands of the Long Fields."},
 {key:"The Dairy",ring:"harvest",arch:"barn",jobs:[80],fit:["barrel","barrel","cask","workbench"],note:"Milk, butter and cheese."},
 {key:"The Mill",ring:"harvest",arch:"windmill",jobs:[17],fit:["crates","crates","machine"],note:"The miller grinds the Long Fields' grain."},
 {key:"The Sheepfold",ring:"harvest",arch:"barn",s:.8,jobs:[27],fit:["crates","barrel","workbench"],note:"The shepherds' own barn."},
 {key:"The Dock Office",ring:"harvest",arch:"warehouse",s:.8,jobs:[26,60],fit:["filecabinet","noticeboard","crates","crates","crates"],note:"Dock hands and crane operators. What the city imports comes over this rim."},
 {key:"The Fish Quay",ring:"harvest",arch:"warehouse",s:.6,jobs:[25],fit:["barrel","barrel","barrel","butcherblock","weighscale"],note:"The fishermen land their catch from the Outer Moat here."},
 {key:"The Harbourmaster's House",ring:"harvest",arch:"house",s:1.4,jobs:[48],fit:["mapchest","desk","noticeboard","clock"],note:"The harbourmaster keeps the moat and everything on it."},
 {key:"The Ferry Light",ring:"harvest",arch:"lighthouse",s:1.3,jobs:[111],fit:["keyrack","benchin"],note:"The ferrymen's light, over the moat."}
];
var WP_BY_KEY={}; WORKPLACES.forEach(function(w){ WP_BY_KEY[w.key]=w; });
var WP_BY_JOB={}; WORKPLACES.forEach(function(w){ w.jobs.forEach(function(j){ WP_BY_JOB[j]=w.key; }); });
