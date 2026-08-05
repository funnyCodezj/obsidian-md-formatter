import { MdRules, DEFAULT_RULES } from './default-rules';

// ============================ 块类型 ============================

interface Block {
  type: 'blank' | 'heading' | 'paragraph' | 'horizontalRule' | 'codeBlock' | 'table' | 'blockquote' | 'list' | 'frontMatter';
  [key: string]: unknown;
}

interface BlankBlock extends Block {
  type: 'blank';
  count: number;
}

interface HeadingBlock extends Block {
  type: 'heading';
  level: number;
  text: string;
}

interface ParagraphBlock extends Block {
  type: 'paragraph';
  text: string;
}

interface HrBlock extends Block {
  type: 'horizontalRule';
  marker: string;
}

interface CodeBlockBlock extends Block {
  type: 'codeBlock';
  lines: string[];
}

interface TableBlock extends Block {
  type: 'table';
  lines: string[];
}

interface BlockquoteBlock extends Block {
  type: 'blockquote';
  lines: string[];
}

interface ListBlock extends Block {
  type: 'list';
  ordered: boolean;
  lines: string[];
}

interface FrontMatterBlock extends Block {
  type: 'frontMatter';
  lines: string[];
}

type AnyBlock =
  | BlankBlock
  | HeadingBlock
  | ParagraphBlock
  | HrBlock
  | CodeBlockBlock
  | TableBlock
  | BlockquoteBlock
  | ListBlock
  | FrontMatterBlock;

// ============================ 排版引擎 ============================

export class FormatterEngine {
  rules: MdRules;

  constructor(rules?: Partial<MdRules>) {
    this.rules = this.deepMerge(DEFAULT_RULES, rules || {});
  }

  private deepMerge(base: MdRules, overrides: Partial<MdRules>): MdRules {
    const result = { ...base };
    for (const key of Object.keys(base) as (keyof MdRules)[]) {
      if (overrides[key] && typeof base[key] === 'object') {
        (result as Record<string, unknown>)[key] = {
          ...base[key],
          ...(overrides[key] as Record<string, unknown>),
        };
      }
    }
    return result;
  }

  format(text: string): string {
    const lines = text.split('\n');
    const blocks = this.parseBlocks(lines);
    const processed = this.applyRules(blocks);
    return this.render(processed);
  }

  // ---- 解析 ----

  parseBlocks(lines: string[]): AnyBlock[] {
    const blocks: AnyBlock[] = [];
    let i = 0;

    // front matter
    if (lines[0]?.trim() === '---') {
      const fmEnd = lines.indexOf('---', 1);
      if (fmEnd > 0) {
        blocks.push({ type: 'frontMatter', lines: lines.slice(0, fmEnd + 1) });
        i = fmEnd + 1;
      }
    }

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 空行
      if (trimmed === '') {
        let count = 0;
        while (i < lines.length && lines[i].trim() === '') { count++; i++; }
        blocks.push({ type: 'blank', count });
        continue;
      }

      // 代码块
      if (trimmed.startsWith('```')) {
        const codeLines = [line];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) { codeLines.push(lines[i]); i++; }
        blocks.push({ type: 'codeBlock', lines: codeLines });
        continue;
      }

