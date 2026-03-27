"use client";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="mb-10 block">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 drop-shadow-sm">{title}</h1>
          {description && (
            <p className="mt-2 text-sm font-medium text-gray-500">{description}</p>
          )}
        </div>
        {action && <div className="ml-4 shrink-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">{action}</div>}
      </div>
      <div className="mt-6 flex items-center">
        <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-[#09418C] to-[#09418C]/60" />
        <div className="ml-2 h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
      </div>
    </div>
  );
}
