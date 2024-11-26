## Install Logstash
```bash
echo 'update software and install dependency for logstash ================'
sudo apt update
sudo apt -y upgrade

echo 'install java for logstash ================'
sudo apt -y install openjdk-11-jre
# Add the Elastic APT repository
# First, import the Elasticsearch public signing key
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
# Next, add the Elastic APT repository
sudo sh -c 'echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" > /etc/apt/sources.list.d/elastic-7.x.list'

cd /etc/apt/sources.list.d/
sudo apt-get update # Update your APT sources
sudo apt install logstash
# start logstash
sudo systemctl start logstash


# check logstash version
cd /usr/share/logstash/bin 
./logstash --version
```

## execute logstash pipeline
```bash
cd /usr/share/logstash/bin 
./logstash -e "input { stdin { } } output { stdout { }}" 
## debug mode
./logstash -e "input { stdin { } } output { stdout { }}" --debug
```


## deploy pipeline from windows to wsl
```bash
cp /mnt/c/Users/Wistronits.1302183-NB/source/repos/TDH-cicd-practice/cicd-practice/logstash/pipelines/pipeline.conf /root/logstash-pipelines/pipeline.conf
cd /usr/share/logstash/bin 
# run pipeline from file
./logstash -f /root/logstash-pipelines/pipeline.conf
```


## important directory
```bash
/usr/share/logstash
/etc/logstash
/var/log/logstash
```