import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

const loadFixture = () => readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');

test('样例领域标识正确', async () => {
  const value = parseDomain(await loadFixture());
  assert.equal(value.domain, 'critical-component-substitution');
  assert.ok(value.constraints.length >= 2);
});

test('分别签署判断的角色都在参与方中', async () => {
  const value = parseDomain(await loadFixture());
  for (const role of ['设计人员', '质量部门', '采购方', '生产部门']) {
    assert.ok(value.actors.includes(role), `缺少参与方：${role}`);
  }
});

test('库存互斥与试验失败冻结约束明确记录', async () => {
  const value = parseDomain(await loadFixture());
  assert.ok(value.constraints.includes('同一库存不能同时分配给不兼容产品'));
  assert.ok(value.constraints.includes('试验失败立即冻结尚未装机部分'));
});

test('拒绝缺少必要字段的资料', () => {
  assert.throws(() => parseDomain('{"domain":"critical-component-substitution"}'), /缺少必要字段/);
});

test('拒绝包含未约定字段的资料', () => {
  const extra = {
    domain: 'critical-component-substitution',
    version: 1,
    sample_id: 'record-000',
    actors: ['甲', '乙'],
    facts: ['事实一', '事实二'],
    constraints: ['约束一', '约束二'],
    unexpected: true,
  };
  assert.throws(() => parseDomain(JSON.stringify(extra)), /未约定字段/);
});
