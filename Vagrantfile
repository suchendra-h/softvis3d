
Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"

  config.vm.network "forwarded_port", guest: 9000, host: 9000 # SonarQube

  config.vm.synced_folder ".", "/vagrant", :mount_options => ["rw","exec","uid=1000","gid=1000"]

  config.vm.provision "shell", inline: <<-SHELL
    curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    apt-get install -y nodejs maven docker.io openjdk-8-jdk-headless
    npm install -g yarn

    curl -s -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    groupadd vboxsf
    usermod -G vboxsf -a 'vagrant'
    usermod -G docker -a 'vagrant'
    echo "cd /vagrant" >> /home/vagrant/.bashrc
  SHELL

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end
end
