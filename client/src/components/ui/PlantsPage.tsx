import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import Header from "../Header";

export default function PlantsPage({ category }: { category: string }) {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get("/api/plants");
        if (Array.isArray(response.data.items)) {
          const filteredPlants = response.data.items.filter(
            (plant: any) => plant.category === category
          );
          setPlants(filteredPlants);
        } else {
          setError("Invalid data format received.");
        }
      } catch (error) {
        // Handle any errors (e.g., log them)
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [category]);

  const handleSort = (field: string) => {
    const sortedPlants = [...plants].sort((a, b) => {
      if (field === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (field === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });
    setPlants(sortedPlants);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Функция для правильного форматирования заголовка
  const formatCategoryTitle = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <section className="container mx-auto mt-20 p-8">
        {/* Заголовок с первой заглавной буквой */}
        <div className="flex flex-col gap-8 mb-8">
          <h1 className="text-4xl font-semibold text-center text-emerald-50">
            {formatCategoryTitle(category)} Plants
          </h1>
          <p className="text-lg text-white text-center">
            Discover a wide variety of {category.toLowerCase()} plants perfect for your home.
          </p>
        </div>

        {/* Фильтрация и сортировка */}
        <div className="text-center mb-8">
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg mr-4"
            onClick={() => handleSort("name")}
          >
            Sort by Name
          </button>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleSort("price")}
          >
            Sort by Price
          </button>
        </div>

        {/* Карточки растений */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {plants.map((plant) => (
            <Card
              key={plant._id}
              plant={plant}
              isInCart={false}
              quantity={0}
              isAuthenticated={true}
            />
          ))}
        </div>
      </section>
    </>
  );
}
