import { notFound } from 'next/navigation';
import { getFruitById } from '../../../database/fruits';
import { getCookie } from '../../../util/cookies';
import { parseJson } from '../../../util/json';
import { rootNotFoundMetadata } from '../../not-found';
import FruitCommentForm from './FruitCommentForm';

// export const fruits = [
//   { id: 1, name: 'Banana', icon: '🍌' },
//   { id: 2, name: 'Coconuts', icon: '🥥' },
//   { id: 3, name: 'Papaya', icon: '🥔' },
//   { id: 4, name: 'Mango', icon: '🥭' },
//   { id: 5, name: 'Avocado', icon: '🥑' },
// ];

export function generateMetadata({ params }) {
  const fruit = getFruitById(Number(params.fruitId));

  if (!fruit) {
    return rootNotFoundMetadata;
  }

  return {
    title: fruit.name,
    description: `Single fruit page for ${fruit.name}`,
  };
}

// we add this only if we have no dynamic function as cookies or headers
export const dynamic = 'force-dynamic';

export default function FruitPage({ params }) {
  const fruit = getFruitById(params.fruitName);

  if (!fruit) {
    notFound();
  }

  const fruitComments = parseJson(getCookie('fruitComments'));

  const currentComments = Array.isArray(fruitComments) ? fruitComments : [];

  const fruitComment = currentComments.find(
    (singleFruitComment) => singleFruitComment.id === fruit.id,
  );

  return (
    <>
      <h1>{params.fruitName}</h1>
      <span
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {fruitComment?.comment ||
          `Please type something about the ${params.fruitName}`}
      </span>
      <FruitCommentForm
        fruitComment={fruitComment?.comment || ''}
        fruitId={fruit.id}
      />
    </>
  );
}