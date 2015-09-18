#npm install

node .\node_modules\gulp\bin\gulp.js babel
node .\node_modules\mocha\bin\mocha "build\test\**\*.js"

node  --es_staging --use_strict .\node_modules\mocha\bin\mocha  "server\code\test\**\*.js" 
