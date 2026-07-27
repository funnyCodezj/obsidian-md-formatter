import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import type MdFormatterPlugin from './main';
import { DEFAULT_RULES_YAML } from './default-rules';

export class MdFormatterSettingTab extends PluginSettingTab {
  plugin: MdFormatterPlugin;

  constructor(app: App, plugin: MdFormatterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): Array<{ key: string; name: string; description: string }> {
    return [
      {
        key: 'rules',
        name: '排版规则 (YAML)',
        description: '自定义 Markdown 排版美化规则，使用 YAML 格式编写',
      },
      {
        key: 'batch',
        name: '批量美化',
        description: '美化当前文件夹下所有 Markdown 文件',
      },
    ];
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName('MD 排版美化器').setHeading();
    containerEl.createEl('p', {
      text: '在 Markdown 编辑器中右键 → "美化 Markdown 排版"，或使用命令面板搜索"美化"。',
    });

    new Setting(containerEl).setName('规则模板 (YAML)').setHeading();
    const textarea = containerEl.createEl('textarea', {
      attr: {
        style: 'width:100%; min-height:450px; font-family: var(--font-monospace); font-size: 13px; line-height: 1.5; resize: vertical;',
      },
    });
    textarea.value = this.plugin.settings.rulesYaml || DEFAULT_RULES_YAML;

    new Setting(containerEl)
      .addButton((btn) =>
        btn.setButtonText('保存规则').setCta().onClick(async () => {
          try {
            this.plugin.parseAndSaveRules(textarea.value);
            new Notice('规则已保存');
          } catch (e) {
            new Notice('保存失败: ' + (e as Error).message);
          }
        })
      )
      .addButton((btn) =>
        btn.setButtonText('恢复默认').onClick(async () => {
          textarea.value = DEFAULT_RULES_YAML;
          this.plugin.parseAndSaveRules(DEFAULT_RULES_YAML);
          new Notice('已恢复为默认规则');
        })
      );

    containerEl.createEl('hr');
    containerEl.createEl('h3', { text: '批量处理' });
    new Setting(containerEl)
      .setName('美化当前文件夹下所有 Markdown 文件')
      .setDesc('以当前打开文件所在目录为准')
      .addButton((btn) =>
        btn.setButtonText('开始批量美化').onClick(() => {
          this.plugin.formatAllInFolder().catch((e) => {
            new Notice('批量美化出错: ' + (e as Error).message);
          });
        })
      );

    containerEl.createEl('hr');
    new Setting(containerEl).setName('使用说明').setHeading();
    const ul = containerEl.createEl('ul');
    ul.createEl('li', { text: '右键菜单：在编辑器任意位置右键 → "美化 Markdown 排版"' });
    ul.createEl('li', { text: '命令面板：Ctrl+P 搜索"美化当前 MD 排版"或"美化当前文件夹"' });
    ul.createEl('li', { text: '规则可在此页面自定义修改，保存后即时生效' });
    ul.createEl('li', { text: '仅修改排版（间距、缩进、对齐），不修改文字内容' });
  }
}
