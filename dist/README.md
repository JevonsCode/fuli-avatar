# fuli-avatar

一个独立、零依赖的 ES Module。用稳定 seed 生成 FULI 风格的 SVG 卡通半身头像。现有 Jefa、Bole、Tonborg、Astro 头像不包含在生成器中，也未被修改。

## 使用

将 `avatar.js` 放入项目，在浏览器或 Node.js 中导入：

```js
import { createAvatar, getTraits, palettes, options } from './avatar.js';
const svg = createAvatar('agent-001', { size: 256 });
```

返回完整 SVG 字符串。没有网络请求、模型调用、依赖或后端。

```js
const svg = createAvatar('agent-001', {
  size: 1024,             // integer 16–4096; default 256
  transparent: false,     // omit background fill when true
  rounded: true,          // rounded background; false for square
  traits: { palette: 0, hair: 2, eyes: 1, accessory: 1 },
  version: 4,             // default; 3 redraws a stored v3 identity
  eggs: false             // true: about 1 in 10 seeds gets an animated easter egg (v4 only)
});
```

名字与彩蛋都由 seed 决定：

```js
import { nameFor, nameDetails, getEgg, eggs } from './avatar.js';
nameFor('agent-001');                      // 'Rowan Reed'
nameFor('agent-001', { locales: ['zh'] }); // 只用中文名
nameDetails('agent-001');                  // { name, locale, given, family }
getEgg('hello-fuli');                      // { id: 'star', name: '小星星', en: 'Little star' } 或 null
```

`getTraits(seed, overrides, { version })` 返回最终的整数特征。渲染版本 4 的合法范围：palette 0–5, skin 0–4, hairColor 0–5, hair 0–7, eyes 0–2, brows 0–2, mouth 0–2, outfit 0–6, accessory 0–6。非法覆盖值会被忽略。`partNames` 给出每个部件的中文名称，顺序与特征值一致。

颜色采用六组预先协调的背景、服装和点缀色，另有五种肤色和六种发色，避免无约束随机颜色。渲染版本 4 的理论参数组合为 1,905,120，不代表每组在所有尺寸下都同等容易区分；帽子等配件可能遮住部分发型。随机 seed 有可能撞到同一组合，不应将头像作为唯一身份验证手段。

## 未来 FULI 接入建议（尚未集成）

1. 保留现有固定头像映射及优先级，不替换现有角色。
2. 新 agent 创建时保存稳定 seed，例如不可变 agent ID。
3. 保存 `avatarVersion: '4'`（或已有身份的 `'3'`）、seed 和用户选择的 traits。编辑 seed 会改变外观。
4. 没有固定头像时，才调用生成器作为 fallback。
5. 若使用 img 标签，转换成 Blob URL 并在不用时 revoke；或者编码为 data:image/svg+xml URL。

同一版本、同一 seed 和 traits 的输出稳定。升级生成算法应增加版本并保留旧版渲染器或已生成资产，不能静默替换已有身份。

## 安全与隐私

seed 只参与哈希，不插入 XML。颜色和路径均来自内置枚举，size 有数值边界。不加载外部图片、字体或脚本。PNG 在本地 canvas 中导出，下载文件名经过过滤。

UI 的透明开关影响导出，预览卡片自身仍为白色。PNG 输出 1024×1024；SVG 无损缩放。官网中的“下载生成器源码”仅下载本模块，不等于已发布 npm 包。

## 开发

`npm run build` 从 `src/` 生成 `dist/avatar.js` 与 `dist/fuli-avatar.browser.js`。`npm test` 运行确定性、组合数量、输入安全、v3/v4 快照、彩蛋、名字和选项测试。

`npm run dev` 在 4173 端口启动静态站点（需要 Python 3）。

源码仓库：https://github.com/JevonsCode/fuli-avatar 。尚未发布 npm；包为 private，避免误发布。许可说明见文末。

## 风格规则

渲染版本 4 以四张内置头像（Jefa、Bole、Tonborg、Astro）为参照，新增部件应遵守：

- 构图：头部与头发在 256 视图中以下巴 (128,182) 为中心放大 1.15 倍，脸宽约占画面 55%；肩膀从底边进入，领口可见。头顶最高点不得高于原坐标 y 27，否则会被裁切。
- 线条：统一深墨色 `#22303D` 外轮廓，平涂填色，脸内不画轮廓线。背景为柔和的同色系浅底。
- 眼睛：默认是大的深色椭圆眼，右上方一个小白色高光，加一笔短上眼睑。其余只保留友好款：笑眯眯的 ^ ^ 弧线、带高光的圆眼。不使用半闭、困倦或不耐烦的眼型。
- 嘴巴：只有微笑、开心张嘴笑和温和坏笑。不使用平嘴、撇嘴或下垂嘴角。保留浅色腮红。
- 头发：每款都有 2–3 个突出头顶轮廓的发尖、一笔头顶高光和垂到额头的刘海发束；避免光滑的头盔状发型。发束尖端不得碰到眉毛和眼睛。
- 颜色：低饱和、经过挑选的色调，不使用糖果色。
- 配饰：眼镜、耳机、毛线帽、围巾、发夹画在脸部上层，但不能遮住眼睛。
- 小尺寸：48 px 及以下去掉发丝细线、刘海发束、纽扣、帽绳、衣褶和高光点；保留外轮廓、眼睛、笑容和发型剪影。

