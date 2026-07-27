/** 默认排版规则 */
export interface MdRules {
  heading: {
    minLevel: number;
    maxLevel: number;
    blankBefore: number;
    blankAfter: number;
    forbidSkip: boolean;
  };
  list: {
    unorderedMarker: string;
    indent: number;
    blankBetweenItems: boolean;
  };
  codeBlock: {
    fenceStyle: string;
    blankAround: number;
  };
  table: {
    alignColumns: boolean;
    padding: number;
  };
  blockquote: {
    blankAround: number;
    mergeAdjacent: boolean;
  };
  horizontalRule: {
    style: string;
    blankAround: number;
  };
  spacing: {
    paragraphGap: number;
    chineseEnglishSpace: boolean;
    trimTrailing: boolean;
  };
  link: {
    style: 'inline' | 'reference';
  };
  frontMatter: {
    preserve: boolean;
    blankAfter: number;
  };
}

export const DEFAULT_RULES: MdRules = {
  heading: {
    minLevel: 2,
    maxLevel: 6,
    blankBefore: 1,
    blankAfter: 1,
    forbidSkip: true,
  },
  list: {
    unorderedMarker: '-',
    indent: 2,
    blankBetweenItems: false,
  },
  codeBlock: {
    fenceStyle: '```',
    blankAround: 1,
  },
  table: {
    alignColumns: true,
    padding: 1,
  },
  blockquote: {
    blankAround: 1,
    mergeAdjacent: true,
  },
  horizontalRule: {
    style: '---',
    blankAround: 1,
  },
  spacing: {
    paragraphGap: 1,
    chineseEnglishSpace: true,
    trimTrailing: true,
  },
  link: {
    style: 'inline',
  },
  frontMatter: {
    preserve: true,
    blankAfter: 1,
  },
};

export const DEFAULT_RULES_YAML = `# MD 排版美化器 - 规则模板
# 修改后保存，立即生效

heading:
  minLevel: 2          # 最低从 H2 开始
  maxLevel: 6
  blankBefore: 1       # 标题前空行数
  blankAfter: 1        # 标题后空行数
  forbidSkip: true     # 禁止标题跳级

list:
  unorderedMarker: "-"  # 无序列表符号：- / * / +
  indent: 2             # 缩进空格数
  blankBetweenItems: false  # 列表项间是否空行

codeBlock:
  fenceStyle: "\`\`\`"  # 围栏符号
  blankAround: 1        # 前后空行数

table:
  alignColumns: true    # 对齐列宽
  padding: 1            # 列内边距空格数

blockquote:
  blankAround: 1        # 前后空行数
  mergeAdjacent: true   # 合并相邻引用块

horizontalRule:
  style: "---"          # --- / *** / ___
  blankAround: 1

spacing:
  paragraphGap: 1       # 段落间空行数
  chineseEnglishSpace: true  # 中英文间自动加空格
  trimTrailing: true    # 去除行尾空格

link:
  style: "inline"       # inline / reference

frontMatter:
  preserve: true        # 保留 YAML front matter
  blankAfter: 1         # front matter 后空行数
`;
