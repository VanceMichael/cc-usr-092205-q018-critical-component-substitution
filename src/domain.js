// 读取并检查项目共享的领域资料。
const ALLOWED_KEYS = new Set(['domain', 'version', 'sample_id', 'actors', 'facts', 'constraints']);

function isStringList(value, minItems) {
  return Array.isArray(value)
    && value.length >= minItems
    && value.every((item) => typeof item === 'string' && item.length > 0);
}

export function parseDomain(raw) {
  const value = JSON.parse(raw);
  if (
    !value
    || typeof value !== 'object'
    || typeof value.domain !== 'string'
    || value.domain.length === 0
    || !Number.isInteger(value.version)
    || value.version < 1
    || typeof value.sample_id !== 'string'
    || value.sample_id.length === 0
    || !isStringList(value.actors, 2)
    || !isStringList(value.facts, 2)
    || !isStringList(value.constraints, 2)
  ) {
    throw new Error('共享资料缺少必要字段');
  }
  if (Object.keys(value).some((key) => !ALLOWED_KEYS.has(key))) {
    throw new Error('共享资料包含未约定字段');
  }
  return value;
}
