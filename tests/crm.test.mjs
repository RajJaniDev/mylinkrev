import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContactDraft, mergeContacts, contactStages } from '../src/lib/crm.ts';
const stages = ['New', 'Contacted', 'Client'];
const draft = { name: '  Jamie  ', email: '', phone: '', company: '', notes: '', status: 'New', follow_up_on: '' };

test('CRM accepts a name-only contact and trims contact fields', () => {
  const result = validateContactDraft(draft, stages);
  assert.ok('draft' in result);
  assert.equal(result.draft.name, 'Jamie');
});
test('CRM rejects invalid addresses, phone numbers, unknown stages and overflow', () => {
  for (const patch of [{name:''}, {email:'invalid'}, {phone:'123'}, {phone:'+1234567890123456'}, {status:'Not a real stage'}, {notes:'x'.repeat(4001)}, {name:{bad:'type'}}, {version:7}]) {
    assert.ok('error' in validateContactDraft({...draft,...patch}, stages), JSON.stringify(patch));
  }
});
test('follow-up dates reject impossible dates and accept leap dates', () => {
  for (const follow_up_on of ['2026-02-30','2026-02-29','2026-13-01','tomorrow','2026-1-2']) assert.ok('error' in validateContactDraft({...draft,follow_up_on},stages));
  assert.ok('draft' in validateContactDraft({...draft,follow_up_on:'2028-02-29'},stages));
});
test('untrusted inputs cannot select a different source or owner', () => {
  const result=validateContactDraft({...draft,source:'bio',business_id:'another-owner',archived_at:'2026-01-01'},stages);
  assert.ok('draft' in result);
  assert.equal(result.draft.source,undefined);
  assert.equal(result.draft.business_id,undefined);
  assert.equal(result.draft.archived_at,undefined);
});
test('private edits overlay a legacy inquiry without mutating its public record or quota', () => {
  const legacy=[{id:'inquiry-1',name:'Jamie',email:'jamie@example.com',message:'Original request',status:'New',created_at:'2026-10-20T00:00:00Z'}];
  const before=JSON.stringify(legacy);
  const edited={...mergeContacts(legacy,[],stages)[0],name:'Jamie Client',notes:'Private follow-up notes',status:'Client',updated_at:'2026-10-27T00:00:00Z'};
  const merged=mergeContacts(legacy,[edited],stages);
  assert.equal(merged.length,1);
  assert.equal(merged[0].notes,'Private follow-up notes');
  assert.equal(merged[0].message,'Original request');
  assert.equal(merged[0].source,'bio');
  assert.equal(JSON.stringify(legacy),before);
});
test('manual contacts and archived overlays do not remove or duplicate form inquiries', () => {
  const legacy=[{id:'inquiry-1',name:'Jamie',message:'Hi',created_at:'2026-10-20T00:00:00Z'}];
  const inquiry=mergeContacts(legacy,[],stages)[0];
  const archived={...inquiry,archived_at:'2026-10-27T00:00:00Z'};
  const manual={...inquiry,id:'manual-1',source:'manual',created_at:'2026-10-27T00:00:00Z'};
  const merged=mergeContacts(legacy,[archived,manual],stages);
  assert.equal(merged.length,2);
  assert.equal(merged.filter(contact=>!contact.archived_at).length,1);
  assert.equal(legacy.length,1);
  assert.equal(merged.find(contact=>contact.id==='inquiry-1').archived_at,archived.archived_at);
});
test('legacy rows get safe defaults and invalid collections are ignored', () => {
  assert.equal(contactStages([])[0],'New');
  assert.equal(mergeContacts(null,[],stages).length,0);
  assert.equal(mergeContacts([null,{}, {id:4}],[],stages).length,0);
  const row=mergeContacts([{id:'legacy'}],[],stages)[0];
  assert.equal(row.status,'New'); assert.equal(row.notes,''); assert.equal(row.source,'bio');
});
