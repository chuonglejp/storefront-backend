import { Sample, SampleStore } from '../../models/product';

const store = new SampleStore();

describe('Sample model test', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have an show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have an create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an delete method', () => {
    expect(store.delete).toBeDefined();
  });

  let id: number;
  it('create method', async () => {
    const result = await store.create({ value: 'first sample' });
    id = result.id || 0;
    expect('first sample').toEqual(result.value);
  });

  it('index method', async () => {
    const result = await store.index();
    expect(result.length).toEqual(1);
  });

  it('show method', async () => {
    const result = await store.show(id);
    expect('first sample').toEqual(result.value);
  });

  it('delete method', async () => {
    const result = await store.delete(id);
    expect('first sample').toEqual(result.value);
  });
});