      // 分隔线
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        blocks.push({ type: 'horizontalRule', marker: trimmed.charAt(0) });
        i++;
        continue;
      }

      // 标题
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        blocks.push({
          type: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2],
        });
        i++;
        continue;
      }

      // 表格
      if (trimmed.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        blocks.push({ type: 'table', lines: tableLines });
        continue;
      }

      // 引用块
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith('>') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('>')))
        ) {
          quoteLines.push(lines[i]);
          i++;
        }
        blocks.push({ type: 'blockquote', lines: quoteLines });
        continue;
      }

      // 无序列表
      if (/^(\s*)[-*+]\s+/.test(line)) {
        const listLines = this.collectListLines(lines, i, (l) => /^(\s*)[-*+]\s+/.test(l));
        i += listLines.length;
        blocks.push({ type: 'list', ordered: false, lines: listLines });
        continue;
      }

      // 有序列表
      if (/^(\s*)\d+\.\s+/.test(line)) {
        const listLines = this.collectListLines(lines, i, (l) => /^(\s*)\d+\.\s+/.test(l));
        i += listLines.length;
        blocks.push({ type: 'list', ordered: true, lines: listLines });
        continue;
      }

      // 段落
      blocks.push({ type: 'paragraph', text: line });
      i++;
    }

    return blocks;
  }

  private collectListLines(
    lines: string[],
    start: number,
    isItem: (line: string) => boolean
  ): string[] {
    const result: string[] = [];
    let i = start;
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (isItem(lines[i])) {
        result.push(lines[i]);
        i++;
      } else if (trimmed === '') {
        // 空行可能是列表项之间或列表结束
        if (i + 1 < lines.length && isItem(lines[i + 1])) {
          result.push(lines[i]);
          i++;
        } else {
          break;
        }
      } else {
        // 续行
        result.push(lines[i]);
        i++;
      }
    }
    return result;
  }

  // ---- 规则应用 ----

  applyRules(blocks: AnyBlock[]): AnyBlock[] {
    const rules = this.rules;
    const result: AnyBlock[] = [];

    let i = 0;
    while (i < blocks.length) {
      const block = blocks[i];

      switch (block.type) {
        case 'heading': {
          this.ensureBlankBefore(result, rules.heading.blankBefore);
          const level = Math.max(rules.heading.minLevel, Math.min(block.level, rules.heading.maxLevel));
          result.push({ ...block, level });
          this.ensureBlankAfter(result, rules.heading.blankAfter);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'horizontalRule': {
          this.ensureBlankBefore(result, rules.horizontalRule.blankAround);
          result.push({ ...block, marker: rules.horizontalRule.style.charAt(0) });
          this.ensureBlankAfter(result, rules.horizontalRule.blankAround);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'codeBlock': {
          this.ensureBlankBefore(result, rules.codeBlock.blankAround);
          result.push({
            ...block,
            lines: this.formatCodeBlock(block.lines),
          });
          this.ensureBlankAfter(result, rules.codeBlock.blankAround);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'table': {
          this.ensureBlankBefore(result, 1);
          const lines = rules.table.alignColumns
            ? this.alignTable(block.lines, rules.table.padding)
            : block.lines;
          result.push({ ...block, lines });
          this.ensureBlankAfter(result, 1);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'blockquote': {
          this.ensureBlankBefore(result, rules.blockquote.blankAround);
          result.push({
            ...block,
            lines: this.cleanBlockquote(block.lines),
          });
          this.ensureBlankAfter(result, rules.blockquote.blankAround);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'list': {
          this.ensureBlankBefore(result, 1);
          result.push({
            ...block,
            lines: this.formatList(block.lines, block.ordered, rules),
          });
          this.ensureBlankAfter(result, 1);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        case 'paragraph': {
          const prev = result[result.length - 1];
          if (prev && prev.type === 'paragraph') {
            this.ensureBlankBefore(result, rules.spacing.paragraphGap);
          } else if (prev && prev.type !== 'blank') {
            this.ensureBlankBefore(result, 1);
          }
          let text = block.text;
          if (rules.spacing.chineseEnglishSpace) {
            text = this.addChineseEnglishSpace(text);
          }
          if (rules.spacing.trimTrailing) {
            text = text.trimEnd();
          }
          result.push({ ...block, text });
          break;
        }

        case 'frontMatter': {
          result.push(block);
          this.ensureBlankAfter(result, rules.frontMatter.blankAfter);
          while (i + 1 < blocks.length && blocks[i + 1].type === 'blank') i++;
          break;
        }

        default:
          result.push(block);
          break;
      }
      i++;
    }

    return result;
  }

  // ---- 间距辅助 ----

  private ensureBlankBefore(blocks: AnyBlock[], count: number): void {
    if (count <= 0) return;
    const last = blocks[blocks.length - 1];
    if (last && last.type === 'blank') {
      last.count = Math.max(last.count, count);
    } else {
      blocks.push({ type: 'blank', count });
    }
  }

  private ensureBlankAfter(blocks: AnyBlock[], count: number): void {
    if (count > 0 && blocks.length > 0 && blocks[blocks.length - 1].type !== 'blank') {
      blocks.push({ type: 'blank', count });
    }
  }

  // ---- 格式化函数 ----

  private formatCodeBlock(lines: string[]): string[] {
    if (lines.length < 2) return lines;
    const result: string[] = [];
    result.push('```' + lines[0].slice(3).trim());
    for (let i = 1; i < lines.length - 1; i++) {
      result.push(lines[i].trimEnd());
    }
    result.push('```');
    return result;
  }

  private alignTable(lines: string[], padding: number): string[] {
    if (lines.length < 2) return lines;

    const parseRow = (line: string): string[] => {
      const cells = line.trim().split('|');
      if (cells[0] === '') cells.shift();
      if (cells[cells.length - 1] === '') cells.pop();
      return cells.map((c) => c.trim());
    };

    const rows = lines.map(parseRow);
    const colCount = Math.max(...rows.map((r) => r.length));
    const colWidths = new Array(colCount).fill(0);

    for (const row of rows) {
      for (let j = 0; j < row.length; j++) {
        colWidths[j] = Math.max(colWidths[j], row[j].length);
      }
    }

    const pad = ' '.repeat(padding);
    const result: string[] = [];

    for (let r = 0; r < rows.length; r++) {
      const cells = rows[r];
      if (r === 1) {
        // 分隔行
        const seps = cells.map((c, j) => {
          const w = colWidths[j] + padding * 2;
          if (c.startsWith(':') && c.endsWith(':')) return ':' + '-'.repeat(w - 2) + ':';
          if (c.endsWith(':')) return '-'.repeat(w - 1) + ':';
          if (c.startsWith(':')) return ':' + '-'.repeat(w - 1);
          return '-'.repeat(w);
        });
        result.push('|' + pad + seps.join(pad + '|' + pad) + pad + '|');
      } else {
        const padded = cells.map((c, j) => c.padEnd(colWidths[j]));
        result.push('|' + pad + padded.join(pad + '|' + pad) + pad + '|');
      }
    }

    return result;
  }

  private cleanBlockquote(lines: string[]): string[] {
    return lines.map((line) => {
      if (line.trim() === '') return '>';
      if (line.trimStart().startsWith('>')) return line;
      return line;
    });
  }

  private formatList(lines: string[], ordered: boolean, rules: MdRules): string[] {
    const marker = ordered ? '1.' : rules.list.unorderedMarker;
    const indentStr = ' '.repeat(rules.list.indent);
    const result: string[] = [];

    let itemIndex = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') {
        if (rules.list.blankBetweenItems) result.push('');
        continue;
      }

      const leadingSpaces = line.length - line.trimStart().length;
      const depth = Math.floor(leadingSpaces / rules.list.indent);

      if (trimmed.match(/^([-*+]|\d+\.)\s+/)) {
        itemIndex++;
        const num = ordered ? `${itemIndex}.` : marker;
        result.push(indentStr.repeat(depth) + num + ' ' + trimmed.replace(/^([-*+]|\d+\.)\s+/, ''));
      } else {
        const indent = ' '.repeat(rules.list.indent * Math.max(depth || 1, 1));
        result.push(indent + trimmed);
      }
    }

    return result;
  }

  private addChineseEnglishSpace(text: string): string {
    return text
      .replace(/([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])([a-zA-Z0-9])/g, '$1 $2')
      .replace(/([a-zA-Z0-9])([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])/g, '$1 $2');
  }

  // ---- 渲染 ----

  render(blocks: AnyBlock[]): string {
    const lines: string[] = [];

    for (const block of blocks) {
      switch (block.type) {
        case 'blank':
          for (let k = 0; k < block.count; k++) lines.push('');
          break;
        case 'heading':
          lines.push('#'.repeat(block.level) + ' ' + block.text);
          break;
        case 'paragraph':
          lines.push(block.text);
          break;
        case 'horizontalRule':
          lines.push(block.marker.repeat(3));
          break;
        case 'codeBlock':
        case 'table':
        case 'list':
        case 'blockquote':
        case 'frontMatter':
          for (const l of block.lines) lines.push(l);
          break;
      }
    }

    // 末尾留一个空行
    while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    lines.push('');

    return lines.join('\n');
  }
}
