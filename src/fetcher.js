require('dotenv').config();

const fetchHTML = () => {
    return fetch(process.env.MENSA_URL)
        .then(res => res.text())
        .then(unEscape)
}

function unEscape(html) {
    return new Promise((resolve, reject) => {
        html = html.replace(/&lt;/g , "<");	 
        html = html.replace(/&gt;/g , ">");     
        html = html.replace(/&quot;/g , "\"");  
        html = html.replace(/&#39;/g , "\'");   
        html = html.replace(/&amp;/g , "&");

        resolve(html)
    });
}

module.exports = {fetchHTML};