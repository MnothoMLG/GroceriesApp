import { call, put } from 'redux-saga/effects';
import { fetchProductsSuccess } from './actions';
import { fetchProducts, mockFetchProducts } from './sagas';
import { IProduct } from '@constants/types';

describe('character sagas grocery products', () => {
  it('fetches products through the mock API and stores them', () => {
    const products: Array<IProduct> = [
      {
        id: 1,
        name: 'Apples',
        price: 1.2,
        quantity_available: 150,
        image: 'https://placehold.co/200x200/png?text=apples',
      },
    ];
    const generator = fetchProducts();

    expect(generator.next().value).toEqual(call(mockFetchProducts));
    expect(generator.next(products).value).toEqual(
      put(fetchProductsSuccess({ products }))
    );
    expect(generator.next().done).toBe(true);
  });
});
