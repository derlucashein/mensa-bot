require('dotenv').config();

export function fetchHTML(): Promise<string>{
    return fetch(String(process.env.MENSA_URL))
        .then(res => res.text())
        .then(unEscape)
}

function unEscape(html: string): Promise<string> {
    return new Promise((resolve, reject) => {
        html = html.replace(/&lt;/g , "<");	 
        html = html.replace(/&gt;/g , ">");     
        html = html.replace(/&quot;/g , "\"");  
        html = html.replace(/&#39;/g , "\'");   
        html = html.replace(/&amp;/g , "&");

        resolve(html)
    });
}
