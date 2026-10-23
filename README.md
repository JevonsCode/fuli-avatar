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
  traits: { palette: 0, hair: 2, eyes: 1, accessory: 1 }
});
```

`getTraits(seed, overrides)` 返回最终的整数特征。合法范围：palette 0–5, skin 0–4, hair 0–9, eyes 0–7, mouth 0–5, outfit 0–9, accessory 0–10, decoration 0–2。非法覆盖值会被忽略。

颜色采用六组预先协调的背景、发色、服装和点缀色，避免无约束随机颜色。理论参数组合为 4,752,000，不代表每组在所有尺寸下都同等容易区分；帽子等配件可能遮住部分发型。随机 seed 有可能撞到同一组合，不应将头像作为唯一身份验证手段。

## 未来 FULI 接入建议（尚未集成）

1. 保留现有固定头像映射及优先级，不替换现有角色。
2. 新 agent 创建时保存稳定 seed，例如不可变 agent ID。
3. 保存 `avatarVersion: '3'`、seed 和用户选择的 traits。编辑 seed 会改变外观。
4. 没有固定头像时，才调用生成器作为 fallback。
5. 若使用 img 标签，转换成 Blob URL 并在不用时 revoke；或者编码为 data:image/svg+xml URL。

同一版本、同一 seed 和 traits 的输出稳定。升级生成算法应增加版本并保留旧版渲染器或已生成资产，不能静默替换已有身份。

## 安全与隐私

seed 只参与哈希，不插入 XML。颜色和路径均来自内置枚举，size 有数值边界。不加载外部图片、字体或脚本。PNG 在本地 canvas 中导出，下载文件名经过过滤。

UI 的透明开关影响导出，预览卡片自身仍为白色。PNG 输出 1024×1024；SVG 无损缩放。官网中的“下载生成器源码”仅下载本模块，不等于已发布 npm 包。

## 开发

`npm test` 运行确定性、组合数量、输入安全和选项测试。

`npm run dev` 在 4173 端口启动静态站点（需要 Python 3）。

源码仓库：https://github.com/JevonsCode/fuli-avatar 。尚未发布 npm；包为 private，避免误发布。许可说明见文末。

## v0.3 / 渲染版本 3

修复前后头发层的颜色和轮廓一致性，白发不会再露出深色头发底层。整个人物与穿戴物统一缩小到原来的 84%，保留背景尺寸。小礼帽按参考图改为头顶侧面的斜戴款，不再横盖额头。耳机耳罩使用固定耳部锚点，头梁随蓬松发型扩展。

服装增加至 10 款，分别构造领口、肩线与细节：口袋 T 恤、工装夹克、纽扣开衫、海魂条纹、连帽衫、翻领衬衫、背带裤、高领针织、橄榄球衫、插肩卫衣。

小装饰为单选的 11 款：无、圆框眼镜、耳机、斜戴小礼帽、毛线帽、发夹、耳饰、金链子、经典墨镜、星星墨镜、猫眼墨镜。删除独立 jewelry 参数及吊坠款，金链子仅由 accessory: 7 选择。旧 jewelry 参数不再参与渲染。

VERSION 为 3，外观和随机特征使用 `3:` 命名空间。升级可能改变 seed 对应外观；已有身份应保存原版本的模块或已生成 SVG。本模块不包含旧版渲染器。四张原始 FULI 头像没有修改。

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

本地打包运行 `npm pack`；安装本地包可用 `npm install ./fuli-avatar-0.3.0.tgz`，然后 `import { createAvatar } from 'fuli-avatar'`。这不表示 npm registry 上已有同名包。`private: true` 防止误发布。

`npm run build` 仅用 Node 内置文件 API，从 ESM 生成浏览器 IIFE；`npm test` 检查两者输出一致。不要手工修改生成文件。


## GitHub Pages 部署准备

`.github/workflows/pages.yml` 在 `main` 更新后构建、测试并部署 `dist/`，没有依赖安装步骤。首次需在仓库 Settings → Pages 中选择 GitHub Actions 作为发布源。首次部署与后续运行结果可在仓库 Actions 查看。

GitHub Pages 只能托管静态内容，不能提供每个 HTTP 请求实时生成不同 SVG 的服务端 `/random` 接口。网站仍可在浏览器里随机生成头像；项目 logo 使用本生成器随机选定后保存的固定人物 `dist/logo.svg`，不需要外部服务，也不会改变现有 agent 的身份。

部署成功后，站点相对路径 `avatar.js` 是 ESM，`fuli-avatar.browser.js` 是浏览器全局版本，`logo.svg` 是固定 logo。集成应用建议固定版本并把生成器放入自己的源码，而不是运行时依赖第三方 CDN。npm 尚未发布。

### 许可说明

项目未选择开源许可证，公开源码不等于授予通用再分发许可。本项目不包含或许可原 FULI 的四张固定角色图；logo 是本模块生成的 SVG。不要把参考图片或现有角色资产视为随本项目授权。
