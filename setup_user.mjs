const url = 'https://dkdrfftuvroetapqrqbf.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZHJmZnR1dnJvZXRhcHFycWJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2MzYyOSwiZXhwIjoyMDkwMTM5NjI5fQ.y3Tvu9d0-I-qn0jne9LlDkq8EE8yEco82oAJdJi3IgA';

async function check() {
  const listRes = await fetch(`${url}/auth/v1/admin/users`, {
    headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey }
  });
  const users = await listRes.json();
  const user = users.users?.find(u => u.email === 'canvassuppotercs01@gmail.com');
  if (user) {
    console.log('Found existing user, updating password...');
    const updateRes = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'canvassuppotercs01', email_confirm: true })
    });
    console.log('Update status:', updateRes.status);
  } else {
    console.log('User not found, creating...');
    const createRes = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'canvassuppotercs01@gmail.com', password: 'canvassuppotercs01', email_confirm: true })
    });
    console.log('Create status:', createRes.status);
  }
}
check();
