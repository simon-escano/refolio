import { User } from "lucide-react";

interface ProfileData {
  name: string;
  role: string;
  email: string;
  mobileAreaCode: string;
  mobile: string;
  github: string;
  linkedin: string;
  website: string;
  hobbies: string;
}

interface Props {
  value: ProfileData;
  onChange: (data: ProfileData) => void;
  disabled?: boolean;
}

export function IdentityZone({ value, onChange, disabled }: Props) {
  const update = (field: keyof ProfileData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <section className="relative z-10">
      {/* Drafting Tape Label */}
      <div className="drafting-tape mb-4 -rotate-2">
        Identity
      </div>

      {/* ID Card */}
      <div className="id-card rounded-xl p-6 flex flex-col items-center gap-5 relative overflow-hidden animate-fade-up">
        {/* Plastic Overlay */}
        <div className="plastic-overlay absolute inset-0 z-10 pointer-events-none rounded-xl" />

        {/* Punch Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-[var(--color-surface-variant)] rounded-full shadow-inner z-20" />

        {/* Photo Placeholder */}
        <div className="w-28 h-28 rounded-lg border-4 border-[var(--color-surface)] overflow-hidden shadow-md mt-8 z-10 relative bg-[var(--color-surface-container-low)] flex items-center justify-center">
          {value.name ? (
            <span className="text-3xl font-bold text-[var(--color-primary)]">
              {value.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-8 w-8 text-[var(--color-outline)]" />
          )}
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-4 z-10">
          <div className="flex flex-col gap-1">
            <label className="field-label">Name</label>
            <input
              type="text"
              value={value.name}
              onChange={(e) => update("name", e.target.value)}
              disabled={disabled}
              placeholder="Enter Full Name"
              className="input-drafting text-lg font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">Role</label>
            <input
              type="text"
              value={value.role}
              onChange={(e) => update("role", e.target.value)}
              disabled={disabled}
              placeholder="e.g. Senior Frontend Engineer"
              className="input-drafting input-drafting-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">Contact</label>
            <div className="flex gap-2">
              <select
                value={value.mobileAreaCode || "+63"}
                onChange={(e) => update("mobileAreaCode", e.target.value)}
                disabled={disabled}
                className="input-drafting input-drafting-sm w-20 bg-transparent appearance-none cursor-pointer"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
                <option value="+63">+63</option>
                <option value="+65">+65</option>
                <option value="+81">+81</option>
                <option value="+86">+86</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="text"
                value={value.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                disabled={disabled}
                placeholder="Phone Number"
                className="input-drafting input-drafting-sm flex-1"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">Email</label>
            <input
              type="email"
              value={value.email}
              onChange={(e) => update("email", e.target.value)}
              disabled={disabled}
              placeholder="hello@example.com"
              className="input-drafting input-drafting-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">GitHub</label>
            <input
              type="text"
              value={value.github}
              onChange={(e) => update("github", e.target.value)}
              disabled={disabled}
              placeholder="https://github.com/username"
              className="input-drafting input-drafting-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">LinkedIn</label>
            <input
              type="text"
              value={value.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              disabled={disabled}
              placeholder="https://linkedin.com/in/username"
              className="input-drafting input-drafting-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">Website</label>
            <input
              type="text"
              value={value.website}
              onChange={(e) => update("website", e.target.value)}
              disabled={disabled}
              placeholder="https://yoursite.dev"
              className="input-drafting input-drafting-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label">Hobbies</label>
            <input
              type="text"
              value={value.hobbies || ""}
              onChange={(e) => update("hobbies", e.target.value)}
              disabled={disabled}
              placeholder="Photography, Keyboards, Hiking"
              className="input-drafting input-drafting-sm"
            />
          </div>
        </div>

        {/* Serial Number */}
        <div className="font-mono text-[10px] text-[var(--color-outline)] tracking-[0.15em] w-full text-center border-t border-[var(--color-outline-variant)] pt-3 mt-1 z-10">
          SN: RF-0000-BETA
        </div>
      </div>
    </section>
  );
}
