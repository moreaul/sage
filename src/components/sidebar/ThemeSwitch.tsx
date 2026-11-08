import {Select, SelectItem} from "@heroui/react";
import {ReactNode} from "react";
import {MoonIcon, SunIcon} from "@/src/components/icons.tsx";
import {SidebarLabel} from "@/src/components/sidebar/SidebarLabel.tsx";
import {Theme, useTheme} from "@/src/theme.ts";

const OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  {value: "light", label: "Clair", icon: <SunIcon />},
  {value: "dark", label: "Sombre", icon: <MoonIcon />},
];

/** Choix du mode clair / sombre (liste déroulante avec icônes), mémorisé entre deux lancements. */
export function ThemeSwitch() {
  const [theme, setTheme] = useTheme();
  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[1];

  return (
    <div className="flex flex-col gap-2">
      <SidebarLabel>Apparence</SidebarLabel>
      <Select
        aria-label="Apparence"
        radius="lg"
        disallowEmptySelection
        selectedKeys={[theme]}
        onSelectionChange={(keys) => {
          const key = keys === "all" ? undefined : [...keys][0];
          if (key === "light" || key === "dark") setTheme(key);
        }}
        startContent={<span className="text-primary">{current.icon}</span>}
        classNames={{trigger: "bg-content1 data-[hover=true]:bg-content1/70"}}
      >
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} startContent={<span className="text-primary">{o.icon}</span>}>
            {o.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
