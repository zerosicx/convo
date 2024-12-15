import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomColour = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export function getRandomRedPinkHex(): string {
  // Generate red-pink shades by focusing on high red and moderate green/blue values.
  const red = Math.floor(Math.random() * 100) + 155; // Strong red
  const green = Math.floor(Math.random() * 50) + 50; // Low to moderate green
  const blue = Math.floor(Math.random() * 80) + 80; // Low to moderate blue

  // Convert RGB values to a hex string
  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

// Example usage
console.log(getRandomRedPinkHex());

export const getOs = () => {
  const os = ["Windows", "Linux", "Mac"]; // add your OS values
  return os.find((v) => navigator.userAgent.indexOf(v) >= 0);
};
