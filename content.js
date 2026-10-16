// Presentation content that data.js doesn't hold: photos, Chinese labels, search words,
// and full recipe text. data.js stays the single source for structure (categories,
// filters, which recipe is where). Everything here is keyed by data.js ids or by a
// recipe's English name exactly as written in data.js.
//
// IMAGES     Unsplash photo ids (the part after "photo-"), used as placeholders.
// LABELS_ZH  Chinese label and pinyin for each attribute value (by value id).
// SEARCH     per recipe: pinyin of the Chinese name, plus extra words people might type
//            (simplified characters, other names).
// DETAILS    per recipe: full bilingual recipe. A recipe without details still gets a
//            page; it just says the full recipe is coming soon.

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

  // [Chinese label, pinyin, flag]. The flag is only used on the home page region buttons.
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
      "mainland": ["中國", "zhong guo", "🇨🇳"],
      "taiwan": ["台灣", "tai wan", "🇹🇼"],
      "hong-kong": ["香港", "xiang gang", "🇭🇰"],
      "singapore-malaysia": ["新加坡／馬來西亞", "xin jia po ma lai xi ya", "🇸🇬 🇲🇾"],
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
    "Beef Noodle Soup": {
      meta: {
        prep: ["20 min", "20 分鐘"],
        cook: ["2 hrs", "2 小時"],
        servings: "4",
        spice: ["Medium", "中辣"],
        origin: "taiwan",
      },
      intro: [
        "Taiwan's beloved red-braised beef noodle soup: tender beef shank simmered in a spicy, soy-rich broth over chewy wheat noodles.",
        "台灣經典紅燒牛肉麵：軟嫩牛腱在香辣濃郁的醬油湯頭中慢燉，搭配Q彈麵條。",
      ],
      ingredients: [
        {
          group: ["Broth & Aromatics", "湯底與辛香料"],
          items: [
            ["Ginger, 5 slices", "老薑 5 片"],
            ["Garlic, 6 cloves", "蒜頭 6 瓣"],
            ["Scallions, 4 stalks, cut into sections", "青蔥 4 根，切段"],
            ["Star anise, 3 pods", "八角 3 顆"],
            ["Sichuan peppercorns, 1 tsp", "花椒 1 小匙"],
            ["Doubanjiang (spicy bean paste), 2 tbsp", "辣豆瓣醬 2 大匙"],
            ["Soy sauce, ⅓ cup", "醬油 ⅓ 杯"],
            ["Rice wine, ¼ cup", "米酒 ¼ 杯"],
            ["Rock sugar, 1 tbsp", "冰糖 1 大匙"],
            ["Tomato, 1, cut into wedges", "番茄 1 顆，切塊"],
            ["Water, 10 cups", "水 10 杯"],
          ],
        },
        {
          group: ["Meat & Noodles", "肉類與麵條"],
          items: [
            ["Beef shank, 2 lbs, cut into 1½-inch chunks", "牛腱子 2 磅，切成約 4 公分塊狀"],
            ["Fresh wheat noodles, 1 lb", "新鮮手工麵條 1 磅"],
          ],
        },
        {
          group: ["Toppings & Garnish", "配料與裝飾"],
          items: [
            ["Baby bok choy, 4 heads", "青江菜 4 棵"],
            ["Pickled mustard greens, chopped, ½ cup", "酸菜，切碎，½ 杯"],
            ["Fresh cilantro, to taste", "香菜 適量"],
          ],
        },
      ],
      steps: [
        [
          "Blanch the beef. Put the beef in a pot of cold water, bring it to a boil, and cook for 3 minutes until the scum rises. Drain and rinse the beef under warm water.",
          "汆燙牛肉。將牛肉放入冷水鍋中，煮滾後再煮 3 分鐘，直到浮沫出現。撈起後用溫水沖洗乾淨。",
        ],
        [
          "Sauté the aromatics and bean paste. Heat 2 tbsp oil in a large pot over medium heat. Fry the ginger, garlic, scallions, star anise, and Sichuan peppercorns for about 2 minutes, until fragrant. Add the doubanjiang and stir-fry for 1 minute, until the oil turns red.",
          "爆香辛香料與豆瓣醬。大鍋中倒入 2 大匙油，以中火加熱。放入薑、蒜、蔥段、八角與花椒，炒約 2 分鐘至香氣出來。加入辣豆瓣醬拌炒 1 分鐘，直到油色轉紅。",
        ],
        [
          "Coat the beef. Add the beef and tomato, then pour in the rice wine and soy sauce. Stir until the beef is evenly coated and lightly browned.",
          "牛肉上色。放入牛肉與番茄，淋上米酒和醬油，翻炒至牛肉均勻上色。",
        ],
        [
          "Braise. Add the water and rock sugar and bring to a boil. Cover and simmer on low heat for 1½ to 2 hours, until the beef is tender. Skim off the fat and add salt to taste.",
          "燉煮。加入水與冰糖煮滾，蓋上鍋蓋轉小火燉 1.5 至 2 小時，直到牛肉軟嫩。撈除浮油，再依口味加鹽調味。",
        ],
        [
          "Cook the noodles and greens. In a separate pot of boiling water, cook the noodles following the package directions. Add the bok choy for the last 30 seconds, then drain everything.",
          "煮麵與燙青菜。另起一鍋滾水，依包裝指示煮麵。起鍋前 30 秒放入青江菜，一起撈起瀝乾。",
        ],
        [
          "Assemble the bowl. Put the noodles in a bowl and ladle the hot broth over them. Top with beef, bok choy, pickled mustard greens, and cilantro.",
          "組合麵碗。將麵條放入碗中，淋上熱湯，再擺上牛肉、青江菜、酸菜與香菜即可。",
        ],
      ],
    },
  },
};
