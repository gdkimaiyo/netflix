#!/usr/bin/env sh

# NOTE: Ensure you checkout to gh-pages branch first before deploying

# abort on errors
set -e

# Rebase latest changes from develop
git rebase develop

# build
ng build --configuration production --output-path docs --base-href /netflix/

# navigate into the build output directory
cd docs

cp index.html 404.html

cd -

git add .
git commit -m "initiate deploy"
git push -f origin gh-pages
