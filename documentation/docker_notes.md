
Why This Is HappeningIn GitHub Codespaces, your db.php file uses getenv() to read the database credentials. However, GitHub Codespaces automatically injects its own built-in environment variables into your terminals and containers.If Codespaces has a pre-existing or empty environment variable mapped to DB_DATABASE, DB_USERNAME, or DB_PASSWORD, your PHP container is reading those values instead of the ones you typed inside your docker-compose.yml file.How to Fix ItHardcode the connection string temporarily inside db.php to bypass the conflicting Codespaces environment variables completely.Change the connection variables at the top of your db.php file to match this exact block:

Change the connection variables at the top of your db.php file to match this exact block:

php// Force exact Docker values to override Codespaces environment variables
$host = 'mysql'; 
$db   = 'my_database';
$user = 'dev_user';
$pass = 'dev_password';
$charset = 'utf8mb4';