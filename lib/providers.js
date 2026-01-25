// 支持的服务提供商配置
const PROVIDERS = {
  glm: {
    name: 'GLM (智谱AI)',
    baseUrl: 'https://open.bigmodel.cn/api/anthropic',
    description: '智谱AI GLM API',
    modelConfig: {
      'ANTHROPIC_DEFAULT_OPUS_MODEL': 'glm-4.7',
      'ANTHROPIC_DEFAULT_SONNET_MODEL': 'glm-4.7',
      'ANTHROPIC_DEFAULT_HAIKU_MODEL': 'glm-4.5-air'
    }
  },
  minimax: {
    name: 'MiniMax',
    baseUrl: 'https://api.minimaxi.com/anthropic',
    description: 'MiniMax API',
    modelConfig: {
      'ANTHROPIC_MODEL': 'MiniMax-M2.1',
      'ANTHROPIC_SMALL_FAST_MODEL': 'MiniMax-M2.1',
      'ANTHROPIC_DEFAULT_SONNET_MODEL': 'MiniMax-M2.1',
      'ANTHROPIC_DEFAULT_OPUS_MODEL': 'MiniMax-M2.1',
      'ANTHROPIC_DEFAULT_HAIKU_MODEL': 'MiniMax-M2.1'
    }
  },
  kimi: {
    name: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/anthropic',
    description: 'Moonshot Kimi API',
    modelConfig: {
      'ANTHROPIC_MODEL': 'kimi-k2-turbo-preview',
      'ANTHROPIC_DEFAULT_OPUS_MODEL': 'kimi-k2-turbo-preview',
      'ANTHROPIC_DEFAULT_SONNET_MODEL': 'kimi-k2-turbo-preview',
      'ANTHROPIC_DEFAULT_HAIKU_MODEL': 'kimi-k2-turbo-preview',
      'CLAUDE_CODE_SUBAGENT_MODEL': 'kimi-k2-turbo-preview'
    }
  }
};

module.exports = PROVIDERS;

