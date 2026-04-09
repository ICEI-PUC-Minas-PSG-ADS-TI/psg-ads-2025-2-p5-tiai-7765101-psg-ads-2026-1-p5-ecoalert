import Sun from "@icons/sun.svg";
import Settings from "@icons/settings.svg";
import Moon from "@icons/moon.svg";
import Menu from "@icons/menu.svg";

export const icons = {
    menu: Menu,
    moon: Moon,
    settings: Settings,
    sun: Sun,
};

export type IconName = keyof typeof icons;