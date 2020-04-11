git remote remove origin
git remote add origin git@github.com:Hoff97/note-pwa.git

git fetch
git branch --set-upstream-to origin/master master
git fetch origin gh-pages:gh-pages
git branch --set-upstream-to origin/gh-pages gh-pages

npm run deploy