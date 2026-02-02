#!/bin/bash

# WordPress Database Restore Script
# Run this after pulling database changes from Git

if [ ! -f "database-backup.sql" ]; then
    echo "✗ database-backup.sql not found"
    echo "  Make sure you're in the project root directory"
    exit 1
fi

echo "Restoring WordPress database from backup..."
echo "⚠️  This will overwrite your current WordPress content"
read -p "Continue? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker exec -i $(docker compose ps -q db) mysql -u wordpress -pwordpress wordpress < database-backup.sql

    if [ $? -eq 0 ]; then
        echo "✓ Database restored successfully"
        echo "  Login at: http://localhost:8080/wp-admin"
        echo "  Username: LaundromatAdmin"
        echo "  Password: de^uoMXo8W(j#hfxW8"
    else
        echo "✗ Database restore failed"
        echo "  Make sure Docker containers are running: docker compose up -d"
        exit 1
    fi
else
    echo "Restore cancelled"
fi
