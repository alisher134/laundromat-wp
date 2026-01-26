# WordPress Admin Setup & Database Sync

## Quick Start for New Developers

1. **Start Docker containers**
   ```bash
   docker-compose up -d
   ```

2. **Restore database with existing content**
   ```bash
   chmod +x restore-db.sh
   ./restore-db.sh
   ```

3. **Access WordPress Admin**
   - URL: `http://localhost:8080/wp-admin`
   - Username: `LaundromatAdmin`
   - Password: `de^uoMXo8W(j#hfxW8`

## When You Make Changes in WordPress Admin

After adding/editing content (services, locations, tips, FAQs, etc.):

1. **Export database**
   ```bash
   chmod +x backup-db.sh
   ./backup-db.sh
   ```

2. **Commit and push**
   ```bash
   git add database-backup.sql
   git commit -m "Update: added new services and locations"
   git push
   ```

## When You Pull Changes from Git

If `database-backup.sql` was updated by a teammate:

```bash
git pull
./restore-db.sh
```

⚠️ **Warning**: This will overwrite your local WordPress content with the version from Git.

## Admin Credentials

**WordPress Admin Login**
- URL: `http://localhost:8080/wp-admin`
- Username: `LaundromatAdmin`
- Password: `de^uoMXo8W(j#hfxW8`

**Database Access (phpMyAdmin)**
- URL: `http://localhost:8081`
- Server: `db`
- Username: `wordpress`
- Password: `wordpress`

## Manual Database Export/Import

**Export manually:**
```bash
docker exec -i $(docker-compose ps -q db) mysqldump -u wordpress -pwordpress wordpress > database-backup.sql
```

**Import manually:**
```bash
docker exec -i $(docker-compose ps -q db) mysql -u wordpress -pwordpress wordpress < database-backup.sql
```

## Troubleshooting

**Problem**: Scripts show "permission denied"
```bash
chmod +x backup-db.sh restore-db.sh
```

**Problem**: "docker-compose: command not found"
- Install Docker Desktop and ensure it's running

**Problem**: Database container not found
```bash
docker-compose up -d
docker-compose ps  # Check if containers are running
```

**Problem**: Login credentials don't work after restore
- The credentials are stored in the database
- If restore was successful, the credentials above should work
- Clear browser cache/cookies and try again

## What's Synced via Database

When you restore the database, you get:
- ✅ All WordPress content (posts, pages, CPTs)
- ✅ User accounts and roles
- ✅ Plugin settings
- ✅ WordPress settings (permalinks, site options)
- ✅ Custom field (ACF) data
- ✅ Menus and widgets

You still need to install plugins separately (or commit them to `/wp-content/plugins/`).

## Development Workflow

```
┌─────────────────────────────────────────────────┐
│ Developer A makes changes in WP Admin           │
│ ↓                                               │
│ Runs ./backup-db.sh                             │
│ ↓                                               │
│ Commits database-backup.sql                     │
│ ↓                                               │
│ Pushes to Git                                   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Developer B pulls from Git                      │
│ ↓                                               │
│ Runs ./restore-db.sh                            │
│ ↓                                               │
│ Has same content as Developer A                 │
└─────────────────────────────────────────────────┘
```

## Security Note

⚠️ The admin credentials are committed to this repository. This is acceptable for:
- Local development environments
- Internal team projects
- Non-production databases

For production:
- Use different credentials
- Don't commit credentials to Git
- Use environment variables
- Enable two-factor authentication
