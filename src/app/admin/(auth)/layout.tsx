export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#140f07] flex items-center justify-center px-6">
      {children}
    </div>
  );
}
