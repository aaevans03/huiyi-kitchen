// Presentation content that data.js doesn't hold: photos, Chinese labels, search words,
// and full recipe text. data.js stays the single source for structure (categories,
// filters, which recipe is where). Everything here is keyed by data.js ids or by a
// recipe's English name exactly as written in data.js.
//
// IMAGES     One per recipe type and per recipe. Each is one of:
//              "1512058564366-18510be2db19"            an Unsplash photo id (the part after "photo-")
//              "assets/images/lu-rou-fan.jpg"          a photo saved in this project, or a full URL
//              { src: "assets/images/kaya-toast.jpg",  a photo that must be credited (CC BY, CC BY-SA,
//                credit: "Photo: Jane Doe, CC BY-SA 4.0", a friend's photo). The credit shows under the
//                link: "https://commons.wikimedia.org/..." } photo on its recipe page and on the About page.
// LABELS_ZH  Chinese label and pinyin for each attribute value (by value id).
//            Region values also list their flags: files in assets/flags/ (Twemoji, CC-BY 4.0).
// SEARCH     per recipe: pinyin of the Chinese name, plus extra words people might type
//            (simplified characters, other names).
// DETAILS    per recipe: full bilingual recipe. A recipe without details still gets a
//            page; it just says the full recipe is coming soon.
//            Recipes are written for students on a budget: 2 servings (4 for long braises),
//            a stovetop and rice cooker, and a shared pantry (soy/dark soy/oyster sauce,
//            doubanjiang, sambal oelek, five-spice, star anise, curry powder, coconut milk,
//            cabbage, bean sprouts, bok choy, egg noodles, chicken thighs...). Specialty or
//            alcohol ingredients are marked optional or given a pantry swap.

