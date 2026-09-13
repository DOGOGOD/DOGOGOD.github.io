"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => BlogPreviewPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_path3 = __toESM(require("node:path"), 1);

// src/project.ts
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = require("node:fs");

// node_modules/.pnpm/github-slugger@2.0.0/node_modules/github-slugger/regex.js
var regex = /[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g;

// node_modules/.pnpm/github-slugger@2.0.0/node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;
function slug(value, maintainCase) {
  if (typeof value !== "string") return "";
  if (!maintainCase) value = value.toLowerCase();
  return value.replace(regex, "").replace(/ /g, "-");
}

// src/project.ts
function inside(root, target) {
  const relative = import_node_path.default.relative(root, target);
  return relative === "" || !relative.startsWith(`..${import_node_path.default.sep}`) && relative !== ".." && !import_node_path.default.isAbsolute(relative);
}
function isBlog(root) {
  try {
    const pkg = JSON.parse((0, import_node_fs.readFileSync)(import_node_path.default.join(root, "package.json"), "utf8"));
    return Boolean(pkg.dependencies?.astro) && (0, import_node_fs.existsSync)(import_node_path.default.join(root, "src/content/blog"));
  } catch {
    return false;
  }
}
function findProject(vault, configured, activePath) {
  if (configured.trim()) {
    const root = import_node_path.default.resolve(vault, configured.trim());
    if (!inside(vault, root)) throw new Error("Blog \u76EE\u5F55\u5FC5\u987B\u4F4D\u4E8E\u5F53\u524D Obsidian \u4ED3\u5E93\u5185\u3002");
    if (!isBlog(root)) throw new Error("\u8BE5\u76EE\u5F55\u4E0D\u662F Blog \u6839\u76EE\u5F55\uFF0C\u8BF7\u9009\u62E9\u5305\u542B package.json \u548C src/content/blog \u7684\u6587\u4EF6\u5939\u3002");
    return root;
  }
  let current = activePath ? import_node_path.default.dirname(import_node_path.default.resolve(vault, activePath)) : vault;
  while (inside(vault, current)) {
    if (isBlog(current)) return current;
    if (current === vault) break;
    current = import_node_path.default.dirname(current);
  }
  throw new Error("\u8BF7\u5148\u6253\u5F00 src/content/blog \u4E2D\u7684\u6587\u7AE0\uFF0C\u6216\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u586B\u5199 Blog \u6839\u76EE\u5F55\u3002");
}
function routeForFile(relativePath, frontmatter) {
  const relative = relativePath.replaceAll("\\", "/");
  if (!relative.startsWith("src/content/")) return null;
  const match = /^src\/content\/(blog|spec)\/(.+)\/(zh-cn|en)\.md$/.exec(relative);
  if (!match) return null;
  const [, collection, folder, language] = match;
  if (folder.split("/").some((part) => part === ".." || part === ".")) return null;
  const id = typeof frontmatter?.slug === "string" ? frontmatter.slug : `${folder.split("/").map((part) => slug(part)).join("/")}/${language}`;
  const parts = id.split("/");
  const locale = parts.pop();
  if (!parts.length || !["zh-cn", "en"].includes(locale ?? "") || parts.some((part) => !part || part === ".." || part === ".")) return null;
  const prefix = locale === "en" ? "/en" : "";
  const articleId = parts.map((part) => encodeURIComponent(part)).join("/");
  if (collection === "blog") return `${prefix}/blog/${articleId}/`;
  return articleId === "about" ? `${prefix}/about/` : null;
}
function validPort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("\u7AEF\u53E3\u9700\u8981\u662F 1024\u201365535 \u4E4B\u95F4\u7684\u6574\u6570\u3002");
  return port;
}

