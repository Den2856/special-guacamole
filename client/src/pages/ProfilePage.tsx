import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Spinner from "../components/ui/Spinner";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получаем данные профиля с бекенда
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token"); // Получаем токен из localStorage
        if (!token) {
          setError("User is not authenticated.");
          return;
        }
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }, // Передаем токен в заголовке
        });
        setProfile(response.data); // Устанавливаем данные профиля
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <section className="container mx-auto p-8 mt-20">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-semibold text-center text-emerald-50">
            {profile.name}'s Profile
          </h1>
          <p className="text-lg text-gray-300 text-center">
            View and edit your profile details.
          </p>
        </div>

        {/* Карточка профиля */}
        <div className="bg-white/10 p-8 rounded-xl shadow-lg mt-8 backdrop-blur-md">
          <div className="flex gap-6 items-center">
            <img
              src="/avatars/user.jpeg"
              alt="User Avatar"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">{profile.name}</h2>
              <p className="text-md text-gray-300">{profile.email}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
