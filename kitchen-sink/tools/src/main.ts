import { add } from "@/module";
import image from "@/assets/image.jpg";

const app = document.querySelector("#root");

if (app) {
  const imageElement = document.createElement("img");

  imageElement.src = image;
  app.appendChild(imageElement);
}

console.log(add(1, 2));

export {};
