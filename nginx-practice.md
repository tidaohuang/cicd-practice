
## move demo-site.zip into linux
```bash
cp /mnt/c/Users/Wistronits.1302183-NB/demo-site.zip /usr/local/nginx/html
sudo apt-get install unzip
unzip demo-site.zip
```

## bash to copy nginx.config
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