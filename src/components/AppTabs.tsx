import {Tabs, Tab, TabsProps} from "@heroui/react";
import {ReactNode, useEffect, useRef} from "react";

export type AppTabItem = {
  key: string;
  title: string;
  content: ReactNode;
};

type AppTabsProps = {
  items: AppTabItem[];
  ariaLabel?: string;
  /** onglet actif par défaut */
  defaultKey?: string;
  /** classes optionnelles pour wrapper */
  className?: string;
  /** props supplémentaires passés au composant Tabs HeroUI */
  tabsProps?: Omit<TabsProps, "children" | "aria-label">;
};

/**
 * HeroUI ne calcule la position du curseur (la pastille de l'onglet actif) qu'au
 * moment du rendu, sans observer les redimensionnements : si la fenêtre change de
 * taille (agrandissement, mise en page qui se stabilise après le montage…), le
 * curseur garde son ancienne largeur. On le recale donc à chaque changement de
 * taille de la barre d'onglets, avec le même calcul que HeroUI.
 */
function useTabCursorResizeFix(variant: TabsProps["variant"]) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const tabList = wrapper?.querySelector<HTMLElement>('[role="tablist"]');
    if (!wrapper || !tabList) return;

    const realign = () => {
      const cursor = tabList.querySelector<HTMLElement>('[data-slot="cursor"]');
      const selected = tabList.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!cursor || !selected) return;

      const {offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height} = selected;
      const previousTransition = cursor.style.transition;
      cursor.style.transition = "none";
      if (variant === "underlined") {
        cursor.style.left = `${left + width * 0.1}px`;
        cursor.style.top = `${top + height - 2}px`;
        cursor.style.width = `${width * 0.8}px`;
      } else {
        cursor.style.left = `${left}px`;
        cursor.style.top = `${top}px`;
        cursor.style.width = `${width}px`;
        cursor.style.height = `${height}px`;
      }
      // Laisse le navigateur appliquer la position avant de réactiver l'animation.
      requestAnimationFrame(() => {
        cursor.style.transition = previousTransition;
      });
    };

    const observer = new ResizeObserver(realign);
    observer.observe(tabList);
    tabList.querySelectorAll('[role="tab"]').forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [variant]);

  return wrapperRef;
}

export function AppTabs({items, ariaLabel = "Tabs", defaultKey, className = "flex w-full flex-col", tabsProps,}: AppTabsProps) {
  const firstKey = items[0]?.key;
  const wrapperRef = useTabCursorResizeFix(tabsProps?.variant);
  return (
    <div ref={wrapperRef} className={className}>
      <Tabs
        aria-label={ariaLabel}
        defaultSelectedKey={defaultKey ?? firstKey}
        {...tabsProps}
      >
        {items.map((item) => (
          <Tab key={item.key} title={item.title}>
            {item.content}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}