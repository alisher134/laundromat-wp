#!/bin/bash

# WordPress Database Backup Script
# Run this before committing WordPress admin changes

echo "Backing up WordPress database..."

docker exec -i $(docker-compose ps -q db) mysqldump -u wordpress -pwordpress wordpress > database-backup.sql

if [ $? -eq 0 ]; then
    echo "✓ Database backed up successfully to database-backup.sql"
    echo "  File size: $(du -h database-backup.sql | cut -f1)"
    echo ""
    echo "Next steps:"
    echo "  1. Review the backup file"
    echo "  2. git add database-backup.sql"
    echo "  3. git commit -m 'Update database with WordPress admin changes'"
    echo "  4. git push"
else
    echo "✗ Database backup failed"
    echo "  Make sure Docker containers are running: docker-compose up -d"
    exit 1
fi
