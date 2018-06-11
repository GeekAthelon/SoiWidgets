HOSTNAME=soiathelon.ddns.net

if [ `id -u` -ne 0 ] ; then
	echo "Please run as root" 
 	exit 1 
fi

echo Configuring the system.

cd ~athelon/lets_encrypt/letsencrypt
   ./letsencrypt-auto renew
cd ..

cp /etc/letsencrypt/live/$HOSTNAME/fullchain.pem .
cp /etc/letsencrypt/live/$HOSTNAME/privkey.pem .
cp /etc/letsencrypt/live/$HOSTNAME/cert.pem .


echo Running game

cd ~athelon/soi/SoiWidgets/rooms/BlameTheCards/code

# ./gulp build > /dev/null 2> /dev/null
./node_modules/.bin/gulp serve
