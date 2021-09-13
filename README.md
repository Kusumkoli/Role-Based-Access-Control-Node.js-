#Ambase Set-up


##1. Clone github repo: 

$ git clone https://<git_token>@github.com/ambitionboxofficial/ambase.git 
Note: You can use this link to create your own personal token.

##2. In path ambase/server, run:
$ composer install 
$ composer dump-autoload

In path ambase/client, run:
$ npm install

We need to change the set-up so that the repo can run locally. Therefore, make the following changes:

In path server/src/, create a new file env.php add following contents to it:


<?php
define("PRODUCTION", false);
define("SERVER", "");
define("CORS","");
define("AKAMAI_BASE_URI", "");
define("AKAMAI_CLIENT_TOKEN", "");
define("AKAMAI_CLIENT_SECRET", "");
define("AKAMAI_ACCESS_TOKEN", "");
define("AKAMAI_DOMAIN", "www.ambitionbox.com");
define("COMPANY_POOL_SIZE", 1000);
define("EMPLOYER_DOMAIN", "https://employer.ambitionbox.com");

In path ambase/server/src/classes/, create a new file db_creds.php and add the below code: 

<?php
define("DB_HOST", "127.0.0.1");
define("DB_PORT", "3305");
define("DB_NAME", "ambitionbox");
define("DB_USERNAME", "");
define("DB_PASSWORD", "");
?>

In DB_USERNAME and DB_PASSWORD, enter the db access credentials received on db access service request approval. 


Before opening the portal, make sure that you’re connected to VPN and staging DB.

Now on path ambase/server, start server using the command:
$ php -S localhost:4400 -t public/


In another terminal, on path ambase/client, run command:
$ npm start

Now in the browser, enter: localhost:4200

In the login window, register on Ambase and ask the team lead of Ambase to approve your registration.

You’re in!


