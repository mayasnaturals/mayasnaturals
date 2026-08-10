export const metadata = {
  title: "Admin Panel | Mayas",
  description: "Secure admin dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500 selection:text-white">
      {children}
    </div>
  );
}
