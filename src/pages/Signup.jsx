export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-heading text-center text-primary mb-6">Sign Up</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-md" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-md" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-md" />
          <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">Create Account</button>
        </form>
      </div>
    </div>
  );
}
