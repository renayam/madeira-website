#!/bin/bash
set -e

echo "🚀 Checking MariaDB container status..."

if docker ps | grep -q "madeira-mariadb"; then
    echo "✅ MariaDB container is already running"
else
    echo "🔄 MariaDB container not running. Starting it..."
    
    if docker ps -a | grep -q "madeira-mariadb"; then
        echo "📦 Starting existing MariaDB container..."
        docker start madeira-mariadb
    else
        echo "📦 Creating and starting new MariaDB container..."
        docker-compose up -d mariadb
    fi
    
    echo "⏳ Waiting for MariaDB to be ready..."
    for i in {1..30}; do
        if docker exec madeira-mariadb mariadb-admin ping -h localhost -u root -p"${DB_ROOT_PASSWORD:-MadeiraDB2024!}" --silent 2>/dev/null; then
            echo "✅ MariaDB is ready!"
            break
        fi
        echo "   Waiting... ($i/30)"
        sleep 2
    done
    
    if ! docker exec madeira-mariadb mariadb-admin ping -h localhost -u root -p"${DB_ROOT_PASSWORD:-MadeiraDB2024!}" --silent 2>/dev/null; then
        echo "❌ MariaDB failed to start properly. Check docker logs:"
        docker logs madeira-mariadb
        exit 1
    fi
fi

echo "🎯 Starting Next.js dev server..."
exec next dev
