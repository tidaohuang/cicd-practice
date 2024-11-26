
## install nginx
```bash
echo 'update software and install dependency for nginx ================'
sudo apt-get update
sudo apt-get install -y build-essential # install C compiler
sudo apt-get install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev

echo 'download nginx gz ==============================================='
wget https://nginx.org/download/nginx-1.27.2.tar.gz
tar -zxvf nginx-1.27.2.tar.gz
cd nginx-1.27.2
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module

echo 'compile the nginx ==============================================='
cd nginx-1.27.2
sudo make # compile source configuration
sudo make install # install the compiled source
nginx -V # check nginx version
nginx # start nginx
ps aux | grep nginx

curl http://localhost/ # check nginx is working
```

## set nginx as systemd service
```bash
nginx -s stop # stop nginx
touch /lib/systemd/system/nginx.service
nano /lib/systemd/system/nginx.service
```
```
[Unit]
Description=NGINX HTTP and reverse proxy server
After=syslog.target network.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/bin/nginx -t
ExecStart=/usr/bin/nginx
ExecReload=/usr/bin/kill -s HUP $MAINPID
ExecStop=/usr/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
systemctl start nginx
systemctl status nginx
systemctl stop nginx
systemctl enable nginx # run nginx on boot
```


## move demo-site.zip into linux
```bash
cp /mnt/c/Users/Wistronits.1302183-NB/demo-site.zip /usr/local/nginx/html
sudo apt-get install unzip
unzip demo-site.zip
```

## deploy nginx.config from Windows to WSL
```bash
cp /mnt/c/Users/Wistronits.1302183-NB/source/repos/TDH-cicd-practice/cicd-practice/nginx-config/nginx.conf /etc/nginx/nginx.conf
nginx -t
systemctl reload nginx
```

## check cpu core
```bash
nproc # return number of core of CPU
lscpu # more details about CPU
ulimit -n # Set the maximum number of open file descriptors
```

## check nginx package
```bash
cd nginx-1.27.2 # go to the nginx source code dir
./configure --help | grep dynamic # list all the dynamic module
```

## add dynamic module: http_image_filter_module
```bash
nginx -V # get current config

## add module: http_image_filter_module
apt-get install -y libgd-dev
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --modules-path=/etc/nginx/modules
make 
make install
```

## add dynamic module: http_geoip_module
```bash
nginx -V # get current config
# install geo library
# geo data is stored at '/usr/share/GeoIP/GeoIP.dat'
sudo apt install -y geoip-bin libgeoip-dev 
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --with-http_geoip_module=dynamic --modules-path=/etc/nginx/modules
make 
make install
```

## add dynamic module: http_v2_module, http_ssl_module 
```bash
nginx -V # get current config
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --with-http_geoip_module=dynamic --with-http_v2_module --with-http_ssl_module --modules-path=/etc/nginx/modules
make 
make install
```

## create self-sign cert
```bash
mkdir /etc/nginx/ssl
openssl req -x509 -days 10 -nodes -newkey rsa:2048 -keyout /etc/nginx/ssl/self.key -out /etc/nginx/ssl/self.crt
```

## create dhparam: ssl_dhparam
```bash
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

## install siege for multi-threaded http load testing
```bash
apt-get install siege
siege -v -r 2 -c 5 https://127.0.0.1/thumb.png
```

## basic auth
```bash
apt-get install apache2-utils
htpasswd -c /etc/nginx/.htpasswd user1
cat /etc/nginx/.htpasswd
```
