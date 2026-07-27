---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 8ff42e13d291600a317d0ceea863cafe_1e81eeb9899711f1b66e525400e6dd8f
    ReservedCode1: ASNKLc34i0u9ksqEaitBTWjSXvcp8+1qonLgND4HqNYSmHpWdjU64A2bCXwr1xy7kBPp+FXmfg3rFx+iYtumI9LovhxjUHDYZuQZmzFdcVgt3scTbOShwFM1FozBr8xnGukCnftwc3INWI3Pn3ZJe47hQj+rWwJZxRE0T/iQG1kv1lPvuICjVAuoB5g=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 8ff42e13d291600a317d0ceea863cafe_1e81eeb9899711f1b66e525400e6dd8f
    ReservedCode2: ASNKLc34i0u9ksqEaitBTWjSXvcp8+1qonLgND4HqNYSmHpWdjU64A2bCXwr1xy7kBPp+FXmfg3rFx+iYtumI9LovhxjUHDYZuQZmzFdcVgt3scTbOShwFM1FozBr8xnGukCnftwc3INWI3Pn3ZJe47hQj+rWwJZxRE0T/iQG1kv1lPvuICjVAuoB5g=
---

# MD Formatter — Obsidian 排版美化插件

一键美化 Markdown 文档排版，支持自定义规则模板。不修改文字内容，只规范格式。

---

## 功能

- **右键菜单**：编辑器中右键 → "美化 MD 排版"
- **命令面板**：`Ctrl+P` → "美化当前 MD 排版" / "美化当前文件夹"
- **自定义规则**：YAML 模板，可自由调整所有排版参数
- **批量处理**：一键美化整个文件夹下所有 `.md` 文件

## 默认美化规则

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

## 安装

### 手动安装

1. 从 [Releases](https://github.com/yourusername/obsidian-md-formatter/releases) 下载 `main.js`、`manifest.json`、`styles.css`
2. 放入仓库的 `.obsidian/plugins/md-formatter/` 目录
3. 在 Obsidian 设置中启用插件

### 开发构建

```bash
npm install
npm run build    # 生产构建
npm run dev      # 开发模式（热更新）
```

## 自定义规则

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

## 许可证

MIT
*（内容由AI生成，仅供参考）*
