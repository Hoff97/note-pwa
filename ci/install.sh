eval `ssh-agent -s`
chmod 400 ./deploy_key
cp ./deploy_key ~/.ssh/deploy_key
ssh-add ~/.ssh/deploy_key
echo "IdentityFile ~/.ssh/deploy_key" > ~/.ssh/config
