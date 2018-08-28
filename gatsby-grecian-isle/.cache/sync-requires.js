// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {
  "layout---index": preferDefault(require("C:/MyCode/LEARNING/METEOR/grecian-isle/gatsby-grecian-isle/.cache/layouts/index.js"))
}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\.cache\\dev-404-page.js")),
  "component---src-pages-game-jsx": preferDefault(require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\src\\pages\\game.jsx")),
  "component---src-pages-index-jsx": preferDefault(require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\src\\pages\\index.jsx"))
}

exports.json = {
  "layout-index.json": require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\.cache\\json\\layout-index.json"),
  "dev-404-page.json": require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\.cache\\json\\dev-404-page.json"),
  "game.json": require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\.cache\\json\\game.json"),
  "index.json": require("C:\\MyCode\\LEARNING\\METEOR\\grecian-isle\\gatsby-grecian-isle\\.cache\\json\\index.json")
}