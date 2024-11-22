# cicd-practice
a project to practice CICD workflow

## remove Ubuntu and reinstall
```bash
wsl --unregister Ubuntu
wsl --install
wsl -d ubuntu -u root # login as root
```

## install nginx
```bash
echo 'update software and install dependency for nginx'
sudo apt-get update
sudo apt-get install -y build-essential # install C compiler
sudo apt-get install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev


echo 'download nginx gz'
wget https://nginx.org/download/nginx-1.27.2.tar.gz
tar -zxvf nginx-1.27.2.tar.gz
cd nginx-1.27.2
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module

echo 'compile the nginx'
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


<!-- ## install package
```bash
cd ..
mkdir nginx-exec
git clone https://github.com/FRiC/nginx-exec.git nginx-exec # not working
``` -->


## install package
```bash
sudo apt install net-tools
```

## install nodejs
```bash
sudo apt-get update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs
```

## Command to setup nginx reversed proxy
```
```