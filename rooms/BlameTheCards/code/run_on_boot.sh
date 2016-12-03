
if [ `id -u` -ne 0 ] ; then
	echo "Please run as root" 
 	exit 1 
fi

echo Configuring the system.

TOKEN=/media/redpny/software/node-v6.9.1-linux-armv6l/lib/node_modules/ddns-cli/tests/.daplie.me.jwt
PATH=/media/redpny/software/node-v6.9.1-linux-armv6l/lib/node_modules/ddns-cli/bin/:$PATH

ddns --hostname geekathelon.daplie.me --agree --email geekathelon@gmail.com --token $TOKEN

cd ~athelon/lets_encrypt/letsencrypt
./letsencrypt-auto renew
cd ..

cp /etc/letsencrypt/live/geekathelon.daplie.me/fullchain.pem .
cp /etc/letsencrypt/live/geekathelon.daplie.me/privkey.pem .
cp /etc/letsencrypt/live/geekathelon.daplie.me/cert.pem .




echo Running game

cd ~athelon/soi/SoiWidgets/rooms/BlameTheCards/code

# ./gulp build > /dev/null 2> /dev/null
./node_modules/.bin/gulp serve
