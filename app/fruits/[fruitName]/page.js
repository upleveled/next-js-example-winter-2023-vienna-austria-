import { notFound } from 'next/navigation';
import { fruits } from '../../../database/fruits';
import { rootNotFoundMetadata } from '../../not-found';
import Fruit from './Fruit';

// export const fruits = [
//   { id: 1, name: 'Banana', icon: '🍌' },
//   { id: 2, name: 'Coconuts', icon: '🥥' },
//   { id: 3, name: 'Papaya', icon: '🥔' },
//   { id: 4, name: 'Mango', icon: '🥭' },
//   { id: 5, name: 'Avocado', icon: '🥑' },
// ];

// eslint-disable-next-line require-await
export async function generateMetadata({ params }) {
  const singleFruit = fruits.find((fruit) => {
    return fruit.name.toLowerCase() === params.fruitName;
  });

  if (!singleFruit) {
    return rootNotFoundMetadata;
  }

  return {
    title: `${singleFruit.name} | AnimalsRUs`,
    description: `Single animal page for ${singleFruit.name}`,
    icons: {
      shortcut: '/favicon.ico',
    },
  };
}

// we add this only if we have no dynamic function as cookies or headers
export const dynamic = 'force-dynamic';

export default function FruitPage({ params }) {
  const singleFruit = fruits.find((fruit) => {
    return fruit.name.toLowerCase() === params.fruitName;
  });

  if (!singleFruit) {
    notFound();
  }

  return <Fruit fruit={singleFruit} />;
}
