import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const EyeIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const PencilIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </BaseIcon>
);

export const TrashIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </BaseIcon>
);

export const PlusIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
);

export const SearchIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </BaseIcon>
);

export const CloseIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </BaseIcon>
);

export const SunIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </BaseIcon>
);

export const MoonIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
  </BaseIcon>
);

/** Flèche vers le bas dans un plateau : les données entrent (importer). */
export const DownloadIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </BaseIcon>
);

/** Flèche vers le haut depuis un plateau : les données sortent (exporter). */
export const UploadIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 15V3M7 8l5-5 5 5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </BaseIcon>
);

export const WarningIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </BaseIcon>
);
