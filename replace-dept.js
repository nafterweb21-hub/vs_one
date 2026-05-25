const fs = require('fs');
const path = require('path');

const dir = 'src/app/dashboard/master-profile/department';
const files = [
  'actions.ts',
  'page.tsx',
  'new/page.tsx',
  '[id]/page.tsx'
];

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/FailureModeProfile/g, 'DepartmentProfile');
  content = content.replace(/FailureMode/g, 'Department');
  content = content.replace(/failureMode/g, 'department');
  content = content.replace(/Failure Mode/g, 'Department');
  content = content.replace(/failure mode/g, 'department');
  content = content.replace(/failure-mode/g, 'department');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
});
