const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');

const app = express();

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    const articles = []; // load all articles from files here - use fs.readdirSync to list all files in a folder
    files=fs.readdirSync(`${__dirname}/articles`);  // alle dateien in diesem Verzeichnis laden und speichern die dateinamen
    files.forEach(element=>articles.push(getArticle(element)));
    response.render('home', {articles: articles});
});

// note the :name below, we can access it using request.params.name
app.get('/article/:name', (request, response) => {

    const fileName = `${__dirname}/articles/${request.params.name}.json`;

    if(fs.existsSync(fileName)){
        const articleString = fs.readFileSync(fileName);
        const article = JSON.parse(articleString);
        response.render('article', {article: article});
    } else {
        response.render('not-found');
    }
});




function getArticle(fileName){

    var fName=`${__dirname}/articles/`+fileName;
    if(fs.existsSync(fName)) {
        let articleString = fs.readFileSync(fName, {encoding: 'utf8'});
        let article = JSON.parse(articleString);
        article.fileName=`/article/`+fileName.substring(0,fileName.length-5);
        return article;
    }
}
app.use(express.static('public'));
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});