import { useEffect, useState } from "react";
import api from "../services/api";
import { Header } from "../components/Header";
import { ModalAddFood } from "../components/ModalAddFood";
import {Food} from '../components/Food';
import { FoodsContainer } from './styles';
import { ModalEditFood } from "../components/ModalEditFood"

interface Product {
  available: boolean;
  description: string;
  id: number;
  image: string;
  name: string;
  price: string;
}

export function Dashboard() {
  const [foods, setFood] = useState<Product[]>([]);
  const [editingFood, setEditingFood] = useState<Product>({} as Product);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get("/foods").then((response) => setFood(response.data));
  }, []);

  async function handleAddFood(food: Product) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFood((oldValue) => [...oldValue, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Product) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFood(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFood(foodsFiltered);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function handleEditFood(food: Product) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
