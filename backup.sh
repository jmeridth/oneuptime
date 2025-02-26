# This file takes last 30 days backup. Make sure you run this file atleast once/day. 
# The backup will be in the format of db-(date of the month).backup
# Before the backup, please make sure DATABASE_BACKUP_* ENV vars in config.env is set properly. 

export $(grep -v '^#' config.env | xargs)

echo "Starting backup...."

git pull

sudo docker run --net=host --rm \
--env-file config.env \
--volume=$(pwd)$DATABASE_BACKUP_DIRECTORY:/var/lib/postgresql/data \
postgres:latest /usr/bin/pg_dump -Fc --dbname=postgresql://$DATABASE_BACKUP_USERNAME:$DATABASE_BACKUP_PASSWORD@$DATABASE_BACKUP_HOST:$DATABASE_BACKUP_PORT/$DATABASE_BACKUP_NAME --file=/var/lib/postgresql/data/db-$(date +%d).backup

echo "Backup completed successfully!"