## v0.5 / 名字、彩蛋和更好玩的官网

渲染版本仍为 4，没有新增渲染版本。不传 `eggs` 时，v4 输出与 v0.4 逐字节一致（`tests/fixtures/v4-snapshots.json` 中的 20 个快照）；v3 忽略彩蛋，仍与 13 个 v3 快照一致。

**名字。** `nameFor(seed, { locales })` 从西语、中文、英文三组精选名单里组合出一个友好的名字，例如 Lucía Navarro、林知夏、Milo Reed。默认三种语言混合，`locales` 可收窄为 `['es']`、`['zh']`、`['en']` 或其组合，未知值被忽略。名字使用独立的 `name:` 命名空间，不影响外观；中文名的姓不会与名重字。名单刻意避开知名人物的常见姓名组合，但随机组合无法逐一核对所有真实人物；名字是展示用的昵称，不是唯一身份，不同 seed 可能同名。

**彩蛋。** `createAvatar(seed, { eggs: true })` 让约 1/10 的 seed 带上一个会动的小装饰；`{ egg: 'blink' }` 可强制指定一个（用于预览和测试）。是否出现、出现哪个只由 seed 决定（独立的 `egg:` 命名空间，不改变任何特征抽样）。与当前特征冲突的彩蛋（例如毛线帽下的呆毛）会顺延到下一个合适的彩蛋。动画用 SVG 内联 CSS 实现：静止姿态就是 SVG 本身，所以 PNG 导出、不支持 CSS 动画的渲染器和 `prefers-reduced-motion: reduce` 都显示静止的装饰（眨眼在减少动态时变成一个静止的 wink）。`eggs` 导出全部彩蛋的 `{ id, name, en }`，`eggRate` 为 0.1。

| id | 名称 | 位置 | 动效 |
| --- | --- | --- | --- |
| blink | 眨眨眼 Blink | 眼睛 | 每 4.8 秒眨一次眼 |
| sparkle | 闪闪亮 Sparkle | 右上角 | 三颗四角星交替闪烁 |
| leaf | 落叶飘飘 Falling leaf | 背景 | 两片叶子在人物身后摇摆飘落 |
| star | 小星星 Little star | 左上角 | 一颗有眼睛的小星星上下浮动 |
| ahoge | 呆毛 Cowlick | 头顶 | 一缕卷曲发丝左右摇摆（不出现在毛线帽、丸子头、飞机头上） |
| clouds | 云朵慢游 Drifting clouds | 背景 | 三朵云缓慢漂移 |
| tophat | 迷你礼帽 Tiny top hat | 头顶一侧 | 小礼帽轻轻摇晃（不与耳机、毛线帽同时出现） |
| hearts | 冒爱心 Floating hearts | 两侧 | 小爱心冒出、上升、淡出 |

内联到页面时，彩蛋的 `<style>` 只使用 `fa-` 前缀的类名和关键帧，多个头像同页不会互相冲突。

**官网。** 页头 logo 和 favicon 每次加载都是一个新生成的角色，`logo.svg` 保留为无 JS 时的静态后备。工坊显示每个角色的名字和名字语言；「再来一个」按钮（或按 R 键）让身体、头发、脸和配饰依次落位；伙伴列表显示名字。官网开启 `eggs`，但不在页面上提起它：带彩蛋的角色只在名字下方显示一个图标加该彩蛋自己的名字（如「✦ 眨眨眼」），伙伴卡片上是一个安静的 ✦，读屏文字只描述角色在做什么（如「还在眨眼」）；页面不写出现概率，也不保存任何收集记录。减少动态偏好下不播放组装和装饰动画。下载 SVG 保留动画，PNG 是静止画面。

## v0.4 / 渲染版本 4

默认渲染版本改为 4，`VERSION` 为 `'4'`，`VERSIONS` 为 `['3', '4']`。传入 `{ version: 3 }` 会用内置的 v3 渲染器重画已保存的身份，输出与 v0.3 逐字节一致（`tests/fixtures/v3-snapshots.json` 中的 13 个快照）。静态 `logo.svg` 仍是 v3 身份。

