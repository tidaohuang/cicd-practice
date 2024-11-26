# cicd-practice
a project to practice CICD workflow

## remove Ubuntu and reinstall
```bash
wsl --unregister Ubuntu
wsl --install
wsl -d ubuntu -u root # login as root
```

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