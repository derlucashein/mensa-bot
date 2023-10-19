import { HTMLElement, parse } from "node-html-parser";

export type Dish = {
    name: string,
    price: string
}

export type Menu = {
    day: string,
    dishes: Dish[]
}

export function parseHTMLFromMensaSite(html: string):  Promise<Menu> {
    return new Promise((resolve, reject) => {
        const parsedHTML = parse(html);

        const currDataDay = parsedHTML.querySelector('#thecurrentday')
            ?.getAttribute('data-day');

        if (currDataDay === undefined)
            reject('Error loading curr data day attribute');
        
        
        const currDayAll = parsedHTML.querySelectorAll(`div[data-day="${currDataDay}"][class="day"] .menuwrap .menu`);

        //filter evening dishes
        const currDay = currDayAll.filter((dishElement: HTMLElement) => dishElement.querySelectorAll('div[title="Essen Abendmensa MeCampNo"]').length === 0);

        Promise.all(currDay.map((menuHTML: HTMLElement) => parseHTMLMenu(menuHTML)))
            .then(dishes => resolve({
                day: String(currDataDay),
                dishes: dishes
            })).catch(err => reject(err));

    });
}

export function parseHTMLMenu(menuHTML: HTMLElement): Promise<Dish>{
    return new Promise((resolve, reject) => {
        const price: string | undefined = menuHTML.querySelector('.price')
                            ?.querySelector('span')?.innerHTML;

        const name: string | undefined = menuHTML.querySelector('.left')
                            ?.querySelector('.title')?.innerHTML;

        if (price === undefined || name === undefined) {
            reject('Error parsing menu entry');
        }
        
        const dish: Dish = {
            price: String(price),
            name: String(name)
        }

        resolve(dish);
    });
    
}