版本 4 的部件：发色 6 种；发型 8 款（波波头、碎短发、侧分大波浪、中分长发、清爽短发、丸子头、自然卷、后梳飞机头）；眼睛 3 款（亮眼睛、笑眯眯、圆眼睛）；眉毛 3 款；嘴巴 3 款（微笑、开心、坏笑）；服装 7 款（圆领卫衣、翻领衬衫、开衫、西装外套、连帽衫、高领毛衣、T 恤）；小装饰 7 款（无、圆框眼镜、方框眼镜、耳机、毛线帽、围巾、发夹）。

源码拆分在 `src/v4/`，由 `scripts/build-browser.js` 合并为单文件 ESM 和浏览器 IIFE，仍然零依赖。版本 4 的 seed 使用 `4:` 命名空间，同一 seed 在 v3 和 v4 下外观不同。

## v0.3 / 渲染版本 3

修复前后头发层的颜色和轮廓一致性，白发不会再露出深色头发底层。整个人物与穿戴物统一缩小到原来的 84%，保留背景尺寸。小礼帽按参考图改为头顶侧面的斜戴款，不再横盖额头。耳机耳罩使用固定耳部锚点，头梁随蓬松发型扩展。

服装增加至 10 款，分别构造领口、肩线与细节：口袋 T 恤、工装夹克、纽扣开衫、海魂条纹、连帽衫、翻领衬衫、背带裤、高领针织、橄榄球衫、插肩卫衣。

小装饰为单选的 11 款：无、圆框眼镜、耳机、斜戴小礼帽、毛线帽、发夹、耳饰、金链子、经典墨镜、星星墨镜、猫眼墨镜。删除独立 jewelry 参数及吊坠款，金链子仅由 accessory: 7 选择。旧 jewelry 参数不再参与渲染。

VERSION 为 3，外观和随机特征使用 `3:` 命名空间。自 v0.4 起，v3 渲染器保留在 `src/v3.js`，通过 `{ version: 3 }` 调用。四张原始 FULI 头像没有修改。

验证包括确定性、安全输入、ESM/IIFE 一致性、全发型白发层、统一缩放、帽子结构、装饰互斥、服装组合和静态 SVG 栅格化检查。静态栅格化不是浏览器交互或真实下载验证。

## 浏览器直接引用 / CDN 预备

下载 `fuli-avatar.browser.js`，放在你自己的网站静态目录：

```html
<div id="my-avatar"></div>
<script src="/assets/fuli-avatar.browser.js"></script>
<script>
  document.getElementById('my-avatar').innerHTML =
    FuliAvatar.createAvatar('agent-001', { size: 256 });
</script>
```

全局对象 `FuliAvatar` 提供与 ES Module 相同的 API。无需构建工具或运行时依赖。ESM 使用 `import { createAvatar } from './avatar.js'`。

项目已按 npm 包结构准备，但尚未发布到 npm，不存在已验证的 unpkg/jsDelivr 地址。GitHub Pages 部署静态演示与 JS 模块；不要把浮动 main 或网站路径当成不可变版本 CDN。已有私有演示站点不是公共 CDN。

本地打包运行 `npm pack`；安装本地包可用 `npm install ./fuli-avatar-0.5.0.tgz`，然后 `import { createAvatar } from 'fuli-avatar'`。这不表示 npm registry 上已有同名包。`private: true` 防止误发布。

`npm run build` 仅用 Node 内置文件 API，从 ESM 生成浏览器 IIFE；`npm test` 检查两者输出一致。不要手工修改生成文件。


## GitHub Pages 部署准备

`.github/workflows/pages.yml` 在 `main` 更新后构建、测试并部署 `dist/`，没有依赖安装步骤。首次需在仓库 Settings → Pages 中选择 GitHub Actions 作为发布源。首次部署与后续运行结果可在仓库 Actions 查看。

GitHub Pages 只能托管静态内容，不能提供每个 HTTP 请求实时生成不同 SVG 的服务端 `/random` 接口。网站仍可在浏览器里随机生成头像；页头 logo 由页面脚本在每次加载时随机生成；`dist/logo.svg` 是本生成器选定后保存的固定人物，用作无 JS 后备和默认 favicon，不需要外部服务，也不会改变现有 agent 的身份。

部署成功后，站点相对路径 `avatar.js` 是 ESM，`fuli-avatar.browser.js` 是浏览器全局版本，`logo.svg` 是固定的后备 logo。集成应用建议固定版本并把生成器放入自己的源码，而不是运行时依赖第三方 CDN。npm 尚未发布。

### 许可说明

项目未选择开源许可证，公开源码不等于授予通用再分发许可。本项目不包含或许可原 FULI 的四张固定角色图；logo 是本模块生成的 SVG。不要把参考图片或现有角色资产视为随本项目授权。
