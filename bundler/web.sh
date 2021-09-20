## Manage the "bundler/builds/web/" directory
#
#
## Copy the required folders from the codebase for the "web version"
cp -R "apps_codebase/assets/" "builds/web/"
cp -R "apps_codebase/pages/" "builds/web/"
#
## Copy the required files from the codebase for the "web version"
cp "apps_codebase/.htaccess" "builds/web/"
cp "apps_codebase/.server.test.connection" "builds/web/"
cp "apps_codebase/index.html" "builds/web/"
cp "apps_codebase/layout.html" "builds/web/"
cp "apps_codebase/manifest.webmanifest.json" "builds/web/"
cp "apps_codebase/robots.txt" "builds/web/"
cp "apps_codebase/sitemap.xml" "builds/web/"
cp "apps_codebase/worker.js" "builds/web/"
#