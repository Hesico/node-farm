const fs = require("fs");
const http = require("http");
const url = require("url");

const paths = {
    "/" : mainPage,
    "/product" : productPage,
    "/api" : apiPage,
    "/overview": mainPage,
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const server = http.createServer((req,res) => {
    pathName = req.url;
    paths[pathName] ? paths[pathName](req,res) : pageNotFound(res);
})

server.listen(8000,"127.0.0.1", () => {
    console.log("Server Inicializado");
})

function mainPage(req,res) {
    const cardsHtml = dataObj.map(e => replaceTemplate(tempCard,e)).join("");
    const output = tempOverview.replace(/%PRODUCT_CARDS%/,cardsHtml)

    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    res.end(output);
}

function productPage(req,res) {
    res.writeHead(200, {
        'Content-type': 'application/json'
    });
    res.end(data);
}

function apiPage(req,res) {
    console.log("pagina API");
}

function pageNotFound(res){
    res.writeHead(404, {
        'Content-type': 'text/html',
      });
    res.end('<h1>Page not found!</h1>');
}

function replaceTemplate(temp, product) {
    
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
      
}