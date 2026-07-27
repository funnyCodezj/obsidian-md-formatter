# MD Formatter — Obsidian 排版美化插件

[中文](#中文) | [English](#english)

![Obsidian](https://img.shields.io/badge/Obsidian-1.7+-7C3AED) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 中文

一键美化 Markdown 文档排版，支持自定义 YAML 规则模板。不修改文字内容，只规范格式。

### 功能特性

- **右键菜单** — 编辑器中右键 → "美化 Markdown 排版"
- **命令面板** — `Ctrl+P` 搜索 "美化" 可执行当前文件或批量文件夹
- **自定义规则** — YAML 模板，可自由调整间距、缩进、对齐等全部参数
- **批量处理** — 一键美化整个文件夹下所有 `.md` 文件
- **默认规则** — 开箱即用，覆盖标题、列表、代码块、表格、引用、分隔线、段落等

### 默认美化规则

| 类别 | 规则 |
|------|------|
| 标题 | H2 起步、前后空行、禁止跳级 |
| 列表 | 统一 `-` 符号、层级缩进对齐 |
| 代码块 | 清理多余空格、前后空行 |
| 表格 | 自动对齐列宽 |
| 引用块 | 合并相邻块、规范前缀 |
| 分隔线 | 统一 `---`、前后空行 |
| 段落 | 段落间空行、中英文自动加空格 |
| Front Matter | 保留不动 |

### 安装

**社区插件市场（待上架）**

1. 打开 Obsidian 设置 → 第三方插件 → 浏览
2. 搜索 "MD Formatter" → 安装 → 启用

**手动安装**

1. 从 [Releases](https://github.com/funnyCodezj/obsidian-md-formatter/releases) 下载 `main.js`、`manifest.json`、`styles.css`
2. 放入 `<仓库>/.obsidian/plugins/md-formatter/` 目录
3. 在 Obsidian 设置中启用插件

**开发构建**

```bash
git clone https://github.com/funnyCodezj/obsidian-md-formatter.git
cd obsidian-md-formatter
npm install
npm run build    # 生产构建
npm run dev      # 开发模式（热更新）
```

### 自定义规则

在插件设置页面修改 YAML 模板，保存后即时生效。

```yaml
heading:
  minLevel: 2          # 最低从 H2 开始
  blankBefore: 1       # 标题前空行
  blankAfter: 1        # 标题后空行

list:
  unorderedMarker: "-"  # 无序列表符号
  indent: 2             # 缩进空格数

spacing:
  paragraphGap: 1       # 段落间距
  chineseEnglishSpace: true  # 中英文自动空格
```

### 技术栈

| 层次 | 技术 |
|------|------|
| 语言 | TypeScript 5.4 |
| 构建 | esbuild |
| 解析 | js-yaml |
| 框架 | Obsidian Plugin API |

### 许可证

MIT

---

## English

One-click Markdown formatting for Obsidian with customizable YAML rules. Only formats layout — never modifies text content.

### Features

- **Context Menu** — Right-click → "Format Markdown"
- **Command Palette** — `Ctrl+P` → format current file or entire folder
- **Custom Rules** — Editable YAML template for spacing, indentation, alignment, and more
- **Batch Processing** — Format all `.md` files in a folder at once
- **Sensible Defaults** — Covers headings, lists, code blocks, tables, quotes, horizontal rules, and paragraphs

### Installation

**Community Plugin (coming soon)**

1. Settings → Community Plugins → Browse
2. Search "MD Formatter" → Install → Enable

**Manual**

1. Download `main.js`, `manifest.json`, `styles.css` from [Releases](https://github.com/funnyCodezj/obsidian-md-formatter/releases)
2. Place them in `<vault>/.obsidian/plugins/md-formatter/`
3. Enable in Obsidian settings

**Development**

```bash
git clone https://github.com/funnyCodezj/obsidian-md-formatter.git
cd obsidian-md-formatter
npm install
npm run build    # production
npm run dev      # watch mode
```

### Tech Stack

| Layer | Tech |
|-------|------|
| Language | TypeScript 5.4 |
| Bundler | esbuild |
| Parser | js-yaml |
| Framework | Obsidian Plugin API |

### License

MIT
*（内容由AI生成，仅供参考）*
