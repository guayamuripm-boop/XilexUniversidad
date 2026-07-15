const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zbkhdukyqdnlcxjiyhdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpia2hkdWt5cWRubGN4aml5aGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4OTAyMDAsImV4cCI6MjA5OTQ2NjIwMH0.blezaJmFqzrbaGbN72WNFeJDx7_gDCZ7Oct7wrl_tAc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // 1. Count questions
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  
  if (countErr) {
    console.error('Count error:', countErr);
    return;
  }
  console.log('Total questions:', count);

  // 2. Get universities
  const { data: unis, error: uniErr } = await supabase
    .from('universities')
    .select('id, code, name');
  if (uniErr) { console.error('Unis error:', uniErr); return; }
  console.log('Universities:', unis.map(u => u.code).join(', '));

  // 3. Get SIMADI areas
  const simadi = unis.find(u => u.code === 'simadi');
  const { data: simadiAreas, error: saErr } = await supabase
    .from('areas')
    .select('id, code, name, subtopics(id, code, name)')
    .eq('university_id', simadi.id);
  if (saErr) { console.error('Areas error:', saErr); return; }
  console.log('\nSIMADI areas:');
  simadiAreas.forEach(a => {
    console.log(`  ${a.code}: ${a.subtopics.length} subtopics`);
  });

  // 4. Test get_random_questions RPC for SIMADI
  const simadiAreaIds = simadiAreas.map(a => a.id);
  const { data: randomQ, error: rpcErr } = await supabase.rpc('get_random_questions', {
    p_university_ids: [simadi.id],
    p_area_ids: simadiAreaIds,
    p_limit: 5,
    p_exclude_ids: []
  });
  if (rpcErr) { console.error('RPC error:', rpcErr); return; }
  console.log(`\nget_random_questions SIMADI (limit 5): ${randomQ.length} questions returned`);
  randomQ.slice(0, 2).forEach(q => {
    console.log(`  - [${q.difficulty}] ${q.statement.substring(0, 60)}...`);
  });

  // 5. Test UNIMET RPC
  const unimet = unis.find(u => u.code === 'unimet');
  const { data: unimetAreas } = await supabase
    .from('areas')
    .select('id, code')
    .eq('university_id', unimet.id);
  const { data: unimetQ, error: unimetErr } = await supabase.rpc('get_random_questions', {
    p_university_ids: [unimet.id],
    p_area_ids: unimetAreas.map(a => a.id),
    p_limit: 5,
    p_exclude_ids: []
  });
  if (unimetErr) { console.error('UNIMET RPC error:', unimetErr); return; }
  console.log(`get_random_questions UNIMET (limit 5): ${unimetQ.length} questions returned`);

  console.log('\n✅ RPC function works - random questions generated per university/area');
}

main().catch(e => console.error('Fatal:', e));
