import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { api } from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodData {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export type FoodInput = Omit<FoodData, 'id' | 'available'>;

// interface DashboardProps { //naoooooo
//   foods: FoodProps[];
//   editingFood: boolean;
//   modalOpen: () => void;
//   editModalOpen: () => void
// }

export function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     foods: [],
  //     editingFood: {},
  //     modalOpen: false,
  //     editModalOpen: false,
  //   }
  // }

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get('/foods');
      setFoods(data);
    }
    fetchData()
  }, []);

  // async componentDidMount() {
  //   const response = await api.get('/foods');

  //   this.setState({ foods: response.data });
  // }

  const handleAddFood = async (food: FoodInput) => {
    // const { foods } = this.state;

    try {
      const { data: newFood } = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, newFood]);
      // setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodInput) => {
    // const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
      // this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    // const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
    // this.setState({ foods: foodsFiltered });
  }

  const toggleModal = () => {
    // const { modalOpen } = this.state;
    setModalOpen(!modalOpen);

    // this.setState({ modalOpen: !modalOpen });
  }

  const toggleEditModal = () => {
    // const { editModalOpen } = this.state;
    setEditModalOpen(!editModalOpen)
    // this.setState({ editModalOpen: !editModalOpen });
  }

  const handleEditFood = (food: FoodData) => {
    // this.setState({ editingFood: food, editModalOpen: true });
    setEditingFood(food);
    setEditModalOpen(true);
  }

  // render() {
  //   const { modalOpen, editModalOpen, editingFood, foods } = this.state;

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
          foods.map(food => (
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
  // }
};
