import { Plugin, Notice, TFile, Editor } from 'obsidian';
import { FormatterEngine } from './engine';
import { MdRules, DEFAULT_RULES, DEFAULT_RULES_YAML } from './default-rules';
import { MdFormatterSettingTab } from './settings';
import * as yaml from 'js-yaml';

interface PluginSettings {
  rules: Partial<MdRules>;
  rulesYaml: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
  rules: {},
  rulesYaml: DEFAULT_RULES_YAML,
};

export default class MdFormatterPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  engine: FormatterEngine = new FormatterEngine();

  async onload(): Promise<void> {
    await this.loadSettings();
    this.engine = new FormatterEngine(this.settings.rules);

    // 右键菜单
    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu, editor) => {
        menu.addItem((item) => {
          item
            .setTitle('美化 Markdown 排版')
            .setIcon('lines-of-text')
            .onClick(() => this.formatCurrentFile(editor));
        });
      })
    );

    // 命令：美化当前文件
    this.addCommand({
      id: 'format-current-md',
      name: '美化当前 MD 排版',
      editorCallback: (editor: Editor) => this.formatCurrentFile(editor),
    });

    // 命令：批量美化
    this.addCommand({
      id: 'format-all-md-in-folder',
      name: '美化当前文件夹下所有 MD 文件',
      callback: () => this.formatAllInFolder(),
    });

    // 设置面板
    this.addSettingTab(new MdFormatterSettingTab(this.app, this));
  }

  formatCurrentFile(editor: Editor): void {
    const text = editor.getValue();
    if (!text.trim()) {
      new Notice('文件为空，无需美化');
      return;
    }

    try {
      this.engine = new FormatterEngine(this.settings.rules);
      const formatted = this.engine.format(text);
      if (formatted === text) {
        new Notice('排版已规范，无需修改');
        return;
      }
      editor.setValue(formatted);
      new Notice('排版美化完成');
    } catch (e) {
      new Notice('美化失败: ' + (e as Error).message);
    }
  }

  async formatAllInFolder(): Promise<void> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice('请先打开一个文件以确定目标文件夹');
      return;
    }

    const folder = activeFile.parent;
    const files = folder?.children.filter(
      (f): f is TFile => f instanceof TFile && f.extension === 'md'
    );

    if (!files || files.length === 0) {
      new Notice('当前文件夹下没有 Markdown 文件');
      return;
    }

    let count = 0;
    for (const file of files) {
      try {
        const content = await this.app.vault.read(file);
        this.engine = new FormatterEngine(this.settings.rules);
        const formatted = this.engine.format(content);
        if (formatted !== content) {
          await this.app.vault.modify(file, formatted);
          count++;
        }
      } catch (e) {
        console.error(`处理 ${file.name} 失败:`, e);
      }
    }

    new Notice(`美化完成，共处理 ${count}/${files.length} 个文件`);
  }

  async loadSettings(): Promise<void> {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  parseAndSaveRules(yamlText: string): void {
    const parsed = yaml.load(yamlText) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('YAML 格式无效');
    }

    const rules: Partial<MdRules> = {};
    for (const key of Object.keys(DEFAULT_RULES) as (keyof MdRules)[]) {
      if (parsed[key] && typeof parsed[key] === 'object') {
        (rules as Record<string, unknown>)[key] = {
          ...DEFAULT_RULES[key],
          ...(parsed[key] as Record<string, unknown>),
        };
      }
    }

    this.settings.rules = rules;
    this.settings.rulesYaml = yamlText;
    this.saveSettings();
    this.engine = new FormatterEngine(rules);
  }
}
