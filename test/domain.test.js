import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

test('样例领域标识正确', async () => {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  const value = parseDomain(raw);
  assert.equal(value.domain, 'critical-component-substitution');
  assert.ok(value.constraints.length >= 2);
});

test('样例覆盖替代审理的关键角色', async () => {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  const value = parseDomain(raw);
  for (const actor of ['采购方', '设计人员', '质量部门', '售后人员', '制造工程团队', '生产部门', '管理层', '装机人员']) {
    assert.ok(value.actors.includes(actor), `缺少角色：${actor}`);
  }
});

test('样例覆盖替代审理的关键约束', async () => {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  const value = parseDomain(raw);
  assert.ok(value.constraints.some((c) => c.includes('不兼容')), '缺少库存兼容性约束');
  assert.ok(value.constraints.some((c) => c.includes('冻结')), '缺少试验失败冻结约束');
  assert.ok(value.constraints.some((c) => c.includes('签署')), '缺少分别签署约束');
  assert.ok(value.constraints.some((c) => c.includes('序列号')), '缺少装机批准版本约束');
  assert.ok(value.constraints.some((c) => c.includes('批次')), '缺少批次影响约束');
});
