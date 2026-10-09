// The single source of data for the whole site. Every page is built from this file.
// To change categories, filters, or recipes, edit only this file.
//
// ATTRIBUTES are the ways recipes are organized or filtered. Each one:
//   id        short key used on every recipe and in page URLs (category.html?kind=rice)
//   label     text people see
//   onHome    true = shown as a group of buttons on the home page (a top-level organization)
//   asFilter  true = shown as toggle-button filters above the recipes on category pages
//             (hidden on pages of that same attribute, and when it can't narrow the list)
//   required  true = every recipe must have at least one value
//   values    [id, label] pairs, in display order
// Every attribute holds a list on each recipe, so a recipe can live in several places.
//
// RECIPES are the information blocks. Each has an English name, a Chinese name,
// and a list of values for every attribute id. An empty list ([]) means the recipe
// is not reachable through that attribute.
//
// TASKS are the tree-test scenarios (used by index.html?test). Order is shuffled for
// each participant, so the order here doesn't matter. Each task:
//   id                   unique, e.g. "1" (appears in the results)
//   text                 what the participant reads (the task description)
//   predictedFirstClick  the home-page button we expect them to click first, written
//                        exactly as it appears ("Rice", "Taiwan", ...)
//   targets              recipe names that count as found; reaching any one is a success.
//                        English name exactly as in RECIPES
//   paths                the routes we expect, each a list of labels from first click to the
//                        recipe. Filters are written "Group: Option"
//   rationale            why we wrote it (for the team only; never shown or exported)

