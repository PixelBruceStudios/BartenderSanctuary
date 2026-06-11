import subprocess, os

password = 'npg_T4RZg8letWEH'
url = f'postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/BartenderSanctuary?sslmode=require&channel_binding=require'

env = os.environ.copy()
env['DATABASE_URL'] = url

cmd = ['node', 'scripts/migrate.cjs', '--import']
result = subprocess.run(cmd, cwd='/home/skicmi/bartender-sanctuary-app', env=env, capture_output=True, text=True)
print(result.stdout)
print(result.stderr, file=__import__('sys').stderr)