// src/server.ts
var import_node_child_process = require("node:child_process");
var import_node_fs2 = require("node:fs");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_crypto = require("node:crypto");
var PreviewServer = class {
  constructor(onStatus = () => {
  }) {
    this.onStatus = onStatus;
  }
  child = null;
  pending = null;
  running = null;
  cancelStart = null;
  logs = [];
  log(text) {
    this.logs.push(text.replace(/\u001b\[[0-9;]*m/g, ""));
    while (this.logs.join("").length > 18e3) this.logs.shift();
  }
  start(root, nodePath, port) {
    if (this.running?.root === root) return Promise.resolve(this.running);
    if (this.pending) return this.pending;
    validPort(port);
    if (!(0, import_node_fs2.existsSync)(import_node_path2.default.join(root, "node_modules/astro/package.json"))) {
      return Promise.reject(new Error("Blog \u5C1A\u672A\u5B89\u88C5\u4F9D\u8D56\u3002\u8BF7\u5148\u5728 Blog \u6839\u76EE\u5F55\u8FD0\u884C pnpm install\u3002"));
    }
    this.stop();
    const token = (0, import_node_crypto.randomBytes)(24).toString("hex");
    this.logs.length = 0;
    this.onStatus("\u6B63\u5728\u542F\u52A8 Blog \u9884\u89C8\uFF0C\u9996\u6B21\u7F16\u8BD1\u9700\u8981\u4E00\u4E9B\u65F6\u95F4\u2026");
    const operation = new Promise((resolve, reject) => {
      let ready = false;
      const env = { ...process.env, NODE_ENV: "development", ASTRO_TELEMETRY_DISABLED: "1" };
      delete env.ELECTRON_RUN_AS_NODE;
      delete env.NODE_OPTIONS;
      const child = (0, import_node_child_process.spawn)(nodePath.trim() || "node", ["--input-type=module", "-e", `import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
const runnerArgs = process.argv[1]?.endsWith(".mjs") ? process.argv.slice(2) : process.argv.slice(1);
const [root, portString, token] = runnerArgs;
const bridge = "function previewBridge(token) {\\n  if (window.parent === window || window.__guztchianPreviewBridge) return;\\n  window.__guztchianPreviewBridge = true;\\n  const channel = 'guztchian-blog-preview';\\n  const send = (type, extra = {}) => window.parent.postMessage({ channel, token, type, ...extra }, '*');\\n  const positionKey = () => \`guztchian-preview-scroll:\${location.pathname}\`;\\n  let theme;\\n  const applyTheme = () => {\\n    if (!theme) return;\\n    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);\\n    if (dark) document.documentElement.setAttribute('data-theme', 'dark');\\n    else document.documentElement.removeAttribute('data-theme');\\n    try { localStorage.setItem('theme', theme); } catch { /* Storage may be unavailable. */ }\\n  };\\n  const restore = () => {\\n    try {\\n      const y = Number(sessionStorage.getItem(positionKey()) || 0);\\n      if (y > 0) requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));\\n    } catch { /* Keep preview functional when storage is unavailable. */ }\\n  };\\n  const ready = () => { applyTheme(); send('ready', { path: location.pathname }); };\\n  window.addEventListener('message', event => {\\n    if (event.source !== window.parent || event.data?.token !== token || event.data?.channel !== channel) return;\\n    if (event.data.type === 'theme' && ['light', 'dark', 'system'].includes(event.data.value)) {\\n      theme = event.data.value;\\n      applyTheme();\\n    }\\n  });\\n  window.addEventListener('beforeunload', () => {\\n    try { sessionStorage.setItem(positionKey(), String(window.scrollY)); } catch { /* Optional. */ }\\n  });\\n  window.addEventListener('load', () => { restore(); ready(); });\\n  document.addEventListener('astro:page-load', ready);\\n  document.addEventListener('click', event => {\\n    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;\\n    if (!anchor) return;\\n    const url = new URL(anchor.href, location.href);\\n    if (url.origin !== location.origin) {\\n      event.preventDefault();\\n      if (['https:', 'http:', 'mailto:'].includes(url.protocol)) send('external', { url: url.href });\\n    }\\n  }, true);\\n}";
let server;
let stopping = false;
async function stop() {
  stopping = true;
  if (server) {
    await server.stop();
    process.exit(0);
  }
}
process.on("message", (message) => {
  if (message?.type === "stop") void stop();
});
process.on("disconnect", () => void stop());
process.on("SIGTERM", () => void stop());
process.on("SIGINT", () => void stop());
try {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || major === 22 && minor < 12) throw new Error("\\u9700\\u8981 Node.js 22.12 \\u6216\\u66F4\\u9AD8\\u7248\\u672C\\uFF0C\\u5EFA\\u8BAE\\u4F7F\\u7528\\u672C\\u673A Node.js 24\\u3002");
  const require2 = createRequire(path.join(root, "package.json"));
  const { dev } = await import(pathToFileURL(require2.resolve("astro")).href);
  server = await dev({
    root,
    logLevel: "info",
    server: { host: "127.0.0.1", port: Number(portString), open: false },
    devToolbar: { enabled: false },
    // Keep the plugin's content/dependency cache separate from normal CLI previews.
    cacheDir: "./node_modules/.cache/obsidian-blog-preview/astro/",
    vite: { cacheDir: "./node_modules/.cache/obsidian-blog-preview/vite/", server: { strictPort: true } },
    integrations: [{
      name: "guztchian-obsidian-preview",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript("head-inline", \`(\${bridge})(\${JSON.stringify(token)});\`);
        }
      }
    }]
  });
  if (stopping || !process.connected) await stop();
  else process.send?.({ type: "ready", origin: \`http://127.0.0.1:\${server.address.port}\` });
} catch (error) {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.send?.({ type: "error", message });
  console.error(message);
  if (server) await server.stop();
  process.exit(1);
}
`, root, String(port), token], {
        cwd: root,
        env,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe", "ipc"]
      });
      this.child = child;
      const fail = (error) => {
        clearTimeout(timeout);
        reject(error);
      };
      const timeout = setTimeout(() => {
        fail(new Error("\u542F\u52A8\u8D85\u8FC7 90 \u79D2\u3002\u8BF7\u67E5\u770B\u65E5\u5FD7\uFF0C\u786E\u8BA4 Node.js \u7248\u672C\u3001\u9879\u76EE\u4F9D\u8D56\u548C\u7AEF\u53E3\u8BBE\u7F6E\u3002"));
        if (this.child === child) this.stop();
      }, 9e4);
      this.cancelStart = () => fail(new Error("\u9884\u89C8\u670D\u52A1\u5DF2\u505C\u6B62\u3002"));
      child.stdout?.on("data", (data) => this.log(data.toString()));
      child.stderr?.on("data", (data) => this.log(data.toString()));
      child.once("error", (error) => {
        this.log(error.message);
        fail(new Error(`\u65E0\u6CD5\u8FD0\u884C Node.js\uFF1A${error.message}\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u586B\u5199 node.exe \u7684\u5B8C\u6574\u8DEF\u5F84\u3002`));
      });
      child.on("message", (message) => {
        const data = message;
        if (data.type === "error") {
          this.log(data.message ?? "\u542F\u52A8\u5931\u8D25");
          fail(new Error(data.message ?? "\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u65E5\u5FD7\u3002"));
        }
        if (data.type !== "ready" || this.child !== child) return;
        if (data.origin !== `http://127.0.0.1:${port}`) {
          fail(new Error("\u9884\u89C8\u670D\u52A1\u8FD4\u56DE\u4E86\u975E\u9884\u671F\u5730\u5740\u3002"));
          this.stop();
          return;
        }
        ready = true;
        clearTimeout(timeout);
        this.cancelStart = null;
        this.running = { root, token, origin: data.origin };
        resolve(this.running);
      });
      child.once("exit", (code) => {
        if (this.child === child) {
          this.child = null;
          this.running = null;
          this.onStatus(ready ? "\u9884\u89C8\u670D\u52A1\u5DF2\u505C\u6B62\uFF0C\u53EF\u70B9\u51FB\u5237\u65B0\u91CD\u65B0\u542F\u52A8\u3002" : "\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u65E5\u5FD7\u3002");
        }
        fail(new Error(`\u9884\u89C8\u670D\u52A1\u9000\u51FA\uFF08${code ?? "\u88AB\u7EC8\u6B62"}\uFF09\u3002${this.logs.join("").slice(-1200)}`));
      });
    });
    this.pending = operation;
    void operation.finally(() => {
      if (this.pending === operation) this.pending = null;
    }).catch(() => {
    });
    return operation;
  }
  stop() {
    const child = this.child;
    this.child = null;
    this.running = null;
    this.cancelStart?.();
    this.cancelStart = null;
    this.pending = null;
    if (!child || child.exitCode !== null) return;
    if (child.connected) child.send({ type: "stop" }, () => {
    });
    else child.kill();
    const fallback = setTimeout(() => {
      if (child.exitCode === null) child.kill();
    }, 8e3);
    fallback.unref();
    child.once("exit", () => clearTimeout(fallback));
  }
};

// src/main.ts
var VIEW = "guztchian-blog-preview";
var CHANNEL = "guztchian-blog-preview";
var DEFAULTS = {
  projectPath: "",
  scopePaths: ["src/content/blog", "src/content/spec/about"],
  nodePath: "",
  port: 4323,
  autoSave: true,
  saveDelay: 300,
  saveTimingVersion: 1,
  theme: "system",
  viewport: "responsive"
};
var BlogPreviewPlugin = class extends import_obsidian.Plugin {
  settings = { ...DEFAULTS };
  server = new PreviewServer((message) => this.views().forEach((view) => view.status(message)));
  activeArticle = null;
  projectRoot = null;
  saveTimer = null;
  disposed = false;
  async onload() {
    const stored = await this.loadData();
    this.settings = { ...DEFAULTS, ...stored };
    const migrateSaveTiming = stored?.saveTimingVersion !== DEFAULTS.saveTimingVersion;
    if (migrateSaveTiming && Number(stored?.saveDelay) === 800) this.settings.saveDelay = DEFAULTS.saveDelay;
    this.settings.saveTimingVersion = DEFAULTS.saveTimingVersion;
    this.settings.scopePaths = Array.isArray(stored?.scopePaths) ? stored.scopePaths.filter((item) => typeof item === "string") : [...DEFAULTS.scopePaths];
    try {
      this.settings.port = validPort(this.settings.port);
    } catch {
      this.settings.port = DEFAULTS.port;
    }
    this.settings.saveDelay = Math.max(300, Math.min(5e3, Number(this.settings.saveDelay) || DEFAULTS.saveDelay));
    if (!["light", "dark", "system"].includes(this.settings.theme)) this.settings.theme = "system";
    if (!["responsive", "mobile", "desktop"].includes(this.settings.viewport)) this.settings.viewport = "responsive";
    if (migrateSaveTiming) await this.saveData(this.settings);
    this.registerView(VIEW, (leaf) => new BlogPreviewView(leaf, this));
    this.addRibbonIcon("panels-left-right", "\u6253\u5F00 Blog \u9884\u89C8", () => void this.openPreview());
    this.addCommand({ id: "open-preview", name: "\u6253\u5F00\u6587\u7AE0\u9884\u89C8\uFF08\u53F3\u4FA7\u5206\u680F\uFF09", callback: () => void this.openPreview() });
    this.addCommand({ id: "refresh-preview", name: "\u5237\u65B0\u6587\u7AE0\u9884\u89C8", callback: () => this.views().forEach((view) => void view.refresh()) });
    this.addCommand({ id: "stop-preview", name: "\u505C\u6B62\u9884\u89C8\u670D\u52A1", callback: () => {
      this.cancelSave();
      this.views().forEach((view) => view.clearFrame());
      this.server.stop();
      this.views().forEach((view) => view.status("\u9884\u89C8\u5DF2\u505C\u6B62\uFF1B\u70B9\u51FB\u5237\u65B0\u53EF\u91CD\u65B0\u542F\u52A8\u3002"));
    } });
    this.addSettingTab(new BlogPreviewSettings(this.app, this));
    this.registerEvent(this.app.workspace.on("file-open", (file) => {
      if (!file) return;
      this.cancelSave();
      this.activeArticle = file;
      this.views().forEach((view) => {
        if (view.follow) void view.showFile(file);
      });
    }));
    this.registerEvent(this.app.workspace.on("editor-change", (_editor, info) => {
      if (!(info instanceof import_obsidian.MarkdownView) || !info.file) return;
      const file = info.file;
      const interested = this.views().filter((view) => view.file?.path === file.path && view.hasFrame());
      if (!interested.length) return;
      interested.forEach((view) => view.status("\u6B63\u5728\u7F16\u8F91\u2026"));
      this.cancelSave();
      if (!this.settings.autoSave) return;
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        if (this.disposed || info.file?.path !== file.path || !this.server.running || !this.views().some((view) => view.file?.path === file.path)) return;
        void info.save().catch((error) => new import_obsidian.Notice(`\u6587\u7AE0\u4FDD\u5B58\u5931\u8D25\uFF1A${String(error)}`));
      }, this.settings.saveDelay);
    }));
    this.registerEvent(this.app.vault.on("modify", (file) => {
      this.views().filter((view) => view.file?.path === file.path && view.hasFrame()).forEach((view) => {
        view.status("\u5DF2\u4FDD\u5B58 \xB7 \u7B49\u5F85\u7F51\u9875\u66F4\u65B0\u2026");
      });
    }));
    this.registerEvent(this.app.vault.on("rename", (file) => {
      if (file instanceof import_obsidian.TFile) this.views().filter((view) => view.file === file).forEach((view) => void view.showFile(file));
    }));
    this.registerEvent(this.app.vault.on("delete", (file) => {
      this.views().filter((view) => view.file === file).forEach((view) => {
        view.file = null;
        view.clearFrame();
        view.status("\u6587\u7AE0\u5DF2\u5220\u9664\uFF0C\u8BF7\u6253\u5F00\u53E6\u4E00\u7BC7\u6587\u7AE0\u3002");
      });
    }));
    this.app.workspace.onLayoutReady(() => {
      if (this.disposed) return;
      const active = this.app.workspace.getActiveFile();
      if (active) this.activeArticle = active;
      this.views().forEach((view) => {
        if (this.activeArticle) void view.showFile(this.activeArticle);
      });
    });
  }
  onunload() {
    this.disposed = true;
    this.cancelSave();
    this.app.workspace.detachLeavesOfType(VIEW);
    this.server.stop();
  }
  cancelSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
  }
  views() {
    return this.app.workspace.getLeavesOfType(VIEW).map((leaf) => leaf.view).filter((view) => view instanceof BlogPreviewView);
  }
  maybeStopServer() {
    if (!this.views().some((view) => view.hasFrame())) this.server.stop();
  }
  vaultPath() {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof import_obsidian.FileSystemAdapter)) throw new Error("\u6B64\u63D2\u4EF6\u9700\u8981\u684C\u9762\u7248 Obsidian \u548C\u672C\u5730\u6587\u4EF6\u4ED3\u5E93\u3002");
    return adapter.getBasePath();
  }
  project(file) {
    if (!this.projectRoot) this.projectRoot = findProject(this.vaultPath(), this.settings.projectPath, file?.path);
    return this.projectRoot;
  }
  route(file) {
    const root = this.project(file);
    const absolute = import_node_path3.default.resolve(this.vaultPath(), file.path);
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const route = inside(root, absolute) ? routeForFile(import_node_path3.default.relative(root, absolute), frontmatter) : null;
    if (!route) throw new Error("\u8BF7\u9009\u62E9 src/content/blog/\u6587\u7AE0\u76EE\u5F55/zh-cn.md\uFF08\u6216 en.md\uFF09\u3002\u4E5F\u652F\u6301 src/content/spec/about \u4E2D\u7684\u5173\u4E8E\u9875\u9762\uFF1B\u666E\u901A\u7B14\u8BB0\u6CA1\u6709\u5BF9\u5E94\u7684\u53D1\u5E03\u9875\u9762\u3002");
    return { root, route };
  }
  isInScope(file) {
    const relative = file.path.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
    return this.settings.scopePaths.some((folder) => {
      const normalized = folder.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
      return Boolean(normalized) && (relative === normalized || relative.startsWith(`${normalized}/`));
    });
  }
  async openPreview() {
    const active = this.app.workspace.getActiveFile() ?? this.activeArticle;
    if (active) this.activeArticle = active;
    let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("split", "vertical");
      await leaf.setViewState({ type: VIEW, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    if (active && leaf.view instanceof BlogPreviewView) await leaf.view.showFile(active);
  }
  async saveSettings(restart = false) {
    await this.saveData(this.settings);
    if (restart) {
      this.cancelSave();
      this.projectRoot = null;
      this.server.stop();
      this.views().forEach((view) => {
        view.clearFrame();
        view.status("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u70B9\u51FB\u5237\u65B0\u4EE5\u91CD\u65B0\u542F\u52A8\u9884\u89C8\u3002");
      });
    }
  }
};
var BlogPreviewView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  file = null;
  follow = true;
  frame = null;
  frameUrl = "";
  session = null;
  revision = 0;
  closed = false;
  statusEl;
  routeEl;
  canvas;
  logsEl;
  getViewType() {
    return VIEW;
  }
  getDisplayText() {
    return "Blog \u9884\u89C8";
  }
  getIcon() {
    return "panels-left-right";
  }
  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass("guz-blog-preview");
    const toolbar = this.contentEl.createDiv({ cls: "guz-blog-toolbar" });
    toolbar.createSpan({ text: "Blog \u9884\u89C8", cls: "guz-blog-title" });
    const controls = toolbar.createDiv({ cls: "guz-blog-controls" });
    const button = (label, callback) => {
      const el = controls.createEl("button", { text: label, attr: { type: "button" } });
      this.registerDomEvent(el, "click", callback);
      return el;
    };
    button("\u5237\u65B0", () => void this.refresh());
    const follow = button("\u8DDF\u968F\u6587\u7AE0", () => {
      this.follow = !this.follow;
      follow.setText(this.follow ? "\u8DDF\u968F\u6587\u7AE0" : "\u5DF2\u56FA\u5B9A");
      follow.setAttribute("aria-pressed", String(this.follow));
      if (this.follow && this.plugin.activeArticle) void this.showFile(this.plugin.activeArticle);
    });
    follow.setAttribute("aria-pressed", "true");
    (0, import_obsidian.setTooltip)(follow, "\u5F00\u542F\u540E\uFF0C\u9884\u89C8\u8DDF\u968F Obsidian \u5F53\u524D\u6587\u7AE0\u5207\u6362");
    const viewport = controls.createEl("select", { attr: { "aria-label": "\u9884\u89C8\u5BBD\u5EA6" } });
    for (const [value, text] of [["responsive", "\u9002\u5E94\u5206\u680F"], ["mobile", "\u624B\u673A \xB7 390"], ["desktop", "\u684C\u9762 \xB7 1280"]]) viewport.createEl("option", { text, value });
    viewport.value = this.plugin.settings.viewport;
    this.registerDomEvent(viewport, "change", () => {
      this.plugin.settings.viewport = viewport.value;
      this.applyViewport();
      void this.plugin.saveSettings();
    });
    const theme = controls.createEl("select", { attr: { "aria-label": "\u7F51\u9875\u4E3B\u9898" } });
    for (const [value, text] of [["system", "\u8DDF\u968F\u7CFB\u7EDF"], ["light", "\u6D45\u8272\u7EB8\u9762"], ["dark", "\u6DF1\u8272\u7EB8\u9762"]]) theme.createEl("option", { text, value });
    theme.value = this.plugin.settings.theme;
    this.registerDomEvent(theme, "change", () => {
      this.plugin.settings.theme = theme.value;
      this.sendTheme();
      void this.plugin.saveSettings();
    });
    button("\u6D4F\u89C8\u5668\u6253\u5F00", () => {
      if (this.frameUrl) window.open(this.frameUrl, "_blank", "noopener");
      else new import_obsidian.Notice("\u8BF7\u5148\u6253\u5F00\u4E00\u7BC7\u53EF\u9884\u89C8\u7684\u6587\u7AE0\u3002");
    });
    const logsButton = button("\u65E5\u5FD7", () => {
      this.logsEl.hidden = !this.logsEl.hidden;
      logsButton.setAttribute("aria-expanded", String(!this.logsEl.hidden));
      this.logsEl.setText(this.plugin.server.logs.join("") || "\u6682\u65E0\u65E5\u5FD7\u3002");
    });
    logsButton.setAttribute("aria-expanded", "false");
    this.routeEl = this.contentEl.createDiv({ cls: "guz-blog-route", text: "\u9009\u62E9\u4E00\u7BC7 Blog \u6587\u7AE0\u5F00\u59CB\u9884\u89C8" });
    this.statusEl = this.contentEl.createDiv({ cls: "guz-blog-status", attr: { role: "status", "aria-live": "polite" } });
    this.logsEl = this.contentEl.createEl("pre", { cls: "guz-blog-logs" });
    this.logsEl.hidden = true;
    this.canvas = this.contentEl.createDiv({ cls: "guz-blog-canvas" });
    this.canvas.createDiv({ cls: "guz-blog-empty", text: "\u6253\u5F00 Blog \u7684 Markdown \u6587\u7AE0\uFF0C\u5373\u53EF\u5728\u8FD9\u91CC\u67E5\u770B\u5B9E\u9645\u7F51\u9875\u6392\u7248\u3002" });
    this.applyViewport();
    this.registerDomEvent(this.contentEl.win, "message", (event) => this.receive(event));
    if (this.plugin.activeArticle) void this.showFile(this.plugin.activeArticle);
  }
  async onClose() {
    this.closed = true;
    this.clearFrame();
    this.plugin.cancelSave();
    this.plugin.maybeStopServer();
  }
  hasFrame() {
    return this.frame !== null;
  }
  status(text) {
    if (this.closed || !this.statusEl) return;
    this.statusEl.setText(text);
    if (!this.logsEl.hidden) this.logsEl.setText(this.plugin.server.logs.join(""));
  }
  clearFrame() {
    ++this.revision;
    this.frame?.remove();
    this.frame = null;
    this.frameUrl = "";
    this.session = null;
  }
  applyViewport() {
    if (this.canvas) this.canvas.dataset.viewport = this.plugin.settings.viewport;
  }
  sendTheme() {
    if (this.frame && this.session) this.frame.contentWindow?.postMessage({
      channel: CHANNEL,
      token: this.session.token,
      type: "theme",
      value: this.plugin.settings.theme
    }, this.session.origin);
  }
  receive(event) {
    if (!this.session || !this.frame || event.source !== this.frame.contentWindow || event.origin !== this.session.origin) return;
    const data = event.data;
    if (data?.channel !== CHANNEL || data?.token !== this.session.token) return;
    if (data.type === "ready") {
      if (typeof data.path === "string" && data.path.startsWith("/") && !data.path.startsWith("//")) {
        this.frameUrl = new URL(data.path, this.session.origin).href;
        this.routeEl.setText(`${this.file?.path ?? ""} \u2192 ${data.path}`);
      }
      this.status("\u9884\u89C8\u5DF2\u66F4\u65B0 \xB7 \u4F7F\u7528 Blog \u539F\u751F\u6392\u7248");
      this.sendTheme();
    }
    if (data.type === "external" && typeof data.url === "string") {
      try {
        const url = new URL(data.url);
        if (["https:", "http:", "mailto:"].includes(url.protocol)) window.open(url.href, "_blank", "noopener");
      } catch {
      }
    }
  }
  async showFile(file, force = false) {
    if (this.closed) return;
    const revision = ++this.revision;
    this.file = file;
    if (!this.plugin.isInScope(file)) {
      this.clearFrame();
      this.routeEl.setText(`${file.path} \xB7 \u4E0D\u5728 Blog \u9884\u89C8\u8303\u56F4`);
      this.canvas.empty();
      this.canvas.createDiv({ cls: "guz-blog-empty", text: "\u6B64\u6587\u4EF6\u5939\u4F7F\u7528 Obsidian \u539F\u751F\u6E32\u67D3\u3002\u82E5\u8981\u5728 Blog \u9884\u89C8\u4E2D\u663E\u793A\uFF0C\u8BF7\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u52A0\u5165\u5B83\u7684\u6587\u4EF6\u5939\u8DEF\u5F84\u3002" });
      this.status("\u539F\u751F\u6E32\u67D3 \xB7 Blog \u9884\u89C8\u672A\u542F\u7528");
      this.plugin.maybeStopServer();
      return;
    }
    try {
      const { root, route } = this.plugin.route(file);
      this.routeEl.setText(`${file.path} \u2192 ${route}`);
      const session = await this.plugin.server.start(root, this.plugin.settings.nodePath, this.plugin.settings.port);
      if (this.closed || revision !== this.revision) return;
      const url = new URL(route, session.origin).href;
      if (!force && this.frame && this.frameUrl === url && this.session === session) return;
      this.frame?.remove();
      this.canvas.empty();
      this.session = session;
      this.frameUrl = url;
      this.frame = this.canvas.createEl("iframe", {
        cls: "guz-blog-frame",
        attr: {
          title: "Blog \u6587\u7AE0\u53D1\u5E03\u6548\u679C\u9884\u89C8",
          // A regular cross-origin iframe, with no Electron/Node privileges.
          sandbox: "allow-scripts allow-same-origin allow-popups",
          referrerpolicy: "no-referrer",
          src: url
        }
      });
      this.status("\u6B63\u5728\u6E32\u67D3\u6587\u7AE0\u2026");
    } catch (error) {
      if (this.closed || revision !== this.revision) return;
      this.clearFrame();
      this.canvas.empty();
      this.canvas.createDiv({ cls: "guz-blog-empty", text: String(error instanceof Error ? error.message : error) });
      this.status("\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\uFF0C\u53EF\u5728\u8BBE\u7F6E\u4E2D\u68C0\u67E5\u76EE\u5F55\u3001Node.js \u548C\u7AEF\u53E3\u3002");
      this.plugin.maybeStopServer();
    }
  }
  async refresh() {
    const file = this.follow ? this.plugin.activeArticle ?? this.file : this.file;
    if (file) await this.showFile(file, true);
    else this.status("\u8BF7\u5148\u5728 Obsidian \u4E2D\u6253\u5F00\u4E00\u7BC7 Blog \u6587\u7AE0\u3002");
  }
};
var BlogPreviewSettings = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Guztchian Blog Preview" });
    this.containerEl.createEl("p", { text: "\u4F7F\u7528\u672C\u5730 Astro \u5F00\u53D1\u670D\u52A1\u6E32\u67D3\u6587\u7AE0\u3002\u9996\u6B21\u6253\u5F00\u4F1A\u542F\u52A8\u670D\u52A1\uFF0C\u5173\u95ED\u6700\u540E\u4E00\u4E2A\u9884\u89C8\u5206\u680F\u540E\u81EA\u52A8\u505C\u6B62\u3002\u76EE\u5F55\u3001Node.js \u548C\u7AEF\u53E3\u4FEE\u6539\u540E\uFF0C\u70B9\u51FB\u201C\u4FDD\u5B58\u8FDE\u63A5\u8BBE\u7F6E\u201D\uFF0C\u518D\u5237\u65B0\u9884\u89C8\u3002" });
    let projectPath = this.plugin.settings.projectPath;
    let nodePath = this.plugin.settings.nodePath;
    let port = String(this.plugin.settings.port);
    new import_obsidian.Setting(this.containerEl).setName("Blog \u6839\u76EE\u5F55").setDesc("\u7559\u7A7A\u65F6\u4ECE\u5F53\u524D\u6587\u7AE0\u81EA\u52A8\u8BC6\u522B\uFF1B\u4E5F\u53EF\u586B\u5199\u76F8\u5BF9\u4E8E Obsidian \u4ED3\u5E93\u7684\u8DEF\u5F84\u6216\u5B8C\u6574\u8DEF\u5F84\u3002").addText((text) => text.setPlaceholder("\u4F8B\u5982 Blog/dogogod.github.io").setValue(projectPath).onChange((value) => {
      projectPath = value;
    }));
    let scope = this.plugin.settings.scopePaths.join(", ");
    new import_obsidian.Setting(this.containerEl).setName("\u6E32\u67D3\u8303\u56F4").setDesc("\u53EA\u5BF9\u8FD9\u4E9B\u6587\u4EF6\u5939\u542F\u7528 Blog \u9884\u89C8\uFF0C\u4F7F\u7528\u76F8\u5BF9\u4E8E Obsidian \u4ED3\u5E93\u7684\u8DEF\u5F84\uFF0C\u591A\u4E2A\u6587\u4EF6\u5939\u7528\u9017\u53F7\u5206\u9694\u3002\u8303\u56F4\u5916\u7684\u6587\u4EF6\u59CB\u7EC8\u4FDD\u7559 Obsidian \u539F\u751F\u6E32\u67D3\u3002").addText((text) => text.setPlaceholder("src/content/blog, src/content/spec/about").setValue(scope).onChange((value) => {
      scope = value;
    }));
    new import_obsidian.Setting(this.containerEl).setName("Node.js \u8DEF\u5F84").setDesc("\u7559\u7A7A\u4F7F\u7528\u7CFB\u7EDF node\u3002Windows \u53EF\u586B\u5199 C:\\Program Files\\nodejs\\node.exe\u3002\u9700\u8981 Node.js \u2265 22.12\u3002").addText((text) => text.setPlaceholder("node \u6216 node.exe \u5B8C\u6574\u8DEF\u5F84").setValue(nodePath).onChange((value) => {
      nodePath = value;
    }));
    new import_obsidian.Setting(this.containerEl).setName("\u672C\u5730\u9884\u89C8\u7AEF\u53E3").setDesc("\u9ED8\u8BA4 4323\uFF0C\u72EC\u7ACB\u4E8E\u5E38\u7528\u7684 4321\u3002\u4EC5\u76D1\u542C\u672C\u673A\uFF1B\u7AEF\u53E3\u51B2\u7A81\u65F6\u4F1A\u62A5\u9519\uFF0C\u4E0D\u4F1A\u5173\u95ED\u5176\u4ED6\u670D\u52A1\u3002").addText((text) => text.setValue(port).onChange((value) => {
      port = value;
    }));
    new import_obsidian.Setting(this.containerEl).addButton((button) => button.setButtonText("\u4FDD\u5B58\u8FDE\u63A5\u8BBE\u7F6E").setCta().onClick(async () => {
      try {
        const checkedPort = validPort(port);
        if (projectPath.trim()) findProject(this.plugin.vaultPath(), projectPath);
        this.plugin.settings.projectPath = projectPath.trim();
        this.plugin.settings.scopePaths = scope.split(",").map((item) => item.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/g, "")).filter(Boolean);
        if (!this.plugin.settings.scopePaths.length) throw new Error("\u8BF7\u81F3\u5C11\u586B\u5199\u4E00\u4E2A\u6E32\u67D3\u6587\u4EF6\u5939\u3002");
        this.plugin.settings.nodePath = nodePath.trim();
        this.plugin.settings.port = checkedPort;
        await this.plugin.saveSettings(true);
        new import_obsidian.Notice("\u5DF2\u4FDD\u5B58\u3002\u56DE\u5230 Blog \u9884\u89C8\u5206\u680F\uFF0C\u70B9\u51FB\u5237\u65B0\u3002");
      } catch (error) {
        new import_obsidian.Notice(String(error instanceof Error ? error.message : error));
      }
    }));
    new import_obsidian.Setting(this.containerEl).setName("\u53CA\u65F6\u4FDD\u5B58\u5E76\u6E32\u67D3").setDesc("\u4EC5\u5728\u6587\u7AE0\u6709\u6253\u5F00\u7684\u9884\u89C8\u65F6\uFF0C\u505C\u6B62\u8F93\u5165\u7247\u523B\u540E\u8C03\u7528 Obsidian \u539F\u751F\u4FDD\u5B58\u3002\u5173\u95ED\u540E\u7531 Obsidian \u81EA\u52A8\u4FDD\u5B58\u6216 Ctrl/Cmd+S \u89E6\u53D1\u66F4\u65B0\u3002").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoSave).onChange(async (value) => {
      this.plugin.settings.autoSave = value;
      this.plugin.cancelSave();
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(this.containerEl).setName("\u505C\u6B62\u8F93\u5165\u540E\u7684\u4FDD\u5B58\u95F4\u9694").setDesc("\u5355\u4F4D\u4E3A\u6BEB\u79D2\uFF1B\u9002\u5F53\u5EF6\u8FDF\u53EF\u907F\u514D\u6BCF\u4E2A\u6309\u952E\u90FD\u91CD\u65B0\u7F16\u8BD1\u3002").addDropdown((dropdown) => dropdown.addOptions({ "300": "300 ms", "500": "500 ms", "800": "800 ms", "1500": "1500 ms", "2500": "2500 ms" }).setValue(String(this.plugin.settings.saveDelay)).onChange(async (value) => {
      this.plugin.settings.saveDelay = Number(value);
      await this.plugin.saveSettings();
    }));
    this.containerEl.createEl("p", { text: "\u652F\u6301 Blog \u4E2D\u73B0\u6709\u7684 .md \u8BED\u6CD5\u4E0E\u4E2D\u82F1\u6587\u6587\u7AE0\uFF1B\u9884\u89C8\u5305\u542B\u8349\u7A3F\u3002Obsidian \u7684\u53CC\u94FE\u3001\u5D4C\u5165\u8BED\u6CD5\u548C\u63D2\u4EF6\u4E13\u7528\u4EE3\u7801\u5757\uFF0C\u53EA\u6709\u5728 Blog \u81EA\u8EAB\u652F\u6301\u65F6\u624D\u4F1A\u51FA\u73B0\u5728\u53D1\u5E03\u7ED3\u679C\u4E2D\u3002" });
  }
};