window.SITE_DATA = {
  siteName: "Huiyi Kitchen",

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
    { name: "Stir-fried Tomato and Scrambled Eggs", zh: "蕃茄炒蛋", kind: ["sides-vegetables"], region: ["mainland", "taiwan", "hong-kong"], ingredient: ["egg", "vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Mapo Tofu", zh: "麻婆豆腐", kind: ["meat-mains", "sides-vegetables"], region: ["mainland", "taiwan", "hong-kong"], ingredient: ["tofu", "pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Hot and Sour Shredded Potatoes", zh: "酸辣土豆絲", kind: ["sides-vegetables"], region: ["mainland"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Braised Pork Belly", zh: "紅燒肉", kind: ["meat-mains"], region: ["mainland", "taiwan", "hong-kong"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Congee", zh: "粥", kind: ["rice", "soups"], region: ["mainland", "taiwan", "hong-kong", "singapore-malaysia"], ingredient: [], time: ["breakfast"], custom: ["yes"] },
    { name: "Twice-Cooked Pork", zh: "回鍋肉", kind: ["meat-mains"], region: ["mainland", "taiwan"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Pork and Pepper Stir-fry", zh: "青椒肉絲", kind: ["meat-mains"], region: ["mainland", "taiwan", "hong-kong"], ingredient: ["pork", "vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Hainan Chicken Rice", zh: "海南雞飯", kind: ["rice", "meat-mains"], region: ["mainland"], ingredient: ["chicken"], time: ["lunch-dinner"], custom: [] },
    { name: "Dumplings", zh: "餃子", kind: ["meat-mains", "sides-vegetables"], region: ["mainland", "taiwan", "hong-kong"], ingredient: ["pork", "vegetables"], time: ["lunch-dinner", "snack"], custom: ["yes"] },
    { name: "Taiwanese Popcorn Chicken", zh: "鹹酥雞", kind: ["meat-mains"], region: ["taiwan"], ingredient: ["chicken"], time: ["snack"], custom: [] },
    { name: "Lu Rou Fan (Braised Pork Rice)", zh: "滷肉飯", kind: ["rice"], region: ["taiwan"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Beef Noodle Soup", zh: "牛肉麵", kind: ["noodles", "soups"], region: ["taiwan", "mainland", "hong-kong"], ingredient: ["beef"], time: ["lunch-dinner"], custom: [] },
    { name: "Garlic Smashed Cucumbers", zh: "拍黃瓜", kind: ["sides-vegetables"], region: ["taiwan", "mainland"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "Stir-fried Cabbage with Bacon", zh: "培根炒高麗菜", kind: ["sides-vegetables"], region: ["taiwan"], ingredient: ["vegetables", "pork"], time: ["lunch-dinner"], custom: [] },
    { name: "Cheese Egg Crepe", zh: "起司蛋餅", kind: ["sides-vegetables"], region: ["taiwan"], ingredient: ["egg"], time: ["breakfast"], custom: ["yes"] },
    { name: "Baked BBQ Pork (Char Siu)", zh: "叉燒", kind: ["meat-mains"], region: ["hong-kong", "mainland", "singapore-malaysia"], ingredient: ["pork"], time: ["lunch-dinner"], custom: [] },
    { name: "HK Soy Sauce Noodles", zh: "豉油皇炒麵", kind: ["noodles"], region: ["hong-kong", "mainland"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
    { name: "HK Macaroni Soup", zh: "火腿通粉", kind: ["noodles", "soups"], region: ["hong-kong"], ingredient: ["pork"], time: ["breakfast", "lunch-dinner"], custom: [] },
    { name: "Clay Pot Rice", zh: "煲仔飯", kind: ["rice"], region: ["hong-kong", "mainland", "singapore-malaysia"], ingredient: ["chicken", "pork"], time: ["lunch-dinner"], custom: ["yes"] },
    { name: "Cheung Fun (Steamed Rice Rolls)", zh: "腸粉", kind: ["noodles"], region: ["hong-kong", "mainland", "singapore-malaysia"], ingredient: ["seafood", "pork"], time: ["breakfast", "snack"], custom: ["yes"] },
    { name: "Singapore Hainan Chicken Rice", zh: "新加坡海南雞飯", kind: ["rice", "meat-mains"], region: ["singapore-malaysia"], ingredient: ["chicken"], time: ["lunch-dinner"], custom: [] },
    { name: "Egg Foo Young", zh: "芙蓉蛋", kind: ["sides-vegetables"], region: ["singapore-malaysia", "hong-kong", "mainland"], ingredient: ["egg"], time: ["lunch-dinner"], custom: ["yes"] },
    { name: "Asian Greens (Bok Choy, Gai Lan)", zh: "炒青菜（白菜／芥蘭）", kind: ["sides-vegetables"], region: ["mainland", "taiwan", "hong-kong", "singapore-malaysia"], ingredient: ["vegetables"], time: ["lunch-dinner"], custom: [] },
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
  tasks: [
    {
      id: 1,
      text: "You are planning a dumpling-making activity. Find the recipe for dumplings.",
      targets: ["Dumplings"],
      predictedFirstClick: "Meat mains",
      rationale: "The dumplings recipe was one of our greatest splitters.",
    },
    {
      id: 2,
      text: "You want to know the ingredients to make 起司蛋餅 (Cheese Egg Crepe). Find the recipe.",
      targets: ["Cheese Egg Crepe"],
      predictedFirstClick: "Taiwan",
      rationale: "The cheese egg crepe recipe was one of our greatest splitters.",
    },
    {
      id: 3,
      text: "You’re feeling sick on a cold morning and want plain, soft rice porridge. Find the recipe.",
      targets: ["Congee"],
      predictedFirstClick: "Rice",
      rationale: "Congee was commonly sorted as “other.” Breakfast is only a filter, not a home-page button, so this tests whether people find and use the filter.",
    },
    {
      id: 4,
      text: "You have some greens to go with your rice and meat dinner, but you don’t remember the exact method to pan-fry them. Find a recipe to help.",
      targets: ["Asian Greens (Bok Choy, Gai Lan)"],
      predictedFirstClick: "Sides and vegetables",
      rationale: "This recipe should be simple and straightforward to find.",
    },
    {
      id: 5,
      text: "When you went to a kopitiam, you’d order toast spread with sweet coconut jam for breakfast. Find how to make it.",
      targets: ["Kaya Toast"],
      predictedFirstClick: "Singapore/Malaysia",
      rationale: "Kaya Toast has no Kind of dish, so people can only reach it through Region or the Breakfast filter. Tests whether the region organization works on its own. This is one of your two Singapore/Malaysia tasks.",
    },
    {
      id: 6,
      text: "In Taiwan you loved the savory braised pork spooned over a bowl of rice from a 小吃 stand. Find the recipe.",
      targets: ["Lu Rou Fan (Braised Pork Rice)"],
      predictedFirstClick: "Rice",
      rationale: "Tests Rice versus Meat mains for a pork-over-rice dish. Braised Pork Belly is a likely wrong answer to watch for.",
    },
    {
      id: 7,
      text: "On a hot day you want something 清爽: a cold, garlicky cucumber side like the ones at a noodle shop. Find the recipe.",
      targets: ["Garlic Smashed Cucumbers"],
      predictedFirstClick: "Sides and vegetables",
      rationale: "Keeps the 清爽 idea but points to one answer. Tests whether people go through Kind of dish or Region (Taiwan).",
    },
    {
      id: 8,
      text: "On the way home from an appointment, you’d grab a bag of crispy fried chicken bites with basil from a night-market stand. Find how to make it.",
      targets: ["Taiwanese Popcorn Chicken"],
      predictedFirstClick: "Taiwan",
      rationale: "Keeps the “fried” idea with one answer. Popcorn Chicken is tagged Snack, not Lunch or dinner, so this also tests Meat mains versus the Snack filter.",
    },
    {
      id: 9,
      text: "Your companion in Hong Kong always ordered 腸粉 (Cheung Fun) at the morning dim sum place, and you want to make it for them when they visit. Find the recipe.",
      targets: ["Cheung Fun (Steamed Rice Rolls)"],
      predictedFirstClick: "Hong Kong",
      rationale: "A named splitter that was commonly sorted as “other.” It could be under Noodles, Hong Kong, Breakfast or Snack.",
    },
    {
      id: 10,
      text: "You served in Hong Kong and want to bring the glossy, sweet red roast pork from the roast-meat shops to a mission reunion. Find the recipe.",
      targets: ["Baked BBQ Pork (Char Siu)"],
      predictedFirstClick: "Hong Kong",
      rationale: "Still tests whether people use the “countries” organization, but has one answer you can score.",
    },
  ],
};
