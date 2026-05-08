import { useState } from "react";
import { User, Mail, Github, Linkedin, Globe, ChevronUp } from "lucide-react";

interface ProfileData {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
}

interface Props {
  value: ProfileData;
  onChange: (data: ProfileData) => void;
  disabled?: boolean;
}

export function IdentityZone({ value, onChange, disabled }: Props) {
  const [expanded, setExpanded] = useState(true);

  const update = (field: keyof ProfileData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="rounded-2xl border border-(--color-border) glass-card overflow-hidden card-hover animate-fade-up">
      {/* Zone Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-(--color-bg-secondary)/50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-sm shadow-teal-500/20">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-(--color-text) tracking-tight">Identity</h3>
          <p className="text-[11px] text-(--color-text-muted) truncate">
            {value.name || "Name, role & contact details"}
          </p>
        </div>
        <div className={`text-(--color-text-muted) transition-transform duration-300 ${expanded ? "" : "-rotate-180"}`}>
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-5 pb-5 pt-1">
            {/* Name + Role row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-(--color-text-secondary) uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={value.name}
                  onChange={(e) => update("name", e.target.value)}
                  disabled={disabled}
                  placeholder="Simon Escaño"
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-(--color-text-secondary) uppercase tracking-wider">
                  Title / Role
                </label>
                <input
                  type="text"
                  value={value.role}
                  onChange={(e) => update("role", e.target.value)}
                  disabled={disabled}
                  placeholder="Full-Stack Engineer"
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
                />
              </div>
            </div>

            {/* Contact fields */}
            <div className="space-y-2.5">
              <InputRow icon={Mail} label="Email" value={value.email} onChange={(v) => update("email", v)} placeholder="hello@example.com" disabled={disabled} />
              <InputRow icon={Github} label="GitHub" value={value.github} onChange={(v) => update("github", v)} placeholder="https://github.com/username" disabled={disabled} />
              <InputRow icon={Linkedin} label="LinkedIn" value={value.linkedin} onChange={(v) => update("linkedin", v)} placeholder="https://linkedin.com/in/username" disabled={disabled} />
              <InputRow icon={Globe} label="Website" value={value.website} onChange={(v) => update("website", v)} placeholder="https://yoursite.dev" disabled={disabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputRow({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative group/input">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) group-focus-within/input:text-(--color-accent) transition-colors">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-3.5 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) input-focus disabled:opacity-50"
      />
    </div>
  );
}
