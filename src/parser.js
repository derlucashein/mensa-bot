
const { parse } =  require('node-html-parser');

const parseHTMLFromMensaSite = (html) => {
    return new Promise((resolve, reject) => {
        const parsedHTML = parse(html);

        const currDataDay = parsedHTML.querySelector('#thecurrentday')
            .getAttribute('data-day');
        
        
        const currDayAll = parsedHTML.querySelectorAll(`div[data-day="${currDataDay}"][class="day"] .menuwrap .menu`);

        //filter evening dishes
        const currDay = currDayAll.filter((dish) => dish.querySelectorAll('div[title="Essen Abendmensa MeCampNo"]').length === 0);

        const dishes = currDay.map(parseHTMLMenu);

        resolve({
            day: currDataDay,
            dishes: dishes
        });
    });
}

const parseHTMLMenu = (menuHTML) => {
    const price = menuHTML.querySelector('.price')
                            .querySelector('span').innerHTML;

    const name = menuHTML.querySelector('.left')
                            .querySelector('.title').innerHTML;

    return {
        price: price,
        name: name
    }
}

module.exports = {parseHTMLFromMensaSite};