window.SITE_CONTENT = {
  images: {
    category: {
      "rice": "1603133872878-684f208fb84b",
      "noodles": "1555126634-323283e090fa",
      "meat-mains": "1550367363-ea12860cc124",
      "sides-vegetables": "1564834724105-918b73d1b9e0",
      "soups": "1576577445504-6af96477db52",
      "breakfast": "1525351484163-7529414344d8",
      "lunch-dinner": "1504674900247-0877df9cc836",
      "snack": "1563245372-f21724e3856d",
    },
    recipe: {
      "Stir-fried Tomato and Scrambled Eggs": "1580651315530-69c8e0026377",
      "Mapo Tofu": "1604908176997-125f25cc6f3d",
      "Hot and Sour Shredded Potatoes": "1606787366850-de6330128bfc",
      "Braised Pork Belly": "1550367363-ea12860cc124",
      "Congee": "1516684732162-798a0062be99",
      "Twice-Cooked Pork": "1625938145744-e380515399bf",
      "Pork and Pepper Stir-fry": "1617093727343-374698b1b08d",
      "Hainan Chicken Rice": "1525755662778-989d0524087e",
      "Dumplings": "1496116218417-1a781b1c416c",
      "Taiwanese Popcorn Chicken": "1626082927389-6cd097cdc6ec",
      "Lu Rou Fan (Braised Pork Rice)": "1512058564366-18510be2db19",
      "Beef Noodle Soup": "1582878826629-29b7ad1cdc43",
      "Garlic Smashed Cucumbers": "1546069901-ba9599a7e63c",
      "Stir-fried Cabbage with Bacon": "1590301157890-4810ed352733",
      "Cheese Egg Crepe": "1584278860047-22db9ff82bed",
      "Baked BBQ Pork (Char Siu)": "1529692236671-f1f6cf9683ba",
      "HK Soy Sauce Noodles": "1617622141675-d3005b9067c5",
      "HK Macaroni Soup": "1552611052-33e04de081de",
      "Clay Pot Rice": "1630409351217-bc4fa6422075",
      "Cheung Fun (Steamed Rice Rolls)": "1563245372-f21724e3856d",
      "Singapore Hainan Chicken Rice": "1603133872878-684f208fb84b",
      "Egg Foo Young": "1482049016688-2d3e1b311543",
      "Asian Greens (Bok Choy, Gai Lan)": "1564834724105-918b73d1b9e0",
      "Char Kway Teow (Rice Noodle Stir-Fry)": "1559314809-0d155014e29e",
      "Hokkien Mee (Stir-Fried Noodles with Shrimp)": "1612929633738-8fe44f7ec841",
      "Bak Kut Teh": "1576577445504-6af96477db52",
      "Curry Laksa (Nyonya Style)": "1455619452474-d2be8b1e70cd",
      "Nasi Lemak": "1569058242253-92a9c755a0ec",
      "Kaya Toast": "1525351484163-7529414344d8",
      "Mee Goreng (Southeast Asian Fried Noodles)": "1623689046286-01d812cc8bad",
    },
  },

  // [Chinese label, pinyin, flags]. Flags are only used on the home page region buttons.
  labelsZh: {
    kind: {
      "rice": ["米飯", "mi fan"],
      "noodles": ["麵食", "mian shi"],
      "meat-mains": ["肉類主菜", "rou lei zhu cai"],
      "sides-vegetables": ["配菜與蔬菜", "pei cai yu shu cai"],
      "soups": ["湯品", "tang pin"],
      "breakfast": ["早餐", "zao can"],
      "lunch-dinner": ["午餐／晚餐", "wu can wan can"],
      "snack": ["小吃", "xiao chi"],
    },
    region: {
      "mainland": ["中國", "zhong guo", ["cn"]],
      "taiwan": ["台灣", "tai wan", ["tw"]],
      "hong-kong": ["香港", "xiang gang", ["hk"]],
      "singapore-malaysia": ["新加坡／馬來西亞", "xin jia po ma lai xi ya", ["sg", "my"]],
    },
    ingredient: {
      "pork": ["豬肉", "zhu rou"],
      "chicken": ["雞肉", "ji rou"],
      "beef": ["牛肉", "niu rou"],
      "seafood": ["海鮮", "hai xian"],
      "egg": ["蛋", "ji dan"],
      "tofu": ["豆腐", "dou fu"],
      "vegetables": ["蔬菜", "shu cai"],
    },
  },

  // pinyin: the Chinese name in pinyin, no tones. also: simplified characters and other names.
  search: {
    "Stir-fried Tomato and Scrambled Eggs": { pinyin: "fan qie chao dan", also: "番茄炒蛋 西红柿炒鸡蛋 xi hong shi chao ji dan" },
    "Mapo Tofu": { pinyin: "ma po dou fu", also: "" },
    "Hot and Sour Shredded Potatoes": { pinyin: "suan la tu dou si", also: "酸辣土豆丝" },
    "Braised Pork Belly": { pinyin: "hong shao rou", also: "红烧肉" },
    "Congee": { pinyin: "zhou", also: "白粥 bai zhou jook rice porridge" },
    "Twice-Cooked Pork": { pinyin: "hui guo rou", also: "回锅肉" },
    "Pork and Pepper Stir-fry": { pinyin: "qing jiao rou si", also: "青椒肉丝" },
    "Hainan Chicken Rice": { pinyin: "hai nan ji fan", also: "海南鸡饭" },
    "Dumplings": { pinyin: "jiao zi", also: "饺子 gyoza potstickers" },
    "Taiwanese Popcorn Chicken": { pinyin: "xian su ji", also: "咸酥鸡 鹽酥雞 盐酥鸡 yan su ji" },
    "Lu Rou Fan (Braised Pork Rice)": { pinyin: "lu rou fan", also: "卤肉饭 魯肉飯" },
    "Beef Noodle Soup": { pinyin: "niu rou mian", also: "牛肉面 紅燒牛肉麵 红烧牛肉面" },
    "Garlic Smashed Cucumbers": { pinyin: "pai huang gua", also: "拍黄瓜 cucumber salad" },
    "Stir-fried Cabbage with Bacon": { pinyin: "pei gen chao gao li cai", also: "培根炒高丽菜" },
    "Cheese Egg Crepe": { pinyin: "qi si dan bing", also: "起司蛋饼 dan bing" },
    "Baked BBQ Pork (Char Siu)": { pinyin: "cha shao", also: "叉烧 chashu" },
    "HK Soy Sauce Noodles": { pinyin: "chi you huang chao mian", also: "豉油皇炒面 hong kong chow mein" },
    "HK Macaroni Soup": { pinyin: "huo tui tong fen", also: "hong kong ham" },
    "Clay Pot Rice": { pinyin: "bao zai fan", also: "煲仔饭 claypot" },
    "Cheung Fun (Steamed Rice Rolls)": { pinyin: "chang fen", also: "肠粉 dim sum" },
    "Singapore Hainan Chicken Rice": { pinyin: "xin jia po hai nan ji fan", also: "新加坡海南鸡饭" },
    "Egg Foo Young": { pinyin: "fu rong dan", also: "omelette omelet" },
    "Asian Greens (Bok Choy, Gai Lan)": { pinyin: "chao qing cai bai cai jie lan", also: "炒青菜（白菜／芥兰） 芥兰 青江菜" },
    "Char Kway Teow (Rice Noodle Stir-Fry)": { pinyin: "chao guo tiao", also: "炒粿条" },
    "Hokkien Mee (Stir-Fried Noodles with Shrimp)": { pinyin: "fu jian chao xia mian", also: "福建炒虾面 prawn" },
    "Bak Kut Teh": { pinyin: "rou gu cha", also: "pork rib soup" },
    "Curry Laksa (Nyonya Style)": { pinyin: "niang re ga li le sha ka li", also: "娘惹咖喱叻沙 咖喱 laksa" },
    "Nasi Lemak": { pinyin: "ye jiang fan", also: "椰浆饭 coconut rice" },
    "Kaya Toast": { pinyin: "ka ye tu si ga ye", also: "coconut jam kopitiam" },
    "Mee Goreng (Southeast Asian Fried Noodles)": { pinyin: "ma lai chao mian", also: "马来炒面" },
  },

  // Full recipes. Text pairs are [English, Chinese] so the two columns always line up.
  details: {
    "Stir-fried Tomato and Scrambled Eggs": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "mainland",
      },
      intro: [
        "The first dish many Chinese home cooks learn: soft scrambled eggs in a sweet and tangy tomato sauce. Cheap, fast, and perfect over rice.",
        "許多人學會的第一道家常菜：滑嫩炒蛋配上酸甜的番茄醬汁，便宜又快速，最適合配白飯。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Eggs, 4", "雞蛋 4 顆"],
            ["Tomatoes, 2 medium, cut into wedges", "番茄 2 顆（中型），切塊"],
            ["Scallions, 2 stalks, chopped (whites and greens kept separate)", "青蔥 2 根，切蔥花（蔥白與蔥綠分開）"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Ketchup, 1 tbsp (optional, for a richer sauce)", "番茄醬 1 大匙（可省略，讓醬汁更濃郁）"],
            ["Water, ¼ cup", "水 ¼ 杯"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Beat the eggs. Whisk the eggs with a pinch of the salt until smooth.",
          "打蛋。雞蛋加入一小撮鹽，打散至均勻。",
        ],
        [
          "Scramble the eggs. Heat 1 tbsp oil in a pan over medium-high heat. Pour in the eggs, push them gently, and take them out while they are still a little runny.",
          "炒蛋。鍋中倒入 1 大匙油，以中大火加熱。倒入蛋液輕輕推炒，趁蛋還有點濕潤時先盛起。",
        ],
        [
          "Cook the tomatoes. Add the rest of the oil and the scallion whites. Add the tomatoes and stir-fry for 2 minutes, pressing them so they release their juice. Add the water, sugar, the rest of the salt, and the ketchup if using. Simmer 2–3 minutes until saucy.",
          "煮番茄。倒入剩下的油與蔥白，放入番茄翻炒 2 分鐘，邊炒邊壓出湯汁。加入水、糖、剩下的鹽，以及番茄醬（若使用），煮 2–3 分鐘至醬汁變濃。",
        ],
        [
          "Combine. Return the eggs to the pan and fold them into the sauce for 30 seconds. Top with the scallion greens and serve over rice.",
          "拌勻。將炒蛋倒回鍋中，與醬汁拌炒 30 秒。撒上蔥綠，配白飯享用。",
        ],
      ],
    },

    "Mapo Tofu": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["Hot", "大辣"],
        origin: "mainland",
      },
      intro: [
        "Sichuan's famous numbing, spicy tofu with ground pork. A little meat goes a long way, which makes this one of the cheapest filling dinners around.",
        "四川名菜麻婆豆腐：豆腐與豬絞肉燒成麻辣鮮香的一鍋。少少的肉就能做出滿滿一盤，是最划算的下飯菜之一。",
      ],
      ingredients: [
        {
          group: ["Main", "主料"],
          items: [
            ["Tofu (soft or medium-firm), 1 block (14–16 oz), cut into 1-inch cubes", "豆腐（嫩豆腐或板豆腐）1 盒（約 400 公克），切成 2.5 公分小塊"],
            ["Ground pork, 4 oz", "豬絞肉 4 盎司（約 115 公克）"],
          ],
        },
        {
          group: ["Sauce & Aromatics", "醬料與辛香料"],
          items: [
            ["Doubanjiang (spicy bean paste), 2 tbsp", "辣豆瓣醬 2 大匙"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Ginger, 1 tsp, minced", "薑末 1 小匙"],
            ["Chili flakes, 1 tsp (more if you like it hotter)", "辣椒碎 1 小匙（喜歡更辣可多加）"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Sugar, ½ tsp", "糖 ½ 小匙"],
            ["Water, ¾ cup", "水 ¾ 杯"],
            ["Cornstarch, 1 tbsp, mixed with 2 tbsp water", "玉米粉 1 大匙，加 2 大匙水調勻"],
            ["Ground Sichuan peppercorns, ½ tsp (optional, but gives the numbing taste)", "花椒粉 ½ 小匙（可省略，但麻味靠它）"],
            ["Scallions, 2 stalks, chopped", "青蔥 2 根，切蔥花"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Firm up the tofu. Simmer the tofu cubes in lightly salted water for 2 minutes so they hold together, then drain.",
          "處理豆腐。豆腐塊放入加了少許鹽的滾水中煮 2 分鐘，讓豆腐不易碎，撈起瀝乾。",
        ],
        [
          "Brown the pork. Heat the oil in a pan over medium-high heat. Add the pork and break it up, cooking about 3 minutes until browned and a little crispy.",
          "炒絞肉。鍋中倒油，以中大火加熱，放入豬絞肉炒散，約 3 分鐘至上色、微微焦香。",
        ],
        [
          "Build the sauce. Turn the heat to medium. Add the doubanjiang and stir-fry for 1 minute until the oil turns red. Add the garlic, ginger, and chili flakes and cook 30 seconds.",
          "炒醬。轉中火，加入辣豆瓣醬拌炒 1 分鐘，直到油色轉紅。再放入蒜末、薑末與辣椒碎，炒 30 秒。",
        ],
        [
          "Simmer the tofu. Pour in the water, soy sauce, and sugar and bring to a simmer. Slide in the tofu and gently push it around (don't stir hard, or it will break). Simmer 4–5 minutes.",
          "燒豆腐。加入水、醬油與糖煮滾，放入豆腐，用鍋鏟輕推（不要用力翻炒，以免豆腐破碎），小火煮 4–5 分鐘。",
        ],
        [
          "Thicken. Stir the cornstarch mixture and pour it in a little at a time, gently shaking the pan, until the sauce is glossy and clings to the tofu.",
          "勾芡。玉米粉水攪勻後分次倒入，同時輕輕晃動鍋子，直到醬汁變得濃稠光亮、包覆豆腐。",
        ],
        [
          "Finish. Sprinkle with the ground Sichuan peppercorns and scallions. Serve over rice.",
          "完成。撒上花椒粉與蔥花，配白飯享用。",
        ],
      ],
    },

    "Hot and Sour Shredded Potatoes": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["5 min", "5 分鐘"],
        servings: "2",
        spice: ["Mild", "小辣"],
        origin: "mainland",
      },
      intro: [
        "Crunchy potato strips stir-fried with vinegar and chili. Potatoes are one of the cheapest vegetables you can buy, and this makes them taste anything but ordinary.",
        "爽脆的馬鈴薯絲以醋和辣椒快炒。馬鈴薯是最便宜的蔬菜之一，這道菜卻讓它一點都不平凡。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Potatoes, 2 medium (about 1 lb)", "馬鈴薯 2 顆（中型，約 1 磅）"],
            ["Vinegar (Chinese black vinegar or rice vinegar), 2 tbsp", "醋（黑醋或米醋）2 大匙"],
            ["Garlic, 2 cloves, sliced", "蒜頭 2 瓣，切片"],
            ["Chili flakes, 1 tsp", "辣椒碎 1 小匙"],
            ["Sichuan peppercorns, ½ tsp (optional)", "花椒粒 ½ 小匙（可省略）"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Sugar, ½ tsp", "糖 ½ 小匙"],
            ["Scallions, 1 stalk, chopped", "青蔥 1 根，切蔥花"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
          ],
        },
      ],
      steps: [
        [
          "Shred the potatoes. Peel the potatoes and cut them into thin matchsticks. The large holes of a box grater also work.",
          "切絲。馬鈴薯去皮，切成細絲。也可以用刨絲器較粗的那一面刨。",
        ],
        [
          "Rinse off the starch. Soak the strips in cold water and rinse 2–3 times until the water runs clear. This keeps them crunchy. Drain well.",
          "洗去澱粉。馬鈴薯絲泡冷水，換水沖洗 2–3 次直到水變清澈，這樣炒起來才會爽脆。徹底瀝乾。",
        ],
        [
          "Flavor the oil. Heat the oil over medium heat. If using Sichuan peppercorns, fry them for 30 seconds, then scoop them out. Add the garlic and chili flakes and fry for 15 seconds.",
          "爆香。鍋中倒油以中火加熱。若使用花椒，先炸 30 秒後撈出。再放入蒜片與辣椒碎炒 15 秒。",
        ],
        [
          "Stir-fry. Turn the heat to high, add the potatoes, and toss for 2 minutes. Pour the vinegar around the edge of the pan, add the salt and sugar, and toss 1–2 more minutes until cooked but still crunchy.",
          "快炒。轉大火，放入馬鈴薯絲翻炒 2 分鐘。沿著鍋邊淋入醋，加鹽和糖，再炒 1–2 分鐘，炒熟但仍保持脆度。",
        ],
        [
          "Finish. Toss in the scallions and serve right away.",
          "完成。拌入蔥花，立即上桌。",
        ],
      ],
    },

    "Braised Pork Belly": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["1½ hrs", "1.5 小時"],
        servings: "4",
        spice: ["None", "不辣"],
        origin: "mainland",
      },
      intro: [
        "Hong shao rou: pork belly slowly braised in caramelized sugar and soy sauce until it melts in your mouth. Add hard-boiled eggs to the pot to stretch it into more meals.",
        "紅燒肉：五花肉以焦糖與醬油慢燉至入口即化。在鍋中加入水煮蛋，一鍋就能多吃好幾餐。",
      ],
      ingredients: [
        {
          group: ["Meat", "肉類"],
          items: [
            ["Pork belly, 1½ lbs, cut into 1½-inch cubes", "五花肉 1.5 磅，切成約 4 公分塊狀"],
            ["Eggs, 4, hard-boiled and peeled (optional)", "雞蛋 4 顆，水煮後剝殼（可省略）"],
          ],
        },
        {
          group: ["Braising Liquid", "燉煮醬汁"],
          items: [
            ["Sugar, 2 tbsp", "糖 2 大匙"],
            ["Soy sauce, 3 tbsp", "醬油 3 大匙"],
            ["Dark soy sauce, 1 tbsp", "老抽 1 大匙"],
            ["Rice wine, 2 tbsp (optional)", "米酒 2 大匙（可省略）"],
            ["Ginger, 4 slices", "薑 4 片"],
            ["Scallions, 3 stalks, cut into sections", "青蔥 3 根，切段"],
            ["Star anise, 2 pods", "八角 2 顆"],
            ["Water, about 3 cups", "水 約 3 杯"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Blanch the pork. Put the pork in a pot of cold water, bring it to a boil, and cook for 3 minutes. Drain and rinse.",
          "汆燙五花肉。五花肉放入冷水鍋中，煮滾後再煮 3 分鐘，撈起沖洗乾淨。",
        ],
        [
          "Brown the pork. Put the pork in a dry pot over medium heat and cook 5–6 minutes, turning, until golden and some fat has melted out. Pour off all but 1 tbsp of the fat (save it for stir-fries) and set the pork aside.",
          "煎香。五花肉放入乾鍋，以中火煎 5–6 分鐘並翻面，直到表面金黃、逼出油脂。只留 1 大匙油在鍋中（多餘的豬油可留著炒菜），把肉先盛起。",
        ],
        [
          "Caramelize the sugar. Add the sugar to the fat in the pot over low heat. Stir until it melts and turns amber, about 2 minutes. Watch closely, since it burns fast.",
          "炒糖色。轉小火，將糖放入鍋中的油裡，不停攪拌約 2 分鐘，直到糖融化並呈琥珀色。要專心看著，糖很容易燒焦。",
        ],
        [
          "Coat the pork. Return the pork and toss to coat it in the caramel. Add the ginger, scallions, star anise, soy sauce, dark soy sauce, and rice wine if using.",
          "上色。把五花肉放回鍋中翻炒，讓每塊都裹上糖色。加入薑片、蔥段、八角、醬油、老抽，以及米酒（若使用）。",
        ],
        [
          "Braise. Add water to just cover the pork and bring to a boil. Cover and simmer on low heat for 1 hour. Add the eggs halfway through.",
          "燉煮。加水至剛好蓋過肉，煮滾後蓋上鍋蓋，轉小火燉 1 小時。燉到一半時放入水煮蛋。",
        ],
        [
          "Reduce the sauce. Uncover, turn the heat to medium-high, and stir for 5–10 minutes until the sauce is thick and glossy and coats the pork. Serve with rice.",
          "收汁。打開鍋蓋，轉中大火，不時翻拌 5–10 分鐘，直到醬汁濃稠光亮、包覆在肉上。配白飯享用。",
        ],
      ],
    },

    "Congee": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["45 min", "45 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
      },
      intro: [
        "Plain, soft rice porridge: what you eat when you're sick, tired, or broke. Leftover rice cuts the cooking time in half, and a rice cooker's porridge setting does the work for you.",
        "清淡軟綿的白粥：生病、疲憊或手頭緊時最暖心的選擇。用剩飯來煮可以省下一半時間，電子鍋的煮粥模式更是輕鬆。",
      ],
      ingredients: [
        {
          group: ["Porridge", "粥底"],
          items: [
            ["Rice, ½ cup (or 1½ cups leftover cooked rice)", "白米 ½ 杯（或剩飯 1.5 杯）"],
            ["Water, 6 cups", "水 6 杯"],
            ["Ginger, 3 slices", "薑 3 片"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Chicken bouillon, ½ cube (optional)", "雞湯塊 ½ 塊（可省略）"],
          ],
        },
        {
          group: ["Toppings (pick any)", "配料（任選）"],
          items: [
            ["Scallions, chopped", "蔥花"],
            ["Soy sauce", "醬油"],
            ["Sesame oil", "香油"],
            ["White pepper", "白胡椒粉"],
            ["Eggs, 2 (stirred in or soft-boiled)", "雞蛋 2 顆（打入粥中或做成半熟蛋）"],
            ["Leftover chicken, shredded", "剩下的雞肉，撕成絲"],
            ["Roasted peanuts", "烤花生"],
          ],
        },
      ],
      steps: [
        [
          "Rinse the rice. Rinse the rice once and drain. If you have time, toss it with ½ tsp oil and a pinch of salt and let it sit 15 minutes. This helps the grains break down faster.",
          "洗米。白米洗一次後瀝乾。有時間的話，拌入 ½ 小匙油和一小撮鹽靜置 15 分鐘，米粒會更快煮開花。",
        ],
        [
          "Boil. Bring the water to a boil in a large pot. Add the rice and ginger, return to a boil, then lower to a gentle simmer with the lid slightly open.",
          "煮滾。大鍋中將水煮滾，放入米和薑片，再次煮滾後轉小火，鍋蓋留一點縫隙。",
        ],
        [
          "Simmer. Cook 45 minutes to 1 hour, stirring every 10 minutes and scraping the bottom so it doesn't stick, until the grains burst and the porridge is creamy. With leftover rice, 20–25 minutes is enough. In a rice cooker, use the porridge or congee setting.",
          "熬煮。小火煮 45 分鐘至 1 小時，每 10 分鐘攪拌一次並刮一下鍋底以免黏鍋，直到米粒開花、粥變得綿滑。用剩飯只需 20–25 分鐘。用電子鍋的話，選擇煮粥模式即可。",
        ],
        [
          "Season. Add the salt and the bouillon if using. If the congee is too thick, stir in hot water.",
          "調味。加鹽，以及雞湯塊（若使用）。如果太稠，加些熱水攪勻。",
        ],
        [
          "Top and serve. For silky egg ribbons, crack the eggs into the simmering pot and stir. Ladle into bowls and add your toppings.",
          "加料上桌。想要滑嫩蛋花，可把雞蛋直接打入微滾的粥中攪散。盛入碗中，加上喜歡的配料。",
        ],
      ],
    },

    "Twice-Cooked Pork": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["30 min", "30 分鐘"],
        servings: "2",
        spice: ["Medium", "中辣"],
        origin: "mainland",
      },
      intro: [
        "A Sichuan classic: pork belly is boiled first, then sliced thin and stir-fried with spicy bean paste and vegetables. Cabbage stretches the meat and soaks up the sauce.",
        "四川經典回鍋肉：五花肉先煮熟，再切薄片與辣豆瓣醬和蔬菜同炒。加入高麗菜不但份量更多，還能吸飽醬汁。",
      ],
      ingredients: [
        {
          group: ["Pork", "肉類"],
          items: [
            ["Pork belly, ½ lb, in one piece", "五花肉 ½ 磅，整塊"],
            ["Ginger, 3 slices", "薑 3 片"],
          ],
        },
        {
          group: ["Stir-fry", "快炒"],
          items: [
            ["Cabbage, ¼ head, torn into bite-size pieces", "高麗菜 ¼ 顆，用手撕成一口大小"],
            ["Green bell pepper, 1, cut into chunks", "青椒 1 顆，切塊"],
            ["Scallions, 3 stalks, cut into 2-inch sections", "青蔥 3 根，切成 5 公分段"],
            ["Garlic, 2 cloves, sliced", "蒜頭 2 瓣，切片"],
            ["Doubanjiang (spicy bean paste), 1½ tbsp", "辣豆瓣醬 1.5 大匙"],
            ["Soy sauce, 1 tsp", "醬油 1 小匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Cooking oil, 1 tbsp", "食用油 1 大匙"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Boil the pork. Cover the pork and ginger with water in a pot and simmer for 20 minutes, until a chopstick goes through easily. Let it cool. 15 minutes in the fridge makes it easier to slice.",
          "煮肉。五花肉與薑片放入鍋中，加水蓋過，小火煮 20 分鐘，直到筷子能輕鬆穿透。取出放涼，放冰箱 15 分鐘會更好切。",
        ],
        [
          "Slice. Cut the pork into thin slices, about ⅛ inch thick.",
          "切片。將五花肉切成約 0.3 公分的薄片。",
        ],
        [
          "Crisp the pork. Heat the oil in a pan over medium heat. Lay the slices flat and fry 3–4 minutes until the edges curl up and turn golden.",
          "煸肉。鍋中倒油以中火加熱，肉片平鋪下鍋，煎 3–4 分鐘，直到肉片邊緣捲起、呈金黃色。",
        ],
        [
          "Add the sauce. Push the pork to one side. Fry the doubanjiang and garlic in the oil for 30 seconds until the oil turns red, then toss everything together.",
          "炒醬。把肉推到一旁，在鍋中的油裡放入辣豆瓣醬與蒜片炒 30 秒，炒出紅油後與肉片拌勻。",
        ],
        [
          "Add the vegetables. Turn the heat to high. Add the cabbage and bell pepper and stir-fry for 2 minutes. Add the soy sauce, sugar, and scallions and toss for 30 more seconds. Serve with rice.",
          "下蔬菜。轉大火，放入高麗菜與青椒翻炒 2 分鐘。加入醬油、糖與蔥段，再炒 30 秒即可。配白飯享用。",
        ],
      ],
    },

    "Pork and Pepper Stir-fry": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "mainland",
      },
      intro: [
        "Qing jiao rou si: tender strips of pork with crisp green peppers. One of the fastest weeknight stir-fries, and a quick cornstarch marinade keeps even cheap cuts tender.",
        "青椒肉絲：嫩滑的肉絲配上爽脆青椒，是最快速的平日快炒之一。用玉米粉稍微醃一下，便宜的部位也能很嫩。",
      ],
      ingredients: [
        {
          group: ["Pork & Marinade", "肉絲與醃料"],
          items: [
            ["Pork shoulder or boneless pork chop, ½ lb, cut into thin strips", "梅花肉或去骨豬排 ½ 磅，切細絲"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Cornstarch, 1 tsp", "玉米粉 1 小匙"],
            ["Cooking oil, 1 tsp", "食用油 1 小匙"],
          ],
        },
        {
          group: ["Stir-fry", "快炒"],
          items: [
            ["Green bell peppers, 2, cut into thin strips", "青椒 2 顆，切細絲"],
            ["Garlic, 2 cloves, sliced", "蒜頭 2 瓣，切片"],
            ["Oyster sauce, 1 tbsp", "蠔油 1 大匙"],
            ["Sugar, ½ tsp", "糖 ½ 小匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
            ["Chili flakes, a pinch (optional)", "辣椒碎 少許（可省略）"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Marinate the pork. Tip: 15 minutes in the freezer makes pork much easier to slice thin. Mix the pork strips with the soy sauce, cornstarch, and 1 tsp oil and let sit 10 minutes.",
          "醃肉。小技巧：豬肉先冷凍 15 分鐘會更容易切細。肉絲加入醬油、玉米粉與 1 小匙油拌勻，醃 10 分鐘。",
        ],
        [
          "Cook the pork. Heat 1 tbsp oil in a pan over high heat. Spread out the pork and stir-fry 1–2 minutes until no longer pink. Take it out.",
          "炒肉絲。鍋中倒入 1 大匙油以大火加熱，放入肉絲撥散，炒 1–2 分鐘至變色後盛起。",
        ],
        [
          "Cook the peppers. Add the remaining oil, fry the garlic (and chili flakes if using) for 15 seconds, then add the peppers and stir-fry 1–2 minutes until bright green but still crisp.",
          "炒青椒。倒入剩下的油，放入蒜片（與辣椒碎，若使用）爆香 15 秒，再放入青椒絲炒 1–2 分鐘，炒到顏色翠綠但仍爽脆。",
        ],
        [
          "Combine. Return the pork, add the oyster sauce, sugar, and water, and toss 30 seconds until glossy. Serve over rice.",
          "拌炒。肉絲回鍋，加入蠔油、糖與水，翻炒 30 秒至醬汁光亮。配白飯享用。",
        ],
      ],
    },

    "Hainan Chicken Rice": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["45 min", "45 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "mainland",
      },
      intro: [
        "The Hainan original, Wenchang style: gently poached chicken, rice cooked in the chicken's own broth, and a ginger-scallion dip. Bone-in thighs cost less than a whole chicken and stay juicier.",
        "海南原味雞飯（文昌雞做法）：小火浸熟的雞肉、用雞湯煮成的香飯，再配上薑蔥醬。帶骨雞腿比整隻雞便宜，肉質也更多汁。",
      ],
      ingredients: [
        {
          group: ["Chicken", "雞肉"],
          items: [
            ["Bone-in, skin-on chicken thighs, 4 (about 1½ lbs)", "帶骨帶皮雞腿 4 隻（約 1.5 磅）"],
            ["Ginger, 5 slices", "薑 5 片"],
            ["Scallions, 2 stalks", "青蔥 2 根"],
            ["Salt, 1 tbsp", "鹽 1 大匙"],
          ],
        },
        {
          group: ["Rice", "雞油飯"],
          items: [
            ["Rice, 1½ cups, rinsed", "白米 1.5 杯，洗淨"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Ginger, 1 tsp, minced", "薑末 1 小匙"],
            ["Broth from poaching the chicken, in place of water", "煮雞的雞湯，取代煮飯的水"],
          ],
        },
        {
          group: ["Dipping Sauces", "沾醬"],
          items: [
            ["Ginger, 2 tbsp, finely minced", "薑 2 大匙，切成細末"],
            ["Scallions, 3 stalks, finely chopped", "青蔥 3 根，切成細蔥花"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Cooking oil, 3 tbsp", "食用油 3 大匙"],
            ["Soy sauce, 2 tbsp", "醬油 2 大匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Sugar, ½ tsp", "糖 ½ 小匙"],
          ],
        },
        {
          group: ["To Serve", "搭配"],
          items: [
            ["Cucumber, 1, sliced", "小黃瓜 1 條，切片"],
            ["Fresh cilantro (optional)", "香菜（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Poach the chicken. Put the thighs in a pot and cover with water by 1 inch. Add the ginger, scallions, and salt. Bring to a boil, then lower to a bare simmer for 5 minutes. Turn off the heat, cover, and let sit 20–25 minutes until cooked through (165°F / 74°C).",
          "浸雞。雞腿放入鍋中，加水蓋過約 2.5 公分，放入薑片、青蔥與鹽。煮滾後轉最小火微滾 5 分鐘，熄火蓋上鍋蓋燜 20–25 分鐘，直到熟透（中心溫度 74°C）。",
        ],
        [
          "Cool the chicken. Move the chicken to a bowl of ice water for 5 minutes. This firms up the skin and keeps it smooth. Save the broth.",
          "冰鎮。雞腿取出泡冰水 5 分鐘，讓雞皮緊實滑嫩。雞湯留著備用。",
        ],
        [
          "Make the rice. Heat 1 tbsp of oil (or trimmed chicken fat) in a pan and fry the garlic and ginger 1 minute until fragrant. Stir in the rice for 1 minute. Move it to the rice cooker, add the chicken broth in place of water, and cook as usual.",
          "煮雞油飯。鍋中加熱 1 大匙油（或修下來的雞皮雞油），放入蒜末和薑末炒 1 分鐘至香，再倒入白米拌炒 1 分鐘。移到電子鍋中，用雞湯代替水，照平常方式煮飯。",
        ],
        [
          "Make the ginger-scallion dip. Put the minced ginger, scallions, and salt in a heatproof bowl. Heat 3 tbsp oil until shimmering and pour it over (it will sizzle). Stir.",
          "做薑蔥醬。薑末、蔥花與鹽放入耐熱碗中。把 3 大匙油燒熱至微微冒煙，淋在上面（會滋滋作響），拌勻。",
        ],
        [
          "Make the soy dip. Stir together the soy sauce, sesame oil, and sugar.",
          "做醬油沾醬。將醬油、香油與糖拌勻。",
        ],
        [
          "Serve. Take the chicken off the bone and slice it. Serve with the rice, cucumber, cilantro, and both dips. Sip the leftover broth with some scallions as a soup.",
          "上桌。雞腿去骨切片，搭配雞油飯、小黃瓜、香菜與兩種沾醬。剩下的雞湯加點蔥花，就是一碗清湯。",
        ],
      ],
    },

    "Dumplings": {
      meta: {
        prep: ["40 min", "40 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "mainland",
      },
      intro: [
        "Pork and cabbage dumplings made with store-bought wrappers. This makes about 30. They freeze perfectly and cook straight from the freezer for a 10-minute meal.",
        "豬肉高麗菜水餃，用市售水餃皮輕鬆包，約可包 30 顆。冷凍保存效果極佳，不用解凍直接下鍋，十分鐘就能開飯。",
      ],
      ingredients: [
        {
          group: ["Filling", "內餡"],
          items: [
            ["Ground pork, ½ lb", "豬絞肉 ½ 磅"],
            ["Cabbage, 2 cups, finely chopped (about ¼ head)", "高麗菜 2 杯，切碎（約 ¼ 顆）"],
            ["Salt, ½ tsp (for the cabbage)", "鹽 ½ 小匙（醃高麗菜用）"],
            ["Scallions, 3 stalks, chopped", "青蔥 3 根，切蔥花"],
            ["Ginger, 1 tsp, minced", "薑末 1 小匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Sesame oil, 1 tbsp", "香油 1 大匙"],
            ["White pepper, ¼ tsp", "白胡椒粉 ¼ 小匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
          ],
        },
        {
          group: ["Wrappers", "餃子皮"],
          items: [
            ["Dumpling wrappers, 1 pack (about 30)", "水餃皮 1 包（約 30 張）"],
          ],
        },
        {
          group: ["Dipping Sauce", "沾醬"],
          items: [
            ["Soy sauce, 2 tbsp", "醬油 2 大匙"],
            ["Vinegar (Chinese black vinegar or rice vinegar), 1 tbsp", "醋（黑醋或米醋）1 大匙"],
            ["Garlic, 1 clove, minced", "蒜頭 1 瓣，切末"],
            ["Chili crisp or chili flakes (optional)", "辣油或辣椒碎（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Salt the cabbage. Toss the chopped cabbage with the salt and let it sit 10 minutes. Squeeze out as much water as you can.",
          "醃高麗菜。高麗菜碎拌入鹽，靜置 10 分鐘，再盡量擠乾水分。",
        ],
        [
          "Make the filling. Mix the pork with the soy sauce, ginger, and white pepper. Add the water 1 tbsp at a time, stirring in one direction until the pork is sticky. This keeps the filling juicy. Mix in the cabbage, scallions, and sesame oil.",
          "拌餡。豬絞肉加入醬油、薑末與白胡椒粉，再分次加入水，每次 1 大匙，朝同一方向攪拌至肉餡產生黏性，這樣內餡才會多汁。最後拌入高麗菜、蔥花與香油。",
        ],
        [
          "Fold. Put a heaping teaspoon of filling in the center of a wrapper. Wet the edge with water, fold it into a half-moon, and pinch or pleat it closed. Keep the wrappers and finished dumplings under a damp towel.",
          "包餃子。取一張水餃皮，中間放一小匙滿滿的餡料，邊緣沾水，對折成半月形，捏緊或打摺封口。水餃皮和包好的餃子都用濕布蓋著，以免乾掉。",
        ],
        [
          "Boil. Bring a large pot of water to a boil. Add the dumplings and stir gently so they don't stick. When it boils again, add 1 cup cold water. Repeat two more times. They're done when they float and puff up, about 6–8 minutes.",
          "煮水餃。大鍋水煮滾，放入水餃輕輕推動以免黏底。水再次滾時加入 1 杯冷水，重複這個動作兩次。水餃浮起並鼓起時就熟了，約 6–8 分鐘。",
        ],
        [
          "Or pan-fry them as potstickers. Heat 1 tbsp oil in a nonstick pan over medium heat. Add the dumplings flat side down and fry 2 minutes until golden. Add ⅓ cup water, cover, and cook 6–7 minutes until the water is gone and the bottoms are crisp.",
          "或做成鍋貼。不沾鍋倒入 1 大匙油以中火加熱，水餃平底朝下排好，煎 2 分鐘至底部金黃。加入 ⅓ 杯水，蓋上鍋蓋煎 6–7 分鐘，直到水分收乾、底部酥脆。",
        ],
        [
          "Freeze the extras. Freeze uncooked dumplings in a single layer on a tray until hard, then move them to a bag. Cook from frozen, adding 2–3 minutes.",
          "冷凍保存。多的生水餃平鋪在盤子上冷凍至變硬，再裝進保鮮袋。要吃時直接下鍋，烹煮時間多加 2–3 分鐘。",
        ],
      ],
    },

    "Taiwanese Popcorn Chicken": {
      meta: {
        prep: ["40 min", "40 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["Mild", "小辣"],
        origin: "taiwan",
      },
      intro: [
        "The night-market favorite: bite-size chicken marinated with garlic and five-spice, fried crispy, then tossed with basil and pepper salt. Shallow-frying in a regular pan works; no deep fryer needed.",
        "夜市人氣小吃鹹酥雞：一口大小的雞肉以蒜頭與五香粉醃過，炸到酥脆後拌上九層塔與胡椒鹽。用一般平底鍋半煎炸就行，不需要油炸鍋。",
      ],
      ingredients: [
        {
          group: ["Chicken & Marinade", "雞肉與醃料"],
          items: [
            ["Boneless, skinless chicken thighs, 1 lb, cut into bite-size pieces", "去骨去皮雞腿肉 1 磅，切成一口大小"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Five-spice powder, ½ tsp", "五香粉 ½ 小匙"],
            ["White pepper, ¼ tsp", "白胡椒粉 ¼ 小匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Egg, 1", "雞蛋 1 顆"],
          ],
        },
        {
          group: ["Coating & Frying", "裹粉與油炸"],
          items: [
            ["Cornstarch, ¾ cup (sweet potato starch is extra crunchy, if you have it)", "玉米粉 ¾ 杯（有地瓜粉的話會更酥脆）"],
            ["Cooking oil, about 1 cup, for shallow frying", "食用油 約 1 杯，半煎炸用"],
            ["Basil, a handful of leaves (Thai basil is traditional; optional)", "九層塔 一把（可省略，一般羅勒也可以）"],
          ],
        },
        {
          group: ["Pepper Salt", "胡椒鹽"],
          items: [
            ["Salt, 1 tsp", "鹽 1 小匙"],
            ["White pepper, ½ tsp", "白胡椒粉 ½ 小匙"],
            ["Five-spice powder, ¼ tsp", "五香粉 ¼ 小匙"],
            ["Chili flakes, a pinch (optional)", "辣椒碎 少許（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Marinate. Mix the chicken with the soy sauce, garlic, five-spice, white pepper, sugar, and egg. Let it sit at least 30 minutes, or overnight in the fridge.",
          "醃雞肉。雞肉加入醬油、蒜末、五香粉、白胡椒粉、糖與雞蛋拌勻，醃至少 30 分鐘，或放冰箱醃一晚。",
        ],
        [
          "Coat. Toss the chicken in the cornstarch until every piece is covered, pressing it on. Let it rest 5 minutes until the coating looks damp; this helps it stick.",
          "裹粉。雞肉放入玉米粉中翻拌，讓每塊都均勻沾上並稍微壓緊。靜置 5 分鐘，等粉看起來有點反潮，炸的時候才不易脫落。",
        ],
        [
          "Fry. Heat ½ inch of oil in a pan to 350°F (175°C); a wooden chopstick dipped in should bubble steadily. Fry in batches for 4–5 minutes, turning, until golden and cooked through. Drain on paper towels. (Air fryer: spray with oil and cook at 400°F / 200°C for 12–15 minutes, shaking halfway.)",
          "油炸。平底鍋倒入約 1 公分高的油，加熱至 175°C（插入木筷會持續冒泡）。分批下鍋炸 4–5 分鐘並翻面，至金黃熟透，取出放在廚房紙巾上瀝油。（氣炸鍋：噴少許油，200°C 烤 12–15 分鐘，中途翻動。）",
        ],
        [
          "Fry the basil. Turn off the heat and drop the basil into the hot oil for 5 seconds. Stand back, since it spatters. Scoop it out.",
          "炸九層塔。熄火，把九層塔放入熱油中炸 5 秒後撈起。小心油會噴濺，人要站遠一點。",
        ],
        [
          "Season. Mix the pepper salt ingredients and toss with the chicken and basil. Eat hot.",
          "調味。胡椒鹽材料混合後，與雞肉和九層塔拌勻，趁熱享用。",
        ],
      ],
    },

    "Lu Rou Fan (Braised Pork Rice)": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["1 hr", "1 小時"],
        servings: "4",
        spice: ["None", "不辣"],
        origin: "taiwan",
      },
      intro: [
        "Taiwan's ultimate comfort food: finely chopped pork belly braised in soy sauce and five-spice, spooned over rice. One pot covers four meals and tastes even better the next day.",
        "台灣國民美食滷肉飯：切碎的五花肉以醬油與五香慢滷，淋在白飯上。一鍋可以吃四餐，隔天吃更入味。",
      ],
      ingredients: [
        {
          group: ["Braised Pork", "滷肉"],
          items: [
            ["Pork belly, 1 lb, diced into small ¼-inch pieces (or ground pork for a cheaper, faster version)", "五花肉 1 磅，切成約 0.5 公分小丁（或用豬絞肉，更便宜也更快）"],
            ["Onion, ½, finely chopped (or 4 shallots)", "洋蔥 ½ 顆，切碎（或紅蔥頭 4 顆）"],
            ["Garlic, 4 cloves, minced", "蒜頭 4 瓣，切末"],
            ["Soy sauce, ¼ cup", "醬油 ¼ 杯"],
            ["Dark soy sauce, 1 tbsp", "老抽 1 大匙"],
            ["Sugar, 1½ tbsp", "糖 1.5 大匙"],
            ["Rice wine, 2 tbsp (optional)", "米酒 2 大匙（可省略）"],
            ["Five-spice powder, ½ tsp", "五香粉 ½ 小匙"],
            ["Star anise, 1 pod", "八角 1 顆"],
            ["White pepper, ¼ tsp", "白胡椒粉 ¼ 小匙"],
            ["Water, 2 cups", "水 2 杯"],
            ["Eggs, 4, hard-boiled and peeled", "雞蛋 4 顆，水煮後剝殼"],
            ["Fried shallots, 2 tbsp (optional, store-bought)", "油蔥酥 2 大匙（可省略，市售即可）"],
          ],
        },
        {
          group: ["To Serve", "搭配"],
          items: [
            ["Steamed rice", "白飯"],
            ["Bok choy, blanched (optional)", "燙青江菜（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Cut the pork. Freeze the pork belly for 20 minutes to firm it up, then dice it into small pieces.",
          "切肉。五花肉先冷凍 20 分鐘變硬，再切成小丁。",
        ],
        [
          "Render the fat. Cook the pork in a dry pot over medium heat for 8–10 minutes, stirring, until the fat melts out and the edges turn golden.",
          "煸出油脂。五花肉丁放入乾鍋，以中火翻炒 8–10 分鐘，直到逼出油脂、邊緣微焦。",
        ],
        [
          "Cook the aromatics. Add the onion (or shallots) and garlic and cook 3–4 minutes until soft and golden.",
          "爆香。加入洋蔥（或紅蔥頭）與蒜末，炒 3–4 分鐘至軟化、呈金黃色。",
        ],
        [
          "Season. Add the soy sauce, dark soy sauce, sugar, rice wine if using, five-spice, star anise, and white pepper. Stir for 1 minute.",
          "調味。加入醬油、老抽、糖、米酒（若使用）、五香粉、八角與白胡椒粉，拌炒 1 分鐘。",
        ],
        [
          "Braise. Add the water and the eggs and bring to a boil. Cover and simmer on low for 45 minutes to 1 hour, stirring now and then and turning the eggs. Stir in the fried shallots for the last 10 minutes. If the sauce is thin, simmer uncovered until glossy.",
          "滷製。加入水和水煮蛋煮滾，蓋上鍋蓋轉小火滷 45 分鐘至 1 小時，偶爾攪拌並翻動滷蛋。最後 10 分鐘拌入油蔥酥。若醬汁太稀，打開鍋蓋續煮至濃稠光亮。",
        ],
        [
          "Serve. Spoon the pork and sauce over a bowl of rice. Add half an egg and some greens on the side.",
          "上桌。在白飯上淋上滷肉與醬汁，旁邊放半顆滷蛋與燙青菜。",
        ],
      ],
    },

    "Beef Noodle Soup": {
      meta: {
        prep: ["20 min", "20 分鐘"],
        cook: ["2 hrs", "2 小時"],
        servings: "4",
        spice: ["Medium", "中辣"],
        origin: "taiwan",
      },
      intro: [
        "Taiwan's beloved red-braised beef noodle soup: tender beef simmered in a spicy, soy-rich broth over chewy wheat noodles. Chuck roast works as well as shank and is often cheaper.",
        "台灣經典紅燒牛肉麵：軟嫩牛肉在香辣濃郁的醬油湯頭中慢燉，搭配Q彈麵條。牛肩肉和牛腱一樣好吃，而且通常更便宜。",
      ],
      ingredients: [
        {
          group: ["Broth & Aromatics", "湯底與辛香料"],
          items: [
            ["Ginger, 5 slices", "薑 5 片"],
            ["Garlic, 6 cloves, smashed", "蒜頭 6 瓣，拍碎"],
            ["Scallions, 4 stalks, cut into sections", "青蔥 4 根，切段"],
            ["Star anise, 3 pods", "八角 3 顆"],
            ["Sichuan peppercorns, 1 tsp (optional)", "花椒 1 小匙（可省略）"],
            ["Doubanjiang (spicy bean paste), 2 tbsp", "辣豆瓣醬 2 大匙"],
            ["Soy sauce, ⅓ cup", "醬油 ⅓ 杯"],
            ["Dark soy sauce, 1 tbsp", "老抽 1 大匙"],
            ["Rice wine, ¼ cup (optional)", "米酒 ¼ 杯（可省略）"],
            ["Sugar, 1 tbsp", "糖 1 大匙"],
            ["Tomatoes, 2, cut into wedges", "番茄 2 顆，切塊"],
            ["Water, 10 cups", "水 10 杯"],
          ],
        },
        {
          group: ["Meat & Noodles", "肉類與麵條"],
          items: [
            ["Beef shank or chuck, 2 lbs, cut into 1½-inch chunks", "牛腱或牛肩肉 2 磅，切成約 4 公分塊狀"],
            ["Wheat or egg noodles, 1 lb fresh or ¾ lb dried", "麵條或雞蛋麵，新鮮 1 磅或乾麵 ¾ 磅"],
          ],
        },
        {
          group: ["Toppings & Garnish", "配料與裝飾"],
          items: [
            ["Bok choy, 4 heads", "青江菜 4 棵"],
            ["Scallions, chopped", "蔥花"],
            ["Fresh cilantro (optional)", "香菜（可省略）"],
            ["Pickled mustard greens, chopped (optional)", "酸菜，切碎（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Blanch the beef. Put the beef in a pot of cold water, bring it to a boil, and cook for 3 minutes until the scum rises. Drain and rinse the beef under warm water.",
          "汆燙牛肉。將牛肉放入冷水鍋中，煮滾後再煮 3 分鐘，直到浮沫出現。撈起後用溫水沖洗乾淨。",
        ],
        [
          "Sauté the aromatics and bean paste. Heat 2 tbsp oil in a large pot over medium heat. Fry the ginger, garlic, scallions, star anise, and Sichuan peppercorns (if using) for about 2 minutes, until fragrant. Add the doubanjiang and stir-fry for 1 minute, until the oil turns red.",
          "爆香辛香料與豆瓣醬。大鍋中倒入 2 大匙油，以中火加熱。放入薑、蒜、蔥段、八角與花椒（若使用），炒約 2 分鐘至香氣出來。加入辣豆瓣醬拌炒 1 分鐘，直到油色轉紅。",
        ],
        [
          "Coat the beef. Add the beef and tomatoes, then pour in the soy sauce, dark soy sauce, and rice wine if using. Stir until the beef is evenly coated and lightly browned.",
          "牛肉上色。放入牛肉與番茄，淋上醬油、老抽，以及米酒（若使用），翻炒至牛肉均勻上色。",
        ],
        [
          "Braise. Add the water and sugar and bring to a boil. Cover and simmer on low heat for 1½ to 2 hours, until the beef is tender. Skim off the fat and add salt to taste.",
          "燉煮。加入水與糖煮滾，蓋上鍋蓋轉小火燉 1.5 至 2 小時，直到牛肉軟嫩。撈除浮油，再依口味加鹽調味。",
        ],
        [
          "Cook the noodles and greens. In a separate pot of boiling water, cook the noodles following the package directions. Add the bok choy for the last 30 seconds, then drain everything.",
          "煮麵與燙青菜。另起一鍋滾水，依包裝指示煮麵。起鍋前 30 秒放入青江菜，一起撈起瀝乾。",
        ],
        [
          "Assemble the bowl. Put the noodles in a bowl and ladle the hot broth over them. Top with beef, bok choy, scallions, and cilantro and pickled mustard greens if you have them. Leftover broth and beef keep well in the fridge for 4 days.",
          "組合麵碗。將麵條放入碗中，淋上熱湯，再擺上牛肉、青江菜與蔥花，有的話可再加香菜與酸菜。剩下的湯和牛肉冷藏可保存 4 天。",
        ],
      ],
    },

    "Garlic Smashed Cucumbers": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["None", "免開火"],
        servings: "2",
        spice: ["Mild", "小辣"],
        origin: "mainland",
      },
      intro: [
        "A cold, crunchy, garlicky side that takes 15 minutes and no stove. Smashing the cucumbers gives them rough edges that soak up the dressing.",
        "清爽脆口又蒜香十足的涼菜，15 分鐘完成、不用開火。把小黃瓜拍裂，粗糙的切面更能吸附醬汁。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Cucumbers, 1 large or 3–4 small", "小黃瓜 3–4 條（或大黃瓜 1 條）"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Vinegar (Chinese black vinegar or rice vinegar), 1½ tbsp", "醋（黑醋或米醋）1.5 大匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Chili crisp or chili flakes, 1 tsp (optional)", "辣油或辣椒碎 1 小匙（可省略）"],
            ["Fresh cilantro (optional)", "香菜（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Smash. Lay a cucumber on a cutting board and press or whack it with the flat side of a knife (or a rolling pin) until it cracks open. Cut it into bite-size chunks.",
          "拍黃瓜。小黃瓜放在砧板上，用菜刀側面（或擀麵棍）用力拍打，直到裂開，再切成一口大小。",
        ],
        [
          "Salt. Toss the cucumbers with the salt in a bowl and let sit 10 minutes. Pour off the water that collects. This keeps them crunchy and stops the dish from getting watery.",
          "鹽漬。小黃瓜放入碗中加鹽拌勻，靜置 10 分鐘，倒掉滲出的水分。這樣能保持爽脆，也不會讓醬汁變得水水的。",
        ],
        [
          "Make the dressing. Stir together the garlic, vinegar, soy sauce, sugar, sesame oil, and chili.",
          "調醬汁。將蒜末、醋、醬油、糖、香油與辣椒拌勻。",
        ],
        [
          "Toss and serve. Pour the dressing over the cucumbers and toss. Top with cilantro if you like. Serve right away or chill 15 minutes. Best eaten the same day.",
          "拌勻上桌。醬汁淋在小黃瓜上拌勻，喜歡的話撒上香菜。可以馬上吃，或冷藏 15 分鐘更入味。最好當天吃完。",
        ],
      ],
    },

    "Stir-fried Cabbage with Bacon": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "taiwan",
      },
      intro: [
        "A favorite at Taiwanese homes and stir-fry restaurants. Just a few strips of bacon flavor a whole pan of sweet, crisp cabbage, and the bacon fat means no extra oil.",
        "台灣家常與熱炒店的人氣菜色。只要幾片培根，就能讓一整盤清甜爽脆的高麗菜香氣十足，培根逼出的油也省下了炒菜油。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Cabbage, ½ head (about 1 lb)", "高麗菜 ½ 顆（約 1 磅）"],
            ["Bacon, 3 strips, cut into 1-inch pieces", "培根 3 片，切成 2.5 公分段"],
            ["Garlic, 3 cloves, sliced", "蒜頭 3 瓣，切片"],
            ["Chili flakes, a pinch (optional)", "辣椒碎 少許（可省略）"],
            ["Soy sauce, 1 tsp", "醬油 1 小匙"],
            ["Salt, ¼ tsp, or to taste", "鹽 ¼ 小匙，依口味調整"],
            ["Water or rice wine, 2 tbsp", "水或米酒 2 大匙"],
          ],
        },
      ],
      steps: [
        [
          "Prep the cabbage. Tear the cabbage by hand into bite-size pieces (torn edges hold the sauce better) and discard the hard core. Rinse and drain.",
          "處理高麗菜。用手把高麗菜撕成一口大小（撕的比切的更能吸附醬汁），去掉硬梗，洗淨瀝乾。",
        ],
        [
          "Cook the bacon. Put the bacon in a cold pan and cook over medium heat for 4–5 minutes until browned and the fat has melted out.",
          "煸培根。培根放入冷鍋，以中火煎 4–5 分鐘，直到上色並逼出油脂。",
        ],
        [
          "Add the garlic. Add the garlic and chili flakes and cook 30 seconds until fragrant.",
          "爆香。加入蒜片與辣椒碎，炒 30 秒至香氣出來。",
        ],
        [
          "Stir-fry the cabbage. Turn the heat to high, add the cabbage, and toss for 2 minutes. Splash the water or rice wine around the edge of the pan, cover, and cook 1 minute.",
          "炒高麗菜。轉大火，放入高麗菜翻炒 2 分鐘。沿鍋邊淋入水或米酒，蓋上鍋蓋燜 1 分鐘。",
        ],
        [
          "Season. Uncover, add the soy sauce and salt, and toss 1–2 minutes more until the cabbage is tender but still crisp.",
          "調味。打開鍋蓋，加入醬油與鹽，再炒 1–2 分鐘，至高麗菜變軟但仍保持脆度。",
        ],
      ],
    },

    "Cheese Egg Crepe": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "taiwan",
      },
      intro: [
        "Dan bing, the Taiwanese breakfast-shop staple: a thin, chewy crepe rolled up with egg and melted cheese. The batter is just flour, cornstarch, and water.",
        "蛋餅是台灣早餐店的招牌：薄而Q彈的餅皮捲著蛋與融化的起司。麵糊只需要麵粉、玉米粉和水。",
      ],
      ingredients: [
        {
          group: ["Crepe Batter", "餅皮麵糊"],
          items: [
            ["All-purpose flour, ½ cup", "中筋麵粉 ½ 杯"],
            ["Cornstarch, 2 tbsp", "玉米粉 2 大匙"],
            ["Water, ¾ cup", "水 ¾ 杯"],
            ["Salt, a pinch", "鹽 少許"],
            ["Scallions, 2 stalks, chopped", "青蔥 2 根，切蔥花"],
            ["Shortcut: 2 flour tortillas in place of the batter", "偷吃步：用 2 張墨西哥餅皮代替麵糊"],
          ],
        },
        {
          group: ["Filling", "內餡"],
          items: [
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Cheese slices, 2", "起司片 2 片"],
            ["Cooking oil, 4 tsp", "食用油 4 小匙"],
            ["Soy sauce or chili sauce, for dipping", "醬油或辣椒醬，沾食用"],
          ],
        },
      ],
      steps: [
        [
          "Make the batter. Whisk the flour, cornstarch, salt, and water until smooth. Stir in half the scallions. Let it rest 5 minutes.",
          "調麵糊。麵粉、玉米粉、鹽與水攪拌至無顆粒，拌入一半的蔥花，靜置 5 分鐘。",
        ],
        [
          "Cook the crepes. Heat 1 tsp oil in a nonstick pan over medium heat. Pour in half the batter and swirl to make a thin circle. Cook 1–2 minutes until set and the edges lift, flip, and cook 30 seconds more. Take it out and repeat with the rest of the batter.",
          "煎餅皮。不沾鍋倒入 1 小匙油以中火加熱，倒入一半麵糊，轉動鍋子讓麵糊攤成薄圓片。煎 1–2 分鐘至定型、邊緣翹起後翻面，再煎 30 秒取出。用剩下的麵糊重複一次。",
        ],
        [
          "Add the egg. For each crepe, beat 1 egg with a pinch of salt and some of the remaining scallions. Heat 1 tsp oil, pour in the egg, and right away lay a crepe on top of the wet egg. Press down and cook 1 minute until the egg sets and sticks to the crepe.",
          "加蛋。每張餅皮用 1 顆蛋，加少許鹽與剩下的蔥花打散。鍋中加熱 1 小匙油，倒入蛋液後立刻把餅皮蓋在未凝固的蛋上，壓一壓，煎 1 分鐘讓蛋凝固並黏在餅皮上。",
        ],
        [
          "Add the cheese and roll. Flip so the egg side is up. Lay a cheese slice on top and roll it up with a spatula. Cook 30 seconds on each side until the cheese melts.",
          "放起司捲起。翻面讓蛋朝上，放上一片起司，用鍋鏟捲起來，每面再煎 30 秒至起司融化。",
        ],
        [
          "Serve. Cut into 1-inch pieces and serve with soy sauce or chili sauce for dipping.",
          "上桌。切成約 2.5 公分小段，搭配醬油或辣椒醬享用。",
        ],
      ],
    },

    "Baked BBQ Pork (Char Siu)": {
      meta: {
        prep: ["15 min + marinating", "15 分鐘＋醃製時間"],
        cook: ["35 min", "35 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "hong-kong",
      },
      intro: [
        "Cantonese roast pork with a sticky-sweet glaze, made with pork shoulder, one of the cheapest cuts there is. Leftovers are great in fried rice, noodles, and rice rolls.",
        "廣式叉燒：甜蜜黏亮的醬汁包裹著梅花肉，而梅花肉正是最便宜的部位之一。吃不完的叉燒拿來炒飯、拌麵或包腸粉都很適合。",
      ],
      ingredients: [
        {
          group: ["Pork", "肉類"],
          items: [
            ["Pork shoulder, 1 lb, cut into strips about 2 inches wide and 1 inch thick", "梅花肉 1 磅，切成寬約 5 公分、厚約 2.5 公分的長條"],
          ],
        },
        {
          group: ["Marinade & Glaze", "醃醬與刷醬"],
          items: [
            ["Hoisin sauce, 3 tbsp", "海鮮醬 3 大匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Dark soy sauce, 1 tsp", "老抽 1 小匙"],
            ["Honey, 3 tbsp (1 for the marinade, 2 for the glaze)", "蜂蜜 3 大匙（1 大匙醃肉，2 大匙刷醬）"],
            ["Sugar, 1 tbsp", "糖 1 大匙"],
            ["Five-spice powder, ½ tsp", "五香粉 ½ 小匙"],
            ["Garlic, 2 cloves, minced", "蒜頭 2 瓣，切末"],
            ["Rice wine, 1 tbsp (optional)", "米酒 1 大匙（可省略）"],
            ["Red food coloring, a few drops (optional, for the classic color)", "紅色食用色素 幾滴（可省略，讓顏色更道地）"],
          ],
        },
      ],
      steps: [
        [
          "Marinate. Mix the hoisin, soy sauce, dark soy sauce, 1 tbsp honey, sugar, five-spice, garlic, rice wine, and food coloring if using. Set aside 3 tbsp in the fridge for basting. Coat the pork with the rest and refrigerate at least 2 hours, or overnight.",
          "醃肉。海鮮醬、醬油、老抽、1 大匙蜂蜜、糖、五香粉、蒜末、米酒與色素（若使用）拌勻。先取出 3 大匙放冰箱留著刷醬，其餘與豬肉拌勻，冷藏醃至少 2 小時或一整晚。",
        ],
        [
          "Prepare the oven. Preheat the oven to 400°F (200°C). Line a baking sheet with foil and pour in ½ cup water so the drippings don't burn. Set the pork on a rack over the pan if you have one, or straight on the foil.",
          "預熱烤箱。烤箱預熱至 200°C。烤盤鋪上鋁箔紙並倒入 ½ 杯水，避免滴下的醬汁烤焦。有烤架的話把肉放在架上，沒有就直接放在鋁箔紙上。",
        ],
        [
          "Roast. Roast 15 minutes, flip the pork, and roast 10 minutes more.",
          "烤肉。烤 15 分鐘後翻面，再烤 10 分鐘。",
        ],
        [
          "Glaze. Mix the saved marinade with 2 tbsp honey and brush it over the pork. Roast 5–10 minutes more until the edges caramelize and char a little. The pork is done at 145°F (63°C).",
          "刷醬。把預留的醃醬與 2 大匙蜂蜜混合，刷在肉上，再烤 5–10 分鐘，直到邊緣焦糖化、微微焦黑。中心溫度達 63°C 即熟。",
        ],
        [
          "Rest and slice. Let it rest 5 minutes, then slice and spoon the pan juices over it.",
          "靜置切片。靜置 5 分鐘後切片，淋上烤盤裡的醬汁。",
        ],
        [
          "No oven? Put the pork, all the marinade, and ½ cup water in a covered pan and simmer 20 minutes, turning once. Uncover and cook, turning, until the sauce reduces to a sticky glaze. (Air fryer: 375°F / 190°C for 20 minutes, flipping halfway, glazing for the last 5.)",
          "沒有烤箱？把豬肉、所有醃醬與 ½ 杯水放入平底鍋，蓋上鍋蓋小火燜煮 20 分鐘，中途翻面一次。打開鍋蓋繼續翻煮，直到醬汁收成黏稠的醬色。（氣炸鍋：190°C 烤 20 分鐘，中途翻面，最後 5 分鐘刷醬。）",
        ],
      ],
    },

    "HK Soy Sauce Noodles": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "hong-kong",
      },
      intro: [
        "The simplest noodle dish at dim sum: thin egg noodles tossed in a hot pan with soy sauce, bean sprouts, and onion. With so few ingredients, it's one of the cheapest meals on this site.",
        "港式點心的經典豉油皇炒麵：細雞蛋麵與豆芽、洋蔥和醬油大火快炒。材料簡單，是本站最省錢的料理之一。",
      ],
      ingredients: [
        {
          group: ["Noodles & Vegetables", "麵條與蔬菜"],
          items: [
            ["Thin egg noodles, ½ lb (Hong Kong pan-fry or chow mein noodles)", "細雞蛋麵 ½ 磅（港式炒麵或廣東炒麵用麵條）"],
            ["Bean sprouts, 2 cups", "豆芽菜 2 杯"],
            ["Onion, ½, thinly sliced", "洋蔥 ½ 顆，切細絲"],
            ["Scallions, 3 stalks, cut into 2-inch lengths", "青蔥 3 根，切成 5 公分段"],
            ["Cooking oil, 3 tbsp", "食用油 3 大匙"],
          ],
        },
        {
          group: ["Sauce", "醬汁"],
          items: [
            ["Soy sauce, 1½ tbsp", "醬油 1.5 大匙"],
            ["Dark soy sauce, 1 tbsp", "老抽 1 大匙"],
            ["Oyster sauce, 1 tsp", "蠔油 1 小匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
          ],
        },
      ],
      steps: [
        [
          "Cook the noodles. Boil the noodles about 1 minute (or 1 minute less than the package says). Drain, rinse with cold water, and shake them very dry. Toss with 1 tsp oil. Dry noodles get crispy; wet noodles get soggy.",
          "煮麵。麵條煮約 1 分鐘（或比包裝建議少 1 分鐘），撈起用冷水沖洗，徹底甩乾後拌入 1 小匙油。麵條越乾越能炒得香脆。",
        ],
        [
          "Mix the sauce. Stir all the sauce ingredients together.",
          "調醬汁。將所有醬汁材料拌勻。",
        ],
        [
          "Crisp the noodles. Heat 2 tbsp oil in a large pan over high heat. Spread out the noodles and leave them alone 1–2 minutes to crisp. Flip and toss.",
          "煎麵。大平底鍋倒入 2 大匙油以大火加熱，把麵條攤開，靜置 1–2 分鐘不要翻動，煎到微脆後翻面拌炒。",
        ],
        [
          "Add the vegetables. Push the noodles aside, add the remaining oil, and fry the onion for 1 minute. Add the bean sprouts and the white parts of the scallions.",
          "下蔬菜。把麵推到一旁，倒入剩下的油，放入洋蔥炒 1 分鐘，再加入豆芽菜與蔥白段。",
        ],
        [
          "Toss with the sauce. Pour in the sauce and toss with tongs or chopsticks for 1–2 minutes until the noodles are evenly brown and the sprouts just wilt. Add the scallion greens and serve.",
          "拌炒醬汁。倒入醬汁，用夾子或筷子翻炒 1–2 分鐘，直到麵條均勻上色、豆芽剛好變軟。加入蔥綠段即可上桌。",
        ],
      ],
    },

    "HK Macaroni Soup": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "hong-kong",
      },
      intro: [
        "The Hong Kong cha chaan teng breakfast: macaroni in light chicken broth with ham and a fried egg. Comfort food made entirely from pantry staples.",
        "港式茶餐廳早餐火腿通粉：清淡雞湯裡的通心粉，加上火腿與煎蛋。全用家中常備食材就能做出的療癒早餐。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Macaroni, 1 cup (about 4 oz)", "通心粉 1 杯（約 4 盎司）"],
            ["Water, 4 cups (for the broth)", "水 4 杯（煮湯用）"],
            ["Chicken bouillon, 1 cube", "雞湯塊 1 塊"],
            ["Ham, 4 slices, cut into strips (or Spam)", "火腿 4 片，切條（或午餐肉）"],
            ["Frozen mixed vegetables, ½ cup", "冷凍綜合蔬菜 ½ 杯"],
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Cooking oil, 1 tsp", "食用油 1 小匙"],
            ["White pepper, a pinch", "白胡椒粉 少許"],
            ["Sesame oil, a few drops", "香油 幾滴"],
            ["Scallions, chopped (optional)", "蔥花（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Cook the macaroni. Boil the macaroni following the package directions until soft (Hong Kong style is softer than al dente). Drain.",
          "煮通心粉。依包裝指示將通心粉煮軟（港式口感比義式的彈牙更軟一點），撈起瀝乾。",
        ],
        [
          "Make the broth. In the same pot, bring the 4 cups water and bouillon to a boil. Add the ham and frozen vegetables and simmer 3 minutes.",
          "煮湯。同一個鍋子加入 4 杯水與雞湯塊煮滾，放入火腿與冷凍蔬菜，煮 3 分鐘。",
        ],
        [
          "Fry the eggs. Heat the oil in a pan and fry the eggs sunny side up until the edges are crispy.",
          "煎蛋。平底鍋加熱油，煎兩顆荷包蛋，煎到邊緣酥脆。",
        ],
        [
          "Assemble. Divide the macaroni between two bowls and ladle the broth, ham, and vegetables over it. Top each with a fried egg, white pepper, a few drops of sesame oil, and scallions. Buttered toast on the side makes it a full cha chaan teng set.",
          "組合。通心粉分裝兩碗，舀入湯、火腿與蔬菜，各放上一顆荷包蛋，撒白胡椒粉、滴幾滴香油、撒蔥花。旁邊配一片牛油吐司，就是完整的茶餐廳早餐。",
        ],
      ],
    },

    "Clay Pot Rice": {
      meta: {
        prep: ["40 min", "40 分鐘"],
        cook: ["30 min", "30 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "hong-kong",
      },
      intro: [
        "Cantonese clay pot rice without the clay pot: marinated chicken cooks right on top of the rice, and a heavy pot gives you the prized crispy bottom. A rice cooker works too.",
        "不用砂鍋也能做煲仔飯：醃好的雞肉直接鋪在米飯上一起煮，用厚底鍋還能做出最受歡迎的焦香鍋巴。用電子鍋也可以。",
      ],
      ingredients: [
        {
          group: ["Rice", "米飯"],
          items: [
            ["Rice, 1 cup", "白米 1 杯"],
            ["Water, 1 cup + 2 tbsp", "水 1 杯＋2 大匙"],
            ["Cooking oil, 1 tbsp + 1 tsp", "食用油 1 大匙＋1 小匙"],
          ],
        },
        {
          group: ["Chicken & Toppings", "雞肉與配料"],
          items: [
            ["Boneless chicken thighs, ½ lb, cut into bite-size pieces", "去骨雞腿肉 ½ 磅，切成一口大小"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Oyster sauce, 1 tsp", "蠔油 1 小匙"],
            ["Cornstarch, 1 tsp", "玉米粉 1 小匙"],
            ["Ginger, 1 tsp, minced", "薑末 1 小匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Chinese sausage, 1, thinly sliced, or 2 strips bacon (optional)", "臘腸 1 條切薄片，或培根 2 片（可省略）"],
            ["Bok choy, 2 heads, halved", "青江菜 2 棵，對半切"],
            ["Scallions, chopped", "蔥花"],
          ],
        },
        {
          group: ["Sauce", "醬汁"],
          items: [
            ["Soy sauce, 1½ tbsp", "醬油 1.5 大匙"],
            ["Dark soy sauce, 1 tsp", "老抽 1 小匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Hot water, 2 tbsp", "熱水 2 大匙"],
          ],
        },
      ],
      steps: [
        [
          "Soak the rice and marinate the chicken. Rinse the rice and soak it in the measured water for 30 minutes so it cooks evenly. Meanwhile, mix the chicken with the soy sauce, oyster sauce, cornstarch, ginger, and sesame oil.",
          "泡米與醃雞肉。白米洗淨，用量好的水浸泡 30 分鐘，煮起來會更均勻。同時將雞肉與醬油、蠔油、玉米粉、薑末和香油拌勻醃著。",
        ],
        [
          "Start the rice. Brush the bottom and sides of a heavy pot with 1 tbsp oil. Add the rice with its soaking water and bring to a boil over medium-high heat. Stir once, cover, and cook on low for 8 minutes, until most of the water is absorbed and small holes appear on the surface.",
          "煮飯。厚底鍋的鍋底與內壁刷上 1 大匙油，倒入米和泡米水，以中大火煮滾。攪拌一次後蓋上鍋蓋，轉小火煮 8 分鐘，直到水分大多被吸收、表面出現小洞。",
        ],
        [
          "Add the toppings. Quickly spread the chicken and sausage (or bacon) over the rice. Cover and cook on low for 10–12 minutes more, until the chicken is cooked through.",
          "鋪料。迅速將雞肉與臘腸（或培根）鋪在米飯上，蓋上鍋蓋，小火再煮 10–12 分鐘，直到雞肉熟透。",
        ],
        [
          "Crisp the bottom. Drizzle 1 tsp oil around the edge of the pot. Turn the heat to medium for 2–3 minutes, rotating the pot, until you hear crackling. Turn off the heat and leave it covered 5 minutes. Meanwhile, blanch the bok choy in boiling water for 1 minute.",
          "做鍋巴。沿著鍋邊淋入 1 小匙油，轉中火 2–3 分鐘並轉動鍋子，聽到滋滋聲即可。熄火後蓋著燜 5 分鐘。同時把青江菜放入滾水燙 1 分鐘。",
        ],
        [
          "Sauce and serve. Mix the sauce and pour it over the rice. Add the bok choy and scallions, then stir from the bottom so the crispy bits mix in.",
          "淋醬上桌。醬汁拌勻後淋在飯上，放上青江菜與蔥花，從鍋底翻拌，讓香脆的鍋巴拌進飯裡。",
        ],
        [
          "Rice cooker version. Put the soaked rice and water in the rice cooker and start it. When it's about halfway done (or right at the start, if your cooker can't be opened), spread the chicken and sausage on top. Skip the crispy-bottom step.",
          "電子鍋做法。將泡好的米和水放入電子鍋開始煮，煮到一半時（如果中途不能開蓋，就一開始就放）鋪上雞肉與臘腸。這個做法省略鍋巴步驟。",
        ],
      ],
    },

    "Cheung Fun (Steamed Rice Rolls)": {
      meta: {
        prep: ["20 min", "20 分鐘"],
        cook: ["20 min", "20 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "hong-kong",
      },
      intro: [
        "Silky steamed rice rolls from the dim sum cart, made at home with rice flour and a pan set inside a covered pot. Fill them with shrimp, leftover char siu, or just scallions.",
        "港式點心的滑嫩腸粉，在家用在來米粉，加上放進有蓋大鍋裡的烤盤就能蒸。內餡可以放蝦仁、吃剩的叉燒，或只撒蔥花。",
      ],
      ingredients: [
        {
          group: ["Batter", "粉漿"],
          items: [
            ["Rice flour, ½ cup (regular, not glutinous)", "在來米粉 ½ 杯（不是糯米粉）"],
            ["Cornstarch, 2 tbsp", "玉米粉 2 大匙"],
            ["Water, 1 cup", "水 1 杯"],
            ["Salt, ¼ tsp", "鹽 ¼ 小匙"],
            ["Cooking oil, 1 tbsp, plus more for greasing", "食用油 1 大匙，另備少許抹盤用"],
          ],
        },
        {
          group: ["Filling (pick one)", "內餡（任選一種）"],
          items: [
            ["Shrimp, ½ cup, peeled and chopped", "蝦仁 ½ 杯，切碎"],
            ["Char siu, ½ cup, diced", "叉燒 ½ 杯，切丁"],
            ["Scallions, 2 stalks, chopped", "青蔥 2 根，切蔥花"],
          ],
        },
        {
          group: ["Sauce", "醬汁"],
          items: [
            ["Soy sauce, 2 tbsp", "醬油 2 大匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
            ["Sugar, 1 tbsp", "糖 1 大匙"],
            ["Sesame oil, ½ tsp", "香油 ½ 小匙"],
            ["Hoisin sauce, for drizzling (optional)", "海鮮醬，淋醬用（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Make the batter. Whisk the rice flour, cornstarch, salt, water, and 1 tbsp oil until smooth. Let it rest 15 minutes. The flour settles, so stir it before every scoop.",
          "調粉漿。在來米粉、玉米粉、鹽、水與 1 大匙油攪拌至滑順，靜置 15 分鐘。米粉會沉底，每次舀之前都要攪一下。",
        ],
        [
          "Set up a steamer. You need a metal cake pan or rimmed plate that fits inside a large pot with a lid. Put 1 inch of water in the pot with a small rack (or an upside-down heatproof bowl) to hold the pan, and bring to a boil. Brush the pan with oil and heat it in the steamer for 1 minute.",
          "準備蒸鍋。準備一個能放進有蓋大鍋的金屬烤盤或有邊的盤子。鍋中加約 2.5 公分高的水，放上小蒸架（或倒扣一個耐熱碗）撐住烤盤，把水煮滾。烤盤抹油，放入鍋中預熱 1 分鐘。",
        ],
        [
          "Steam. Pour about ⅓ cup batter into the pan and tilt it into a thin layer. Sprinkle on some filling. Cover and steam on high for 2–3 minutes, until the sheet turns see-through and puffs with bubbles.",
          "蒸粉皮。倒入約 ⅓ 杯粉漿，傾斜烤盤讓粉漿鋪成薄薄一層，撒上內餡。蓋上鍋蓋，大火蒸 2–3 分鐘，直到粉皮變透明並鼓起小泡泡。",
        ],
        [
          "Roll. Carefully lift out the hot pan. Use a spatula or bench scraper to roll the sheet up from one end, then move it to a plate. Oil the pan again and repeat with the rest of the batter.",
          "捲起。小心取出燙手的烤盤，用鍋鏟或刮板從一端把粉皮捲起來，移到盤子上。烤盤重新抹油，重複做完剩下的粉漿。",
        ],
        [
          "Sauce and serve. Heat the soy sauce, water, and sugar until the sugar dissolves (20 seconds in the microwave works), then add the sesame oil. Pour over the rolls and drizzle with hoisin if you like. Serve right away, since they firm up as they cool.",
          "淋醬上桌。醬油、水與糖加熱至糖融化（微波 20 秒即可），再加入香油。淋在腸粉上，喜歡的話再淋些海鮮醬。要馬上吃，腸粉放涼會變硬。",
        ],
      ],
    },

    "Singapore Hainan Chicken Rice": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["45 min", "45 分鐘"],
        servings: "2",
        spice: ["Medium", "中辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Singapore's national dish: silky poached chicken, fragrant garlic rice, and the all-important chili-lime sauce. It uses the same thrifty poaching method as the Hainan original, with a different set of sauces.",
        "新加坡國民美食海南雞飯：滑嫩的白斬雞、蒜香油飯，以及不可或缺的辣椒青檸醬。做法和海南原版一樣省錢，搭配的醬料則不同。",
      ],
      ingredients: [
        {
          group: ["Chicken", "雞肉"],
          items: [
            ["Bone-in, skin-on chicken thighs, 4 (about 1½ lbs)", "帶骨帶皮雞腿 4 隻（約 1.5 磅）"],
            ["Salt, 1 tbsp, plus more for rubbing", "鹽 1 大匙，另備少許搓洗雞皮"],
            ["Ginger, 5 slices", "薑 5 片"],
            ["Garlic, 3 cloves, smashed", "蒜頭 3 瓣，拍碎"],
            ["Scallions, 2 stalks", "青蔥 2 根"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
          ],
        },
        {
          group: ["Garlic Rice", "蒜香油飯"],
          items: [
            ["Rice, 1½ cups, rinsed", "白米 1.5 杯，洗淨"],
            ["Garlic, 4 cloves, minced", "蒜頭 4 瓣，切末"],
            ["Ginger, 1 tbsp, minced", "薑末 1 大匙"],
            ["Cooking oil, 1 tbsp (or trimmed chicken fat)", "食用油 1 大匙（或雞皮雞油）"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Pandan leaves, 2, tied in a knot (optional)", "斑蘭葉 2 片，打結（可省略）"],
            ["Broth from poaching the chicken, in place of water", "煮雞的雞湯，取代煮飯的水"],
          ],
        },
        {
          group: ["Chili Sauce", "辣椒醬"],
          items: [
            ["Sambal oelek or chili garlic sauce, 3 tbsp", "參巴辣椒醬或蒜蓉辣椒醬 3 大匙"],
            ["Garlic, 2 cloves, finely minced", "蒜頭 2 瓣，切細末"],
            ["Ginger, 1 tsp, grated", "薑泥 1 小匙"],
            ["Lime juice, 2 tbsp (1 lime)", "萊姆汁 2 大匙（約 1 顆）"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Chicken broth, 2 tbsp", "雞湯 2 大匙"],
          ],
        },
        {
          group: ["Soy Drizzle & Sides", "醬油淋醬與配菜"],
          items: [
            ["Dark soy sauce, 1 tbsp", "老抽 1 大匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Sesame oil, 1 tsp", "香油 1 小匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Chicken broth, 2 tbsp", "雞湯 2 大匙"],
            ["Cucumber, 1, sliced", "小黃瓜 1 條，切片"],
            ["Fresh cilantro (optional)", "香菜（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Poach the chicken. Rub the thighs with a little salt and rinse; this cleans and smooths the skin. Put them in a pot, cover with water by 1 inch, and add the 1 tbsp salt, ginger, garlic, and scallions. Bring to a boil, lower to a bare simmer for 5 minutes, then turn off the heat, cover, and let sit 20–25 minutes until cooked through (165°F / 74°C).",
          "浸雞。雞腿用少許鹽搓洗後沖淨，讓雞皮乾淨光滑。放入鍋中，加水蓋過約 2.5 公分，加入 1 大匙鹽、薑片、蒜頭與青蔥。煮滾後轉最小火微滾 5 分鐘，熄火蓋上鍋蓋燜 20–25 分鐘，直到熟透（中心溫度 74°C）。",
        ],
        [
          "Cool and shine. Move the chicken to ice water for 5 minutes, pat it dry, and rub it with the sesame oil. Save the broth.",
          "冰鎮上油。雞腿泡冰水 5 分鐘後擦乾，抹上香油讓外皮光亮。雞湯留著備用。",
        ],
        [
          "Make the garlic rice. Heat the oil in a pan and fry the garlic and ginger 1–2 minutes until golden. Stir in the rice to coat. Move it to the rice cooker with the salt, pandan if using, and chicken broth in place of water. Cook as usual.",
          "煮蒜香油飯。鍋中熱油，放入蒜末與薑末炒 1–2 分鐘至金黃，倒入白米拌炒均勻。移到電子鍋中，加入鹽、斑蘭葉（若使用），並用雞湯代替水，照平常方式煮飯。",
        ],
        [
          "Make the chili sauce. Mash or very finely mince the garlic and ginger, then stir in the sambal, lime juice, sugar, and broth.",
          "做辣椒醬。蒜頭與薑搗成泥或切成極細末，再拌入參巴辣椒醬、萊姆汁、糖與雞湯。",
        ],
        [
          "Make the soy drizzle. Stir together the dark soy sauce, soy sauce, sesame oil, sugar, and broth.",
          "做醬油淋醬。老抽、醬油、香油、糖與雞湯拌勻。",
        ],
        [
          "Serve. Chop the chicken into pieces and spoon the soy drizzle over it. Serve with the rice, cucumber, cilantro, chili sauce on the side, and a small bowl of the broth.",
          "上桌。雞腿剁塊，淋上醬油淋醬，搭配蒜香油飯、小黃瓜、香菜與辣椒醬，再附上一小碗雞湯。",
        ],
      ],
    },

    "Egg Foo Young": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
      },
      intro: [
        "A fluffy Cantonese omelette packed with bean sprouts and vegetables, served with a quick brown gravy. A great way to use up whatever is left in the fridge.",
        "廣式芙蓉蛋：鬆軟的煎蛋裡加入滿滿的豆芽與蔬菜，再淋上簡單的醬汁。是清冰箱的好方法。",
      ],
      ingredients: [
        {
          group: ["Omelette", "芙蓉蛋"],
          items: [
            ["Eggs, 4", "雞蛋 4 顆"],
            ["Bean sprouts, 1 cup", "豆芽菜 1 杯"],
            ["Onion, ¼, thinly sliced", "洋蔥 ¼ 顆，切細絲"],
            ["Frozen mixed vegetables, ½ cup, thawed", "冷凍綜合蔬菜 ½ 杯，解凍"],
            ["Ham, char siu, or shrimp, ½ cup, chopped (optional)", "火腿、叉燒或蝦仁 ½ 杯，切碎（可省略）"],
            ["Scallions, 2 stalks, chopped", "青蔥 2 根，切蔥花"],
            ["Soy sauce, 1 tsp", "醬油 1 小匙"],
            ["White pepper, a pinch", "白胡椒粉 少許"],
            ["Cooking oil, 3 tbsp", "食用油 3 大匙"],
          ],
        },
        {
          group: ["Gravy", "醬汁"],
          items: [
            ["Water, ¾ cup", "水 ¾ 杯"],
            ["Chicken bouillon, ½ cube", "雞湯塊 ½ 塊"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Oyster sauce, 1 tbsp", "蠔油 1 大匙"],
            ["Sugar, ½ tsp", "糖 ½ 小匙"],
            ["Cornstarch, 1 tbsp, mixed with 2 tbsp water", "玉米粉 1 大匙，加 2 大匙水調勻"],
            ["Steamed rice, for serving", "白飯，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Mix. Beat the eggs with the soy sauce and white pepper. Stir in the bean sprouts, onion, mixed vegetables, meat or shrimp if using, and most of the scallions.",
          "拌蛋液。雞蛋加入醬油與白胡椒粉打散，拌入豆芽菜、洋蔥、綜合蔬菜、肉或蝦仁（若使用），以及大部分的蔥花。",
        ],
        [
          "Fry. Heat 1 tbsp oil in a pan over medium-high heat. Ladle in about ½ cup of the mixture to make a patty. Cook 2 minutes per side until golden and set. Repeat, adding oil as needed. You'll get 4–5 patties.",
          "煎蛋。平底鍋倒入 1 大匙油，以中大火加熱，舀入約 ½ 杯蛋液做成圓餅狀，每面煎 2 分鐘至金黃凝固。重複做完，視需要補油，約可做 4–5 片。",
        ],
        [
          "Make the gravy. In a small pot, heat the water, bouillon, soy sauce, oyster sauce, and sugar. Stir in the cornstarch mixture and simmer 1 minute until thick.",
          "煮醬汁。小鍋中加熱水、雞湯塊、醬油、蠔油與糖，倒入玉米粉水攪拌，煮 1 分鐘至濃稠。",
        ],
        [
          "Serve. Stack the patties, pour the gravy over them, and sprinkle with the remaining scallions. Serve with rice.",
          "上桌。芙蓉蛋疊放盤中，淋上醬汁，撒上剩下的蔥花，配白飯享用。",
        ],
      ],
    },

    "Asian Greens (Bok Choy, Gai Lan)": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["5 min", "5 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
      },
      intro: [
        "The everyday green vegetable on every Chinese table: bok choy, gai lan, or whatever greens are cheapest this week, stir-fried with plenty of garlic. Five minutes, start to finish.",
        "每張中式餐桌上都少不了的炒青菜：青江菜、芥蘭，或這週最便宜的任何青菜，加大量蒜頭快炒，五分鐘就上桌。",
      ],
      ingredients: [
        {
          group: ["Ingredients", "材料"],
          items: [
            ["Bok choy, 4 heads (about ¾ lb), or gai lan, cabbage, or spinach", "青江菜 4 棵（約 ¾ 磅），或芥蘭、高麗菜、菠菜"],
            ["Garlic, 4 cloves, sliced", "蒜頭 4 瓣，切片"],
            ["Cooking oil, 1 tbsp", "食用油 1 大匙"],
            ["Salt, ¼ tsp", "鹽 ¼ 小匙"],
            ["Sugar, a pinch", "糖 少許"],
            ["Water, 2 tbsp", "水 2 大匙"],
            ["Oyster sauce, 1 tbsp (for the gai lan version)", "蠔油 1 大匙（芥蘭做法用）"],
          ],
        },
      ],
      steps: [
        [
          "Prep the greens. Cut bok choy in half or quarters lengthwise and rinse well between the leaves, where dirt hides. Shake dry. For gai lan, trim the ends and peel any thick stems.",
          "處理青菜。青江菜縱向對切或切成四等份，葉片間容易藏沙，要仔細沖洗，再甩乾水分。芥蘭則切掉尾端，粗梗削去外皮。",
        ],
        [
          "Fry the garlic. Heat the oil over medium heat and fry the garlic 20–30 seconds until fragrant but not brown.",
          "爆香蒜片。中火熱油，放入蒜片炒 20–30 秒，炒香但不要炒焦。",
        ],
        [
          "Stir-fry. Turn the heat to high, add the greens, and toss 1 minute. Add the salt, sugar, and water, then cover for 1 minute so the stems steam.",
          "快炒。轉大火，放入青菜翻炒 1 分鐘，加入鹽、糖與水，蓋上鍋蓋燜 1 分鐘，讓菜梗熟透。",
        ],
        [
          "Finish. Uncover and toss until the greens are bright green and tender but still crisp. Serve.",
          "完成。打開鍋蓋翻炒，直到青菜翠綠、軟嫩但仍有脆度即可上桌。",
        ],
        [
          "Gai lan with oyster sauce (Hong Kong style). Instead of stir-frying, boil the gai lan in salted water with a few drops of oil for 2 minutes and drain. Mix the oyster sauce with 1 tbsp hot water and pour it over, then top with the fried garlic and its oil.",
          "蠔油芥蘭（港式做法）。不用快炒，將芥蘭放入加了鹽和幾滴油的滾水中燙 2 分鐘，撈起瀝乾。蠔油加 1 大匙熱水調勻後淋上，再鋪上炒香的蒜片與蒜油。",
        ],
      ],
    },

    "Char Kway Teow (Rice Noodle Stir-Fry)": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["10 min", "10 分鐘"],
        servings: "2",
        spice: ["Medium", "中辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Smoky, sweet-savory flat rice noodles stir-fried over high heat with shrimp, egg, and bean sprouts: the king of Penang and Singapore hawker stalls. Cook one serving at a time so the pan stays hot.",
        "炒粿條：寬扁米粉配上蝦仁、雞蛋與豆芽大火快炒，帶著鍋氣與甜鹹醬香，是檳城與新加坡小販中心的王者。一次炒一份，鍋子才能保持高溫。",
      ],
      ingredients: [
        {
          group: ["Noodles & Toppings", "粿條與配料"],
          items: [
            ["Wide flat rice noodles, ½ lb dried (or 1 lb fresh)", "寬河粉（粿條）乾的 ½ 磅（或新鮮的 1 磅）"],
            ["Shrimp, ¼ lb, peeled", "蝦仁 ¼ 磅"],
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Bean sprouts, 1½ cups", "豆芽菜 1.5 杯"],
            ["Scallions, 3 stalks, cut into 2-inch lengths (or garlic chives)", "青蔥 3 根，切成 5 公分段（或韭菜）"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Chinese sausage, 1, thinly sliced (optional)", "臘腸 1 條，切薄片（可省略）"],
            ["Cooking oil, 3 tbsp", "食用油 3 大匙"],
          ],
        },
        {
          group: ["Sauce", "醬汁"],
          items: [
            ["Dark soy sauce, 1½ tbsp", "老抽 1.5 大匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Oyster sauce, 1 tbsp", "蠔油 1 大匙"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Sambal oelek or chili garlic sauce, 1–2 tsp", "參巴辣椒醬或蒜蓉辣椒醬 1–2 小匙"],
            ["Water, 1 tbsp", "水 1 大匙"],
            ["Lime wedges, for serving", "萊姆角，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Prep the noodles. Soak dried noodles in hot water following the package directions until bendable but still firm. Drain and toss with a little oil. For fresh noodles, microwave 1 minute and gently pull them apart.",
          "處理粿條。乾粿條依包裝指示用熱水泡到可彎曲但仍有嚼勁，瀝乾後拌少許油。新鮮粿條則微波 1 分鐘，再輕輕剝開。",
        ],
        [
          "Mix the sauce. Stir all the sauce ingredients together. Divide everything into two portions; you'll cook one serving at a time.",
          "調醬汁。將所有醬汁材料拌勻。所有材料分成兩份，一次炒一份。",
        ],
        [
          "Start the stir-fry. Heat 1½ tbsp oil in a large pan over high heat until it starts to smoke. Fry half the garlic 10 seconds, then add half the shrimp and sausage and cook 1 minute.",
          "開始快炒。大平底鍋倒入 1.5 大匙油，大火燒到微微冒煙，放入一半蒜末爆香 10 秒，再放入一半的蝦仁與臘腸炒 1 分鐘。",
        ],
        [
          "Add the noodles. Add half the noodles and half the sauce. Toss 1–2 minutes, letting the noodles sit still for a few seconds at a time so they char a little.",
          "下粿條。加入一半的粿條與醬汁，翻炒 1–2 分鐘，中間偶爾停幾秒不要翻動，讓粿條稍微焦香。",
        ],
        [
          "Add the egg. Push the noodles aside, crack in 1 egg, and scramble until half set. Fold it into the noodles.",
          "加蛋。把粿條推到一旁，打入 1 顆蛋炒到半熟，再與粿條拌在一起。",
        ],
        [
          "Finish. Add half the bean sprouts and scallions and toss 30 seconds. Serve with lime and extra sambal. Repeat for the second serving.",
          "完成。加入一半的豆芽菜與蔥段，翻炒 30 秒即可。搭配萊姆角與參巴辣椒醬享用。再用同樣方法炒第二份。",
        ],
      ],
    },

    "Hokkien Mee (Stir-Fried Noodles with Shrimp)": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["25 min", "25 分鐘"],
        servings: "2",
        spice: ["Mild", "小辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Singapore's Hokkien prawn noodles: egg noodles fried with egg, then simmered in a rich shrimp stock until they soak it all up. The secret is a quick stock made from the shrimp shells you'd usually throw away.",
        "新加坡福建蝦麵：雞蛋麵先和蛋一起炒，再加入濃郁的蝦湯燜煮，讓麵條吸飽湯汁。秘訣是用平常會丟掉的蝦殼快速熬成高湯。",
      ],
      ingredients: [
        {
          group: ["Shrimp Stock", "蝦湯"],
          items: [
            ["Shell-on shrimp, ½ lb (peel them and keep the shells)", "帶殼蝦 ½ 磅（剝殼，蝦殼留著）"],
            ["Water, 2 cups", "水 2 杯"],
            ["Chicken bouillon, ½ cube", "雞湯塊 ½ 塊"],
            ["Cooking oil, 1 tbsp", "食用油 1 大匙"],
          ],
        },
        {
          group: ["Noodles", "麵條"],
          items: [
            ["Egg noodles, ¼ lb (yellow noodles if you can find them)", "雞蛋麵 ¼ 磅（買得到的話用油麵）"],
            ["Thin rice noodles (rice vermicelli), 2 oz (optional; or use more egg noodles)", "米粉 2 盎司（可省略，或改用更多雞蛋麵）"],
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Bean sprouts, 1½ cups", "豆芽菜 1.5 杯"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Scallions, 2 stalks, cut into 2-inch lengths (or garlic chives)", "青蔥 2 根，切成 5 公分段（或韭菜）"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["White pepper, a pinch", "白胡椒粉 少許"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
          ],
        },
        {
          group: ["To Serve", "搭配"],
          items: [
            ["Lime, 1, cut into wedges", "萊姆 1 顆，切角"],
            ["Sambal oelek or chili garlic sauce", "參巴辣椒醬或蒜蓉辣椒醬"],
          ],
        },
      ],
      steps: [
        [
          "Make the shrimp stock. Peel the shrimp and keep the shells. Fry the shells in 1 tbsp oil in a pot for 2–3 minutes, pressing on them, until bright orange and fragrant. Add the water and bouillon, simmer 10 minutes, and strain. Poach the peeled shrimp in the stock for 1–2 minutes, then scoop them out.",
          "熬蝦湯。蝦子剝殼，蝦殼留著。鍋中倒入 1 大匙油，放入蝦殼邊炒邊壓 2–3 分鐘，炒到橘紅色並散發香氣。加入水與雞湯塊，小火煮 10 分鐘後過濾。用這鍋湯把蝦仁燙 1–2 分鐘後撈起。",
        ],
        [
          "Prep the noodles. Cook the egg noodles 1 minute less than the package says. Soak the rice noodles in hot water for 5 minutes. Drain both.",
          "處理麵條。雞蛋麵依包裝時間少煮 1 分鐘。米粉用熱水泡 5 分鐘。兩者都瀝乾。",
        ],
        [
          "Fry the egg. Heat 2 tbsp oil in a large pan over high heat. Fry the garlic 15 seconds, then crack in the eggs and scramble until just set.",
          "炒蛋。大平底鍋倒入 2 大匙油以大火加熱，放入蒜末爆香 15 秒，再打入雞蛋炒到剛凝固。",
        ],
        [
          "Simmer the noodles. Add the noodles and toss. Pour in 1 cup of the stock and the soy sauce. Cover and simmer 3–4 minutes, tossing now and then and adding more stock as it soaks in. The noodles should be moist and a little saucy, not soupy.",
          "燜煮麵條。加入麵條翻拌，倒入 1 杯蝦湯與醬油，蓋上鍋蓋燜煮 3–4 分鐘，期間偶爾翻拌，湯汁被吸收時再補一些蝦湯。煮到麵條濕潤、帶一點醬汁，但不是湯麵的程度。",
        ],
        [
          "Finish. Add the bean sprouts, shrimp, scallions, and white pepper and toss 1 minute. Serve with lime and sambal; squeeze the lime over before eating.",
          "完成。加入豆芽菜、蝦仁、蔥段與白胡椒粉，翻炒 1 分鐘。搭配萊姆角與參巴辣椒醬，吃之前擠上萊姆汁。",
        ],
      ],
    },

    "Bak Kut Teh": {
      meta: {
        prep: ["10 min", "10 分鐘"],
        cook: ["1½ hrs", "1.5 小時"],
        servings: "4",
        spice: ["Mild", "小辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Singapore-style \"meat bone tea\": pork ribs simmered in a clear, peppery garlic broth. Just ribs, garlic, and white pepper, with no special herb packet needed.",
        "新加坡式肉骨茶：排骨在清澈、胡椒味十足的蒜頭湯中慢燉。只需要排骨、蒜頭和白胡椒，不需要特別的藥材包。",
      ],
      ingredients: [
        {
          group: ["Soup", "湯"],
          items: [
            ["Pork ribs, 2 lbs, cut into single ribs (spare ribs or baby back)", "豬肋排 2 磅，切成單支"],
            ["Garlic, 2 whole heads, cloves separated, skins left on", "蒜頭 2 整顆，剝成瓣，不用去皮"],
            ["White peppercorns, 2 tbsp, lightly crushed (or 1½ tsp ground white pepper)", "白胡椒粒 2 大匙，稍微壓碎（或白胡椒粉 1.5 小匙）"],
            ["Water, 8 cups", "水 8 杯"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Dark soy sauce, 1 tsp (optional, for color)", "老抽 1 小匙（可省略，增色用）"],
            ["Salt, 1 tsp, or to taste", "鹽 1 小匙，依口味調整"],
          ],
        },
        {
          group: ["To Serve", "搭配"],
          items: [
            ["Steamed rice", "白飯"],
            ["Dark soy sauce, 2 tbsp, mixed with sambal oelek or chili garlic sauce, for dipping", "老抽 2 大匙，加參巴辣椒醬或蒜蓉辣椒醬，沾肉用"],
            ["Bok choy, blanched (optional)", "燙青江菜（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Blanch the ribs. Put the ribs in a pot of cold water, bring to a boil, and cook 5 minutes. Drain and rinse.",
          "汆燙排骨。排骨放入冷水鍋中，煮滾後再煮 5 分鐘，撈起沖洗乾淨。",
        ],
        [
          "Prep the garlic and pepper. Separate the garlic cloves but leave the skins on. Crush the peppercorns with the bottom of a pan. If you like, tie the peppercorns in a coffee filter or cheesecloth so they're easy to remove.",
          "準備蒜頭與胡椒。蒜頭剝成瓣但不用去皮。用鍋底把白胡椒粒壓碎，喜歡的話可以用咖啡濾紙或紗布包起來，方便之後取出。",
        ],
        [
          "Simmer. Put the ribs, garlic, pepper, and water in a pot and bring to a boil. Lower the heat, partly cover, and simmer 1 to 1½ hours, until the meat is tender and pulls from the bone.",
          "燉煮。排骨、蒜頭、胡椒與水放入鍋中煮滾，轉小火，鍋蓋半蓋，燉 1 至 1.5 小時，直到肉軟嫩、能輕易脫骨。",
        ],
        [
          "Season. Add the soy sauce, dark soy sauce if using, and salt. Taste: it should be peppery and savory. Add more white pepper if you like.",
          "調味。加入醬油、老抽（若使用）與鹽。嚐嚐看，湯頭應該有明顯的胡椒香與鹹香，喜歡的話可再加白胡椒。",
        ],
        [
          "Serve. Ladle ribs and soup into bowls and serve with rice and the dark soy chili dip. In Singapore, soup refills are free, so keep the pot warm.",
          "上桌。將排骨與湯盛入碗中，搭配白飯與老抽辣椒沾醬。在新加坡，湯是可以免費續的，所以把鍋子保溫著吧。",
        ],
      ],
    },

    "Curry Laksa (Nyonya Style)": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["20 min", "20 分鐘"],
        servings: "2",
        spice: ["Hot", "大辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Rich, spicy coconut curry noodle soup loaded with shrimp, tofu, and bean sprouts. Store-bought laksa paste makes it a 30-minute meal; curry powder and sambal work in a pinch.",
        "濃郁香辣的椰奶咖哩湯麵，加入蝦仁、豆腐與豆芽。用市售叻沙醬，30 分鐘就能完成；沒有叻沙醬的話，用咖哩粉加參巴辣椒醬也行。",
      ],
      ingredients: [
        {
          group: ["Broth", "湯底"],
          items: [
            ["Laksa paste, 3 tbsp (or 2 tbsp curry powder + 1 tbsp sambal oelek + 2 cloves garlic, minced)", "叻沙醬 3 大匙（或咖哩粉 2 大匙＋參巴辣椒醬 1 大匙＋蒜末 2 瓣）"],
            ["Coconut milk, 1 can (13.5 oz)", "椰奶 1 罐（約 400 毫升）"],
            ["Water, 2 cups", "水 2 杯"],
            ["Chicken bouillon, 1 cube", "雞湯塊 1 塊"],
            ["Sugar, 1 tsp", "糖 1 小匙"],
            ["Lime juice, 1 tbsp", "萊姆汁 1 大匙"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
          ],
        },
        {
          group: ["Noodles & Toppings", "麵條與配料"],
          items: [
            ["Egg noodles, ¼ lb (or rice noodles, or half of each)", "雞蛋麵 ¼ 磅（或米粉，或各半）"],
            ["Shrimp, ¼ lb, peeled", "蝦仁 ¼ 磅"],
            ["Firm tofu, ½ block, cut into cubes", "板豆腐 ½ 塊，切丁"],
            ["Bean sprouts, 1 cup", "豆芽菜 1 杯"],
            ["Eggs, 2, hard-boiled and halved", "雞蛋 2 顆，水煮後對切"],
            ["Fresh cilantro or scallions, chopped", "香菜或蔥花"],
            ["Lime wedges and sambal, for serving", "萊姆角與參巴辣椒醬，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Fry the tofu. Heat 1 tbsp oil in the pot and fry the tofu cubes about 5 minutes until golden on a few sides. This stands in for the tofu puffs used in Malaysia; they soak up the broth. Set aside.",
          "煎豆腐。鍋中倒入 1 大匙油，將豆腐丁煎約 5 分鐘，煎到幾面金黃。這是用來代替馬來西亞常用的豆卜，能吸飽湯汁。先盛起備用。",
        ],
        [
          "Fry the paste. Add the remaining oil and the laksa paste (or curry powder, sambal, and garlic) and fry over medium heat for 2–3 minutes, stirring, until fragrant and the oil separates. Don't let curry powder burn.",
          "炒醬。倒入剩下的油，加入叻沙醬（或咖哩粉、參巴辣椒醬與蒜末），以中火拌炒 2–3 分鐘，炒到香氣出來、醬料出油。注意別讓咖哩粉炒焦。",
        ],
        [
          "Make the broth. Add the water and bouillon and simmer 5 minutes. Stir in the coconut milk and sugar and bring back to a gentle simmer (a hard boil can make coconut milk split). Add the shrimp and tofu for the last 2–3 minutes. Stir in the lime juice and add salt to taste.",
          "煮湯。加入水與雞湯塊煮 5 分鐘，再加入椰奶與糖，以小火保持微滾（大火滾煮椰奶容易油水分離）。最後 2–3 分鐘放入蝦仁與豆腐。拌入萊姆汁，依口味加鹽。",
        ],
        [
          "Cook the noodles. In another pot, cook the noodles following the package directions. Dip the bean sprouts into the same water for 20 seconds. Drain.",
          "煮麵。另起一鍋，依包裝指示煮麵，豆芽菜也放入同一鍋水燙 20 秒，撈起瀝乾。",
        ],
        [
          "Assemble. Put the noodles and bean sprouts in bowls and ladle the hot broth over them. Top with shrimp, tofu, egg halves, and herbs. Serve with lime and sambal.",
          "組合。麵條與豆芽菜放入碗中，淋上熱湯，擺上蝦仁、豆腐、半顆水煮蛋與香菜。搭配萊姆角與參巴辣椒醬享用。",
        ],
      ],
    },

    "Nasi Lemak": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["40 min", "40 分鐘"],
        servings: "2",
        spice: ["Medium", "中辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "Malaysia's national breakfast: fragrant coconut rice with sweet-spicy sambal, a fried egg, cucumber, peanuts, and crispy curry-spiced chicken. Use the rest of the can of coconut milk for laksa or kaya.",
        "馬來西亞國民早餐椰漿飯：香濃椰奶飯配上甜辣參巴醬、煎蛋、小黃瓜、花生與香酥咖哩炸雞。剩下的椰奶可以拿來煮叻沙或做咖椰醬。",
      ],
      ingredients: [
        {
          group: ["Coconut Rice", "椰漿飯"],
          items: [
            ["Rice, 1 cup, rinsed", "白米 1 杯，洗淨"],
            ["Coconut milk, ½ cup", "椰奶 ½ 杯"],
            ["Water, ¾ cup", "水 ¾ 杯"],
            ["Ginger, 2 slices", "薑 2 片"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Pandan leaves, 2, tied in a knot (optional)", "斑蘭葉 2 片，打結（可省略）"],
          ],
        },
        {
          group: ["Sambal", "參巴醬"],
          items: [
            ["Sambal oelek or chili garlic sauce, 3 tbsp", "參巴辣椒醬或蒜蓉辣椒醬 3 大匙"],
            ["Onion, ½, finely chopped", "洋蔥 ½ 顆，切碎"],
            ["Garlic, 2 cloves, minced", "蒜頭 2 瓣，切末"],
            ["Sugar, 1½ tbsp", "糖 1.5 大匙"],
            ["Lime juice, 1 tbsp", "萊姆汁 1 大匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
            ["Cooking oil, 2 tbsp", "食用油 2 大匙"],
          ],
        },
        {
          group: ["Chicken & Sides", "炸雞與配菜"],
          items: [
            ["Boneless chicken thighs, ½ lb (about 2)", "去骨雞腿肉 ½ 磅（約 2 隻）"],
            ["Curry powder, 1 tsp (or ½ tsp turmeric)", "咖哩粉 1 小匙（或薑黃粉 ½ 小匙）"],
            ["Salt, ½ tsp", "鹽 ½ 小匙"],
            ["Cornstarch, 1 tbsp", "玉米粉 1 大匙"],
            ["Cooking oil, ¼ cup, for frying", "食用油 ¼ 杯，煎炸用"],
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Cucumber, ½, sliced", "小黃瓜 ½ 條，切片"],
            ["Roasted peanuts, ¼ cup", "烤花生 ¼ 杯"],
            ["Dried anchovies, fried (optional)", "炸小魚乾（可省略）"],
          ],
        },
      ],
      steps: [
        [
          "Cook the coconut rice. Put the rice, coconut milk, water, salt, ginger, and pandan if using in the rice cooker and cook as usual. Fluff and remove the ginger and pandan.",
          "煮椰漿飯。白米、椰奶、水、鹽、薑片與斑蘭葉（若使用）放入電子鍋，照平常方式煮飯。煮好後拌鬆，取出薑片與斑蘭葉。",
        ],
        [
          "Make the sambal. Heat the oil in a pan over medium-low heat and cook the onion 4–5 minutes until soft and golden. Add the garlic for 1 minute. Add the sambal oelek, sugar, and water and simmer, stirring, about 5 minutes until dark and thick and the oil separates. Stir in the lime juice. It should taste sweet, spicy, and tangy.",
          "做參巴醬。鍋中熱油，以中小火將洋蔥炒 4–5 分鐘至軟化金黃，加入蒜末炒 1 分鐘。再加入參巴辣椒醬、糖與水，邊煮邊攪拌約 5 分鐘，直到顏色變深、醬汁濃稠並出油。拌入萊姆汁。味道應該是甜、辣、酸兼具。",
        ],
        [
          "Fry the chicken. Toss the chicken with the curry powder, salt, and cornstarch. Shallow-fry in ¼ cup oil over medium-high heat for 4–5 minutes per side, until golden and cooked through. (Air fryer: 400°F / 200°C for 15 minutes.)",
          "炸雞。雞腿肉拌上咖哩粉、鹽與玉米粉。鍋中倒入 ¼ 杯油，以中大火每面煎炸 4–5 分鐘，至金黃熟透。（氣炸鍋：200°C 烤 15 分鐘。）",
        ],
        [
          "Fry the eggs. In the same pan, fry the eggs until the edges are crispy.",
          "煎蛋。用同一個鍋子煎兩顆荷包蛋，煎到邊緣酥脆。",
        ],
        [
          "Plate. Pack rice into a bowl and flip it onto a plate. Arrange the sambal, egg, chicken, cucumber, and peanuts around it.",
          "擺盤。把椰漿飯壓進碗裡，再倒扣在盤子上。周圍擺上參巴醬、荷包蛋、炸雞、小黃瓜與花生。",
        ],
      ],
    },

    "Kaya Toast": {
      meta: {
        prep: ["5 min", "5 分鐘"],
        cook: ["30 min", "30 分鐘"],
        servings: "2",
        spice: ["None", "不辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "The kopitiam breakfast set: toast spread with kaya (a sweet coconut-egg jam) and cold butter, served with soft-boiled eggs. Kaya needs only eggs, sugar, and coconut milk, plus some patience. One batch lasts the week.",
        "咖啡店經典早餐：吐司抹上咖椰醬（香甜的椰奶蛋醬）與冰奶油，配上半熟蛋。咖椰醬只需要雞蛋、糖和椰奶，再加上一點耐心，做一次可以吃一整個星期。",
      ],
      ingredients: [
        {
          group: ["Kaya (makes about 1 cup)", "咖椰醬（約 1 杯）"],
          items: [
            ["Eggs, 3", "雞蛋 3 顆"],
            ["Sugar, ½ cup", "糖 ½ 杯"],
            ["Coconut milk, ½ cup", "椰奶 ½ 杯"],
            ["Salt, a pinch", "鹽 少許"],
            ["Pandan leaves, 2, tied in a knot (optional)", "斑蘭葉 2 片，打結（可省略）"],
          ],
        },
        {
          group: ["Toast Set", "吐司套餐"],
          items: [
            ["White sandwich bread, 4 slices", "白吐司 4 片"],
            ["Cold butter, thinly sliced", "冰奶油，切薄片"],
            ["Eggs, 4, for soft-boiling", "雞蛋 4 顆，做半熟蛋"],
            ["Soy sauce and white pepper, for the eggs", "醬油與白胡椒粉，淋蛋用"],
          ],
        },
      ],
      steps: [
        [
          "Mix the kaya. In a heatproof bowl, whisk the eggs and sugar until the sugar mostly dissolves. Whisk in the coconut milk and salt. Strain through a sieve for an extra-smooth jam (optional). For the darker, caramel-flavored Hainanese kaya, first melt 2 tbsp of the sugar in a small pot until amber, then carefully stir in the coconut milk before adding it.",
          "調咖椰醬。在耐熱碗中將雞蛋與糖攪拌至糖大致溶解，再拌入椰奶與鹽。想要更滑順，可以用篩網過濾（可省略）。想做顏色較深、帶焦糖香的海南咖椰，可先取 2 大匙糖在小鍋中煮成琥珀色，小心倒入椰奶拌勻後再加入。",
        ],
        [
          "Set up a double boiler. Set the bowl over a pot of barely simmering water, making sure the bowl doesn't touch the water. Add the pandan if using.",
          "隔水加熱。把碗架在一鍋微滾的水上，碗底不要碰到水。若使用斑蘭葉，此時放入。",
        ],
        [
          "Cook the kaya. Stir constantly with a spatula, scraping the sides and bottom, for 20–30 minutes, until it's thick like pudding and coats the spoon. If it gets lumpy, whisk hard. It thickens more as it cools. Remove the pandan. Keeps in the fridge up to 1 week.",
          "煮咖椰醬。用刮刀不停攪拌，並刮一下碗邊與碗底，煮 20–30 分鐘，直到像布丁一樣濃稠、能附著在湯匙上。如果出現結塊，用打蛋器用力攪散。放涼後會更濃稠。取出斑蘭葉，冷藏可保存 1 週。",
        ],
        [
          "Soft-boil the eggs. Bring a pot of water to a boil, turn off the heat, and add the eggs. Cover and let sit 6–7 minutes. Crack them into a small bowl and season with soy sauce and white pepper.",
          "做半熟蛋。一鍋水煮滾後熄火，放入雞蛋，蓋上鍋蓋燜 6–7 分鐘。把蛋打入小碗中，淋上醬油、撒白胡椒粉。",
        ],
        [
          "Make the toast. Toast the bread until crisp and golden. Spread one slice thickly with kaya, lay on thin slices of cold butter, top with another slice, and cut in half. Dip the toast into the eggs as you eat.",
          "做吐司。吐司烤到酥脆金黃，一片抹上厚厚的咖椰醬，鋪上幾片冰奶油，再蓋上另一片吐司，對切。吃的時候可以沾半熟蛋。",
        ],
      ],
    },

    "Mee Goreng (Southeast Asian Fried Noodles)": {
      meta: {
        prep: ["15 min", "15 分鐘"],
        cook: ["15 min", "15 分鐘"],
        servings: "2",
        spice: ["Medium", "中辣"],
        origin: "singapore-malaysia",
      },
      intro: [
        "The mamak-stall fried noodles of Malaysia and Singapore: yellow noodles tossed in a sweet, tangy, spicy sauce of ketchup, sweet soy, and chili, with potato, tofu, cabbage, and egg.",
        "馬來西亞與新加坡嘛嘛檔的炒麵：黃麵拌上番茄醬、甜醬油和辣椒調成的酸甜辣醬，加入馬鈴薯、豆腐、高麗菜與雞蛋一起炒。",
      ],
      ingredients: [
        {
          group: ["Noodles & Vegetables", "麵條與蔬菜"],
          items: [
            ["Egg noodles, ½ lb (yellow noodles if you can find them)", "雞蛋麵 ½ 磅（買得到的話用油麵）"],
            ["Potato, 1 small, peeled and cut into ½-inch cubes", "馬鈴薯 1 顆（小），去皮切成約 1 公分小丁"],
            ["Firm tofu, ½ block, cut into cubes", "板豆腐 ½ 塊，切丁"],
            ["Cabbage, 1 cup, shredded", "高麗菜 1 杯，切絲"],
            ["Bean sprouts, 1 cup", "豆芽菜 1 杯"],
            ["Tomato, 1, cut into wedges", "番茄 1 顆，切塊"],
            ["Eggs, 2", "雞蛋 2 顆"],
            ["Onion, ½, sliced", "洋蔥 ½ 顆，切絲"],
            ["Garlic, 3 cloves, minced", "蒜頭 3 瓣，切末"],
            ["Cooking oil, 3 tbsp", "食用油 3 大匙"],
          ],
        },
        {
          group: ["Sauce", "醬汁"],
          items: [
            ["Ketchup, 2 tbsp", "番茄醬 2 大匙"],
            ["Sweet soy sauce (kecap manis), 2 tbsp, or 1½ tbsp dark soy sauce + 2 tsp sugar", "甜醬油 2 大匙，或老抽 1.5 大匙＋糖 2 小匙"],
            ["Soy sauce, 1 tbsp", "醬油 1 大匙"],
            ["Sambal oelek or chili garlic sauce, 1 tbsp", "參巴辣椒醬或蒜蓉辣椒醬 1 大匙"],
            ["Curry powder, 1 tsp", "咖哩粉 1 小匙"],
            ["Water, 2 tbsp", "水 2 大匙"],
            ["Lime wedges, for serving", "萊姆角，搭配食用"],
          ],
        },
      ],
      steps: [
        [
          "Prep. Cook the noodles 1 minute less than the package says, rinse with cold water, and drain. Boil the potato cubes 8–10 minutes until tender (or microwave them, covered, 4–5 minutes). Mix the sauce.",
          "前置準備。麵條依包裝時間少煮 1 分鐘，用冷水沖過後瀝乾。馬鈴薯丁水煮 8–10 分鐘至軟（或加蓋微波 4–5 分鐘）。把醬汁拌勻。",
        ],
        [
          "Fry the tofu and potato. Heat 1 tbsp oil in a large pan and fry the tofu and potato 4–5 minutes until golden. Set aside.",
          "煎豆腐與馬鈴薯。大平底鍋倒入 1 大匙油，將豆腐與馬鈴薯煎 4–5 分鐘至金黃，盛起備用。",
        ],
        [
          "Cook the aromatics. Add the remaining oil and cook the onion 1 minute, then the garlic 30 seconds, then the cabbage 1 minute.",
          "爆香。倒入剩下的油，先炒洋蔥 1 分鐘，再加入蒜末炒 30 秒，接著放入高麗菜炒 1 分鐘。",
        ],
        [
          "Add the noodles. Add the noodles and sauce and toss over high heat for 2 minutes until evenly coated.",
          "下麵。加入麵條與醬汁，大火翻炒 2 分鐘，讓麵條均勻裹上醬汁。",
        ],
        [
          "Add the egg. Push the noodles aside, crack in the eggs, scramble, and toss them through the noodles.",
          "加蛋。把麵推到一旁，打入雞蛋炒散，再與麵條拌在一起。",
        ],
        [
          "Finish. Add the tofu, potato, tomato, and bean sprouts and toss 1 minute. Serve with lime wedges.",
          "完成。加入豆腐、馬鈴薯、番茄與豆芽菜，翻炒 1 分鐘。搭配萊姆角享用。",
        ],
      ],
    },
  },
};
