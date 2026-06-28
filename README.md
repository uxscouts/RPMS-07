# tomato-database

How to Connect the Extension Inside VS Code

1. Click the new Database plug icon that appears in your VS Code left sidebar.

2. Click Create Connection (or the + icon) and select MySQL.

3. Use these connection details inside the extension form:

Host: mysql
Port: 3306
User: dev_user (or root)
Password: dev_password (or rootpassword)
Database: my_database


--------------------------------

To import your SQL file using the Database Client extension you just installed, you can run it directly inside VS Code with a few clicks.

Step 1: Locate and Run the SQL File

1. Open the VS Code file explorer.
2. Expand your databases folder.
3. Right-click on your .sql file.
4. Select Execute SQL (or Run SQL Query) from the context menu.
5. The extension will ask you which database connection to use. Select your active MySQL connection (my_database).

Alternative way to upload SQL file:

Step 2: Alternative Way (Via the Database Sidebar)

If you prefer dragging and dropping or using the database tab:

1. Click the Database plug icon in the left sidebar.
2. Right-click on your database name (my_database).
3. Select Import (or Open Query / Import SQL).
4. Choose your SQL file from the file picker and confirm.

Step 3: Terminal Way (Fast Backup Method)

If your SQL file is massive and the extension struggles with it, you can run it instantly from your VS Code terminal because your workspace shares a network. Run this single command:

docker compose exec -T mysql mysql -udev_user -p dev_password my_database < ./databases/tomato.sql

docker compose exec -T mysql mysql -u root -p 
password: rootpassword

docker ps (to get sql container id)
docker exec -it d7747d62ff36 mysql -u root -p

docker exec -it mysql mysql -u root -p

can just use service name instead of the sql container id:

No, you do not need to find the container ID. You can simply use the service name defined in your docker-compose.yml file (e.g., mysql, db, or database).

service name: mysql
docker compose exec mysql mysql -u root -p
 (this works!!!)

service name: mysql
docker compose exec mysql mysql -u dev_user -p
(this works!!!)

// Force to show database INSIDE container!! - Not native Codespaces MySQL
docker-compose exec mysql mysql -u dev_user -pdev_password my_database -e "SHOW TABLES;"
