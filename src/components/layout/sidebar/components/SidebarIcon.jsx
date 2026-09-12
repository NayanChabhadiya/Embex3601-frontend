function SidebarIcon({ name, size = 18 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "customers":
      return (
        <svg {...commonProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "vendors":
      return (
        <svg {...commonProps}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-4h6v4" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M9 13h.01" />
          <path d="M15 13h.01" />
        </svg>
      );

    case "products":
      return (
        <svg {...commonProps}>
          <path d="m21 8-9-5-9 5 9 5 9-5Z" />
          <path d="m3 8 9 5 9-5" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "invoices":
      return (
        <svg {...commonProps}>
          <path d="M6 2h9l3 3v17H6z" />
          <path d="M14 2v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
          <path d="M9 8h2" />
        </svg>
      );

    case "sales":
      return (
        <svg {...commonProps}>
          <path d="M3 3v18h18" />
          <path d="m7 16 4-5 3 3 5-7" />
        </svg>
      );

    case "purchases":
      return (
        <svg {...commonProps}>
          <path d="M6 2h9l3 3v17H6z" />
          <path d="M14 2v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export default SidebarIcon;
