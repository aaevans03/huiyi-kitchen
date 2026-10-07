// The single source of data for the whole site. Every page is built from this file.
// To change categories, filters, or recipes, edit only this file.
//
// ATTRIBUTES are the ways recipes are organized or filtered. Each one:
//   id        short key used on every recipe and in page URLs (category.html?kind=rice)
//   label     text people see
//   onHome    true = shown as a group of buttons on the home page (a top-level organization)
//   asFilter  true = shown as checkbox filters on category pages
//             (hidden on pages of that same attribute, and when it can't narrow the list)
//   required  true = every recipe must have at least one value
//   values    [id, label] pairs, in display order
// Every attribute holds a list on each recipe, so a recipe can live in several places.
//
// RECIPES are the information blocks. Each has an English name, a Chinese name,
// and a list of values for every attribute id. An empty list ([]) means the recipe
// is not reachable through that attribute.
//
// TASKS are the tree-test scenarios (used by index.html?test):
//   id, text (what the participant reads), targets (recipe names that count as found),
//   predictedFirstClick (optional; a home-page button label)

window.SITE_DATA = {
  siteName: "Website Name",

  attributes: [
    {
      id: "kind",
      label: "Kind of dish",
      onHome: true,
      asFilter: false,
      required: false,
      values: [
        ["rice", "Rice"],
        ["noodles", "Noodles"],
        ["meat-mains", "Meat mains"],
        ["sides-vegetables", "Sides and vegetables"],
        ["soups", "Soups"],
      ],
    },
    {
      id: "region",
      label: "Region",
      onHome: true,
      asFilter: false,
      required: true,
      values: [
        ["mainland", "Mainland China"],
        ["hong-kong", "Hong Kong"],
        ["taiwan", "Taiwan"],
        ["singapore-malaysia", "Singapore/Malaysia"],
      ],
    },
    {
      id: "ingredient",
      label: "Main ingredient",
      onHome: false,
      asFilter: true,
      required: false,
      values: [
        ["pork", "Pork"],
        ["chicken", "Chicken"],
        ["beef", "Beef"],
        ["seafood", "Seafood"],
        ["egg", "Egg"],
        ["tofu", "Tofu"],
        ["vegetables", "Vegetables"],
      ],
    },
    {
      id: "time",
      label: "Time of day typically eaten",
      onHome: false,
      asFilter: true,
      required: true,
      values: [
        ["breakfast", "Breakfast"],
        ["lunch-dinner", "Lunch or dinner"],
        ["snack", "Snack"],
      ],
    },
    {
      id: "custom",
      label: "Customizable",
      onHome: false,
      asFilter: true,
      required: false,
      values: [
        ["yes", "Customizable"],
      ],
    },
  ],

  recipes: [
    { name: "Stir-fried Tomato and Scrambled Eggs", zh: "蕃茄炒蛋", kind: ["sides-vegetables"], region: ["mainland"], ingredient: ["egg", "vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Mapo Tofu", zh: "麻婆豆腐", kind: ["meat-mains", "sides-vegetables"], region: ["mainland"], ingredient: ["tofu", "pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Hot and Sour Shredded Potatoes", zh: "酸辣土豆絲", kind: ["sides-vegetables"], region: ["mainland"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Braised Pork Belly", zh: "紅燒肉", kind: ["meat-mains"], region: ["mainland"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Congee", zh: "粥", kind: ["rice", "soups"], region: ["mainland"], ingredient: [], time: ["breakfast"], custom: ["yes"] },
    { name: "Twice-Cooked Pork", zh: "回鍋肉", kind: ["meat-mains"], region: ["mainland"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Pork and Pepper Stir-fry", zh: "青椒肉絲", kind: ["meat-mains"], region: ["mainland"], ingredient: ["pork", "vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Hainan Chicken Rice", zh: "海南雞飯", kind: ["rice"], region: ["mainland"], ingredient: ["chicken"], time: ["lunch-dinner"], custom: [] },
    { name: "Dumplings", zh: "餃子", kind: ["meat-mains", "sides-vegetables"], region: ["mainland"], ingredient: ["pork", "vegetables"], time: ["lunch-dinner", "snack"], custom: ["yes"] },

    { name: "Taiwanese Popcorn Chicken", zh: "鹹酥雞", kind: ["meat-mains"], region: ["taiwan"], ingredient: ["chicken"], time: ["snack"], custom: [] },
    { name: "Lu Rou Fan (Braised Pork Rice)", zh: "滷肉飯", kind: ["rice"], region: ["taiwan"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Beef Noodle Soup", zh: "牛肉麵", kind: ["noodles", "soups"], region: ["taiwan"], ingredient: ["beef"], time: ["lunch-dinner"], custom: [] },
    { name: "Garlic Smashed Cucumbers", zh: "拍黃瓜", kind: ["sides-vegetables"], region: ["taiwan"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Stir-fried Cabbage with Bacon", zh: "培根炒高麗菜", kind: ["sides-vegetables"], region: ["taiwan"], ingredient: ["vegetables", "pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Cheese Egg Crepe", zh: "起司蛋餅", kind: ["sides-vegetables"], region: ["taiwan"], ingredient: ["egg"], time: ["breakfast"], custom: ["yes"] },

    { name: "Baked BBQ Pork (Char Siu)", zh: "叉燒", kind: ["meat-mains"], region: ["hong-kong"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "HK Soy Sauce Noodles", zh: "豉油皇炒麵", kind: ["noodles"], region: ["hong-kong"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "HK Macaroni Soup", zh: "火腿通粉", kind: ["noodles", "soups"], region: ["hong-kong"], ingredient: ["pork"], time: ["breakfast", "lunch-dinner"], custom: [] },
    { name: "Clay Pot Rice", zh: "煲仔飯", kind: ["rice"], region: ["hong-kong"], ingredient: ["chicken", "pork"], time: ["lunch-dinner"], custom: ["yes"] },
    { name: "Cheung Fun (Steamed Rice Rolls)", zh: "腸粉", kind: ["noodles"], region: ["hong-kong"], ingredient: ["seafood", "pork"], time: ["breakfast", "snack"], custom: ["yes"] },

    { name: "Singapore Hainan Chicken Rice", zh: "新加坡海南雞飯", kind: ["rice"], region: ["singapore-malaysia"], ingredient: ["chicken"], time: ["lunch-dinner"], custom: [] },
    { name: "Egg Foo Young", zh: "芙蓉蛋", kind: ["sides-vegetables"], region: ["singapore-malaysia"], ingredient: ["egg"], time: ["lunch-dinner"], custom: ["yes"] },
    { name: "Asian Greens (Bok Choy, Gai Lan)", zh: "炒青菜（白菜／芥蘭）", kind: ["sides-vegetables"], region: ["singapore-malaysia"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Char Kway Teow (Rice Noodle Stir-Fry)", zh: "炒粿條", kind: ["noodles"], region: ["singapore-malaysia"], ingredient: ["seafood", "egg"], time: ["lunch-dinner"], custom: [] },
    { name: "Hokkien Mee (Stir-Fried Noodles with Shrimp)", zh: "福建炒蝦麵", kind: ["noodles"], region: ["singapore-malaysia"], ingredient: ["seafood"], time: ["lunch-dinner"], custom: [] },
    { name: "Bak Kut Teh", zh: "肉骨茶", kind: ["soups", "meat-mains"], region: ["singapore-malaysia"], ingredient: ["pork"], time: ["breakfast", "lunch-dinner"], custom: [] },
    { name: "Curry Laksa (Nyonya Style)", zh: "娘惹咖哩叻沙", kind: ["noodles", "soups"], region: ["singapore-malaysia"], ingredient: ["seafood"], time: ["lunch-dinner"], custom: [] },
    { name: "Nasi Lemak", zh: "椰漿飯", kind: ["rice"], region: ["singapore-malaysia"], ingredient: ["chicken", "egg"], time: ["breakfast", "lunch-dinner"], custom: [] },
    { name: "Kaya Toast", zh: "咖椰吐司", kind: [], region: ["singapore-malaysia"], ingredient: ["egg"], time: ["breakfast"], custom: [] },
    { name: "Mee Goreng (Southeast Asian Fried Noodles)", zh: "馬來炒麵", kind: ["noodles"], region: ["singapore-malaysia"], ingredient: ["egg", "vegetables"], time: ["lunch-dinner"], custom: [] },
  ],

  // The team writes these. Example shape:
  // { id: "1", text: "You want ...", targets: ["Congee"], predictedFirstClick: "Rice" },
  tasks: [],
};
