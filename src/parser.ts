import { HTMLElement, parse } from "node-html-parser";

export type Dish = {
  name: string;
  price: string;
  foodType?: string;
};

export type Menu = {
  day: string;
  dishes: Dish[];
};

export function parseHTMLFromMensaSite(html: string): Promise<Menu> {
  return new Promise((resolve, reject) => {
    const parsedHTML = parse(html);

    const currDay = parsedHTML
      .querySelector(".menu-entries header h3")
      ?.innerHTML;

    if (currDay === undefined)
      reject("Error loading curr day");

    const currMenu = parsedHTML.querySelectorAll(
      ".day-menu.active .day-menu-entries article"
    ); 

    Promise.all(currMenu.map((dishHtml: HTMLElement) => parseHTMLMenu(dishHtml)))
      .then((dishes) =>
        resolve({
          day: String(currDay),
          dishes: dishes,
        })
      )
      .catch((err) => reject(err));
  });
}

export function parseHTMLMenu(dishHtml: HTMLElement): Promise<Dish> {
  return new Promise((resolve, reject) => {
    const price: string | undefined = dishHtml
      .querySelector(".price")
      ?.querySelector("span")?.innerHTML;

    const name: string | undefined = dishHtml
      .querySelector("h5")
      ?.innerHTML;

    const foodType: string | undefined = dishHtml.querySelector(".food-type .food-icon")?.getAttribute("title");

    if (price === undefined || name === undefined) {
      reject("Error parsing menu entry");
    }

    const dish: Dish = {
      price: String(price),
      name: String(name),
      foodType: foodType
    };

    resolve(dish);
  });
}
