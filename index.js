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
    const { query, pathname } = url.parse(req.url, true);

    const {head, output} = paths[pathname] ? paths[pathname](query) : pageNotFound();

    res.writeHead(...head);
    res.end(output);
})

server.listen(8000,"127.0.0.1", () => {
    console.log("Server Inicializado");
})

function mainPage() {
    const cardsHtml = dataObj.map(e => replaceTemplate(tempCard,e)).join("");
    const output = tempOverview.replace(/%PRODUCT_CARDS%/,cardsHtml)

    return {
        head : [200,{'Content-type': 'text/html'}],
        output
    }
}

function productPage(query) {
    const product = dataObj.find(e => e.id == query.id);
    const output = replaceTemplate(tempProduct, product);

    return {
        head : [200,{'Content-type': 'text/html'}],
        output
    }
}

function apiPage() {
    return {
        head : [200,{'Content-type': 'application/json'}],
        output : data
    }
}

function pageNotFound(){
    return {
        head : [404,{'Content-type': 'text/html'}],
        output : '<h1>Page not found!</h1>'
    }
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