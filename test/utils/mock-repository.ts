// test/utils/mock-repository.ts
export const mockRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });